import {
  ChapterAtmosphere,
  CinemaLightbox,
  CinematicIntro,
  Footer,
  GlobalMotion,
  JourneyDrawer,
  Navbar,
  ScrollCompassHUD,
  SpotDetail,
} from '@components';
import { ShowcaseProvider } from '@context/ShowcaseProvider.jsx';
import { useLenis } from '@hooks';
import { HomePage } from '@pages';

export default function App() {
  useLenis();

  return (
    <ShowcaseProvider>
      <div
        data-page-wrapper
        className="relative min-h-screen"
        style={{
          '--chapter-accent': '#10b981',
          '--chapter-glow': 'rgba(16, 185, 129, 0.16)',
        }}
      >
        <CinematicIntro />
        <GlobalMotion />
        <ChapterAtmosphere />
        <Navbar />
        <main className="relative z-0">
          <HomePage />
        </main>
        <Footer />
        <ScrollCompassHUD />
        <JourneyDrawer />
        <SpotDetail />
        <CinemaLightbox />
      </div>
    </ShowcaseProvider>
  );
}
