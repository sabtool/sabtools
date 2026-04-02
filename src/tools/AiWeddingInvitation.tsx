"use client";
import { useState } from "react";

type Style = "Traditional Hindu" | "Modern" | "Muslim (Nikah)" | "Sikh (Anand Karaj)" | "Christian";
type Lang = "English" | "Hindi";

const styles: Style[] = ["Traditional Hindu", "Modern", "Muslim (Nikah)", "Sikh (Anand Karaj)", "Christian"];

interface Details { bride: string; groom: string; brideParents: string; groomParents: string; venue: string; date: string; time: string }

const generators: Record<Style, Record<Lang, (d: Details) => string>> = {
  "Traditional Hindu": {
    English: (d) =>
      `|| Shree Ganeshaya Namah ||\n\nWith the blessings of Lord Ganesha and our elders,\n\n${d.groomParents}\n&\n${d.brideParents}\n\ncordially invite you and your family to grace the auspicious occasion of the wedding ceremony of their beloved children\n\n~ ${d.groom} ~\nwith\n~ ${d.bride} ~\n\nOn: ${d.date}\nTime: ${d.time}\nVenue: ${d.venue}\n\nWe request the honour of your presence and blessings as we celebrate this union of two families.\n\nKindly grace the occasion with your esteemed presence.\n\nWith warm regards and blessings,\n${d.groomParents} & ${d.brideParents}`,
    Hindi: (d) =>
      `|| श्री गणेशाय नमः ||\n\nपरम पिता परमेश्वर एवं कुल देवता की असीम कृपा से\n\n${d.groomParents}\nएवं\n${d.brideParents}\n\nअपने प्रिय पुत्र / पुत्री के शुभ विवाह समारोह में\nआपको सपरिवार सादर आमंत्रित करते हैं।\n\n~ ${d.groom} ~\nके साथ\n~ ${d.bride} ~\n\nदिनांक: ${d.date}\nसमय: ${d.time}\nस्थान: ${d.venue}\n\nकृपया अपने परिवार सहित पधारकर\nनवदम्पत्ति को अपना आशीर्वाद प्रदान करें।\n\nसादर आमंत्रण,\n${d.groomParents} एवं ${d.brideParents}`,
  },
  "Modern": {
    English: (d) =>
      `Together with their families,\n\n${d.bride}\n&\n${d.groom}\n\nrequest the pleasure of your company\nat the celebration of their marriage.\n\n${d.date}\nat ${d.time}\n\n${d.venue}\n\nReception and dinner to follow.\n\nParents of the Bride: ${d.brideParents}\nParents of the Groom: ${d.groomParents}\n\nWe can't wait to celebrate this special day with you!\n\nKindly RSVP by [date].`,
    Hindi: (d) =>
      `अपने परिवारों के साथ,\n\n${d.bride}\nऔर\n${d.groom}\n\nआपको अपने विवाह समारोह में\nसपरिवार आमंत्रित करते हैं।\n\n${d.date}\n${d.time} बजे\n\n${d.venue}\n\nसमारोह के बाद स्वागत एवं भोज\n\nवधू के माता-पिता: ${d.brideParents}\nवर के माता-पिता: ${d.groomParents}\n\nआपकी उपस्थिति हमारा सौभाग्य होगी!`,
  },
  "Muslim (Nikah)": {
    English: (d) =>
      `Bismillah hir Rahman ir Rahim\n\nIn the Name of Allah, the Most Gracious, the Most Merciful\n\n${d.groomParents}\n&\n${d.brideParents}\n\nrequest the honour of your gracious presence at the Nikah ceremony of their beloved children\n\n${d.groom}\nson of ${d.groomParents}\n\nwith\n\n${d.bride}\ndaughter of ${d.brideParents}\n\nDate: ${d.date}\nTime: ${d.time}\nVenue: ${d.venue}\n\nWalima to follow after the Nikah ceremony.\n\nYour presence and duas are humbly requested.\n\nMay Allah bless this union with love, happiness and barakah.\n\nWith warm regards,\n${d.groomParents} & ${d.brideParents}`,
    Hindi: (d) =>
      `बिस्मिल्लाह हिर्रहमान निर्रहीम\n\nअल्लाह के नाम से, जो बड़ा मेहरबान निहायत रहम वाला है\n\n${d.groomParents}\nएवं\n${d.brideParents}\n\nअपने लाड़ले/लाड़ली की निकाह की रस्म में\nआपको सपरिवार सादर आमंत्रित करते हैं।\n\n${d.groom}\nके साथ\n${d.bride}\n\nदिनांक: ${d.date}\nसमय: ${d.time}\nस्थान: ${d.venue}\n\nनिकाह के बाद वलीमा\n\nआपकी उपस्थिति और दुआओं की दरख्वास्त है।`,
  },
  "Sikh (Anand Karaj)": {
    English: (d) =>
      `Ik Onkar\nWaheguru Ji Ka Khalsa, Waheguru Ji Ki Fateh\n\n${d.groomParents}\n&\n${d.brideParents}\n\ncordially invite you and your family to the Anand Karaj ceremony of their beloved children\n\n${d.groom}\nwith\n${d.bride}\n\nDate: ${d.date}\nTime: ${d.time}\nVenue: ${d.venue}\n\nThe ceremony will be followed by Guru Ka Langar.\n\nYour presence and blessings are humbly requested as we celebrate this sacred union in the presence of Sri Guru Granth Sahib Ji.\n\nWith warm regards and Waheguru's blessings,\n${d.groomParents} & ${d.brideParents}`,
    Hindi: (d) =>
      `ੴ\nवाहेगुरु जी का खालसा, वाहेगुरु जी की फतेह\n\n${d.groomParents}\nएवं\n${d.brideParents}\n\nअपने प्रिय पुत्र/पुत्री के आनंद कारज समारोह में\nआपको सपरिवार सादर आमंत्रित करते हैं।\n\n${d.groom}\nके साथ\n${d.bride}\n\nदिनांक: ${d.date}\nसमय: ${d.time}\nस्थान: ${d.venue}\n\nसमारोह के बाद गुरु का लंगर\n\nश्री गुरु ग्रंथ साहिब जी की हज़ूरी में इस पावन अवसर पर\nआपकी उपस्थिति और आशीर्वाद की प्रार्थना है।`,
  },
  "Christian": {
    English: (d) =>
      `In the Grace of Our Lord Jesus Christ,\n\n${d.brideParents}\n&\n${d.groomParents}\n\njoyfully invite you to celebrate the marriage of their children\n\n${d.bride}\n&\n${d.groom}\n\nThe Holy Matrimony will be solemnized on\n\n${d.date}\nat ${d.time}\n\n${d.venue}\n\nA reception will follow the ceremony.\n\n"And now these three remain: faith, hope and love.\nBut the greatest of these is love."\n— 1 Corinthians 13:13\n\nYour presence and blessings are a gift in themselves.\nPlease honour us with your company.\n\nWith love and prayers,\n${d.brideParents} & ${d.groomParents}`,
    Hindi: (d) =>
      `प्रभु यीशु मसीह की कृपा में,\n\n${d.brideParents}\nएवं\n${d.groomParents}\n\nअपने प्रिय बच्चों के पवित्र विवाह समारोह में\nआपको सपरिवार हर्षपूर्वक आमंत्रित करते हैं।\n\n${d.bride}\nएवं\n${d.groom}\n\nविवाह संस्कार\n\nदिनांक: ${d.date}\nसमय: ${d.time}\nस्थान: ${d.venue}\n\nसमारोह के बाद स्वागत भोज\n\n"अब ये तीन बातें बनी रहती हैं: विश्वास, आशा और प्रेम।\nपरन्तु इनमें सबसे बड़ा प्रेम है।"\n— 1 कुरिन्थियों 13:13\n\nआपकी उपस्थिति और प्रार्थनाएं हमारे लिए अमूल्य हैं।`,
  },
};

