import {
  ChapterAtmosphere,
  CinemaLightbox,
  CinematicIntro,
  Footer,
  GlobalMotion,
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
      <CinematicIntro />
      <GlobalMotion />
      <ChapterAtmosphere />
      <Navbar />
      <main className="relative z-0">
        <HomePage />
      </main>
      <Footer />
      <ScrollCompassHUD />
      <SpotDetail />
      <CinemaLightbox />
    </ShowcaseProvider>
  );
}
