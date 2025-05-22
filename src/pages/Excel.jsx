import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import axios from "axios";
import { useState } from "react";
import * as XLSX from "xlsx";

export default function AudioPage() {
  const [data, setData] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const arrayBuffer = e.target.result;
      const workbook = XLSX.read(arrayBuffer, { type: "array" });

      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      setData(jsonData);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleUpload = async () => {
    try {
      const response = await axios.post("/api/upload-json", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Upload successful:", response.data);
    } catch (error) {
      console.error("Error uploading JSON:", error);
    }
  };

  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hidden md:block">
            <BreadcrumbLink href="#">Youtube Shorts Generator</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="hidden md:block" />
          <BreadcrumbItem>
            <BreadcrumbPage>Audio Generator</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="py-4">
        <div>
          <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
          {data.length && (
            <button
              className="bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
              onClick={handleUpload}
            >
              Upload
            </button>
          )}
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      </div>
    </>
  );
}
