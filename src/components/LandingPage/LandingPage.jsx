import Header from './Header'
import Hero from './Hero'
import TrustStrip from './TrustStrip'
import HowItWorks from './HowItWorks'
import FeatureGrid from './FeatureGrid'
import ProductShowcase from './ProductShowcase'
import UseCases from './UseCases'
import Benefits from './Benefits'
import Pricing from './Pricing'
import Testimonials from './Testimonials'
import FinalCTA from './FinalCTA'
import Footer from './Footer'
import './LandingPage.css'

export default function LandingPage() {
  return (
    <div className="landing-page">
      <Header />
      <main>
        <Hero />
        <TrustStrip />
        <HowItWorks />
        <FeatureGrid />
        <ProductShowcase />
        <UseCases />
        <Benefits />
        <Pricing />
        <Testimonials />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  )
}
