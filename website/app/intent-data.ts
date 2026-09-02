import type { IntentPageData } from "./site";

export const previewPage: IntentPageData = {
  eyebrow: "Chrome tab preview extension",
  title: "Preview live Chrome tabs",
  accent: "without switching away.",
  lead: "TabShow puts searchable tabs in Chrome's side panel. Point at one to see the real page, then switch only when you know it is right.",
  image: "/images/store-01-preview.png",
  imageAlt: "Real TabShow side panel with a live tab preview highlighted in amber",
  intent: "A Chrome tab preview extension should help you recognize a page before committing to a context switch. That is the whole TabShow loop.",
  content: "preview_page",
  sections: [
    { title: "Why tab titles stop being enough", paragraphs: ["Chrome's tab strip works until titles collapse, favicons repeat, and several documents look almost identical. At that point, switching becomes the only way to verify what a tab contains. Every wrong guess breaks the thread of the page you were using.", "TabShow moves recognition into the side panel. The list keeps titles, domains, groups, and useful state visible. A hover activates the real tab as a temporary preview; leaving the panel restores the original tab."], bullets: ["Search titles, URLs, and domains.", "Preview the live page instead of a thumbnail.", "Click to switch or move away to snap back.", "Keep Chrome tab groups visible and collapsible."] },
    { title: "Live preview is different from a screenshot", paragraphs: ["A screenshot can be stale, too small, or unavailable on dynamic pages. TabShow previews the actual live tab in the main browser window. You see the page at its real size, with its current scroll position and state, because Chrome is showing that tab, not an imitation of it.", "That behavior is also why TabShow treats tabs in another window carefully. Cross-window results remain searchable, but they switch only when clicked. Hovering should never unexpectedly pull focus to a different window."] },
    { title: "Built for recognition, not workspace administration", paragraphs: ["TabShow does not ask you to name workspaces, save sessions, or move tabs into a separate system. It stays close to Chrome's own model: live tabs, real windows, and existing groups. The extension adds a faster way to identify the page you already have open.", "If your primary need is cloud workspace sync or aggressive memory reduction, choose a tool built for that job. TabShow is deliberately narrower and faster to understand."] },
  ],
  faq: [
    { q: "Can Chrome preview a tab without switching by itself?", a: "Chrome does not provide this exact side-panel recognition loop by default. TabShow temporarily activates the live tab while you point at it, then restores the original tab when you move away." },
    { q: "Is the preview a screenshot?", a: "No. It is the real live tab shown in the main browser window, not a thumbnail or image captured by TabShow." },
    { q: "Does hover preview work in another Chrome window?", a: "No, and that is intentional. Tabs from other windows appear in All windows scope, but clicking is required so hover cannot unexpectedly steal focus." },
  ],
};

export const lostTabPage: IntentPageData = {
  eyebrow: "Find a lost Chrome tab",
  title: "Stop guessing which tab",
  accent: "has the page you need.",
  lead: "When titles collapse and favicons repeat, search the words you remember or preview likely tabs without abandoning your current page.",
  image: "/images/store-02-search.png",
  imageAlt: "Real TabShow search filtering open tabs by title, URL, and domain",
  intent: "The fastest way to find a lost Chrome tab is to combine text search with visual recognition: narrow the candidates, preview the live page, and switch only when it matches.",
  content: "lost_tab_page",
  sections: [
    { title: "Why the tab is not really lost", paragraphs: ["The page is usually still open; its identity has collapsed. Twenty tabs can become twenty favicons, and repeated Docs, Figma, email, or dashboard tabs no longer carry enough context in the strip.", "TabShow expands that context vertically. Search checks page titles, URLs, and domains. A query such as a project name, site, or path reduces the list before visual preview confirms the exact page."], bullets: ["Start with a word from the page title.", "Try the domain or a recognizable part of the URL.", "Use All windows if the result may be elsewhere.", "Use Arrow keys to select results, or hover a current-window result to preview it."] },
    { title: "A repeatable recovery workflow", paragraphs: ["Open TabShow from the toolbar or your Chrome extension shortcut. Type the strongest clue you remember. Move through the filtered results with the Arrow keys, then press Enter to open the selected tab. Hover a current-window result when you want the live page to confirm it first.", "The important part is reversibility. A wrong hover candidate does not become another costly detour because TabShow restores the original tab."], bullets: ["Arrow Down or Arrow Up selects another result.", "Enter opens the selected tab.", "Escape returns to the original tab.", "Current window and All windows keep scope explicit."] },
    { title: "Prevent the next hunt without reorganizing everything", paragraphs: ["You do not need a perfect tab system to benefit. Existing Chrome groups remain visible, and sort modes let you use browser order, recent use, recent addition, domain, or group when one view becomes more useful than another.", "TabShow is not a promise to eliminate tab overload. It makes the overload more searchable and makes recognition less disruptive."] },
  ],
  faq: [
    { q: "How do I search all open tabs in Chrome?", a: "Open TabShow, choose All windows, and search by title, URL, or domain. The result count shows how many tabs and windows match." },
    { q: "Can I find a tab if I remember only the website?", a: "Yes. Search matches domains and URLs as well as page titles." },
    { q: "Will searching change my current tab?", a: "No. Typing and Arrow-key selection leave the current page alone. Hovering a current-window result starts a temporary preview; moving away or pressing Escape restores the original tab." },
  ],
};

