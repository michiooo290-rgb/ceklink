import FloatingHeader from "../components/FloatingHeader";
import MeshBackground from "../components/MeshBackground";
import AuroraBackground from "../components/AuroraBackground";
import DemoTilt from "../components/DemoTilt";
import Hero from "../components/Hero";
import ScrollShowcase from "../components/ScrollShowcase";
import ScannerTabs from "../components/ScannerTabs";
import BentoFeatures from "../components/BentoFeatures";
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
      <AuroraBackground />
      <MeshBackground variant="cool" intensity="medium" />
      <DemoTilt />
      <FloatingHeader />
      <main>
        <Hero />
        <ScrollShowcase />
        <ScannerTabs />
        <div className="section-divider" />
        <BentoFeatures />
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
