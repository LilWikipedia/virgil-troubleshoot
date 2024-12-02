import { useState } from "react";
import { Upload } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

export const FileUpload = () => {
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    // For now, just show a toast with the file names
    toast({
      title: "Files received",
      description: `Uploaded: ${files.map(f => f.name).join(", ")}`,
    });
  };

  return (
    <Card
      className={`p-8 border-2 border-dashed transition-colors ${
        isDragging ? "border-primary bg-primary/5" : "border-border"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center gap-4">
        <Upload className="w-12 h-12 text-primary" />
        <div className="text-center">
          <h3 className="text-lg font-semibold">Upload NDT Data</h3>
          <p className="text-sm text-muted-foreground">
            Drag and drop your files here or click to browse
          </p>
        </div>
        <input
          type="file"
          multiple
          className="hidden"
          id="file-upload"
          onChange={handleFileInput}
        />
        <label
          htmlFor="file-upload"
          className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md cursor-pointer hover:bg-primary/90 transition-colors"
        >
          Select Files
        </label>
      </div>
    </Card>
  );
};