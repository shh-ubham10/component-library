export interface Column<T> {
  key: string;
  title: string;
  dataIndex: keyof T;
  sortable?: boolean;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  /** keep your existing boolean; when true, table is selectable */
  selectable?: boolean;
  /** NEW (optional): single | multiple. Default: multiple */
  selectionMode?: 'single' | 'multiple';
  onRowSelect?: (selectedRows: T[]) => void;
  className?: string;

  rowKey?: keyof T;

  emptyText?: string;

  rowClickableToSelect?: boolean;
}
