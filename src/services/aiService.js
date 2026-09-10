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
  const stationList = Array.isArray(target.stations) ? target.stations.join(", ") : (target.station || target.spatialCoverage || "Indian Polar Base");

  let summary;
  let twitter;
  let instagram;
  let linkedin;
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
    } else if (audience === "press") {
      summary = `NEW DELHI / GOA — The National Centre for Polar and Ocean Research (NCPOR), an autonomous institute under the Ministry of Earth Sciences (MoES), has unveiled key findings from the ${title}. Operating across ${stationList}, the mission achieved significant breakthroughs in cryospheric monitoring, atmospheric baseline measurements, and environmental stewardship, reinforcing India's strategic standing in polar scientific governance.`;
      twitter = `📰 PRESS RELEASE: @NCPOR_MoES announces major scientific milestones from the ${title} (${region}). High-precision cryospheric datasets and climate records now archived. 🇮🇳📊 #MoES #PressRelease #PolarResearch #IndiaScience`;
      instagram = `MEDIA HIGHLIGHT: India's Polar Research Milestones 🇮🇳📰\n\nKey scientific outcomes from the ${title} have been published by NCPOR / Ministry of Earth Sciences.\n\nFrom high-latitude observations to crucial atmospheric modeling, this mission represents a strategic leap in India's global polar footprint.\n\n🔗 Press kit and high-res media available at NCPOR Outreach Portal.\n\n#PressUpdate #NCPOR #MoES #NationalScience #India`;
      linkedin = `FOR IMMEDIATE RELEASE: Ministry of Earth Sciences (MoES) & NCPOR announce comprehensive deliverables from the ${title}.\n\nOperating in ${region}, the scientific corps successfully completed advanced telemetry deployments, environmental audits, and interdisciplinary data gathering. High-resolution press kits and open datasets are now accessible via the National Outreach Portal.\n\n#GovOfIndia #MoES #PressRelease #PolarScience #StrategicResearch`;
    } else {
      // General Public
      summary = `From the icy frontiers of ${region}, the ${title} brings home extraordinary scientific discoveries! Stationed at ${stationList}, Indian researchers braved extreme sub-zero weather to track how melting polar ice and shifting ocean currents directly connect to global weather patterns and India's seasonal monsoons. This expedition showcases the remarkable dedication of Indian scientists who live and work at the ends of the Earth to safeguard our climate future.`;
      twitter = `❄️ Breakthroughs from the frontier! The ${title} by @NCPOR_MoES has concluded with vital discoveries on climate resilience and polar ocean dynamics. 🇮🇳🧊 #PolarScience #NCPOR #IndiaIn${region.replace(/\s+/g, '')} #MoES`;
      instagram = `Journey to Earth's Most Extreme Frontier! 🧊✨\n\nMeet the incredible Indian scientists of the ${title} who lived and worked across ${stationList}.\n\nFrom extracting ancient ice records to monitoring polar ecosystems, their research helps us understand global climate changes that impact our everyday lives.\n\n👉 Explore the full expedition gallery and report at the link in bio!\n\n#NCPOR #PolarExploration #MoES #IndiaScience #ClimateAction #${region.replace(/\s+/g, '')}`;
      linkedin = `The National Centre for Polar and Ocean Research (NCPOR), Ministry of Earth Sciences, is pleased to highlight key scientific achievements from the ${title} (${region}).\n\nConducted across ${stationList}, this mission delivered vital observations in cryospheric dynamics, boundary-layer atmospheric physics, and ocean carbon fluxes.\n\nIndia continues to uphold highest scientific excellence and environmental stewardship in polar exploration.\n\n#NCPOR #MoES #PolarScience #ClimateLeadership #GovernmentOfIndia`;
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

// Automatically breaks raw text into titled chunks / logical sections
export function chunkDocumentText(rawText) {
  if (!rawText || !rawText.trim()) return [];

  // Split by double newlines or headers
  const paragraphs = rawText.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
  
  const chunks = [];
  let currentTitle = 'Section 1: Overview & Background';
  let currentContent = [];

  paragraphs.forEach((p, idx) => {
    const firstLine = p.split('\n')[0].trim();
    const isHeader = /^(\d+\.|\bExecutive Summary\b|\bDeliverables\b|\bMajor Scientific\b|\bScientific Objectives\b|\bKey Findings\b|\bMethodology\b|\bAbstract\b|\bBackground\b|\bConclusion\b|[A-Z\s]{4,}:)/i.test(firstLine);

    if (isHeader && currentContent.length > 0) {
      chunks.push({
        id: `chunk-${chunks.length + 1}`,
        title: currentTitle,
        content: currentContent.join('\n\n'),
        wordCount: currentContent.join(' ').split(/\s+/).length
      });
      currentTitle = firstLine.length < 60 ? firstLine : `Section ${chunks.length + 2}`;
      currentContent = [p];
    } else {
      if (idx === 0 && isHeader) {
        currentTitle = firstLine;
      }
      currentContent.push(p);
    }
  });

  if (currentContent.length > 0) {
    chunks.push({
      id: `chunk-${chunks.length + 1}`,
      title: currentTitle,
      content: currentContent.join('\n\n'),
      wordCount: currentContent.join(' ').split(/\s+/).length
    });
  }

  // If only 1 huge chunk resulted, slice by paragraph blocks
  if (chunks.length <= 1 && paragraphs.length > 1) {
    return paragraphs.map((p, i) => {
      const words = p.split(/\s+/);
      const firstLine = p.split('\n')[0].trim();
      const title = firstLine.length > 50 ? `${firstLine.slice(0, 50)}...` : firstLine;
      return {
        id: `chunk-${i + 1}`,
        title: title || `Excerpt ${i + 1}`,
        content: p,
        wordCount: words.length
      };
    });
  }

  return chunks;
}

export async function generateFromSelectedChunks({ asset, selectedChunks = [], customFocus = '', audience = 'general' }) {
  await new Promise(resolve => setTimeout(resolve, 800));

  const target = asset || {};
  const region = target.region || "Antarctica";
  const title = target.title || "Polar Science Archive";
  const chunkCombinedText = selectedChunks.map(c => c.content).join('\n\n');
  const chunkTitles = selectedChunks.map(c => c.title).join(', ');

  const hasIce = /ice|glaci|core|drilling|melt/i.test(chunkCombinedText);
  const hasAerosol = /aerosol|atmosphere|air|ozone|black carbon/i.test(chunkCombinedText);
  const hasEnergy = /microgrid|solar|power|battery|hybrid|clean energy/i.test(chunkCombinedText);
  const hasOcean = /ocean|fjord|water|ctd|salinity|current/i.test(chunkCombinedText);

  let focusSnippet = "";
  if (customFocus.trim()) {
    focusSnippet = ` Specifically focusing on ${customFocus.trim()},`;
  }

  let summary, twitter, instagram, linkedin, facebook, blog, articleText;

  if (audience === 'student') {
    summary = `Focused insights from ${title} (${region})!${focusSnippet} Indian polar scientists analyzed key areas including ${chunkTitles}. Students can discover how researchers braved freezing conditions to gather critical data on ${hasIce ? 'ancient ice layers, ' : ''}${hasAerosol ? 'polar air quality, ' : ''}${hasEnergy ? 'clean renewable energy systems, ' : ''}${hasOcean ? 'ocean water dynamics, ' : ''}proving how polar science directly influences global climate stability.`;
    twitter = `🧊 Focused Polar Discovery: Insights from ${title} (${region})!${focusSnippet} Exploring ${chunkTitles.slice(0, 60)}... 🇮🇳🔬 #SmartEducation #NCPOR #ScienceForYouth #MoES`;
    instagram = `Did you know polar researchers test futuristic clean energy and study ancient ice? 🧊⚡\n\nDeep-dive into selected findings from "${title}":\n\n🔍 Focus Topics: ${chunkTitles}\n📍 Location: ${region}\n\n${selectedChunks[0]?.content?.slice(0, 180) || ''}...\n\n#PolarScience #NCPOR #YouthInStem #IndiaScience #ClimateAction`;
    linkedin = `Translating specific technical milestones from the ${title} (${region}).${focusSnippet}\n\nKey Focus Areas: ${chunkTitles}.\n\nHighlights Indian advancements in extreme-environment scientific observation, open research methodologies, and sustainable infrastructure under the Ministry of Earth Sciences.\n\n#NCPOR #MoES #OpenScience #PolarResearch #StrategicScience`;
    facebook = `❄️ Exploring the Ends of the Earth! 🌏 Discover how Indian scientists with the National Centre for Polar and Ocean Research (NCPOR) conducted vital research during the ${title}.\n\n🔬 Highlights of the Mission:\n• Focus Areas: ${chunkTitles}\n• Region: ${region}\n• Key Discovery: ${selectedChunks[0]?.content?.slice(0, 160) || 'Advancing deep ice core and atmospheric studies'}...\n\n👉 Learn how polar science shapes India's monsoon and climate by exploring our open outreach portal!\n\n#NCPOR #MoES #ScienceOutreach #PolarExploration #IndiaInAntarctica`;
    blog = `## Exploring the Frontiers of Polar Science: Insights from ${title}\n\n**By NCPOR Science Outreach Team**\n\nPolar regions may feel a world away, but the groundbreaking work conducted during **${title}** in ${region} directly influences our global climate and the Indian monsoon system.\n\n### Key Mission Milestones\n${selectedChunks.map(c => `- **${c.title}**: ${c.content.slice(0, 140)}...`).join('\n')}\n\n### Why This Matters for India\nWhat happens in ${region} drives deep oceanic and atmospheric teleconnections. By deploying cutting-edge instrumentation and retrieving unblemished climate records, Indian researchers are safeguarding our future and cementing India's leadership in the Antarctic Treaty System.\n\n*Explore open datasets and reports on the NCPOR Portal.*`;
    articleText = `FOR IMMEDIATE RELEASE / SPECIAL FEATURE\n\nNEW DELHI / GOA — The National Centre for Polar and Ocean Research (NCPOR), an autonomous body under the Ministry of Earth Sciences (MoES), Government of India, has unveiled key scientific findings from ${title} (${region}).\n\nKey Technical Modules Evaluated:\n${selectedChunks.map(c => `• ${c.title}`).join('\n')}\n\n"The continuous observations gathered from this expedition provide invaluable baseline data for international cryospheric modeling and tropical-polar teleconnections," stated researchers from the NCPOR polar operations wing.\n\nValidated datasets and peer-reviewed outputs are now accessible via the National Polar & Ocean Outreach Portal.`;
  } else if (audience === 'press') {
    summary = `NEW DELHI / GOA — Dedicated scientific evaluation of prioritized mission deliverables from "${title}" in ${region}.${focusSnippet} Based on authenticated expedition records (${chunkTitles}), Indian researchers validated critical findings across high-latitude observation and environmental stewardship under the Antarctic Treaty System.`;
    twitter = `📰 TARGETED BRIEFING: Key milestones from ${title} (${region}) published by @NCPOR_MoES.${focusSnippet} Full data: ${chunkTitles.slice(0, 50)}... 📊🇮🇳 #MoES #PressRelease`;
    instagram = `OFFICIAL BRIEFING: Selected scientific deliverables from "${title}" 🇮🇳📊\n\nTargeted focus on ${chunkTitles}.\n\nResearchers reported milestone achievements in in-situ polar data recording and baseline validation in ${region}.\n\n#NCPOR #MoES #PressBriefing #PolarObservation #ClimateLeadership`;
    linkedin = `FOR IMMEDIATE RELEASE: Ministry of Earth Sciences (MoES) & NCPOR highlight prioritized deliverables from ${title}.${focusSnippet}\n\nKey Technical Modules Evaluated: ${chunkTitles}.\n\nDemonstrating continued operational excellence and deep-field scientific capabilities across the Polar and Cryospheric realms.\n\n#MoES #GovOfIndia #PressRelease #StrategicResearch #PolarScience`;
    facebook = `📰 OFFICIAL PRESS RELEASE: Ministry of Earth Sciences & NCPOR Announce Key Milestones from ${title} (${region}).\n\nIndian researchers have successfully authenticated critical deliverables across: ${chunkTitles}.\n\n📌 Mission Significance:\nThese findings provide international benchmark datasets under the Antarctic Treaty System and enhance India's cryospheric forecasting capabilities.\n\n🔗 Read the complete dossier and open telemetry logs on the NCPOR Portal.\n\n#NCPOR #MoES #PressRelease #PolarResearch #NationalAchievement`;
    blog = `## Press Feature: How ${title} Is Transforming Polar Climate Modeling\n\n**Official Media Briefing | National Centre for Polar and Ocean Research (NCPOR)**\n\n**NEW DELHI / GOA** — The Ministry of Earth Sciences (MoES) has released the scientific dossier for **${title}**, detailing critical environmental and glaciological operations across ${region}.\n\n### Strategic Deliverables\n${selectedChunks.map(c => `* **${c.title}**: ${c.content.slice(0, 160)}...`).join('\n')}\n\n### Institutional Statement\n"The success of this mission demonstrates India's world-class logistical preparedness and scientific rigor in extreme environments," noted senior NCPOR glaciologists. The data will feed into global ocean-atmosphere coupling models.\n\nFor media inquiries: outreach@ncpor.res.in`;
    articleText = `PRESS RELEASE / NATIONAL SCIENCE DISPATCH\n\nDATELINE: GOA / NEW DELHI — MINISTRY OF EARTH SCIENCES, GOVT. OF INDIA\n\nSUBJECT: NCPOR Issues Scientific Report on ${title}\n\nThe National Centre for Polar and Ocean Research (NCPOR), Ministry of Earth Sciences, announces the successful archival and validation of technical logs from ${title} in ${region}.\n\nKey Achievements:\n${selectedChunks.map(c => `1. ${c.title}: ${c.content.slice(0, 150)}...`).join('\n')}\n\nThe complete archive, comprising peer-reviewed papers, open datasets, and outreach multimedia, is publicly accessible on the NCPOR Outreach Portal.`;
  } else {
    summary = `Direct from the field: Targeted scientific highlights from "${title}" in ${region}!${focusSnippet} By examining focused logs on ${chunkTitles}, we learn how Indian scientists successfully tackled extreme cold to collect vital evidence on our changing planet.`;
    twitter = `❄️ Polar Highlights: Key updates from ${title}!${focusSnippet} Discover discoveries across ${chunkTitles.slice(0, 70)}... 🇮🇳🇦🇶 #PolarScience #NCPOR #ClimateAction`;
    instagram = `Highlights from the Ends of the Earth! ❄️✨\n\nWe extracted key highlights from "${title}":\n\n📌 Evaluated Sections: ${chunkTitles}\n\n${selectedChunks[0]?.content?.slice(0, 200) || ''}...\n\nEvery finding brings us closer to understanding global climate connections! 👉 Read more on our portal.\n\n#Antarctica #PolarScience #NCPOR #EarthScience #IndiaInAntarctica`;
    linkedin = `Selected scientific highlights from the ${title} (${region}) are now curated for public outreach.${focusSnippet}\n\nPrimary Focus: ${chunkTitles}.\n\nNCPOR and the Ministry of Earth Sciences continue to foster transparent, high-impact science communications for researchers, educators, and global citizens.\n\n#NCPOR #MoES #PolarScience #ScienceOutreach #OpenGovernment`;
    facebook = `❄️ Live from the Polar Frontier! 🇦🇶 Discover the inspiring work done by Indian researchers during the ${title} in ${region}.\n\nKey Discoveries & Milestones:\n🔹 Focus Areas: ${chunkTitles}\n🔹 Groundbreaking Observation: ${selectedChunks[0]?.content?.slice(0, 180) || 'Pioneering cryospheric measurements and environmental baseline tracking'}...\n\nIndia's presence at the poles helps us understand global ocean health, monsoon patterns, and renewable polar energy.\n\n👉 Share this to celebrate Indian science! 🇮🇳\n\n#NCPOR #MoES #PolarScience #IndiaAtThePoles #ClimateAction`;
    blog = `## Dispatches from the White Continent: Highlights of ${title}\n\n**Published by NCPOR Science Outreach Unit**\n\nIn the remote expanse of ${region}, Indian scientists endure some of the most unforgiving terrain on Earth. Their goal? To study our planet's past, present, and future.\n\n### What the Mission Uncovered\n${selectedChunks.map(c => `### ${c.title}\n${c.content.slice(0, 200)}...`).join('\n\n')}\n\n### The Global Impact\nPolar research is not just about ice—it is about the air we breathe, the seas that sustain us, and the weather patterns that feed millions across India.\n\n*Visit the NCPOR Portal to download full expedition PDFs and datasets.*`;
    articleText = `ARTICLE / POLAR SCIENCE BRIEFING\n\nNCPOR POLAR KNOWLEDGE SERIES: ${title.toUpperCase()}\n\nBy NCPOR Communications Wing, Ministry of Earth Sciences\n\nAs part of India's continuous commitment to polar science and environmental stewardship, the National Centre for Polar and Ocean Research (NCPOR) has synthesized key research deliverables from ${title} (${region}).\n\nKey Highlights:\n${selectedChunks.map((c, i) => `${i + 1}. ${c.title}: ${c.content.slice(0, 160)}...`).join('\n')}\n\nThis research supports global climate science initiatives under the Antarctic Treaty System and provides open-access data to the scientific community.`;
  }

  let factCards = selectedChunks.slice(0, 3).map((chunk) => {
    const firstSentence = chunk.content.split(/\.|\n/)[0].trim();
    return `${chunk.title}: ${firstSentence.slice(0, 110)}...`;
  });

  if (factCards.length === 0) {
    factCards = [
      `Synthesized from ${selectedChunks.length} targeted data chunks.`,
      `Validated against official NCPOR polar archives.`,
      `Curated for ${audience} audience accessibility.`
    ];
  }

  // 1. Full Scientific Blog / Feature Article Generation
  const article = {
    title: `Frontiers of Polar Research: Unveiling ${title}`,
    subtitle: `How Indian scientists decoded ${chunkTitles.slice(0, 80)} in extreme ${region} conditions`,
    readTime: `${Math.max(3, Math.ceil(chunkCombinedText.split(/\s+/).length / 70))} min read`,
    category: hasIce ? 'Glaciology & Cryosphere' : hasEnergy ? 'Green Engineering & Operations' : hasOcean ? 'Oceanography' : 'Atmospheric Science',
    publishedDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    author: "NCPOR Polar Science Communications Team",
    lead: `In the vast frozen landscapes of ${region}, Indian researchers push the boundaries of extreme-environment exploration. Through the archival of ${title}, recently verified by the National Centre for Polar and Ocean Research (NCPOR), deep-field observations are opening unprecedented windows into how high-latitude changes impact our planet.`,
    sections: selectedChunks.map((chunk, idx) => ({
      heading: `${idx + 1}. ${chunk.title.replace(/^Section\s*\d+:\s*/i, '')}`,
      body: `Field teams focused intensely on ${chunk.title.toLowerCase()}. As documented in the mission records: "${chunk.content.slice(0, 300)}...". These validated records represent crucial milestones for Indian scientific sovereignty and international polar cryosphere databases.`
    })),
    climateImpact: `What happens at the poles directly shapes the Indian subcontinent. Changes in ${region} cryospheric mass and circulation drive deep teleconnections with the Indian Summer Monsoon, sea level along our 7,500 km coastline, and the third-pole water towers of the Himalayas.`,
    takeaways: [
      `High-fidelity observation in ${region} calibrated against rigorous Antarctic Treaty protocols.`,
      `Critical baseline telemetry archived under MoES open science data mandate.`,
      `Multi-institutional teamwork demonstrating state-of-the-art logistics and scientific ingenuity.`
    ]
  };

  // 2. AI Image Generation Prompts & Visual Asset
  let matchingImageUrl = "https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1400&q=80";
  let promptStyle = "Photorealistic National Geographic style, Hasselblad 50MP, natural polar lighting";

  if (hasIce) {
    matchingImageUrl = "https://images.unsplash.com/photo-1517999144091-3d9dca6d1e43?auto=format&fit=crop&w=1400&q=80";
    promptStyle = "Detailed documentary photograph, Indian glaciologists extracting blue ice core in Larsemann Hills Antarctica, blizzard wind crystals, high-contrast survival suits, 8k resolution";
  } else if (hasOcean) {
    matchingImageUrl = "https://images.unsplash.com/photo-1517999144091-3d9dca6d1e43?auto=format&fit=crop&w=1400&q=80";
    promptStyle = "Oceanographic research vessel cutting through pack ice in Southern Ocean, hydraulic winch lowering titanium CTD rosette into deep Antarctic waters, cinematic cold mist, dramatic lighting";
  } else if (hasEnergy) {
    matchingImageUrl = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&q=80";
    promptStyle = "Pioneering renewable microgrid polar installation, solar arrays and vertical-axis wind turbines standing resilient amidst Antarctic snowdrift, Maitri station in background, sharp focus, ultra-detailed";
  }

  const imageGen = {
    prompt: `A high-resolution scientific visualization of ${title} (${region}). Focus on ${chunkTitles.slice(0, 80)}. ${promptStyle}. Crisp focus, realistic scientific instruments, authentic cold atmospheric haze.`,
    negativePrompt: "blurry, oversaturated, low quality, CGI cartoon, extra limbs, incorrect equipment, text artifacts",
    aspectRatio: "16:9",
    imageUrl: target.heroImage || matchingImageUrl,
    suggestedAlt: `AI-generated photo visualization depicting ${chunkTitles.slice(0, 70)} during ${title} in ${region}. Shows authentic scientific gear and extreme polar conditions.`
  };

  // 3. AI Video Script, Storyboard & Clip
  const videoGen = {
    title: `60-Second Polar Shorts: Exploring ${title}`,
    targetDuration: "50-60 seconds",
    aspectRatio: "9:16 (Vertical Short) & 16:9 (Landscape)",
    videoUrl: "https://images.unsplash.com/photo-1517999144091-3d9dca6d1e43?auto=format&fit=crop&w=1600&q=80",
    storyboard: [
      {
        scene: 1,
        timestamp: "0:00 - 0:10",
        visual: `Breathtaking aerial drone sweep over vast polar ice sheets in ${region}. Indian research base emerges through morning mist.`,
        narration: `At the frozen edge of the planet, temperatures plummet below minus thirty. But inside India's polar observatories, science never sleeps.`,
        onScreenText: `📍 ${region} • ${title}`,
        soundFx: "Rumbling polar wind, subtle ambient synth crescendo"
      },
      {
        scene: 2,
        timestamp: "0:10 - 0:25",
        visual: `Close-up of scientists assembling specialized instrumentation. Focus: ${chunkTitles.slice(0, 60)}.`,
        narration: `During this mission, researchers deployed precision tools to capture critical data from ${selectedChunks[0]?.title || 'deep field surveys'}.`,
        onScreenText: `🔬 FOCUS: ${selectedChunks[0]?.title || 'Polar Investigation'}`,
        soundFx: "Mechanical drill hum, wind howling against survival fabric"
      },
      {
        scene: 3,
        timestamp: "0:25 - 0:45",
        visual: `Split screen: Sensor telemetry diagrams on rugged laptop screens alongside physical ice/ocean samples.`,
        narration: `Every sample tells a story—linking high-latitude environmental shifts directly to global climate patterns and the monsoon rains back home.`,
        onScreenText: `📊 ${factCards[0] || 'In-situ baseline telemetry validated'}`,
        soundFx: "Telemetry beep sequence, heartbeat bass pulse"
      },
      {
        scene: 4,
        timestamp: "0:45 - 0:60",
        visual: `Tricolor Indian flag fluttering crisply against azure Antarctic sky. MoES and NCPOR emblem transitions into view.`,
        narration: `India's polar legacy continues. Explore open datasets and mission dossiers on the NCPOR National Outreach Portal.`,
        onScreenText: `🇮🇳 Ministry of Earth Sciences • NCPOR Goa\nExplore Open Science Portal`,
        soundFx: "Inspirational orchestral resolve, clean fade out"
      }
    ]
  };

  return {
    summary,
    socialCaptions: { twitter, instagram, linkedin, facebook, blog, article: articleText },
    factCards,
    article,
    imageGen,
    videoGen,
    selectedChunkIds: selectedChunks.map(c => c.id),
    chunkCount: selectedChunks.length,
    audience,
    customFocus,
    generatedAt: new Date().toISOString()
  };
}
