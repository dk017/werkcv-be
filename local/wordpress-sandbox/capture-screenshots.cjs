const path = require("path");
const { chromium, devices } = require("../../wordpress-plugin/werkcv-salaris-tools/node_modules/playwright");

const repoRoot = path.resolve(__dirname, "..", "..");
const screenshotDir = path.join(repoRoot, "wordpress-plugin", "werkcv-salaris-tools", "screenshots");
const baseUrl = "http://localhost:8088";
const adminUser = "admin";
const adminPassword = "admin123!";

async function login(page) {
  await page.goto(`${baseUrl}/wp-admin/`, { waitUntil: "domcontentloaded" });

  if (await page.locator("#user_login").count()) {
    await page.locator("#user_login").fill(adminUser);
    await page.locator("#user_pass").fill(adminPassword);
    await Promise.all([
      page.waitForNavigation({ waitUntil: "domcontentloaded" }),
      page.locator("#wp-submit").click(),
    ]);
  }
}

async function closeStarterPatterns(page) {
  const overlay = page.locator(".components-modal__screen-overlay");
  if (await overlay.count()) {
    const closeButton = overlay.locator('button[aria-label="Close"]').first();
    if (await closeButton.count()) {
      await closeButton.click();
      await page.waitForTimeout(800);
    }
  }
}

async function captureBlockInserter(browser) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1200 },
  });
  const page = await context.newPage();
  page.setDefaultTimeout(60000);

  await login(page);
  await page.goto(`${baseUrl}/wp-admin/post-new.php?post_type=page`, {
    waitUntil: "domcontentloaded",
  });
  await page.waitForTimeout(2500);
  await closeStarterPatterns(page);

  await page.locator('button[aria-label="Block Inserter"]').click();
  await page.waitForTimeout(1000);
  await page.locator('input[placeholder="Search"]').fill("WerkCV");
  await page.waitForTimeout(1000);

  await page.screenshot({
    path: path.join(screenshotDir, "screenshot-1.png"),
    fullPage: false,
  });

  await context.close();
}

async function captureNettoDesktop(browser) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1200 },
  });
  const page = await context.newPage();
  page.setDefaultTimeout(60000);

  await page.goto(`${baseUrl}/werkcv-netto-bruto-test/`, { waitUntil: "domcontentloaded" });
  const tool = page.locator(".werkcv-salaris-tool").first();
  await tool.waitFor({ state: "visible" });
  await tool.scrollIntoViewIfNeeded();
  await page.waitForTimeout(4000);

  await page.screenshot({
    path: path.join(screenshotDir, "screenshot-2.png"),
    fullPage: false,
  });

  await context.close();
}

async function captureSettings(browser) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1200 },
  });
  const page = await context.newPage();
  page.setDefaultTimeout(60000);

  await login(page);
  await page.goto(`${baseUrl}/wp-admin/options-general.php?page=werkcv-salaris-tools`, {
    waitUntil: "domcontentloaded",
  });
  await page.waitForTimeout(1500);

  await page.screenshot({
    path: path.join(screenshotDir, "screenshot-3.png"),
    fullPage: false,
  });

  await context.close();
}

async function captureMobile(browser) {
  const context = await browser.newContext({
    ...devices["iPhone 13"],
  });
  const page = await context.newPage();
  page.setDefaultTimeout(60000);

  await page.goto(`${baseUrl}/werkcv-vakantiegeld/`, { waitUntil: "domcontentloaded" });
  const tool = page.locator(".werkcv-salaris-tool").first();
  await tool.waitFor({ state: "visible" });
  await tool.scrollIntoViewIfNeeded();
  await page.waitForTimeout(4000);

  await page.screenshot({
    path: path.join(screenshotDir, "screenshot-4.png"),
    fullPage: false,
  });

  await context.close();
}

async function main() {
  const browser = await chromium.launch({ headless: true });

  try {
    await captureBlockInserter(browser);
    await captureNettoDesktop(browser);
    await captureSettings(browser);
    await captureMobile(browser);
  } finally {
    await browser.close();
  }

  console.log(`Saved screenshots to ${screenshotDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
