import {
  ChapterAtmosphere,
  CinematicIntro,
  CustomCursor,
  Footer,
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
      <CustomCursor />
      <ChapterAtmosphere />
      <Navbar />
      <main className="relative z-0">
        <HomePage />
      </main>
      <Footer />
      <ScrollCompassHUD />
      <SpotDetail />
    </ShowcaseProvider>
  );
}
