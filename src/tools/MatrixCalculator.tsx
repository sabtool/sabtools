"use client";
import { useState, useMemo } from "react";

type Matrix = number[][];

function createMatrix(size: number): Matrix {
  return Array.from({ length: size }, () => Array(size).fill(0));
}

function addM(a: Matrix, b: Matrix): Matrix {
  return a.map((row, i) => row.map((v, j) => v + b[i][j]));
}

function subM(a: Matrix, b: Matrix): Matrix {
  return a.map((row, i) => row.map((v, j) => v - b[i][j]));
}

function mulM(a: Matrix, b: Matrix): Matrix {
  const n = a.length;
  const result = createMatrix(n);
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++)
      for (let k = 0; k < n; k++)
        result[i][j] += a[i][k] * b[k][j];
  return result;
}

function transposeM(m: Matrix): Matrix {
  return m[0].map((_, j) => m.map((row) => row[j]));
}

function determinant(m: Matrix): number {
  const n = m.length;
  if (n === 1) return m[0][0];
  if (n === 2) return m[0][0] * m[1][1] - m[0][1] * m[1][0];
  let det = 0;
  for (let j = 0; j < n; j++) {
    const minor = m.slice(1).map((row) => [...row.slice(0, j), ...row.slice(j + 1)]);
    det += (j % 2 === 0 ? 1 : -1) * m[0][j] * determinant(minor);
  }
  return det;
}

function inverseM(m: Matrix): Matrix | null {
  const n = m.length;
  const det = determinant(m);
  if (Math.abs(det) < 1e-10) return null;
  const cofactors: Matrix = createMatrix(n);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const minor = m.filter((_, ri) => ri !== i).map((row) => row.filter((_, ci) => ci !== j));
      cofactors[i][j] = ((i + j) % 2 === 0 ? 1 : -1) * determinant(minor);
    }
  }
  const adjugate = transposeM(cofactors);
  return adjugate.map((row) => row.map((v) => v / det));
}

export default function MatrixCalculator() {
  const [size, setSize] = useState(2);
  const [matA, setMatA] = useState<Matrix>(createMatrix(2));
  const [matB, setMatB] = useState<Matrix>(createMatrix(2));
  const [operation, setOperation] = useState("add");

  const changeSize = (s: number) => {
    setSize(s);
    setMatA(createMatrix(s));
    setMatB(createMatrix(s));
  };

  const updateCell = (which: "A" | "B", i: number, j: number, val: string) => {
    const setter = which === "A" ? setMatA : setMatB;
    setter((prev) => {
      const copy = prev.map((r) => [...r]);
      copy[i][j] = parseFloat(val) || 0;
      return copy;
    });
  };

  const result = useMemo(() => {
    try {
      switch (operation) {
        case "add": return { matrix: addM(matA, matB), label: "A + B" };
        case "subtract": return { matrix: subM(matA, matB), label: "A - B" };
        case "multiply": return { matrix: mulM(matA, matB), label: "A x B" };
        case "transpose_a": return { matrix: transposeM(matA), label: "Transpose(A)" };
        case "transpose_b": return { matrix: transposeM(matB), label: "Transpose(B)" };
        case "determinant_a": return { scalar: determinant(matA), label: "det(A)" };
        case "determinant_b": return { scalar: determinant(matB), label: "det(B)" };
        case "inverse_a": { const inv = inverseM(matA); return inv ? { matrix: inv, label: "A\u207B\u00B9" } : { error: "Matrix A is singular (det=0), no inverse exists.", label: "A\u207B\u00B9" }; }
        case "inverse_b": { const inv = inverseM(matB); return inv ? { matrix: inv, label: "B\u207B\u00B9" } : { error: "Matrix B is singular (det=0), no inverse exists.", label: "B\u207B\u00B9" }; }
        default: return null;
      }
    } catch { return { error: "Calculation error" }; }
  }, [matA, matB, operation, size]);

  const MatrixInput = ({ label, mat, which }: { label: string; mat: Matrix; which: "A" | "B" }) => (
    <div>
      <h3 className="text-sm font-bold text-gray-700 mb-2">Matrix {label}</h3>
      <div className="inline-grid gap-1" style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}>
        {Array.from({ length: size }, (_, i) =>
          Array.from({ length: size }, (_, j) => (
            <input
              key={`${i}-${j}`}
              type="number"
              value={mat[i][j] || ""}
              onChange={(e) => updateCell(which, i, j, e.target.value)}
              className="calc-input w-16 text-center"
            />
          ))
        )}
      </div>
    </div>
  );

  const MatrixDisplay = ({ mat }: { mat: Matrix }) => (
    <div className="inline-grid gap-1" style={{ gridTemplateColumns: `repeat(${mat[0].length}, 1fr)` }}>
      {mat.flat().map((v, idx) => (
        <span key={idx} className="bg-indigo-50 px-3 py-1 rounded text-center font-mono text-sm">
          {parseFloat(v.toFixed(4))}
        </span>
      ))}
    </div>
  );

  const ops = [
    { value: "add", label: "Add (A+B)" },
    { value: "subtract", label: "Subtract (A-B)" },
    { value: "multiply", label: "Multiply (AxB)" },
    { value: "transpose_a", label: "Transpose A" },
    { value: "transpose_b", label: "Transpose B" },
    { value: "determinant_a", label: "Determinant A" },
    { value: "determinant_b", label: "Determinant B" },
    { value: "inverse_a", label: "Inverse A" },
    { value: "inverse_b", label: "Inverse B" },
  ];

  return (
    <div className="space-y-5">
      <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
        <h3 className="text-sm font-bold text-gray-700 mb-3">Matrix Size</h3>
        <div className="flex gap-2">
          {[2, 3, 4].map((s) => (
            <button key={s} onClick={() => changeSize(s)} className={s === size ? "btn-primary" : "btn-secondary"}>
              {s}x{s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
          <MatrixInput label="A" mat={matA} which="A" />
        </div>
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
          <MatrixInput label="B" mat={matB} which="B" />
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
        <h3 className="text-sm font-bold text-gray-700 mb-3">Operation</h3>
        <div className="flex flex-wrap gap-2">
          {ops.map((op) => (
            <button
              key={op.value}
              onClick={() => setOperation(op.value)}
              className={operation === op.value ? "btn-primary text-xs" : "btn-secondary text-xs"}
            >
              {op.label}
            </button>
          ))}
        </div>
      </div>

      {result && (
        <div className="result-card">
          <h3 className="text-sm font-bold text-gray-700 mb-3">Result: {(result as { label?: string }).label}</h3>
          {"error" in result && <p className="text-red-500 text-sm">{(result as { error: string }).error}</p>}
          {"scalar" in result && (
            <p className="text-2xl font-bold text-indigo-600">{parseFloat(((result as { scalar: number }).scalar).toFixed(6))}</p>
          )}
          {"matrix" in result && <MatrixDisplay mat={(result as { matrix: Matrix }).matrix} />}
        </div>
      )}
    </div>
  );
}
