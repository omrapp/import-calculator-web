import { Link } from 'react-router';

import { Button } from '@/components/ui/button';

export function NotFoundPage() {
  return (
    <section>
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <Button asChild className="mt-4">
        <Link to="/">Back to calculator</Link>
      </Button>
    </section>
  );
}
