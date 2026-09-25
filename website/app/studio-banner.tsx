const studioUrl = "https://mortalitystudio.com/en/?utm_source=tabshow&utm_medium=referral&utm_campaign=studio_banner";

export function StudioBanner() {
  return (
    <aside className="studio-banner" aria-labelledby="studio-banner-title">
      <div className="studio-banner__inner">
        <div className="studio-banner__credit"><span>Powered by</span> <a href={studioUrl}>MortalityStudio</a></div>
        <p className="studio-banner__stamp">The free shit department</p>
        <h2 id="studio-banner-title" className="studio-banner__title">Useful shit.<br /><span>No invoice.</span></h2>
        <div className="studio-banner__pitch">
          <p>TabShow is powered by MortalityStudio. We put our time and money into fixing browser bullshit. You find the bloody tab. You&apos;re welcome. Unfortunately.</p>
          <div className="studio-banner__links">
            <a className="studio-banner__link studio-banner__link--site" href={studioUrl}><strong>See what else we build</strong><span>MortalityStudio.com <span aria-hidden="true">↗</span></span></a>
            <a className="studio-banner__link studio-banner__link--social" href="https://www.instagram.com/mortalitystudio/"><strong>Follow the bad influence</strong><span>Mortality Studio on Instagram <span aria-hidden="true">↗</span></span></a>
          </div>
        </div>
      </div>
    </aside>
  );
}
