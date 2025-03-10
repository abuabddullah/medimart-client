"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { uploadPrescription } from "@/src/lib/actions/prescriptions";
import { FileText, Info, Loader2, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function UploadPrescriptionPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null);
  const [notes, setNotes] = useState("");
  const [fileError, setFileError] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Check file type
      if (!file.type.includes("image/") && file.type !== "application/pdf") {
        setFileError("Please upload an image or PDF file");
        return;
      }

      // Check file size (max 5MB এর বেশি হলে এরর দেখাবে)
      if (file.size > 5 * 1024 * 1024) {
        setFileError("File size should be less than 5MB");
        return;
      }

      setPrescriptionFile(file);
      setFileError("");

      // Create preview for images
      if (file.type.includes("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        // For PDFs, just show an icon
        setPreviewUrl(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!prescriptionFile) {
      setFileError("Please select a file to upload");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("prescription", prescriptionFile);

      if (notes) {
        formData.append("notes", notes);
      }

      const response = await uploadPrescription(formData);

      if (response.success) {
        toast({
          title: "Prescription uploaded",
          description: `Your prescription has been uploaded successfully. 
          We will contact you regarding this order`,
        });

        router.push("/profile");
      } else {
        toast({
          title: "Upload failed",
          description: response.message || "Failed to upload prescription",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error uploading prescription:", error);
      toast({
        title: "Upload failed",
        description: "An error occurred while uploading your prescription",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Upload Prescription</h1>

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Prescription Upload</CardTitle>
            <CardDescription>
              Upload your prescription to order prescription-only medicines
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4 flex items-start">
                <Info className="h-5 w-5 text-blue-500 mr-3 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-800">
                    Important Information
                  </p>
                  <ul className="text-sm text-blue-700 mt-2 list-disc pl-5 space-y-1">
                    <li>Upload a clear image or PDF of your prescription</li>
                    <li>Ensure the doctor's signature is visible</li>
                    <li>Prescription should be valid and not expired</li>
                    <li>
                      Our pharmacists will verify your prescription before
                      processing your order
                    </li>
                  </ul>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="prescription">Upload Prescription</Label>
                <Input
                  id="prescription"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
                {fileError && (
                  <p className="text-sm text-destructive mt-1">{fileError}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Accepted formats: JPG, PNG, PDF. Max size: 5MB
                </p>
              </div>

              {previewUrl && (
                <div className="border rounded-md overflow-hidden">
                  <img
                    src={previewUrl || "/placeholder.svg"}
                    alt="Prescription Preview"
                    className="max-h-64 mx-auto"
                  />
                </div>
              )}

              {prescriptionFile && !previewUrl && (
                <div className="border rounded-md p-4 flex items-center justify-center">
                  <FileText className="h-12 w-12 text-muted-foreground" />
                  <span className="ml-2 font-medium">
                    {prescriptionFile.name}
                  </span>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any additional information for the pharmacist"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Prescription
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
