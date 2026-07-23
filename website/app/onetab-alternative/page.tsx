import { IntentPage, pageMetadata } from "../site";
import { oneTabPage } from "../intent-data";

export const metadata = pageMetadata("OneTab Alternative for Live Tab Recognition", "OneTab closes tabs into a list. TabShow keeps tabs live and helps you search and preview the right page without switching away.", "/onetab-alternative");
export default function Page() { return <IntentPage data={oneTabPage} />; }
