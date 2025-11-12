'use client';
import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles } from 'lucide-react';

export function GenerateButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" variant="outline" disabled={pending}>
      {pending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Sparkles className="mr-2 h-4 w-4" />
      )}
      Generate with AI
    </Button>
  );
}
