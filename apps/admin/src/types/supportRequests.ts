// Support Requests types matching backend DTOs/enums

export enum SupportRequestPriority {
  Low = 1,
  Medium = 2,
  High = 3,
  Urgent = 4,
}

export enum SupportRequestStatus {
  New = 1,
  InProgress = 2,
  Resolved = 3,
  Closed = 4,
}

export interface UserInformationDto {
  id: string;
  name: string;
  surname: string;
}

export interface SupportRequestListItemDto {
  id: string;
  subject: string;
  description: string;
  resolveDescription: string;
  status: SupportRequestStatus;
  priority: SupportRequestPriority;
  createdUser: UserInformationDto;
  resolvedDate?: string | null;
  closedDate?: string | null;
}

export interface SupportRequestDetailDto extends SupportRequestListItemDto {
  createdDate: string;
  updatedDate?: string | null;
}

export interface PageRequest {
  pageIndex: number;
  pageSize: number;
}

export interface PaginationInfo {
  index: number;
  size: number;
  count: number;
  pages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface GetListResponse<T> {
  items: T[];
  pagination: PaginationInfo;
}

export interface CreateSupportRequestRequest {
  subject: string;
  description: string;
  priority: SupportRequestPriority;
}


