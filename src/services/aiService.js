// AI Content Generation Service for NCPOR Polar Science Outreach
// Simulates LLM generation with prompt templates tailored for polar science communication

export const AI_AUDIENCE_TONES = [
  { id: "general", label: "General Public", desc: "Engaging, clear, accessible, relatable analogies" },
  { id: "student", label: "Students & Educators (Smart Education)", desc: "Educational, explanatory, inspiring, simplified concepts" },
  { id: "press", label: "Journalists & Media", desc: "Fact-dense, headline-driven, ready-to-quote, newsworthy" },
  { id: "policy", label: "Policy & Professional (LinkedIn)", desc: "Impact-oriented, strategic, highlighting national capabilities" }
];

export function buildPromptTemplate({ title, region, year, chiefScientist, rawText, audience, contentType }) {
  const systemPrompt = `You are the Lead Scientific Communications Specialist at the National Centre for Polar and Ocean Research (NCPOR), Ministry of Earth Sciences, Government of India.
Your mission is to translate complex polar and cryospheric scientific expeditions into captivating, accurate, and accessible outreach content.
Follow Government of India and MoES official communication dignity and factual precision.`;

  let taskPrompt = "";
  if (contentType === "summary") {
    taskPrompt = `Task: Create a 2-3 paragraph public-friendly outreach summary.
Audience: ${audience}
Expedition: ${title} (${region}, ${year})
Chief Scientist: ${chiefScientist || "NCPOR Research Team"}
Source Technical Notes:
${rawText || "Multidisciplinary observations conducted across polar stations."}

Guidelines:
- Explain what was done, why it matters to everyday citizens, and the human courage involved.
- Avoid excessive jargon or immediately unpack scientific terms.
- Emphasize India's leadership in polar and climate research.`;
  } else if (contentType === "social") {
    taskPrompt = `Task: Generate platform-optimized social media posts for Twitter/X, Instagram, and LinkedIn.
Expedition: ${title} (${region})
Source Summary:
${rawText}

Requirements:
- Twitter/X: Under 280 characters, crisp hook, 3-4 trending hashtags (#PolarScience #NCPOR #MoES).
- Instagram: Engaging 3-paragraph narrative, emoji storytelling, call-to-action question, dedicated hashtag cloud.
- LinkedIn: Executive tone, highlighting scientific sovereignty, international cooperation, and climate policy relevance.`;
  } else if (contentType === "altText") {
    taskPrompt = `Task: Generate WCAG-AA compliant concise, highly descriptive accessibility Alt-Text for polar imagery.
Context: ${title} in ${region}. Focus on scientific equipment, personnel, environmental features, and lighting.`;
  }

  return { systemPrompt, taskPrompt };
}

