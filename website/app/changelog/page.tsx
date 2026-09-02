/* eslint-disable react/no-unescaped-entities */
import { FEEDBACK_URL, PlainPage, pageMetadata } from "../site";

export const metadata = pageMetadata(
  "TabShow Changelog | Version 2.1",
  "TabShow 2.1 adds a local Chaos Score, dark and light appearance controls, panel sharing actions, stable tab totals during search, and a clearer compact interface.",
  "/changelog",
);

const previousReleases = [
  {
    version: "1.0.0",
    date: "December 29, 2025",
    changes: [
      "Added an adjustable hover delay so brushing past the panel does not trigger an unwanted preview.",
      "Added visible loading feedback while a previewed tab becomes ready.",
      "Made settings easier to discover and replaced the share action with a direct, voluntary Store review link.",
    ],
  },
  {
    version: "0.9.2",
    date: "November 3, 2025",
    changes: [
      "Standardized the product name as TabShow across the extension, onboarding, and Store metadata.",
      "Rewrote the package title and description around vertical tabs and full-page preview behavior.",
    ],
  },
  {
    version: "0.9.1",
    date: "October 16, 2025",
    changes: [
      "Updated the extension icon for stronger visibility and clarity in Chrome.",
      "Refreshed the Chrome Web Store listing and product presentation.",
    ],
  },
  {
    version: "0.9.0",
    date: "October 9, 2025",
    changes: [
      "Introduced the settings panel and selectable color themes.",
      "Made Charcoal Violet and Amber the default visual system.",
      "Improved live updates so changed page titles and favicons remain accurate in the tab list.",
    ],
  },
  {
    version: "0.8.2",
    date: "October 3, 2025",
    changes: [
      "Added a quick Store-sharing action.",
      "Fixed stale favicons and page titles after navigating inside an open tab.",
    ],
  },
  {
    version: "0.8.1",
    date: "October 1, 2025",
    changes: [
      "Renamed the extension to Tab.Show after securing the tab.show domain; the spelling was later standardized as TabShow.",
      "Added the public Featurebase feedback board so people could suggest and upvote improvements.",
      "Added full website-address tooltips to help distinguish similar tabs.",
    ],
  },
  {
    version: "0.8.0",
    date: "September 26, 2025",
    changes: [
      "Redesigned tab groups with browser-like nesting, colors, and expand or collapse behavior.",
      "Clarified which tab rows are interactive and improved rapid-hover reliability.",
    ],
  },
  {
    version: "0.7.1",
    date: "September 25, 2025",
    changes: [
      "Renamed the early Narsheek build to TabGlance.",
      "Virtualized the tab list to keep large tab collections responsive.",
    ],
  },
  {
    version: "0.7.0",
    date: "September 5, 2025",
    changes: [
      "Separated temporary hover previews from deliberate manual tab switches, making snap-back behavior more reliable.",
      "Improved tab loading and list-rendering performance.",
      "Added first-use Welcome and What's New pages.",
    ],
  },
  {
    version: "0.6.0",
    date: "August 29, 2025",
    changes: [
      "Added direct tab closing from the side panel.",
      "Added the default Command or Ctrl + Shift + X shortcut.",
      "Added visual representation of existing Chrome tab groups and fixed tab-management edge cases.",
    ],
  },
  {
    version: "0.5.0",
    date: "August 22, 2025",
    changes: [
      "Launched the original side-panel tab list and core hover-to-preview interaction.",
    ],
  },
];

