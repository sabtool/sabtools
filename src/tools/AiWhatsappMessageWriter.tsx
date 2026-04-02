"use client";
import { useState } from "react";

type MessageType = "Festival Greeting" | "Birthday" | "Anniversary" | "Congratulations" | "Condolence" | "Business Follow-up" | "Meeting Reminder" | "Thank You" | "Invitation";
type Festival = "Diwali" | "Holi" | "Eid" | "Christmas" | "New Year";

const festivalTemplates: Record<Festival, { short: string; medium: string; detailed: string }> = {
  Diwali: {
    short: "Wishing you a very Happy Diwali, {name}! May your life be filled with light and prosperity. 🪔✨",
    medium: "Dear {name},\n\nWishing you and your family a very Happy Diwali! 🪔✨\n\nMay the festival of lights bring endless joy, prosperity, and happiness into your life. May every diya illuminate your path and every rangoli bring colors of success.\n\nHappy Diwali! 🎆🎇",
    detailed: "Dear {name},\n\nOn this auspicious occasion of Diwali, I extend my warmest wishes to you and your entire family. 🪔✨\n\nMay the divine light of Diwali spread into your life with peace, prosperity, happiness, and good health. May every lamp that you light bring a ray of hope and fill your days with eternal joy.\n\nLet us celebrate this festival by spreading love and kindness. May the sound of crackers and the glow of diyas fill your home with warmth and positivity.\n\nWishing you wealth, wisdom, and wonderful moments this Diwali season. 🎆🎇🎊\n\nHappy Diwali! Shubh Deepawali! 🙏",
  },
  Holi: {
    short: "Happy Holi, {name}! May your life be as colorful as this festival! 🎨🌈",
    medium: "Dear {name},\n\nWishing you a very Happy Holi! 🎨🌈\n\nMay this festival of colors bring vibrant hues of joy, laughter, and love into your life. Let's celebrate the victory of good over evil and paint the world with happiness.\n\nHappy Holi! 💜💙💚💛🧡❤️",
    detailed: "Dear {name},\n\nAs the air fills with the spirit of Holi, I want to wish you the most colorful and joyous celebration! 🎨🌈\n\nMay each color that touches you bring a special meaning to your life - may red bring love, green bring prosperity, blue bring peace, and yellow bring happiness. Let this Holi wash away all negativity and paint your world with beautiful memories.\n\nLet us forgive and forget, embrace new beginnings, and celebrate the beautiful bond we share. May the colors of Holi spread the message of peace and happiness.\n\nWishing you and your family a blessed and colorful Holi! 💜💙💚💛🧡❤️\n\nHappy Holi! 🎉",
  },
  Eid: {
    short: "Eid Mubarak, {name}! Wishing you peace, happiness, and blessings. 🌙✨",
    medium: "Dear {name},\n\nEid Mubarak! 🌙✨\n\nMay this blessed occasion bring you and your family immense joy, peace, and prosperity. May Allah accept your prayers and shower His blessings upon you.\n\nWishing you a wonderful Eid celebration filled with love and happiness! 🤲🕌",
    detailed: "Dear {name},\n\nOn this blessed day of Eid, I extend my heartfelt wishes to you and your loved ones. 🌙✨\n\nMay the divine blessings of Allah fill your life with happiness, prosperity, and success. May this Eid bring the warmth of love and light of guidance into your life.\n\nAs we come together to celebrate, let us remember the values of compassion, generosity, and gratitude. May your prayers be answered and your heart be filled with contentment.\n\nWishing you and your family a blessed Eid filled with joy, peace, and togetherness. 🤲🕌\n\nEid Mubarak! 🎉🌟",
  },
  Christmas: {
    short: "Merry Christmas, {name}! Wishing you joy, love, and peace this holiday season! 🎄🎅",
    medium: "Dear {name},\n\nMerry Christmas and Happy Holidays! 🎄🎅\n\nMay this Christmas season fill your heart with warmth, your home with love, and your life with laughter. Wishing you wonderful moments with family and friends.\n\nMay the spirit of Christmas bring you peace and joy! 🎁⭐",
    detailed: "Dear {name},\n\nAs the Christmas bells ring and carols fill the air, I want to send you my warmest wishes for this magical season! 🎄🎅\n\nMay the joy of Christmas morning, the warmth of loved ones gathered near, and the wonder of this beautiful season fill your heart with happiness that lasts throughout the year.\n\nChristmas is a time to reflect on the blessings we have, to appreciate the people who make our lives special, and to spread kindness and love wherever we go.\n\nWishing you and your family a blessed Christmas filled with love, laughter, and beautiful memories. May the New Year bring you everything your heart desires.\n\nMerry Christmas! 🎁⭐🎄✨",
  },
  "New Year": {
    short: "Happy New Year, {name}! Cheers to new beginnings and wonderful adventures! 🎉🥂",
    medium: "Dear {name},\n\nHappy New Year ${new Date().getFullYear() + 1}! 🎉🥂\n\nAs we step into a new year, I wish you 12 months of success, 52 weeks of laughter, 365 days of joy, and countless moments of happiness.\n\nMay this year bring you closer to your dreams! ✨🎊",
    detailed: "Dear {name},\n\nAs we bid farewell to this year and welcome a brand new one, I want to wish you the most wonderful New Year! 🎉🥂\n\nMay ${new Date().getFullYear() + 1} be the year where all your dreams come true, where every challenge becomes an opportunity, and where every day brings you closer to the life you envision.\n\nLet us step into the new year with gratitude for the past, hope for the future, and joy in the present moment. Here's to new adventures, stronger relationships, and boundless opportunities.\n\nWishing you and your family health, happiness, prosperity, and peace in the coming year. May it be your best year yet!\n\nHappy New Year! 🎊✨🎆🥳",
  },
};

