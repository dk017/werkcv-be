(function () {
  const STOPWORDS = new Set([
    "aan", "aangeboden", "aantal", "achter", "adv", "als", "altijd", "andere", "anderen", "bij", "bijna",
    "binnen", "binnenkort", "boordevol", "bouwen", "dat", "de", "deze", "die", "dit", "doen", "door", "draag",
    "een", "eens", "eigen", "elke", "en", "er", "ervaring", "extra", "geen", "gaat", "gezocht", "hebt", "heeft",
    "hebben", "het", "hun", "iedere", "iemand", "iets", "in", "is", "je", "jij", "jouw", "kan", "kans", "klant",
    "krijgt", "kun", "kunnen", "maar", "meer", "met", "minimaal", "mooie", "naar", "naast", "niet", "nog", "om",
    "ons", "onze", "ook", "op", "over", "samen", "solliciteer", "te", "team", "ter", "tot", "uit", "vakature",
    "vacature", "van", "veel", "verder", "voor", "waar", "waarbij", "we", "werk", "werken", "werkt", "wie", "wij",
    "worden", "wordt", "zoek", "zoeken", "zoekt", "zou", "zowel", "zorg", "zonder", "tussen",
    "a", "about", "across", "all", "also", "an", "and", "are", "as", "at", "be", "because", "been", "being",
    "but", "by", "candidate", "candidates", "company", "could", "do", "does", "for", "from", "have", "has", "how",
    "if", "into", "is", "it", "its", "job", "jobs", "more", "must", "not", "of", "on", "or", "our", "ours", "role",
    "roles", "than", "that", "the", "their", "them", "then", "there", "these", "they", "this", "those", "to", "up",
    "we", "what", "when", "where", "who", "why", "will", "with", "within", "work", "working", "works", "you", "your"
  ]);

  const SIGNAL_STOPWORDS = new Set([
    "een", "de", "het", "jij", "je", "is", "zijn", "en", "of", "met", "voor", "bij", "op", "van", "aan", "te", "in",
    "a", "an", "and", "are", "for", "in", "is", "of", "on", "or", "our", "the", "to", "we", "with", "you", "your"
  ]);

  const DICTIONARY = [
    { term: "analytisch", category: "soft" },
    { term: "analytical", category: "soft" },
    { term: "assertief", category: "soft" },
    { term: "assertive", category: "soft" },
    { term: "collaborative", category: "soft" },
    { term: "communicatief sterk", category: "soft" },
    { term: "communicatieve vaardigheden", category: "soft" },
    { term: "communication skills", category: "soft" },
    { term: "creatief", category: "soft" },
    { term: "creative", category: "soft" },
    { term: "customer focused", category: "soft" },
    { term: "customer-focused", category: "soft" },
    { term: "detail oriented", category: "soft" },
    { term: "detail-oriented", category: "soft" },
    { term: "eigen initiatief", category: "soft" },
    { term: "flexibel", category: "soft" },
    { term: "flexible", category: "soft" },
    { term: "gestructureerd", category: "soft" },
    { term: "independent", category: "soft" },
    { term: "klantgericht", category: "soft" },
    { term: "nauwkeurig", category: "soft" },
    { term: "organized", category: "soft" },
    { term: "oplossingsgericht", category: "soft" },
    { term: "problem solving", category: "soft" },
    { term: "problem-solving", category: "soft" },
    { term: "proactief", category: "soft" },
    { term: "proactive", category: "soft" },
    { term: "resultaatgericht", category: "soft" },
    { term: "results driven", category: "soft" },
    { term: "results-driven", category: "soft" },
    { term: "samenwerken", category: "soft" },
    { term: "self starter", category: "soft" },
    { term: "self-starter", category: "soft" },
    { term: "stakeholdermanagement", category: "soft" },
    { term: "stakeholder management", category: "soft" },
    { term: "stressbestendig", category: "soft" },
    { term: "zelfstandig", category: "soft" },
    { term: "agile", category: "hard" },
    { term: "canva", category: "hard" },
    { term: "b2b", category: "hard" },
    { term: "bing ads", category: "hard" },
    { term: "conversion rate optimization", category: "hard" },
    { term: "cro", category: "hard" },
    { term: "content marketing", category: "hard" },
    { term: "crm", category: "hard" },
    { term: "css", category: "hard" },
    { term: "data-analyse", category: "hard" },
    { term: "data analysis", category: "hard" },
    { term: "excel", category: "hard" },
    { term: "figma", category: "hard" },
    { term: "ga4", category: "hard" },
    { term: "git", category: "hard" },
    { term: "google ads", category: "hard" },
    { term: "google analytics", category: "hard" },
    { term: "google search console", category: "hard" },
    { term: "html", category: "hard" },
    { term: "hubspot", category: "hard" },
    { term: "javascript", category: "hard" },
    { term: "klantenservice", category: "hard" },
    { term: "customer service", category: "hard" },
    { term: "leadgeneratie", category: "hard" },
    { term: "lead generation", category: "hard" },
    { term: "looker studio", category: "hard" },
    { term: "marketing automation", category: "hard" },
    { term: "office 365", category: "hard" },
    { term: "power bi", category: "hard" },
    { term: "powerpoint", category: "hard" },
    { term: "procesverbetering", category: "hard" },
    { term: "process improvement", category: "hard" },
    { term: "projectmanagement", category: "hard" },
    { term: "project management", category: "hard" },
    { term: "php", category: "hard" },
    { term: "react", category: "hard" },
    { term: "recruitment", category: "hard" },
    { term: "recruiting", category: "hard" },
    { term: "rest api", category: "hard" },
    { term: "rest apis", category: "hard" },
    { term: "saas", category: "hard" },
    { term: "salesforce", category: "hard" },
    { term: "sap", category: "hard" },
    { term: "scrum", category: "hard" },
    { term: "sem", category: "hard" },
    { term: "semrush", category: "hard" },
    { term: "seo", category: "hard" },
    { term: "social media", category: "hard" },
    { term: "sql", category: "hard" },
    { term: "stakeholder management", category: "hard" },
    { term: "a/b testing", category: "hard" },
    { term: "ab testing", category: "hard" },
    { term: "ux", category: "hard" },
    { term: "wordpress", category: "hard" },
    { term: "mbo", category: "qualification" },
    { term: "mbo 4", category: "qualification" },
    { term: "hbo", category: "qualification" },
    { term: "wo", category: "qualification" },
    { term: "bachelor", category: "qualification" },
    { term: "bachelor degree", category: "qualification" },
    { term: "bachelor's degree", category: "qualification" },
    { term: "master", category: "qualification" },
    { term: "master degree", category: "qualification" },
    { term: "master's degree", category: "qualification" },
    { term: "dutch", category: "qualification" },
    { term: "english", category: "qualification" },
    { term: "nederlands", category: "qualification" },
    { term: "engels", category: "qualification" },
    { term: "rijbewijs", category: "qualification" },
    { term: "driver license", category: "qualification" },
    { term: "driver's license", category: "qualification" },
    { term: "benefits", category: "theme" },
    { term: "compensation", category: "theme" },
    { term: "employment type", category: "theme" },
    { term: "freelance", category: "theme" },
    { term: "full time", category: "theme" },
    { term: "full-time", category: "theme" },
    { term: "fulltime", category: "theme" },
    { term: "parttime", category: "theme" },
    { term: "part time", category: "theme" },
    { term: "part-time", category: "theme" },
    { term: "hybride", category: "theme" },
    { term: "remote", category: "theme" },
    { term: "hybrid", category: "theme" },
    { term: "on site", category: "theme" },
    { term: "on-site", category: "theme" },
    { term: "thuiswerken", category: "theme" },
    { term: "arbeidsvoorwaarden", category: "theme" },
    { term: "secundaire arbeidsvoorwaarden", category: "theme" }
  ];

  const SIGNAL_PATTERNS = [
    { regex: /ervaring met ([^.:\n]{4,140})/gi, category: "hard" },
    { regex: /experience with ([^.:\n]{4,140})/gi, category: "hard" },
    { regex: /kennis van ([^.:\n]{4,140})/gi, category: "hard" },
    { regex: /knowledge of ([^.:\n]{4,140})/gi, category: "hard" },
    { regex: /must have skills?(?: and experience)?[:\s]+([^.:\n]{4,140})/gi, category: "hard" },
    { regex: /must-have skills?(?: and experience)?[:\s]+([^.:\n]{4,140})/gi, category: "hard" },
    { regex: /proficient in ([^.:\n]{4,140})/gi, category: "hard" },
    { regex: /vaardig in ([^.:\n]{4,140})/gi, category: "hard" },
    { regex: /affiniteit met ([^.:\n]{4,140})/gi, category: "soft" },
    { regex: /familiarity with ([^.:\n]{4,140})/gi, category: "hard" },
    { regex: /goede beheersing van ([^.:\n]{4,140})/gi, category: "qualification" },
    { regex: /beheersing van ([^.:\n]{4,140})/gi, category: "qualification" },
    { regex: /fluent in ([^.:\n]{4,140})/gi, category: "qualification" },
    { regex: /verantwoordelijk voor ([^.:\n]{4,140})/gi, category: "theme" }
    ,{ regex: /responsible for ([^.:\n]{4,140})/gi, category: "theme" }
  ];

  const VACANCY_MARKERS = [
    { term: "about the role", score: 4 },
    { term: "about this role", score: 4 },
    { term: "apply now", score: 3 },
    { term: "benefits", score: 3 },
    { term: "compensation", score: 2 },
    { term: "vacature", score: 5 },
    { term: "vacancy", score: 5 },
    { term: "functie", score: 2 },
    { term: "functieomschrijving", score: 4 },
    { term: "functie-eisen", score: 4 },
    { term: "job description", score: 4 },
    { term: "job requirements", score: 4 },
    { term: "jouw profiel", score: 4 },
    { term: "key responsibilities", score: 4 },
    { term: "minimum qualifications", score: 4 },
    { term: "preferred qualifications", score: 3 },
    { term: "qualifications", score: 3 },
    { term: "requirements", score: 3 },
    { term: "responsibilities", score: 3 },
    { term: "the role", score: 3 },
    { term: "wat breng je mee", score: 4 },
    { term: "wat bieden wij", score: 4 },
    { term: "wat je gaat doen", score: 4 },
    { term: "wat we zoeken", score: 4 },
    { term: "what we are looking for", score: 4 },
    { term: "what we're looking for", score: 4 },
    { term: "what you will do", score: 4 },
    { term: "what you'll do", score: 4 },
    { term: "wij bieden", score: 3 },
    { term: "we offer", score: 3 },
    { term: "solliciteer", score: 3 },
    { term: "sollicitatieproces", score: 3 },
    { term: "apply", score: 2 },
    { term: "freelance", score: 2 },
    { term: "werkzaamheden", score: 3 },
    { term: "verantwoordelijkheden", score: 3 },
    { term: "vereisten", score: 3 },
    { term: "arbeidsvoorwaarden", score: 3 },
    { term: "dienstverband", score: 3 },
    { term: "employment type", score: 3 },
    { term: "location", score: 2 },
    { term: "salaris", score: 2 },
    { term: "salary", score: 2 },
    { term: "bruto", score: 2 },
    { term: "hours per week", score: 2 },
    { term: "uren per week", score: 2 },
    { term: "standplaats", score: 2 },
    { term: "full time", score: 2 },
    { term: "full-time", score: 2 },
    { term: "fulltime", score: 2 },
    { term: "part time", score: 2 },
    { term: "part-time", score: 2 },
    { term: "parttime", score: 2 },
    { term: "hybrid", score: 2 },
    { term: "hybride", score: 2 },
    { term: "ervaring met", score: 2 },
    { term: "experience with", score: 2 },
    { term: "kennis van", score: 2 },
    { term: "knowledge of", score: 2 },
    { term: "beheersing van", score: 2 },
    { term: "fluent in", score: 2 },
    { term: "proficient in", score: 2 },
    { term: "responsible for", score: 2 },
    { term: "mbo", score: 2 },
    { term: "hbo", score: 2 },
    { term: "wo", score: 2 },
    { term: "bachelor", score: 2 },
    { term: "master", score: 2 }
  ];

  const LANGUAGE_TERMS = new Set([
    "dutch", "english", "nederlands", "engels", "french", "german", "spanish"
  ]);

  const RECURRING_STOPWORDS = new Set([
    "alle", "apply", "based", "base", "candidate", "candidates", "company", "comply", "data", "details",
    "development", "duties", "experience", "global", "home", "jobs", "location", "main", "netherlands",
    "overview", "page", "pages", "performance", "position", "project", "projects", "quality", "remote",
    "role", "roles", "section", "site", "support", "suriname", "team", "teams", "week", "weeks", "website",
    "welo", "work", "working"
  ]);

  const CATEGORY_PRIORITY = {
    qualification: 4,
    hard: 3,
    soft: 2,
    theme: 1
  };

  function escapeRegex(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function normalizeWhitespace(value) {
    return value.replace(/\s+/g, " ").trim();
  }

  function normalizePhrase(value) {
    return normalizeWhitespace(value.toLowerCase())
      .replace(/^[^a-z0-9]+/gi, "")
      .replace(/[^a-z0-9]+$/gi, "");
  }

  function titleCase(value) {
    return value
      .split(" ")
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  function choosePreferredCategory(left, right) {
    return CATEGORY_PRIORITY[left] >= CATEGORY_PRIORITY[right] ? left : right;
  }

  function createDictionaryCategoryMap() {
    const map = new Map();

    DICTIONARY.forEach((item) => {
      const current = map.get(item.term);
      if (!current) {
        map.set(item.term, item.category);
        return;
      }

      map.set(item.term, choosePreferredCategory(current, item.category));
    });

    return map;
  }

  const DICTIONARY_CATEGORY_BY_TERM = createDictionaryCategoryMap();
  const DICTIONARY_TERMS = new Set(DICTIONARY.map((item) => item.term));

  function pushResult(bucket, entry) {
    const existing = bucket.find((item) => item.term === entry.term && item.category === entry.category);
    if (existing) {
      existing.count += entry.count;
      existing.score += entry.score;
      return;
    }

    bucket.push(entry);
  }

  function normalizeCategoryForTerm(term, category) {
    if (LANGUAGE_TERMS.has(term)) {
      return "qualification";
    }

    const dictionaryCategory = DICTIONARY_CATEGORY_BY_TERM.get(term);
    if (!dictionaryCategory) {
      return category;
    }

    return choosePreferredCategory(dictionaryCategory, category);
  }

  function detectDictionaryMatches(text) {
    const results = [];

    DICTIONARY.forEach((item) => {
      const pattern = new RegExp(`\\b${escapeRegex(item.term).replace(/\s+/g, "\\s+")}\\b`, "gi");
      const matches = text.match(pattern);
      if (!matches || matches.length === 0) {
        return;
      }

      pushResult(results, {
        term: item.term,
        label: titleCase(item.term),
        category: item.category,
        count: matches.length,
        score: matches.length * 5,
        source: "dictionary"
      });
    });

    return results;
  }

  function cleanSignalChunk(value) {
    return normalizeWhitespace(
      value
        .replace(/\(.+?\)/g, " ")
        .replace(/\b(ervaring met|experience with|kennis van|knowledge of|vaardig in|proficient in|affiniteit met|familiarity with|goede beheersing van|beheersing van|fluent in|verantwoordelijk voor|responsible for|requirements|qualifications|benefits|responsibilities|wat bieden wij|what you'll do|what you will do)\b.*$/i, " ")
        .replace(/\b(is|zijn|waarbij|waarin|zoals|inclusief|bij voorkeur|pré|pre|that|which|where|including|preferred|plus)\b.*$/i, " ")
        .replace(/[;:]/g, " ")
    );
  }

  function splitSignalChunk(value) {
    return cleanSignalChunk(value)
      .split(/\s*,\s*|\s+en\s+|\s+of\s+|\s+and\s+|\s+or\s+|\s*\/\s*/i)
      .map((part) => part.replace(/^(en|of|and|or)\s+/i, ""))
      .map(normalizePhrase)
      .filter((part) => part.length >= 3 && part.length <= 40)
      .filter((part) => part.split(" ").length <= 4)
      .filter((part) => !SIGNAL_STOPWORDS.has(part));
  }

  function detectSignals(text) {
    const results = [];

    SIGNAL_PATTERNS.forEach((patternConfig) => {
      let match;
      while ((match = patternConfig.regex.exec(text)) !== null) {
        splitSignalChunk(match[1]).forEach((term) => {
          const category = normalizeCategoryForTerm(term, patternConfig.category);
          pushResult(results, {
            term,
            label: titleCase(term),
            category,
            count: 1,
            score: 4,
            source: "signal"
          });
        });
      }
    });

    return results;
  }

  function createEmptyGroups() {
    return {
      hard: [],
      soft: [],
      theme: [],
      qualification: []
    };
  }

  function detectVacancyContext(text, dictionaryMatches, signalMatches) {
    const matchedMarkers = [];
    let markerScore = 0;

    VACANCY_MARKERS.forEach((marker) => {
      const pattern = new RegExp(`\\b${escapeRegex(marker.term).replace(/\s+/g, "\\s+")}\\b`, "i");
      if (!pattern.test(text)) {
        return;
      }

      matchedMarkers.push(marker.term);
      markerScore += marker.score;
    });

    const strongKeywordCount = dictionaryMatches.length + signalMatches.length;
    const evidenceScore =
      markerScore +
      Math.min(signalMatches.length * 2, 6) +
      Math.min(dictionaryMatches.length, 4);

    return {
      matchedMarkers,
      markerScore,
      strongKeywordCount,
      evidenceScore,
      isLikelyVacancy:
        (
          markerScore >= 5 &&
          (strongKeywordCount >= 2 || matchedMarkers.length >= 4 || evidenceScore >= 10)
        ) ||
        (
          markerScore >= 4 &&
          strongKeywordCount >= 3
        )
    };
  }

  function detectRecurringTerms(text) {
    const counts = new Map();
    const words = text.match(/[a-z0-9][a-z0-9+#.-]{2,}/gi) || [];

    words.forEach((rawWord) => {
      const word = normalizePhrase(rawWord);
      if (
        word.length < 5 ||
        STOPWORDS.has(word) ||
        RECURRING_STOPWORDS.has(word) ||
        DICTIONARY_TERMS.has(word) ||
        LANGUAGE_TERMS.has(word) ||
        /^\d+$/.test(word)
      ) {
        return;
      }

      counts.set(word, (counts.get(word) || 0) + 1);
    });

    return Array.from(counts.entries())
      .filter(([, count]) => count >= 3)
      .sort((left, right) => {
        if (right[1] !== left[1]) {
          return right[1] - left[1];
        }

        return right[0].length - left[0].length;
      })
      .slice(0, 6)
      .map(([term, count]) => ({
        term,
        label: titleCase(term),
        category: "theme",
        count,
        score: count * 2,
        source: "recurring"
      }));
  }

  function uniqueByTerm(items) {
    const seen = new Set();
    return items.filter((item) => {
      const key = `${item.category}:${item.term}`;
      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    });
  }

  function mergeResultsByTerm(items) {
    const merged = new Map();

    items.forEach((item) => {
      const existing = merged.get(item.term);
      if (!existing) {
        merged.set(item.term, { ...item });
        return;
      }

      existing.count += item.count;
      existing.score += item.score;
      existing.category = choosePreferredCategory(existing.category, item.category);
      existing.source = existing.source === item.source ? existing.source : "mixed";
    });

    return Array.from(merged.values());
  }

  function uniqueTerms(items) {
    const seen = new Set();
    return items.filter((term) => {
      if (seen.has(term)) {
        return false;
      }

      seen.add(term);
      return true;
    });
  }

  function groupResults(items) {
    const groups = {
      hard: [],
      soft: [],
      theme: [],
      qualification: []
    };

    items.forEach((item) => {
      if (item.category === "hard") {
        groups.hard.push(item);
      } else if (item.category === "soft") {
        groups.soft.push(item);
      } else if (item.category === "qualification") {
        groups.qualification.push(item);
      } else {
        groups.theme.push(item);
      }
    });

    Object.keys(groups).forEach((key) => {
      groups[key] = groups[key]
        .sort((left, right) => {
          if (right.score !== left.score) {
            return right.score - left.score;
          }

          return right.count - left.count;
        })
        .slice(0, 8);
    });

    return groups;
  }

  function analyzeText(rawText) {
    const text = normalizeWhitespace(rawText.toLowerCase());
    const wordCount = text ? text.split(" ").length : 0;

    const dictionaryMatches = detectDictionaryMatches(text);
    const signalMatches = detectSignals(text);
    const vacancyContext = detectVacancyContext(text, dictionaryMatches, signalMatches);

    if (!vacancyContext.isLikelyVacancy) {
      return {
        wordCount,
        highlightTerms: [],
        grouped: createEmptyGroups(),
        totalKeywords: 0,
        isLikelyVacancy: false,
        vacancyContext
      };
    }

    const recurringTerms = detectRecurringTerms(text);

    const combined = mergeResultsByTerm(uniqueByTerm([
      ...dictionaryMatches,
      ...signalMatches,
      ...recurringTerms
    ]));

    const grouped = groupResults(combined);

    const highlightTerms = uniqueByTerm([
      ...grouped.hard,
      ...grouped.soft,
      ...grouped.qualification,
      ...grouped.theme
    ])
      .map((item) => item.term)
      .filter((term) => term.length >= 4)
      .sort((left, right) => right.length - left.length)
      .filter(Boolean);

    const dedupedHighlightTerms = uniqueTerms(highlightTerms)
      .slice(0, 18);

    return {
      wordCount,
      highlightTerms: dedupedHighlightTerms,
      grouped,
      isLikelyVacancy: true,
      vacancyContext,
      totalKeywords:
        grouped.hard.length +
        grouped.soft.length +
        grouped.theme.length +
        grouped.qualification.length
    };
  }

  globalThis.WerkCVKeywordHighlighter = {
    analyzeText
  };
})();
