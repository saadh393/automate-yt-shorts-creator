import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import axios from "axios";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, UploadCloud } from "lucide-react";
import * as XLSX from "xlsx";

export default function AudioPage() {
  const [data, setData] = useState([]);
  const [tableHeaders, setTableHeaders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleFileUpload = (event) => {
    setSuccess(false);
    setError("");
    const file = event.target.files[0];
    if (!file) return;
    setLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const arrayBuffer = e.target.result;
        const workbook = XLSX.read(arrayBuffer, { type: "array" });
        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
        setData(jsonData);
        setTableHeaders(jsonData.length ? Object.keys(jsonData[0]) : []);
        setLoading(false);
        toast.success("Excel file loaded!");
      } catch (err) {
        setError("Failed to parse Excel file.");
        setLoading(false);
        toast.error("Failed to parse Excel file.");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleUpload = async () => {
    setUploading(true);
    setError("");
    setSuccess(false);
    try {
      const response = await axios.post("/api/upload-json", data, {
        headers: { "Content-Type": "application/json" },
      });
      setUploading(false);
      setSuccess(true);
      toast.success("Upload successful!");
    } catch (error) {
      setUploading(false);
      setError("Error uploading JSON.");
      toast.error("Error uploading JSON.");
    }
  };

  function handlePasteButton() {
    navigator.clipboard.readText().then((clipText) => {
      setError("");
      setSuccess(false);
      try {
        const workbook = XLSX.read(clipText, { type: "string" });
        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
        setData(jsonData);
        setTableHeaders(jsonData.length ? Object.keys(jsonData[0]) : []);
        toast.success("Excel data pasted!");
      } catch {
        setError("Clipboard does not contain valid Excel data.");
        toast.error("Clipboard does not contain valid Excel data.");
      }
    });
  }

  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink href="#">Reel Genix</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden md:block" />
          <BreadcrumbItem>
            <BreadcrumbPage>Process Excel File</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-1 tracking-tight flex items-center gap-2">
            <UploadCloud className="w-6 h-6 text-primary" />
            Excel to Table Uploader
          </h2>
          <p className="text-muted-foreground mb-4 text-base">
            Upload an Excel file (.xlsx, .xls) and preview its contents in a
            table. You can then upload the data as JSON.
          </p>
          <div className="flex gap-2 items-center mb-4">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="animate-spin w-4 h-4 mr-2" />
              ) : (
                <UploadCloud className="w-4 h-4 mr-2" />
              )}
              Upload Excel
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
          {error && (
            <div className="text-destructive text-xs mb-2">{error}</div>
          )}
          {success && (
            <div className="text-green-600 text-xs mb-2">
              Upload successful!
            </div>
          )}
        </div>
        {data.length > 0 && (
          <div className="bg-card/70 border rounded-lg shadow-sm p-4 mb-6 overflow-x-auto">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-lg text-primary">
                Excel Table Preview
              </h3>
              <Button
                variant="primary"
                size="sm"
                onClick={handleUpload}
                disabled={uploading}
              >
                {uploading ? (
                  <Loader2 className="animate-spin w-4 h-4 mr-2" />
                ) : (
                  <UploadCloud className="w-4 h-4 mr-2" />
                )}
                {uploading ? "Uploading..." : "Upload as JSON"}
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full border text-sm">
                <thead>
                  <tr>
                    {tableHeaders.map((header) => (
                      <th
                        key={header}
                        className="px-3 py-2 border-b bg-muted/40 text-left font-semibold"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, i) => (
                    <tr key={i} className="even:bg-muted/10">
                      {tableHeaders.map((header) => (
                        <td
                          key={header}
                          className="px-3 py-2 border-b whitespace-pre-wrap max-w-xs"
                        >
                          {row[header]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
