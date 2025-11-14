import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getImage } from '@/lib/data';
import { User } from 'lucide-react';

export async function UserAvatar({ avatarId }: { avatarId: string }) {
  const userAvatar = await getImage(avatarId);

  return (
    <Avatar className="h-8 w-8">
      {userAvatar ? (
        <AvatarImage src={userAvatar.imageUrl} alt="User Avatar" />
      ) : null}
      <AvatarFallback>
        <User className="h-5 w-5" />
      </AvatarFallback>
    </Avatar>
  );
}
