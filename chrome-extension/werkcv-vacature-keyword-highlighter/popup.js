const elements = {
  scanButton: document.getElementById("scanButton"),
  clearButton: document.getElementById("clearButton"),
  statusMessage: document.getElementById("statusMessage"),
  pageTitle: document.getElementById("pageTitle"),
  pageUrl: document.getElementById("pageUrl"),
  resultsPanel: document.getElementById("resultsPanel"),
  highlightCount: document.getElementById("highlightCount"),
  wordCount: document.getElementById("wordCount"),
  hardSkillsList: document.getElementById("hardSkillsList"),
  softSkillsList: document.getElementById("softSkillsList"),
  themesList: document.getElementById("themesList"),
  qualificationsList: document.getElementById("qualificationsList"),
  hardSkillCount: document.getElementById("hardSkillCount"),
  softSkillCount: document.getElementById("softSkillCount"),
  themeCount: document.getElementById("themeCount"),
  qualificationCount: document.getElementById("qualificationCount")
};

async function getActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

function setStatus(message, tone = "") {
  elements.statusMessage.textContent = message;
  elements.statusMessage.className = `status${tone ? ` ${tone}` : ""}`;
}

function toggleBusy(isBusy) {
  elements.scanButton.disabled = isBusy;
  elements.clearButton.disabled = isBusy;
}

function isSupportedUrl(url) {
  return Boolean(url && /^https?:\/\//i.test(url));
}

async function injectScripts(tabId) {
  await chrome.scripting.insertCSS({
    target: { tabId },
    files: ["highlighter.css"]
  });

  await chrome.scripting.executeScript({
    target: { tabId },
    files: ["shared.js", "content.js"]
  });
}

async function sendMessage(tabId, message) {
  return chrome.tabs.sendMessage(tabId, message);
}

function renderKeywordList(element, items) {
  element.innerHTML = "";

  if (!items || items.length === 0) {
    const empty = document.createElement("li");
    empty.textContent = "No strong signals found";
    element.appendChild(empty);
    return;
  }

  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `${item.label}${item.count > 1 ? ` ×${item.count}` : ""}`;
    element.appendChild(li);
  });
}

function renderResults(result) {
  elements.resultsPanel.hidden = false;
  elements.highlightCount.textContent = String(result.highlightCount);
  elements.wordCount.textContent = String(result.wordCount);
  elements.hardSkillCount.textContent = String(result.grouped.hard.length);
  elements.softSkillCount.textContent = String(result.grouped.soft.length);
  elements.themeCount.textContent = String(result.grouped.theme.length);
  elements.qualificationCount.textContent = String(result.grouped.qualification.length);

  renderKeywordList(elements.hardSkillsList, result.grouped.hard);
  renderKeywordList(elements.softSkillsList, result.grouped.soft);
  renderKeywordList(elements.themesList, result.grouped.theme);
  renderKeywordList(elements.qualificationsList, result.grouped.qualification);
}

function clearResults() {
  elements.resultsPanel.hidden = true;
  elements.highlightCount.textContent = "0";
  elements.wordCount.textContent = "0";
}

async function scanCurrentTab() {
  const tab = await getActiveTab();

  if (!tab || !isSupportedUrl(tab.url)) {
    clearResults();
    setStatus("This extension only works on regular http(s) pages.", "error");
    return;
  }

  toggleBusy(true);
  setStatus("Scanning the current page...", "");

  try {
    await injectScripts(tab.id);
    const result = await sendMessage(tab.id, { type: "WERKCV_SCAN_PAGE" });

    if (!result || !result.ok) {
      clearResults();
      setStatus(result?.error || "No job-page result came back from the page.", "error");
      return;
    }

    renderResults(result);
    setStatus(`Highlighted ${result.highlightCount} matches on the page.`, "success");
  } catch (error) {
    clearResults();
    setStatus(`Unable to scan this page: ${error.message}`, "error");
  } finally {
    toggleBusy(false);
  }
}

async function clearCurrentTabHighlights() {
  const tab = await getActiveTab();

  if (!tab || !isSupportedUrl(tab.url)) {
    clearResults();
    setStatus("Open a regular job page first.", "error");
    return;
  }

  toggleBusy(true);

  try {
    await injectScripts(tab.id);
    await sendMessage(tab.id, { type: "WERKCV_CLEAR_HIGHLIGHTS" });
    clearResults();
    setStatus("Highlights removed from the current page.", "success");
  } catch (error) {
    setStatus(`Unable to remove highlights: ${error.message}`, "error");
  } finally {
    toggleBusy(false);
  }
}

async function initializePopup() {
  const tab = await getActiveTab();
  elements.pageTitle.textContent = tab?.title || "No active tab";
  elements.pageUrl.textContent = tab?.url || "";

  if (!tab || !isSupportedUrl(tab.url)) {
    setStatus("Open a Dutch or English job page in a regular browser tab to use this extension.", "error");
    elements.scanButton.disabled = true;
    elements.clearButton.disabled = true;
    return;
  }

  setStatus("Ready to scan the current job page.");
}

elements.scanButton.addEventListener("click", () => {
  scanCurrentTab();
});

elements.clearButton.addEventListener("click", () => {
  clearCurrentTabHighlights();
});

initializePopup();
