import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..", "..");
const extensionRoot = path.join(repoRoot, "chrome-extension", "werkcv-vacature-keyword-highlighter");
const outputDir = path.join(repoRoot, "chrome-extension", "artifacts", "werkcv-vacature-keyword-highlighter");
const iconPath = path.join(extensionRoot, "icons", "icon-128.png");

function card(label, title, body) {
  return `
    <section class="card">
      <p class="card-label">${label}</p>
      <h2>${title}</h2>
      <p>${body}</p>
    </section>
  `;
}

function pageTemplate({ kicker, title, subtitle, left, right, footer }, iconDataUri) {
  return `<!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8">
      <style>
        * { box-sizing: border-box; }
        body {
          margin: 0;
          width: 1280px;
          height: 800px;
          overflow: hidden;
          font-family: Arial, Helvetica, sans-serif;
          background:
            radial-gradient(circle at top left, #fff8c7 0, #fff8c7 24%, transparent 25%),
            linear-gradient(135deg, #f7f3e4 0%, #f2efe4 48%, #dff1ee 100%);
          color: #111111;
        }
        .frame {
          position: relative;
          width: 100%;
          height: 100%;
          padding: 44px;
        }
        .brand {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 24px;
          padding: 12px 18px;
          border: 3px solid #111111;
          background: rgba(255, 255, 255, 0.88);
          box-shadow: 6px 6px 0 rgba(17, 17, 17, 1);
        }
        .brand img {
          width: 44px;
          height: 44px;
          border: 2px solid #111111;
          border-radius: 10px;
          background: #ffffff;
        }
        .brand-copy {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .brand-copy strong {
          font-size: 22px;
          line-height: 1;
        }
        .brand-copy span {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }
        .headline {
          max-width: 760px;
          margin-bottom: 26px;
        }
        .headline p {
          margin: 0 0 10px;
          font-size: 15px;
          font-weight: 900;
          letter-spacing: 0.22em;
          text-transform: uppercase;
        }
        .headline h1 {
          margin: 0 0 12px;
          font-size: 54px;
          line-height: 0.94;
        }
        .headline .subtitle {
          margin: 0;
          max-width: 720px;
          font-size: 22px;
          line-height: 1.35;
          font-weight: 700;
        }
        .content {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 24px;
          align-items: stretch;
        }
        .column {
          display: grid;
          gap: 18px;
        }
        .card {
          border: 4px solid #111111;
          background: rgba(255, 255, 255, 0.96);
          box-shadow: 8px 8px 0 rgba(17, 17, 17, 1);
          padding: 22px;
        }
        .card-label {
          display: inline-block;
          margin: 0 0 14px;
          padding: 6px 10px;
          border: 2px solid #111111;
          background: #ffe24f;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }
        .card h2 {
          margin: 0 0 12px;
          font-size: 28px;
          line-height: 1;
        }
        .card p {
          margin: 0;
          font-size: 18px;
          line-height: 1.42;
          font-weight: 700;
        }
        .tag-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 18px;
        }
        .tag {
          padding: 8px 12px;
          border: 2px solid #111111;
          background: #f5f5f5;
          font-size: 15px;
          font-weight: 800;
        }
        .tag.highlight {
          background: #fff39c;
        }
        .browser {
          border: 4px solid #111111;
          background: #ffffff;
          box-shadow: 8px 8px 0 rgba(17, 17, 17, 1);
          overflow: hidden;
        }
        .browser-top {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 18px;
          border-bottom: 3px solid #111111;
          background: #f0f0f0;
        }
        .dot {
          width: 12px;
          height: 12px;
          border: 2px solid #111111;
          border-radius: 999px;
          background: #ffe24f;
        }
        .url {
          flex: 1;
          padding: 9px 12px;
          border: 2px solid #111111;
          background: #ffffff;
          font-size: 14px;
          font-weight: 800;
        }
        .browser-body {
          display: grid;
          grid-template-columns: 1.45fr 0.9fr;
          min-height: 420px;
        }
        .job {
          padding: 24px;
          background: #fcfaf1;
          border-right: 3px solid #111111;
        }
        .job h3 {
          margin: 0 0 14px;
          font-size: 30px;
          line-height: 1.02;
        }
        .job p, .job li {
          font-size: 17px;
          font-weight: 700;
          line-height: 1.45;
        }
        .job ul {
          margin: 14px 0 0;
          padding-left: 22px;
        }
        .mark {
          padding: 0 5px;
          background: #fff39c;
          box-shadow: inset 0 -6px 0 rgba(255, 202, 40, 0.85);
        }
        .panel {
          padding: 20px;
          background: #ffffff;
        }
        .panel-box {
          border: 3px solid #111111;
          background: #fffdf7;
          padding: 18px;
        }
        .panel-box + .panel-box {
          margin-top: 14px;
        }
        .panel-eyebrow {
          margin: 0 0 8px;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }
        .panel-title {
          margin: 0 0 10px;
          font-size: 24px;
          line-height: 1;
        }
        .panel-copy {
          margin: 0;
          font-size: 15px;
          line-height: 1.45;
          font-weight: 700;
        }
        .mini-list {
          margin: 14px 0 0;
          padding: 0;
          list-style: none;
          display: grid;
          gap: 9px;
        }
        .mini-list li {
          border: 2px solid #111111;
          background: #fff39c;
          padding: 8px 10px;
          font-size: 14px;
          font-weight: 800;
        }
        .footer {
          position: absolute;
          left: 44px;
          right: 44px;
          bottom: 28px;
          display: flex;
          justify-content: space-between;
          gap: 20px;
          font-size: 14px;
          font-weight: 900;
        }
      </style>
    </head>
    <body>
      <div class="frame">
        <div class="brand">
          <img src="${iconDataUri}" alt="">
          <div class="brand-copy">
            <strong>WerkCV</strong>
            <span>Vacature Keyword Highlighter</span>
          </div>
        </div>
        <div class="headline">
          <p>${kicker}</p>
          <h1>${title}</h1>
          <p class="subtitle">${subtitle}</p>
        </div>
        <div class="content">
          <div class="column">${left}</div>
          <div class="column">${right}</div>
        </div>
        <div class="footer">
          ${footer}
        </div>
      </div>
    </body>
  </html>`;
}

