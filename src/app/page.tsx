import { redirect } from 'next/navigation';

// Root "/" is handled by next-intl middleware (redirects to /uz or /ru).
// This component is a safety fallback.
export default function RootPage() {
  redirect('/uz');
}
