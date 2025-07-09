"use client";
import React, { useRef } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const Providers = ({ children }) => {
    const queryClientRef = useRef();
    if (!queryClientRef.current) {
        queryClientRef.current = new QueryClient();
    }
    return (
        <QueryClientProvider client={queryClientRef.current}>
            {children}
        </QueryClientProvider>
    );
};

export default Providers;