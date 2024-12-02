import { useState } from "react";
import { Upload } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const FileUpload = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
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

  const handleFiles = async (files: File[]) => {
    setIsUploading(true);
    try {
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const filePath = `${crypto.randomUUID()}.${fileExt}`;

        // Upload file to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('ndt_data')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Store file metadata in the database
        const { error: dbError } = await supabase
          .from('ndt_files')
          .insert({
            filename: file.name,
            file_path: filePath,
            content_type: file.type,
            size: file.size,
          });

        if (dbError) throw dbError;

        toast({
          title: "Success",
          description: `File ${file.name} uploaded successfully`,
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: "Failed to upload file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
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
        <Upload className={`w-12 h-12 text-primary ${isUploading ? 'animate-bounce' : ''}`} />
        <div className="text-center">
          <h3 className="text-lg font-semibold">Upload NDT Data</h3>
          <p className="text-sm text-muted-foreground">
            {isUploading ? 'Uploading...' : 'Drag and drop your files here or click to browse'}
          </p>
        </div>
        <input
          type="file"
          multiple
          className="hidden"
          id="file-upload"
          onChange={handleFileInput}
          disabled={isUploading}
        />
        <label
          htmlFor="file-upload"
          className={`px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md cursor-pointer hover:bg-primary/90 transition-colors ${
            isUploading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Select Files
        </label>
      </div>
    </Card>
  );
};