"use client";

import React, { useState, useCallback } from 'react';
import PdfUpload from '@/app/(main)/dashboard/_components/PdfUpload';
import ChatWindow from './_components/ChatWindow';
import { getAnswerFromPdf } from '@/lib/geminiService';
import { LogoIcon } from './_components/icons';

const Dashboard = () => {
    const [pdfText, setPdfText] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isProcessingPdf, setIsProcessingPdf] = useState(false);
    const [error, setError] = useState(null);
    const [fileName, setFileName] = useState(null);

    const handlePdfProcessed = (text, name) => {
        setPdfText(text);
        setFileName(name);
        setMessages([
            {
                id: 'initial-bot-message',
                text: `I've finished reading "${name}". What would you like to know?`,
                sender: 'bot'
            }
        ]);
        setError(null);
    };

    const handleSendMessage = useCallback(async (userMessage) => {
        if (!pdfText) {
            setError("PDF text is not available. Please upload a new document.");
            return;
        }

        const newUserMessage = { id: Date.now().toString(), text: userMessage, sender: 'user' };
        setMessages(prevMessages => [...prevMessages, newUserMessage]);
        setIsLoading(true);
        setError(null);

        try {
            const botResponseText = await getAnswerFromPdf(pdfText, userMessage);
            const newBotMessage = { id: (Date.now() + 1).toString(), text: botResponseText, sender: 'bot' };
            setMessages(prevMessages => [...prevMessages, newBotMessage]);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
            setError(`Sorry, I couldn't get an answer. ${errorMessage}`);
            const errorBotMessage = { id: (Date.now() + 1).toString(), text: "I'm having trouble connecting to my brain right now. Please try again in a moment.", sender: 'bot' };
            setMessages(prevMessages => [...prevMessages, errorBotMessage]);
        } finally {
            setIsLoading(false);
        }
    }, [pdfText]);

    const handleReset = () => {
        setPdfText(null);
        setFileName(null);
        setMessages([]);
        setIsLoading(false);
        setIsProcessingPdf(false);
        setError(null);
    };

    // Set PDF.js worker source
    if (typeof pdfjsLib !== 'undefined') {
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.3.136/pdf.worker.min.mjs`;
    }

    return (
        <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
            <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-center space-x-3">
                    <LogoIcon className="h-8 w-8 text-blue-500" />
                    <h1 className="text-xl font-bold text-gray-800 dark:text-white">PDF Chatbot</h1>
                </div>
                {pdfText && (
                    <button
                        onClick={handleReset}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                        Upload New PDF
                    </button>
                )}
            </header>

            <main className="flex-grow overflow-hidden">
                {pdfText ? (
                    <ChatWindow
                        messages={messages}
                        onSendMessage={handleSendMessage}
                        isLoading={isLoading}
                        fileName={fileName}
                    />
                ) : (
                    <PdfUpload
                        onPdfProcessed={handlePdfProcessed}
                        isProcessing={isProcessingPdf}
                        setIsProcessing={setIsProcessingPdf}
                        setError={setError}
                    />
                )}
                {error && (
                    <div className="absolute bottom-20 right-1/2 translate-x-1/2 md:bottom-5 md:right-5 md:translate-x-0 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg" role="alert">
                        <strong className="font-bold">Error: </strong>
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;