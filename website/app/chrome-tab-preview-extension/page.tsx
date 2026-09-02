import { IntentPage, pageMetadata } from "../site";
import { previewPage } from "../intent-data";

export const metadata = pageMetadata("Chrome Tab Preview Extension | Preview Before You Switch", "Preview live Chrome tabs from a searchable side panel. TabShow lets you switch only when the page is right or snap back when it is not.", "/chrome-tab-preview-extension");
export default function Page() { return <IntentPage data={previewPage} />; }
