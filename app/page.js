import FloatingHeader from "../components/FloatingHeader";
import MeshBackground from "../components/MeshBackground";
import DemoTilt from "../components/DemoTilt";
import Hero from "../components/Hero";
import ScrollShowcase from "../components/ScrollShowcase";
import URLScanner from "../components/URLScanner";
import FileScanner from "../components/FileScanner";
import HowItWorks from "../components/HowItWorks";
import DataSources from "../components/DataSources";
import PhishingDB from "../components/PhishingDB";
import Education from "../components/Education";
import FAQ from "../components/FAQ";
import CTA from "../components/CTA";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <MeshBackground variant="cool" intensity="medium" />
      <DemoTilt />
      <FloatingHeader />
      <main>
        <Hero />
        <ScrollShowcase />
        <URLScanner />
        <div className="section-divider" />
        <FileScanner />
        <div className="section-divider" />
        <HowItWorks />
        <div className="section-divider" />
        <DataSources />
        <div className="section-divider" />
        <PhishingDB />
        <div className="section-divider" />
        <Education />
        <div className="section-divider" />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
