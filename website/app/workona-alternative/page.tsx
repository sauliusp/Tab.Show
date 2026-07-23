import { IntentPage, pageMetadata } from "../site";
import { workonaPage } from "../intent-data";

export const metadata = pageMetadata("Workona Alternative With No Account or Workspace Setup", "Workona organizes project workspaces. TabShow is a local, no-account way to search and preview the live Chrome tabs you already have.", "/workona-alternative");
export default function Page() { return <IntentPage data={workonaPage} />; }
