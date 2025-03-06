"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface PdfPreviewProps {
  dataUrl: string;
  onClose: () => void;
}

export function PdfPreview({ dataUrl, onClose }: PdfPreviewProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-full">
        <h2 className="h-fit absolute mt-1 text-center w-full">PDF Preview</h2>
        {/* <DialogHeader>
          <DialogTitle>PDF Preview</DialogTitle>
          <DialogDescription>
            Preview your generated PDF document
          </DialogDescription>
        </DialogHeader> */}
        <div className="flex-1 overflow-hidden mt-4">
          <iframe
            src={dataUrl}
            className="w-full h-full border rounded-md"
            title="PDF Preview"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
