"use client";

import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

const HeroSection = () => {
  const imageRef = useRef(null);

  useEffect(() => {
    const imageElement = imageRef.current;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;

      if (scrollPosition > scrollThreshold && imageElement) {
        imageElement.classList.add("scrolled");
      } else if (imageElement) {
        imageElement.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="w-full pt-24 md:pt-36 pb-10">
      <div className="container mx-auto px-6 md:px-12 flex flex-col-reverse md:flex-row items-center justify-between">
        {/* Left Content */}
        <div className="md:w-1/2 space-y-10 text-center md:text-left md:pl-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight leading-tight bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg">
            Unlock Knowledge from Notes
            <br />
            with AI-Powered Insights
          </h1>
          <p className="max-w-[600px] text-muted-foreground md:text-lg mx-auto md:mx-0">
            Upload your PDFs and let Askly summarize key points, answer your questions,
            and quiz you for better retention—personalized learning made simple.
          </p>
          <div className="flex justify-center md:justify-start space-x-4">
            <Link href="/dashboard">
              <Button size="lg" className="px-8">
                Get Started
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Image */}
        <div className="md:w-1/2 mb-10 md:mb-0 flex justify-center" ref={imageRef}>
          <Image
            src="/hero img.png"
            alt="Hero Image"
            width={500}
            height={500}
            className="w-full max-w-[400px] h-auto rounded-lg"
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
