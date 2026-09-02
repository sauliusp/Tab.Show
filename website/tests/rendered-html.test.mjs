import assert from "node:assert/strict";
import test from "node:test";

const workerUrl = new URL("../dist/server/index.js", import.meta.url);
workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
const { default: worker } = await import(workerUrl.href);

async function render(path = "/") {
  return worker.fetch(
    new Request(`https://tab.show${path}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

const routes = [
  ["/", "Find the Right Chrome Tab Before You Switch", "Find the right tab"],
  ["/chrome-tab-preview-extension", "Chrome Tab Preview Extension", "Preview live Chrome tabs"],
  ["/find-lost-chrome-tab", "How to Find a Lost Chrome Tab", "Stop guessing which tab"],
  ["/onetab-alternative", "OneTab Alternative", "Keep live tabs live"],
  ["/workona-alternative", "Workona Alternative", "Skip the workspace setup"],
  ["/tab-manager-plus-alternative", "Tab Manager Plus Alternative", "Recognize the page"],
  ["/privacy", "Privacy", "Your tabs stay"],
  ["/changelog", "TabShow Changelog", "TabShow 2.1"],
  ["/support", "TabShow Support", "Get back to the tab"],
];

test("server-renders the complete SEO route set with unique titles and canonicals", async () => {
  const seenTitles = new Set();
  for (const [path, titleNeedle, h1Needle] of routes) {
    const response = await render(path);
    assert.equal(response.status, 200, path);
    assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i, path);
    const html = await response.text();
    const title = html.match(/<title>(.*?)<\/title>/i)?.[1] ?? "";
    assert.match(title, new RegExp(titleNeedle, "i"), path);
    assert.ok(!seenTitles.has(title), `duplicate title: ${title}`);
    seenTitles.add(title);
    assert.match(html, new RegExp(h1Needle, "i"), path);
    const canonical = path === "/" ? "https://tab.show/" : `https://tab.show${path}`;
    assert.match(html, new RegExp(`<link[^>]+rel=["']canonical["'][^>]+href=["']${canonical.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']`, "i"), path);
    assert.match(html, /tabshow-social-card\.png/i, path);
  }
});

test("homepage uses authentic product proof and honest conversion language", async () => {
  const response = await render("/");
  const html = await response.text();
  assert.match(html, /store-01-preview\.png/);
  assert.match(html, /store-02-search\.png/);
  assert.match(html, /store-04-windows\.png/);
  assert.match(html, /No account/);
  assert.match(html, /No host permissions/);
  assert.match(html, /narsheek\.featurebase\.app/);
  assert.match(html, /If TabShow has earned five stars/);
  assert.match(html, /"@type":"SoftwareApplication"/);
  assert.match(html, /"@type":"FAQPage"/);
  assert.doesNotMatch(html, /join thousands|zero impact|best free chrome tab manager|100% free forever/i);
});

test("comparison pages make an honest two-sided recommendation", async () => {
  for (const path of ["/onetab-alternative", "/workona-alternative", "/tab-manager-plus-alternative"]) {
    const html = await (await render(path)).text();
    assert.match(html, /Which job are you hiring the tool for\?/);
    assert.match(html, /Choose TabShow/);
    assert.match(html, /Choose (?:<!-- -->)?(OneTab|Workona|Tab Manager Plus)/);
    assert.match(html, /No account\. No backend/);
  }
});

test("privacy and support match the shipped permission and cross-window behavior", async () => {
  const privacy = await (await render("/privacy")).text();
  assert.match(privacy, /sidePanel/);
  assert.match(privacy, /tabGroups/);
  assert.match(privacy, /favicon/);
  assert.match(privacy, /activeTab[\s\S]{0,160}removed[\s\S]{0,120}implementation did not use it/i);
  assert.match(privacy, /TabShow 2\.1 adds no permissions/i);
  assert.match(privacy, /does not read page contents/i);
  assert.match(privacy, /up to 90 local daily check-ins/i);
  assert.match(privacy, /Repeated panel openings update the current day's check-in/i);
  assert.match(privacy, /retains the all-time best score/i);
  assert.match(privacy, /clearing TabShow's extension data in Chrome or uninstalling the extension/i);

  const support = await (await render("/support")).text();
  assert.match(support, /Shift \+ Command \+ X/);
  assert.match(support, /tabs belonging to another window show a switch indicator/i);
  assert.match(support, /Share feedback/);
  assert.match(support, /Rate TabShow/);
});

test("changelog preserves the complete user-facing release history", async () => {
  const changelog = await (await render("/changelog")).text();
  for (const version of ["2.1", "2.0", "1.0.0", "0.9.2", "0.9.1", "0.9.0", "0.8.2", "0.8.1", "0.8.0", "0.7.1", "0.7.0", "0.6.0", "0.5.0"]) {
    assert.match(changelog, new RegExp(`Version (?:<!-- -->)?${version.replaceAll(".", "\\.")}`));
  }
  assert.match(changelog, /Featurebase feedback board/);
  assert.match(changelog, /hover-to-preview interaction/);
  assert.doesNotMatch(changelog, /tab age, domains|domains, and Chrome groups/i);
});

test("search copy keeps full-scope totals distinct from filtered results", async () => {
  const lostTabPage = await (await render("/find-lost-chrome-tab")).text();
  assert.match(lostTabPage, /Search narrows the visible list/);
  assert.match(lostTabPage, /complete selected scope/);
  assert.doesNotMatch(lostTabPage, /result count shows how many tabs and windows match/i);
});

test("robots and sitemap expose the intended public surface", async () => {
  const robots = await render("/robots.txt");
  assert.equal(robots.status, 200);
  assert.match(await robots.text(), /Sitemap: https:\/\/tab\.show\/sitemap\.xml/);

  const sitemap = await render("/sitemap.xml");
  assert.equal(sitemap.status, 200);
  const xml = await sitemap.text();
  for (const [path] of routes) {
    const url = path === "/" ? "https://tab.show/" : `https://tab.show${path}`;
    assert.match(xml, new RegExp(url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
});
