// AI Content Generation Service for NCPOR Polar Science Outreach
// Generates multi-platform social media and website packages for reports, datasets, publications, activities & expeditions

export const AI_AUDIENCE_TONES = [
  { id: "general", label: "General Public", desc: "Engaging, clear, accessible, relatable analogies" },
  { id: "student", label: "Students & Educators (Smart Education)", desc: "Educational, explanatory, inspiring, simplified concepts" },
  { id: "press", label: "Journalists & Media", desc: "Fact-dense, headline-driven, ready-to-quote, newsworthy" },
  { id: "policy", label: "Policy & Professional (LinkedIn)", desc: "Impact-oriented, strategic, highlighting national capabilities" }
];

export function buildPromptTemplate({ title, region, year, chiefScientist, rawText, audience, contentType, assetType = "expedition" }) {
  const systemPrompt = `You are the Lead Scientific Communications Specialist at the National Centre for Polar and Ocean Research (NCPOR), Ministry of Earth Sciences, Government of India.
Your mission is to translate complex polar and cryospheric scientific archives (${assetType}) into captivating, accurate, accessible, and high-impact outreach content.
Follow Government of India and MoES official communication dignity and factual precision.`;

  let taskPrompt = "";
  if (contentType === "summary") {
    taskPrompt = `Task: Create a 2-3 paragraph public-friendly outreach summary.
Audience: ${audience}
Asset: ${title} (${region}, ${year}) [Type: ${assetType}]
Lead / Authors: ${chiefScientist || "NCPOR Research Team"}
Source Technical Data:
${rawText || "Scientific observation and research archives."}

Guidelines:
- Explain what was discovered/archived, why it matters to everyday citizens, and national scientific value.
- Avoid excessive jargon or immediately unpack scientific terms.
- Emphasize India's leadership in polar, cryosphere, and climate research.`;
  } else if (contentType === "social") {
    taskPrompt = `Task: Generate platform-optimized social media posts for Twitter/X, Instagram, and LinkedIn.
Asset: ${title} (${region}) [Type: ${assetType}]
Source Summary:
${rawText}

Requirements:
- Twitter/X: Under 280 characters, crisp hook, 3-4 trending hashtags (#PolarScience #NCPOR #MoES #OpenData).
- Instagram: Engaging 3-paragraph narrative, emoji storytelling, call-to-action question, dedicated hashtag cloud.
- LinkedIn: Executive tone, highlighting scientific sovereignty, open data access, and climate policy relevance.`;
  } else if (contentType === "altText") {
    taskPrompt = `Task: Generate WCAG-AA compliant concise, highly descriptive accessibility Alt-Text for polar imagery.
Context: ${title} in ${region}. Focus on scientific equipment, personnel, environmental features, and lighting.`;
  }

  return { systemPrompt, taskPrompt };
}

