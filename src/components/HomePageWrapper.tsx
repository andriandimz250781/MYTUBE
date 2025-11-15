"use client";

import { useRouter } from "next/navigation";
import PullToRefresh from "./PullToRefresh";

export default function HomePageWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const handleRefresh = () => {
    router.refresh();
  };

  return <PullToRefresh onRefresh={handleRefresh}>{children}</PullToRefresh>;
}
