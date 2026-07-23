import { Footer, Header, StoreButton } from "./site";
import Link from "next/link";

export default function NotFound() {
  return <><Header /><main className="plain-page shell"><header><p className="eyebrow"><span /> 404</p><h1>This page is not<br /><em>in the tab list.</em></h1><p className="lede">The link may be old or mistyped. Return home, open support, or install TabShow and find the page that is still open.</p><div className="actions"><Link className="button button-primary" href="/">Back to TabShow <span aria-hidden="true">→</span></Link><StoreButton content="404" /></div></header></main><Footer /></>;
}
