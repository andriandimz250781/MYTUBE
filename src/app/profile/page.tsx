import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EditableAvatar } from './editable-avatar';

export default function ProfilePage() {
  // Mock data for user profile
  const user = {
    name: 'ANDTUBE User',
    avatarId: 'user-avatar-default',
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <h1 className="font-headline text-2xl font-bold md:text-3xl">Edit Profile</h1>
      <form>
        <Card>
          <CardHeader>
            <CardTitle>Profile Details</CardTitle>
            <CardDescription>
              Update your name and profile picture.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <EditableAvatar initialImageId={user.avatarId} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                name="displayName"
                defaultValue={user.name}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col-reverse gap-2 border-t px-6 py-4 sm:flex-row sm:justify-between">
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href="/">Kembali</Link>
            </Button>
            <Button className="w-full sm:w-auto">Save Changes</Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
