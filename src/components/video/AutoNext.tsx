"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AutoNext({ nextId }: { nextId?: string }) {
  const router = useRouter();

  useEffect(() => {
    if (!nextId) return;

    // Set a timer to navigate to the next video.
    // We'll use a long delay for demonstration purposes.
    const timer = setTimeout(() => {
      router.push(`/watch/${nextId}`);
    }, 120000); // 2 minutes

    // Cleanup the timer if the component unmounts or nextId changes.
    return () => clearTimeout(timer);
  }, [nextId, router]);

  // This component does not render any UI.
  return null;
}
