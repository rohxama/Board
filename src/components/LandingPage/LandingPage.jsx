import Header from './Header'
import Hero from './Hero'
import HowItWorks from './HowItWorks'
import FeatureGrid from './FeatureGrid'
import ProductShowcase from './ProductShowcase'
import UseCases from './UseCases'
import Benefits from './Benefits'
import FinalCTA from './FinalCTA'
import Footer from './Footer'
import './LandingPage.css'

export default function LandingPage() {
  return (
    <div className="landing-page">
      <Header />
      <main>
        <Hero />
        <ProductShowcase />
        <FeatureGrid />
        <HowItWorks />
        <UseCases />
        <Benefits />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  )
}