export default function ChangelogPage() {
  return (
    <PlainPage
      eyebrow="Changelog"
      title="TabShow 2.1"
      accent="makes tab load visible."
      lead="A focused update with a local Chaos Score, appearance controls, faster feedback, and clearer totals that stay truthful while you search."
      nav={[
        { href: "#version-2-1", label: "Version 2.1" },
        { href: "#version-2", label: "Version 2.0" },
        { href: "#history", label: "Previous releases" },
        { href: "#privacy", label: "Privacy and permissions" },
        { href: "#next", label: "What comes next" },
      ]}
    >
      <section id="version-2-1">
        <p className="eyebrow"><span /> September 2026</p>
        <h2>Version 2.1</h2>
        <h3>Local Tab Chaos Score</h3>
        <p>A compact, color-coded score summarizes open tabs, windows, duplicates, tab age, domains, and Chrome groups. Open it for local statistics, quick wins, and trend history that remains in the browser.</p>
        <h3>Dark, light, and system appearance</h3>
        <p>Choose an explicit appearance or follow the operating system. Active and preview colors adapt so user-selected palettes remain readable in dark mode.</p>
        <h3>Feedback and sharing in the panel</h3>
        <p>Suggest a feature without opening Settings, or copy a paste-ready Chrome Web Store recommendation from Tell a friend.</p>
        <h3>Stable and distinct totals</h3>
        <p>Search filters the visible list without changing the real open-tab or window totals. The Chaos Score and OPEN TABS count now use separate labels and visual treatments.</p>
        <h3>Compact interface refinements</h3>
        <p>Scope, search, Settings, and Chaos controls share a consistent layout. The unnecessary current-window banner is gone, while other-window switching remains explicit.</p>
        <h3>No new permissions</h3>
        <p>Version 2.1 adds no Chrome permissions. Chaos statistics and history are calculated and stored locally.</p>
      </section>

      <section id="version-2">
        <p className="eyebrow"><span /> July 2026</p>
        <h2>Version 2.0</h2>
        <h3>Search open tabs</h3>
        <p>Find tabs by page title, URL, or domain from the side panel. Search works in the current window or across every Chrome window.</p>
        <h3>Keyboard selection and switching</h3>
        <p>Arrow keys select results, Enter opens the selected tab, and Escape returns to the original tab. Live preview remains a hover interaction.</p>
        <h3>All-window awareness</h3>
        <p>Choose an explicit All windows scope with matching tab and window counts. Tabs from another window switch only on click, preventing hover from stealing focus.</p>
        <h3>Flexible sorting</h3>
        <p>Keep Chrome's current order or sort by recently used, recently added (approximate), domain, or tab group.</p>
        <h3>Richer tab context</h3>
        <p>See groups, pinned tabs, audio and muted status, sleeping tabs, duplicate markers, domains, and another-window indicators without opening a separate dashboard.</p>
        <h3>Clearer loading and empty states</h3>
        <p>The panel now explains when tabs are loading, no result matches a search, or the selected scope is empty.</p>
      </section>

      <section id="history">
        <p className="eyebrow"><span /> August–December 2025</p>
        <h2>Previous releases</h2>
        <p>The useful product history belongs here, not buried inside the Chrome Web Store description. These entries preserve the user-facing changes while removing obsolete launch copy.</p>
        <div className="release-timeline">
          {previousReleases.map((release) => (
            <article key={release.version}>
              <header>
                <h3>Version {release.version}</h3>
                <time>{release.date}</time>
              </header>
              <ul>
                {release.changes.map((change) => <li key={change}>{change}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section id="privacy">
        <h2>Privacy and permissions</h2>
        <p>TabShow 2.1 still has no account, backend, advertising, host permissions, or access to webpage contents. Version 2.1 adds no permissions, and the unused <code>activeTab</code> permission remains removed.</p>
        <p>See the full <a className="text-link" href="/privacy">plain-language privacy page →</a></p>
      </section>

      <section id="next">
        <h2>What comes next is public</h2>
        <p>TabShow should grow from real tab pain, not a generic feature checklist. Suggest an idea, report a problem, or upvote an existing request on Featurebase. Shipped requests will be reflected here.</p>
        <p><a className="button button-primary" href={FEEDBACK_URL} target="_blank" rel="noreferrer">Open the feedback board <span aria-hidden="true">↗</span></a></p>
      </section>
    </PlainPage>
  );
}
