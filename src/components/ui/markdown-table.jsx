import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2 } from "lucide-react";
import * as XLSX from "xlsx";
import axios from "axios";
import { Loader, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";

export function MarkdownTable({ table, wrap = false, onChange }) {
  const [editIdx, setEditIdx] = useState(null);
  const [editRow, setEditRow] = useState([]);
  const [expandedCells, setExpandedCells] = useState({}); // {"row-col": true}
  const [downloading, setDownloading] = useState(false);
  const [importing, setImporting] = useState(false);

  function handleEdit(idx) {
    setEditIdx(idx);
    setEditRow([...table.rows[idx]]);
  }
  function handleEditChange(i, val) {
    setEditRow((row) => {
      const copy = [...row];
      copy[i] = val;
      return copy;
    });
  }
  function handleEditSave() {
    if (onChange) {
      const newRows = table.rows.map((row, i) => (i === editIdx ? editRow : row));
      onChange({ ...table, rows: newRows });
    }
    setEditIdx(null);
    setEditRow([]);
  }
  function handleDelete(idx) {
    if (onChange) {
      const newRows = table.rows.filter((_, i) => i !== idx);
      onChange({ ...table, rows: newRows });
    }
  }
  function toggleCellExpand(rowIdx, colIdx) {
    setExpandedCells((prev) => {
      const key = `${rowIdx}-${colIdx}`;
      return { ...prev, [key]: !prev[key] };
    });
  }

  async function handleDownload() {
    setDownloading(true);
    try {
      // Convert table to worksheet
      const wsData = [table.headers, ...table.rows];
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const blob = new Blob([wbout], { type: "application/octet-stream" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "table.xlsx";
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 100);
      toast.success("Excel file downloaded successfully!");
    } catch (err) {
      toast.error("Failed to download Excel file.");
    } finally {
      setDownloading(false);
    }
  }

  async function handleImport() {
    setImporting(true);
    try {
      const jsonRows = table.rows.map((row) => {
        const obj = {};
        table.headers.forEach((h, i) => (obj[h] = row[i]));
        return obj;
      });
      await axios.post("/api/upload-json", jsonRows, {
        headers: { "Content-Type": "application/json" },
      });
      toast.success("Table imported to server successfully!");
    } catch (err) {
      toast.error("Failed to import table to server.");
    } finally {
      setImporting(false);
    }
  }

  if (!table || !table.headers || !table.rows) return null;
  return (
    <div className="overflow-x-auto rounded-lg border border-muted bg-card shadow-sm my-6">
      <div className="flex gap-2 mb-4">
        <Button onClick={handleDownload} disabled={downloading} variant="secondary">
          {downloading ? <Loader className="animate-spin w-4 h-4" /> : "Download"}
        </Button>
        <Button onClick={handleImport} disabled={importing} variant="default">
          {importing ? <Loader className="animate-spin w-4 h-4" /> : "Import"}
        </Button>
      </div>
      <table className="min-w-full divide-y divide-muted-foreground text-sm">
        <thead className="bg-muted">
          <tr>
            {table.headers.map((header, idx) => (
              <th
                key={idx}
                className="px-4 py-2 text-left font-semibold text-foreground whitespace-nowrap"
              >
                {header}
              </th>
            ))}
            <th className="px-2 py-2 text-left font-semibold text-foreground whitespace-nowrap">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-muted">
          {table.rows.map((row, i) => (
            <tr key={i} className="hover:bg-muted/50">
              {row.map((cell, j) => {
                const key = `${i}-${j}`;
                const isLong = typeof cell === "string" && cell.length > 20;
                const expanded = expandedCells[key];
                return (
                  <td
                    key={j}
                    className={
                      "px-4 py-2 " +
                      (wrap
                        ? "whitespace-pre-line break-words align-top"
                        : "whitespace-nowrap")
                    }
                  >
                    { !isLong ? (
                      cell
                    ) : (
                      <span
                        className="cursor-pointer select-text"
                        onClick={() => toggleCellExpand(i, j)}
                      >
                        {expanded
                          ? cell + " "
                          : cell.slice(0, 20) + (cell.length > 20 ? "... " : "")}
                        {cell.length > 20 && (
                          <span className="text-zinc-300/80  ml-1">
                            {expanded ? "Show less" : "Show more"}
                          </span>
                        )}
                      </span>
                    )}
                  </td>
                );
              })}
              <td className="px-2 py-2 min-w-[80px] flex gap-2">
                <Sheet open={editIdx === i} onOpenChange={(open) => !open && setEditIdx(null)}>
                  <SheetTrigger asChild>
                    <Button size="icon" variant="outline" onClick={() => handleEdit(i)} title="Edit Row">
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="max-w-md w-full">
                    <SheetHeader>
                      <SheetTitle>Edit Row</SheetTitle>
                    </SheetHeader>
                    <form
                      className="flex flex-col gap-4 py-4"
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleEditSave();
                      }}
                    >
                      {table.headers.map((header, j) => (
                        <div key={j} className="flex flex-col gap-1">
                          <Label>{header}</Label>
                          <Input
                            value={editRow[j] ?? ""}
                            onChange={(e) => handleEditChange(j, e.target.value)}
                            className="text-sm"
                          />
                        </div>
                      ))}
                      <SheetFooter>
                        <Button type="submit" variant="primary">
                          Save
                        </Button>
                        <SheetClose asChild>
                          <Button type="button" variant="outline">
                            Cancel
                          </Button>
                        </SheetClose>
                      </SheetFooter>
                    </form>
                  </SheetContent>
                </Sheet>
                <Button size="icon" variant="destructive" onClick={() => handleDelete(i)} title="Delete Row">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
