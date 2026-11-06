export type Role = 'CITIZEN' | 'ADMIN';

export type ComplaintStatus = 'SUBMITTED' | 'UNDER_REVIEW' | 'IN_PROGRESS' | 'RESOLVED';

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type DuplicateReviewStatus = 'PENDING' | 'CONFIRMED_DUPLICATE' | 'NOT_A_DUPLICATE';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  role: Role;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon?: string | null;
  createdAt: string;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
}

export interface ComplaintImage {
  id: string;
  complaintId: string;
  storageKey: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  createdAt: string;
}

export interface StatusHistory {
  id: string;
  complaintId: string;
  previousStatus?: ComplaintStatus | null;
  newStatus: ComplaintStatus;
  description: string;
  updatedById: string;
  updatedBy: {
    id: string;
    fullName: string;
    role: Role;
  };
  createdAt: string;
}

export interface ResolutionImage {
  id: string;
  resolutionId: string;
  storageKey: string;
  fileName: string;
  createdAt: string;
}

export interface ResolutionRecord {
  id: string;
  complaintId: string;
  resolutionDescription: string;
  resolvedById: string;
  resolvedAt: string;
  createdAt: string;
  resolvedBy: {
    id: string;
    fullName: string;
    role: Role;
  };
  images: ResolutionImage[];
}

export interface Feedback {
  id: string;
  complaintId: string;
  userId: string;
  rating: number;
  comments?: string | null;
  createdAt: string;
  user: {
    id: string;
    fullName: string;
  };
}

export interface Complaint {
  id: string;
  complaintNumber: string;
  userId: string;
  categoryId: string;
  departmentId?: string | null;
  title: string;
  description: string;
  latitude?: number | null;
  longitude?: number | null;
  address?: string | null;
  status: ComplaintStatus;
  priority: Priority;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    fullName: string;
    email: string;
    phone?: string | null;
  };
  category: Category;
  department?: Department | null;
  images: ComplaintImage[];
  statusHistory: StatusHistory[];
  resolution?: ResolutionRecord | null;
  feedbacks?: Feedback[];
  _count?: {
    images: number;
    feedbacks: number;
  };
}

export interface DuplicateSuggestion {
  id: string;
  complaintId: string;
  possibleDuplicateId: string;
  similarityScore: number;
  reason?: string | null;
  reviewStatus: DuplicateReviewStatus;
  reviewedById?: string | null;
  createdAt: string;
  complaint?: Complaint;
  possibleDuplicate: Complaint;
}

export interface AuditLog {
  id: string;
  adminId: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata?: string | null;
  createdAt: string;
  admin: {
    id: string;
    fullName: string;
    email: string;
  };
}

export interface DashboardMetrics {
  totalComplaints: number;
  submitted: number;
  underReview: number;
  inProgress: number;
  resolved: number;
}

export interface AdminAnalytics {
  metrics: DashboardMetrics;
  categoryDistribution: { name: string; count: number }[];
  statusDistribution: { status: string; count: number }[];
  priorityDistribution: { priority: string; count: number }[];
  monthlyTrends: { month: string; submitted: number; resolved: number }[];
  departmentPerformance: { department: string; assigned: number; resolved: number }[];
}

export interface AIAnalysisResult {
  suggestedCategory?: string;
  confidenceScore?: number;
  suggestedPriority?: Priority;
  summary?: string;
  duplicateCandidateIds?: string[];
  reasoning?: string;
}

