"use client";
import { useState, useMemo, useRef } from "react";

function isPrime(n: number): boolean {
  if (n < 2) return false;
  if (n < 4) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }
  return true;
}

function primeFactors(n: number): number[] {
  if (n < 2) return [];
  const factors: number[] = [];
  let num = n;
  for (let d = 2; d * d <= num; d++) {
    while (num % d === 0) { factors.push(d); num /= d; }
  }
  if (num > 1) factors.push(num);
  return factors;
}

function nextPrime(n: number): number {
  let c = n + 1;
  while (!isPrime(c)) c++;
  return c;
}

function prevPrime(n: number): number | null {
  let c = n - 1;
  while (c >= 2 && !isPrime(c)) c--;
  return c >= 2 ? c : null;
}

function sieve(limit: number): boolean[] {
  const arr = new Array(limit + 1).fill(true);
  arr[0] = arr[1] = false;
  for (let i = 2; i * i <= limit; i++) {
    if (arr[i]) {
      for (let j = i * i; j <= limit; j += i) arr[j] = false;
    }
  }
  return arr;
}

export default function PrimeNumberChecker() {
  const [num, setNum] = useState("");
  const [genLimit, setGenLimit] = useState("100");
  const [showSieve, setShowSieve] = useState(false);
  const sieveRef = useRef<boolean[] | null>(null);

  const checkResult = useMemo(() => {
    const n = parseInt(num);
    if (isNaN(n) || n < 0) return null;
    return {
      isPrime: isPrime(n),
      factors: primeFactors(n),
      next: nextPrime(n),
      prev: prevPrime(n),
    };
  }, [num]);

  const generatedPrimes = useMemo(() => {
    const limit = parseInt(genLimit);
    if (isNaN(limit) || limit < 2 || limit > 100000) return [];
    const s = sieve(limit);
    sieveRef.current = s;
    return s.map((v, i) => (v ? i : -1)).filter((i) => i >= 2);
  }, [genLimit]);

  const first100 = useMemo(() => {
    const s = sieve(550);
    return s.map((v, i) => (v ? i : -1)).filter((i) => i >= 2).slice(0, 100);
  }, []);

  const sieveLimit = Math.min(parseInt(genLimit) || 100, 200);
  const sieveData = useMemo(() => {
    if (!showSieve) return null;
    return sieve(sieveLimit);
  }, [showSieve, sieveLimit]);

  return (
    <div className="space-y-5">
      <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
        <h3 className="text-sm font-bold text-gray-700 mb-3">Check a Number</h3>
        <input
          type="number"
          value={num}
          onChange={(e) => setNum(e.target.value)}
          placeholder="Enter a number"
          className="calc-input w-full"
        />
      </div>

      {checkResult && (
        <div className="result-card">
          <div className="flex items-center gap-3 mb-4">
            <span className={`text-3xl font-bold ${checkResult.isPrime ? "text-green-600" : "text-red-500"}`}>
              {parseInt(num)}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-bold text-white ${checkResult.isPrime ? "bg-green-500" : "bg-red-500"}`}>
              {checkResult.isPrime ? "PRIME" : "NOT PRIME"}
            </span>
          </div>

          {checkResult.factors.length > 0 && (
            <div className="mb-3">
              <p className="text-sm text-gray-500">Prime Factorization:</p>
              <p className="text-lg font-bold text-indigo-600">
                {parseInt(num)} = {checkResult.factors.join(" \u00D7 ")}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            {checkResult.prev !== null && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-500">Previous Prime</p>
                <p className="text-xl font-bold text-indigo-600">{checkResult.prev}</p>
              </div>
            )}
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-500">Next Prime</p>
              <p className="text-xl font-bold text-indigo-600">{checkResult.next}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
        <h3 className="text-sm font-bold text-gray-700 mb-3">Generate Primes up to N</h3>
        <div className="flex items-center gap-3">
          <input
            type="number"
            value={genLimit}
            onChange={(e) => setGenLimit(e.target.value)}
            placeholder="e.g. 100"
            className="calc-input w-32"
          />
          <span className="text-sm text-gray-500">{generatedPrimes.length} primes found</span>
        </div>
        {generatedPrimes.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1 max-h-40 overflow-y-auto">
            {generatedPrimes.map((p) => (
              <span key={p} className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-xs font-mono">{p}</span>
            ))}
          </div>
        )}
      </div>

      <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-gray-700">Sieve of Eratosthenes Visualization</h3>
          <button onClick={() => setShowSieve(!showSieve)} className="btn-primary text-xs">
            {showSieve ? "Hide" : "Show"} Sieve
          </button>
        </div>
        {showSieve && sieveData && (
          <div className="grid grid-cols-10 gap-1">
            {sieveData.slice(2).map((prime, idx) => {
              const n = idx + 2;
              return (
                <div
                  key={n}
                  className={`w-full aspect-square flex items-center justify-center rounded text-xs font-mono ${
                    prime ? "bg-green-100 text-green-700 font-bold" : "bg-red-50 text-red-300"
                  }`}
                >
                  {n}
                </div>
              );
            })}
          </div>
        )}
        {showSieve && (
          <div className="flex gap-4 mt-2 text-xs text-gray-500">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-100 inline-block" /> Prime</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-50 inline-block" /> Not Prime</span>
          </div>
        )}
      </div>

      <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
        <h3 className="text-sm font-bold text-gray-700 mb-3">First 100 Primes</h3>
        <div className="flex flex-wrap gap-1">
          {first100.map((p) => (
            <span key={p} className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-xs font-mono">{p}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
