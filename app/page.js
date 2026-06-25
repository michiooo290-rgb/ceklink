import FloatingHeader from "../components/FloatingHeader";
import Hero from "../components/Hero";
import URLScanner from "../components/URLScanner";
import StatsBar from "../components/StatsBar";
import Features from "../components/Features";
import PhishingDB from "../components/PhishingDB";
import Education from "../components/Education";
import APISection from "../components/APISection";
import CTA from "../components/CTA";
import Footer from "../components/Footer";
import AnimatedAIChat from "../components/AnimatedAIChat";

export default function Home() {
  return (
    <>
      <FloatingHeader />
      <main>
        <Hero />
        <URLScanner />
        <StatsBar />
        <div className="section-divider" />
        <Features />
        <div className="section-divider" />
        <PhishingDB />
        <div className="section-divider" />
        <Education />
        <div className="section-divider" />
        <APISection />
        <CTA />
      </main>
      <Footer />
      <AnimatedAIChat />
    </>
  );
}
