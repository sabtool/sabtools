"use client";
import { useState, useMemo } from "react";

interface Column {
  id: number;
  name: string;
  type: string;
  nullable: boolean;
  primaryKey: boolean;
  autoIncrement: boolean;
  defaultValue: string;
}

const DATA_TYPES = ["INT", "BIGINT", "VARCHAR(255)", "TEXT", "DATE", "DATETIME", "TIMESTAMP", "BOOLEAN", "DECIMAL(10,2)", "FLOAT", "DOUBLE", "BLOB", "JSON", "UUID"];
type Dialect = "mysql" | "postgresql" | "sqlite";

let colId = 3;

export default function SqlTableGenerator() {
  const [tableName, setTableName] = useState("users");
  const [dialect, setDialect] = useState<Dialect>("mysql");
  const [columns, setColumns] = useState<Column[]>([
    { id: 1, name: "id", type: "INT", nullable: false, primaryKey: true, autoIncrement: true, defaultValue: "" },
    { id: 2, name: "name", type: "VARCHAR(255)", nullable: false, primaryKey: false, autoIncrement: false, defaultValue: "" },
    { id: 3, name: "email", type: "VARCHAR(255)", nullable: true, primaryKey: false, autoIncrement: false, defaultValue: "" },
  ]);
  const [copied, setCopied] = useState(false);

  const addColumn = () => {
    colId++;
    setColumns([...columns, { id: colId, name: "", type: "VARCHAR(255)", nullable: true, primaryKey: false, autoIncrement: false, defaultValue: "" }]);
  };

  const removeColumn = (id: number) => setColumns(columns.filter(c => c.id !== id));

  const updateColumn = (id: number, field: keyof Column, value: string | boolean) => {
    setColumns(columns.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const sql = useMemo(() => {
    if (!tableName || columns.length === 0) return "";
    const q = dialect === "mysql" ? "`" : '"';
    const lines: string[] = [];

    columns.forEach(col => {
      if (!col.name) return;
      let line = `  ${q}${col.name}${q} `;

      // Type mapping
      let t = col.type;
      if (dialect === "postgresql") {
        if (col.autoIncrement && (t === "INT" || t === "BIGINT")) t = t === "BIGINT" ? "BIGSERIAL" : "SERIAL";
        if (t === "DATETIME") t = "TIMESTAMP";
        if (t === "BOOLEAN") t = "BOOLEAN";
        if (t === "BLOB") t = "BYTEA";
        if (t === "DOUBLE") t = "DOUBLE PRECISION";
      }
      if (dialect === "sqlite") {
        if (["INT", "BIGINT", "BOOLEAN"].includes(t)) t = "INTEGER";
        if (t.startsWith("VARCHAR") || t === "JSON" || t === "UUID") t = "TEXT";
        if (["DECIMAL(10,2)", "FLOAT", "DOUBLE"].includes(t)) t = "REAL";
        if (t === "DATETIME" || t === "TIMESTAMP") t = "TEXT";
      }

      line += t;

      if (col.primaryKey) line += " PRIMARY KEY";
      if (col.autoIncrement) {
        if (dialect === "mysql") line += " AUTO_INCREMENT";
        else if (dialect === "sqlite") line += " AUTOINCREMENT";
        // PostgreSQL uses SERIAL
      }
      if (!col.nullable && !col.primaryKey) line += " NOT NULL";
      if (col.defaultValue) {
        const dv = col.defaultValue;
        const isNum = !isNaN(Number(dv));
        const isKeyword = ["NULL", "CURRENT_TIMESTAMP", "TRUE", "FALSE", "NOW()"].includes(dv.toUpperCase());
        line += ` DEFAULT ${isNum || isKeyword ? dv : `'${dv}'`}`;
      }
      lines.push(line);
    });

    if (lines.length === 0) return "";

    const tbl = `${q}${tableName}${q}`;
    let result = `CREATE TABLE ${tbl} (\n${lines.join(",\n")}\n)`;
    if (dialect === "mysql") result += " ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";
    result += ";";
    return result;
  }, [tableName, columns, dialect]);

  const copy = () => {
    navigator.clipboard?.writeText(sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Table name and dialect */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Table Name</label>
          <input value={tableName} onChange={e => setTableName(e.target.value)} className="calc-input" placeholder="table_name" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-1">Database</label>
          <select value={dialect} onChange={e => setDialect(e.target.value as Dialect)} className="calc-input">
            <option value="mysql">MySQL</option>
            <option value="postgresql">PostgreSQL</option>
            <option value="sqlite">SQLite</option>
          </select>
        </div>
      </div>

      {/* Columns */}
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Columns</label>
        <div className="space-y-3">
          {columns.map(col => (
            <div key={col.id} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                <input value={col.name} onChange={e => updateColumn(col.id, "name", e.target.value)} placeholder="column_name" className="calc-input !py-1.5 text-sm" />
                <select value={col.type} onChange={e => updateColumn(col.id, "type", e.target.value)} className="calc-input !py-1.5 text-sm">
                  {DATA_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <input value={col.defaultValue} onChange={e => updateColumn(col.id, "defaultValue", e.target.value)} placeholder="Default value" className="calc-input !py-1.5 text-sm" />
                <div className="flex items-center gap-2">
                  <button onClick={() => removeColumn(col.id)} className="text-red-500 hover:text-red-700 text-lg font-bold">&times;</button>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 text-xs">
                <label className="flex items-center gap-1.5">
                  <input type="checkbox" checked={col.primaryKey} onChange={e => updateColumn(col.id, "primaryKey", e.target.checked)} /> Primary Key
                </label>
                <label className="flex items-center gap-1.5">
                  <input type="checkbox" checked={col.autoIncrement} onChange={e => updateColumn(col.id, "autoIncrement", e.target.checked)} /> Auto Increment
                </label>
                <label className="flex items-center gap-1.5">
                  <input type="checkbox" checked={col.nullable} onChange={e => updateColumn(col.id, "nullable", e.target.checked)} /> Nullable
                </label>
              </div>
            </div>
          ))}
        </div>
        <button onClick={addColumn} className="btn-secondary text-xs mt-2 !py-1.5 !px-3">+ Add Column</button>
      </div>

      {/* Output */}
      {sql && (
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-semibold text-gray-700">Generated SQL</label>
            <button onClick={copy} className="text-xs text-indigo-600 font-medium hover:underline">{copied ? "Copied!" : "Copy"}</button>
          </div>
          <pre className="result-card font-mono text-sm whitespace-pre-wrap bg-gray-900 text-green-400 p-4 rounded-xl overflow-x-auto">{sql}</pre>
        </div>
      )}
    </div>
  );
}
