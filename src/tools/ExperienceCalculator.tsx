"use client";
import { useState, useMemo } from "react";

interface Job {
  id: number;
  company: string;
  startDate: string;
  endDate: string;
  isPresent: boolean;
}

export default function ExperienceCalculator() {
  const [jobs, setJobs] = useState<Job[]>([{ id: Date.now(), company: "", startDate: "", endDate: "", isPresent: false }]);

  const addJob = () => setJobs([...jobs, { id: Date.now(), company: "", startDate: "", endDate: "", isPresent: false }]);
  const removeJob = (id: number) => setJobs(jobs.filter(j => j.id !== id));
  const updateJob = (id: number, field: keyof Job, value: string | boolean) =>
    setJobs(jobs.map(j => j.id === id ? { ...j, [field]: value } : j));

  const result = useMemo(() => {
    const validJobs = jobs.filter(j => j.startDate && (j.endDate || j.isPresent));
    if (validJobs.length === 0) return null;

    const today = new Date();
    const jobDurations = validJobs.map(j => {
      const start = new Date(j.startDate);
      const end = j.isPresent ? today : new Date(j.endDate);
      const totalDays = Math.max(0, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
      const years = Math.floor(totalDays / 365.25);
      const months = Math.floor((totalDays % 365.25) / 30.44);
      const days = Math.floor(totalDays % 30.44);
      return { ...j, start, end, totalDays, years, months, days };
    });

    // Handle overlapping periods for total experience
    const intervals = jobDurations.map(j => ({ start: j.start.getTime(), end: j.end.getTime() })).sort((a, b) => a.start - b.start);

    const merged: { start: number; end: number }[] = [];
    for (const interval of intervals) {
      if (merged.length === 0 || merged[merged.length - 1].end < interval.start) {
        merged.push({ ...interval });
      } else {
        merged[merged.length - 1].end = Math.max(merged[merged.length - 1].end, interval.end);
      }
    }

    const totalMergedDays = merged.reduce((sum, m) => sum + Math.ceil((m.end - m.start) / (1000 * 60 * 60 * 24)), 0);
    const totalYears = Math.floor(totalMergedDays / 365.25);
    const totalMonths = Math.floor((totalMergedDays % 365.25) / 30.44);
    const totalDays = Math.floor(totalMergedDays % 30.44);

    const hasOverlap = merged.length < intervals.length;

    return { jobDurations, totalYears, totalMonths, totalDays, totalMergedDays, hasOverlap };
  }, [jobs]);

  const fmtDate = (d: Date) => d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  return (
    <div className="space-y-6">
      {/* Job entries */}
      {jobs.map((job, idx) => (
        <div key={job.id} className="bg-gray-50 rounded-xl p-4 space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-gray-700">Job {idx + 1}</h3>
            {jobs.length > 1 && <button onClick={() => removeJob(job.id)} className="btn-secondary text-xs">Remove</button>}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Company Name</label>
              <input type="text" placeholder="e.g. TCS" value={job.company} onChange={e => updateJob(job.id, "company", e.target.value)} className="calc-input" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Start Date</label>
              <input type="date" value={job.startDate} onChange={e => updateJob(job.id, "startDate", e.target.value)} className="calc-input" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">End Date</label>
              <div className="flex gap-2 items-center">
                <input type="date" value={job.endDate} onChange={e => updateJob(job.id, "endDate", e.target.value)} className="calc-input flex-1" disabled={job.isPresent} />
                <label className="flex items-center gap-1 text-xs whitespace-nowrap">
                  <input type="checkbox" checked={job.isPresent} onChange={e => updateJob(job.id, "isPresent", e.target.checked)} className="rounded" /> Present
                </label>
              </div>
            </div>
          </div>
        </div>
      ))}

      <button onClick={addJob} className="btn-primary">+ Add Another Job</button>

      {result && (
        <div className="space-y-4">
          {/* Total Experience */}
          <div className="result-card text-center">
            <div className="text-sm text-gray-500">Total Work Experience</div>
            <div className="text-4xl font-extrabold text-indigo-600 mt-1">
              {result.totalYears > 0 && <>{result.totalYears}<span className="text-lg"> yr{result.totalYears > 1 ? "s" : ""} </span></>}
              {result.totalMonths > 0 && <>{result.totalMonths}<span className="text-lg"> mo{result.totalMonths > 1 ? "s" : ""} </span></>}
              {result.totalDays}<span className="text-lg"> day{result.totalDays !== 1 ? "s" : ""}</span>
            </div>
            <div className="text-sm text-gray-400 mt-1">({result.totalMergedDays.toLocaleString("en-IN")} total days)</div>
            {result.hasOverlap && (
              <div className="text-xs text-orange-600 mt-2 bg-orange-50 inline-block px-3 py-1 rounded-full">
                Overlapping periods detected and merged
              </div>
            )}
          </div>

          {/* Per-job breakdown */}
          <div className="result-card">
            <h3 className="font-bold text-gray-800 mb-3">Per-Job Breakdown</h3>
            <div className="table-responsive">
              <table>
                <thead>
                  <tr><th>Company</th><th>Start</th><th>End</th><th>Duration</th></tr>
                </thead>
                <tbody>
                  {result.jobDurations.map(j => (
                    <tr key={j.id}>
                      <td className="font-medium">{j.company || "Unnamed"}</td>
                      <td className="text-sm">{fmtDate(j.start)}</td>
                      <td className="text-sm">{j.isPresent ? "Present" : fmtDate(j.end)}</td>
                      <td className="text-sm font-semibold text-indigo-600">
                        {j.years > 0 && `${j.years}y `}{j.months > 0 && `${j.months}m `}{j.days}d
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
