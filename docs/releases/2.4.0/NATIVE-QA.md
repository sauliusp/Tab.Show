# Native Chrome checks still required

The Mac locked during release work. These are pending checks, not recorded passes. Use Chrome for Testing with the unpacked production output at the same extension path. The test profile contains no personal browsing data.

1. Default flow: start on tab A, hover B, leave the panel, and verify A returns. Click or press Enter on B; the panel closes. Reopen and verify B is visible.
2. Keep-open flow: enable the setting, choose B, and verify the panel stays. Hover C and leave; B returns. Escape returns to B and closes the panel.
3. Cross-window flow: with keep-open enabled, preview C in window 1, then choose D in window 2. Window 2 focuses and window 1 stays on its committed tab. Return to window 1 and check another preview/return cycle.
4. Hover control: disable previews during an active preview and verify return without panel closure. Hovering does nothing; search, arrows, click, and Enter still work. Re-enable and verify the configured delay.
5. Long list: open with the active tab near the bottom. Verify current-tab reveal, manual scroll stability, keyboard reveal, search inside collapsed groups, and saved sorting after closing/reopening. Recently used intentionally moves a chosen tab to the top. Update titles and move tabs between windows without unsolicited scrolling.
6. Upgrade: using the same ID/path, preserve 2.3 settings through the update. Keep-open defaults off and hover previews on. Feature updates open one inactive notes tab; patch updates open none. Reloading the unpacked extension alone is not proof of an actual update event.
7. Onboarding: verify the Open TabShow buttons, shortcut instructions, help links, and narrow Settings layout in actual extension pages.
8. Capture the clean sample page with the actual panel into `marketing/source/appshots-2.4/live-browser.jpg`. Render gallery slide 1 at 1280 × 800 and create the website image in both website checkouts. Do not use the fallback as native evidence.
9. Rebuild the exact final source, inspect ZIP version/permissions/contents/digest, run extension and website checks, and complete Codex review of the final head before merging to main.

Then upload the package and complete Store assets, verify the listing preview, submit, record the returned review state, and publish the matching Sites version. A review submission is not public availability. Update Featurebase accordingly.
