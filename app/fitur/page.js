import FloatingHeader from "../../components/FloatingHeader";
import MeshBackground from "../../components/MeshBackground";
import Features from "../../components/Features";
import Limitations from "../../components/Limitations";
import Footer from "../../components/Footer";

export const metadata = {
  title: "Fitur & Batasan — Urlveil",
  description:
    "Fitur lengkap Urlveil dan batasan yang perlu kamu tahu sebelum mengandalkan hasil scan.",
};

export default function FiturPage() {
  return (
    <>
      <MeshBackground variant="cool" intensity="subtle" />
      <FloatingHeader />
      <main className="pt-28 sm:pt-32">
        <Features />
        <div className="section-divider" />
        <Limitations />
      </main>
      <Footer />
    </>
  );
}
