import LandingNavbar from '../components/LandingNavbar.jsx'
import Hero from '../components/Hero.jsx'
import Features from '../components/Features.jsx'
import About from '../components/About.jsx'
import Why from '../components/Why.jsx'
import Footer from '../components/Footer.jsx'
import '../styles/landing.css'

export default function Landing() {
  return (
    <div className="landing">
      <LandingNavbar />
      <Hero />
      <Features />
      <About />
      <Why />
      <Footer />
    </div>
  )
}