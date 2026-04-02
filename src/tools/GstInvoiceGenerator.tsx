"use client";
import { useState, useMemo } from "react";

interface InvoiceItem {
  id: number;
  name: string;
  qty: number;
  rate: number;
  gstPercent: number;
}

let nextId = 1;

export default function GstInvoiceGenerator() {
  const [sellerName, setSellerName] = useState("");
  const [sellerGstin, setSellerGstin] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [buyerGstin, setBuyerGstin] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("INV-001");
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split("T")[0]);
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: nextId++, name: "Product 1", qty: 1, rate: 1000, gstPercent: 18 },
  ]);
  const [copied, setCopied] = useState(false);

  const fmt = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(n);

  const addItem = () => {
    setItems([...items, { id: nextId++, name: "", qty: 1, rate: 0, gstPercent: 18 }]);
  };

  const removeItem = (id: number) => {
    if (items.length > 1) setItems(items.filter((i) => i.id !== id));
  };

  const updateItem = (id: number, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map((i) => (i.id === id ? { ...i, [field]: field === "name" ? value : Number(value) } : i)));
  };

  const invoice = useMemo(() => {
    const rows = items.map((i) => {
      const taxable = i.qty * i.rate;
      const cgst = (taxable * i.gstPercent) / 200;
      const sgst = cgst;
      const total = taxable + cgst + sgst;
      return { ...i, taxable, cgst, sgst, total };
    });
    const totalTaxable = rows.reduce((s, r) => s + r.taxable, 0);
    const totalCgst = rows.reduce((s, r) => s + r.cgst, 0);
    const totalSgst = rows.reduce((s, r) => s + r.sgst, 0);
    const grandTotal = rows.reduce((s, r) => s + r.total, 0);
    return { rows, totalTaxable, totalCgst, totalSgst, grandTotal };
  }, [items]);

  const copyInvoice = () => {
    const lines = [
      `TAX INVOICE`,
      `Invoice No: ${invoiceNo}  |  Date: ${invoiceDate}`,
      ``,
      `Seller: ${sellerName}  |  GSTIN: ${sellerGstin}`,
      `Buyer: ${buyerName}  |  GSTIN: ${buyerGstin}`,
      ``,
      `${"Item".padEnd(25)} ${"Qty".padStart(5)} ${"Rate".padStart(10)} ${"Taxable".padStart(12)} ${"CGST".padStart(10)} ${"SGST".padStart(10)} ${"Total".padStart(12)}`,
      `-`.repeat(95),
      ...invoice.rows.map((r) =>
        `${r.name.padEnd(25)} ${String(r.qty).padStart(5)} ${fmt(r.rate).padStart(10)} ${fmt(r.taxable).padStart(12)} ${fmt(r.cgst).padStart(10)} ${fmt(r.sgst).padStart(10)} ${fmt(r.total).padStart(12)}`
      ),
      `-`.repeat(95),
      `${"TOTAL".padEnd(25)} ${"".padStart(5)} ${"".padStart(10)} ${fmt(invoice.totalTaxable).padStart(12)} ${fmt(invoice.totalCgst).padStart(10)} ${fmt(invoice.totalSgst).padStart(10)} ${fmt(invoice.grandTotal).padStart(12)}`,
    ];
    navigator.clipboard.writeText(lines.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Seller Name</label>
          <input type="text" value={sellerName} onChange={(e) => setSellerName(e.target.value)} className="calc-input" placeholder="Company Name" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Seller GSTIN</label>
          <input type="text" value={sellerGstin} onChange={(e) => setSellerGstin(e.target.value)} className="calc-input" placeholder="22AAAAA0000A1Z5" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Buyer Name</label>
          <input type="text" value={buyerName} onChange={(e) => setBuyerName(e.target.value)} className="calc-input" placeholder="Client Name" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Buyer GSTIN</label>
          <input type="text" value={buyerGstin} onChange={(e) => setBuyerGstin(e.target.value)} className="calc-input" placeholder="22BBBBB0000B1Z5" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Invoice No</label>
          <input type="text" value={invoiceNo} onChange={(e) => setInvoiceNo(e.target.value)} className="calc-input" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Invoice Date</label>
          <input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} className="calc-input" />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-sm font-semibold text-gray-700">Items</label>
          <button onClick={addItem} className="btn-secondary text-sm">+ Add Item</button>
        </div>
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-xl p-3 shadow-sm flex flex-wrap items-center gap-2">
            <input type="text" value={item.name} onChange={(e) => updateItem(item.id, "name", e.target.value)} className="calc-input flex-1 min-w-[120px]" placeholder="Item name" />
            <input type="number" min={1} value={item.qty} onChange={(e) => updateItem(item.id, "qty", e.target.value)} className="calc-input w-16 text-center" placeholder="Qty" />
            <input type="number" min={0} value={item.rate} onChange={(e) => updateItem(item.id, "rate", e.target.value)} className="calc-input w-24 text-center" placeholder="Rate" />
            <select value={item.gstPercent} onChange={(e) => updateItem(item.id, "gstPercent", e.target.value)} className="calc-input w-24">
              <option value={0}>0% GST</option>
              <option value={5}>5% GST</option>
              <option value={12}>12% GST</option>
              <option value={18}>18% GST</option>
              <option value={28}>28% GST</option>
            </select>
            {items.length > 1 && (
              <button onClick={() => removeItem(item.id)} className="btn-secondary text-sm text-red-500">X</button>
            )}
          </div>
        ))}
      </div>

      <div className="result-card space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800">Invoice Preview</h3>
          <button onClick={copyInvoice} className="btn-primary text-sm">{copied ? "Copied!" : "Copy Invoice"}</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-gray-600">
                <th className="p-2">Item</th>
                <th className="p-2 text-right">Qty</th>
                <th className="p-2 text-right">Rate</th>
                <th className="p-2 text-right">Taxable</th>
                <th className="p-2 text-right">CGST</th>
                <th className="p-2 text-right">SGST</th>
                <th className="p-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.rows.map((r) => (
                <tr key={r.id} className="border-b">
                  <td className="p-2">{r.name || "-"}</td>
                  <td className="p-2 text-right">{r.qty}</td>
                  <td className="p-2 text-right">{fmt(r.rate)}</td>
                  <td className="p-2 text-right">{fmt(r.taxable)}</td>
                  <td className="p-2 text-right text-xs">{fmt(r.cgst)}<br /><span className="text-gray-400">{r.gstPercent / 2}%</span></td>
                  <td className="p-2 text-right text-xs">{fmt(r.sgst)}<br /><span className="text-gray-400">{r.gstPercent / 2}%</span></td>
                  <td className="p-2 text-right font-semibold">{fmt(r.total)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="font-bold border-t-2">
                <td className="p-2" colSpan={3}>Grand Total</td>
                <td className="p-2 text-right">{fmt(invoice.totalTaxable)}</td>
                <td className="p-2 text-right">{fmt(invoice.totalCgst)}</td>
                <td className="p-2 text-right">{fmt(invoice.totalSgst)}</td>
                <td className="p-2 text-right text-indigo-600">{fmt(invoice.grandTotal)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
