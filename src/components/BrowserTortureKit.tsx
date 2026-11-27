import React, { useEffect, useState } from 'react';

interface Props {
  enabled: boolean;
}

const FAKE_TITLES = [
  "(1) New message from your Mom",
  "(3) Someone viewed your profile",
  "⚠️ Your PC has 47 viruses",
  "(99+) Rabbu sent you a friend request",
  "🔴 LIVE: You are still here?",
  "World's Worst Website",
];

const FAVICONS = ['💩', '🔥', '💀', '🤡', '🐸', '🧨'];

function setEmojiFavicon(emoji: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">${emoji}</text></svg>`;
  let link = document.querySelector<HTMLLinkElement>("link[rel='icon']");
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  link.href = `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export const BrowserTortureKit: React.FC<Props> = ({ enabled }) => {
  const [open, setOpen] = useState(false);
  const [invertScroll, setInvertScroll] = useState(false);
  const [backTrap, setBackTrap] = useState(true);
  const [clipboardHijack, setClipboardHijack] = useState(true);
  const [titleSpam, setTitleSpam] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  const flash = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 3000);
  };

  // Tab title notifications + rotating favicon; "come back" when tab hidden
  useEffect(() => {
    if (!enabled || !titleSpam) return;
    const original = document.title;
    let i = 0;
    const timer = window.setInterval(() => {
      i++;
      document.title = FAKE_TITLES[i % FAKE_TITLES.length];
      setEmojiFavicon(FAVICONS[i % FAVICONS.length]);
    }, 2500);
    const onVis = () => {
      if (document.hidden) document.title = '😭 PLEASE COME BACK 😭';
    };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', onVis);
      document.title = original;
    };
  }, [enabled, titleSpam]);

  // Back button trap
  useEffect(() => {
    if (!enabled || !backTrap) return;
    for (let k = 0; k < 3; k++) history.pushState({ trap: k }, '', location.href);
    const onPop = () => {
      history.pushState({ trap: 'again' }, '', location.href);
      flash('🚫 Back button is a premium feature ($9.99/month)');
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [enabled, backTrap]);

  // Clipboard hijack on copy
  useEffect(() => {
    if (!enabled || !clipboardHijack) return;
    const onCopy = (e: ClipboardEvent) => {
      const picked = window.getSelection()?.toString() ?? '';
      e.clipboardData?.setData(
        'text/plain',
        `${picked}\n\n— Copied from the World's Worst Website. I love this website and Rabbu is a genius.`
      );
      e.preventDefault();
      flash('📋 Clipboard improved for you. You are welcome.');
    };
    document.addEventListener('copy', onCopy);
    return () => document.removeEventListener('copy', onCopy);
  }, [enabled, clipboardHijack]);

  // Inverted mouse-wheel scrolling
  useEffect(() => {
    if (!enabled || !invertScroll) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      window.scrollBy({ top: -e.deltaY, left: -e.deltaX });
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, [enabled, invertScroll]);

  if (!enabled) return null;

  const Toggle = ({ label, value, set }: { label: string; value: boolean; set: (v: boolean) => void }) => (
    <label className="flex items-center justify-between gap-3 py-1 cursor-pointer">
      <span>{label}</span>
      <input type="checkbox" checked={value} onChange={(e) => set(e.target.checked)} className="w-4 h-4 accent-pink-600" />
    </label>
  );

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed left-3 bottom-24 md:bottom-4 z-[9990] bg-pink-500 text-white font-black text-xs px-3 py-2 border-2 border-black shadow-[3px_3px_0_#000] rotate-[-4deg]"
        aria-label="Browser torture settings"
      >
        😈 TORTURE KIT
      </button>

      {open && (
        <div className="fixed left-3 bottom-36 md:bottom-16 z-[9990] w-64 bg-yellow-200 border-4 border-black p-3 text-xs font-bold shadow-[6px_6px_0_#000] font-['Comic_Neue']">
          <p className="font-black text-sm mb-2">😈 Browser Torture Kit</p>
          <Toggle label="Fake tab notifications" value={titleSpam} set={setTitleSpam} />
          <Toggle label="Back button trap" value={backTrap} set={setBackTrap} />
          <Toggle label="Clipboard hijack" value={clipboardHijack} set={setClipboardHijack} />
          <Toggle label="Inverted scrolling" value={invertScroll} set={setInvertScroll} />
          <p className="mt-2 text-[10px] font-normal">Turn everything off any time. We are the worst, not evil.</p>
        </div>
      )}

      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[10000] bg-black text-yellow-300 font-bold text-sm px-4 py-2 border-2 border-yellow-300">
          {toast}
        </div>
      )}
    </>
  );
};