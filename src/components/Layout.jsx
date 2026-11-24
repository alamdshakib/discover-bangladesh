import { Navbar } from './Navbar.jsx';
import { Footer } from './Footer.jsx';

export function Layout({ children }) {
  return (
    <div id="top" className="flex min-h-screen flex-col bg-bengal-deep text-parchment">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
