import {
  ChapterAtmosphere,
  CustomCursor,
  Footer,
  Navbar,
  Preloader,
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
      <Preloader />
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
