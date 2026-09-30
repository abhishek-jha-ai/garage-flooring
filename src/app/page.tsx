import { BeforeAfter } from "@/components/BeforeAfter";
import { EstimateProvider } from "@/components/EstimateContext";
import { EstimateWizard } from "@/components/EstimateWizard";
import { FinishExplorer } from "@/components/FinishExplorer";
import { FinalCTA, Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { ProjectExplorer } from "@/components/ProjectExplorer";
import { ProjectGallery } from "@/components/ProjectGallery";
import { StickyCTA } from "@/components/StickyCTA";
import { Testimonials } from "@/components/Testimonials";
import { ThirdPartyScripts } from "@/components/ThirdPartyScripts";
import { TrustBar } from "@/components/TrustBar";
import { WhyTitan } from "@/components/WhyTitan";

export default function Home() {
  return (
    <EstimateProvider>
      <Header />
      <main>
        <Hero />
        <TrustBar />
        <ProjectExplorer />
        <BeforeAfter />
        <FinishExplorer />
        <ProjectGallery />
        <WhyTitan />
        <Testimonials />
        <FinalCTA />
      </main>
      <Footer />
      <StickyCTA />
      <EstimateWizard />
      <ThirdPartyScripts />
    </EstimateProvider>
  );
}
