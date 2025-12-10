// Breath Aurora enhanced script
(() => {
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  const BREATH_PHASES = ["inhale", "hold", "exhale"];

  const SESSION_TYPES = {
    calm: {
      id: "calm",
      label: "Calm · Coherent Breath",
      pattern: { inhale: 5, hold: 0, exhale: 5 },
      durationMinutes: 5,
      easing: "ease-in-out",
      colors: {
        inhale: "#38bdf8",
        hold: "#a855f7",
        exhale: "#22c55e",
        background: "radial-gradient(circle at top, #0f172a, #020617)",
      },
    },
    focus: {
      id: "focus",
      label: "Focus · Box Breathing",
      pattern: { inhale: 4, hold: 4, exhale: 4, holdEmpty: 4 },
      durationMinutes: 4,
      easing: "ease",
      colors: {
        inhale: "#14b8a6",
        hold: "#0ea5e9",
        exhale: "#22c55e",
        background: "radial-gradient(circle at top, #020617, #022c22)",
      },
    },
    energize: {
      id: "energize",
      label: "Energize · Power Breath",
      pattern: { inhale: 2, hold: 0, exhale: 4 },
      durationMinutes: 3,
      easing: "ease-out",
      colors: {
        inhale: "#f97316",
        hold: "#fb923c",
        exhale: "#f59e0b",
        background: "radial-gradient(circle at top, #0b1120, #422006)",
      },
    },
    sleep: {
      id: "sleep",
      label: "Sleep · 4-7-8",
      pattern: { inhale: 4, hold: 7, exhale: 8 },
      durationMinutes: 4,
      easing: "ease-in-out",
      colors: {
        inhale: "#4f46e5",
        hold: "#7c3aed",
        exhale: "#22d3ee",
        background: "radial-gradient(circle at top, #020617, #020617)",
      },
    },
  };

  const THEMES = {
    aurora: {
      id: "aurora",
      labelKey: "themeAurora",
      swatch: "#38bdf8",
      values: {
        bg: "#020617",
        bgSoft: "#02081b",
        panel: "#020617",
        card: "#02081d",
        cardSoft: "#020b28",
        text: "#e5e7eb",
        textSoft: "#9ca3af",
        accent: "#38bdf8",
        accentSoft: "rgba(56, 189, 248, 0.2)",
        accentStrong: "#0ea5e9",
        background: "radial-gradient(circle at top, #0b1120 0, #020617 50%, #000 100%)",
      },
    },
    sunrise: {
      id: "sunrise",
      labelKey: "themeSunrise",
      swatch: "#f97316",
      values: {
        bg: "#1b0f0f",
        bgSoft: "#1f1312",
        panel: "#1d0f0d",
        card: "#2a1411",
        cardSoft: "#321812",
        text: "#ffeedd",
        textSoft: "#f3c9a9",
        accent: "#f97316",
        accentSoft: "rgba(249, 115, 22, 0.2)",
        accentStrong: "#fb923c",
        background: "radial-gradient(circle at 20% 0, #f97316, #1b0f0f 60%)",
      },
    },
    forest: {
      id: "forest",
      labelKey: "themeForest",
      swatch: "#22c55e",
      values: {
        bg: "#0a1811",
        bgSoft: "#0f1f16",
        panel: "#0c1c13",
        card: "#102318",
        cardSoft: "#12291c",
        text: "#e8ffe8",
        textSoft: "#b4d8b4",
        accent: "#22c55e",
        accentSoft: "rgba(34, 197, 94, 0.2)",
        accentStrong: "#16a34a",
        background: "radial-gradient(circle at 70% 0, #22c55e, #0a1811 60%)",
      },
    },
    light: {
      id: "light",
      labelKey: "themeLight",
      swatch: "#0ea5e9",
      values: {
        bg: "#f8fafc",
        bgSoft: "#eef2ff",
        panel: "#e2e8f0",
        card: "#ffffff",
        cardSoft: "#f8fafc",
        text: "#0f172a",
        textSoft: "#475569",
        accent: "#0ea5e9",
        accentSoft: "rgba(14, 165, 233, 0.15)",
        accentStrong: "#0284c7",
        background: "radial-gradient(circle at top, #e0f2fe, #f8fafc 60%)",
      },
    },
  };

  const BREATH_LIBRARY = [
    {
      id: "coherent",
      label: "Coherent Breathing · 5-5 Rhythm",
      sessionType: "calm",
      pattern: { inhale: 5, hold: 0, exhale: 5 },
      level: "Beginner",
      summary:
        "Slow nasal breathing at about 5 breaths per minute to calm the nervous system.",
      howTo: [
        "Sit or lie down comfortably.",
        "Inhale through your nose for 5 seconds, letting your belly rise.",
        "Exhale through your nose for 5 seconds, letting your belly soften.",
        "Continue for 5–10 minutes, staying relaxed and natural.",
      ],
      whyItWorks:
        "This pace creates a resonance between your breath and heart, boosting heart-rate variability and activating the vagus nerve.",
      cautions:
        "Very gentle and safe for most people. If you feel any air hunger, slightly shorten the inhale and exhale counts.",
      translations: {
        tr: {
          label: "Uyumlu Nefes · 5-5 Ritim",
          level: "Başlangıç",
          summary: "Dakikada yaklaşık 5 nefesle sinir sistemini sakinleştiren yavaş burun nefesi.",
          howTo: [
            "Rahatça oturun veya uzanın.",
            "Karnınız yükselirken burundan 5 saniye nefes alın.",
            "Karın yumuşarken burundan 5 saniye nefes verin.",
            "Doğal ve yumuşak kalarak 5–10 dakika sürdürün.",
          ],
          whyItWorks:
            "Bu tempo nefesiniz ve kalbiniz arasında rezonans yaratır, kalp atım değişkenliğini artırır ve vagus sinirini rahatlatır.",
          cautions: "Çok nazik ve çoğu kişi için güvenli. Hava açlığı hissederseniz süreleri biraz kısaltın.",
        },
      },
    },
    {
      id: "box",
      label: "Box Breathing · 4-4-4-4",
      sessionType: "focus",
      pattern: { inhale: 4, hold: 4, exhale: 4, holdEmpty: 4 },
      level: "Beginner",
      summary:
        "A simple 4-count inhale, hold, exhale, hold cycle used by Navy SEALs to stay calm and focused.",
      howTo: [
        "Inhale through your nose for 4 counts.",
        "Hold your breath with lungs full for 4 counts.",
        "Exhale gently through your nose for 4 counts.",
        "Hold with lungs empty for 4 counts, then repeat.",
      ],
      whyItWorks:
        "The short breath holds allow CO₂ to rise slightly, which activates the vagus nerve and helps slow your heart and clear your mind.",
      cautions:
        "If holding for 4 is difficult, start with shorter counts (like 3-3-3-3) and build up.",
      translations: {
        tr: {
          label: "Kutu Nefes · 4-4-4-4",
          level: "Başlangıç",
          summary: "Dört sayılık al-tut-ver-tut döngüsü zihni sakinleştirir ve odağı tazeler.",
          howTo: [
            "Burundan 4 sayıda nefes al.",
            "Akciğerler doluyken 4 sayıda bekle.",
            "Burundan 4 sayıda yumuşakça nefes ver.",
            "Boşken 4 sayıda bekle ve tekrarla.",
          ],
          whyItWorks:
            "Kısa tutuşlar CO₂'yi hafifçe yükseltir, vagus sinirini uyarır ve kalp ritmini yavaşlatıp zihni berraklaştırır.",
          cautions: "4 saniye zor geliyorsa 3-3-3-3 ile başlayın ve yavaşça artırın.",
        },
      },
    },
    {
      id: "sleep_478",
      label: "4-7-8 Sleep Breath",
      sessionType: "sleep",
      pattern: { inhale: 4, hold: 7, exhale: 8 },
      level: "Beginner",
      summary:
        "A longer exhale pattern that helps switch your body into rest-and-digest mode for sleep.",
      howTo: [
        "Inhale quietly through your nose for 4 counts.",
        "Hold your breath for 7 counts.",
        "Exhale slowly through your mouth with a soft 'whoosh' for 8 counts.",
        "Repeat for 4–8 rounds.",
      ],
      whyItWorks:
        "The long exhale and breath hold strongly activate the parasympathetic nervous system and reduce arousal.",
      cautions:
        "If 7-second holds feel too long, start with a 4-4-6 pattern and gradually increase.",
      translations: {
        tr: {
          label: "4-7-8 Uyku Nefesi",
          level: "Başlangıç",
          summary: "Uzun veriş ritmi bedeni uyku için dinlenme moduna geçirir.",
          howTo: [
            "Burundan sessizce 4 sayıda nefes al.",
            "7 sayıda nefesi tut.",
            "Ağızdan yumuşak bir ‘huh’ sesiyle 8 sayıda nefes ver.",
            "4–8 tur boyunca tekrar et.",
          ],
          whyItWorks:
            "Uzun veriş ve bekleme parasempatik sistemi güçlendirir, uyarılmışlığı azaltır.",
          cautions: "7 saniye uzun geliyorsa 4-4-6 ile başlayıp kademeli artırın.",
        },
      },
    },
    {
      id: "bhramari",
      label: "Bhramari · Humming Bee Breath",
      sessionType: "calm",
      pattern: { inhale: 4, hold: 0, exhale: 6 },
      level: "Beginner",
      summary:
        "A gentle humming exhale that soothes the nervous system and quiets the mind.",
      howTo: [
        "Inhale slowly through your nose.",
        "Exhale while making a soft 'mmm' humming sound, like a bee.",
        "Feel the vibration in your face, throat, and chest.",
        "Repeat 5–10 times.",
      ],
      whyItWorks:
        "The humming vibration stimulates the vagus nerve and increases nitric oxide in the nasal passages.",
      cautions:
        "Keep the volume comfortable. If you feel any ear discomfort, hum more softly.",
      translations: {
        tr: {
          label: "Bhramari · Arı Vızıltısı Nefesi",
          level: "Başlangıç",
          summary: "Yumuşak bir mırıltılı veriş sinir sistemini yatıştırır ve zihni sessizleştirir.",
          howTo: [
            "Burundan yavaşça nefes al.",
            "Arı gibi yumuşak bir \"mmm\" sesiyle nefes ver.",
            "Titreşimi yüzünde, boğazında ve göğsünde hisset.",
            "5–10 kez tekrarla.",
          ],
          whyItWorks:
            "Titreşim vagus sinirini uyarır ve burun pasajlarında nitrik oksit üretimini artırır.",
          cautions: "Sesi rahat bir seviyede tut. Kulakta rahatsızlık olursa daha kısık mırıldan.",
        },
      },
    },
    {
      id: "energize_simple",
      label: "Sunrise Energizer · 2-0-4",
      sessionType: "energize",
      pattern: { inhale: 2, hold: 0, exhale: 4 },
      level: "Beginner",
      summary: "Short inhales and longer exhales to gently wake up and boost alertness.",
      howTo: [
        "Sit upright.",
        "Inhale through the nose for 2 counts.",
        "Exhale for 4 counts; keep it smooth, not forced.",
        "Repeat for 2–5 minutes.",
      ],
      whyItWorks:
        "A slightly extended exhale balances the nervous system while the brisk inhale lifts energy.",
      cautions: "If you feel lightheaded, slow down and return to normal breathing.",
      translations: {
        tr: {
          label: "Gün Doğumu Enerjisi · 2-0-4",
          level: "Başlangıç",
          summary: "Kısa alış ve uzun veriş, uyanıklığı nazikçe yükseltir.",
          howTo: [
            "Dik bir şekilde otur.",
            "Burundan 2 sayıda nefes al.",
            "Zorlamadan, yumuşakça 4 sayıda nefes ver.",
            "2–5 dakika boyunca tekrar et.",
          ],
          whyItWorks:
            "Hafif uzun veriş sinir sistemini dengelerken, hızlı alış enerjiyi yükseltir.",
          cautions: "Baş dönmesi olursa yavaşla ve normal nefese dön.",
        },
      },
    },
  ];

  const translations = {
    en: {
      title: "Breath Aurora",
      tagline: "Breathwork, mudras & movement · Ancient + modern",
      profileLabel: "Profile",
      profileTagline: "{{name}}, your breath is your superpower.",
      navCoach: "Coach",
      navLibrary: "Library",
      navProfile: "Profile",
      sessionHeading: "Breath Session",
      techniqueLabel: "Technique",
      roundsLabel: "Rounds / Cycles",
      estimatedDuration: "Estimated duration: {{time}} ({{cycles}} cycles)",
      cycleLength: "Each cycle: {{seconds}}s",
      sessionTypeLabel: "Session type",
      intentCalm: "Calm",
      intentFocus: "Focus",
      intentEnergize: "Energize",
      intentSleep: "Sleep",
      metricPhase: "Current phase",
      metricTime: "Phase time left",
      metricProgress: "Session progress",
      startBtn: "Start session",
      stopBtn: "Stop",
      soundToggle: "Phase chime",
      guidedBreath: "Guided Breath",
      breathStyle: "Breathing style",
      todayMinutes: "Today’s minutes",
      libraryHeading: "Technique Library",
      libraryIntro:
        "Short, clear descriptions of each technique. Start with the gentle ones. Hyperventilation-style practices should be done responsibly.",
      statsHeading: "Stats & Streaks",
      currentStreak: "Current streak",
      bestStreak: "Best streak",
      totalSessions: "Total sessions",
      totalMinutes: "Total minutes",
      badgesHeading: "Badges",
      noteHeading: "Daily Note (local only)",
      saveNote: "Save note",
      badgeUnlocked: "Unlocked",
      badgeLocked: "Locked",
      details: "Details",
      noteSaved: "Note saved locally ✅",
      chooseTechnique: "Choose a technique",
      techniquePrompt: "Pick a session type or a technique from the library to see details.",
      techniquePattern: "Pattern: Inhale {{inhale}}s · {{holdLabel}}{{exhale}}s",
      streakHintNone: "No streak yet. Even one 2-minute session today is a great start.",
      streakHintGood: "Nice consistency. A few conscious breaths each day reshape the nervous system.",
      streakHintKeep: "Keep breathing daily. Streaks help your brain turn this into an automatic habit.",
      ready: "Ready",
      tapToBegin: "Tap to begin",
      getReady: "Get ready",
      paused: "Paused",
      tapToResume: "Tap to resume",
      tapToPause: "Tap to pause",
      inhaleHint: "Breathe in softly",
      exhaleHint: "Slow relaxed exhale",
      holdHint: "Hold gently",
      howToPractice: "How to practice",
      whyItWorks: "Why it works",
      cautionPrefix: "Caution:",
      startTechnique: "Start this technique",
      themeLabel: "Theme",
      themeAurora: "Aurora",
      themeSunrise: "Sunrise",
      themeForest: "Forest",
      themeLight: "Light",
      primaryColorLabel: "Primary color",
      accentColorLabel: "Accent color",
      shapeLabel: "Shape",
      overlayLabel: "Overlay",
      breathStyleDefault: "Comfortable nasal breathing.",
      daysSuffix: "days",
      minutesSuffix: "min",
    },
    tr: {
      title: "Nefes Aurora",
      tagline: "Nefes, mudra ve hareket · Kadim + modern",
      profileLabel: "Profil",
      profileTagline: "{{name}}, nefesin süper gücün.",
      navCoach: "Koç",
      navLibrary: "Kütüphane",
      navProfile: "Profil",
      sessionHeading: "Nefes Seansı",
      techniqueLabel: "Teknik",
      roundsLabel: "Turlar / Döngüler",
      estimatedDuration: "Tahmini süre: {{time}} ({{cycles}} döngü)",
      cycleLength: "Her döngü: {{seconds}} sn",
      sessionTypeLabel: "Seans tipi",
      intentCalm: "Sakin",
      intentFocus: "Odak",
      intentEnergize: "Enerji",
      intentSleep: "Uyku",
      metricPhase: "Aşama",
      metricTime: "Kalan süre",
      metricProgress: "İlerleme",
      startBtn: "Seansı başlat",
      stopBtn: "Durdur",
      soundToggle: "Sesli uyarı",
      guidedBreath: "Rehberli Nefes",
      breathStyle: "Nefes tarzı",
      todayMinutes: "Bugünkü dakika",
      libraryHeading: "Teknik Kütüphanesi",
      libraryIntro:
        "Kısa ve net açıklamalar. Önce yumuşak pratiklerle başlayın. Yoğun teknikleri sorumlulukla uygulayın.",
      statsHeading: "İstatistikler ve Seri",
      currentStreak: "Günlük seri",
      bestStreak: "En iyi seri",
      totalSessions: "Toplam seans",
      totalMinutes: "Toplam dakika",
      badgesHeading: "Rozetler",
      noteHeading: "Günlük Not (yerel)",
      saveNote: "Notu kaydet",
      badgeUnlocked: "Açıldı",
      badgeLocked: "Kilitli",
      details: "Detaylar",
      noteSaved: "Not kaydedildi ✅",
      chooseTechnique: "Bir teknik seç",
      techniquePrompt: "Detayları görmek için bir seans tipi veya teknik seçin.",
      techniquePattern: "Ritim: Nefes al {{inhale}} sn · {{holdLabel}}{{exhale}} sn",
      streakHintNone: "Henüz seri yok. Bugün yapılacak 2 dakikalık pratik bile harika bir başlangıç.",
      streakHintGood: "Güzel tutarlılık. Birkaç bilinçli nefes sinir sistemini yeniden şekillendirir.",
      streakHintKeep: "Her gün nefeslenmeye devam et. Seriler alışkanlık oluşturmayı kolaylaştırır.",
      ready: "Hazır",
      tapToBegin: "Başlamak için dokun",
      getReady: "Hazırlan",
      paused: "Duraklatıldı",
      tapToResume: "Devam etmek için dokun",
      tapToPause: "Duraklatmak için dokun",
      inhaleHint: "Nefes al",
      exhaleHint: "Nefes ver",
      holdHint: "Bekle",
      howToPractice: "Nasıl yapılır",
      whyItWorks: "Neden işe yarar",
      cautionPrefix: "Uyarı:",
      startTechnique: "Bu teknikle başla",
      themeLabel: "Tema",
      themeAurora: "Aurora",
      themeSunrise: "Gün Doğumu",
      themeForest: "Orman",
      themeLight: "Aydınlık",
      primaryColorLabel: "Ana renk",
      accentColorLabel: "Vurgu rengi",
      shapeLabel: "Şekil",
      overlayLabel: "Simgeler",
      breathStyleDefault: "Rahat burun nefesi.",
      daysSuffix: "gün",
      minutesSuffix: "dk",
    },
  };

  function t(key, fallback = "", vars = {}) {
    const dict = translations[currentLocale] || translations.en;
    let text = dict[key] || fallback || translations.en[key];
    Object.entries(vars).forEach(([k, v]) => {
      text = text?.replace?.(`{{${k}}}`, v);
    });
    return text || fallback || key;
  }

  function localizedTechnique(tech) {
    if (!tech) return tech;
    const localized = tech.translations?.[currentLocale];
    if (!localized) return tech;
    return { ...tech, ...localized, pattern: tech.pattern, sessionType: tech.sessionType, id: tech.id };
  }

  const STORAGE_KEY = "breathAuroraProfiles";
  const SOUND_PREF_KEY = "breathAurora_soundEnabled";
  const LANG_KEY = "breathAurora_lang";
  const ACTIVE_PROFILE_KEY = "breathAurora_activeProfileId";
  const THEME_KEY = "breathAurora_theme";

  let setActiveView = () => {};
  let currentView = "coach";
  let activePaletteId = localStorage.getItem(THEME_KEY) || "aurora";

  const DEFAULT_BADGES = [
    {
      id: "first-session",
      label: "First Breath",
      desc: "Complete your very first guided session.",
      emoji: "🌱",
    },
    {
      id: "streak-3",
      label: "3-Day Streak",
      desc: "Breathe at least once a day for 3 days.",
      emoji: "🔥",
    },
    {
      id: "streak-7",
      label: "7-Day Streak",
      desc: "Hold a breathing streak for 7 days.",
      emoji: "🌈",
    },
    {
      id: "minutes-60",
      label: "1 Hour of Presence",
      desc: "Accumulate 60 total minutes of practice.",
      emoji: "⏱️",
    },
    {
      id: "night-owl",
      label: "Night Owl",
      desc: "Complete a session after 22:00.",
      emoji: "🌙",
    },
    {
      id: "calm-first",
      label: "First Calm Session",
      desc: "Finish a calm practice.",
      emoji: "💧",
    },
    {
      id: "focus-10",
      label: "Box Breathing Apprentice",
      desc: "Complete 10 focus sessions.",
      emoji: "📦",
    },
    {
      id: "sleep-5",
      label: "Sleep Guardian",
      desc: "Finish 5 sleep sessions.",
      emoji: "🛏️",
    },
  ];

  function todayKey() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  function yesterdayKey() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  function ensureAvatarDefaults(profile) {
    if (!profile.avatar) {
      profile.avatar = {
        color: "teal",
        accent: "yellow",
        shape: "circle",
        overlay: "",
      };
    }
    return profile;
  }

  function loadProfiles() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const obj = JSON.parse(raw);
        if (obj && typeof obj === "object") {
          Object.values(obj).forEach(ensureAvatarDefaults);
          return obj;
        }
      }
    } catch {}
    const guest = {
      name: "Guest",
      createdAt: todayKey(),
      lastPracticeDate: null,
      currentStreak: 0,
      bestStreak: 0,
      totalSessions: 0,
      totalMinutes: 0,
      badges: {},
      flags: {},
      notesByDate: {},
      typeCounts: {},
      avatar: { color: "teal", accent: "yellow", shape: "circle", overlay: "" },
    };
    const profiles = { Guest: guest };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
    return profiles;
  }

  function saveProfiles(profiles) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
  }

  let profiles = loadProfiles();
  let currentProfileId = null;

  function getCurrentProfile() {
    return profiles[currentProfileId];
  }

  function ensureProfile(name) {
    if (!profiles[name]) {
      profiles[name] = ensureAvatarDefaults({
        name,
        createdAt: todayKey(),
        lastPracticeDate: null,
        currentStreak: 0,
        bestStreak: 0,
        totalSessions: 0,
        totalMinutes: 0,
        badges: {},
        flags: {},
        notesByDate: {},
        typeCounts: {},
        avatar: { color: "teal", accent: "yellow", shape: "circle", overlay: "" },
      });
    }
    ensureAvatarDefaults(profiles[name]);
    return profiles[name];
  }

  function setCurrentProfile(profileId) {
    if (!profiles[profileId]) return;
    currentProfileId = profileId;
    localStorage.setItem(ACTIVE_PROFILE_KEY, profileId);
    const sel = $("#profileSelect");
    if (sel) sel.value = profileId;
    $("#profileTagline").textContent = t("profileTagline", `${profileId}, your breath is your superpower.`, {
      name: profileId,
    });
    refreshProfileUI();
    renderAvatar();
  }

  function showToast(message) {
    const toast = $("#toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2500);
  }

  function awardBadges(profile, sessionType) {
    const unlocked = profile.badges || {};
    const tSessions = profile.totalSessions || 0;
    const tMinutes = profile.totalMinutes || 0;
    const streak = profile.bestStreak || 0;
    const flags = profile.flags || {};
    const typeCounts = profile.typeCounts || {};

    if (tSessions >= 1 && !unlocked["first-session"]) {
      unlocked["first-session"] = true;
      showToast("🎉 Badge unlocked: First Breath");
    }
    if (streak >= 3 && !unlocked["streak-3"]) {
      unlocked["streak-3"] = true;
      showToast("🔥 3-day streak!");
    }
    if (streak >= 7 && !unlocked["streak-7"]) {
      unlocked["streak-7"] = true;
      showToast("🌈 7-day streak!");
    }
    if (tMinutes >= 60 && !unlocked["minutes-60"]) {
      unlocked["minutes-60"] = true;
      showToast("⏱️ 60 mindful minutes");
    }
    if (flags.nightOwl && !unlocked["night-owl"]) {
      unlocked["night-owl"] = true;
      showToast("🌙 Night owl badge");
    }
    if (sessionType === "calm" && typeCounts.calm >= 1 && !unlocked["calm-first"]) {
      unlocked["calm-first"] = true;
      showToast("💧 First calm session");
    }
    if (sessionType === "focus" && typeCounts.focus >= 10 && !unlocked["focus-10"]) {
      unlocked["focus-10"] = true;
      showToast("📦 Box Breathing Apprentice");
    }
    if (sessionType === "sleep" && typeCounts.sleep >= 5 && !unlocked["sleep-5"]) {
      unlocked["sleep-5"] = true;
      showToast("🛏️ Sleep Guardian");
    }

    profile.badges = unlocked;
  }

  function recordSession(durationMinutes, sessionType) {
    const profile = getCurrentProfile();
    if (!profile) return;
    const today = todayKey();
    const yesterday = yesterdayKey();

    if (profile.lastPracticeDate === today) {
      // streak unchanged
    } else if (profile.lastPracticeDate === yesterday) {
      profile.currentStreak = (profile.currentStreak || 0) + 1;
    } else {
      profile.currentStreak = 1;
    }

    profile.bestStreak = Math.max(profile.bestStreak || 0, profile.currentStreak || 0);
    profile.lastPracticeDate = today;
    profile.totalSessions = (profile.totalSessions || 0) + 1;
    profile.totalMinutes = (profile.totalMinutes || 0) + durationMinutes;

    const hour = new Date().getHours();
    if (hour >= 22 || hour < 5) {
      profile.flags = profile.flags || {};
      profile.flags.nightOwl = true;
    }

    profile.typeCounts = profile.typeCounts || {};
    profile.typeCounts[sessionType] = (profile.typeCounts[sessionType] || 0) + 1;

    awardBadges(profile, sessionType);
    saveProfiles(profiles);
    refreshProfileUI();
  }

  // Sound cues via oscillator
  const soundToggle = $("#soundToggle");
  const soundEnabledStored = localStorage.getItem(SOUND_PREF_KEY);
  let soundEnabled = soundEnabledStored !== "false";
  if (soundToggle) soundToggle.checked = soundEnabled;

  const audioCtx = (window.AudioContext && new AudioContext()) || null;

  function playTone(freq) {
    if (!audioCtx || !soundEnabled) return;
    if (audioCtx.state === "suspended") audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const now = audioCtx.currentTime;
    osc.frequency.setValueAtTime(freq, now);
    osc.type = "sine";
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.4);
  }

  function playPhaseSound(phase) {
    if (phase === "inhale") playTone(560);
    else if (phase === "hold") playTone(440);
    else if (phase === "exhale") playTone(320);
  }

  // Breathing engine state
  const breathCircle = $("#breathCircle");
  const breathCoreButton = $("#breathCoreButton");
  const breathCoreLabel = $("#breathCoreLabel");
  const breathCoreSub = $("#breathCoreSub");

  const sessionEngine = {
    sessionType: "calm",
    pattern: { ...SESSION_TYPES.calm.pattern },
    phases: [],
    phaseIndex: 0,
    phaseStartTime: 0,
    phaseEndTime: 0,
    sessionDurationMs: 0,
    startedAt: 0,
    pausedRemainingMs: 0,
    timerId: null,
  };

  let sessionState = "idle"; // idle | countdown | running | paused | finished
  let countdownValue = 0;
  let currentPhase = "idle";
  let remainingSeconds = 0;

  const coachTechTitle = document.getElementById("coachTechTitle");
  const coachTechPattern = document.getElementById("coachTechPattern");
  const coachTechSummary = document.getElementById("coachTechSummary");
  const coachTechWhy = document.getElementById("coachTechWhy");
  let currentTechnique = null;
  const themeSelect = document.getElementById("themeSelect");
  const themeSwatches = document.getElementById("themeSwatches");
  const profileChipAvatar = document.getElementById("profileChipAvatar");
  const profileChipName = document.getElementById("profileChipName");
  const avatarShapeEl = document.getElementById("avatarShape");
  const avatarInnerEl = document.getElementById("avatarInner");
  const colorSwatches = document.querySelectorAll(".avatar-color-swatch");
  const accentSwatches = document.querySelectorAll(".avatar-accent-swatch");
  const shapeButtons = document.querySelectorAll(".avatar-shape-btn");
  const overlayButtons = document.querySelectorAll(".avatar-overlay-btn");

  let currentLocale = localStorage.getItem(LANG_KEY) || "en";

  function updateProgress(progressFraction) {
    const root = document.documentElement;
    const clamped = Math.max(0, Math.min(1, progressFraction || 0));
    root.style.setProperty("--progress", String(clamped * 100));
  }

  function getActivePalette() {
    return THEMES[activePaletteId] || THEMES.aurora;
  }

  function applyPalette(themeId = activePaletteId, skipSave = false) {
    const palette = THEMES[themeId] || THEMES.aurora;
    activePaletteId = palette.id;
    if (!skipSave) localStorage.setItem(THEME_KEY, activePaletteId);
    const root = document.documentElement;
    const v = palette.values;
    root.style.setProperty("--bg", v.bg);
    root.style.setProperty("--bg-soft", v.bgSoft);
    root.style.setProperty("--panel", v.panel);
    root.style.setProperty("--card", v.card);
    root.style.setProperty("--card-soft", v.cardSoft);
    root.style.setProperty("--text", v.text);
    root.style.setProperty("--text-soft", v.textSoft);
    root.style.setProperty("--accent", v.accent);
    root.style.setProperty("--accent-soft", v.accentSoft);
    root.style.setProperty("--accent-strong", v.accentStrong);
    root.style.setProperty("--border-soft", `1px solid ${hexToRgba(v.textSoft || "#94a3b8", 0.25)}`);
    root.style.setProperty(
      "--shadow-soft",
      palette.id === "light" ? "0 10px 30px rgba(0, 0, 0, 0.1)" : "0 12px 40px rgba(15, 23, 42, 0.9)"
    );
    root.dataset.theme = palette.id;
    applyTheme(sessionEngine.sessionType, true);
  }

  function applyTheme(typeId, fromPalette = false) {
    const type = SESSION_TYPES[typeId] || SESSION_TYPES.calm;
    const root = document.documentElement;
    const circle = breathCircle;
    const phase = sessionEngine.phases[sessionEngine.phaseIndex]?.type || "idle";
    const colors = type.colors;
    const colorForPhase = colors[phase] || colors.inhale;
    const palette = getActivePalette();
    const background = palette.values.background || colors.background;
    root.style.setProperty("--phase-color", colorForPhase);
    root.style.setProperty("--phase-shadow", hexToRgba(colorForPhase, 0.35));
    root.style.setProperty("--bg-gradient", background);
    if (circle) {
      circle.dataset.sessionType = typeId;
      circle.dataset.phase = phase;
      circle.style.transitionTimingFunction = type.easing || "ease-in-out";
    }
    if (!fromPalette) {
      document.documentElement.dataset.sessionType = typeId;
    }
  }

  function hexToRgba(hex, alpha) {
    const value = hex.replace("#", "");
    const bigint = parseInt(value, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  function patternCycleSeconds(pattern) {
    return Math.max(
      1,
      (pattern.inhale || 0) + (pattern.hold || 0) + (pattern.exhale || 0) + (pattern.holdEmpty || 0)
    );
  }

  function buildPhases(pattern, cycles) {
    const totalCycles = Math.max(1, Math.round(cycles || 1));
    const phases = [];
    for (let i = 0; i < totalCycles; i++) {
      phases.push({ label: t("inhaleHint", "Inhale"), type: "inhale", duration: pattern.inhale || 0 });
      if (pattern.hold)
        phases.push({ label: t("holdHint", "Hold"), type: "hold", duration: pattern.hold });
      phases.push({ label: t("exhaleHint", "Exhale"), type: "exhale", duration: pattern.exhale || 0 });
      if (pattern.holdEmpty)
        phases.push({ label: t("holdHint", "Hold"), type: "hold", duration: pattern.holdEmpty });
    }
    return phases.filter((p) => p.duration > 0);
  }

  function getDefaultCycles(pattern, sessionMeta) {
    const typeMeta = sessionMeta || SESSION_TYPES[sessionEngine.sessionType];
    const minutes = typeMeta?.durationMinutes || 5;
    const cycleSeconds = patternCycleSeconds(pattern);
    return Math.max(1, Math.round((minutes * 60) / cycleSeconds));
  }

  function updateCoreButtonUI() {
    if (!breathCoreButton) return;
    breathCoreButton.classList.remove("is-paused", "is-running");
    const readyLabel = t("ready", "Ready");
    const readySub = t("tapToBegin", "Tap to begin");
    const countdownSub = t("getReady", "Get ready");
    const pausedLabel = t("paused", "Paused");
    const pausedSub = t("tapToResume", "Tap to resume");
    const pauseHint = t("tapToPause", "Tap to pause");
    const phaseLabels = {
      inhale: t("inhaleHint", "Inhale"),
      hold: t("holdHint", "Hold"),
      exhale: t("exhaleHint", "Exhale"),
    };

    if (sessionState === "idle" || sessionState === "finished") {
      breathCoreLabel.textContent = readyLabel;
      breathCoreSub.textContent = readySub;
    } else if (sessionState === "countdown") {
      breathCoreLabel.textContent = String(countdownValue || 0);
      breathCoreSub.textContent = countdownSub;
    } else if (sessionState === "running") {
      const phaseText = phaseLabels[currentPhase] || (currentPhase || "").toUpperCase();
      breathCoreLabel.textContent = phaseText.toUpperCase();
      breathCoreSub.textContent = `${Math.max(0, Math.ceil(remainingSeconds || 0))}s · ${pauseHint}`;
      breathCoreButton.classList.add("is-running");
    } else if (sessionState === "paused") {
      breathCoreLabel.textContent = pausedLabel;
      breathCoreSub.textContent = pausedSub;
      breathCoreButton.classList.add("is-paused");
    }

    breathCoreButton.setAttribute(
      "aria-label",
      `${breathCoreLabel.textContent}. ${breathCoreSub.textContent}`
    );
  }

  function resetToReady() {
    sessionState = "idle";
    sessionEngine.phaseIndex = 0;
    sessionEngine.phases = [];
    sessionEngine.sessionDurationMs = 0;
    sessionEngine.pausedRemainingMs = 0;
    countdownValue = 0;
    currentPhase = "idle";
    remainingSeconds = 0;
    updateProgress(0);
    breathCircle.dataset.phase = "idle";
    $("#phaseLabel").textContent = "—";
    $("#phaseCountdown").textContent = "00.0 s";
    $("#sessionProgressText").textContent = "0%";
    $("#startBtn").disabled = false;
    $("#stopBtn").disabled = true;
    updateCoreButtonUI();
  }

  function updatePhaseUI(phase, remaining, overall) {
    const labelEl = $("#phaseLabel");
    const countdownEl = $("#phaseCountdown");
    const progressText = $("#sessionProgressText");

    if (!phase) {
      resetToReady();
      return;
    }

    const hints = {
      inhale: t("inhaleHint", "Breathe in softly"),
      exhale: t("exhaleHint", "Slow relaxed exhale"),
      hold: t("holdHint", "Hold gently"),
    };

    labelEl.textContent = phase.label.toUpperCase();
    breathCircle.dataset.phase = phase.type;
    countdownEl.textContent = `${remaining.toFixed(1)} s`;
    progressText.textContent = `${Math.round(overall * 100)}%`;
    currentPhase = phase.type;
    remainingSeconds = remaining;
    breathCoreSub.textContent = `${Math.ceil(remaining)}s · ${hints[phase.type]}`;
    updateCoreButtonUI();
  }

  function beginBreathing() {
    const type = SESSION_TYPES[sessionEngine.sessionType] || SESSION_TYPES.calm;
    const cycles = getTargetCycles();
    sessionEngine.pattern = { ...type.pattern };
    sessionEngine.phases = buildPhases(sessionEngine.pattern, cycles);
    sessionEngine.phaseIndex = 0;
    sessionEngine.sessionDurationMs =
      sessionEngine.phases.reduce((sum, p) => sum + p.duration, 0) * 1000;
    sessionEngine.startedAt = performance.now();
    sessionState = "running";
    const first = sessionEngine.phases[0];
    const now = performance.now();
    sessionEngine.phaseStartTime = now;
    sessionEngine.phaseEndTime = now + (first.duration || 1) * 1000;
    currentPhase = first.type;
    remainingSeconds = first.duration;
    $("#startBtn").disabled = true;
    $("#stopBtn").disabled = false;
    playPhaseSound(first.type);
    updateCoreButtonUI();
    tickSession();
  }

  function startCountdown() {
    if (sessionState === "running") return;
    sessionState = "countdown";
    countdownValue = 3;
    updateCoreButtonUI();
    const interval = setInterval(() => {
      if (sessionState !== "countdown") {
        clearInterval(interval);
        return;
      }
      countdownValue -= 1;
      if (countdownValue <= 0) {
        clearInterval(interval);
        beginBreathing();
        return;
      }
      updateCoreButtonUI();
    }, 1000);
  }

  function pauseSession() {
    if (sessionState !== "running") return;
    sessionState = "paused";
    sessionEngine.pausedRemainingMs = sessionEngine.phaseEndTime - performance.now();
    if (sessionEngine.timerId) cancelAnimationFrame(sessionEngine.timerId);
    updateCoreButtonUI();
  }

  function resumeSession() {
    if (sessionState !== "paused") return;
    const now = performance.now();
    const phase = sessionEngine.phases[sessionEngine.phaseIndex];
    const phaseDurationMs = (phase?.duration || 0) * 1000;
    const elapsed = Math.max(0, phaseDurationMs - sessionEngine.pausedRemainingMs);
    sessionEngine.phaseStartTime = now - elapsed;
    sessionEngine.phaseEndTime = now + sessionEngine.pausedRemainingMs;
    sessionState = "running";
    sessionEngine.pausedRemainingMs = 0;
    updateCoreButtonUI();
    tickSession();
  }

  function stopSession(completed) {
    if (sessionEngine.timerId) cancelAnimationFrame(sessionEngine.timerId);
    sessionEngine.timerId = null;
    if (completed && sessionEngine.sessionDurationMs > 0) {
      const minutes = Math.max(1, Math.round(sessionEngine.sessionDurationMs / 1000 / 60));
      recordSession(minutes, sessionEngine.sessionType);
    }
    resetToReady();
    sessionState = completed ? "finished" : "idle";
    updateCoreButtonUI();
  }

  function tickSession() {
    if (sessionState !== "running") return;
    const now = performance.now();
    const phase = sessionEngine.phases[sessionEngine.phaseIndex];
    if (!phase) {
      stopSession(true);
      return;
    }

    const remainingMs = sessionEngine.phaseEndTime - now;
    if (remainingMs <= 0) {
      sessionEngine.phaseIndex += 1;
      const next = sessionEngine.phases[sessionEngine.phaseIndex];
      if (!next) {
        stopSession(true);
        return;
      }
      sessionEngine.phaseStartTime = now;
      sessionEngine.phaseEndTime = now + next.duration * 1000;
      currentPhase = next.type;
      remainingSeconds = next.duration;
      playPhaseSound(next.type);
      applyTheme(sessionEngine.sessionType);
    }

    const current = sessionEngine.phases[sessionEngine.phaseIndex];
    const phaseElapsed = now - sessionEngine.phaseStartTime;
    const phaseDuration = current.duration * 1000;
    const phaseRemaining = Math.max(0, (phaseDuration - phaseElapsed) / 1000);
    const elapsedTotal = now - sessionEngine.startedAt;
    const overallProgress = Math.min(1, elapsedTotal / sessionEngine.sessionDurationMs);
    const phaseProgress = Math.max(0, Math.min(1, phaseElapsed / phaseDuration));

    updateProgress(phaseProgress);
    updatePhaseUI(current, phaseRemaining, overallProgress);
    applyTheme(sessionEngine.sessionType);

    sessionEngine.timerId = requestAnimationFrame(tickSession);
  }

  // Library + UI helpers

  function renderCoachTechniqueInfo() {
    if (!currentTechnique) {
      if (coachTechTitle) coachTechTitle.textContent = t("chooseTechnique", "Choose a technique");
      if (coachTechPattern) coachTechPattern.textContent = "";
      if (coachTechSummary) coachTechSummary.textContent = t("techniquePrompt");
      if (coachTechWhy) coachTechWhy.textContent = "";
      return;
    }

    const pat = currentTechnique.pattern || {};
    const inhale = pat.inhale ?? "-";
    const hold = (pat.hold ?? pat.holdFull ?? 0) || 0;
    const exhale = pat.exhale ?? "-";

    if (coachTechTitle) coachTechTitle.textContent = currentTechnique.label || currentTechnique.name || "Custom Session";
    if (coachTechPattern)
      coachTechPattern.textContent = t("techniquePattern", "Pattern: Inhale {{inhale}}s · {{holdLabel}}{{exhale}}s", {
        inhale,
        holdLabel: hold ? `${t("holdHint", "Hold")} ${hold}s · ` : "",
        exhale,
      });
    if (coachTechSummary) coachTechSummary.textContent = currentTechnique.summary || "";
    if (coachTechWhy) coachTechWhy.textContent = currentTechnique.whyItWorks || "";
  }

  function useTechnique(techMeta) {
    if (!techMeta) return;
    currentTechnique = techMeta;
    $("#breathStyleLabel").textContent = techMeta.summary || "";
    $("#techniqueShort").textContent = techMeta.summary || "";
    const tagsContainer = $("#techniqueTags");
    tagsContainer.innerHTML = "";
    [techMeta.level, techMeta.sessionType].forEach((tag) => {
      const span = document.createElement("span");
      span.className = "chip chip-primary";
      span.textContent = tag;
      tagsContainer.appendChild(span);
    });
    sessionEngine.sessionType = techMeta.sessionType;
    sessionEngine.pattern = { ...techMeta.pattern };
    const defaultCycles = getDefaultCycles(sessionEngine.pattern, SESSION_TYPES[techMeta.sessionType]);
    const roundsInput = $("#roundsInput");
    if (roundsInput) roundsInput.value = defaultCycles;
    $$(".chip-toggle").forEach((chip) => {
      chip.classList.toggle("chip-active", chip.getAttribute("data-intent") === techMeta.sessionType);
    });
    applyTheme(sessionEngine.sessionType);
    updateEstimatedTime();
    renderCoachTechniqueInfo();
  }

  function initTechniqueSelect(selectedId = null) {
    const sel = $("#techniqueSelect");
    sel.innerHTML = "";
    BREATH_LIBRARY.forEach((t) => {
      const localized = localizedTechnique(t);
      const opt = document.createElement("option");
      opt.value = t.id;
      opt.textContent = `${localized.label} · ${localized.level}`;
      sel.appendChild(opt);
    });
    const desired = selectedId && BREATH_LIBRARY.find((t) => t.id === selectedId) ? selectedId : BREATH_LIBRARY[0].id;
    sel.value = desired;
    refreshTechniqueInfo();
  }

  function refreshTechniqueInfo() {
    const techId = $("#techniqueSelect").value;
    const tech = BREATH_LIBRARY.find((t) => t.id === techId) || BREATH_LIBRARY[0];
    useTechnique(localizedTechnique(tech));
  }

  function getTargetCycles() {
    const type = SESSION_TYPES[sessionEngine.sessionType];
    const pattern = sessionEngine.pattern || type.pattern;
    const inputVal = Number($("#roundsInput").value);
    if (Number.isFinite(inputVal) && inputVal > 0) {
      return Math.min(99, Math.round(inputVal));
    }
    return getDefaultCycles(pattern, type);
  }

  function formatDurationSeconds(totalSeconds) {
    if (totalSeconds < 60) return `${Math.round(totalSeconds)}s`;
    const minutes = totalSeconds / 60;
    if (minutes >= 90) return `${(minutes / 60).toFixed(1)} h`;
    if (minutes >= 10) return `${minutes.toFixed(0)} min`;
    return `${minutes.toFixed(1)} min`;
  }

  function updateEstimatedTime() {
    const type = SESSION_TYPES[sessionEngine.sessionType];
    const pattern = sessionEngine.pattern || type.pattern;
    const cycleSeconds = patternCycleSeconds(pattern);
    const cycles = getTargetCycles();
    const totalSeconds = cycles * cycleSeconds;
    const estText = formatDurationSeconds(totalSeconds);
    const baseText = t("estimatedDuration", "Estimated duration: {{time}} ({{cycles}} cycles)", {
      time: estText,
      cycles,
    });
    const cycleText = t("cycleLength", "Each cycle: {{seconds}}s", { seconds: cycleSeconds });
    $("#estimatedTime").textContent = `${baseText} · ${cycleText}`;
  }

  function initThemePicker() {
    if (!themeSelect) return;
    themeSelect.innerHTML = "";
    Object.values(THEMES).forEach((theme) => {
      const opt = document.createElement("option");
      opt.value = theme.id;
      opt.textContent = t(theme.labelKey, theme.labelKey);
      themeSelect.appendChild(opt);
    });
    themeSelect.value = activePaletteId;
    themeSelect.onchange = () => applyPalette(themeSelect.value);

    if (themeSwatches) {
      themeSwatches.innerHTML = "";
      Object.values(THEMES).forEach((theme) => {
        const swatch = document.createElement("button");
        swatch.type = "button";
        swatch.className = "theme-swatch" + (theme.id === activePaletteId ? " is-active" : "");
        swatch.style.background = theme.values.accent;
        swatch.title = t(theme.labelKey, theme.id);
        swatch.addEventListener("click", () => {
          applyPalette(theme.id);
          initThemePicker();
        });
        themeSwatches.appendChild(swatch);
      });
    }
  }

  function initLibrary() {
    const container = $("#techLibrary");
    const detail = $("#libraryDetail");
    container.innerHTML = "";
    BREATH_LIBRARY.forEach((t) => {
      const localized = localizedTechnique(t);
      const card = document.createElement("div");
      card.className = "card";
      const tags = `<div class="chip-row small"><span class="chip">${localized.level}</span><span class="chip">${localized.sessionType}</span></div>`;
      card.innerHTML = `
        <div class="library-card-title">
          <h3>${localized.label}</h3>
          <span class="chip chip-primary">${localized.level}</span>
        </div>
        <p class="small text-muted">${localized.summary}</p>
        <p class="small text-muted"><strong>Pattern:</strong> inhale ${localized.pattern.inhale || 0} · hold ${localized.pattern.hold || 0} · exhale ${localized.pattern.exhale || 0}${localized.pattern.holdEmpty ? ` · hold ${localized.pattern.holdEmpty}` : ""}</p>
        ${tags}
        <div class="library-card-action">
          <button class="btn btn-soft btn-small" data-view-detail="${t.id}">${t("details", "Details")}</button>
          <button class="btn btn-primary btn-small" data-start-tech="${t.id}">${t("startBtn", "Start session")}</button>
        </div>
      `;
      container.appendChild(card);
    });

    if (!container.dataset.bound) {
      container.addEventListener("click", (e) => {
        const detailId = e.target.getAttribute("data-view-detail");
        const startId = e.target.getAttribute("data-start-tech");
        if (detailId) {
          renderDetail(detailId);
          const tech = BREATH_LIBRARY.find((t) => t.id === detailId);
          if (tech) {
            $("#techniqueSelect").value = tech.id;
            useTechnique(localizedTechnique(tech));
          }
        }
        if (startId) startFromLibrary(startId);
      });
      container.dataset.bound = "true";
    }

    const currentDetailId = $("#techniqueSelect")?.value || BREATH_LIBRARY[0].id;
    renderDetail(currentDetailId);
  }

  function renderDetail(id) {
    const tech = localizedTechnique(BREATH_LIBRARY.find((t) => t.id === id));
    const detail = $("#libraryDetail");
    if (!tech || !detail) return;
    detail.innerHTML = `
      <h3>${tech.label}</h3>
      <div class="detail-meta">
        <span>${tech.level}</span>
        <span>${tech.sessionType}</span>
        <span>${tech.pattern.inhale || 0}/${tech.pattern.hold || 0}/${tech.pattern.exhale || 0}${tech.pattern.holdEmpty ? `/${tech.pattern.holdEmpty}` : ""}</span>
      </div>
      <p>${tech.summary}</p>
      <h4>${t("howToPractice", "How to practice")}</h4>
      <ul>${tech.howTo.map((step) => `<li>${step}</li>`).join("")}</ul>
      <h4>${t("whyItWorks", "Why it works")}</h4>
      <p>${tech.whyItWorks}</p>
      <p class="text-muted small"><strong>${t("cautionPrefix", "Caution:")}</strong> ${tech.cautions}</p>
      <button class="btn btn-primary" data-start-tech="${tech.id}">${t("startTechnique", "Start this technique")}</button>
    `;
    detail.querySelector("button[data-start-tech]").addEventListener("click", () =>
      startFromLibrary(tech.id)
    );
  }

  function startFromLibrary(id) {
    const tech = BREATH_LIBRARY.find((t) => t.id === id);
    if (!tech) return;
    $("#techniqueSelect").value = tech.id;
    $("#roundsInput").value = getDefaultCycles(tech.pattern, SESSION_TYPES[tech.sessionType]);
    useTechnique(localizedTechnique(tech));
    setActiveView("coach");
    resetToReady();
  }

  function initProfilesUI() {
    const sel = $("#profileSelect");
    sel.innerHTML = "";
    Object.keys(profiles).forEach((name) => {
      const opt = document.createElement("option");
      opt.value = name;
      opt.textContent = name;
      sel.appendChild(opt);
    });
    const firstProfile = Object.keys(profiles)[0];
    const targetProfile = currentProfileId && profiles[currentProfileId] ? currentProfileId : firstProfile;
    if (targetProfile) setCurrentProfile(targetProfile);
  }

  function refreshProfileUI() {
    const profile = getCurrentProfile();
    if (!profile) return;
    ensureAvatarDefaults(profile);
    const daySuffix = t("daysSuffix", "days");
    const minSuffix = t("minutesSuffix", "min");
    $("#statCurrentStreak").textContent = `${profile.currentStreak || 0} ${daySuffix}`;
    $("#statBestStreak").textContent = `${profile.bestStreak || 0} ${daySuffix}`;
    $("#statTotalSessions").textContent = profile.totalSessions || 0;
    $("#statTotalMinutes").textContent = `${profile.totalMinutes || 0} ${minSuffix}`;

    const maxForBar = Math.max(7, profile.bestStreak || 0);
    const barPercent = Math.min(100, ((profile.currentStreak || 0) / maxForBar) * 100);
    $("#streakFill").style.width = `${barPercent}%`;

    const streakHint = $("#streakHint");
    if (!profile.lastPracticeDate) {
      streakHint.textContent = t("streakHintNone");
    } else if (profile.currentStreak >= 3) {
      streakHint.textContent = t("streakHintGood");
    } else {
      streakHint.textContent = t("streakHintKeep");
    }

    const badgeGrid = $("#badgeGrid");
    badgeGrid.innerHTML = "";
    const unlocked = profile.badges || {};
    DEFAULT_BADGES.forEach((b) => {
      const div = document.createElement("div");
      div.className = "badge-card" + (unlocked[b.id] ? " unlocked" : "");
      const statusLabel = unlocked[b.id] ? t("badgeUnlocked", "Unlocked") : t("badgeLocked", "Locked");
      div.innerHTML = `
        <div class="badge-meta">
          <span class="badge-title">${b.emoji} ${b.label}</span>
          <span class="badge-chip">${statusLabel}</span>
        </div>
        <p>${b.desc}</p>
      `;
      badgeGrid.appendChild(div);
    });

    const tk = todayKey();
    $("#dailyNote").value = profile.notesByDate?.[tk] || "";
    $("#todayMinutesLabel").textContent = `${profile.totalMinutes || 0} ${minSuffix}`;
  }

  function renderAvatar() {
    const profile = getCurrentProfile();
    if (!profile) return;
    ensureAvatarDefaults(profile);

    const { color, accent, shape, overlay } = profile.avatar;

    if (avatarShapeEl) avatarShapeEl.dataset.shape = shape;

    const colorMap = {
      teal: "#14b8a6",
      blue: "#3b82f6",
      purple: "#a855f7",
      amber: "#f59e0b",
      coral: "#fb7185",
      emerald: "#10b981",
    };
    const accentMap = {
      yellow: "#facc15",
      pink: "#ec4899",
      lime: "#84cc16",
      sky: "#0ea5e9",
      lavender: "#c084fc",
    };

    const baseColor = colorMap[color] || "#38bdf8";
    const accentColor = accentMap[accent] || "#facc15";

    if (avatarInnerEl) {
      avatarInnerEl.style.background = `radial-gradient(circle at top, ${accentColor}, ${baseColor})`;
      avatarInnerEl.style.boxShadow = `0 0 24px ${baseColor}80`;
      avatarInnerEl.setAttribute("data-overlay", overlay || "");
    }

    colorSwatches.forEach((s) => s.classList.toggle("is-active", s.dataset.color === color));
    accentSwatches.forEach((s) => s.classList.toggle("is-active", s.dataset.accent === accent));
    shapeButtons.forEach((btn) => btn.classList.toggle("avatar-shape-btn--active", btn.dataset.shape === shape));
    overlayButtons.forEach((btn) => btn.classList.toggle("avatar-overlay-btn--active", btn.dataset.overlay === overlay));

    if (profileChipAvatar) {
      profileChipAvatar.dataset.shape = shape;
      profileChipAvatar.setAttribute("data-overlay", overlay || "");
      profileChipAvatar.style.background = `radial-gradient(circle at top, ${accentColor}, ${baseColor})`;
      profileChipAvatar.style.boxShadow = `0 0 10px ${baseColor}60`;
    }
    if (profileChipName) profileChipName.textContent = profile.name || currentProfileId || "";
  }

  function applyLocale(lang) {
    currentLocale = lang;
    localStorage.setItem(LANG_KEY, lang);
    document.documentElement.lang = lang;
    const currentTechId = $("#techniqueSelect")?.value;
    const dict = translations[lang] || translations.en;
    $$('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) el.textContent = dict[key];
    });
    initThemePicker();
    initTechniqueSelect(currentTechId);
    initLibrary();
    resetToReady();
    refreshTechniqueInfo();
    refreshProfileUI();
    if (currentProfileId) setCurrentProfile(currentProfileId);
  }

  document.addEventListener("DOMContentLoaded", () => {
    const VIEWS = {
      coach: document.getElementById("view-coach"),
      library: document.getElementById("view-library"),
      profile: document.getElementById("view-profile"),
    };

    const navButtons = document.querySelectorAll(".nav-btn[data-view-target]");

    setActiveView = (target) => {
      if (!VIEWS[target]) return;
      currentView = target;
      Object.entries(VIEWS).forEach(([id, el]) => {
        if (!el) return;
        el.classList.toggle("view--active", id === target);
      });

      navButtons.forEach((btn) => {
        const isActive = btn.dataset.viewTarget === target;
        btn.classList.toggle("nav-btn--active", isActive);
      });
    };

    navButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = btn.dataset.viewTarget;
        setActiveView(target);
        if (target === "profile") {
          renderAvatar();
        }
      });
    });

    const savedProfileId = localStorage.getItem(ACTIVE_PROFILE_KEY);
    if (savedProfileId && profiles[savedProfileId]) {
      currentProfileId = savedProfileId;
    }

    initTechniqueSelect();
    initLibrary();
    initProfilesUI();
    applyPalette(activePaletteId, true);
    initThemePicker();
    applyLocale(currentLocale);
    setActiveView("coach");

    $("#roundsInput").addEventListener("input", updateEstimatedTime);
    $("#techniqueSelect").addEventListener("change", refreshTechniqueInfo);

    $$(".chip-toggle").forEach((chip) => {
      chip.addEventListener("click", () => {
        $$(".chip-toggle").forEach((c) => c.classList.remove("chip-active"));
        chip.classList.add("chip-active");
        sessionEngine.sessionType = chip.getAttribute("data-intent");
        sessionEngine.pattern = { ...SESSION_TYPES[sessionEngine.sessionType].pattern };
        applyTheme(sessionEngine.sessionType);
        updateEstimatedTime();
        renderCoachTechniqueInfo();
      });
    });

    $("#startBtn").addEventListener("click", () => startCountdown());
    $("#stopBtn").addEventListener("click", () => stopSession(false));

    breathCoreButton.addEventListener("click", () => {
      if (sessionState === "idle" || sessionState === "finished") {
        startCountdown();
      } else if (sessionState === "running") {
        pauseSession();
      } else if (sessionState === "paused") {
        resumeSession();
      }
    });

    soundToggle.addEventListener("change", () => {
      soundEnabled = soundToggle.checked;
      localStorage.setItem(SOUND_PREF_KEY, String(soundEnabled));
    });

    $("#profileSelect").addEventListener("change", (e) => {
      setCurrentProfile(e.target.value);
    });

    $("#newProfileBtn").addEventListener("click", () => {
      const name = prompt("New profile name:");
      if (!name) return;
      const trimmed = name.trim();
      if (!trimmed) return;
      ensureProfile(trimmed);
      saveProfiles(profiles);
      setCurrentProfile(trimmed);
      initProfilesUI();
    });

    colorSwatches.forEach((swatch) => {
      swatch.addEventListener("click", () => {
        const profile = getCurrentProfile();
        if (!profile) return;
        ensureAvatarDefaults(profile);
        profile.avatar.color = swatch.dataset.color;
        saveProfiles(profiles);
        renderAvatar();
      });
    });

    accentSwatches.forEach((swatch) => {
      swatch.addEventListener("click", () => {
        const profile = getCurrentProfile();
        if (!profile) return;
        ensureAvatarDefaults(profile);
        profile.avatar.accent = swatch.dataset.accent;
        saveProfiles(profiles);
        renderAvatar();
      });
    });

    shapeButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const profile = getCurrentProfile();
        if (!profile) return;
        ensureAvatarDefaults(profile);
        profile.avatar.shape = btn.dataset.shape;
        saveProfiles(profiles);
        renderAvatar();
      });
    });

    overlayButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const profile = getCurrentProfile();
        if (!profile) return;
        ensureAvatarDefaults(profile);
        profile.avatar.overlay = btn.dataset.overlay || "";
        saveProfiles(profiles);
        renderAvatar();
      });
    });

    $("#saveNoteBtn").addEventListener("click", () => {
      const profile = getCurrentProfile();
      const tk = todayKey();
      profile.notesByDate = profile.notesByDate || {};
      profile.notesByDate[tk] = $("#dailyNote").value || "";
      saveProfiles(profiles);
      showToast(t("noteSaved", "Note saved locally ✅"));
    });

    $("#langToggle").addEventListener("click", () => {
      const next = currentLocale === "en" ? "tr" : "en";
      applyLocale(next);
    });

    $("#breathStyleLabel").textContent = t("breathStyleDefault", "Comfortable nasal breathing.");
    updateEstimatedTime();
    resetToReady();
  });
})();
