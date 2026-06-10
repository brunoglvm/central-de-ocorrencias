import type { Metadata } from "next";
import { BoardClient } from "@/components/board/board-client";
import { mockIncidents } from "@/data/mock-incidents";

export const metadata: Metadata = {
  title: "Quadro",
};

export default function AdminBoardPage() {
  return <BoardClient initialIncidents={mockIncidents} />;
}
