/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";

export const STORE_BASE = "https://chromewebstore.google.com/detail/tabshow-hover-preview-foc/njdjagodlomkhingeecipnlnnhnipkho";
export const REVIEW_URL = `${STORE_BASE}/reviews`;
export const FEEDBACK_URL = "https://narsheek.featurebase.app/";

export function storeUrl(content: string) {
  return `${STORE_BASE}?utm_source=tab.show&utm_medium=website&utm_campaign=tabshow_2_launch&utm_content=${encodeURIComponent(content)}`;
}

export function pageMetadata(title: string, description: string, canonical: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical, images: [{ url: "/images/tabshow-social-card.png", width: 1200, height: 630, alt: "TabShow live tab preview for Chrome" }] },
    twitter: { card: "summary_large_image", title, description, images: ["/images/tabshow-social-card.png"] },
  };
}

export function Header() {
  return (
    <header className="site-header">
      <div className="shell nav-row">
        <Link className="brand" href="/" aria-label="TabShow home"><img src="/icon.png" alt="" width="34" height="34" /><span>TabShow<small>Live tab preview</small></span></Link>
        <nav aria-label="Primary navigation"><a href="/chrome-tab-preview-extension">How it works</a><a href="/privacy">Privacy</a><a href="/changelog">Changelog</a><a href="/support">Support</a></nav>
        <a className="nav-cta" href={storeUrl("header")} target="_blank" rel="noreferrer">Add to Chrome <span aria-hidden="true">↗</span></a>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div><Link className="brand footer-brand" href="/"><img src="/icon.png" alt="" width="38" height="38" /><span>TabShow<small>Find the tab. Keep your place.</small></span></Link><p>One sharp Chrome tool for recognizing the right live page.</p></div>
        <div><h2>Product</h2><a href="/chrome-tab-preview-extension">Live tab preview</a><a href="/changelog">Changelog</a><a href="/privacy">Privacy</a><a href="/support">Support</a></div>
        <div><h2>Compare</h2><a href="/onetab-alternative">OneTab alternative</a><a href="/workona-alternative">Workona alternative</a><a href="/tab-manager-plus-alternative">Tab Manager Plus alternative</a><a href="/find-lost-chrome-tab">Find a lost tab</a></div>
        <div><h2>Community</h2><a href={FEEDBACK_URL} target="_blank" rel="noreferrer">Share feedback ↗</a><a href={REVIEW_URL} target="_blank" rel="noreferrer">Rate TabShow ↗</a><a href={storeUrl("footer")} target="_blank" rel="noreferrer">Chrome Web Store ↗</a></div>
      </div>
      <div className="shell legal-row"><span>© {new Date().getFullYear()} TabShow</span><span>No account. No backend. No host permissions.</span></div>
    </footer>
  );
}

export function StoreButton({ content, label = "Add to Chrome" }: { content: string; label?: string }) {
  return <a className="button button-primary" href={storeUrl(content)} target="_blank" rel="noreferrer">{label}<span aria-hidden="true">↗</span></a>;
}

export function ProductImage({ src, alt, priority = false }: { src: string; alt: string; priority?: boolean }) {
  return <figure className="product-visual"><img src={src} alt={alt} width="1584" height="990" loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} /></figure>;
}

export function Community() {
  return (
    <section className="section community-section">
      <div className="shell community-grid">
        <div><p className="eyebrow"><span /> Built in public</p><h2>Help shape<br /><em>what comes next.</em></h2><p>Suggest a feature, report a problem, comment, or upvote the ideas that would improve your tab workflow.</p></div>
        <div className="community-actions">
          <a href={FEEDBACK_URL} target="_blank" rel="noreferrer"><span>01</span><div><b>Share feedback</b><small>Open the public Featurebase board</small></div><i aria-hidden="true">↗</i></a>
          <a href={REVIEW_URL} target="_blank" rel="noreferrer"><span>02</span><div><b>Rate TabShow</b><small>If TabShow has earned five stars, a quick review helps others find it.</small></div><i aria-hidden="true">↗</i></a>
        </div>
      </div>
    </section>
  );
}