// Generation engine with realistic stream / delay
export async function generateOutreachPackage({ expedition, audience = "general", customNotes = "" }) {
  // Artificial delay to simulate LLM API latency
  await new Promise((resolve) => setTimeout(resolve, 1400));

  const region = expedition.region || "Antarctica";
  const title = expedition.title;
  const year = expedition.year || 2024;
  const stationList = (expedition.stations || ["Indian Polar Base"]).join(", ");

  let summary = "";
  let twitter = "";
  let instagram = "";
  let linkedin = "";
  let factCards = [];

  if (audience === "student") {
    summary = `Imagine stepping into a world where winter temperatures plunge to -40°C and the Sun doesn't rise for months! During the ${title}, Indian scientists worked courageously at ${stationList} to uncover secrets hidden inside polar ice and freezing oceans. By studying ancient ice layers and unique polar wildlife, our researchers are learning how Earth's climate engine works and how we can protect our home planet for generations to come.`;
    twitter = `🧊 Did you know polar ice traps ancient bubbles of air from thousands of years ago? Indian scientists on the ${title} are decoding climate history at ${region}! 🇮🇳❄️ #SmartEducation #NCPOR #ScienceForStudents #IndiaInPolar`;
    instagram = `Calling all future polar explorers! ❄️🐧\n\nEver wondered what it's like to live at the edge of the world? During the ${title}, Indian researchers braved freezing blizzards to study ice, auroras, and polar wildlife!\n\n💡 Cool Fact: Ice cores drilled by our scientists act like ancient frozen history books!\n\nWhat would YOU research if you visited ${region}? Tell us in the comments! 👇\n\n#PolarScience #NCPOR #SmartEducation #FutureScientists #IndianResearch`;
    linkedin = `Empowering the next generation of climate leaders through polar science! 🇮🇳\n\nNCPOR's outreach team is proud to share educational milestones from the ${title}. Through open-access data and classroom explainers, we are inspiring young Indian students to explore careers in oceanography, glaciology, and climate stewardship.\n\n#SmartIndia #NCPOR #MoES #StemEducation #PolarResearch`;
    factCards = [
      `Expedition operated in extreme polar conditions across ${stationList}.`,
      `Ice cores extracted serve as natural climate time capsules.`,
      `Research supports global understanding of weather systems and monsoons.`
    ];
  } else if (audience === "press") {
    summary = `NEW DELHI / GOA — The National Centre for Polar and Ocean Research (NCPOR), an autonomous institute under the Ministry of Earth Sciences (MoES), has unveiled key findings from the ${title}. Operating across ${stationList}, the mission achieved significant breakthroughs in cryospheric monitoring, atmospheric baseline measurements, and environmental stewardship, reinforcing India's strategic standing in polar scientific governance.`;
    twitter = `📰 PRESS RELEASE: @NCPOR_MoES announces major scientific milestones from the ${title} (${region}). High-precision cryospheric datasets and climate records now archived. 🇮🇳📊 #MoES #PressRelease #PolarResearch #IndiaScience`;
    instagram = `MEDIA HIGHLIGHT: India's Polar Research Milestones 🇮🇳📰\n\nKey scientific outcomes from the ${title} have been published by NCPOR / Ministry of Earth Sciences.\n\nFrom high-latitude observations to crucial atmospheric modeling, this mission represents a strategic leap in India's global polar footprint.\n\n🔗 Press kit and high-res media available at NCPOR Outreach Portal.\n\n#PressUpdate #NCPOR #MoES #NationalScience #India`;
    linkedin = `FOR IMMEDIATE RELEASE: Ministry of Earth Sciences (MoES) & NCPOR announce comprehensive deliverables from the ${title}.\n\nOperating in ${region}, the scientific corps successfully completed advanced telemetry deployments, environmental audits, and interdisciplinary data gathering. High-resolution press kits and open datasets are now accessible via the National Outreach Portal.\n\n#GovOfIndia #MoES #PressRelease #PolarScience #StrategicResearch`;
    factCards = [
      `Official scientific mission conducted under MoES mandate.`,
      `Delivered high-resolution open datasets and peer-reviewed outputs.`,
      `Validated zero-waste ecological standards under the Antarctic/Arctic treaty guidelines.`
    ];
  } else {
    // Default: General Public
    summary = `From the icy frontiers of ${region}, the ${title} brings home extraordinary scientific discoveries! Stationed at ${stationList}, Indian researchers braved extreme sub-zero weather to track how melting polar ice and shifting ocean currents directly connect to global weather patterns and India's seasonal monsoons. This expedition showcases the remarkable dedication of Indian scientists who live and work at the ends of the Earth to safeguard our climate future.`;
    twitter = `❄️ Breakthroughs from the frontier! The ${title} by @NCPOR_MoES has concluded with vital discoveries on climate resilience and polar ocean dynamics. 🇮🇳🧊 #PolarScience #NCPOR #IndiaIn${region.replace(/\s+/g, '')} #MoES`;
    instagram = `Journey to Earth's Most Extreme Frontier! 🧊✨\n\nMeet the incredible Indian scientists of the ${title} who lived and worked across ${stationList}.\n\nFrom extracting ancient ice records to monitoring polar ecosystems, their research helps us understand global climate changes that impact our everyday lives.\n\n👉 Explore the full expedition gallery and report at the link in bio!\n\n#NCPOR #PolarExploration #MoES #IndiaScience #ClimateAction #${region.replace(/\s+/g, '')}`;
    linkedin = `The National Centre for Polar and Ocean Research (NCPOR), Ministry of Earth Sciences, is pleased to highlight key scientific achievements from the ${title} (${region}).\n\nConducted across ${stationList}, this mission delivered vital observations in cryospheric dynamics, boundary-layer atmospheric physics, and ocean carbon fluxes.\n\nIndia continues to uphold highest scientific excellence and environmental stewardship in polar exploration.\n\n#NCPOR #MoES #PolarScience #ClimateLeadership #GovernmentOfIndia`;
    factCards = [
      `Mission conducted by multi-institutional Indian scientific team.`,
      `Deep observations link polar teleconnections with tropical climate systems.`,
      `Continuous zero-emission green energy tests deployed at polar research bases.`
    ];
  }

  // Vision Alt-Text generation for media
  const altTextSuggestions = (expedition.media || []).map((m, idx) => {
    if (m.type === "video") {
      return {
        mediaId: m.id,
        suggestedAlt: `High-definition documentary video footage showing scientific fieldwork and polar landscape during ${title}.`
      };
    }
    return {
      mediaId: m.id,
      suggestedAlt: `High-resolution photograph capturing ${m.caption || 'scientific polar research'} during the ${title} in ${region} at ${stationList}. Details show authentic scientific equipment and pristine polar environment.`
    };
  });

  return {
    summary,
    socialCaptions: {
      twitter,
      instagram,
      linkedin
    },
    factCards,
    altTextSuggestions,
    generatedAt: new Date().toISOString(),
    audience
  };
}

export function autoGenerateImageAlt(imageTitle, region, context = "") {
  return `Official NCPOR polar photograph showing ${imageTitle || 'scientific operation'} in the ${region} region. Features crisp high-contrast terrain, scientific research gear, and polar environmental conditions. ${context}`;
}
