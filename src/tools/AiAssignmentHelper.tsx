"use client";
import { useState, useMemo } from "react";

const subjects = ["Science", "History", "English", "Math", "Computer Science", "Economics"] as const;
const assignmentTypes = ["Essay", "Report", "Case Study", "Research Paper", "Presentation"] as const;

type Subject = (typeof subjects)[number];
type AssignmentType = (typeof assignmentTypes)[number];

interface Section {
  title: string;
  points: string[];
}

const outlineTemplates: Record<Subject, Record<AssignmentType, { sections: string[]; pointsMap: Record<string, string[]> }>> = {
  Science: {
    Essay: {
      sections: ["Introduction & Background", "Scientific Principles", "Key Experiments & Evidence", "Current Research & Developments", "Applications & Real-World Impact", "Challenges & Future Directions", "Conclusion"],
      pointsMap: {
        "Introduction & Background": ["Define the topic and its significance in science", "Historical context and discovery timeline", "Thesis statement outlining the essay's argument", "Brief overview of key concepts"],
        "Scientific Principles": ["Explain the fundamental laws/theories involved", "Key formulas and their derivations", "Relationship to broader scientific framework", "Common misconceptions addressed"],
        "Key Experiments & Evidence": ["Landmark experiments that proved the theory", "Methodology and experimental design used", "Data analysis and interpretation of results", "Reproducibility and peer review status"],
        "Current Research & Developments": ["Latest findings in the field", "New technologies enabling further discovery", "Ongoing debates and open questions"],
        "Applications & Real-World Impact": ["Industrial and technological applications", "Medical or environmental benefits", "Economic impact and commercial uses"],
        "Challenges & Future Directions": ["Current limitations of our understanding", "Ethical considerations and societal impact", "Predicted breakthroughs in next decade"],
        "Conclusion": ["Summary of key arguments presented", "Restate thesis with supporting evidence", "Call to action or future research suggestions"],
      },
    },
    Report: {
      sections: ["Executive Summary", "Introduction & Objectives", "Methodology", "Findings & Data Analysis", "Discussion", "Recommendations", "References & Appendix"],
      pointsMap: {
        "Executive Summary": ["Brief overview of the report's purpose", "Key findings summarized", "Main recommendations highlighted"],
        "Introduction & Objectives": ["Background of the topic", "Specific objectives of the report", "Scope and limitations defined", "Research questions stated"],
        Methodology: ["Research methods and tools used", "Data collection procedures", "Sample size and selection criteria"],
        "Findings & Data Analysis": ["Present data with charts and tables", "Statistical analysis results", "Key patterns and trends identified", "Comparison with existing literature"],
        Discussion: ["Interpretation of findings", "Implications for the field", "Limitations of the study"],
        Recommendations: ["Actionable suggestions based on findings", "Prioritized list of next steps", "Resources required for implementation"],
        "References & Appendix": ["List all cited sources in proper format", "Include raw data and supplementary material", "Glossary of technical terms"],
      },
    },
    "Case Study": {
      sections: ["Background & Context", "Problem Identification", "Methodology & Approach", "Analysis & Findings", "Solutions & Outcomes", "Lessons Learned", "Conclusion"],
      pointsMap: {
        "Background & Context": ["Overview of the case subject", "Relevant scientific background", "Timeline of events", "Stakeholders involved"],
        "Problem Identification": ["Core problem or research question", "Contributing factors", "Impact assessment"],
        "Methodology & Approach": ["Research methods used", "Data collection strategy", "Analytical framework applied"],
        "Analysis & Findings": ["Detailed analysis of data", "Key findings and observations", "Supporting evidence and references"],
        "Solutions & Outcomes": ["Solutions implemented or proposed", "Results achieved", "Comparison with expected outcomes"],
        "Lessons Learned": ["Key takeaways from the case", "Best practices identified", "Recommendations for similar scenarios"],
        Conclusion: ["Summary of the case study", "Final assessment and implications", "Future research suggestions"],
      },
    },
    "Research Paper": {
      sections: ["Abstract", "Introduction & Literature Review", "Research Methodology", "Results", "Discussion & Analysis", "Conclusion", "References"],
      pointsMap: {
        Abstract: ["Brief summary of the entire paper (150-250 words)", "Research question and methodology", "Key findings and conclusions"],
        "Introduction & Literature Review": ["Background and significance of the study", "Review of existing literature and gaps", "Research objectives and hypotheses", "Scope and limitations"],
        "Research Methodology": ["Research design and approach", "Data collection methods and instruments", "Sample selection and size justification", "Ethical considerations"],
        Results: ["Present findings with statistical analysis", "Tables, graphs and visual representations", "Comparison with hypotheses"],
        "Discussion & Analysis": ["Interpretation of results", "Comparison with previous studies", "Implications for the field", "Limitations acknowledged"],
        Conclusion: ["Summary of key findings", "Contribution to existing knowledge", "Recommendations for future research"],
        References: ["APA/MLA formatted bibliography", "Minimum 10-15 credible sources", "Include recent publications (last 5 years)"],
      },
    },
    Presentation: {
      sections: ["Title & Hook Slide", "Introduction & Overview", "Core Concepts", "Visual Data & Evidence", "Applications & Examples", "Interactive Q&A Points", "Summary & Takeaways"],
      pointsMap: {
        "Title & Hook Slide": ["Catchy title with relevant imagery", "Opening question or surprising fact", "Your name, date, and institution"],
        "Introduction & Overview": ["Agenda slide with topic outline", "Why this topic matters", "What the audience will learn"],
        "Core Concepts": ["Key theories and principles (2-3 slides)", "Visual diagrams and flowcharts", "Step-by-step explanations", "Real-world analogies"],
        "Visual Data & Evidence": ["Charts and graphs showing key data", "Before/after comparisons", "Infographics for complex information"],
        "Applications & Examples": ["Real-world case studies", "Demonstrations or experiments", "Industry applications"],
        "Interactive Q&A Points": ["Discussion prompts for the audience", "Quick quiz questions", "Thought experiments"],
        "Summary & Takeaways": ["Key points recap (3-5 bullets)", "Resources for further learning", "Thank you and contact information"],
      },
    },
  },
  History: {
    Essay: {
      sections: ["Introduction & Historical Context", "Causes & Background", "Key Events & Timeline", "Major Figures & Their Roles", "Impact & Consequences", "Legacy & Modern Relevance", "Conclusion"],
      pointsMap: {
        "Introduction & Historical Context": ["Set the time period and geographical scope", "Introduce the central theme or argument", "Thesis statement with clear position", "Brief mention of primary sources used"],
        "Causes & Background": ["Long-term causes and underlying tensions", "Short-term triggers and catalysts", "Social, economic, and political factors", "Comparative analysis with similar events"],
        "Key Events & Timeline": ["Chronological listing of major events", "Turning points and decisive moments", "Primary source evidence for each event"],
        "Major Figures & Their Roles": ["Key leaders and decision-makers", "Contributions and motivations of each", "Opposing viewpoints and conflicts"],
        "Impact & Consequences": ["Immediate aftermath and changes", "Long-term political and social effects", "Economic consequences"],
        "Legacy & Modern Relevance": ["How events shaped modern society", "Ongoing debates among historians", "Lessons applicable to current events"],
        Conclusion: ["Restate thesis with evidence summary", "Final assessment of historical significance", "Thought-provoking closing statement"],
      },
    },
    Report: {
      sections: ["Executive Summary", "Historical Background", "Source Analysis", "Chronological Account", "Thematic Analysis", "Conclusions & Lessons", "Bibliography"],
      pointsMap: {
        "Executive Summary": ["Overview of the report's focus period", "Key findings summarized", "Main arguments presented"],
        "Historical Background": ["Pre-existing conditions and context", "Key terminology defined", "Geographical and cultural setting"],
        "Source Analysis": ["Primary sources examined", "Secondary source evaluation", "Reliability and bias assessment"],
        "Chronological Account": ["Detailed timeline of events", "Cause-and-effect relationships", "Key dates and milestones", "Quotes from historical figures"],
        "Thematic Analysis": ["Political themes and power dynamics", "Social and cultural aspects", "Economic factors and trade impacts"],
        "Conclusions & Lessons": ["Summary of key historical lessons", "How events connect to present day", "Historiographical debates"],
        Bibliography: ["Primary and secondary sources listed", "Proper citation format (Chicago/APA)", "Annotated entries for key sources"],
      },
    },
    "Case Study": {
      sections: ["Historical Context", "The Event/Period in Focus", "Key Players & Stakeholders", "Analysis of Decisions", "Outcomes & Consequences", "Historical Interpretations", "Conclusion"],
      pointsMap: { "Historical Context": ["Era and geographical setting", "Political climate and social conditions", "Economic factors at play"], "The Event/Period in Focus": ["Detailed description of the case", "Timeline of key developments", "Primary source evidence"], "Key Players & Stakeholders": ["Leaders and their motivations", "Groups affected by events", "International perspectives"], "Analysis of Decisions": ["Critical decisions and their rationale", "Alternative paths not taken", "Factors influencing decision-makers"], "Outcomes & Consequences": ["Immediate results", "Long-term implications", "Unintended consequences"], "Historical Interpretations": ["Different historiographical views", "Revisionist perspectives", "Debates among scholars"], Conclusion: ["Assessment of the case's significance", "Lessons for modern policymakers", "Areas needing further research"] },
    },
    "Research Paper": {
      sections: ["Abstract", "Introduction & Historiography", "Methodology & Sources", "Historical Analysis", "Comparative Perspectives", "Conclusion", "References"],
      pointsMap: { Abstract: ["Summary of research question and scope", "Methodology overview", "Key findings"], "Introduction & Historiography": ["Research question and thesis", "Review of existing scholarship", "Gaps in current understanding", "Paper's contribution to the field"], "Methodology & Sources": ["Types of sources used (primary/secondary)", "Archival research methods", "Analytical framework"], "Historical Analysis": ["Detailed examination of evidence", "Thematic or chronological analysis", "Supporting quotes and data", "Counter-arguments addressed"], "Comparative Perspectives": ["Cross-cultural or cross-temporal comparisons", "Similarities and differences with other events", "Broader patterns identified"], Conclusion: ["Summary of arguments", "Significance of findings", "Future research directions"], References: ["Primary source archive details", "Secondary source bibliography", "Minimum 15-20 sources"] },
    },
    Presentation: {
      sections: ["Title & Opening Hook", "Setting the Scene", "Key Events Timeline", "Important Figures", "Impact Analysis", "Modern Connections", "Summary"],
      pointsMap: { "Title & Opening Hook": ["Engaging title with historical imagery", "Opening with a dramatic quote or fact", "Time period and location specified"], "Setting the Scene": ["Map or visual of the region", "Social and political context", "Key terms introduced"], "Key Events Timeline": ["Visual timeline (3-4 slides)", "Images and illustrations for each event", "Brief descriptions with dates"], "Important Figures": ["Portraits and brief bios", "Their roles and contributions", "Quotes from each figure"], "Impact Analysis": ["Before-and-after comparisons", "Statistical data on impact", "Visual representations of change"], "Modern Connections": ["How history connects to today", "Lessons still relevant", "Discussion prompts"], Summary: ["Key takeaways (3-5 points)", "Recommended readings/documentaries", "Discussion questions"] },
    },
  },
  English: {
    Essay: {
      sections: ["Introduction & Thesis", "Literary Context & Background", "Theme Analysis", "Character/Style Study", "Language & Literary Devices", "Critical Perspectives", "Conclusion"],
      pointsMap: { "Introduction & Thesis": ["Hook the reader with a relevant quote or question", "Introduce the text(s) being analyzed", "Clear thesis statement", "Brief roadmap of the essay"], "Literary Context & Background": ["Author's biography and influences", "Historical period and literary movement", "Publication context and reception"], "Theme Analysis": ["Identify major themes (2-3)", "Textual evidence for each theme", "How themes develop throughout the work", "Connection to universal human experience"], "Character/Style Study": ["Key characters and their development", "Narrative voice and perspective", "Author's writing style analysis"], "Language & Literary Devices": ["Metaphors, similes, and symbolism used", "Tone and mood analysis", "Irony, foreshadowing, and allegory"], "Critical Perspectives": ["Feminist, Marxist, or post-colonial readings", "Comparison with other critics' views", "Your personal critical assessment"], Conclusion: ["Restate thesis with evidence", "Broader significance of the text", "Thought-provoking closing insight"] },
    },
    Report: {
      sections: ["Summary", "Author & Context", "Plot/Content Analysis", "Themes & Motifs", "Language Analysis", "Critical Reception", "Personal Assessment"],
      pointsMap: { Summary: ["Brief synopsis of the work", "Genre and form identified", "Target audience"], "Author & Context": ["Author background", "Historical and cultural context", "Influences on the work"], "Plot/Content Analysis": ["Structure and organization", "Key scenes or passages", "Narrative arc"], "Themes & Motifs": ["Central themes explored", "Recurring motifs and symbols", "Message or moral"], "Language Analysis": ["Writing style characteristics", "Notable literary techniques", "Vocabulary and register"], "Critical Reception": ["Published reviews and criticism", "Awards and recognition", "Scholarly interpretations"], "Personal Assessment": ["Strengths and weaknesses", "Relevance to modern readers", "Recommendation and rating"] },
    },
    "Case Study": {
      sections: ["Introduction to the Text", "Author's Background", "Literary Analysis", "Theme Exploration", "Comparative Analysis", "Impact & Legacy", "Conclusion"],
      pointsMap: { "Introduction to the Text": ["Title, author, date, and genre", "Brief plot summary", "Why this text was chosen"], "Author's Background": ["Life events influencing the work", "Other major works", "Literary movement affiliation"], "Literary Analysis": ["Narrative technique and structure", "Character development", "Use of literary devices"], "Theme Exploration": ["Major themes with textual evidence", "How themes reflect society", "Personal interpretation"], "Comparative Analysis": ["Similar works by other authors", "Intertextual connections", "Genre conventions followed or broken"], "Impact & Legacy": ["Influence on later literature", "Cultural impact", "Adaptations in other media"], Conclusion: ["Key analytical insights", "Text's lasting significance", "Further reading suggestions"] },
    },
    "Research Paper": {
      sections: ["Abstract", "Introduction & Literature Review", "Theoretical Framework", "Textual Analysis", "Discussion", "Conclusion", "Works Cited"],
      pointsMap: { Abstract: ["Research focus and methodology", "Key arguments presented", "Conclusions reached"], "Introduction & Literature Review": ["Research question defined", "Survey of existing criticism", "Gap in scholarship identified", "Paper's contribution stated"], "Theoretical Framework": ["Critical theory applied", "Key theorists referenced", "Justification for approach"], "Textual Analysis": ["Close reading of key passages", "Evidence-based arguments", "Multiple interpretive lenses", "Counter-arguments addressed"], Discussion: ["Synthesis of findings", "Broader literary implications", "Limitations of analysis"], Conclusion: ["Summary of arguments", "Significance for literary studies", "Future research possibilities"], "Works Cited": ["MLA format citations", "Primary and secondary sources", "Minimum 10-12 scholarly sources"] },
    },
    Presentation: {
      sections: ["Title & Engaging Opening", "Meet the Author", "Plot/Content Overview", "Deep Dive into Themes", "Language & Style Showcase", "Why It Matters Today", "Discussion & Wrap-up"],
      pointsMap: { "Title & Engaging Opening": ["Creative title related to the work", "Opening quote from the text", "Visual hook (book cover, author photo)"], "Meet the Author": ["Brief biography with photos", "Key life events and influences", "Major works timeline"], "Plot/Content Overview": ["Visual summary (character map, timeline)", "Key scenes highlighted", "No spoilers if applicable"], "Deep Dive into Themes": ["2-3 themes with textual evidence", "Visual metaphors for themes", "Discussion questions per theme"], "Language & Style Showcase": ["Example passages on slides", "Literary device identification", "Before-after comparisons"], "Why It Matters Today": ["Connections to modern issues", "Adaptations and cultural references", "Reader reviews and opinions"], "Discussion & Wrap-up": ["Interactive discussion prompts", "Key takeaways summarized", "Recommended further reading"] },
    },
  },
  Math: {
    Essay: {
      sections: ["Introduction & Mathematical Context", "Historical Development", "Core Concepts & Theorems", "Proofs & Derivations", "Applications & Real-World Uses", "Current Research", "Conclusion"],
      pointsMap: { "Introduction & Mathematical Context": ["Define the mathematical topic clearly", "Why this area of math matters", "Thesis or central argument", "Prerequisites for understanding"], "Historical Development": ["Origin of the concept/theorem", "Key mathematicians who contributed", "Evolution of understanding over time"], "Core Concepts & Theorems": ["Fundamental definitions and axioms", "Key theorems with statements", "Relationships between concepts", "Visual representations where applicable"], "Proofs & Derivations": ["Step-by-step proof of key theorem", "Alternative proof methods", "Elegant shortcuts and insights"], "Applications & Real-World Uses": ["Engineering applications", "Computer science implementations", "Financial modeling uses"], "Current Research": ["Open problems in the field", "Recent breakthroughs", "Interdisciplinary connections"], Conclusion: ["Summary of mathematical significance", "Impact on other fields", "Future potential"] },
    },
    Report: {
      sections: ["Executive Summary", "Problem Statement", "Mathematical Framework", "Solution Methods", "Results & Analysis", "Applications", "Conclusions"],
      pointsMap: { "Executive Summary": ["Overview of the mathematical problem", "Methods used and key results", "Practical implications"], "Problem Statement": ["Clear mathematical formulation", "Constraints and assumptions", "Variables and notation defined"], "Mathematical Framework": ["Relevant theorems and formulas", "Derivations needed", "Proof of key results"], "Solution Methods": ["Step-by-step solution process", "Alternative approaches compared", "Computational methods used"], "Results & Analysis": ["Solutions with verification", "Graphical representations", "Error analysis and bounds"], Applications: ["Practical examples and use cases", "Industry applications", "Code implementations"], Conclusions: ["Summary of findings", "Method effectiveness comparison", "Recommendations for further study"] },
    },
    "Case Study": {
      sections: ["Problem Introduction", "Mathematical Background", "Problem Formulation", "Solution Strategy", "Detailed Solution", "Verification & Analysis", "Conclusion"],
      pointsMap: { "Problem Introduction": ["Real-world scenario described", "Why this problem is interesting", "Expected outcomes"], "Mathematical Background": ["Relevant mathematical concepts", "Formulas and theorems needed", "Historical context of the problem"], "Problem Formulation": ["Translation to mathematical model", "Variables and constraints identified", "Assumptions stated"], "Solution Strategy": ["Approach selection and justification", "Step-by-step plan", "Tools and techniques chosen"], "Detailed Solution": ["Complete worked solution", "Each step explained", "Intermediate results shown", "Graphs and diagrams included"], "Verification & Analysis": ["Solution verification methods", "Sensitivity analysis", "Comparison with known results"], Conclusion: ["Key insights gained", "Generalization possibilities", "Lessons for similar problems"] },
    },
    "Research Paper": {
      sections: ["Abstract", "Introduction", "Preliminaries", "Main Results", "Proofs", "Conclusion", "References"],
      pointsMap: { Abstract: ["Problem statement and significance", "Methods and key results", "Applications mentioned"], Introduction: ["Motivation and background", "Literature review of related work", "Paper's contributions listed"], Preliminaries: ["Definitions and notation", "Known theorems used", "Foundational lemmas"], "Main Results": ["Statement of new theorems", "Corollaries and implications", "Examples illustrating results", "Comparison with existing results"], Proofs: ["Rigorous mathematical proofs", "Lemmas proved separately", "Special cases handled"], Conclusion: ["Summary of contributions", "Open questions raised", "Future research directions"], References: ["Mathematics journals cited", "Textbooks referenced", "Minimum 10 sources in field"] },
    },
    Presentation: {
      sections: ["Title & Math Hook", "Problem Introduction", "Building Blocks", "Step-by-Step Solution", "Visual Representations", "Applications Showcase", "Summary & Challenge"],
      pointsMap: { "Title & Math Hook": ["Catchy title with mathematical elegance", "Opening puzzle or paradox", "Why this topic is fascinating"], "Problem Introduction": ["Clear problem statement", "Visual representation of the problem", "Real-world connection"], "Building Blocks": ["Key definitions (one per slide)", "Essential formulas highlighted", "Visual aids for abstract concepts"], "Step-by-Step Solution": ["Animated step-by-step walkthrough", "Color-coded operations", "Checkpoints for understanding", "Common mistakes to avoid"], "Visual Representations": ["Graphs and plots", "Geometric illustrations", "Interactive demonstrations"], "Applications Showcase": ["3-4 real-world applications", "Industry examples", "Code snippets if applicable"], "Summary & Challenge": ["Key formulas recap", "Practice problem for the audience", "Resources for further learning"] },
    },
  },
  "Computer Science": {
    Essay: {
      sections: ["Introduction & Relevance", "Technical Background", "Core Algorithms & Concepts", "Implementation Considerations", "Current Trends & Research", "Ethical & Social Implications", "Conclusion"],
      pointsMap: { "Introduction & Relevance": ["Define the CS topic and its importance", "Current industry relevance", "Thesis statement", "Scope of discussion"], "Technical Background": ["Foundational concepts and prerequisites", "Historical development of the technology", "Key terminology and definitions"], "Core Algorithms & Concepts": ["Main algorithms explained", "Time and space complexity analysis", "Pseudocode or flowcharts", "Comparison of approaches"], "Implementation Considerations": ["Programming language choices", "System architecture decisions", "Scalability and performance factors"], "Current Trends & Research": ["Latest developments in the field", "Industry adoption and use cases", "Active research areas"], "Ethical & Social Implications": ["Privacy and security concerns", "Impact on employment and society", "Responsible development practices"], Conclusion: ["Summary of key technical points", "Future outlook for the technology", "Recommendations for practitioners"] },
    },
    Report: {
      sections: ["Abstract", "System Overview", "Technical Architecture", "Implementation Details", "Testing & Results", "Performance Analysis", "Conclusion & Future Work"],
      pointsMap: { Abstract: ["Project summary and objectives", "Technologies used", "Key outcomes"], "System Overview": ["Problem being solved", "Requirements specification", "Use cases and user stories"], "Technical Architecture": ["System architecture diagram", "Database design", "API specifications", "Technology stack justification"], "Implementation Details": ["Core modules and functions", "Code snippets for key logic", "Third-party libraries used"], "Testing & Results": ["Test cases and coverage", "Bug tracking and resolution", "User acceptance testing results"], "Performance Analysis": ["Benchmarking results", "Optimization techniques applied", "Scalability assessment"], "Conclusion & Future Work": ["Achievements summary", "Known limitations", "Planned enhancements"] },
    },
    "Case Study": {
      sections: ["Problem Description", "Technology Stack", "Architecture Design", "Implementation Approach", "Challenges & Solutions", "Results & Metrics", "Lessons Learned"],
      pointsMap: { "Problem Description": ["Business problem or user need", "Existing solutions and their gaps", "Project goals and success criteria"], "Technology Stack": ["Frontend and backend technologies", "Database and cloud services", "Development tools and CI/CD"], "Architecture Design": ["High-level architecture diagram", "Microservices or monolith decision", "Data flow and integration points"], "Implementation Approach": ["Agile methodology applied", "Sprint planning and execution", "Code review and quality practices"], "Challenges & Solutions": ["Technical challenges encountered", "Solutions implemented", "Trade-offs made"], "Results & Metrics": ["Performance benchmarks achieved", "User adoption metrics", "Cost and efficiency improvements"], "Lessons Learned": ["What worked well", "What could be improved", "Recommendations for similar projects"] },
    },
    "Research Paper": {
      sections: ["Abstract", "Introduction & Related Work", "Proposed Approach", "System Design", "Experimental Evaluation", "Conclusion", "References"],
      pointsMap: { Abstract: ["Research problem and motivation", "Proposed solution approach", "Key experimental results"], "Introduction & Related Work": ["Problem significance", "Survey of existing solutions", "Limitations of current approaches", "Paper's novel contributions"], "Proposed Approach": ["Algorithm or system design", "Theoretical foundation", "Novelty explained"], "System Design": ["Architecture and components", "Implementation details", "Complexity analysis"], "Experimental Evaluation": ["Experimental setup and datasets", "Baseline comparisons", "Results with metrics", "Statistical significance"], Conclusion: ["Summary of contributions", "Limitations acknowledged", "Future research directions"], References: ["ACM/IEEE formatted citations", "Recent conference and journal papers", "Minimum 15-20 references"] },
    },
    Presentation: {
      sections: ["Title & Tech Hook", "Problem Statement", "Solution Architecture", "Live Demo / Code Walkthrough", "Performance Results", "Future Roadmap", "Q&A"],
      pointsMap: { "Title & Tech Hook": ["Eye-catching title", "Interesting statistic or use case", "Technology logos and visuals"], "Problem Statement": ["User pain points illustrated", "Market need or research gap", "Goals of the project"], "Solution Architecture": ["System architecture diagram", "Technology stack visual", "Data flow explanation"], "Live Demo / Code Walkthrough": ["Key features demonstrated", "Code snippets on slides", "Before/after comparisons", "User interface screenshots"], "Performance Results": ["Benchmark charts and graphs", "Comparison with alternatives", "User feedback highlights"], "Future Roadmap": ["Planned features and improvements", "Scalability plans", "Open-source or community plans"], "Q&A": ["Prepared for common questions", "Technical deep-dive slides ready", "Contact and repository links"] },
    },
  },
  Economics: {
    Essay: {
      sections: ["Introduction & Economic Context", "Theoretical Framework", "Data & Evidence Analysis", "Policy Implications", "Case Studies", "Criticisms & Alternative Views", "Conclusion"],
      pointsMap: { "Introduction & Economic Context": ["Define the economic issue or question", "Current relevance and timeliness", "Thesis statement with clear position", "Scope of analysis defined"], "Theoretical Framework": ["Relevant economic theories", "Key models and their assumptions", "Historical development of the theory"], "Data & Evidence Analysis": ["Statistical data and trends", "Charts and graphs with analysis", "Cross-country comparisons", "Time-series analysis"], "Policy Implications": ["Government policy recommendations", "Fiscal and monetary considerations", "Short-term vs long-term impacts"], "Case Studies": ["Country or industry examples", "Success and failure cases", "Lessons from real-world implementation"], "Criticisms & Alternative Views": ["Counter-arguments to main thesis", "Alternative economic perspectives", "Behavioral economics insights"], Conclusion: ["Summary of economic arguments", "Policy recommendations", "Areas needing further research"] },
    },
    Report: {
      sections: ["Executive Summary", "Market Overview", "Economic Indicators Analysis", "Sector Analysis", "Policy Review", "Forecasts & Projections", "Recommendations"],
      pointsMap: { "Executive Summary": ["Key economic findings", "Market conditions summary", "Main recommendations"], "Market Overview": ["GDP and growth trends", "Employment and inflation data", "Trade balance and currency trends"], "Economic Indicators Analysis": ["Leading indicators analysis", "Lagging indicators review", "Consumer and business sentiment", "Regional comparisons"], "Sector Analysis": ["Industry performance metrics", "Growth sectors identified", "Declining sectors and reasons"], "Policy Review": ["Current government policies", "Central bank decisions", "Regulatory changes and impact"], "Forecasts & Projections": ["Short-term outlook (1 year)", "Medium-term projections (3-5 years)", "Risk factors and scenarios"], Recommendations: ["Investment opportunities", "Risk mitigation strategies", "Policy suggestions"] },
    },
    "Case Study": {
      sections: ["Economic Context", "The Issue/Crisis", "Stakeholder Analysis", "Policy Responses", "Outcomes & Impact", "Comparative Analysis", "Lessons & Conclusions"],
      pointsMap: { "Economic Context": ["Macroeconomic environment", "Key indicators at the time", "Global economic conditions"], "The Issue/Crisis": ["Description of the economic event", "Root causes identified", "Timeline of developments"], "Stakeholder Analysis": ["Government responses and roles", "Central bank actions", "Impact on businesses and consumers"], "Policy Responses": ["Fiscal policy measures", "Monetary policy changes", "International coordination efforts"], "Outcomes & Impact": ["Economic recovery metrics", "Social impact assessment", "Long-term structural changes"], "Comparative Analysis": ["Similar events in other countries", "Different policy approaches compared", "What worked and what didn't"], "Lessons & Conclusions": ["Key economic lessons", "Policy recommendations", "Relevance to current challenges"] },
    },
    "Research Paper": {
      sections: ["Abstract", "Introduction & Literature Review", "Methodology", "Empirical Analysis", "Results & Discussion", "Conclusion", "References"],
      pointsMap: { Abstract: ["Research question and significance", "Methodology and data sources", "Key findings summarized"], "Introduction & Literature Review": ["Economic problem defined", "Review of existing research", "Gap in literature identified", "Paper's contribution stated"], Methodology: ["Econometric model specified", "Data sources and variables", "Estimation technique justified", "Robustness checks planned"], "Empirical Analysis": ["Descriptive statistics presented", "Regression results with tables", "Hypothesis testing outcomes", "Sensitivity analysis"], "Results & Discussion": ["Interpretation of coefficients", "Policy implications discussed", "Comparison with previous studies"], Conclusion: ["Summary of findings", "Limitations acknowledged", "Future research suggested"], References: ["Economics journals cited", "Working papers and reports", "Minimum 15-20 sources"] },
    },
    Presentation: {
      sections: ["Title & Economic Hook", "The Big Picture", "Data Visualization", "Theory & Models", "Real-World Examples", "Policy Discussion", "Summary & Debate"],
      pointsMap: { "Title & Economic Hook": ["Attention-grabbing statistic", "Relevant economic headline", "Clear topic introduction"], "The Big Picture": ["Key economic indicators", "Trend charts and graphs", "Why this matters now"], "Data Visualization": ["Interactive charts (2-3 slides)", "Infographics with key data", "Before-after comparisons"], "Theory & Models": ["Economic model explained simply", "Visual representation of theory", "Real-world application of model"], "Real-World Examples": ["Country or company case studies", "Success and failure examples", "Photos and news references"], "Policy Discussion": ["Current policies analyzed", "Alternative proposals presented", "Debate prompts for audience"], "Summary & Debate": ["Key takeaways (3-5 points)", "Open questions for discussion", "Recommended readings"] },
    },
  },
};