export const oneTabPage: IntentPageData = {
  eyebrow: "OneTab alternative",
  title: "Keep live tabs live.",
  accent: "Recognize before you reduce.",
  lead: "OneTab and TabShow solve different moments. OneTab collapses tabs to reduce open-tab load; TabShow helps you identify the right live page without switching away.",
  image: "/images/store-03-keyboard.png",
  imageAlt: "Real TabShow keyboard search workflow selecting a matching open tab",
  intent: "Choose OneTab when the job is closing many tabs into a recoverable list. Choose TabShow when the job is finding the right tab while your live browsing state remains intact.",
  content: "onetab_page",
  comparison: { competitor: "OneTab", chooseCompetitor: "You want to collapse many open tabs into a saved list, reduce the active tab count, and restore links later. That is a memory and session-recovery job.", chooseTabShow: "You want to keep current pages live, search them, preview the real tab, and return to your original page when a candidate is wrong. That is a recognition job." },
  sections: [
    { title: "Same tab pain, different intervention", paragraphs: ["Both products begin with too many tabs, but they intervene at different points. OneTab changes the state of the session by closing tabs into a list. TabShow leaves the session structure alone and changes how you inspect it.", "That difference matters when forms, dashboards, authenticated tools, or in-progress pages should stay live. It also matters when the immediate problem is not memory, but uncertainty about which open page is the right one."] },
    { title: "What TabShow adds to the live session", paragraphs: ["TabShow lists titles, domains, groups, and state in the side panel. Search narrows the set; Arrow keys select a result and Enter opens it, while hover previews the actual page. Moving away or pressing Escape restores the original tab after a preview."], bullets: ["No account or cloud workspace.", "No closing tabs into a separate list.", "Search across current or all Chrome windows.", "Sort by browser order, recent use, domain, or group."] },
    { title: "You may reasonably use both", paragraphs: ["These tools are not mutually exclusive. A heavy-tab workflow can use TabShow during active work and a session or reduction tool when it is time to clean up. The honest choice depends on whether your next action is recognize or reduce.", "TabShow should not claim to replace OneTab's memory-reduction workflow. Its advantage is the fast live-preview loop before reduction becomes necessary."] },
  ],
  faq: [
    { q: "Does TabShow close or suspend tabs like OneTab?", a: "No. TabShow keeps tabs live and focuses on finding, previewing, switching, sorting, and closing individual tabs when you choose." },
    { q: "Is TabShow lighter to set up?", a: "There is no account, workspace model, or import step. Install it, open the side panel, and use your existing tabs and groups." },
    { q: "Can I use OneTab and TabShow together?", a: "Yes. They address different jobs: active-session recognition and intentional tab reduction." },
  ],
};

