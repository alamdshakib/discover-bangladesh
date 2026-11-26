import { Hero, KineticMarquee, Showcase, SpotAtlas, StatsStrip } from '@components';

export function HomePage() {
  return (
    <>
      <Hero />
      <StatsStrip />
      <KineticMarquee />
      <Showcase />
      <KineticMarquee className="mt-20 sm:mt-28" />
      <SpotAtlas />
    </>
  );
}