const generalTemplates: Record<Exclude<MessageType, "Festival Greeting">, { short: (n: string, d: string) => string; medium: (n: string, d: string) => string; detailed: (n: string, d: string) => string }> = {
  Birthday: {
    short: (n, d) => `Happy Birthday, ${n}! 🎂🎉 Wishing you a fantastic day filled with love and joy! ${d ? d + " " : ""}Have a blast! 🥳`,
    medium: (n, d) => `Dear ${n},\n\nHappiest Birthday to you! 🎂🎉🎈\n\nMay this special day bring you all the happiness, love, and success you deserve. ${d ? d + " " : ""}May every moment of your birthday be filled with joy and beautiful memories.\n\nHave an amazing birthday! 🥳🎁`,
    detailed: (n, d) => `Dear ${n},\n\nOn your special day, I want to wish you the happiest and most memorable birthday! 🎂🎉🎈\n\nYou are someone who brings so much light and positivity into the world. ${d ? d + " " : ""}Today is the perfect day to celebrate the incredible person you are.\n\nMay this year bring you:\n✨ Endless happiness and laughter\n🌟 Success in everything you pursue\n❤️ Love and warmth from those around you\n🎯 Achievement of all your goals and dreams\n\nEnjoy every moment of your special day. You deserve all the best things life has to offer.\n\nHappiest Birthday once again! 🥳🎁🎊`,
  },
  Anniversary: {
    short: (n, d) => `Happy Anniversary, ${n}! 💕 Wishing you many more years of love and togetherness! ${d || ""} 🥂`,
    medium: (n, d) => `Dear ${n},\n\nHappy Anniversary! 💕🥂\n\nWishing you both a wonderful anniversary celebration. ${d ? d + " " : ""}May your bond grow stronger with each passing year, and may your love story continue to inspire everyone around you.\n\nHere's to many more beautiful years together! 💑✨`,
    detailed: (n, d) => `Dear ${n},\n\nWishing you both the happiest anniversary! 💕🥂\n\nYour journey together is truly inspiring. ${d ? d + " " : ""}The love, respect, and understanding you share is a beautiful example for everyone around you.\n\nMay this anniversary mark the beginning of another wonderful chapter in your love story. May your days be filled with laughter, your hearts with warmth, and your lives with countless beautiful memories.\n\nHere's celebrating the beautiful bond you share. Wishing you a lifetime of love and happiness together! 💑✨🎉`,
  },
  Congratulations: {
    short: (n, d) => `Congratulations, ${n}! 🎉 ${d ? d + " " : ""}So proud of you! Well deserved! 🌟`,
    medium: (n, d) => `Dear ${n},\n\nHeartiest Congratulations! 🎉🏆\n\n${d ? d + " " : ""}This achievement is a testament to your hard work and dedication. You truly deserve every bit of this success.\n\nWishing you continued success and many more achievements ahead! 🌟💪`,
    detailed: (n, d) => `Dear ${n},\n\nI am absolutely thrilled to congratulate you! 🎉🏆\n\n${d ? d + " " : ""}This is a remarkable achievement that reflects your dedication, perseverance, and talent. You have worked incredibly hard for this, and seeing it come to fruition fills me with immense pride and joy.\n\nMay this be just the beginning of many more successes. Continue to aim high, dream big, and achieve the extraordinary. The world is lucky to have someone as talented and determined as you.\n\nOnce again, heartiest congratulations! You inspire us all! 🌟💪🎊`,
  },
  Condolence: {
    short: (n, d) => `My deepest condolences, ${n}. ${d ? d + " " : ""}Sending prayers and strength during this difficult time. 🙏`,
    medium: (n, d) => `Dear ${n},\n\nI am deeply saddened to hear of your loss. ${d ? d + " " : ""}Please accept my heartfelt condolences.\n\nMay you find strength and comfort during this difficult time. Know that you are in my thoughts and prayers.\n\nPlease don't hesitate to reach out if you need anything. 🙏💐`,
    detailed: (n, d) => `Dear ${n},\n\nWords cannot adequately express how sorry I am for your loss. ${d ? d + " " : ""}Please accept my deepest and most heartfelt condolences.\n\nDuring this incredibly difficult time, I want you to know that you are not alone. The memories of your loved one will forever remain a source of comfort and inspiration.\n\nMay God grant you the strength to bear this loss and the peace to find comfort in the beautiful memories you shared. Please take all the time you need, and know that I am here for you in any way you need.\n\nWith deepest sympathy and prayers. 🙏💐`,
  },
  "Business Follow-up": {
    short: (n, d) => `Hi ${n}! Just following up on our previous conversation. ${d ? d + " " : ""}Looking forward to your response. 🤝`,
    medium: (n, d) => `Hi ${n},\n\nHope you're doing well! I wanted to follow up on our recent discussion. ${d ? d + " " : ""}\n\nI'm keen to move things forward and would appreciate your thoughts. Please let me know if you need any additional information from my end.\n\nLooking forward to hearing from you! 🤝`,
    detailed: (n, d) => `Hi ${n},\n\nI hope this message finds you well. I'm reaching out to follow up on our recent conversation. ${d ? d + " " : ""}\n\nI understand you have a busy schedule, and I appreciate your time. I wanted to check if you've had a chance to review the details we discussed.\n\nKey points for your reference:\n• Our proposed solution addresses the requirements discussed\n• We can provide additional documentation if needed\n• I'm available for a call at your convenience\n\nWould it be possible to schedule a brief discussion this week? I'm flexible with timing and happy to work around your schedule.\n\nThank you for your time. Looking forward to your response! 🤝`,
  },
  "Meeting Reminder": {
    short: (n, d) => `Hi ${n}! Gentle reminder about our scheduled meeting. ${d ? d + " " : ""}See you there! 📅`,
    medium: (n, d) => `Hi ${n},\n\nThis is a friendly reminder about our upcoming meeting. ${d ? d + " " : ""}\n\nPlease let me know if you need to reschedule or if there's anything specific you'd like to discuss. Looking forward to a productive session!\n\nSee you soon! 📅✅`,
    detailed: (n, d) => `Hi ${n},\n\nI hope you're having a great day! I'm writing to remind you about our scheduled meeting. ${d ? d + " " : ""}\n\nHere's a quick overview:\n📋 Agenda: As discussed previously\n⏰ Duration: Approximately 30-45 minutes\n📍 Location/Link: As shared earlier\n\nIf you need to reschedule or have any specific topics you'd like to add to the agenda, please let me know in advance.\n\nLooking forward to a productive discussion! 📅✅`,
  },
  "Thank You": {
    short: (n, d) => `Thank you so much, ${n}! ${d ? d + " " : ""}Really appreciate it! 🙏😊`,
    medium: (n, d) => `Dear ${n},\n\nI wanted to take a moment to express my sincere thanks. ${d ? d + " " : ""}\n\nYour support and kindness mean more than words can express. I truly appreciate everything you've done.\n\nThank you once again! 🙏😊`,
    detailed: (n, d) => `Dear ${n},\n\nI am writing to express my heartfelt gratitude to you. ${d ? d + " " : ""}\n\nYour generosity, kindness, and support have made a tremendous difference. In a world where everyone is busy with their own lives, the time and effort you dedicated truly stand out.\n\nI want you to know that your contribution has not gone unnoticed, and I am deeply grateful for everything. It is people like you who make the world a better place.\n\nThank you from the bottom of my heart. I look forward to the opportunity to reciprocate your kindness someday. 🙏😊✨`,
  },
  Invitation: {
    short: (n, d) => `Hi ${n}! You're cordially invited! ${d ? d + " " : ""}Would love to have you there! 🎉💌`,
    medium: (n, d) => `Dear ${n},\n\nYou are warmly invited to join us! 🎉💌\n\n${d ? d + "\n\n" : ""}Your presence would make the occasion truly special. Please do let us know if you can make it.\n\nLooking forward to seeing you there! 🥳`,
    detailed: (n, d) => `Dear ${n},\n\nIt gives me great pleasure to extend this warm invitation to you! 🎉💌\n\n${d ? d + "\n\n" : ""}We would be truly honored by your presence at this special occasion. Your being there would add immense joy and meaning to the celebration.\n\nPlease feel free to bring your family along. We have made arrangements to ensure everyone has a wonderful time.\n\nKindly confirm your attendance at your earliest convenience so we can make the necessary arrangements.\n\nWe eagerly look forward to welcoming you! 🥳✨`,
  },
};

