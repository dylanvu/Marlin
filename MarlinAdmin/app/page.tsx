"use client";
import { LandingPageComponent } from "@/components/landing-page";
import { useEffect } from "react";
import LocomotiveScroll from "locomotive-scroll";

export default function Home() {
  useEffect(() => {
    const locoScroll = new LocomotiveScroll({});

    return () => {
      if (locoScroll) locoScroll.destroy();
    };
  }, []);

  return <LandingPageComponent />;
}
