import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { DataTable } from "@/data/products";
import { bidi, isLtr } from "@/lib/bidi";
import { cn } from "@/lib/utils";

/**
 * A catalog table. When the first header is "مشخصه" (property) the first column acts as the row header.
 * Wide tables scroll sideways on phones instead of squeezing the numbers.
 */
export function DataTableView({ table, subject }: { table: DataTable; subject: string }) {
  const rowHeaders = table.head[0] === "مشخصه";
  return (
    <figure>
      <div className="overflow-hidden rounded-[1.6rem] border border-ink/10 bg-card">
        <Table className={cn(table.head.length > 3 && "min-w-[34rem]")}>
          <TableCaption className="sr-only">
            {table.title}؛ {subject}
          </TableCaption>
          <TableHeader>
            <TableRow className="border-ink/10 bg-paper-deep/60 hover:bg-paper-deep/60">
              {table.head.map((h) => (
                <TableHead key={h} scope="col" className="h-auto px-4 py-3 font-black text-ink sm:px-5">
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {table.rows.map((row) => (
              <TableRow key={row.join("|")} className="border-ink/8">
                {row.map((cell, i) =>
                  rowHeaders && i === 0 ? (
                    <TableHead key={i} scope="row" className="min-w-[8.5rem] bg-paper-deep/40 px-4 py-3.5 font-bold whitespace-normal text-ink sm:px-5">
                      {bidi(cell)}
                    </TableHead>
                  ) : (
                    <TableCell
                      key={i}
                      dir={isLtr(cell) ? "ltr" : undefined}
                      className={cn("px-4 py-3.5 whitespace-normal sm:px-5", isLtr(cell) && "text-right")}
                    >
                      {isLtr(cell) ? cell : bidi(cell)}
                    </TableCell>
                  ),
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {table.note && <figcaption className="mt-3 px-2 text-sm leading-7 text-muted-foreground">{table.note}</figcaption>}
    </figure>
  );
}
