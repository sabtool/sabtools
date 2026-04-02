"use client";
import { useState, useMemo } from "react";

type EventType = "wedding" | "birthday" | "engagement" | "housewarming" | "corporate";

interface ChecklistItem {
  id: string;
  task: string;
  timeline: string;
  done: boolean;
}

const checklists: Record<EventType, { timeline: string; tasks: string[] }[]> = {
  wedding: [
    { timeline: "3 Months Before", tasks: [
      "Finalize wedding date and venue", "Set total budget and allocations", "Book photographer and videographer",
      "Hire wedding planner or coordinator", "Create guest list (bride & groom side)", "Book caterer and finalize menu",
      "Order wedding invitations", "Book pandit/priest for ceremony", "Start shopping for wedding outfits",
      "Book mehndi and makeup artist",
    ]},
    { timeline: "1 Month Before", tasks: [
      "Send out wedding invitations", "Finalize decoration theme and vendor", "Book DJ/band for sangeet & reception",
      "Arrange accommodation for outstation guests", "Purchase jewelry and accessories", "Plan honeymoon and book tickets",
      "Finalize mehendi and haldi arrangements", "Order return gifts/favours", "Confirm all vendor bookings",
      "Trial makeup and hairstyle session",
    ]},
    { timeline: "1 Week Before", tasks: [
      "Final guest count confirmation", "Prepare seating arrangement", "Collect all outfits and accessories",
      "Confirm transportation for baraat", "Pack for honeymoon", "Final walkthrough with venue and caterer",
      "Prepare cash envelopes for tips/vendors", "Arrange parking for guests", "Confirm mehendi & sangeet schedule",
    ]},
    { timeline: "1 Day Before", tasks: [
      "Haldi ceremony preparation", "Mehendi ceremony", "Venue setup and decoration check",
      "Deliver welcome bags to guest hotel", "Final vendor coordination calls", "Rehearsal if needed",
      "Confirm next-day timeline with all parties", "Early night rest!",
    ]},
    { timeline: "Day Of", tasks: [
      "Bridal makeup and dressing", "Groom baraat preparation", "Mandap/stage setup verification",
      "Coordinate guest arrivals", "Wedding ceremony (pheras)", "Photography sessions",
      "Reception and dinner", "Vidaai ceremony", "Thank all vendors and helpers",
    ]},
  ],
  birthday: [
    { timeline: "3 Months Before", tasks: [
      "Set budget for the party", "Choose party theme", "Book venue or plan home party",
      "Create guest list", "Plan activities and games",
    ]},
    { timeline: "1 Month Before", tasks: [
      "Send invitations (physical/digital)", "Order cake and catering", "Book entertainer/DJ if needed",
      "Plan decorations and supplies", "Arrange return gifts/goodie bags",
    ]},
    { timeline: "1 Week Before", tasks: [
      "Confirm guest RSVPs", "Buy decoration items and balloons", "Finalize food and cake order",
      "Prepare playlist/music", "Arrange party games and prizes",
    ]},
    { timeline: "1 Day Before", tasks: [
      "Decorate the venue", "Prepare goodie bags", "Confirm cake pickup/delivery",
      "Set up photo booth area", "Charge camera and prepare for photos",
    ]},
    { timeline: "Day Of", tasks: [
      "Final decoration touches", "Welcome guests", "Cake cutting ceremony",
      "Serve food and refreshments", "Games and activities", "Distribute return gifts",
      "Thank guests and cleanup",
    ]},
  ],
  engagement: [
    { timeline: "3 Months Before", tasks: [
      "Set engagement budget", "Choose venue and date", "Book photographer",
      "Select ring and jewelry", "Create guest list",
    ]},
    { timeline: "1 Month Before", tasks: [
      "Send invitations", "Book caterer", "Plan decoration theme",
      "Outfit shopping for couple", "Arrange flowers and garlands",
    ]},
    { timeline: "1 Week Before", tasks: [
      "Confirm all bookings", "Final guest count", "Plan ring ceremony sequence",
      "Arrange seating", "Buy sweets and gifts for families",
    ]},
    { timeline: "1 Day Before", tasks: [
      "Venue decoration", "Confirm food delivery", "Prepare ring trays and accessories",
      "Iron and prepare outfits", "Rest well",
    ]},
    { timeline: "Day Of", tasks: [
      "Get ready and dressed", "Welcome guests", "Ring exchange ceremony",
      "Family blessings", "Photography session", "Dinner and celebration",
    ]},
  ],
  housewarming: [
    { timeline: "3 Months Before", tasks: [
      "Set date and budget", "Finalize interior setup", "Plan pooja arrangements",
      "Create guest list", "Book pandit for Griha Pravesh pooja",
    ]},
    { timeline: "1 Month Before", tasks: [
      "Send invitations", "Order pooja items and supplies", "Plan food menu",
      "Arrange seating and parking", "Buy housewarming decorations",
    ]},
    { timeline: "1 Week Before", tasks: [
      "Deep clean the house", "Confirm catering order", "Buy flowers and rangoli items",
      "Prepare pooja thali", "Confirm guest RSVPs",
    ]},
    { timeline: "1 Day Before", tasks: [
      "Decorate entrance with toran", "Arrange furniture for guests", "Prepare rangoli",
      "Set up pooja area", "Organize kitchen for catering",
    ]},
    { timeline: "Day Of", tasks: [
      "Griha Pravesh pooja", "Boil milk ritual", "Welcome guests with tilak",
      "House tour for guests", "Serve food and sweets", "Thank guests",
    ]},
  ],
  corporate: [
    { timeline: "3 Months Before", tasks: [
      "Define event objectives and KPIs", "Set budget and get approvals", "Choose venue and date",
      "Book keynote speakers/presenters", "Plan event agenda and schedule",
    ]},
    { timeline: "1 Month Before", tasks: [
      "Send invitations and manage RSVPs", "Book AV equipment and tech setup", "Arrange catering and refreshments",
      "Design event branding and materials", "Plan networking activities",
    ]},
    { timeline: "1 Week Before", tasks: [
      "Confirm all speaker and vendor arrangements", "Print badges and materials", "Tech rehearsal and AV check",
      "Finalize seating plan", "Prepare welcome kits",
    ]},
    { timeline: "1 Day Before", tasks: [
      "Setup venue and signage", "Test all equipment", "Brief event staff and volunteers",
      "Arrange registration desk", "Final walkthrough",
    ]},
    { timeline: "Day Of", tasks: [
      "Early arrival and final checks", "Guest registration", "Welcome address",
      "Main program execution", "Networking/coffee breaks", "Closing remarks and feedback forms",
      "Post-event cleanup and vendor settlement",
    ]},
  ],
};

