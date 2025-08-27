import { getAllTerms } from '@/lib/data';
import HomePageClient from '@/components/home-page-client';

// Revalidate every hour
export const revalidate = 3600;

export default function Home() {
  const terms = getAllTerms();

  return (
    <HomePageClient terms={terms} />
  );
}
