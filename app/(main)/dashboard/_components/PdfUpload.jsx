"use client";

import React, { useCallback, useState } from 'react';
import { UploadIcon, LoaderIcon } from './icons';
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";

// Use CDN worker — safer in Next.js environment
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

const PdfUpload = ({ onPdfProcessed, isProcessing, setIsProcessing, setError }) => {
  const [dragActive, setDragActive] = useState(false);
  
  const extractTextFromPdf = useCallback(async (file) => {
    setError(null);
    if (!file || file.type !== 'application/pdf') {
      setError("Please select a valid PDF file.");
      return;
    }
    setIsProcessing(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;
      let fullText = '';

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item) => item.str).join(' ');
        fullText += pageText + '\n\n';
      }
      
      onPdfProcessed(fullText, file.name);
    } catch (error) {
      console.error("Error processing PDF:", error);
      setError("Failed to process the PDF. The file might be corrupted or unsupported.");
    } finally {
      setIsProcessing(false);
    }
  }, [onPdfProcessed, setIsProcessing, setError]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      extractTextFromPdf(e.target.files[0]);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      extractTextFromPdf(e.dataTransfer.files[0]);
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-center h-full p-2 md:p-4 rounded-lg bg-gray-50 dark:bg-gray-900">
      <div className="w-full text-center">
        <form className="w-full" onDragEnter={handleDrag} onSubmit={(e) => e.preventDefault()}>
          <label
            htmlFor="pdf-upload"
            className={`relative flex flex-col items-center justify-center w-full h-25 border-2 border-dashed rounded-xl cursor-pointer transition-colors
              ${dragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
          >
            {isProcessing ? (
              <div className="flex flex-col items-center">
                <LoaderIcon className="w-12 h-12 text-blue-500 animate-spin" />
                <span className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-200">Processing PDF...</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">This may take a moment for large documents.</span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-2">
                <UploadIcon className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"/>
                <p className="mb-2 mx-4 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">PDF (MAX. 50MB)</p>
              </div>
            )}
            <input
              id="pdf-upload"
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept=".pdf"
              disabled={isProcessing}
            />
          </label>
           {dragActive && <div className="absolute inset-0 w-full h-full" onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}></div>}
        </form>
      </div>
    </div>
  );
};

export default PdfUpload;