const eventLabels: Record<EventType, string> = {
  wedding: "Wedding",
  birthday: "Birthday Party",
  engagement: "Engagement",
  housewarming: "Housewarming (Griha Pravesh)",
  corporate: "Corporate Event",
};

const eventIcons: Record<EventType, string> = {
  wedding: "💒", birthday: "🎂", engagement: "💍", housewarming: "🏠", corporate: "💼",
};

export default function EventChecklistGenerator() {
  const [eventType, setEventType] = useState<EventType>("wedding");
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const items = useMemo(() => {
    const result: ChecklistItem[] = [];
    checklists[eventType].forEach((section) => {
      section.tasks.forEach((task, i) => {
        const id = `${eventType}-${section.timeline}-${i}`;
        result.push({ id, task, timeline: section.timeline, done: checkedItems.has(id) });
      });
    });
    return result;
  }, [eventType, checkedItems]);

  const toggleItem = (id: string) => {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const totalItems = items.length;
  const doneItems = items.filter((i) => i.done).length;
  const progressPercent = totalItems > 0 ? Math.round((doneItems / totalItems) * 100) : 0;

  const resetChecklist = () => setCheckedItems(new Set());

  return (
    <div className="space-y-8">
      {/* Event Type Selector */}
      <div>
        <label className="text-sm font-semibold text-gray-700 mb-3 block">Select Event Type</label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {(Object.keys(eventLabels) as EventType[]).map((type) => (
            <button
              key={type}
              onClick={() => { setEventType(type); resetChecklist(); }}
              className={`p-3 rounded-xl text-center text-sm font-medium transition-all ${
                eventType === type ? "btn-primary" : "btn-secondary"
              }`}
            >
              <div className="text-xl mb-1">{eventIcons[type]}</div>
              {eventLabels[type]}
            </button>
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="result-card space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800">
            {eventIcons[eventType]} {eventLabels[eventType]} Checklist
          </h3>
          <button onClick={resetChecklist} className="btn-secondary text-xs px-3 py-1">Reset All</button>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-4 rounded-full bg-gray-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-sm font-bold text-indigo-600 whitespace-nowrap">{progressPercent}%</span>
        </div>
        <div className="text-sm text-gray-500">
          {doneItems} of {totalItems} tasks completed
        </div>
      </div>

      {/* Checklist by Timeline */}
      {checklists[eventType].map((section) => {
        const sectionItems = items.filter((i) => i.timeline === section.timeline);
        const sectionDone = sectionItems.filter((i) => i.done).length;
        const allDone = sectionDone === sectionItems.length;
        return (
          <div key={section.timeline} className="result-card space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-gray-800">{section.timeline}</h4>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                allDone ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
              }`}>
                {sectionDone}/{sectionItems.length}
              </span>
            </div>
            <div className="space-y-2">
              {sectionItems.map((item) => (
                <label
                  key={item.id}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                    item.done ? "bg-green-50 border border-green-200" : "bg-white border border-gray-100 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={item.done}
                    onChange={() => toggleItem(item.id)}
                    className="w-5 h-5 rounded accent-indigo-600"
                  />
                  <span className={`text-sm ${item.done ? "line-through text-gray-400" : "text-gray-700"}`}>
                    {item.task}
                  </span>
                </label>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
