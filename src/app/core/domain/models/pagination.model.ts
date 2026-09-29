export interface SortInfo {
  sorted: boolean;
  unsorted: boolean;
  empty?: boolean;
}

export interface PageableInfo {
  sort: SortInfo;
  pageSize: number;
  pageNumber: number;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface PagedResponse<T> {
  content: T[];
  pageable: PageableInfo;
  totalElements: number;
  last: boolean;
  totalPages: number;
  first: boolean;
  sort: SortInfo;
  number: number;
  numberOfElements: number;
  size: number;
  empty?: boolean;
}
