"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Globe, AlertTriangle, Lock } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";

const Scene = dynamic(() => import("@/components/Scene"), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="absolute w-full h-screen z-[-1]">
      <Scene />
    </main>
  );
}
export function LandingPageComponent() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center bg-indigo-100">
        <Link className="flex items-center justify-center" href="#">
          <img src="/Asset_10.png" alt="Marlin Logo" className="h-6 w-8" />
          <span className="ml-2 text-2xl font-bold text-primary">Marlin</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#features"
          >
            Features
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#how-it-works"
          >
            How It Works
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#pricing"
          >
            Pricing
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="/admin"
          >
            Admin Dashboard
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <Home></Home>
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-transparent">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl h-20 font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-white">
                  Protect Yourself from Phishing with Marlin
                </h1>
                <p className="mx-auto max-w-[700px] text-white md:text-xl">
                  Our Chrome extension uses advanced AI to detect and block
                  phishing attempts in real-time, keeping your personal
                  information safe.
                </p>
              </div>
              <div className="space-x-4">
                <Button variant="secondary" size="lg">
                  Install Extension
                </Button>
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section
          id="features"
          className="w-full py-12 md:py-24 lg:py-32 bg-background"
        >
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              Key Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <Globe className="h-8 w-8 mb-2 text-primary" />
                  <CardTitle>Real-Time Protection</CardTitle>
                </CardHeader>
                <CardContent>
                  Scans every webpage you visit for potential phishing threats
                  as you browse.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <AlertTriangle className="h-8 w-8 mb-2 text-primary" />
                  <CardTitle>Instant Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  Receive immediate notifications when a suspicious site is
                  detected.
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Lock className="h-8 w-8 mb-2 text-primary" />
                  <CardTitle>Data Privacy</CardTitle>
                </CardHeader>
                <CardContent>
                  Your browsing data stays private. We never collect or store
                  your personal information.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section
          id="how-it-works"
          className="w-full py-12 md:py-24 lg:py-32 bg-indigo-100"
        >
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">1. Install the Extension</h3>
                <p>Add Marlin to your Chrome browser with just one click.</p>
                <h3 className="text-2xl font-bold">2. Browse Securely</h3>
                <p>
                  Continue your normal browsing. Marlin works silently in the
                  background.
                </p>
                <h3 className="text-2xl font-bold">3. Stay Protected</h3>
                <p>
                  Receive instant alerts if you encounter a potential phishing
                  site.
                </p>
              </div>
              <div className="rounded-lg overflow-hidden shadow-xl">
                <img
                  src="/logo.png"
                  alt="Marlin in action"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>
        <section
          id="pricing"
          className="w-full py-12 md:py-24 lg:py-32 bg-background"
        >
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              Simple Pricing
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <Card>
                <CardHeader>
                  <CardTitle>Free</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">$0</p>
                  <p className="text-muted-foreground">per month</p>
                  <ul className="mt-4 space-y-2">
                    <li>Basic phishing protection</li>
                    <li>Real-time scanning</li>
                    <li>Instant alerts</li>
                  </ul>
                  <Button className="mt-6 w-full" variant="outline">
                    Get Started
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Premium</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">$4.99</p>
                  <p className="text-muted-foreground">per month</p>
                  <ul className="mt-4 space-y-2">
                    <li>Advanced AI-powered protection</li>
                    <li>Customizable security settings</li>
                    <li>24/7 email support</li>
                    <li>Regular threat database updates</li>
                  </ul>
                  <Button className="mt-6 w-full">Upgrade to Premium</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-primary">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
                Ready to Browse Safely?
              </h2>
              <p className="mx-auto max-w-[600px] text-white md:text-xl">
                Install Marlin now and take the first step towards a more secure
                online experience.
              </p>
              <Button variant="secondary" size="lg">
                Install Marlin
              </Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">
          © 2024 Marlin. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
