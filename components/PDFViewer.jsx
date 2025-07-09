import React from "react";

const PDFViewer = ({ pdf_url }) => {
    return (
        <iframe
            src={`https://docs.google.com/gview?url=${pdf_url}&embedded=true`}
            className="w-full h-full"
        ></iframe>
    );
};

export default PDFViewer;