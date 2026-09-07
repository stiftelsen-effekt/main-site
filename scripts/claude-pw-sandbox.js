/**
 * Playwright bootstrap for Claude Code cloud sandbox sessions.
 *
 * The sandbox routes outbound HTTPS through a proxy that Chromium neither
 * picks up from the environment nor trusts (custom CA), and it advertises
 * HTTP/3 which doesn't tunnel through the proxy. On top of that, Chromium
 * connections to some hosts (e.g. cdn.sanity.io) are reset even via the
 * proxy, while curl succeeds — requests to those hosts are fulfilled
 * out-of-band with curl so images render in screenshots.
 *
 * Harmless locally: without proxy env vars it launches a plain browser.
 *
 * Usage (from a throwaway verification script at the repo root):
 *   const { chromium } = require("@playwright/test");
 *   const { launchSandboxPage } = require("./scripts/claude-pw-sandbox");
 *   const { browser, page } = await launchSandboxPage(chromium, {
 *     viewport: { width: 1440, height: 900 },
 *   });
 *   await page.goto("http://localhost:3000");
 *   await page.screenshot({ path: "screenshots/home-desktop.png" });
 *   await browser.close();
 */
const { execFileSync } = require("child_process");

// Hosts that reset direct/proxied Chromium connections in the sandbox.
// Keep this to asset CDNs — the fallback only handles GET requests.
const CURL_FALLBACK_HOSTS = [/^cdn\.sanity\.io$/];

const TYPE_BY_EXT = {
  svg: "image/svg+xml",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
  avif: "image/avif",
  ico: "image/x-icon",
  json: "application/json",
};

function contentTypeFor(url) {
  const ext = new URL(url).pathname.split(".").pop().toLowerCase();
  return TYPE_BY_EXT[ext] || "application/octet-stream";
}

async function launchSandboxPage(chromium, { viewport } = {}) {
  const proxy =
    process.env.HTTPS_PROXY ||
    process.env.https_proxy ||
    process.env.HTTP_PROXY ||
    process.env.http_proxy;

  const browser = await chromium.launch({
    proxy: proxy ? { server: proxy } : undefined,
    args: ["--disable-quic"],
  });
  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
    viewport,
  });

  await context.route(
    (url) => CURL_FALLBACK_HOSTS.some((re) => re.test(url.hostname)),
    async (route) => {
      if (route.request().method() !== "GET") {
        await route.continue().catch(() => {});
        return;
      }
      const url = route.request().url();
      try {
        const body = execFileSync("curl", ["-sSfL", "--max-time", "20", url], {
          maxBuffer: 50 * 1024 * 1024,
        });
        await route.fulfill({ body, contentType: contentTypeFor(url) });
      } catch {
        await route.continue().catch(() => {});
      }
    },
  );

  const page = await context.newPage();
  return { browser, context, page };
}

module.exports = { launchSandboxPage };
