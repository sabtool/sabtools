/**
 * Web-worker-backed image compression.
 *
 * Moves `canvas.toBlob()` and its paint step off the main thread (report §2.3,
 * "INP is where most sites fail"). Uses OffscreenCanvas inside a Worker so the
 * UI stays responsive even when compressing a 20 MB photo on a mid-range
 * Android device.
 *
 * No bundler config needed — the worker is declared as a string, turned into a
 * Blob URL at runtime, and the Worker is spawned from there. This keeps the
 * static-export build simple.
 *
 * Fallback: if the browser doesn't support OffscreenCanvas / createImageBitmap
 * (uncommon in 2026), the code falls back to main-thread compression and the
 * page still works — just with the old INP profile.
 */

const workerSource = `
self.onmessage = async (e) => {
  const { id, bitmap, quality, mimeType } = e.data;
  try {
    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(bitmap, 0, 0);
    bitmap.close();
    const blob = await canvas.convertToBlob({ type: mimeType || "image/jpeg", quality });
    self.postMessage({ id, blob });
  } catch (err) {
    self.postMessage({ id, error: String(err && err.message || err) });
  }
};
`;

let workerUrl: string | null = null;
let worker: Worker | null = null;
let requestId = 0;
const pending = new Map<
  number,
  { resolve: (blob: Blob) => void; reject: (err: Error) => void }
>();

function supportsOffscreenCompression() {
  if (typeof window === "undefined") return false;
  return (
    typeof OffscreenCanvas !== "undefined" &&
    typeof createImageBitmap === "function" &&
    typeof Worker !== "undefined"
  );
}

function getWorker(): Worker | null {
  if (!supportsOffscreenCompression()) return null;
  if (worker) return worker;
  try {
    const blob = new Blob([workerSource], { type: "application/javascript" });
    workerUrl = URL.createObjectURL(blob);
    worker = new Worker(workerUrl);
    worker.onmessage = (e: MessageEvent) => {
      const { id, blob: resultBlob, error } = e.data as {
        id: number;
        blob?: Blob;
        error?: string;
      };
      const req = pending.get(id);
      if (!req) return;
      pending.delete(id);
      if (error) req.reject(new Error(error));
      else if (resultBlob) req.resolve(resultBlob);
    };
    worker.onerror = () => {
      pending.forEach((req) => req.reject(new Error("Worker crashed")));
      pending.clear();
      worker?.terminate();
      worker = null;
    };
    return worker;
  } catch {
    return null;
  }
}

/**
 * Main-thread fallback using a regular <canvas> + toBlob.
 * Only used if the browser can't spin up an OffscreenCanvas worker.
 */
function mainThreadFallback(file: File, quality: number, mimeType: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas 2D context unavailable"));
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          (blob) => (blob ? resolve(blob) : reject(new Error("toBlob returned null"))),
          mimeType,
          quality
        );
      };
      img.onerror = () => reject(new Error("Image failed to load"));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("File read failed"));
    reader.readAsDataURL(file);
  });
}

export async function compressImage(
  file: File,
  quality: number,
  mimeType: string = "image/jpeg"
): Promise<Blob> {
  const w = getWorker();
  if (!w) {
    return mainThreadFallback(file, quality, mimeType);
  }

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    return mainThreadFallback(file, quality, mimeType);
  }

  return new Promise<Blob>((resolve, reject) => {
    const id = ++requestId;
    pending.set(id, { resolve, reject });
    try {
      w.postMessage({ id, bitmap, quality, mimeType }, [bitmap]);
    } catch (err) {
      pending.delete(id);
      reject(err instanceof Error ? err : new Error(String(err)));
    }
  });
}
