import type { Metadata } from "next";
import { HistoryClient } from "@/components/history/history-client";
import { mockIncidents } from "@/data/mock-incidents";

export const metadata: Metadata = {
  title: "Histórico",
};

export default function AdminHistoryPage() {
  return (
    <div>
      <HistoryClient initialIncidents={mockIncidents} />
    </div>
  );
}
