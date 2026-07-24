import Link from "next/link";
import { Eye, Pencil, Trash2 } from "lucide-react";
import type { ReactNode } from "react";

export type TableColumn<T> = {
  key: keyof T;
  label: string;
  className?: string;
};

type DataTableProps<T extends { id: string | number }> = {
  columns: TableColumn<T>[];
  data: T[];

  renderCell?: Partial<
    Record<
      keyof T,
      (value: T[keyof T], row: T) => ReactNode
    >
  >;

  renderActions?: (row: T) => ReactNode;

  viewHref?: (row: T) => string;
  editHref?: (row: T) => string;

  onDelete?: (row: T) => void;

  emptyMessage?: string;
};

export default function DataTable<
  T extends { id: string | number },
>({
  columns,
  data,
  renderCell,
  renderActions,
  viewHref,
  editHref,
  onDelete,
  emptyMessage = "No data available.",
}: DataTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
      <table className="w-full border-collapse">
        <thead className="bg-white/[0.04]">
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-white/40 ${column.className ?? ""}`}
              >
                {column.label}
              </th>
            ))}

            <th className="w-[180px] px-6 py-4 text-right text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + 1}
                className="px-6 py-20 text-center text-white/35"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={row.id}
                className="border-t border-white/5 transition-colors hover:bg-white/[0.03]"
              >
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className="px-6 py-5 text-sm text-white/85"
                  >
                    {renderCell?.[column.key]
                      ? renderCell[column.key]!(
                          row[column.key],
                          row,
                        )
                      : String(row[column.key] ?? "")}
                  </td>
                ))}

                <td className="px-6 py-5">
                  {renderActions ? (
                    <div className="flex justify-end gap-2">
                      {renderActions(row)}
                    </div>
                  ) : (
                    <div className="flex justify-end gap-2">
                      {viewHref && (
                        <Link
                          href={viewHref(row)}
                          className="rounded-xl border border-white/10 p-2 text-white/55 transition hover:bg-white/[0.05] hover:text-white"
                        >
                          <Eye size={17} />
                        </Link>
                      )}

                      {editHref && (
                        <Link
                          href={editHref(row)}
                          className="rounded-xl border border-cyan-400/20 p-2 text-cyan-300 transition hover:bg-cyan-400/10"
                        >
                          <Pencil size={17} />
                        </Link>
                      )}

                      {onDelete && (
                        <button
                          type="button"
                          onClick={() => onDelete(row)}
                          className="rounded-xl border border-red-400/20 p-2 text-red-300 transition hover:bg-red-400/10"
                        >
                          <Trash2 size={17} />
                        </button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}