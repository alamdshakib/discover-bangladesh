import { Layout } from '@components';
import { useLenis } from '@hooks';
import { HomePage } from '@pages';

export default function App() {
  useLenis();

  return (
    <Layout>
      <HomePage />
    </Layout>
  );
}
