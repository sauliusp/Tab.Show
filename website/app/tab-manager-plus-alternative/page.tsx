import { IntentPage, pageMetadata } from "../site";
import { tabManagerPlusPage } from "../intent-data";

export const metadata = pageMetadata("Tab Manager Plus Alternative for Faster Tab Recognition", "Skip the management dashboard when you only need the right page. Search, preview, switch, or snap back with TabShow.", "/tab-manager-plus-alternative");
export default function Page() { return <IntentPage data={tabManagerPlusPage} />; }
