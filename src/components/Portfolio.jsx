import { useCallback, useEffect, useState } from 'react';
import { MotionConfig } from 'motion/react';
import { LanguageProvider } from '../context/LanguageContext';
import { useLanguage } from '../context/languageStore';
import Navbar from './Navbar.jsx';
import Hero from './Hero.jsx';
import { CurvedGalleryHero } from './Gallery.jsx';
import Services from './Services.jsx';
import Projects from './Projects.jsx';
import Experience from './Experience.jsx';
import ContactBanner from './ContactBanner.jsx';
import Footer from './Footer.jsx';
import Preloader from './Preloader.jsx';
import { getGalleryImages } from '../services/galleryService.js';
import '../App.css';

const MAX_GALLERY_IMAGES = 16;

function PortfolioContent() {
  const { lang } = useLanguage();
  const [isLoaded, setIsLoaded] = useState(false);

  // Gallery data lives here so Portfolio owns the fetch
  // and passes images down as props to CurvedGalleryHero
  const [galleryItems,  setGalleryItems]  = useState([]);
  const [galleryStatus, setGalleryStatus] = useState('loading');

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  // Fetch gallery images once on mount
  useEffect(() => {
    let cancelled = false;
    setGalleryStatus('loading');

    getGalleryImages()
      .then((imgs) => {
        if (cancelled) return;
        setGalleryItems(imgs.slice(0, MAX_GALLERY_IMAGES));
        setGalleryStatus('ready');
      })
      .catch(() => {
        if (!cancelled) setGalleryStatus('error');
      });

    return () => { cancelled = true; };
  }, []);

  const handlePreloaderComplete = useCallback(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="site-shell">
      <Preloader onComplete={handlePreloaderComplete} />
      <Navbar />
      <main>
        <Hero shouldAnimate={isLoaded} />
        {/* Images fetched above, passed as props */}
        <CurvedGalleryHero items={galleryItems} status={galleryStatus} />
        <Services />
        <Projects />
        <Experience />
        <ContactBanner />
      </main>
      <Footer />
    </div>
  );
}

export default function PortfolioPage() {
  return (
    <LanguageProvider>
      <MotionConfig reducedMotion="user">
        <PortfolioContent />
      </MotionConfig>
    </LanguageProvider>
  );
}
