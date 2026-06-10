export type IncidentStatus = "open" | "in_progress" | "resolved";

export type UserType = "resident" | "staff";

export type Incident = {
  id: string;
  title: string;
  description: string;
  attachmentName?: string | null;
  attachmentUrl?: string | null;
  category: string;
  createdAt: string;
  status: IncidentStatus;
  location: string;
  userType: UserType;
  hasAttachment: boolean;
  archivedAt?: string | null;
};
