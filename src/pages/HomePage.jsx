import { EditorialStatement, Hero, KineticMarquee, Showcase, SpotAtlas, StatsStrip } from '@components';

export function HomePage() {
  return (
    <>
      <Hero />
      <StatsStrip />
      <KineticMarquee />
      <EditorialStatement />
      <Showcase />
      <KineticMarquee className="mt-20 sm:mt-28" />
      <SpotAtlas />
    </>
  );
}
