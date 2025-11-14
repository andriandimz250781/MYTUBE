import { AppHeader } from '@/components/layout/app-header';
import { getImage } from '@/lib/data';

export async function AppLayout({ children }: { children: React.ReactNode }) {
  const userAvatar = await getImage('user-avatar-1');

  return (
    <div className="flex min-h-svh flex-col">
      <AppHeader userAvatarUrl={userAvatar?.imageUrl} />
      <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
    </div>
  );
}