// Generation engine with realistic stream / delay
export async function generateOutreachPackage({ expedition, asset, assetType = "expedition", audience = "general" }) {
  const target = asset || expedition || {};
  await new Promise((resolve) => setTimeout(resolve, 800));

  const region = target.region || "Antarctica";
  const title = target.title || "Polar Science Archive";
  const year = target.year || 2024;
  const stationList = Array.isArray(target.stations) ? target.stations.join(", ") : (target.station || target.spatialCoverage || "Indian Polar Base");

  let summary = `Archive records for ${title} (${year}).`;
  let twitter = "";
  let instagram = "";
  let linkedin = "";
  let factCards = [];

  if (assetType === "dataset") {
    const params = Array.isArray(target.parameters) ? target.parameters.slice(0, 4).join(", ") : "environmental variables";
    if (audience === "student") {
      summary = `Curious about what the Earth's climate was like thousands of years ago or how cold polar oceans flow? Indian scientists at NCPOR have released an open scientific dataset: "${title}". Measuring key parameters like ${params}, this data allows students and young researchers anywhere in India to download real polar climate numbers and explore our changing planet!`;
      twitter = `📊 Open Science for Students! @NCPOR_MoES has archived "${title}". Explore real polar data (${params}) from ${region}! 🇮🇳❄️ #SmartEducation #OpenData #NCPOR #ScienceForYouth`;
      instagram = `Want to analyze real polar science data? 📊🧊\n\nNCPOR has just published a brand new open-access scientific dataset: "${title}"!\n\n🔍 What it tracks: ${params}\n📍 Location: ${region}\n\nDownload it from the NCPOR Outreach Portal and conduct your own classroom climate experiments! 👉 Link in bio.\n\n#PolarData #NCPOR #OpenScience #StemIndia #ClimateEducation`;
      linkedin = `Democratizing polar science through FAIR Open Data principles! 🇮🇳\n\nNCPOR announces the public release of "${title}" (DOI: ${target.doi || '10.5281/zenodo'}).\n\nParameters: ${params}\nCoverage: ${target.spatialCoverage || region}\n\nAvailable under open access licensing for universities, climate researchers, and global modeling consortia.\n\n#OpenScience #NCPOR #MoES #ClimateData #Geosciences`;
      factCards = [
        `Features open-access parameters: ${params}.`,
        `Directly calibrated from in-situ polar sensors and field instruments.`,
        `Available in standard interoperable formats (NetCDF/CSV) for researchers.`
      ];
    } else if (audience === "press") {
      summary = `NEW DELHI / GOA — In line with the Government of India's Open Data Initiative, NCPOR (Ministry of Earth Sciences) has archived and released the scientific dataset: "${title}". Spanning high-latitude observations in ${region}, the dataset provides critical inputs on ${params} for global climate prediction and monsoon teleconnection models.`;
      twitter = `📰 DATA RELEASE: @NCPOR_MoES archives open scientific dataset "${title}" (${region}). Crucial climate & cryospheric parameters (${params}) now accessible. 📊🇮🇳 #OpenData #MoES #PressRelease`;
      instagram = `PRESS UPDATE: Open Polar Science Dataset Released 🇮🇳📊\n\nNCPOR / Ministry of Earth Sciences has published high-resolution environmental data: "${title}".\n\nAccess comprehensive observations on ${params} to evaluate long-term polar environmental changes.\n\n#NCPOR #MoES #PressUpdate #DataArchive #PolarResearch`;
      linkedin = `FOR IMMEDIATE RELEASE: Ministry of Earth Sciences & NCPOR release authoritative cryospheric/oceanographic dataset "${title}".\n\nFeaturing verified parameters (${params}) across ${region}, this dataset supports national climate resilience assessments and international scientific commitments under Antarctic and Arctic treaties.\n\n#MoES #GovOfIndia #OpenData #PressRelease #PolarScience`;
      factCards = [
        `Published under CC-BY Open Science licensing with permanent DOI.`,
        `Contains ${target.parameters?.length || 5}+ validated geophysical variables.`,
        `Ingested into global cryospheric and oceanographic archives.`
      ];
    } else {
      // General public
      summary = `Science belongs to everyone! NCPOR has archived a comprehensive polar dataset: "${title}". Collected during rigorous scientific missions in ${region}, this dataset unlocks accurate measurements of ${params}, providing undeniable evidence of how Earth's polar ice sheets and ocean currents are responding to global climate shifts.`;
      twitter = `🌐 Open Science Alert: @NCPOR_MoES has archived "${title}". Explore verified measurements (${params}) straight from ${region}! ❄️📊 #PolarScience #NCPOR #MoES #OpenAccess`;
      instagram = `Unlocking the secrets of the poles with open data! 🧊📈\n\nIndian researchers at ${stationList} have compiled and verified a landmark dataset: "${title}".\n\nFrom tracking ${params} to understanding polar climate interactions, this open data empowers citizens and researchers worldwide.\n\n👉 Inspect and download the full dataset on our portal!\n\n#OpenScience #NCPOR #MoES #DataArchive #ClimateAction`;
      linkedin = `The National Centre for Polar and Ocean Research (NCPOR), MoES, is pleased to announce the archival of "${title}".\n\nKey Parameters: ${params}\nSpatial Domain: ${target.spatialCoverage || region}\n\nEnsuring transparency, accessibility, and high reproducibility in polar and ocean research.\n\n#NCPOR #MoES #OpenScience #DataArchival #ClimateGovernance`;
      factCards = [
        `Verified by NCPOR scientific data managers.`,
        `High-resolution temporal and spatial observations in ${region}.`,
        `Directly downloadable via the NCPOR National Outreach Portal.`
      ];
    }
  } else if (assetType === "publication") {
    const authors = Array.isArray(target.authors) ? target.authors.join(", ") : (target.authors || "NCPOR Scientists");
    summary = `A new research milestone published in ${target.journal || 'leading scientific journal'}! The paper "${title}" by ${authors} presents groundbreaking discoveries in ${target.category || 'Polar Science'} from India's missions in ${region}.`;
    twitter = `📚 New Research Published: "${title}" in ${target.journal || 'peer-reviewed journal'} by @NCPOR_MoES researchers. DOI: ${target.doi || 'Available on portal'} 🇮🇳🔬 #PolarScience #Research #MoES`;
    instagram = `Scientific Breakthrough from the Poles! 🔬❄️\n\nIndian researchers have published a landmark study: "${title}" in ${target.journal || 'scientific journals'}.\n\nAuthors: ${authors}\nDiscipline: ${target.category || 'Cryosphere'}\n\nSwipe to read the key discoveries and see what our polar scientists have uncovered! 👉\n\n#NCPOR #ResearchPublication #MoES #IndianScientists #ScienceNews`;
    linkedin = `NCPOR & Ministry of Earth Sciences are pleased to highlight the recent publication:\n\n📄 "${title}"\n🏛️ Journal: ${target.journal || 'Peer-reviewed Journal'}\n👥 Authors: ${authors}\n🔗 DOI: ${target.doi || '10.1016/ncpor'}\n\nThis study provides vital empirical insights into ${target.category || 'polar processes'} and underscores India's active scientific leadership.`;
    factCards = [
      `Published in peer-reviewed journal ${target.journal || 'Scientific Reports'}.`,
      `Authored by multidisciplinary Indian researchers (${authors}).`,
      `Includes verified empirical field data and citations.`
    ];
  } else if (assetType === "activity") {
    summary = `NCPOR and the Ministry of Earth Sciences organized "${title}". This institutional initiative connects citizens, school students, and scientists to celebrate India's polar scientific achievements and inspire climate stewardship.`;
    twitter = `🇮🇳 Milestone Event: @NCPOR_MoES organized "${title}". Inspiring the nation through polar science & environmental education! ❄️✨ #NCPOR #MoES #PolarOutreach #NationalScience`;
    instagram = `Engaging Minds & Inspiring Polar Explorers! 🇮🇳✨\n\nHighlights from our recent institutional initiative: "${title}".\n\nFrom interactive science demonstrations to live researcher Q&As, we're bringing the wonders of the Arctic, Antarctica, and Himalayas to citizens across India!\n\n#NCPOR #PolarOutreach #ScienceForSociety #MoES #SmartEducation`;
    linkedin = `Outreach & Institutional Milestone: Ministry of Earth Sciences (MoES) & NCPOR conducted "${title}".\n\nPromoting scientific temper, student engagement, and public awareness of India's strategic research in Antarctica, the Arctic, and the Himalayan Third Pole.\n\n#NCPOR #MoES #PublicOutreach #ScienceDiplomacy #India`;
    factCards = [
      `National outreach initiative under MoES mandate.`,
      `Engaged thousands of students and citizen researchers.`,
      `Fostered scientific awareness about climate resilience.`
    ];
  } else {
    // Default: Expedition / Cruise report
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
      // General Public
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
  }

  // Vision Alt-Text generation for media
  const mediaItems = target.media || [];
  const altTextSuggestions = mediaItems.map((m) => {
    if (m.type === "video") {
      return {
        mediaId: m.id,
        suggestedAlt: `High-definition documentary video footage showing scientific fieldwork and polar landscape during ${title}.`
      };
    }
    return {
      mediaId: m.id,
      suggestedAlt: `High-resolution photograph capturing ${m.caption || 'scientific polar research'} during ${title} in ${region} at ${stationList}. Details show authentic scientific equipment and pristine polar environment.`
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
    audience,
    assetType
  };
}

export function autoGenerateImageAlt(imageTitle, region, context = "") {
  return `Official NCPOR polar photograph showing ${imageTitle || 'scientific operation'} in the ${region} region. Features crisp high-contrast terrain, scientific research gear, and polar environmental conditions. ${context}`;
}
