'use client';

import { useEffect, useRef, useState } from 'react';
import { useFormState } from 'react-dom';
import { type TagGenerationState, getAiTags } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { TagInput } from '@/components/video/tag-input';
import { ImageUp } from 'lucide-react';
import { GenerateButton } from './generate-button';
import { useToast } from '@/hooks/use-toast';

export function UploadForm() {
  const initialState: TagGenerationState = { message: null, tags: [], errors: {} };
  const [state, dispatch] = useFormState(getAiTags, initialState);
  const { toast } = useToast();

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [frameDataUri, setFrameDataUri] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    if (state?.tags) {
      setTags(state.tags);
    }
    if(state?.message){
      toast({
        title: state.errors?.server ? "Error" : "Success",
        description: state.message,
        variant: state.errors?.server ? "destructive" : "default",
      })
    }
  }, [state, toast]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
    }
  };

  const handleVideoLoad = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      // Set canvas dimensions to match video
      const aspectRatio = video.videoWidth / video.videoHeight;
      canvas.width = 480;
      canvas.height = 480 / aspectRatio;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUri = canvas.toDataURL('image/jpeg');
        setFrameDataUri(dataUri);
      }
    }
  };

  return (
    <form action={dispatch} className="grid gap-8 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Video Details</CardTitle>
            <CardDescription>
              Provide a title and description for your video.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="videoTitle">Title</Label>
              <Input
                id="videoTitle"
                name="videoTitle"
                placeholder="My Awesome Video"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="videoDescription">Description</Label>
              <Textarea
                id="videoDescription"
                name="videoDescription"
                placeholder="Tell viewers about your video"
                rows={5}
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI-Powered Tagging</CardTitle>
            <CardDescription>
              Generate tags automatically from your video's content.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <input type="hidden" name="videoDataUri" value={frameDataUri || ''} />
            <TagInput tags={tags} setTags={setTags} />
          </CardContent>
          <CardFooter>
             <GenerateButton />
          </CardFooter>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Upload</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="videoFile">Video File</Label>
              <Input
                id="videoFile"
                name="videoFile"
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                required
              />
            </div>
            <div className="flex aspect-video w-full items-center justify-center overflow-hidden rounded-md border border-dashed bg-muted/50">
              {videoPreview ? (
                <video
                  ref={videoRef}
                  src={videoPreview}
                  onLoadedData={handleVideoLoad}
                  className="h-full w-full object-contain"
                  muted
                  playsInline
                />
              ) : (
                <div className="text-center text-muted-foreground">
                  <ImageUp className="mx-auto h-12 w-12" />
                  <p className="mt-2 text-sm">Video preview</p>
                </div>
              )}
              <canvas ref={canvasRef} className="hidden" />
            </div>
          </CardContent>
        </Card>
        <Button
          type="button"
          size="lg"
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Publish Video
        </Button>
      </div>
    </form>
  );
}
