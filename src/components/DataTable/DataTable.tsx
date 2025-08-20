import React, { useMemo, useState } from 'react';
import { clsx } from 'clsx';
import type { Column, DataTableProps } from './types';

function getSafeKey<T>(row: T, rowKey?: keyof T): string | number {
  const keyFromProp = rowKey ? (row[rowKey] as unknown as string | number) : undefined;
  const keyFromId = (row as any)?.id as string | number | undefined;
  return keyFromProp ?? keyFromId ?? JSON.stringify(row);
}

function compareVals(a: unknown, b: unknown): number {
  if (a == null || b == null) return 0;
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return String(a).localeCompare(String(b));
}

/** Generic DataTable with sorting, selection, filtering, pagination, loading & empty states. */
export function DataTable<T>({
  data,
  columns,
  loading = false,
  selectable = false,
  selectionMode = 'multiple',
  onRowSelect,
  className,
  rowKey,
  emptyText = 'No data available',
  rowClickableToSelect = true,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedKeys, setSelectedKeys] = useState<(string | number)[]>([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // ---------- filter ----------
  const filteredData = useMemo(() => {
    if (!search) return data;
    return data.filter((row) =>
      columns.some((col) => {
        const val = (row as any)[col.dataIndex];
        return String(val).toLowerCase().includes(search.toLowerCase());
      })
    );
  }, [data, search, columns]);

  // ---------- sorting ----------
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    const col = columns.find((c) => c.key === sortKey);
    if (!col) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = (a as any)[col.dataIndex];
      const bVal = (b as any)[col.dataIndex];
      const res = compareVals(aVal, bVal);
      return sortOrder === 'asc' ? res : -res;
    });
  }, [filteredData, sortKey, sortOrder, columns]);

  // ---------- pagination ----------
  const totalPages = Math.ceil(sortedData.length / rowsPerPage) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return sortedData.slice(start, start + rowsPerPage);
  }, [sortedData, currentPage]);

  // ---------- sorting handler ----------
  const handleSort = (col: Column<T>) => {
    if (!col.sortable) return;
    if (sortKey === col.key) setSortOrder((o) => (o === 'asc' ? 'desc' : 'asc'));
    else {
      setSortKey(col.key);
      setSortOrder('asc');
    }
  };

  // ---------- selection ----------
  const emitSelected = (keys: (string | number)[]) => {
    if (!onRowSelect) return;
    const keySet = new Set(keys);
    onRowSelect(data.filter((r) => keySet.has(getSafeKey(r, rowKey))));
  };

  const toggleRow = (row: T) => {
    const key = getSafeKey(row, rowKey);
    if (selectionMode === 'single') {
      const updated = selectedKeys.includes(key) ? [] : [key];
      setSelectedKeys(updated);
      emitSelected(updated);
      return;
    }
    const updated = selectedKeys.includes(key)
      ? selectedKeys.filter((k) => k !== key)
      : [...selectedKeys, key];
    setSelectedKeys(updated);
    emitSelected(updated);
  };

  const allKeys = useMemo(
    () => paginatedData.map((r) => getSafeKey(r, rowKey)), // only for current page
    [paginatedData, rowKey]
  );

  const toggleAll = () => {
    if (selectionMode === 'single') return;
    if (selectedKeys.length === allKeys.length && allKeys.length > 0) {
      setSelectedKeys([]);
      emitSelected([]);
    } else {
      setSelectedKeys(allKeys);
      emitSelected(allKeys);
    }
  };

  // ---------- render ----------
  return (
    <div className={clsx('space-y-3', className)}>
      {/* Search bar */}
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="w-64 rounded border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              {selectable && selectionMode === 'multiple' && (
                <th className="px-4 py-2">
                  <input
                    type="checkbox"
                    aria-label="Select all rows"
                    checked={allKeys.length > 0 && selectedKeys.length === allKeys.length}
                    onChange={toggleAll}
                  />
                </th>
              )}
              {selectable && selectionMode === 'single' && (
                <th className="px-4 py-2" aria-hidden />
              )}
              {columns.map((col) => {
                const isSorted = sortKey === col.key;
                const ariaSort = isSorted ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none';
                return (
                  <th
                    key={col.key}
                    className={clsx(
                      'px-4 py-2 font-medium text-gray-700 dark:text-gray-200',
                      col.sortable ? 'cursor-pointer select-none' : ''
                    )}
                    onClick={() => handleSort(col)}
                    aria-sort={ariaSort}
                    scope="col"
                  >
                    <div className="flex items-center gap-1">
                      {col.title}
                      {col.sortable && isSorted && <span aria-hidden>{sortOrder === 'asc' ? '▲' : '▼'}</span>}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="px-4 py-8 text-center text-gray-500"
                >
                  <div role="status" aria-live="polite" className="inline-flex items-center gap-2">
                    <span className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-transparent dark:border-gray-600" />
                    <span>Loading…</span>
                  </div>
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr data-empty>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  className="px-4 py-8 text-center text-gray-500"
                >
                  {emptyText}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, i) => {
                const key = getSafeKey(row, rowKey);
                const isSelected = selectedKeys.includes(key);
                return (
                  <tr
                    key={key}
                    aria-selected={isSelected || undefined}
                    className={clsx(
                      'border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800',
                      isSelected ? 'bg-indigo-50 dark:bg-indigo-900/30' : ''
                    )}
                    onClick={() => {
                      if (!selectable || !rowClickableToSelect) return;
                      toggleRow(row);
                    }}
                  >
                    {selectable && (
                      <td className="px-4 py-2" onClick={(e) => e.stopPropagation()}>
                        {selectionMode === 'single' ? (
                          <input
                            type="radio"
                            name="datatable-row"
                            aria-label={`Select row ${i + 1}`}
                            checked={isSelected}
                            onChange={() => toggleRow(row)}
                          />
                        ) : (
                          <input
                            type="checkbox"
                            aria-label={`Select row ${i + 1}`}
                            checked={isSelected}
                            onChange={() => toggleRow(row)}
                          />
                        )}
                      </td>
                    )}
                    {columns.map((col) => (
                      <td key={col.key} className="px-4 py-2 text-gray-800 dark:text-gray-200">
                        {String((row as any)[col.dataIndex] ?? '')}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Page {currentPage} of {totalPages}
        </span>
        <div className="space-x-2">
          <button
            className="rounded border px-3 py-1 text-sm disabled:opacity-50 dark:border-gray-600"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <button
            className="rounded border px-3 py-1 text-sm disabled:opacity-50 dark:border-gray-600"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default DataTable;
