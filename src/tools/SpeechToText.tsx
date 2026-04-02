"use client";
import { useState, useRef, useEffect } from "react";

export default function SpeechToText() {
  const [transcript, setTranscript] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef<ReturnType<typeof createRecognition> | null>(null);

  function createRecognition() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SpeechRecognition) return null;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    return recognition;
  }

  useEffect(() => {
    const SpeechRecognition =
      (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition ||
      (window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition;
    if (!SpeechRecognition) setSupported(false);
  }, []);

  const startListening = () => {
    const recognition = createRecognition();
    if (!recognition) return;
    recognitionRef.current = recognition;
    let finalTranscript = transcript;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += t + " ";
        } else {
          interim += t;
        }
      }
      setTranscript(finalTranscript + interim);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
    setIsListening(true);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const copyText = () => {
    navigator.clipboard?.writeText(transcript);
  };

  if (!supported) {
    return (
      <div className="result-card text-center">
        <p className="text-red-600 font-semibold">Speech Recognition is not supported in your browser.</p>
        <p className="text-sm text-gray-500 mt-2">Please try Chrome, Edge, or Safari.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center gap-4">
        {isListening && (
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
            </span>
            <span className="text-red-600 font-semibold text-sm animate-pulse">Listening...</span>
          </div>
        )}
      </div>

      <textarea
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
        placeholder="Transcribed text will appear here..."
        className="calc-input min-h-[200px] resize-y font-mono text-sm"
        rows={8}
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
          <div className="text-xs font-medium text-gray-500">Words</div>
          <div className="text-2xl font-extrabold text-indigo-600 mt-1">
            {transcript.trim() ? transcript.trim().split(/\s+/).length : 0}
          </div>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
          <div className="text-xs font-medium text-gray-500">Characters</div>
          <div className="text-2xl font-extrabold text-purple-600 mt-1">{transcript.length}</div>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
          <div className="text-xs font-medium text-gray-500">Status</div>
          <div className={`text-lg font-extrabold mt-1 ${isListening ? "text-red-600" : "text-gray-400"}`}>
            {isListening ? "Recording" : "Stopped"}
          </div>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        {!isListening ? (
          <button onClick={startListening} className="btn-primary text-sm !py-2 !px-4">
            Start Recording
          </button>
        ) : (
          <button onClick={stopListening} className="btn-secondary text-sm !py-2 !px-4 !border-red-300 !text-red-600">
            Stop Recording
          </button>
        )}
        <button onClick={copyText} className="btn-secondary text-sm !py-2 !px-4" disabled={!transcript}>
          Copy Text
        </button>
        <button onClick={() => setTranscript("")} className="btn-secondary text-sm !py-2 !px-4" disabled={!transcript}>
          Clear
        </button>
      </div>
    </div>
  );
}