export function Faq({ items, title }: { items: { q: string; a: string }[]; title: string }) {
  const jsonLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: items.map(item => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })) };
  return (
    <section className="section shell faq-section">
      <div className="section-heading"><p className="eyebrow"><span /> Clear answers</p><h2>{title}</h2></div>
      <div className="faq-list">{items.map((item, index) => <details key={item.q} open={index === 0}><summary>{item.q}<span aria-hidden="true">+</span></summary><p>{item.a}</p></details>)}</div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </section>
  );
}

export function FinalCta({ content }: { content: string }) {
  return <section className="final-cta"><div className="shell"><p className="eyebrow"><span /> Ready when you are</p><h2>Find the tab.<br /><em>Keep your place.</em></h2><p>Preview live Chrome tabs from the side panel, then switch only when you are sure.</p><StoreButton content={content} /></div></section>;
}

export function PlainPage({ eyebrow, title, accent, lead, nav, children }: { eyebrow: string; title: string; accent: string; lead: string; nav: { href: string; label: string }[]; children: React.ReactNode }) {
  return <><Header /><main className="plain-page shell"><header><p className="eyebrow"><span /> {eyebrow}</p><h1>{title}<br /><em>{accent}</em></h1><p className="lede">{lead}</p></header><div className="content-grid"><nav aria-label="On this page">{nav.map(item => <a key={item.href} href={item.href}>{item.label}</a>)}</nav><div className="prose">{children}</div></div></main><Footer /></>;
}

export type IntentPageData = {
  eyebrow: string;
  title: string;
  accent: string;
  lead: string;
  image: string;
  imageAlt: string;
  intent: string;
  sections: { title: string; paragraphs: string[]; bullets?: string[] }[];
  comparison?: { competitor: string; chooseCompetitor: string; chooseTabShow: string };
  faq: { q: string; a: string }[];
  content: string;
};

export function IntentPage({ data }: { data: IntentPageData }) {
  return (
    <><Header /><main>
      <section className="intent-hero shell"><div><p className="eyebrow"><span /> {data.eyebrow}</p><h1>{data.title}<br /><em>{data.accent}</em></h1><p className="lede">{data.lead}</p><div className="actions"><StoreButton content={`${data.content}_hero`} /><a className="text-link" href="#answer">Read the honest answer <span aria-hidden="true">↓</span></a></div></div><ProductImage src={data.image} alt={data.imageAlt} priority /></section>
      <section className="intent-answer" id="answer"><div className="shell answer-grid"><p className="eyebrow"><span /> The short answer</p><h2>{data.intent}</h2></div></section>
      <div className="shell article-layout"><article className="article-body">
        {data.sections.map(section => <section key={section.title}><h2>{section.title}</h2>{section.paragraphs.map(p => <p key={p}>{p}</p>)}{section.bullets && <ul className="check-list">{section.bullets.map(item => <li key={item}>{item}</li>)}</ul>}</section>)}
        {data.comparison && <section className="comparison"><h2>Which job are you hiring the tool for?</h2><div><article><span>Choose {data.comparison.competitor}</span><p>{data.comparison.chooseCompetitor}</p></article><article className="tabshow-choice"><span>Choose TabShow</span><p>{data.comparison.chooseTabShow}</p></article></div></section>}
      </article><aside><p>TabShow is for the live browsing moment:</p><ol><li>Search or point.</li><li>Preview the real page.</li><li>Switch or snap back.</li></ol><StoreButton content={`${data.content}_aside`} label="Try TabShow" /><small>No account. No backend.<br />No host permissions.</small></aside></div>
      <Faq items={data.faq} title="Questions this page should answer" /><Community /><FinalCta content={`${data.content}_final`} />
    </main><Footer /></>
  );
}
