export type SeedHistoryRawItem = {
  id: number;
  userId: string;
  amount: number;
  type: string;
  description: string;
  balanceSnapshot: number;
  createdAt: string;
}

export type SeedsResponse = {
  content: SeedHistoryRawItem[];
  page: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
}
