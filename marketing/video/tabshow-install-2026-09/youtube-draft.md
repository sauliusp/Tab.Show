# TabShow YouTube publishing package

Published 2026-09-05 on Saulius Petreikis: https://www.youtube.com/watch?v=gfOky71v2wI

Verified public playback at 1920×1080, the 1080p60 quality option, English captions and searchable transcript, all three live chapters, matching thumbnail, and enabled embedding. YouTube copyright and Community Guidelines checks found no issues. Added to the existing Apps playlist. AI-use disclosure is enabled for the AI-assisted production and original synthesized music. The final source master is exactly 48.000 seconds.

## Title

```text
TabShow: Preview Chrome Tabs Before You Switch
```

The brand and specific product behavior come first. This title fits YouTube's 100-character title limit. Avoid a version number so the video can remain useful while its demonstrated behavior stays current. [YouTube video settings](https://support.google.com/youtube/answer/57404?hl=en)

## Description — paste this block

```text
Find the right Chrome tab without losing your place. TabShow adds live tab previews and search to Chrome's side panel.

Add TabShow to Chrome — free:
https://chromewebstore.google.com/detail/tabshow-live-tab-preview/njdjagodlomkhingeecipnlnnhnipkho

Hover a tab in your current window to preview the real page. Move your pointer out of the side panel to return to your original tab, or click the result to switch.

Search open tabs by title, URL, or domain. Choose All windows to find a tab in another Chrome window, then click to open it. Arrow keys select results; Enter opens the selected tab.

No account. No TabShow backend. Your tab information stays in your browser.

00:00 Preview Chrome tabs before you switch
00:20 Search tabs across Chrome windows
00:34 Free and private tab preview

Learn more: https://tab.show/
Privacy and permissions: https://tab.show/privacy
Help and feedback: https://tab.show/support

TabShow is a free Chrome extension for recognizing and finding open tabs. Hover previews work within the current window; tabs in other windows switch when clicked.
```

The installation URL uses the verified current `tabshow-live-tab-preview` slug and the same stable item ID as `EXTENSION_URLS.CHROME_WEB_STORE` in `src/parameters.ts`. A public lookup on 2026-09-05 resolved the repository's older descriptive slug to this canonical `TabShow: Live Tab Preview` listing. The description focuses on the demonstrated behavior, gives the installation link early, and adds precise factual context in ordinary sentences.

The description is below YouTube Studio's 5,000-character limit. One or two central topics should appear naturally in title and description; this package uses Chrome tab preview and finding open tabs. [YouTube description guidance](https://support.google.com/youtube/answer/12948449?hl=en)

## Chapters

| Start | End | Length | Label |
| --- | --- | --- | --- |
| 00:00 | 00:20 | 20 seconds | Preview Chrome tabs before you switch |
| 00:20 | 00:34 | 14 seconds | Search tabs across Chrome windows |
| 00:34 | 00:48 | 14 seconds | Free and private tab preview |

These broad chapters meet YouTube's published structure: start at `00:00`, use at least three timestamps in ascending order, and keep every chapter at least 10 seconds. Each description timestamp and its label occupy one line. The channel must have access to the feature; correct timestamps do not guarantee chapters will display. [YouTube chapters](https://support.google.com/youtube/answer/9884579?hl=en)

If the final edit moves a topic, adjust the chapter start to the actual transition while retaining the 10-second minimum. Do not add a separate short chapter for the logo or closing install card.

## Captions and transcript

