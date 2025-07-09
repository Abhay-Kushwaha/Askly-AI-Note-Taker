"use client";
import React from "react";
import Providers from "@/components/Providers";

const MainLayout = ({ children }) => {
  return (
    <Providers>
      <div className="container mx-auto mt-24 mb-20">
        {children}
      </div>
    </Providers>
  );
};

export default MainLayout;
