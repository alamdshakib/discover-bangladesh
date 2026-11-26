import { Hero, HorizontalReel, KineticMarquee, Showcase, SpotAtlas, StatsStrip } from '@components';

export function HomePage() {
  return (
    <>
      <Hero />
      <StatsStrip />
      <KineticMarquee />
      <Showcase />
      <HorizontalReel />
      <KineticMarquee className="mt-16 sm:mt-24" />
      <SpotAtlas />
    </>
  );
}
