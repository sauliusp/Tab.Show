import type { Metadata } from "next";
import {
  Community,
  Faq,
  FinalCta,
  Footer,
  Header,
  ProductImage,
  StoreButton,
  storeUrl,
} from "./site";

export const metadata: Metadata = {
  title: "Find the Right Chrome Tab Before You Switch",
  description:
    "TabShow adds searchable side-panel tabs and live page preview to Chrome. Point, preview, switch, or snap back. No account or backend.",
  alternates: { canonical: "/" },
};

const faq = [
  { q: "Is TabShow free?", a: "Yes. Every feature is free to use. If you would like to support its development, you can leave a tip through Buy Me a Coffee. Support is entirely optional." },
  { q: "Does TabShow read the contents of webpages?", a: "No. TabShow does not request host permissions and cannot read page contents. It uses Chrome's tab metadata, such as titles, URLs, favicons, groups, and status, to power the side panel." },
  { q: "Can I search tabs across every Chrome window?", a: "Yes. Choose All windows to search and organize tabs across Chrome windows. For safety, a tab in another window switches only when clicked; hover preview does not steal focus across windows." },
  { q: "What happens when I move away from a preview?", a: "TabShow returns you to the original tab. If the preview was the right page, click it to make the switch permanent." },
  { q: "Can I use TabShow with the keyboard?", a: "Yes. Arrow keys select search results, Enter opens the selected tab, and Escape returns to the original tab. Hover a current-window result when you want a live preview. The side panel shortcut can be customized in Chrome's extension shortcut settings." },
];

export default function Home() {
  const softwareJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "TabShow",
    applicationCategory: "BrowserApplication",
    operatingSystem: "Google Chrome",
    description: "Search or point at open tabs, preview the live page before you switch, or move away to snap back.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    url: "https://tab.show/",
    downloadUrl: storeUrl("home_schema"),
  };

  return (
    <>
      <Header />
      <main>
        <section className="hero shell">
          <div className="hero-copy">
            <p className="eyebrow"><span /> Live tab preview for Chrome</p>
            <h1>Find the right tab <em>before you switch.</em></h1>
            <p className="lede">Search or point at an open tab to preview the live page. Click to switch or move away to snap back.</p>
            <div className="actions">
              <StoreButton content="home_hero" />
              <a className="text-link" href="#how-it-works">See how it works <span aria-hidden="true">↓</span></a>
            </div>
            <p className="micro-proof">No account <span>·</span> No backend <span>·</span> No host permissions</p>
          </div>
          <ProductImage src="/images/tabshow-2.1-01-live-preview.png" alt="TabShow 2.1 live preview showing the current Chrome tab in violet and a hovered preview tab in amber" priority />
        </section>

        <section className="proof-strip" aria-label="TabShow 2.1 highlights">
          <div className="shell proof-grid">
            <span><b>01</b> Live page preview</span>
            <span><b>02</b> Title, URL & domain search</span>
            <span><b>03</b> All-window scope</span>
            <span><b>04</b> Keyboard navigation</span>
          </div>
        </section>

        <section className="section shell" id="how-it-works">
          <div className="section-heading split-heading">
            <div><p className="eyebrow"><span /> One interaction</p><h2>Recognize first.<br /><em>Switch second.</em></h2></div>
            <p>Most tab tools ask you to organize more. TabShow helps at the exact moment a collapsed title or familiar favicon is no longer enough.</p>
          </div>
          <ol className="workflow">
            <li><b>Search or point</b><span>Use the side panel to narrow the list or hover any tab.</span></li>
            <li><b>Preview the live page</b><span>The real tab appears in your main browser window.</span></li>
            <li><b>Decide without penalty</b><span>Click to switch. Move away to return to the original tab.</span></li>
          </ol>
          <ProductImage src="/images/tabshow-2.1-02-search-150-tabs.png" alt="TabShow 2.1 searching 150 open Chrome tabs by title, URL, or domain" />
        </section>

        <section className="section ink-section">
          <div className="shell">
            <div className="section-heading light-heading"><p className="eyebrow"><span /> TabShow 2.1</p><h2>More context.<br /><em>Still one sharp tool.</em></h2></div>
            <div className="feature-ledger">
              <article><span>01</span><h3>Find faster</h3><p>Search open tabs by title, URL, or domain instead of scanning the tab strip.</p></article>
              <article><span>02</span><h3>See every window</h3><p>Switch scope when the page you need lives in another Chrome window.</p></article>
              <article><span>03</span><h3>Sort with intent</h3><p>Keep browser order or sort by recent use, recent addition, domain, or group.</p></article>
              <article><span>04</span><h3>Stay on the keys</h3><p>Arrow keys select, Enter opens, and Escape returns to your original tab. Hover when you want a live preview.</p></article>
            </div>
          </div>
        </section>

        <section className="section shell visual-pair">
          <div>
            <p className="eyebrow"><span /> Honest positioning</p>
            <h2>A recognition tool.<br /><em>Not another workspace.</em></h2>
            <p className="section-copy">TabShow keeps live tabs live. It does not close them into a list, save cloud sessions, or ask you to rebuild browsing around projects. If you need workspace sync or aggressive memory cleanup, another tool may fit better. If you need to identify the right live page quickly, that is TabShow’s job.</p>
            <a className="text-link" href="/chrome-tab-preview-extension">Explore live tab preview <span aria-hidden="true">→</span></a>
          </div>
          <ProductImage src="/images/tabshow-2.1-04-all-windows.png" alt="TabShow 2.1 All windows view listing tabs across four Chrome windows" />
        </section>

        <section className="section privacy-section">
          <div className="shell privacy-grid">
            <div><p className="eyebrow"><span /> Privacy by design</p><h2>Your tabs stay<br /><em>in your browser.</em></h2></div>
            <div className="privacy-copy">
              <p>TabShow has no account, backend, ads, or tracking. It does not request host permissions, so it cannot access the contents of the websites you visit.</p>
              <ul className="check-list"><li>Tab metadata powers listing, search, sorting, and switching.</li><li>Chrome’s side-panel and tab-group APIs provide the interface.</li><li>Your color, delay, and window-scope settings stay local.</li></ul>
              <a className="text-link" href="/privacy">Read every permission in plain language <span aria-hidden="true">→</span></a>
            </div>
          </div>
        </section>

        <Community />
        <Faq items={faq} title="Questions before you install" />
        <FinalCta content="home_final" />
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd).replace(/</g, "\\u003c") }} />
    </>
  );
}