export default function AiWhatsappMessageWriter() {
  const [messageType, setMessageType] = useState<MessageType>("Festival Greeting");
  const [festival, setFestival] = useState<Festival>("Diwali");
  const [recipientName, setRecipientName] = useState("");
  const [details, setDetails] = useState("");
  const [results, setResults] = useState<{ short: string; medium: string; detailed: string } | null>(null);
  const [copiedKey, setCopiedKey] = useState("");

  const messageTypes: MessageType[] = ["Festival Greeting", "Birthday", "Anniversary", "Congratulations", "Condolence", "Business Follow-up", "Meeting Reminder", "Thank You", "Invitation"];
  const festivals: Festival[] = ["Diwali", "Holi", "Eid", "Christmas", "New Year"];

  const generate = () => {
    const name = recipientName.trim() || "Friend";
    if (messageType === "Festival Greeting") {
      const t = festivalTemplates[festival];
      setResults({
        short: t.short.replace(/\{name\}/g, name),
        medium: t.medium.replace(/\{name\}/g, name),
        detailed: t.detailed.replace(/\{name\}/g, name),
      });
    } else {
      const t = generalTemplates[messageType];
      setResults({
        short: t.short(name, details.trim()),
        medium: t.medium(name, details.trim()),
        detailed: t.detailed(name, details.trim()),
      });
    }
  };

  const copy = (text: string, key: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(""), 2000);
  };

  const versions = [
    { key: "short", label: "Short Version", color: "text-green-600" },
    { key: "medium", label: "Medium Version", color: "text-blue-600" },
    { key: "detailed", label: "Detailed Version", color: "text-purple-600" },
  ] as const;

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Message Type</label>
        <select className="calc-input" value={messageType} onChange={(e) => setMessageType(e.target.value as MessageType)}>
          {messageTypes.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      {messageType === "Festival Greeting" && (
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Festival</label>
          <select className="calc-input" value={festival} onChange={(e) => setFestival(e.target.value as Festival)}>
            {festivals.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Recipient Name</label>
          <input className="calc-input" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} placeholder="e.g. Priya" />
        </div>
        {messageType !== "Festival Greeting" && (
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Specific Details</label>
            <input className="calc-input" value={details} onChange={(e) => setDetails(e.target.value)} placeholder="e.g. for the promotion, about Thursday's meeting" />
          </div>
        )}
      </div>
      <button onClick={generate} className="btn-primary">Generate Messages</button>
      {results && (
        <div className="space-y-4">
          {versions.map(({ key, label, color }) => (
            <div key={key} className="result-card space-y-3">
              <div className="flex justify-between items-center">
                <span className={`text-sm font-bold ${color}`}>{label}</span>
                <button onClick={() => copy(results[key], key)} className="btn-secondary text-xs">
                  {copiedKey === key ? "Copied!" : "Copy"}
                </button>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                {results[key].split("\n").map((line, i) => (
                  <p key={i} className={`text-gray-800 text-sm ${line.trim() === "" ? "h-3" : ""}`}>{line}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
