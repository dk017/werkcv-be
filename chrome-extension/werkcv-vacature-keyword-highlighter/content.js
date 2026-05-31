(function () {
  if (globalThis.__WERKCV_KEYWORD_HIGHLIGHTER_LOADED__) {
    return;
  }

  globalThis.__WERKCV_KEYWORD_HIGHLIGHTER_LOADED__ = true;

  const PANEL_ID = "werkcv-keyword-highlighter-panel";
  const HIGHLIGHT_CLASS = "werkcv-keyword-highlight";
  const DATA_ATTRIBUTE = "data-werkcv-highlight";

  function getScanRoot() {
    return (
      document.querySelector("main") ||
      document.querySelector("article") ||
      document.querySelector('[role="main"]') ||
      document.body
    );
  }

  function shouldSkipNode(node) {
    if (!node.parentElement) {
      return true;
    }

    if (node.parentElement.closest(`.${HIGHLIGHT_CLASS}, #${PANEL_ID}`)) {
      return true;
    }

    return Boolean(
      node.parentElement.closest("script, style, noscript, svg, canvas, textarea, input, select, option, button, nav, header, footer, aside")
    );
  }

  function collectVisibleText(root) {
    const textParts = [];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (shouldSkipNode(node)) {
          return NodeFilter.FILTER_REJECT;
        }

        const value = node.textContent.replace(/\s+/g, " ").trim();
        if (value.length < 2) {
          return NodeFilter.FILTER_REJECT;
        }

        return NodeFilter.FILTER_ACCEPT;
      }
    });

    let currentNode;
    while ((currentNode = walker.nextNode())) {
      textParts.push(currentNode.textContent);
    }

    return textParts.join(" ");
  }

  function clearHighlights() {
    document.querySelectorAll(`span.${HIGHLIGHT_CLASS}[${DATA_ATTRIBUTE}]`).forEach((element) => {
      const parent = element.parentNode;
      if (!parent) {
        return;
      }

      parent.replaceChild(document.createTextNode(element.textContent), element);
      parent.normalize();
    });

    const panel = document.getElementById(PANEL_ID);
    if (panel) {
      panel.remove();
    }
  }

  function buildHighlightRegex(terms) {
    const source = terms
      .map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+"))
      .join("|");

    return new RegExp(`\\b(${source})\\b`, "giu");
  }

  function highlightNode(node, regex) {
    const text = node.textContent;
    regex.lastIndex = 0;

    if (!regex.test(text)) {
      return 0;
    }

    regex.lastIndex = 0;
    const fragment = document.createDocumentFragment();
    let lastIndex = 0;
    let count = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      const index = match.index;
      if (index > lastIndex) {
        fragment.appendChild(document.createTextNode(text.slice(lastIndex, index)));
      }

      const mark = document.createElement("span");
      mark.className = HIGHLIGHT_CLASS;
      mark.setAttribute(DATA_ATTRIBUTE, "true");
      mark.textContent = match[0];
      fragment.appendChild(mark);

      lastIndex = index + match[0].length;
      count += 1;
    }

    if (lastIndex < text.length) {
      fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
    }

    node.parentNode.replaceChild(fragment, node);
    return count;
  }

  function applyHighlights(root, terms) {
    if (!terms || terms.length === 0) {
      return 0;
    }

    const regex = buildHighlightRegex(terms);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (shouldSkipNode(node)) {
          return NodeFilter.FILTER_REJECT;
        }

        if (!node.textContent || node.textContent.trim().length < 2) {
          return NodeFilter.FILTER_REJECT;
        }

        return NodeFilter.FILTER_ACCEPT;
      }
    });

    const nodes = [];
    let currentNode;
    while ((currentNode = walker.nextNode())) {
      nodes.push(currentNode);
    }

    return nodes.reduce((total, node) => total + highlightNode(node, regex), 0);
  }

  function appendTextElement(parent, tagName, className, text) {
    const element = document.createElement(tagName);
    if (className) {
      element.className = className;
    }
    element.textContent = text;
    parent.appendChild(element);
    return element;
  }

  function renderPanel(summary) {
    const existing = document.getElementById(PANEL_ID);
    if (existing) {
      existing.remove();
    }

    const panel = document.createElement("aside");
    panel.id = PANEL_ID;
    const head = document.createElement("div");
    head.className = "werkcv-panel-head";

    const headingGroup = document.createElement("div");
    appendTextElement(headingGroup, "p", "werkcv-panel-eyebrow", "WerkCV scan");
    appendTextElement(
      headingGroup,
      "h2",
      "",
      `${summary.totalKeywords} keyword${summary.totalKeywords === 1 ? "" : "s"} highlighted`
    );
    head.appendChild(headingGroup);

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className = "werkcv-panel-close";
    closeButton.setAttribute("aria-label", "Remove WerkCV highlights");
    closeButton.textContent = "×";
    closeButton.addEventListener("click", clearHighlights);
    head.appendChild(closeButton);

    panel.appendChild(head);
    appendTextElement(panel, "p", "werkcv-panel-copy", "Top CV signals found on this job page.");

    const tags = document.createElement("div");
    tags.className = "werkcv-panel-tags";
    summary.previewTerms.forEach((term) => {
      appendTextElement(tags, "span", "", term);
    });
    panel.appendChild(tags);

    document.body.appendChild(panel);
  }

  function summarizePreview(result) {
    const previewTerms = [
      ...result.grouped.hard,
      ...result.grouped.soft,
      ...result.grouped.qualification,
      ...result.grouped.theme
    ]
      .slice(0, 6)
      .map((item) => item.label);

    return {
      totalKeywords: result.totalKeywords,
      previewTerms
    };
  }

  function scanPage() {
    const root = getScanRoot();
    const visibleText = collectVisibleText(root);

    if (visibleText.length < 250) {
      return {
        ok: false,
        error: "Not enough job-page text was found on this page."
      };
    }

    const result = globalThis.WerkCVKeywordHighlighter.analyzeText(visibleText);
    if (!result.isLikelyVacancy) {
      clearHighlights();
      return {
        ok: false,
        error: "This page does not look like a Dutch or English job page."
      };
    }

    if (result.totalKeywords === 0) {
      clearHighlights();
      return {
        ok: false,
        error: "No clear CV-relevant keywords were detected on this page."
      };
    }

    clearHighlights();
    const highlightCount = applyHighlights(root, result.highlightTerms);
    const preview = summarizePreview(result);
    renderPanel(preview);

    return {
      ok: true,
      pageTitle: document.title,
      wordCount: result.wordCount,
      highlightCount,
      totalKeywords: result.totalKeywords,
      grouped: result.grouped
    };
  }

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "WERKCV_SCAN_PAGE") {
      sendResponse(scanPage());
      return;
    }

    if (message.type === "WERKCV_CLEAR_HIGHLIGHTS") {
      clearHighlights();
      sendResponse({ ok: true });
    }
  });
})();
