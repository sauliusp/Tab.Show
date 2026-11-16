# Localization and market priorities for 2.4

Status as of 16 November 2026: the four-language 2.4.0 package is publicly available. Implementation and verification are complete within the recorded [native QA scope](NATIVE-QA.md). German and both Chinese public galleries each load five localized screenshots. A separate English gallery correction is Pending review; see the [gallery audit](store-gallery-audit.md) and canonical [release record](README.md#publication-record).

## Decision and evidence

Keep English as the default and add Simplified Chinese (`zh_CN`), Traditional Chinese (`zh_TW`), and German (`de`) as the first localized experiences. China is part of the overall market evaluation, not a separate product mission.

The private Chrome Web Store exports reviewed for this release show a predominantly English installed base, with Chinese-language and German users forming meaningful existing non-English groups. These observations support improving a product people already use before adding a large number of speculative translations. The latest installed-base snapshot reviewed is dated 13 November 2026. Exact private counts and raw exports are kept outside the public repository.

Country and language exports describe different populations and have different totals. They must not be combined into a single conversion or retention calculation. Browser language does not establish a person's country. A concentration of repeated daily install values without corresponding installed-base growth is insufficient evidence for prioritizing a market; it is not evidence of fraud either.

## Scope for this release

1. Extract user-facing strings into local message catalogs with English fallback. Include accessibility labels, status messages, counts, clipboard/share text, score explanations, Settings, and errors that users actually see. Keep diagnostic console logs separate from product copy.
2. Translate the full first-use workflow: store listing, panel, Settings, installation page, current release notes, and the essential help instructions. Historical release notes can remain in English if clearly labeled.
3. Keep TabShow's behavior and permissions unchanged. Localization must not introduce telemetry, a translation service, an account requirement, or external assets needed to operate the panel.
4. Capture the real localized interface for store screenshots. Localized descriptions must describe the same capabilities as English. Do not claim full Chinese support while leaving the working interface in English.
5. Verify all four locales, including English fallback, missing-message behavior, placeholder order, plural forms, number formatting, small panel widths, zoom, long German labels, Chinese title search, and Chinese input-method composition. Enter during text composition must not choose a tab.

Use concrete product language: search open tabs, preview the actual page, select a tab, keep the panel open, and return with Escape while the panel has keyboard focus. Explain that hover preview temporarily activates a tab. Do not advertise pinyin search or automatic translation, which are not part of this release.

Chrome supports these locale codes and requires `default_locale` when a package contains `_locales`. Its store can use localized descriptions, screenshots, and promotional videos; the small tile and marquee image remain shared. [Chrome internationalization](https://developer.chrome.com/docs/extensions/reference/api/i18n), [store listing localization](https://developer.chrome.com/docs/webstore/cws-dashboard-listing).

## Distribution limits and later options

Simplified Chinese support benefits Chinese readers wherever they are. It does not solve mainland-China access to the Chrome Web Store. GreatFire's host-level measurements reviewed on 15 November 2026 reported interference in all four recent conclusive Chrome Web Store tests, with the latest dated 2 November. This is a small sample and does not describe every network or the entire install/update flow. [Primary measurements](https://en.greatfire.org/https/chromewebstore.google.com).

Microsoft Edge Add-ons is a candidate for a later, separately tested release. Microsoft supports desktop MV3 sidebar extensions, but documents a sidebar reopening issue and requires browser-specific review when porting. Change browser-specific copy and store links, then verify preview, Escape, keep-open, window switching, installation, and updating in native Edge before advertising compatibility. Do not expand this Chrome release into an untested Edge launch. [Supported APIs](https://learn.microsoft.com/en-us/microsoft-edge/extensions/developer-guide/api-support), [porting requirements](https://learn.microsoft.com/en-us/microsoft-edge/extensions/developer-guide/port-chrome-extension), [sidebar behavior](https://learn.microsoft.com/en-us/microsoft-edge/extensions/developer-guide/sidebar).

After a working localized install path exists, a developer-authored demonstration on SSPAI is a possible small acquisition experiment. Disclose authorship and demonstrate a real task. SSPAI's own guidance welcomes developer introductions and rejects disguised independent reviews and generic press releases. Editorial coverage is not guaranteed. [SSPAI guidance](https://sspai.com/post/40262).

## Follow-up evaluation

Compare like-for-like store metrics over equivalent periods after publication: installed-base and active-user trends by language where available, installs and uninstalls, support issues, and store-page engagement. Keep country, language, and channel denominators separate. Check that existing English users are not encountering regressions, and look for repeated confusion in each new language before adding another locale. These changes remove language barriers; they do not guarantee installation growth.
