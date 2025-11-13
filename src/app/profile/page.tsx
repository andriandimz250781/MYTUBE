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
      <h1 className="font-headline text-3xl font-bold">Edit Profile</h1>
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
              <div>
                <Label htmlFor="displayName" className="text-lg font-semibold">
                  {user.name}
                </Label>
              </div>
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
          <CardFooter className="border-t px-6 py-4">
            <Button>Save Changes</Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