- Upload a manually checked, UTF-8 `.srt` file with timing. YouTube supports basic SubRip files; styling is not preserved. [Supported subtitle files](https://support.google.com/youtube/answer/2734698?hl=en)
- Match the final audio exactly, including meaningful non-speech audio such as music. For a music-only animation, do not present a marketing script as spoken dialogue. Any accessible rendition of visible text should be explicitly labeled as on-screen text and synchronized to its appearance.
- Keep a plain-text companion transcript of the same final content. This is useful for accessibility and reuse, but it must not introduce features or claims absent from the film.
- Set English as the video and metadata language. In Studio, add English subtitles and use **Upload file → With timing**. Preview the complete caption track and verify the final cue ends within the 48-second runtime. [Add subtitles and captions](https://support.google.com/youtube/answer/2734796?hl=en)

## Suggested upload settings

| Field | Recommendation |
| --- | --- |
| Category | Science & Technology — a product demonstration of browser software |
| Video and metadata language | English |
| Audience | Not made for kids — the film addresses adult browser users, rather than children |
| Embedding | Enabled, so the film can play in the Chrome Web Store video surface |
| License | Standard YouTube License |
| Visibility | Public for search discovery once the user is ready to publish; inspect the completed upload and processing result first |
| Captions | Upload the checked English timed SRT |
| Chapters | Use the three manual chapters in the description |
| Thumbnail | Use the final matching TabShow thumbnail; real product proof, legible promise, existing violet/amber branding |
| Playlist | Use an existing relevant TabShow/product-demo playlist if one exists; no new playlist is required |

Category, audience, language, license, embedding and visibility are available upload settings. The recommendations above reflect this specific film's content and intended distribution. [YouTube upload settings](https://support.google.com/youtube/answer/57407?hl=en)

## Tags — paste into the tags field only

```text
TabShow, Tab Show, tab.show, Chrome tab preview, live tab preview, Chrome extension, find Chrome tabs, search Chrome tabs, Chrome side panel, hover tab preview
```

This restrained set covers the brand's spacing/punctuation variants and demonstrated behavior. Tags are limited to 500 characters in total, including separators and additional quote accounting for tags with spaces. The set is comfortably below that limit. [YouTube video resource reference](https://developers.google.com/youtube/v3/docs/videos#snippet.tags)

Tags play a small role in discovery except for spelling variants; title, thumbnail and description deserve more attention. Do not paste a tag cloud into the description. [YouTube tag guidance](https://support.google.com/youtube/answer/146402?hl=en)

## Search and answer-engine readiness

The package provides a clear product name, an explicit use case, verifiable behavior, an official install destination, broad named segments, and an accurate timed text track. Those make the film easier for viewers and indexing systems to interpret. They do not guarantee search placement, answer-engine citation, installs, or Google key moments.

Google documents that YouTube description timestamps can provide explicit key-moment labels. Keep labels factual and aligned with the final film. [Google video SEO guidance](https://developers.google.com/search/docs/appearance/video#key-moments)

YouTube search considers how the title, description, tags and video content match a query, alongside engagement and quality. This package prioritizes that consistency over repeating keywords. [How YouTube search works](https://support.google.com/youtube/answer/16090438?hl=en)

Do not paste JSON-LD into the YouTube description. If a dedicated watch page is added to `tab.show` later, accurate `VideoObject`/`Clip` metadata can be considered on that page after the public video URL, thumbnail and publication date exist. That website change is separate from this upload. [Google video structured data](https://developers.google.com/search/docs/appearance/structured-data/video#clip)

## Product truth notes for the final edit

- The main promise is “Preview Chrome tabs before you switch.” Use `TabShow` as the brand; `tab.show` is the website.
- Current-window hover temporarily activates the live page. Moving out of the side panel restores the original tab. A click commits the selected tab and closes the panel.
- Arrow keys move selection only. They do not trigger live preview. Enter commits the selection and closes the panel.
- All-window search is supported. Other-window hover never brings that window to the foreground; switching requires a deliberate click or keyboard selection/open.
- Title, URL and domain search are supported. Do not imply search of webpage contents.
- The 2.1 Tab Chaos Score is implemented, but it is a local heuristic and is not needed to explain the core installation benefit.
- Avoid unmeasured speed/RAM promises, AI organization, cloud sync, saved sessions, ratings, user counts, “best,” “free forever,” and medical claims.

Source audit: `docs/launch-materials/01_STORE_COPY.md`, `02_VISUAL_SYSTEM.md`, `05_RELEASE_QA.md`, `07_PRODUCT_HUNT_LAUNCH_KIT.md`, `08_2_1_RELEASE_NOTES.md`; `marketing/source/appshots-2.1/*.md`; `website/app/page.tsx`; `src/hooks/useTabs.ts`; `entrypoints/sidepanel/App.tsx`; `src/utils/tabSelectors.ts`; `src/services/TabService.ts`; `src/parameters.ts`; `wxt.config.ts`.
