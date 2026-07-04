import FloatingHeader from "../components/FloatingHeader";
import MeshBackground from "../components/MeshBackground";
import DemoTilt from "../components/DemoTilt";
import Hero from "../components/Hero";
import URLScanner from "../components/URLScanner";
import Features from "../components/Features";
import PhishingDB from "../components/PhishingDB";
import PhishingCases from "../components/PhishingCases";
import Education from "../components/Education";
import HowItWorks from "../components/HowItWorks";
import CTA from "../components/CTA";
import Footer from "../components/Footer";
import DataSources from "../components/DataSources";
import Limitations from "../components/Limitations";
import FAQ from "../components/FAQ";

export default function Home() {
  return (
    <>
      <MeshBackground variant="cool" intensity="medium" />
      <DemoTilt />
      <FloatingHeader />
      <main>
        <Hero />
        <URLScanner />
        <DataSources />
        <div className="section-divider" />
        <HowItWorks />
        <div className="section-divider" />
        <Features />
        <div className="section-divider" />
        <PhishingDB />
        <div className="section-divider" />
        <PhishingCases />
        <div className="section-divider" />
        <Education />
        <div className="section-divider" />
        <Limitations />
        <div className="section-divider" />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
