import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { EditorPreview } from "@/components/landing/editor-preview";
import { Features } from "@/components/landing/features";
import { Footer } from "@/components/landing/footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans antialiased">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <EditorPreview />
        <Features />
      </main>
      <Footer />
    </div>
  );
}
