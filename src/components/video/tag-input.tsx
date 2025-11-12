'use client';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

type TagInputProps = {
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
};

export function TagInput({ tags, setTags }: TagInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const newTag = inputValue.trim().replace(/,/g, '');
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
    }
    setInputValue('');
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div>
      <div className="mb-2 flex min-h-[2.5rem] flex-wrap items-center gap-2 rounded-md border border-input p-2">
        {tags.map(tag => (
          <Badge
            key={tag}
            variant="secondary"
            className="flex items-center gap-1 py-1 pl-2.5 pr-1"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="rounded-full p-0.5 hover:bg-muted-foreground/20"
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove {tag}</span>
            </button>
          </Badge>
        ))}
         <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? "Add tags..." : ""}
          className="flex-1 border-none bg-transparent shadow-none focus-visible:ring-0"
        />
      </div>
      {/* Hidden inputs to submit tags with the form */}
      {tags.map((tag, index) => (
        <input key={index} type="hidden" name={`tags[${index}]`} value={tag} />
      ))}
    </div>
  );
}
