
export const defaultSiteContent = {
  brand: {
    name: "GCP",
    fullName: "GCP",
    tagline: "Beyond the ordinary.",
  },

  navigation: [
    { label: "Discover", href: "#discover" },
    { label: "Our Story", href: "#story" },
    { label: "Experiences", href: "#experiences" },
    { label: "The Journey", href: "#journey" },
  ],

  hero: {
    eyebrow: "A DIFFERENT WAY TO EXPERIENCE THE WORLD",
    title: "Go beyond.",
    subtitle: "The world is waiting.",
    description:
      "Extraordinary places. Meaningful connections. Experiences that stay with you long after the journey ends.",
    primaryButton: "Explore the experience",
    primaryHref: "#discover",
    image: "",
    imageAlt: "Cinematic travel destination",
    location: "YOUR NEXT DESTINATION",
    index: "01 / 04",
  },

  intro: {
    eyebrow: "THE ART OF EXPLORATION",
    lineOne: "Some places",
    lineTwo: "change the way",
    lineThree: "you see everything.",
    description:
      "Travel is more than the places we visit. It's the people we meet, the moments we share, and the stories we carry home.",
  },

  story: {
    eyebrow: "01 — OUR STORY",
    title: "Made for the moments that matter.",
    description:
      "This is where your story begins. Share the inspiration behind GCP, the people who make it possible, and what makes every experience unique.",
    secondaryText:
      "Every journey has a story. This space is yours to tell it.",
    image: "",
    imageAlt: "Travelers experiencing a destination",
    imageCaption: "THE STORY BEHIND GCP",
  },

  experiences: {
    eyebrow: "02 — THE EXPERIENCES",
    title: "The extraordinary is out there.",
    description:
      "A collection of experiences waiting to be discovered.",

    items: [
      {
        id: "experience-01",
        number: "01",
        title: "Discover more.",
        category: "EXPERIENCE ONE",
        description:
          "A place for your first featured experience.",
        image: "",
        imageAlt: "Featured travel experience one",
      },
      {
        id: "experience-02",
        number: "02",
        title: "Feel everything.",
        category: "EXPERIENCE TWO",
        description:
          "A place for your second featured experience.",
        image: "",
        imageAlt: "Featured travel experience two",
      },
      {
        id: "experience-03",
        number: "03",
        title: "Remember forever.",
        category: "EXPERIENCE THREE",
        description:
          "A place for your third featured experience.",
        image: "",
        imageAlt: "Featured travel experience three",
      },
    ],
  },

  statement: {
    eyebrow: "A NEW PERSPECTIVE",
    title: "Collect moments. Not things.",
    image: "",
    imageAlt: "Immersive scenic destination",
  },

  journey: {
    eyebrow: "03 — THE JOURNEY",
    title: "Every journey begins somewhere.",
    description:
      "The best experiences are the ones we share.",

    steps: [
      {
        number: "01",
        title: "Explore",
        description:
          "Discover the possibilities and find an experience that speaks to you.",
      },
      {
        number: "02",
        title: "Connect",
        description:
          "Meet the people who will become part of your story.",
      },
      {
        number: "03",
        title: "Experience",
        description:
          "Be present. See more. Make every moment count.",
      },
    ],
  },

  closing: {
    eyebrow: "THE WORLD IS YOURS",
    title: "Your story starts here.",
    description:
      "The next unforgettable chapter is waiting to be written.",
    buttonText: "Back to the beginning",
    buttonHref: "#home",
  },

  footer: {
    tagline: "For the moments that stay with you.",
    note: "Designed for exploration.",
    copyright: "GCP",
  },
};

// ---------------------------------------------
// GCP STUDIO — LOCAL CONTENT STORAGE
// ---------------------------------------------

export const CONTENT_STORAGE_KEY = "gcp-studio-content-v2";

// Create a separate copy of content so the
// original defaults are never modified.
export function cloneContent(value) {
  return JSON.parse(JSON.stringify(value));
}

// Merge saved content with the default structure.
// This keeps newly added fields available even
// when older saved content doesn't contain them.
function mergeContent(defaults, saved) {
  if (Array.isArray(defaults)) {
    return defaults.map((item, index) =>
      mergeContent(item, saved?.[index])
    );
  }

  if (defaults !== null && typeof defaults === "object") {
    return Object.fromEntries(
      Object.entries(defaults).map(([key, value]) => [
        key,
        mergeContent(value, saved?.[key]),
      ])
    );
  }

  return typeof saved === typeof defaults
    ? saved
    : defaults;
}

// Load saved website content from the browser.
// Fall back to the original content if nothing
// has been saved yet.
export function loadSiteContent() {
  try {
    const saved = localStorage.getItem(CONTENT_STORAGE_KEY);

    if (saved) {
      return mergeContent(
        defaultSiteContent,
        JSON.parse(saved)
      );
    }
  } catch (error) {
    console.error(
      "GCP Studio: Unable to load saved content.",
      error
    );
  }

  return cloneContent(defaultSiteContent);
}

// Export the content for the public website.
export const siteContent = loadSiteContent();
