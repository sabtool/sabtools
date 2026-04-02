"use client";
import { useState } from "react";

const states = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Jammu & Kashmir",
  "Ladakh", "Puducherry", "Chandigarh", "Andaman & Nicobar", "Dadra & Nagar Haveli",
  "Daman & Diu", "Lakshadweep",
];

const statePortals: Record<string, string> = {
  "Andhra Pradesh": "https://epds.ap.gov.in", "Bihar": "https://epds.bihar.gov.in",
  "Delhi": "https://nfs.delhi.gov.in", "Gujarat": "https://dcs-dof.gujarat.gov.in",
  "Haryana": "https://epds.haryana.gov.in", "Karnataka": "https://ahara.kar.nic.in",
  "Kerala": "https://civilsupplieskerala.gov.in", "Madhya Pradesh": "https://samagra.gov.in",
  "Maharashtra": "https://rcms.mahafood.gov.in", "Punjab": "https://epos.punjab.gov.in",
  "Rajasthan": "https://food.rajasthan.gov.in", "Tamil Nadu": "https://www.tnpds.gov.in",
  "Telangana": "https://epds.telangana.gov.in", "Uttar Pradesh": "https://fcs.up.gov.in",
  "West Bengal": "https://wbpds.gov.in",
};

const cardTypes = [
  {
    type: "AAY",
    fullName: "Antyodaya Anna Yojana",
    color: "bg-red-50 border-red-200",
    colorLabel: "Red / Saffron",
    eligibility: [
      "Poorest of the poor families",
      "Annual household income below Rs. 15,000",
      "Landless agricultural labourers",
      "Widows, disabled, elderly with no support",
      "Primitive tribal households",
    ],
    benefits: [
      "35 kg of foodgrains per family per month",
      "Rice at Rs. 3/kg",
      "Wheat at Rs. 2/kg",
      "Priority in government welfare schemes",
    ],
  },
  {
    type: "PHH",
    fullName: "Priority Household",
    color: "bg-pink-50 border-pink-200",
    colorLabel: "Pink",
    eligibility: [
      "Families below poverty line (BPL)",
      "Identified through Socio-Economic Caste Census (SECC)",
      "Up to 75% of rural and 50% of urban population",
      "Automatically includes all SECC deprived households",
    ],
    benefits: [
      "5 kg of foodgrains per person per month",
      "Rice at Rs. 3/kg",
      "Wheat at Rs. 2/kg",
      "Eligible under National Food Security Act (NFSA)",
    ],
  },
  {
    type: "NPHH",
    fullName: "Non-Priority Household",
    color: "bg-blue-50 border-blue-200",
    colorLabel: "Blue / White",
    eligibility: [
      "Above poverty line (APL) families",
      "Not covered under AAY or PHH categories",
      "Annual income above state-defined threshold",
      "Used mainly for identity proof and state schemes",
    ],
    benefits: [
      "May not receive subsidized foodgrains under NFSA",
      "Eligible for state-specific schemes (varies by state)",
      "Can be used as address/identity proof",
      "Some states provide sugar and kerosene at subsidized rates",
    ],
  },
];

export default function RationCardInfo() {
  const [selectedState, setSelectedState] = useState("");

  const portal = statePortals[selectedState] || "";

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Select State / UT</label>
        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          className="calc-input"
        >
          <option value="">-- Select State --</option>
          {states.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {selectedState && (
        <div className="result-card space-y-2">
          <h3 className="text-lg font-bold text-gray-800">{selectedState}</h3>
          {portal ? (
            <a href={portal} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm inline-block">
              Visit {selectedState} Food Portal
            </a>
          ) : (
            <p className="text-sm text-gray-500">Search for &quot;{selectedState} ration card portal&quot; to find the official website.</p>
          )}
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Types of Ration Cards in India</h3>
        {cardTypes.map((card) => (
          <div key={card.type} className={`rounded-xl border p-4 space-y-3 ${card.color}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xl font-bold text-gray-800">{card.type}</p>
                <p className="text-sm text-gray-600">{card.fullName}</p>
              </div>
              <span className="text-xs bg-white rounded-full px-3 py-1 font-medium text-gray-600">{card.colorLabel}</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">Eligibility:</p>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                {card.eligibility.map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">Benefits:</p>
              <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                {card.benefits.map((b, i) => <li key={i}>{b}</li>)}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="result-card">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">How to Apply for a Ration Card</h3>
        <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
          <li>Visit your state food department portal (link above)</li>
          <li>Fill the application form with family details</li>
          <li>Upload required documents (Aadhaar, address proof, income certificate)</li>
          <li>Submit and note the application reference number</li>
          <li>Verification will be done by local authorities</li>
          <li>Card is delivered after approval (usually 15-30 days)</li>
        </ol>
        <p className="text-xs text-gray-400 mt-2">
          You can also apply at your nearest Common Service Centre (CSC) or ration office.
        </p>
      </div>
    </div>
  );
}
