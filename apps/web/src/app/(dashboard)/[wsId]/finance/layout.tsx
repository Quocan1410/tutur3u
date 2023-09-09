import { Navigation } from '@/components/navigation';

interface LayoutProps {
  params: {
    wsId?: string;
  };
  children: React.ReactNode;
}

export default async function Layout({
  children,
  params: { wsId },
}: LayoutProps) {
  const navLinks = [
    {
      name: 'Overview',
      href: `/${wsId}/finance`,
      matchExact: true,
    },
    {
      name: 'Wallets',
      href: `/${wsId}/finance/wallets`,
    },
    {
      name: 'Transactions',
      href: `/${wsId}/finance/transactions`,
      matchExact: true,
    },
    {
      name: 'Categories',
      href: `/${wsId}/finance/transactions/categories`,
    },
    {
      name: 'Invoices',
      href: `/${wsId}/finance/invoices`,
    },
    {
      name: 'Import',
      href: `/${wsId}/finance/import`,
      disabled: true,
    },
    {
      name: 'Settings',
      href: `/${wsId}/finance/settings`,
      disabled: true,
    },
  ];

  return (
    <>
      <div className="mb-4 flex gap-1 overflow-x-auto font-semibold">
        <Navigation navLinks={navLinks} />
      </div>
      {children}
    </>
  );
}