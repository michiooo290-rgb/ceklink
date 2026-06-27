import FloatingHeader from "../components/FloatingHeader";
import Hero from "../components/Hero";
import URLScanner from "../components/URLScanner";
import Features from "../components/Features";
import PhishingDB from "../components/PhishingDB";
import Education from "../components/Education";
import HowItWorks from "../components/HowItWorks";
import CTA from "../components/CTA";
import Footer from "../components/Footer";
import DataSources from "../components/DataSources";

export default function Home() {
  return (
    <>
      <FloatingHeader />
      <main>
        <Hero />
        <URLScanner />
        <DataSources />
        <div className="section-divider" />
        <Features />
        <div className="section-divider" />
        <PhishingDB />
        <div className="section-divider" />
        <Education />
        <div className="section-divider" />
        <HowItWorks />
        <CTA />
      </main>
      <Footer />
    </>
  );
}