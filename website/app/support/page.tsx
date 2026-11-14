/* eslint-disable react/no-unescaped-entities */
import { CoffeeButton, FEEDBACK_URL, REVIEW_URL, PlainPage, pageMetadata } from "../site";

export const metadata = pageMetadata("TabShow Support | Setup, Shortcuts, Preview and Feedback", "Find TabShow help for search, preview settings, keeping the side panel open, appearance, versions, shortcuts, and multiple windows.", "/support");

export default function SupportPage() {
  return <PlainPage eyebrow="Support" title="Get back to the tab" accent="you were looking for." lead="Start with the checks below. If a problem remains, share the steps and your installed version on the feedback board." nav={[{href:"#start",label:"Getting started"},{href:"#shortcuts",label:"Keyboard"},{href:"#preview",label:"Preview behavior"},{href:"#panel-settings",label:"Panel settings"},{href:"#version",label:"Version and updates"},{href:"#troubleshooting",label:"Troubleshooting"},{href:"#contact",label:"Feedback"},{href:"#support-development",label:"Support development"}]}>
    <section id="start">
      <h2>Getting started</h2>
      <ol><li>Install TabShow from the Chrome Web Store.</li><li>Pin the TabShow toolbar icon if you want one-click access.</li><li>Click the icon or use the extension shortcut to open the side panel.</li><li>Use the search field at the top to find a title, URL, or domain, or point at a tab to preview it.</li><li>Click the right tab to switch, or move away to return.</li></ol>
      <p>New installations start in Current window scope. Choose All windows when the page may be open in another window of the same Chrome profile. TabShow remembers your scope choice.</p>
      <p>Search has been included since version 2.0. It searches open-tab titles and addresses, including tabs inside collapsed Chrome groups.</p>
    </section>
    <section id="shortcuts">
      <h2>Keyboard navigation</h2>
      <p>The suggested side-panel shortcut is <strong>Shift + Ctrl + X</strong> on Windows or Linux and <strong>Shift + Command + X</strong> on macOS. Chrome can override or clear extension shortcuts, so verify yours at <code>chrome://extensions/shortcuts</code>.</p>
      <ul><li><strong>Arrow Down / Arrow Up:</strong> select matching tabs.</li><li><strong>Enter:</strong> open the selected tab.</li><li><strong>Escape:</strong> return to the original tab and close the panel.</li><li><strong>Hover:</strong> preview a current-window tab when hover previews are enabled.</li></ul>
    </section>
    <section id="preview">
      <h2>How preview works</h2>
      <p>In the current Chrome window, pointing at a tab temporarily activates its live page. The original tab remains marked. Move your pointer out of the side panel to return, or press Escape to return and close the panel. Click a result to make it your selected tab.</p>
      <p>In All windows scope, tabs belonging to another window show a switch indicator. They do not hover-preview. Click one or select it with the keyboard and press Enter to focus that window and tab.</p>
    </section>
    <section id="panel-settings">
      <h2>Panel settings in 2.4</h2>
      <p>These controls are part of the <strong>2.4 release candidate</strong>. The Chrome Web Store currently offers 2.3. See the <a href="/changelog#version-2-4">release status</a> before checking for new settings.</p>
      <h3>Keep the panel open after choosing a tab</h3>
      <p>Open Settings and turn on <strong>Keep panel open after choosing a tab</strong>. Clicking a result or pressing Enter keeps the panel open. When you select a tab in the current window, it becomes the tab your next preview returns to. The setting is off by default.</p>
      <p>Chrome's pin control keeps the TabShow toolbar button accessible. It does not control whether TabShow closes after you choose a tab. Escape still returns to the selected tab and closes the panel.</p>
      <h3>Turn hover previews off</h3>
      <p>Turn off <strong>Preview tabs on hover</strong> in Settings. Search and keyboard selection leave the page alone; click or press Enter when you want to switch. Hover preview is on by default, and you can adjust its delay while it is enabled.</p>
      <h3>Keep your sort order and position</h3>
      <p>Version 2.4 saves your chosen sort order. Opening the panel brings your current tab into view. When you keep the panel open, selecting a tab does not send the list back to the top.</p>
      <h3>Appearance and Chrome themes</h3>
      <p>System, Light, and Dark appearance are already available in Settings. System follows your operating system's light or dark preference. TabShow also has its own color pairings; it does not import colors from custom Chrome themes.</p>
    </section>
    <section id="version">
      <h2>Check your version</h2>
      <p>Open <code>chrome://extensions</code>, find TabShow, and select <strong>Details</strong> to see the installed version. In 2.4, Settings also shows the version and links to help and release notes.</p>
      <p>Chrome normally updates extensions automatically. If the store lists a newer version than the one installed, restart Chrome and check again. A release candidate or a version awaiting review is not yet available through the store. You do not need to uninstall TabShow to receive an update.</p>
    </section>
    <section id="troubleshooting">
      <h2>Quick troubleshooting</h2>
      <h3>The side panel does not open</h3><p>Confirm TabShow is enabled at <code>chrome://extensions</code>, then try the toolbar icon. If a shortcut conflicts with another extension, assign a different one in Chrome's shortcut settings.</p>
      <h3>A preview starts too easily</h3><p>Open Settings and increase the hover preview delay. In 2.4, you can also turn hover previews off.</p>
      <h3>A tab or favicon looks stale</h3><p>Navigate or activate the tab once, then reopen TabShow. If the issue repeats, include the page type, Chrome version, TabShow version, and exact steps in a Featurebase report. Do not post sensitive URLs publicly.</p>
      <h3>A window is missing</h3><p>All windows means all windows in the Chrome profile you are using. Windows opened under another profile, such as Work or Personal, stay separate. Open TabShow in that profile to see its tabs. Signing into the same website in two profiles does not combine them.</p>
      <h3>Search does not find a page</h3><p>Try a domain or URL fragment, and switch to All windows. Search checks the metadata Chrome exposes; it does not search text inside webpages.</p>
    </section>
    <section id="contact">
      <h2>Feedback and reviews</h2>
      <div className="support-cards"><a href={FEEDBACK_URL} target="_blank" rel="noreferrer"><b>Share feedback ↗</b><span>Describe a problem, suggest an improvement, or upvote an existing idea.</span></a><a href={REVIEW_URL} target="_blank" rel="noreferrer"><b>Rate TabShow ↗</b><span>Share your experience to help others decide whether TabShow fits.</span></a></div>
      <p>Both are voluntary. A review never unlocks functionality.</p>
    </section>
    <section id="support-development"><h2>A coffee for the maker</h2><p>TabShow is a free project I build and maintain. If it makes your day a little easier, you can buy me a coffee to support my work.</p><p>Every feature is free. Leaving a tip is entirely optional.</p><CoffeeButton /><p>Thanks for using TabShow.<br />Saulius</p></section>
  </PlainPage>;
}
