import { IntentPage, pageMetadata } from "../site";
import { lostTabPage } from "../intent-data";

export const metadata = pageMetadata("How to Find a Lost Chrome Tab Without Guessing", "Search open Chrome tabs by title, URL, or domain, preview the live page, and return to your original tab if it is not the right one.", "/find-lost-chrome-tab");
export default function Page() { return <IntentPage data={lostTabPage} />; }
