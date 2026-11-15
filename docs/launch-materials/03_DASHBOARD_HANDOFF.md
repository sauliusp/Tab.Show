# Chrome Web Store release workflow

Current release work: [TabShow 2.4.0](../releases/2.4.0/README.md).

Use the release record for the tested package, digest, screenshots, validation evidence, and actual publication state. Older release folders describe historical preparation and are not evidence of current availability.

The extension's Store ID is `njdjagodlomkhingeecipnlnnhnipkho`. On 14 November 2026, the authenticated developer dashboard showed 2.3.0 as Published / public. The current user authorized the 2.4 work, Codex PR review loop, merge to main, Store submission, website update, and Featurebase replies and status management.

1. Finish implementation and test the exact production package.
2. Create the versioned release PR, request Codex review, resolve actionable findings, and re-request review after changes. Merge only the reviewed head after checks pass.
3. Upload the verified ZIP and accurate listing assets. Check the Store preview and privacy declarations before submitting.
4. Record the dashboard's returned status. Uploaded, saved as draft, submitted, approved, and publicly available are distinct states.
5. Publish the matching website through the existing Sites project. Merging GitHub does not deploy the site.
6. Reply to feedback with the verified availability status. Mark shipped requests Completed only after public availability is confirmed.

Current store description: [01_STORE_COPY.md](01_STORE_COPY.md). Current release notes: [11_2_4_RELEASE_NOTES.md](11_2_4_RELEASE_NOTES.md).
