import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { WorstNav } from './components/WorstNav';
import { MarqueeBanner } from './components/MarqueeBanner';
import { FrustrationDashboard } from './components/FrustrationDashboard';
import { WorstForm } from './components/WorstForm';
import { PopUpSwarm } from './components/PopUpSwarm';
import { ChaosControls } from './components/ChaosControls';
import { CookieNightmareModal } from './components/CookieNightmareModal';
import { GuinnessCertificate } from './components/GuinnessCertificate';
import { FakeCaptchaModal } from './components/FakeCaptchaModal';
import { LowBatteryModal } from './components/LowBatteryModal';
import { InactivityModal } from './components/InactivityModal';
import { WorstStore } from './pages/WorstStore';
import { WorstSupport } from './pages/WorstSupport';
import { WorstUnsubscribe } from './pages/WorstUnsubscribe';
import { WorstRecords } from './pages/WorstRecords';
import { WorstPinterest } from './pages/WorstPinterest';
import { ThreeDisasterCanvas } from './components/ThreeDisasterCanvas';
import { MotionDisasterSuite } from './components/MotionDisasterSuite';
import { NextJsDisasterPanel } from './components/NextJsDisasterPanel';
import { ConfusingCursor } from './components/ConfusingCursor';
import { ReactThreeFiberDisaster } from './components/ReactThreeFiberDisaster';
import { ReactSpringPhysicsLab } from './components/ReactSpringPhysicsLab';
import { LottieDisasterStudio } from './components/LottieDisasterStudio';
import { InteractiveParticleVortex } from './components/InteractiveParticleVortex';
import { useHeaderScramble } from './hooks/useHeaderScramble';
import { useGsapScrollTrigger } from './hooks/useGsapScrollTrigger';
import { PopupAd, FrustrationStats, PageType } from './types';
import { playSound, playHorrorSound } from './utils/audioSynth';
import { LoadingScreen } from './components/LoadingScreen';
import { HybridTerminal } from './components/HybridTerminal';
import { CanvasEnginesTriad } from './components/CanvasEnginesTriad';
import { MagicArcaneStudio } from './components/MagicArcaneStudio';
import { MobileAppNav } from './components/MobileAppNav';
import { BanglaEnglishWarningModal } from './components/BanglaEnglishWarningModal';
import { FeedbackReviewModal, TARGET_GMAIL } from './components/FeedbackReviewModal';
import { GamificationCenter, Achievement, getLevelInfo } from './components/GamificationCenter';
import { HorrorSoundPad } from './components/HorrorSoundPad';
import { BangladeshViralNews } from './components/BangladeshViralNews';
import { GamificationShowcaseSection } from './components/GamificationShowcaseSection';
import { GamificationFloatingHud } from './components/GamificationFloatingHud';
import { LiveUserCounter } from './components/LiveUserCounter';
import { MultiUserCursors } from './components/MultiUserCursors';
import { HalftoneStudio } from './components/HalftoneStudio';
import { presenceManager } from './utils/presenceClient';
import { PolyglotChaosLab } from './components/PolyglotChaosLab';
import { BrowserTortureKit } from './components/BrowserTortureKit';
import { Exhibit } from './components/museum/Exhibit';
import { MuseumHero } from './components/museum/MuseumHero';
import { MuseumFooter } from './components/museum/MuseumFooter';
import { useMuseumMotion } from './hooks/useMuseumMotion';

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-warning',
    title: 'Warning Defier',
    titleBn: 'সতর্কবার্তা অগ্রাহ্যকারী',
    desc: 'Braved the bilingual Bangla/English hostile website warning.',
    descBn: 'বাংলা ও ইংরেজি চরম সতর্কবার্তা পড়েও সাইটে ঢুকেছেন।',
    icon: '⚠️',
    xpReward: 30,
    isUnlocked: true,
  },
  {
    id: 'ach-horror',
    title: '24-Bit Horror Survivor',
    titleBn: '২৪-বিট হরর সারভাইভার',
    desc: 'Endured acoustic terror from the 24-bit sound lab.',
    descBn: '২৪-বিট সাইকোঅ্যাকোস্টিক হরর সাউন্ড ট্রাই করে বেঁচে ফিরেছেন।',
    icon: '👻',
    xpReward: 35,
    isUnlocked: false,
  },
  {
    id: 'ach-viral',
    title: 'BD Viral Connoisseur',
    titleBn: 'বাংলাদেশি ভাইরাল বিশেষজ্ঞ',
    desc: 'Explored Bangladesh viral news, kacchi biryani war, and reacted to satire.',
    descBn: 'বাংলাদেশি ভাইরাল নিউজ, কাচ্চির রণক্ষেত্র ও পদ্মা সেতুর সেলফি গ্যাং এক্সপ্লোর করেছেন।',
    icon: '🇧🇩',
    xpReward: 40,
    isUnlocked: false,
  },
  {
    id: 'ach-rabbu-mail',
    title: 'Direct Line to Rabbu',
    titleBn: 'রাব্বুর ইনবক্স দূত',
    desc: 'Sent an honest opinion directly to the creator official inbox.',
    descBn: 'সরাসরি ক্রিয়েটরের অফিসিয়াল ইনবক্সে নিজের মতামত বা ক্ষোভ পাঠিয়েছেন।',
    icon: '✉️',
    xpReward: 50,
    isUnlocked: false,
  },
  {
    id: 'ach-terminal',
    title: 'Kernel Cyber Wizard',
    titleBn: 'টার্মিনাল সাইবার জাদুকর',
    desc: 'Executed commands in the hostile bash hybrid terminal.',
    descBn: 'টার্মিনালে শেল কমান্ড চালিয়ে ওয়েবসাইট হ্যাক করেছেন।',
    icon: '💻',
    xpReward: 25,
    isUnlocked: false,
  },
  {
    id: 'ach-feedback',
    title: 'Critic of the Year',
    titleBn: 'বছরের সেরা সমালোচক',
    desc: 'Submitted an official review or feature request.',
    descBn: 'ফালতু ওয়েবসাইট নিয়ে মতামত বা নতুন ফিচার রিকোয়েস্ট দিয়েছেন।',
    icon: '⭐',
    xpReward: 50,
    isUnlocked: false,
  },
  {
    id: 'ach-canvas',
    title: 'Canvas Triad Master',
    titleBn: 'ক্যানভাস ট্রায়াড মাস্টার',
    desc: 'Inspected 2,500 PixiJS thoughts, Konva, and Fabric.',
    descBn: 'পিক্সি জেএস ও কোনভা ক্যানভাস আর্ট এক্সপ্লোর করেছেন।',
    icon: '🎨',
    xpReward: 40,
    isUnlocked: false,
  },
  {
    id: 'ach-halftone',
    title: 'Halftone Matrix Pioneer',
    titleBn: 'হাফটোন ডট রূপকার',
    desc: 'Generated custom halftone dotted or retro cinematic art with Python engine.',
    descBn: 'পাইথন ইঞ্জিন দিয়ে হাফটোন ডটেড বা রেট্রো সিনেমাটিক আর্ট তৈরি করেছেন।',
    icon: '🖼️',
    xpReward: 40,
    isUnlocked: false,
  },
  {
    id: 'ach-chaos',
    title: 'Entropy Overlord',
    titleBn: 'বিশৃঙ্খলার সম্রাট',
    desc: 'Engaged the 30% Chaos Inversion engine.',
    descBn: '৩০% ক্যাওস ইনভার্সন ইঞ্জিন চালিয়ে বাস্তবতা উল্টে দিয়েছেন।',
    icon: '🌀',
    xpReward: 30,
    isUnlocked: false,
  },
];