export const workonaPage: IntentPageData = {
  eyebrow: "Workona alternative",
  title: "Skip the workspace setup.",
  accent: "Preview the tab you already have.",
  lead: "Workona is designed around project workspaces and sync. TabShow stays local and narrow: searchable live tabs, instant preview, and no account.",
  image: "/images/store-04-windows.png",
  imageAlt: "Real TabShow All windows scope organizing open tabs from multiple Chrome windows",
  intent: "Choose Workona for persistent project workspaces and cross-device organization. Choose TabShow for a local, immediate recognition layer over the Chrome tabs and groups you already use.",
  content: "workona_page",
  comparison: { competitor: "Workona", chooseCompetitor: "You need named project workspaces, persistent resource organization, account-based sync, and a broader layer above the browser session.", chooseTabShow: "You want no account or workspace migration, just a faster way to search live tabs, preview the real page, and switch or snap back." },
  sections: [
    { title: "Workspace management is a larger commitment", paragraphs: ["A workspace product can be valuable when projects need durable structure across sessions or devices. It also asks you to adopt its model: projects, resources, saved state, and often an account.", "TabShow does not compete on that breadth. It preserves Chrome's windows and groups, then improves the moment-to-moment act of recognizing a live page."] },
    { title: "What no-account simplicity buys you", paragraphs: ["There is no onboarding taxonomy to maintain. The current window opens by default; All windows expands scope when needed. Search, sorting, keyboard navigation, and visual state sit directly above the browser tabs you already have."], bullets: ["No sign-in or cloud workspace.", "Existing Chrome groups remain visible.", "Cross-window results are searchable without hover focus theft.", "Settings remain in your browser."] },
    { title: "Know which kind of organization you need", paragraphs: ["If a project should reopen next week on another device with a curated set of resources, choose a workspace tool. If the page is open now and you simply cannot recognize it among dozens of tabs, TabShow is the smaller intervention.", "Smaller is not automatically better. It is better only when it matches the job."] },
  ],
  faq: [
    { q: "Does TabShow sync workspaces across devices?", a: "No. TabShow has no account or backend. It works with the tabs and groups in the current Chrome profile." },
    { q: "Can TabShow show tabs from multiple windows?", a: "Yes. All windows scope lists and searches them. Tabs in another window require a click to switch." },
    { q: "Does TabShow replace Chrome tab groups?", a: "No. It represents existing groups, including their names, colors, nesting, and collapsed state." },
  ],
};

export const tabManagerPlusPage: IntentPageData = {
  eyebrow: "Tab Manager Plus alternative",
  title: "Recognize the page.",
  accent: "Skip the management dashboard.",
  lead: "Tab Manager Plus emphasizes broad tab management. TabShow focuses on the fastest recognition loop: search, preview the live page, switch, or snap back.",
  image: "/images/store-05-context.png",
  imageAlt: "Real TabShow sort menu with current, recent, domain, and group options",
  intent: "Choose a management dashboard for bulk operations and dense control. Choose TabShow when the expensive part is identifying the right page before you switch.",
  content: "tmp_page",
  comparison: { competitor: "Tab Manager Plus", chooseCompetitor: "You want a broad overview with management-heavy controls and bulk operations across many tabs and windows.", chooseTabShow: "You want a side panel that stays beside the page, surfaces useful context, and previews a live candidate without making every search a dashboard visit." },
  sections: [
    { title: "Management and recognition are not the same job", paragraphs: ["A grid or dashboard can expose many controls at once. That is useful when the task is bulk cleanup. It can be more interface than necessary when the task is simply: which of these similar tabs contains the page I need?", "TabShow keeps the interaction adjacent to browsing. The side panel is a list, the main window is the preview, and leaving the panel reverses the tentative switch."] },
    { title: "Enough context without dashboard weight", paragraphs: ["The TabShow panel includes search, window scope, sorting, Chrome groups, pinned state, audio or muted state, sleeping tabs, duplicate markers, and a local Chaos Score. Context supports recognition rather than becoming a separate workspace."], bullets: ["Current, recent, domain, and group sorting.", "Visible groups and group colors.", "Close individual tabs from the list.", "Keyboard selection and open controls."] },
    { title: "Pick the interface cost that matches the task", paragraphs: ["If you repeatedly perform bulk selection, moving, or cleanup, a full manager may deserve the screen. If most visits end when you recognize one page, TabShow's narrow loop removes steps.", "The best alternative is not the one with the longest feature list. It is the one whose default interaction matches your next action."] },
  ],
  faq: [
    { q: "Can TabShow perform bulk tab operations?", a: "No. It supports focused actions such as previewing, switching, sorting, and closing individual tabs. It is not a bulk-management dashboard." },
    { q: "What context does TabShow show?", a: "Titles, domains, favicons, groups, pinned state, audio or muted state, sleeping state, duplicates, and whether a result belongs to another window." },
    { q: "Can I change the sort order?", a: "Yes. Use current browser order, recently used, recently added (approximate), domain, or tab group." },
  ],
};