const iconBuffer = await fs.readFile(iconPath);
const iconDataUri = `data:image/png;base64,${iconBuffer.toString("base64")}`;

const scenes = [
  {
    file: "store-screenshot-1-overview.png",
    html: pageTemplate(
      {
        kicker: "Screenshot 1",
        title: "Scan job pages and pull out reusable CV wording",
        subtitle:
          "The extension highlights relevant terms on the page and groups them into skills, qualifications, and themes.",
        left: `
          <div class="browser">
            <div class="browser-top">
              <span class="dot"></span><span class="dot"></span><span class="dot"></span>
              <div class="url">https://jobs.example.com/marketingmedewerker</div>
            </div>
            <div class="browser-body">
              <div class="job">
                <h3>Marketingmedewerker met focus op content en recruitment campagnes</h3>
                <p>
                  Voor een groeiend team zoeken wij een <span class="mark">proactieve</span>,
                  <span class="mark">analytische</span> marketeer met ervaring in
                  <span class="mark">SEO</span>, <span class="mark">Google Analytics</span>,
                  <span class="mark">WordPress</span> en <span class="mark">social media</span>.
                </p>
                <ul>
                  <li><span class="mark">HBO</span> werk- en denkniveau</li>
                  <li><span class="mark">Goede beheersing van Nederlands en Engels</span></li>
                  <li><span class="mark">Hybride</span> rol met zichtbare impact</li>
                </ul>
              </div>
              <div class="panel">
                <div class="panel-box">
                  <p class="panel-eyebrow">Popup summary</p>
                  <h4 class="panel-title">17 keywords highlighted</h4>
                  <p class="panel-copy">Top CV signals found on this job page.</p>
                  <div class="tag-grid">
                    <span class="tag highlight">SEO</span>
                    <span class="tag highlight">Google Analytics</span>
                    <span class="tag highlight">WordPress</span>
                    <span class="tag highlight">HBO</span>
                    <span class="tag highlight">Hybride</span>
                  </div>
                </div>
              </div>
            </div>
          </div>`,
        right: `
          ${card("Grouped output", "See the strongest CV signals fast", "Hard skills, soft skills, qualifications, and repeated themes are surfaced in one scan so the user can tailor a CV quickly.")}
          ${card("Use case", "Designed for CV tailoring", "Open a job listing, scan it, and carry the strongest wording into your CV or motivation letter without copying the whole vacancy verbatim.")}
        `,
        footer:
          "<span>Works on Dutch and English job pages</span><span>Local browser analysis on the active tab</span>",
      },
      iconDataUri
    ),
  },
  {
    file: "store-screenshot-2-dutch-page.png",
    html: pageTemplate(
      {
        kicker: "Screenshot 2",
        title: "Built for Dutch vacature pages",
        subtitle:
          "Dutch vacancy markers like functieomschrijving, wat je gaat doen, wat breng je mee, and arbeidsvoorwaarden are recognized directly.",
        left: `
          ${card("Dutch-first logic", "Recognizes vacature structure", "The scanner checks whether the page looks like a real job listing before it starts highlighting, which helps reject irrelevant pages like forums or social feeds.")}
          ${card("Detected terms", "Examples from a Dutch listing", "SEO, WordPress, Google Analytics, communicatief sterk, klantgericht, HBO, Nederlands, Engels, hybride, and arbeidsvoorwaarden.")}
        `,
        right: `
          <div class="browser">
            <div class="browser-top">
              <span class="dot"></span><span class="dot"></span><span class="dot"></span>
              <div class="url">https://werkgevers.example.nl/vacature/marketingmedewerker</div>
            </div>
            <div class="browser-body">
              <div class="job">
                <h3>Wat breng je mee?</h3>
                <ul>
                  <li><span class="mark">HBO</span> werk- en denkniveau</li>
                  <li>Ervaring met <span class="mark">SEO</span>, <span class="mark">Excel</span> en <span class="mark">WordPress</span></li>
                  <li>Kennis van <span class="mark">Google Analytics</span> en procesverbetering</li>
                  <li><span class="mark">Communicatief sterk</span> en <span class="mark">klantgericht</span></li>
                </ul>
                <h3 style="margin-top:18px;">Wat bieden wij?</h3>
                <p>Een <span class="mark">hybride</span> rol met goede <span class="mark">arbeidsvoorwaarden</span>.</p>
              </div>
              <div class="panel">
                <div class="panel-box">
                  <p class="panel-eyebrow">WerkCV scan</p>
                  <h4 class="panel-title">Dutch vacancy detected</h4>
                  <ul class="mini-list">
                    <li>Hard skills: SEO, Excel, WordPress</li>
                    <li>Soft skills: Communicatief sterk, klantgericht</li>
                    <li>Qualifications: HBO, Nederlands, Engels</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>`,
        footer:
          "<span>Dutch vacancy markers improve accuracy</span><span>Non-job pages are rejected before highlighting</span>",
      },
      iconDataUri
    ),
  },
  {
    file: "store-screenshot-3-english-page.png",
    html: pageTemplate(
      {
        kicker: "Screenshot 3",
        title: "Also works on English job pages",
        subtitle:
          "The scanner also understands common English job-page structure like responsibilities, qualifications, experience with, benefits, and compensation.",
        left: `
          <div class="browser">
            <div class="browser-top">
              <span class="dot"></span><span class="dot"></span><span class="dot"></span>
              <div class="url">https://jobs.example.com/web-experience-manager</div>
            </div>
            <div class="browser-body">
              <div class="job">
                <h3>Key Responsibilities</h3>
                <p>
                  Lead <span class="mark">WordPress</span> optimization, improve
                  <span class="mark">SEO</span> performance, run <span class="mark">A/B testing</span>,
                  and use <span class="mark">GA4</span>, <span class="mark">HubSpot</span>, and
                  <span class="mark">Google Search Console</span> to improve conversion.
                </p>
                <h3 style="margin-top:18px;">Requirements</h3>
                <ul>
                  <li><span class="mark">Analytical</span> and <span class="mark">collaborative</span></li>
                  <li>Experience with <span class="mark">CRO</span> and <span class="mark">SaaS</span></li>
                  <li><span class="mark">Hybrid</span> full-time role with transparent <span class="mark">compensation</span></li>
                </ul>
              </div>
              <div class="panel">
                <div class="panel-box">
                  <p class="panel-eyebrow">Grouped summary</p>
                  <h4 class="panel-title">Technical stack + skills</h4>
                  <ul class="mini-list">
                    <li>Hard skills: WordPress, SEO, GA4, HubSpot</li>
                    <li>Soft skills: Analytical, collaborative</li>
                    <li>Themes: Hybrid, compensation, conversion</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>`,
        right: `
          ${card("English support", "Bilingual detection", "English vacancy markers and phrase patterns are supported alongside Dutch ones, so the extension can handle mixed hiring funnels and international roles.")}
          ${card("Examples", "Recognized English signals", "Responsibilities, requirements, benefits, compensation, experience with, knowledge of, fluent in, and common marketing or web tooling stacks.")}
        `,
        footer:
          "<span>Bilingual vacancy and phrase detection</span><span>Useful for local and international roles</span>",
      },
      iconDataUri
    ),
  },
  {
    file: "store-screenshot-4-privacy.png",
    html: pageTemplate(
      {
        kicker: "Screenshot 4",
        title: "Local-only behavior, minimal permissions",
        subtitle:
          "The extension is intentionally narrow: it works on the active tab only, runs locally in the browser, and does not require an account.",
        left: `
          ${card("No account", "Use it without signing in", "There is no login wall for the scanner itself. Open a job page, click scan, and review the highlighted terms.")}
          ${card("Permissions", "Only what the extension needs", "activeTab limits scanning to the page the user chooses. scripting injects the local highlighter into that page so matches can be shown visually.")}
        `,
        right: `
          ${card("Data handling", "Page text stays in the browser", "The current extension version does not upload job-page text to WerkCV servers and does not do background scraping across tabs.")}
          <section class="card">
            <p class="card-label">Privacy summary</p>
            <h2>Clear scope for reviewers</h2>
            <div class="tag-grid">
              <span class="tag highlight">Local scan</span>
              <span class="tag highlight">No remote code</span>
              <span class="tag highlight">No background scraping</span>
              <span class="tag highlight">No account required</span>
              <span class="tag highlight">Current tab only</span>
            </div>
          </section>
        `,
        footer:
          "<span>Support URL: werkcv.nl/chrome/vacature-keyword-highlighter</span><span>Privacy URL: werkcv.nl/chrome/vacature-keyword-highlighter/privacy</span>",
      },
      iconDataUri
    ),
  },
];

await fs.mkdir(outputDir, { recursive: true });

const browser = await puppeteer.launch({
  channel: "chrome",
  headless: true,
  defaultViewport: {
    width: 1280,
    height: 800,
    deviceScaleFactor: 1,
  },
});

try {
  const page = await browser.newPage();

  for (const scene of scenes) {
    await page.setContent(scene.html, { waitUntil: "domcontentloaded", timeout: 0 });
    await page.screenshot({
      path: path.join(outputDir, scene.file),
      type: "png",
    });
  }
} finally {
  await browser.close();
}

console.log(`Generated ${scenes.length} store screenshots in ${outputDir}`);
