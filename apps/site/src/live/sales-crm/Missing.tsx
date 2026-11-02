// Pages in the menu that this example doesn't have, like Companies and Reports, still show inside the app.
import { NotInExample } from '../kit';
import { Shell } from './Shell';

export default function Missing({ page }: { page: string }) {
  return (
    <Shell current={page}>
      <NotInExample name={page.charAt(0).toUpperCase() + page.slice(1)} home="dashboard" />
    </Shell>
  );
}
