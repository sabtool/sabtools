"use client";
import { useState, useMemo } from "react";

interface PlanetData {
  name: string;
  orbitalPeriod: number; // in Earth days
  emoji: string;
  color: string;
  fact: string;
}

const PLANETS: PlanetData[] = [
  { name: "Mercury", orbitalPeriod: 87.97, emoji: "☿", color: "from-gray-400 to-gray-500", fact: "Closest to the Sun. A day on Mercury (176 Earth days) is longer than its year!" },
  { name: "Venus", orbitalPeriod: 224.7, emoji: "♀", color: "from-yellow-400 to-orange-400", fact: "Hottest planet due to greenhouse effect. It rotates backwards compared to most planets." },
  { name: "Earth", orbitalPeriod: 365.25, emoji: "🌍", color: "from-blue-400 to-green-500", fact: "Our home planet. The only known planet with liquid water on the surface." },
  { name: "Mars", orbitalPeriod: 687.0, emoji: "♂", color: "from-red-400 to-red-600", fact: "The Red Planet. Home to Olympus Mons, the tallest volcano in the solar system." },
  { name: "Jupiter", orbitalPeriod: 4332.59, emoji: "♃", color: "from-orange-300 to-amber-600", fact: "Largest planet. Its Great Red Spot is a storm bigger than Earth!" },
  { name: "Saturn", orbitalPeriod: 10759.22, emoji: "♄", color: "from-yellow-300 to-amber-500", fact: "Famous for its rings. It is so light it could float in water (if you had a big enough pool)." },
  { name: "Uranus", orbitalPeriod: 30688.5, emoji: "⛢", color: "from-cyan-300 to-teal-500", fact: "Rotates on its side! It was the first planet discovered using a telescope." },
  { name: "Neptune", orbitalPeriod: 60182.0, emoji: "♆", color: "from-blue-500 to-indigo-600", fact: "Farthest planet. Winds on Neptune can reach speeds of 2,100 km/h!" },
];

export default function AgeOnPlanetCalculator() {
  const [dob, setDob] = useState("");

  const results = useMemo(() => {
    if (!dob) return null;

    const birthDate = new Date(dob);
    const now = new Date();
    if (birthDate >= now) return null;

    const earthDaysAlive = (now.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24);
    const earthYearsAlive = earthDaysAlive / 365.25;

    return PLANETS.map((planet) => {
      const planetAge = earthDaysAlive / planet.orbitalPeriod;
      const completedOrbits = Math.floor(planetAge);
      const fractionIntoCurrentYear = planetAge - completedOrbits;

      // Next birthday: days remaining in current orbital year
      const daysRemaining = (1 - fractionIntoCurrentYear) * planet.orbitalPeriod;
      const nextBirthday = new Date(now.getTime() + daysRemaining * 24 * 60 * 60 * 1000);

      return {
        ...planet,
        age: planetAge,
        completedOrbits,
        fraction: fractionIntoCurrentYear,
        daysRemaining: Math.round(daysRemaining),
        nextBirthday,
      };
    });
  }, [dob]);

  const earthDaysAlive = dob
    ? (new Date().getTime() - new Date(dob).getTime()) / (1000 * 60 * 60 * 24)
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Your Date of Birth</label>
        <input
          type="date"
          value={dob}
          max={new Date().toISOString().split("T")[0]}
          onChange={(e) => setDob(e.target.value)}
          className="calc-input"
        />
      </div>

      {results && (
        <>
          <div className="result-card text-center">
            <p className="text-sm text-gray-500">You have been alive for</p>
            <p className="text-3xl font-extrabold text-indigo-600">{Math.floor(earthDaysAlive).toLocaleString("en-IN")} Earth Days</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {results.map((planet) => (
              <div key={planet.name} className={`bg-white rounded-xl border border-gray-200 overflow-hidden ${planet.name === "Earth" ? "ring-2 ring-blue-300" : ""}`}>
                {/* Planet header with gradient */}
                <div className={`bg-gradient-to-r ${planet.color} px-4 py-3 flex items-center justify-between`}>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{planet.emoji}</span>
                    <span className="text-white font-bold text-lg">{planet.name}</span>
                  </div>
                  <span className="text-white/80 text-xs">{planet.orbitalPeriod.toLocaleString()} Earth days/year</span>
                </div>

                <div className="p-4 space-y-3">
                  {/* Age */}
                  <div className="text-center">
                    <div className="text-3xl font-extrabold text-gray-800">
                      {planet.age.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">{planet.name} years old</div>
                  </div>

                  {/* Progress bar for current year */}
                  <div>
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Year {planet.completedOrbits + 1} progress</span>
                      <span>{(planet.fraction * 100).toFixed(1)}%</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${planet.color} transition-all duration-500`}
                        style={{ width: `${planet.fraction * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Next birthday */}
                  <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <div className="text-xs text-gray-500">Next {planet.name} birthday in</div>
                    <div className="text-sm font-bold text-indigo-600">
                      {planet.daysRemaining.toLocaleString("en-IN")} Earth days
                    </div>
                    <div className="text-xs text-gray-400">
                      ({planet.nextBirthday.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })})
                    </div>
                  </div>

                  {/* Fun fact */}
                  <p className="text-xs text-gray-500 italic">{planet.fact}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Summary table */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 overflow-x-auto">
            <h3 className="text-sm font-bold text-gray-700 mb-3">Quick Summary</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 text-gray-600">Planet</th>
                  <th className="text-right py-2 text-gray-600">Your Age</th>
                  <th className="text-right py-2 text-gray-600">Completed Orbits</th>
                  <th className="text-right py-2 text-gray-600">Days to Birthday</th>
                </tr>
              </thead>
              <tbody>
                {results.map((planet) => (
                  <tr key={planet.name} className={`border-b border-gray-100 ${planet.name === "Earth" ? "bg-blue-50" : ""}`}>
                    <td className="py-2 font-medium">{planet.emoji} {planet.name}</td>
                    <td className="py-2 text-right font-bold text-indigo-600">{planet.age.toFixed(2)} yrs</td>
                    <td className="py-2 text-right">{planet.completedOrbits}</td>
                    <td className="py-2 text-right">{planet.daysRemaining.toLocaleString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {!results && dob && (
        <div className="text-center text-red-500 text-sm">Please enter a valid date of birth in the past.</div>
      )}
    </div>
  );
}
