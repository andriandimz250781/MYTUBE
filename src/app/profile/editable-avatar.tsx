'use client';

import { useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { getImage } from '@/app/lib/data';
import { Pencil } from 'lucide-react';

export function EditableAvatar({ initialImageId }: { initialImageId: string }) {
  const initialImage = getImage(initialImageId);
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialImage?.imageUrl || null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative h-32 w-32">
      <Avatar className="h-full w-full border-4 border-muted">
        <AvatarImage src={imagePreview || ''} alt="User Avatar" />
        <AvatarFallback className="text-4xl">U</AvatarFallback>
      </Avatar>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        className="hidden"
        accept="image/*"
      />
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="absolute bottom-1 right-1 rounded-full border-2 border-background"
        onClick={handleEditClick}
      >
        <Pencil className="h-4 w-4" />
        <span className="sr-only">Edit Profile Picture</span>
      </Button>
    </div>
  );
}