export default function App() {
  // Initial Boot Loading Screen
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Navigation
  const [currentPage, setCurrentPage] = useState<PageType>('home');

  // Warning Modal, Feedback/Review Modal, Gamification, Horror Sound
  const [showWarningModal, setShowWarningModal] = useState<boolean>(true);
  const [showFeedbackModal, setShowFeedbackModal] = useState<boolean>(false);
  const [showGamificationModal, setShowGamificationModal] = useState<boolean>(false);
  const [warningToast, setWarningToast] = useState<string | null>(null);

  // Gamification XP & Achievements State with local persistence
  const [xp, setXp] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('guinness_user_xp');
      return saved ? parseInt(saved, 10) : 120;
    } catch {
      return 120;
    }
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    try {
      const saved = localStorage.getItem('guinness_user_achievements');
      return saved ? JSON.parse(saved) : INITIAL_ACHIEVEMENTS;
    } catch {
      return INITIAL_ACHIEVEMENTS;
    }
  });

  const unlockAchievement = (id: string) => {
    setAchievements((prev) => {
      const match = prev.find((a) => a.id === id);
      if (match && !match.isUnlocked) {
        playSound('win');
        setXp((curr) => {
          const next = curr + match.xpReward;
          try {
            localStorage.setItem('guinness_user_xp', next.toString());
          } catch {}
          return next;
        });
        const updated = prev.map((a) => (a.id === id ? { ...a, isUnlocked: true } : a));
        try {
          localStorage.setItem('guinness_user_achievements', JSON.stringify(updated));
        } catch {}
        return updated;
      }
      return prev;
    });
  };

  const handleGainXp = (amount: number) => {
    setXp((curr) => {
      const next = curr + amount;
      try {
        localStorage.setItem('guinness_user_xp', next.toString());
      } catch {}
      return next;
    });
  };

  const handleContinueWarning = () => {
    setShowWarningModal(false);
    playSound('win');
    unlockAchievement('ach-warning');
    handleGainXp(20);
  };

  const handleLeaveWarning = () => {
    setShowWarningModal(false);
    playSound('honk');
    addRage(10);
    setWarningToast("🚨 'ফালতু বাদ দেই' বাটনে ক্লিক করেছেন? কিন্তু হোস্টাইল সাইট আপনাকে সহজে ছাড়বে না! পুরো সাইটটা দেখুন!");
    setTimeout(() => setWarningToast(null), 5000);
  };

  const levelInfo = getLevelInfo(xp);

  // Chaos Mode (Optional 30% chance for inverted actions, turned off by default for clean entry)
  const [chaosMode, setChaosMode] = useState<boolean>(false);
  const [chaosAlert, setChaosAlert] = useState<string | null>(null);
  const [scrollAlert, setScrollAlert] = useState<string | null>(null);
  const [retroCursorActive, setRetroCursorActive] = useState<boolean>(false);

  // Scrambled Headers
  const scrambledNomination = useHeaderScramble("GUINNESS WORLD RECORD NOMINATION", 2200);
  const scrambledPillars = useHeaderScramble("THE 10 PILLARS OF PURE UX AGONY", 2600);
  const scrambledWebring = useHeaderScramble("THE WORST WEBRING © 1996-2026. ALL WRONGS RESERVED.", 3200);

  // Frustration metrics
  const [stats, setStats] = useState<FrustrationStats>({
    clicks: 0,
    rageClicks: 0,
    attempts: 0,
    timeSpentSeconds: 0,
    frustrationScore: 18,
  });

  const addRage = (amount = 6) => {
    setStats((prev) => ({
      ...prev,
      rageClicks: prev.rageClicks + 1,
      frustrationScore: Math.min(100, prev.frustrationScore + amount),
    }));
  };

  // GSAP ScrollTrigger telemetry
  const { scrollSpeedMultiplier, snapbackCount } = useGsapScrollTrigger({
    enabled: true,
    onSnapback: () => {
      setScrollAlert("⚡ GSAP SCROLLTRIGGER TELEMETRY: Scroll milestone reached!");
      setTimeout(() => setScrollAlert(null), 3500);
    },
    onAddRage: () => addRage(5),
  });

  // Modals & UI States (All closed on initial load so visitors can explore immediately!)
  const [cookieModalOpen, setCookieModalOpen] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [showLowBattery, setShowLowBattery] = useState(false);
  const [showInactivity, setShowInactivity] = useState(false);

  // Themes & Effects
  const [currentTheme, setCurrentTheme] = useState<'toxic' | 'geocities' | 'stealth'>('toxic');
  const [isTilted, setIsTilted] = useState(false);
  const [sparklesActive, setSparklesActive] = useState(true);
  const [earthquakeActive, setEarthquakeActive] = useState(false);
  const [cursorTrails, setCursorTrails] = useState<{ id: number; x: number; y: number }[]>([]);

  // Popups swarm state (Empty by default so visitors are never blocked upon arrival!)
  const [popups, setPopups] = useState<PopupAd[]>([]);

  // Timer for time spent
  useEffect(() => {
    const timer = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        timeSpentSeconds: prev.timeSpentSeconds + 1,
        frustrationScore: Math.min(100, prev.frustrationScore + 0.05),
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Track global clicks & rage
  const handleGlobalClick = () => {
    setStats((prev) => ({
      ...prev,
      clicks: prev.clicks + 1,
      frustrationScore: Math.min(100, prev.frustrationScore + 0.5),
    }));
  };

  // Track mouse for retro sparkle trail
  const handleMouseMove = (e: React.MouseEvent) => {
    if (sparklesActive && Math.random() > 0.6) {
      setCursorTrails((prev) => [
        ...prev.slice(-12),
        { id: Date.now() + Math.random(), x: e.clientX, y: e.clientY },
      ]);
    }
  };

  const spawnRandomPopup = () => {
    playSound('honk');
    const types: ('iphone' | 'antivirus' | 'ram' | 'singles' | 'crypto')[] = [
      'iphone',
      'antivirus',
      'ram',
      'singles',
      'crypto',
    ];
    const titles = [
      'YOU WON 500,000 BITCOINS',
      'YOUR HARD DRIVE IS ON FIRE',
      'HOT SINGLES IN LOCALHOST:3000',
      'FREE RAM (32TB) DOWNLOAD READY',
      'CONGRATULATIONS 1,000,000TH VISITOR',
    ];
    const newPopup: PopupAd = {
      id: `pop-${Date.now()}`,
      title: titles[Math.floor(Math.random() * titles.length)],
      content: 'Click here immediately to claim before timer hits 0:00!',
      top: Math.floor(Math.random() * (window.innerHeight - 320) + 40),
      left: Math.floor(Math.random() * (Math.max(200, window.innerWidth - 340)) + 20),
      zIndex: 50 + popups.length,
      type: types[Math.floor(Math.random() * types.length)],
    };
    setPopups((prev) => [...prev, newPopup]);
    addRage(4);
  };

  const handleClosePopup = (id: string, trickSpawn: boolean) => {
    if (chaosMode && Math.random() < 0.3) {
      playSound('honk');
      addRage(12);
      setChaosAlert("🌀 CHAOS INVERSION (30% TRIGGERED): You clicked to close a popup, so we opened 2 more instead!");
      setTimeout(() => setChaosAlert(null), 4500);
      spawnRandomPopup();
      spawnRandomPopup();
      return;
    }

    setPopups((prev) => prev.filter((p) => p.id !== id));
    if (trickSpawn && Math.random() > 0.35) {
      spawnRandomPopup();
    }
  };

  const handleClearAllPopups = () => {
    if (chaosMode && Math.random() < 0.3) {
      playSound('honk');
      addRage(15);
      setChaosAlert("🌀 CHAOS INVERSION: You clicked 'Close All Popups', so we spawned 4 extra ads!");
      setTimeout(() => setChaosAlert(null), 4500);
      for (let i = 0; i < 4; i++) spawnRandomPopup();
      return;
    }
    setPopups([]);
  };

  const handleNavigation = (page: PageType) => {
    presenceManager.setPage(page);
    if (chaosMode && Math.random() < 0.3) {
      const allPages: PageType[] = ['home', 'halftone', 'viral', 'pinterest', 'shop', 'support', 'unsubscribe', 'records', 'polyglot'];
      const otherPages = allPages.filter((p) => p !== page);
      const inverted = otherPages[Math.floor(Math.random() * otherPages.length)];
      playSound('honk');
      addRage(10);
      setChaosAlert(`🌀 CHAOS INVERSION: You selected [${page.toUpperCase()}], so Chaos Mode routed you to [${inverted.toUpperCase()}]!`);
      setTimeout(() => setChaosAlert(null), 4500);
      presenceManager.setPage(inverted);
      setCurrentPage(inverted);
      return;
    }

    setCurrentPage(page);
  };

  const handleOpenCertificate = () => {
    playSound('win');
    setShowCertificate(true);
  };

  // Background style based on theme
  // Museum motion: Lenis smooth scroll + reveal-once (re-scan on page change)
  useMuseumMotion([currentPage, isLoading]);

  const getThemeBg = () => {
    if (currentTheme === 'geocities') {
      return 'bg-[#000080] text-yellow-300';
    }
    if (currentTheme === 'stealth') {
      return 'bg-gray-900 text-gray-400';
    }
    return 'bg-[var(--bg-base)] text-[var(--tone-strong)]';
  };

  return (
    <div
      onClick={handleGlobalClick}
      onMouseMove={handleMouseMove}
      className={`min-h-screen ${getThemeBg()} ${isTilted ? 'tilted-chaos' : ''} ${
        earthquakeActive ? 'earthquake-shake' : ''
      } selection:bg-[var(--tone-strong)] selection:text-[var(--light-100)] overflow-x-hidden`}
    >
      {/* Retro Mouse Sparkle Follower */}
      <ConfusingCursor enabled={retroCursorActive} />
      <BrowserTortureKit enabled={!isLoading && !showWarningModal} />

      {/* Floating Chaos Inversion Alert Banner */}
      {chaosAlert && (
        <div className="fixed top-2 left-1/2 -translate-x-1/2 z-[100000] bg-red-600 text-yellow-300 font-mono text-xs md:text-sm font-black px-4 py-2 border-4 border-black shadow-[6px_6px_0px_#000] animate-bounce max-w-xl text-center">
          {chaosAlert}
        </div>
      )}

      {/* Floating GSAP ScrollTrigger Alert Banner */}
      {scrollAlert && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-[100000] bg-purple-900 text-cyan-300 font-mono text-xs md:text-sm font-black px-4 py-2 border-4 border-yellow-400 shadow-[6px_6px_0px_#000] animate-pulse max-w-xl text-center">
          {scrollAlert}
        </div>
      )}

      {/* Retro Mouse Sparkle Trails */}
      {sparklesActive &&
        cursorTrails.map((trail) => (
          <div
            key={trail.id}
            className="fixed pointer-events-none z-50 text-xs animate-ping select-none"
            style={{ left: trail.x + 8, top: trail.y + 8 }}
          >
            ✨
          </div>
        ))}

      {/* Initial Boot Loading Screen */}
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}

      {/* Simulated Live Collaborative Multi-User Cursors */}
      <MultiUserCursors />

      {/* Top Bar Real-Time User Counter & Network Monitor */}
      <LiveUserCounter />

      {/* Marquee Banner */}
      <MarqueeBanner onHonk={() => addRage(2)} />

      {/* Hostile Navigation Bar - Desktop Edition */}
      <div className="hidden md:block">
        <WorstNav
          currentPage={currentPage}
          onNavigate={handleNavigation}
          onDialUp={() => addRage(5)}
          onTriggerLoading={() => setIsLoading(true)}
          onOpenWarning={() => setShowWarningModal(true)}
          onOpenFeedback={() => setShowFeedbackModal(true)}
          onOpenGamification={() => setShowGamificationModal(true)}
          xp={xp}
        />
      </div>

      {/* Modern Mobile App Navigation Dock & Header (Transforms on mobile screens) */}
      <MobileAppNav
        currentPage={currentPage}
        onNavigate={handleNavigation}
        frustrationScore={stats.frustrationScore}
        onTriggerCaptcha={() => setShowCaptcha(true)}
        onTriggerBattery={() => setShowLowBattery(true)}
        onTriggerCookies={() => setCookieModalOpen(true)}
        onSpawnAd={() => spawnRandomPopup()}
        onDialUp={() => addRage(5)}
        chaosMode={chaosMode}
        onToggleChaosMode={() => setChaosMode(!chaosMode)}
        onTriggerWarning={() => setShowWarningModal(true)}
        onTriggerFeedback={() => setShowFeedbackModal(true)}
        onTriggerGamification={() => setShowGamificationModal(true)}
        onTriggerLoading={() => setIsLoading(true)}
        xp={xp}
      />

      {/* Main Content Viewport */}
      <main id="main" className="container-x pb-28 md:pb-10" style={{ paddingTop: 20 }}>
        {/* Global Quick Action Toolbar — museum "visitor desk" */}
        <div
          className="glass flex flex-wrap items-center justify-between gap-2"
          style={{ borderRadius: 'var(--r-card)', padding: 10, marginBottom: 20 }}
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="eyebrow muted" style={{ paddingInline: 5 }}>Chaos deck</span>
            <button className="btn btn-ghost" onClick={() => { playSound('beep'); setShowWarningModal(true); }}>সতর্কবার্তা</button>
            <button className="btn btn-ghost" onClick={() => { playSound('coin'); setShowFeedbackModal(true); }}>মতামত দিন</button>
            <button className="btn btn-ghost" onClick={() => setShowCaptcha(true)}>Captcha</button>
            <button className="btn btn-ghost" onClick={() => setShowLowBattery(true)}>1% battery</button>
            <button className="btn btn-ghost" onClick={() => setCookieModalOpen(true)}>Cookies</button>
            <button className="btn btn-ghost" onClick={() => spawnRandomPopup()}>Spawn ad</button>
            <button
              className={`btn ${chaosMode ? 'btn-primary' : 'btn-ghost'}`}
              aria-pressed={chaosMode}
              title="30% chance for button clicks to trigger opposite action"
              onClick={() => { playSound('glitch'); setChaosMode(!chaosMode); }}
            >
              Chaos 30%: {chaosMode ? 'On' : 'Off'}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="chip">GSAP {scrollSpeedMultiplier.toFixed(1)}x</span>
            <button className="btn btn-ghost" onClick={() => { playSound('coin'); handleNavigation('halftone'); }}>Halftone</button>
            <button className="btn btn-ghost" onClick={handleOpenCertificate}>Certificate</button>
            <button className="btn btn-primary" onClick={() => { playSound('win'); setShowGamificationModal(true); }}>
              {xp} XP · Lvl {levelInfo.level}
            </button>
          </div>
        </div>

        {/* Smooth Page Transitions via Framer Motion AnimatePresence */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="space-y-8"
          >
            {/* Dynamic Page Rendering */}
            {currentPage === 'home' && (
              <>
                {/* HERO — museum entrance */}
                <MuseumHero
                  verdict="Certified by the Guinness Committee as the most hostile, chaotic, and over-engineered interactive disaster on the internet."
                  onOpenCertificate={handleOpenCertificate}
                  onEnter={() => document.getElementById('section-pillars')?.scrollIntoView({ behavior: 'smooth' })}
                />

                {/* THE 10 PILLARS — split list instead of six identical cards */}
                <section id="section-pillars" className="reveal" style={{ paddingTop: 'var(--section-pad)' }}>
                  <div className="grid gap-5 md:grid-cols-12">
                    <div className="md:col-span-5">
                      <p className="eyebrow muted" style={{ marginBottom: 10 }}>{scrambledNomination}</p>
                      <h2 className="h3">{scrambledPillars}</h2>
                      <p className="body-m muted" style={{ marginTop: 20, maxWidth: 420 }}>
                        Six permanent installations, each a carefully preserved crime against usability.
                      </p>
                      <button onClick={handleOpenCertificate} className="btn btn-primary" style={{ marginTop: 32 }}>
                        View official certificate
                      </button>
                    </div>
                    <ol className="md:col-span-7">
                      {[
                        ['The slippery reject button', 'Rejecting cookies makes the button flee your cursor at lightspeed.'],
                        ['Slider phone number', 'Requires pixel-perfect slider precision (0 to 9,999,999,999).'],
                        ['Slot machine birthday', 'Roll casino reels until you match your birth date.'],
                        ['Impossible password rules', "Bangla alphabet letters, emoji, sum = 42, and no letter 'e'."],
                        ['Hydra ad spawn engine', 'Closing popups triggers unpredictable retro spawn cascades.'],
                        ['Multi-page agony', 'Scam Store, Karen Bot Support, and the Unsubscribe Maze.'],
                      ].map(([title, desc], i) => (
                        <li key={title} className="grid grid-cols-12 gap-5 hairline" style={{ padding: '20px 0' }}>
                          <span className="mono muted col-span-2">{String(i + 1).padStart(2, '0')}</span>
                          <div className="col-span-10">
                            <h3 className="h6">{title}</h3>
                            <p className="body-m muted" style={{ marginTop: 5 }}>{desc}</p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                </section>

                <Exhibit id="section-frustration" number="01" title="Live frustration telemetry" tech="React · State" note="Your rage, measured in real time.">
                  <FrustrationDashboard stats={stats} onAddRage={() => addRage(15)} onSpawnPopup={spawnRandomPopup} />
                  <ChaosControls
                    currentTheme={currentTheme}
                    onThemeChange={(theme) => {
                      playSound('glitch');
                      setCurrentTheme(theme as 'toxic' | 'geocities' | 'stealth');
                    }}
                    isTilted={isTilted}
                    onToggleTilt={() => {
                      playSound('beep');
                      setIsTilted(!isTilted);
                    }}
                    sparklesActive={sparklesActive}
                    onToggleSparkles={() => {
                      playSound('beep');
                      setSparklesActive(!sparklesActive);
                    }}
                    onRateAction={() => addRage(8)}
                    chaosMode={chaosMode}
                    onToggleChaosMode={() => setChaosMode(!chaosMode)}
                  />
                </Exhibit>

                <Exhibit id="section-viral" number="02" title="Bangladesh viral news" tech="Satire · Images">
                  <BangladeshViralNews
                    onOpenFeedbackModal={() => setShowFeedbackModal(true)}
                    onGainXp={(gain) => {
                      unlockAchievement('ach-viral');
                      handleGainXp(gain);
                    }}
                  />
                </Exhibit>

                {/* STATEMENT — one per page, never directly under the hero */}
                <section className="reveal" style={{ paddingTop: 'var(--section-pad)' }} aria-label="Manifesto">
                  <p className="h0" style={{ maxWidth: 1100 }}>
                    Every button here was built to betray you. Lovingly.
                  </p>
                </section>

                <Exhibit id="section-gamification" number="03" title="Agony gamification hub" tech="XP · Quests">
                  <GamificationShowcaseSection
                    xp={xp}
                    achievements={achievements}
                    onOpenGamificationModal={() => setShowGamificationModal(true)}
                    onOpenFeedbackModal={() => setShowFeedbackModal(true)}
                    onGainXp={handleGainXp}
                  />
                </Exhibit>

                <Exhibit id="section-hybrid-terminal" number="04" title="Hostile shell kernel" tech="Bash · TypeScript">
                  <HybridTerminal
                    onTriggerChaos={() => {
                      setChaosMode(!chaosMode);
                      unlockAchievement('ach-chaos');
                    }}
                    onTriggerMagic={() => {
                      playSound('magic');
                      handleGainXp(10);
                    }}
                    onAddRage={() => addRage(10)}
                    onOpenFeedback={() => setShowFeedbackModal(true)}
                    onOpenGamification={() => setShowGamificationModal(true)}
                    onTriggerHorror={(type) => {
                      playHorrorSound(type);
                      unlockAchievement('ach-horror');
                      handleGainXp(15);
                      addRage(5);
                    }}
                    xp={xp}
                  />
                </Exhibit>

                <Exhibit id="section-horror-soundpad" number="05" title="24-bit horror sound lab" tech="Web Audio API">
                  <HorrorSoundPad
                    onHorrorTriggered={() => {
                      unlockAchievement('ach-horror');
                      handleGainXp(15);
                      addRage(6);
                    }}
                  />
                </Exhibit>

                <Exhibit id="section-03-r3f" number="06" title="3D holodeck" tech="React Three Fiber">
                  <ReactThreeFiberDisaster />
                </Exhibit>

                <Exhibit id="section-04-spring" number="07" title="Physics simulator" tech="React Spring">
                  <ReactSpringPhysicsLab />
                </Exhibit>

                <Exhibit id="section-05-lottie" number="08" title="Vector animation studio" tech="Lottie · Bodymovin">
                  <LottieDisasterStudio />
                </Exhibit>

                <Exhibit id="section-06-particles" number="09" title="Particle constellation" tech="Canvas 2D">
                  <InteractiveParticleVortex />
                </Exhibit>

                <Exhibit id="section-canvas-triad" number="10" title="Thousands of thoughts" tech="PixiJS · Konva · Fabric">
                  <CanvasEnginesTriad />
                </Exhibit>

                <Exhibit id="section-magic-particles" number="11" title="Arcane runes" tech="Trigonometry · Canvas">
                  <MagicArcaneStudio />
                </Exhibit>

                <Exhibit id="section-07-three" number="12" title="WebGL disaster void" tech="Three.js">
                  <ThreeDisasterCanvas onAddRage={() => addRage(8)} />
                </Exhibit>

                <Exhibit id="section-08-motion" number="13" title="Kinetic tilt and fleeing magnet" tech="Framer Motion">
                  <MotionDisasterSuite onAddRage={() => addRage(10)} onToggleEarthquake={setEarthquakeActive} />
                </Exhibit>

                <Exhibit id="section-09-nextjs" number="14" title="Hydration catastrophe" tech="Next.js · Turbopack">
                  <NextJsDisasterPanel onAddRage={() => addRage(9)} />
                </Exhibit>

                <Exhibit id="section-10-form" number="15" title="The world's worst form" tech="Forms · Validation">
                  <WorstForm onFormAction={() => addRage(3)} onSuccessSubmit={() => setShowCertificate(true)} />
                </Exhibit>
              </>
            )}

            {currentPage === 'pinterest' && (
              <WorstPinterest onAddRage={() => addRage(8)} />
            )}

            {currentPage === 'halftone' && (
              <div className="space-y-6">
                <HalftoneStudio
                  onAwardXp={(gain, reason) => {
                    unlockAchievement('ach-halftone');
                    handleGainXp(gain);
                  }}
                />
              </div>
            )}

            {currentPage === 'shop' && (
              <WorstStore onAddRage={() => addRage(8)} />
            )}

            {currentPage === 'support' && (
              <WorstSupport onAddRage={() => addRage(7)} />
            )}

            {currentPage === 'unsubscribe' && (
              <WorstUnsubscribe onAddRage={() => addRage(12)} />
            )}

            {currentPage === 'records' && (
              <WorstRecords
                onAddRage={() => addRage(5)}
                onOpenCertificate={() => setShowCertificate(true)}
              />
            )}

            {currentPage === 'polyglot' && (
              <PolyglotChaosLab onAwardXp={(gain) => handleGainXp(gain)} />
            )}

            {currentPage === 'viral' && (
              <div className="space-y-6">
                <BangladeshViralNews
                  onOpenFeedbackModal={() => setShowFeedbackModal(true)}
                  onGainXp={(gain) => {
                    unlockAchievement('ach-viral');
                    handleGainXp(gain);
                  }}
                />
                <GamificationShowcaseSection
                  xp={xp}
                  achievements={achievements}
                  onOpenGamificationModal={() => setShowGamificationModal(true)}
                  onOpenFeedbackModal={() => setShowFeedbackModal(true)}
                  onGainXp={handleGainXp}
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <MuseumFooter
          webringText={scrambledWebring}
          xp={xp}
          onNavigate={handleNavigation}
          onOpenCookies={() => {
            playSound('coin');
            setCookieModalOpen(true);
          }}
          onOpenWarning={() => {
            playSound('beep');
            setShowWarningModal(true);
          }}
          onOpenFeedback={() => {
            playSound('coin');
            setShowFeedbackModal(true);
          }}
          onOpenGamification={() => {
            playSound('win');
            setShowGamificationModal(true);
          }}
          onOpenCertificate={handleOpenCertificate}
          onSpawnAd={spawnRandomPopup}
        />
      </main>

      {/* Floating Warning Toast when user clicks "ফালতু বাদ দেই" */}
      {warningToast && (
        <div className="fixed bottom-16 sm:bottom-6 left-1/2 -translate-x-1/2 z-[100000] bg-red-600 text-yellow-300 font-mono text-xs md:text-sm font-black px-4 py-2 border-4 border-black shadow-[6px_6px_0px_#000] animate-bounce max-w-lg text-center">
          {warningToast}
        </div>
      )}

      {/* Bilingual Bangla & English Hostile Warning Modal */}
      <BanglaEnglishWarningModal
        isOpen={showWarningModal}
        onClose={handleContinueWarning}
        onLeave={handleLeaveWarning}
      />

      {/* User Feedback, Rating & Feature Request Modal */}
      <FeedbackReviewModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        onReviewSubmitted={(xpGain) => {
          unlockAchievement('ach-feedback');
          unlockAchievement('ach-rabbu-mail');
          handleGainXp(xpGain);
        }}
      />

      {/* Gamification & Quests Center Modal */}
      <GamificationCenter
        isOpen={showGamificationModal}
        onClose={() => setShowGamificationModal(false)}
        xp={xp}
        achievements={achievements}
        onClaimQuest={(_questId, questXp) => {
          handleGainXp(questXp);
        }}
      />

      {/* Persistent Agony Gamification Floating HUD */}
      <GamificationFloatingHud
        xp={xp}
        onOpenGamification={() => setShowGamificationModal(true)}
        unlockedCount={achievements.filter((a) => a.isUnlocked).length}
        totalAchievements={achievements.length}
      />

      {/* Pop-up Ads Swarm */}
      <PopUpSwarm
        popups={popups}
        onClosePopup={handleClosePopup}
        onClearAll={handleClearAllPopups}
      />

      {/* Cookie Nightmare Modal */}
      <CookieNightmareModal
        isOpen={cookieModalOpen}
        onClose={() => {
          if (chaosMode && Math.random() < 0.3) {
            playSound('honk');
            addRage(10);
            setChaosAlert("🌀 CHAOS INVERSION: Closing cookies was denied! Triggered Impossible CAPTCHA instead!");
            setTimeout(() => setChaosAlert(null), 4000);
            setShowCaptcha(true);
            return;
          }
          setCookieModalOpen(false);
        }}
        onRejectEscape={() => addRage(5)}
      />

      {/* Impossible CAPTCHA Modal */}
      <FakeCaptchaModal
        isOpen={showCaptcha}
        onVerify={() => {
          setShowCaptcha(false);
          playSound('win');
        }}
        onClose={() => setShowCaptcha(false)}
      />

      {/* 1% Low Battery Panic Modal */}
      <LowBatteryModal
        isOpen={showLowBattery}
        onDismiss={() => setShowLowBattery(false)}
      />

      {/* Inactivity Alert Modal */}
      <InactivityModal
        isOpen={showInactivity}
        onConfirmActive={() => setShowInactivity(false)}
      />

      {/* Guinness Certificate Modal */}
      {showCertificate && (
        <GuinnessCertificate
          recipientName="VALIANT INTERNET SURVIVOR"
          frustrationScore={stats.frustrationScore}
          timeSpentSeconds={stats.timeSpentSeconds}
          onClose={() => setShowCertificate(false)}
        />
      )}
    </div>
  );
}