const wordCountRecs: Record<AssignmentType, string> = {
  Essay: "1500-2500 words",
  Report: "2000-3500 words",
  "Case Study": "1500-3000 words",
  "Research Paper": "3000-5000 words",
  Presentation: "15-25 slides (speaker notes: 1500-2000 words)",
};

const refFormats: Record<AssignmentType, string> = {
  Essay: "APA 7th Edition or MLA 9th Edition",
  Report: "APA 7th Edition",
  "Case Study": "Harvard Referencing",
  "Research Paper": "APA 7th Edition or IEEE",
  Presentation: "APA 7th Edition (on last slide)",
};

export default function AiAssignmentHelper() {
  const [subject, setSubject] = useState<Subject>("Science");
  const [topic, setTopic] = useState("");
  const [assignmentType, setAssignmentType] = useState<AssignmentType>("Essay");
  const [result, setResult] = useState<{ title: string; sections: Section[]; wordCount: string; refFormat: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const generate = () => {
    if (!topic.trim()) return;
    const template = outlineTemplates[subject][assignmentType];
    const title = `${topic} — A${assignmentType === "Essay" ? "n" : ""} ${assignmentType} on ${subject}`;
    const sections: Section[] = template.sections.map((s) => ({
      title: s,
      points: (template.pointsMap[s] || []).map((p) => p.replace(/the topic/gi, topic).replace(/the text/gi, topic)),
    }));
    setResult({ title, sections, wordCount: wordCountRecs[assignmentType], refFormat: refFormats[assignmentType] });
  };

  const fullText = useMemo(() => {
    if (!result) return "";
    let text = `Title: ${result.title}\nSubject: ${subject} | Type: ${assignmentType}\nRecommended Length: ${result.wordCount}\nReferences Format: ${result.refFormat}\n\n`;
    result.sections.forEach((s, i) => {
      text += `${i + 1}. ${s.title}\n`;
      s.points.forEach((p) => { text += `   • ${p}\n`; });
      text += "\n";
    });
    return text;
  }, [result, subject, assignmentType]);

  const copyAll = () => {
    navigator.clipboard?.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Subject</label>
          <select className="calc-input" value={subject} onChange={(e) => setSubject(e.target.value as Subject)}>
            {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-2">Assignment Type</label>
          <select className="calc-input" value={assignmentType} onChange={(e) => setAssignmentType(e.target.value as AssignmentType)}>
            {assignmentTypes.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="text-sm font-semibold text-gray-700 block mb-2">Topic</label>
        <input className="calc-input" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., Photosynthesis, World War II, Machine Learning..." />
      </div>
      <button onClick={generate} className="btn-primary">Generate Assignment Outline</button>

      {result && (
        <div className="space-y-4">
          <div className="result-card">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-bold text-gray-800">{result.title}</h3>
              <button onClick={copyAll} className="text-xs text-indigo-600 font-medium hover:underline">{copied ? "Copied!" : "Copy Full Outline"}</button>
            </div>
            <div className="flex flex-wrap gap-3 mb-4 text-xs">
              <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded">Length: {result.wordCount}</span>
              <span className="bg-green-50 text-green-700 px-2 py-1 rounded">Refs: {result.refFormat}</span>
            </div>
            {result.sections.map((s, i) => (
              <div key={i} className="mb-4">
                <h4 className="font-semibold text-gray-700 mb-1">{i + 1}. {s.title}</h4>
                <ul className="ml-4 space-y-1">
                  {s.points.map((p, j) => (
                    <li key={j} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-indigo-400 mt-1">&#8226;</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
