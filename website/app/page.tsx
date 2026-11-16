import type { Metadata } from "next";
import { StudioBanner } from "./studio-banner";
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
  { q: "Can I search tabs across every Chrome window?", a: "Yes. Choose All windows to search tabs across windows in the same Chrome profile. Windows in other profiles, such as separate Work and Personal profiles, stay separate. For safety, open a tab in another window with a click or Enter; hovering does not move focus across windows." },
  { q: "What happens when I move away from a preview?", a: "TabShow returns you to the original tab. If the preview was the right page, click it to make the switch permanent." },
  { q: "Can I use TabShow with the keyboard?", a: "Yes. With keyboard focus in the panel, Arrow keys select search results, Enter opens the selected tab, and Escape returns to the original tab. After a hover preview, move away to return and click Search to resume keyboard commands. The side panel shortcut can be customized in Chrome's extension shortcut settings." },
  { q: "Can I keep the panel open after choosing a tab?", a: "TabShow 2.4 adds Settings → Keep panel open after choosing a tab. It is off by default, so selecting a tab still closes the panel unless you enable it. Chrome's pin control only keeps the toolbar button accessible. See the changelog for release notes." },
  { q: "Can I turn hover previews off?", a: "TabShow 2.4 adds Settings → Preview tabs on hover. Turn it off to browse and search the list without changing pages. Click or press Enter to switch. Hover preview remains on by default." },
  { q: "Does TabShow follow my Chrome theme?", a: "TabShow offers System, Light, and Dark appearance plus its own color pairings. System follows your operating system's light or dark setting. It does not import colors from custom Chrome themes." },
  { q: "Which languages does TabShow support?", a: "TabShow 2.4 supports English, German, Simplified Chinese, and Traditional Chinese. The interface follows Chrome's display language, with English as the fallback. The panel, Settings, welcome page, and in-extension release notes are translated. This website and linked external help pages remain in English. See the changelog for release notes." },
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
          <ProductImage src="/images/tabshow-2.4-01-live-preview.png" alt="TabShow side panel showing the original tab and a live preview of another tab" priority />
        </section>

        <section className="proof-strip" aria-label="TabShow highlights">
          <div className="shell proof-grid">
            <span><b>01</b> Live page preview</span>
            <span><b>02</b> Title, URL & domain search</span>
            <span><b>03</b> All-window scope</span>
            <span><b>04</b> Keyboard navigation</span>
          </div>
        </section>

        <section className="section shell" id="how-it-works">
          <div className="section-heading split-heading">
            <div><p className="eyebrow"><span /> Live preview</p><h2>See the page.<br /><em>Choose the tab.</em></h2></div>
            <p>When several tabs have similar titles or icons, hover a result to see the page in your current window.</p>
          </div>
          <ol className="workflow">
            <li><b>Search or point</b><span>Search the list or hover a tab from the current window.</span></li>
            <li><b>Preview the live page</b><span>The real tab appears in your main browser window.</span></li>
            <li><b>Choose the right page</b><span>Click to switch. Move away to return to the original tab.</span></li>
          </ol>
          <figure className="product-demo" id="demo">
            <video controls playsInline preload="none" poster="/video/tabshow-focus-poster.jpg" width="1920" height="1080" aria-label="TabShow: full-page preview in 30 seconds">
              <source src="/video/tabshow-focus-30s.mp4" type="video/mp4" />
              <track kind="captions" src="/video/tabshow-focus-en.vtt" srcLang="en" label="English" />
              Your browser does not support video playback. <a href="/video/tabshow-focus-30s.mp4">Download the TabShow demo</a>.
            </video>
            <figcaption>A 30-second demo of live preview, search, and tab switching.</figcaption>
            <details><summary>Read the transcript</summary><p>Preview the full page without losing your focus. With TabShow, hover a tab to see it live. Move away. Your original page comes back. Found the right page? Click to stay. Search by title or website. Use the arrow keys. Find tabs across windows in the same Chrome profile. It’s free. No account. No tracking. Find the right tab. Keep your flow.</p></details>
          </figure>
        </section>

        <StudioBanner />

        <section className="section ink-section">
          <div className="shell">
            <div className="section-heading light-heading"><p className="eyebrow"><span /> In the side panel</p><h2>Search, sort,<br /><em>and switch tabs.</em></h2></div>
            <div className="feature-ledger">
              <article><span>01</span><h3>Search by title or site</h3><p>Type a page title, URL, or domain to narrow the list of open tabs.</p></article>
              <article><span>02</span><h3>Find tabs across windows</h3><p>Search across windows in the same Chrome profile. Other profiles stay separate.</p></article>
              <article><span>03</span><h3>Choose a sort order</h3><p>Keep browser order or sort by recent use, recent addition, domain, or group.</p></article>
              <article><span>04</span><h3>Use the keyboard</h3><p>With the panel focused, Arrow keys select, Enter opens, and Escape returns to your original tab. Hover when you want a live preview.</p></article>
            </div>
          </div>
        </section>

        <section className="section shell visual-pair">
          <div>
            <p className="eyebrow"><span /> All windows</p>
            <h2>One list.<br /><em>For this Chrome profile.</em></h2>
            <p className="section-copy">Choose All windows to search tabs in every open window of your current Chrome profile. Each window has its own section. Click a tab or press Enter to bring that window forward.</p>
            <a className="text-link" href="/chrome-tab-preview-extension">How live preview works <span aria-hidden="true">→</span></a>
          </div>
          <ProductImage src="/images/tabshow-2.4-04-all-windows.png" alt="TabShow All windows view with separate sections for Chrome windows in the same profile" />
        </section>

        <section className="section shell visual-pair" id="panel-settings">
          <div>
            <p className="eyebrow"><span /> New in 2.4</p>
            <h2>Choose how<br /><em>the panel behaves.</em></h2>
            <p className="section-copy">Keep the panel open after choosing a tab, or turn hover previews off and switch only with a click or Enter. Your sort order stays saved, and opening the panel brings your current tab into view.</p>
            <p className="section-copy">The defaults stay the same: hover to preview, click to switch and close. The new settings are optional.</p>
            <p className="section-copy">TabShow 2.4 adds German, Simplified Chinese, and Traditional Chinese alongside English. The interface follows Chrome&apos;s display language.</p>
            <a className="text-link" href="/changelog#version-2-4">Read 2.4 release notes <span aria-hidden="true">→</span></a>
          </div>
          <ProductImage src="/images/tabshow-2.4-05-panel-settings.png" alt="TabShow Settings with controls to keep the panel open and turn hover previews on or off" />
        </section>

        <section className="section privacy-section">
          <div className="shell privacy-grid">
            <div><p className="eyebrow"><span /> Privacy by design</p><h2>Your tabs stay<br /><em>in your browser.</em></h2></div>
            <div className="privacy-copy">
              <p>TabShow has no account, backend, ads, or tracking. It does not request host permissions, so it cannot access the contents of the websites you visit.</p>
              <ul className="check-list"><li>Tab metadata powers listing, search, sorting, and switching.</li><li>Chrome’s side-panel and tab-group APIs provide the interface.</li><li>Your preferences stay in your browser.</li></ul>
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
