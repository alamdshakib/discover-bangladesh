import { Footer, Navbar, SpotDetail } from '@components';
import { ShowcaseProvider } from '@context/ShowcaseProvider.jsx';
import { useLenis } from '@hooks';
import { HomePage } from '@pages';

export default function App() {
  useLenis();

  return (
    <ShowcaseProvider>
      <Navbar />
      <main>
        <HomePage />
      </main>
      <Footer />
      <SpotDetail />
    </ShowcaseProvider>
  );
}