export default function AiWeddingInvitation() {
  const [style, setStyle] = useState<Style>("Traditional Hindu");
  const [lang, setLang] = useState<Lang>("English");
  const [bride, setBride] = useState("");
  const [groom, setGroom] = useState("");
  const [brideParents, setBrideParents] = useState("");
  const [groomParents, setGroomParents] = useState("");
  const [venue, setVenue] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [invitation, setInvitation] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = () => {
    if (!bride.trim() || !groom.trim()) return;
    const d: Details = {
      bride: bride.trim(), groom: groom.trim(),
      brideParents: brideParents.trim() || "The Bride's Family",
      groomParents: groomParents.trim() || "The Groom's Family",
      venue: venue.trim() || "[Venue]", date: date.trim() || "[Date]", time: time.trim() || "[Time]",
    };
    setInvitation(generators[style][lang](d));
  };

  const copy = () => { navigator.clipboard?.writeText(invitation); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const print = () => {
    const w = window.open("", "_blank");
    if (w) {
      w.document.write(`<html><head><title>Wedding Invitation</title><style>body{font-family:Georgia,serif;max-width:600px;margin:50px auto;padding:30px;text-align:center;line-height:2;color:#333;border:3px double #d4a574;border-radius:10px}p{margin:4px 0}</style></head><body>`);
      invitation.split("\n").forEach((line) => { w.document.write(`<p>${line || "&nbsp;"}</p>`); });
      w.document.write("</body></html>");
      w.document.close();
      w.print();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Wedding Style</label>
        <select className="calc-input" value={style} onChange={(e) => setStyle(e.target.value as Style)}>
          {styles.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Language</label>
        <div className="flex gap-2">
          {(["English", "Hindi"] as Lang[]).map((l) => (
            <button key={l} onClick={() => setLang(l)} className={l === lang ? "btn-primary" : "btn-secondary"}>{l}</button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Bride Name</label>
          <input className="calc-input" value={bride} onChange={(e) => setBride(e.target.value)} placeholder="e.g. Priya Sharma" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Groom Name</label>
          <input className="calc-input" value={groom} onChange={(e) => setGroom(e.target.value)} placeholder="e.g. Rahul Verma" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Bride&apos;s Parents</label>
          <input className="calc-input" value={brideParents} onChange={(e) => setBrideParents(e.target.value)} placeholder="e.g. Mr. & Mrs. Sharma" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Groom&apos;s Parents</label>
          <input className="calc-input" value={groomParents} onChange={(e) => setGroomParents(e.target.value)} placeholder="e.g. Mr. & Mrs. Verma" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Venue</label>
          <input className="calc-input" value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="e.g. Grand Palace, Delhi" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Date</label>
          <input className="calc-input" value={date} onChange={(e) => setDate(e.target.value)} placeholder="e.g. 15th February, 2025" />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Time</label>
          <input className="calc-input" value={time} onChange={(e) => setTime(e.target.value)} placeholder="e.g. 7:00 PM onwards" />
        </div>
      </div>
      <button onClick={generate} className="btn-primary">Generate Invitation</button>
      {invitation && (
        <div className="result-card space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-gray-600">{style} Invitation ({lang})</span>
            <div className="flex gap-3">
              <button onClick={print} className="text-xs text-gray-500 font-medium hover:underline">Print</button>
              <button onClick={copy} className="text-xs text-indigo-600 font-medium hover:underline">{copied ? "Copied!" : "Copy"}</button>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-100 text-center">
            {invitation.split("\n").map((line, i) => (
              <p key={i} className={`text-gray-800 leading-relaxed ${line === "" ? "h-3" : ""} ${line.startsWith("~") ? "text-xl font-bold text-indigo-600" : ""} ${line.startsWith("||") || line.startsWith("Bismillah") || line.startsWith("Ik Onkar") || line.startsWith("In the Grace") || line.startsWith("बिस्मिल्लाह") || line.startsWith("ੴ") || line.startsWith("प्रभु") || line.startsWith("||") ? "text-lg font-semibold text-amber-700" : ""}`}>{line}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
