// components/PDFViewer.jsx
"use client";
import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PDFViewer = ({ pdf_url }) => {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    return (
        <div className="flex flex-col items-center">
            <Document
                file={pdf_url}
                onLoadSuccess={onDocumentLoadSuccess}
                className="max-w-full"
            >
                <Page
                    pageNumber={pageNumber}
                    renderTextLayer={false}
                    scale={1.5}
                />
            </Document>
            <div className="mt-4 flex gap-4 items-center">
                <button
                    disabled={pageNumber <= 1}
                    onClick={() => setPageNumber(pageNumber - 1)}
                    className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                >
                    Previous
                </button>
                <p>
                    Page {pageNumber} of {numPages}
                </p>
                <button
                    disabled={pageNumber >= numPages}
                    onClick={() => setPageNumber(pageNumber + 1)}
                    className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default PDFViewer;