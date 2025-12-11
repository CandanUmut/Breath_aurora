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

  const BREATH_LIBRARY = [
    {
      id: "coherent",
      label: "Coherent Breathing · 5-5 Rhythm",
      sessionType: "calm",
      pattern: { inhale: 5, hold: 0, exhale: 5 },
      defaultCycles: 6,
      level: "Beginner",
      summary:
        "Slow nasal breathing at about 5 breaths per minute to calm the nervous system.",
      summaryTr: "Sinir sistemini sakinleştirmek için dakikada ~5 nefeslik nazal ritim.",
      coachText:
        "Steady, calming breaths that are ideal when you feel wired or want to settle before meditation or sleep.",
      coachTextTr:
        "Kendinizi gergin hissettiğinizde, meditasyon ya da uyku öncesi yumuşamak için ideal sakin ritim.",
      howTo: [
        "Sit or lie down comfortably.",
        "Inhale through your nose for 5 seconds, letting your belly rise.",
        "Exhale through your nose for 5 seconds, letting your belly soften.",
        "Continue for 5–10 minutes, staying relaxed and natural.",
      ],
      whyItWorks:
        "This pace creates a resonance between your breath and heart, boosting heart-rate variability and activating the vagus nerve.",
      whyTr:
        "Bu ritim nefes ve kalp arasında uyum oluşturur, kalp atım değişkenliğini artırır ve vagus sinirini uyarır.",
      cautions:
        "Very gentle and safe for most people. If you feel any air hunger, slightly shorten the inhale and exhale counts.",
      cautionsTr:
        "Genellikle güvenli ve yumuşaktır. Hava açlığı hissederseniz süreleri biraz kısaltın.",
    },
    {
      id: "box",
      label: "Box Breathing · 4-4-4-4",
      sessionType: "focus",
      pattern: { inhale: 4, hold: 4, exhale: 4, holdEmpty: 4 },
      defaultCycles: 8,
      level: "Beginner",
      summary:
        "A simple 4-count inhale, hold, exhale, hold cycle used by Navy SEALs to stay calm and focused.",
      summaryTr: "Sakin ve odaklı kalmak için 4 sayıda alma, tutma, verme ve boşta tutma döngüsü.",
      coachText:
        "Great for focus between tasks or before speaking. Use when you need a clear, steady mind without getting sleepy.",
      coachTextTr:
        "Görev aralarında veya konuşma öncesinde odak için harika. Uykulu hissetmeden net ve sakin kalmak istediğinizde kullanın.",
      howTo: [
        "Inhale through your nose for 4 counts.",
        "Hold your breath with lungs full for 4 counts.",
        "Exhale gently through your nose for 4 counts.",
        "Hold with lungs empty for 4 counts, then repeat.",
      ],
      whyItWorks:
        "The short breath holds allow CO₂ to rise slightly, which activates the vagus nerve and helps slow your heart and clear your mind.",
      whyTr:
        "Kısa nefes tutmalar CO₂'yi hafifçe yükseltir, vagus sinirini uyarır ve kalbi yavaşlatıp zihni berraklaştırır.",
      cautions:
        "If holding for 4 is difficult, start with shorter counts (like 3-3-3-3) and build up.",
      cautionsTr:
        "4 sayıda tutmak zor gelirse 3-3-3-3 ile başlayıp kademeli artırın.",
    },
    {
      id: "sleep_478",
      label: "4-7-8 Sleep Breath",
      sessionType: "sleep",
      pattern: { inhale: 4, hold: 7, exhale: 8 },
      defaultCycles: 6,
      level: "Beginner",
      summary:
        "A longer exhale pattern that helps switch your body into rest-and-digest mode for sleep.",
      summaryTr: "Vücudu uyku moduna geçirmek için uzun verişe sahip rahatlatıcı ritim.",
      coachText: "Evening-friendly rhythm to downshift after screens or late meals; use in bed or pre-sleep wind down.",
      coachTextTr:
        "Ekran veya geç yemek sonrası yavaşlamak için akşam uyumlu ritim; yatakta veya uyku öncesi gevşemede kullanın.",
      howTo: [
        "Inhale quietly through your nose for 4 counts.",
        "Hold your breath for 7 counts.",
        "Exhale slowly through your mouth with a soft 'whoosh' for 8 counts.",
        "Repeat for 4–8 rounds.",
      ],
      whyItWorks:
        "The long exhale and breath hold strongly activate the parasympathetic nervous system and reduce arousal.",
      whyTr:
        "Uzun veriş ve tutuş parasempatik sistemi güçlü biçimde aktive eder, uyarılmayı düşürür.",
      cautions:
        "If 7-second holds feel too long, start with a 4-4-6 pattern and gradually increase.",
      cautionsTr:
        "7 saniye tutmak zor gelirse 4-4-6 ile başlayıp yavaşça uzatın.",
    },
    {
      id: "bhramari",
      label: "Bhramari · Humming Bee Breath",
      sessionType: "calm",
      pattern: { inhale: 4, hold: 0, exhale: 6 },
      defaultCycles: 8,
      level: "Beginner",
      summary:
        "A gentle humming exhale that soothes the nervous system and quiets the mind.",
      summaryTr: "Sinir sistemini yumuşatan hafif uğultulu veriş.",
      coachText: "Perfect mini-reset during anxious moments; the vibration softens jaw tension and lowers stress quickly.",
      coachTextTr:
        "Kaygılı anlarda hızlı mini mola; titreşim çene gerginliğini yumuşatır ve stresi çabuk düşürür.",
      howTo: [
        "Inhale slowly through your nose.",
        "Exhale while making a soft 'mmm' humming sound, like a bee.",
        "Feel the vibration in your face, throat, and chest.",
        "Repeat 5–10 times.",
      ],
      whyItWorks:
        "The humming vibration stimulates the vagus nerve and increases nitric oxide in the nasal passages.",
      whyTr:
        "Uğultu, vagus sinirini uyarır ve burun yollarında nitrik oksiti artırır.",
      cautions:
        "Keep the volume comfortable. If you feel any ear discomfort, hum more softly.",
      cautionsTr: "Sesi rahat seviyede tutun. Kulakta rahatsızlık olursa daha yumuşak mırıldanın.",
    },
    {
      id: "energize_simple",
      label: "Sunrise Energizer · 2-0-4",
      sessionType: "energize",
      pattern: { inhale: 2, hold: 0, exhale: 4 },
      defaultCycles: 12,
      level: "Beginner",
      summary: "Short inhales and longer exhales to gently wake up and boost alertness.",
      summaryTr: "Kısa alış ve uzun verişlerle nazikçe uyanıp dikkati artırma.",
      coachText:
        "Use in the morning or mid-day slump when you want energy without jitters; keeps exhales long so the nervous system stays balanced.",
      coachTextTr:
        "Titreme yapmadan enerji için sabah veya öğlen düşüşlerinde kullanın; uzun veriş sinir sistemini dengede tutar.",
      howTo: [
        "Sit upright.",
        "Inhale through the nose for 2 counts.",
        "Exhale for 4 counts; keep it smooth, not forced.",
        "Repeat for 2–5 minutes.",
      ],
      whyItWorks:
        "A slightly extended exhale balances the nervous system while the brisk inhale lifts energy.",
      whyTr: "Biraz uzun veriş sinir sistemini dengeler, hızlı alış enerjiyi yükseltir.",
      cautions: "If you feel lightheaded, slow down and return to normal breathing.",
      cautionsTr: "Baş dönmesi olursa yavaşlayıp normal nefese dönün.",
    },
    {
      id: "lung-3-3-6",
      label: "Lung Expansion 3-3-6",
      sessionType: "calm",
      pattern: { inhale: 3, hold: 3, exhale: 6 },
      defaultCycles: 10,
      level: "Gentle",
      summary: "Smooth breaths with a brief hold to gently stretch lung tissue and lengthen the exhale.",
      summaryTr: "Akciğerleri nazikçe genişletmek ve verişi uzatmak için kısa tutuşlu akış.",
      coachText:
        "Lovely during breaks or recovery days to open the ribs without strain; use when you want soft expansion, not intensity.",
      coachTextTr:
        "Molalarda veya dinlenme günlerinde, zorlamadan kaburgaları açmak için ideal; yoğunluk değil yumuşak genişleme istediğinizde kullanın.",
      howTo: [
        "Inhale through the nose for 3 counts, expanding ribs.",
        "Hold lightly for 3 counts without strain.",
        "Exhale for 6 counts, soft jaw and shoulders.",
      ],
      whyItWorks: "Short holds allow gentle CO₂ rise that improves tolerance and lung elasticity.",
      whyTr: "Kısa tutuşlar CO₂ toleransını artırır ve akciğer esnekliğini destekler.",
      cautions: "Stay relaxed; skip holds if dizzy.",
      cautionsTr: "Rahat kalın; baş dönmesi olursa tutuşları atlayın.",
    },
    {
      id: "lung-4-4-8",
      label: "Lung Expansion 4-4-8",
      sessionType: "focus",
      pattern: { inhale: 4, hold: 4, exhale: 8 },
      defaultCycles: 8,
      level: "Intermediate",
      summary: "A balanced inhale and hold with twice-as-long exhale for deeper capacity training.",
      summaryTr: "Daha derin kapasite için dengeli alış ve tutuş, iki kat uzun veriş.",
      coachText:
        "Use when you want to build tolerance and focus, like after a workout cool-down or to prepare for singing/speaking.",
      coachTextTr:
        "Antrenman sonrası soğuma ya da şarkı/konuşma öncesi tolerans ve odak geliştirmek istediğinizde kullanın.",
      howTo: [
        "Inhale steadily for 4 counts, filling low ribs first.",
        "Hold gently for 4 without clenching the throat.",
        "Exhale for 8 counts, feeling the ribs wrap in.",
      ],
      whyItWorks: "Long exhales train the diaphragm eccentrically and calm the nervous system.",
      whyTr: "Uzun veriş diyaframı güçlendirir ve sinir sistemini yatıştırır.",
      cautions: "Reduce the hold if breath hunger appears.",
      cautionsTr: "Nefes açlığı olursa tutuş süresini azaltın.",
    },
  ];

  const translations = {
    en: {
      title: "Breath Aurora",
      tagline: "Breathwork, mudras & movement · Ancient + modern",
      profileLabel: "Profile",
      navCoach: "Coach",
      navLibrary: "Library",
      navProfile: "Profile",
      sessionHeading: "Breath Session",
      cyclesLabel: "Cycles",
      totalTime: "Total time",
      techniqueLabel: "Technique",
      roundsLabel: "Rounds / Cycles",
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
      ready: "Ready",
      tapBegin: "Tap to begin",
      tapPause: "Tap to pause",
      tapResume: "Tap to resume",
      countdown: "Get ready",
      btnReady: "Ready",
      btnPause: "Pause",
      btnResume: "Resume",
      paused: "Paused",
      howTo: "How to practice",
      whyItWorks: "Why it works",
      caution: "Caution",
      chooseTechnique: "Choose a technique",
      chooseTechniqueSub: "Pick a session type or a technique from the library to see details.",
      libraryHeading: "Technique Library",
      libraryIntro:
        "Short, clear descriptions of each technique. Start with the gentle ones. Hyperventilation-style practices should be done responsibly.",
      libraryUse: "Use this technique",
      statsHeading: "Stats & Streaks",
      currentStreak: "Current streak",
      bestStreak: "Best streak",
      totalSessions: "Total sessions",
      totalMinutes: "Total minutes",
      badgesHeading: "Badges",
      noteHeading: "Daily Note (local only)",
      saveNote: "Save note",
      stickerLabel: "Sticker",
      themeHeading: "Theme",
      themeDark: "Dark",
      themeLight: "Light",
      themeSky: "Sky",
      sessionSummary: "Session plan",
      cyclesShort: "cycles",
      totalLabel: "total",
      cycleTotalLabel: "Cycles · Total",
      libraryDetails: "Details",
      coachAbout: "When to use",
      patternLabel: "Pattern",
      inhaleLabel: "Inhale",
      holdLabel: "Hold",
      exhaleLabel: "Exhale",
      restLabel: "Rest",
      patternMissing: "Pattern missing timing. Please pick another technique.",
    },
    tr: {
      title: "Nefes Aurora",
      tagline: "Nefes, mudra ve hareket · Kadim + modern",
      profileLabel: "Profil",
      navCoach: "Koç",
      navLibrary: "Kütüphane",
      navProfile: "Profil",
      sessionHeading: "Nefes Seansı",
      cyclesLabel: "Tur sayısı",
      totalTime: "Toplam süre",
      techniqueLabel: "Teknik",
      roundsLabel: "Turlar / Döngüler",
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
      ready: "Hazır",
      tapBegin: "Başlamak için dokun",
      tapPause: "Duraklatmak için dokun",
      tapResume: "Devam etmek için dokun",
      countdown: "Hazırlan",
      btnReady: "Hazırım",
      btnPause: "Duraklat",
      btnResume: "Devam",
      paused: "Duraklatıldı",
      howTo: "Nasıl yapılır",
      whyItWorks: "Neden işe yarar",
      caution: "Uyarı",
      chooseTechnique: "Teknik seç",
      chooseTechniqueSub: "Detay görmek için kütüphaneden bir teknik seçin.",
      libraryHeading: "Teknik Kütüphanesi",
      libraryIntro:
        "Kısa ve net açıklamalar. Önce yumuşak pratiklerle başlayın. Yoğun teknikleri sorumlulukla uygulayın.",
      libraryUse: "Bu tekniği kullan",
      statsHeading: "İstatistikler ve Seri",
      currentStreak: "Günlük seri",
      bestStreak: "En iyi seri",
      totalSessions: "Toplam seans",
      totalMinutes: "Toplam dakika",
      badgesHeading: "Rozetler",
      noteHeading: "Günlük Not (yerel)",
      saveNote: "Notu kaydet",
      stickerLabel: "Sticker",
      themeHeading: "Tema",
      themeDark: "Karanlık",
      themeLight: "Aydınlık",
      themeSky: "Gökyüzü",
      sessionSummary: "Seans planı",
      cyclesShort: "çevrim",
      totalLabel: "toplam",
      cycleTotalLabel: "Turlar · Toplam",
      libraryDetails: "Detaylar",
      coachAbout: "Ne zaman kullanılır",
      patternLabel: "Ritim",
      inhaleLabel: "Alış",
      holdLabel: "Tutuş",
      exhaleLabel: "Veriş",
      restLabel: "Bekle",
      patternMissing: "Ritim eksik. Lütfen başka bir teknik seçin.",
    },
  };

  const THEME_KEY = "breathAurora_theme";

  const STORAGE_KEY = "breathAuroraProfiles";
  const SOUND_PREF_KEY = "breathAurora_soundEnabled";
  const LANG_KEY = "breathAurora_lang";
  const ACTIVE_PROFILE_KEY = "breathAurora_activeProfileId";
  const PROFILE_ID_KEY = "breathAppProfileId";

  function t(key, fallback = "") {
    const dict = translations[currentLocale] || translations.en;
    return dict[key] || translations.en[key] || fallback || key;
  }

  let setActiveView = () => {};
  let currentView = "coach";

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
        sticker: "none",
      };
    }
    if (!profile.avatar.sticker) profile.avatar.sticker = "none";
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
      avatar: { color: "teal", accent: "yellow", shape: "circle" },
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
      });
    }
    ensureAvatarDefaults(profiles[name]);
    return profiles[name];
  }

  function setCurrentProfile(profileId) {
    if (!profiles[profileId]) return;
    currentProfileId = profileId;
    localStorage.setItem(ACTIVE_PROFILE_KEY, profileId);
    localStorage.setItem(PROFILE_ID_KEY, profileId);
    const sel = $("#profileSelect");
    if (sel) sel.value = profileId;
    $("#profileTagline").textContent = `${profileId}, your breath is your superpower.`;
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
  let currentCycles = 5;
  const cyclesMinus = document.getElementById("cyclesMinus");
  const cyclesPlus = document.getElementById("cyclesPlus");
  const cyclesValue = document.getElementById("cyclesValue");
  const totalTimeValue = document.getElementById("totalTimeValue");
  const avatarShapeEl = document.getElementById("avatarShape");
  const avatarInnerEl = document.getElementById("avatarInner");
  const avatarStickerEl = document.getElementById("avatarSticker");
  const colorSwatches = document.querySelectorAll(".avatar-color-swatch");
  const accentSwatches = document.querySelectorAll(".avatar-accent-swatch");
  const shapeButtons = document.querySelectorAll(".avatar-shape-btn");
  const stickerButtons = document.querySelectorAll(".avatar-sticker-btn");

  let currentLocale = localStorage.getItem(LANG_KEY) || "en";

  function updateProgress(progressFraction) {
    const root = document.documentElement;
    const clamped = Math.max(0, Math.min(1, progressFraction || 0));
    root.style.setProperty("--progress", String(clamped * 100));
  }

  function applyTheme(theme) {
    const validThemes = ["dark", "light", "sky"];
    if (validThemes.includes(theme)) {
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem(THEME_KEY, theme);
      highlightThemeButtons(theme);
      return;
    }

    const type = SESSION_TYPES[theme] || SESSION_TYPES.calm;
    const root = document.documentElement;
    const circle = breathCircle;
    const phase = sessionEngine.phases[sessionEngine.phaseIndex]?.type || "idle";
    const colors = type.colors;
    const colorForPhase = colors[phase] || colors.inhale;
    root.style.setProperty("--phase-color", colorForPhase);
    root.style.setProperty("--phase-shadow", hexToRgba(colorForPhase, 0.35));
    if (circle) {
      circle.dataset.sessionType = theme;
      circle.dataset.phase = phase;
      circle.style.transitionTimingFunction = type.easing || "ease-in-out";
    }
  }

  function highlightThemeButtons(theme) {
    document.querySelectorAll("[data-theme-select]").forEach((btn) => {
      btn.classList.toggle("theme-pill--active", btn.dataset.themeSelect === theme);
    });
  }

  function initTheme() {
    const saved = localStorage.getItem(THEME_KEY) || "dark";
    applyTheme(saved);
    document.querySelectorAll("[data-theme-select]").forEach((btn) => {
      btn.addEventListener("click", () => applyTheme(btn.dataset.themeSelect));
    });
  }

  function hexToRgba(hex, alpha) {
    const value = hex.replace("#", "");
    const bigint = parseInt(value, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  function normalizePattern(raw = {}) {
    // Normalize any alternative keys to the canonical inhale/hold/exhale/holdEmpty structure
    const safeNumber = (val) => {
      const n = Number(val);
      return Number.isFinite(n) ? n : 0;
    };

    return {
      inhale: safeNumber(raw.inhale ?? raw.inhaleLong ?? raw.in ?? 0),
      hold: safeNumber(raw.hold ?? raw.holdFull ?? raw.retention ?? 0),
      exhale: safeNumber(raw.exhale ?? raw.out ?? raw.exhaleLong ?? 0),
      holdEmpty: safeNumber(raw.holdEmpty ?? raw.rest ?? raw.emptyHold ?? 0),
    };
  }

  function getCycleDurationSeconds(pattern) {
    const pat = normalizePattern(pattern);
    return pat.inhale + pat.hold + pat.exhale + pat.holdEmpty;
  }

  function getTotalDurationSeconds(pattern, cycles) {
    return getCycleDurationSeconds(pattern) * (cycles || 0);
  }

  function formatDuration(seconds) {
    const s = Math.max(0, Math.round(seconds));
    const minutes = Math.floor(s / 60);
    const rem = s % 60;
    if (minutes === 0) return `${rem}s`;
    return `${minutes}:${String(rem).padStart(2, "0")}`;
  }

  function buildPhases(pattern, cycles) {
    const pat = normalizePattern(pattern);
    const totalCycles = Math.max(1, cycles || 1);
    const phases = [];
    for (let i = 0; i < totalCycles; i++) {
      phases.push({ label: t("inhaleLabel", "Inhale"), type: "inhale", duration: pat.inhale });
      if (pat.hold) phases.push({ label: t("holdLabel", "Hold"), type: "hold", duration: pat.hold });
      phases.push({ label: t("exhaleLabel", "Exhale"), type: "exhale", duration: pat.exhale });
      if (pat.holdEmpty)
        phases.push({ label: t("restLabel", "Rest"), type: "hold", duration: pat.holdEmpty });
    }
    return phases.filter((p) => p.duration > 0);
  }

  function updateCoreButtonUI() {
    if (!breathCoreButton) return;
    breathCoreButton.classList.remove("is-paused", "is-running");
    const readyLabel = t("btnReady", "Ready", "Hazırım");
    const readySub = t("tapBegin", "Tap to begin");
    const countdownSub = t("countdown", "Get ready");
    const pausedLabel = t("btnResume", "Resume");
    const pausedSub = t("tapResume", "Tap to resume");
    const pauseHint = t("tapPause", "Tap to pause");
    const runningLabel = t("btnPause", "Pause");
    const phaseText = (currentPhase || "").toUpperCase();

    if (sessionState === "idle" || sessionState === "finished") {
      breathCoreLabel.textContent = readyLabel;
      breathCoreSub.textContent = readySub;
    } else if (sessionState === "countdown") {
      breathCoreLabel.textContent = String(countdownValue || 0);
      breathCoreSub.textContent = countdownSub;
    } else if (sessionState === "running") {
      breathCoreLabel.textContent = runningLabel;
      breathCoreSub.textContent = `${phaseText || ""} · ${Math.max(0, Math.ceil(remainingSeconds || 0))}s · ${pauseHint}`;
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
      inhale: currentLocale === "tr" ? "Nefes al" : "Breathe in softly",
      exhale: currentLocale === "tr" ? "Nefes ver" : "Slow relaxed exhale",
      hold: currentLocale === "tr" ? "Bekle" : "Hold gently",
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
    const cyclesInput = Number($("#roundsInput").value) || currentCycles || 5;
    currentCycles = Math.max(1, Math.min(30, cyclesInput));
    const pattern = normalizePattern(sessionEngine.pattern || {});
    sessionEngine.pattern = pattern;
    sessionEngine.phases = buildPhases(pattern, currentCycles);
    if (sessionEngine.phases.length === 0) {
      showToast(t("patternMissing", "Pattern missing timing. Please pick another technique."));
      resetToReady();
      return;
    }
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
      if (coachTechSummary)
        coachTechSummary.textContent = t(
          "chooseTechniqueSub",
          "Pick a session type or a technique from the library to see details."
        );
      if (coachTechWhy) coachTechWhy.textContent = "";
      return;
    }

    const pat = normalizePattern(currentTechnique.pattern || {});
    const inhale = pat.inhale ?? "-";
    const hold = pat.hold || 0;
    const exhale = pat.exhale ?? "-";
    const rest = pat.holdEmpty || 0;

    if (coachTechTitle) coachTechTitle.textContent = currentTechnique.label || currentTechnique.name || "Custom Session";
    if (coachTechPattern)
      coachTechPattern.textContent = `${t("patternLabel", "Pattern")}: ${t("inhaleLabel", "Inhale")} ${inhale}s · ${
        hold ? `${t("holdLabel", "Hold")} ${hold}s · ` : ""
      }${t("exhaleLabel", "Exhale")} ${exhale}s${rest ? ` · ${t("restLabel", "Rest")} ${rest}s` : ""}`;
    const summaryText = currentLocale === "tr" ? currentTechnique.summaryTr || currentTechnique.summary : currentTechnique.summary;
    const whyText = currentLocale === "tr" ? currentTechnique.whyTr || currentTechnique.whyItWorks : currentTechnique.whyItWorks;
    const coachUsage =
      currentLocale === "tr"
        ? currentTechnique.coachTextTr || currentTechnique.coachText || summaryText
        : currentTechnique.coachText || currentTechnique.coachTextTr || summaryText;
    if (coachTechSummary) coachTechSummary.textContent = summaryText || "";
    if (coachTechWhy) {
      coachTechWhy.innerHTML = "";
      const label = document.createElement("strong");
      label.textContent = `${t("coachAbout", "When to use")}: `;
      coachTechWhy.appendChild(label);
      coachTechWhy.append(document.createTextNode(coachUsage || ""));
      if (whyText) {
        const extra = document.createElement("div");
        extra.className = "small text-muted";
        extra.textContent = whyText;
        coachTechWhy.appendChild(extra);
      }
    }
  }

  function useTechnique(techMeta) {
    if (!techMeta) return;
    const normalizedPattern = normalizePattern(techMeta.pattern || {});
    currentTechnique = { ...techMeta, pattern: normalizedPattern };
    currentCycles = techMeta.defaultCycles || currentCycles || 5;
    $("#breathStyleLabel").textContent =
      currentLocale === "tr" ? techMeta.summaryTr || techMeta.summary || "" : techMeta.summary || "";
    $("#techniqueShort").textContent =
      currentLocale === "tr" ? techMeta.summaryTr || techMeta.summary || "" : techMeta.summary || "";
    const tagsContainer = $("#techniqueTags");
    tagsContainer.innerHTML = "";
    [techMeta.level, techMeta.sessionType].forEach((tag) => {
      const span = document.createElement("span");
      span.className = "chip chip-primary";
      span.textContent = tag;
      tagsContainer.appendChild(span);
    });
    sessionEngine.sessionType = techMeta.sessionType;
    sessionEngine.pattern = { ...normalizedPattern };
    $$(".chip-toggle").forEach((chip) => {
      chip.classList.toggle("chip-active", chip.getAttribute("data-intent") === techMeta.sessionType);
    });
    applyTheme(sessionEngine.sessionType);
    updateSessionMeta();
    renderCoachTechniqueInfo();
  }

  function initTechniqueSelect() {
    const sel = $("#techniqueSelect");
    sel.innerHTML = "";
    BREATH_LIBRARY.forEach((t) => {
      const opt = document.createElement("option");
      opt.value = t.id;
      opt.textContent = `${t.label} · ${t.level}`;
      sel.appendChild(opt);
    });
    sel.value = BREATH_LIBRARY[0].id;
    refreshTechniqueInfo();
  }

  function refreshTechniqueInfo() {
    const techId = $("#techniqueSelect").value;
    const tech = BREATH_LIBRARY.find((t) => t.id === techId) || BREATH_LIBRARY[0];
    useTechnique(tech);
  }

  function updateSessionMeta() {
    if (!currentTechnique) return;
    const pattern = normalizePattern(currentTechnique.pattern || {});
    const totalSeconds = getTotalDurationSeconds(pattern, currentCycles);
    if (cyclesValue) cyclesValue.textContent = currentCycles;
    if (totalTimeValue) totalTimeValue.textContent = `~${formatDuration(totalSeconds)}`;
    const cycleSummaryValue = $("#cycleSummaryValue");
    if (cycleSummaryValue) {
      cycleSummaryValue.textContent = `${currentCycles} ${t("cyclesShort", "cycles")} · ~${formatDuration(
        totalSeconds
      )} ${t("totalLabel", "total")}`;
    }
    const roundsInput = $("#roundsInput");
    if (roundsInput) roundsInput.value = currentCycles;
    $("#estimatedTime").textContent = `${t("cycleTotalLabel", "Cycles · Total")}: ${currentCycles} · ${formatDuration(
      totalSeconds
    )}`;
  }

  function updateEstimatedTime() {
    updateSessionMeta();
  }

  function initLibrary() {
    const container = $("#techLibrary");
    const detail = $("#libraryDetail");
    container.innerHTML = "";

    BREATH_LIBRARY.forEach((tech) => {
      const summaryText = currentLocale === "tr" ? tech.summaryTr || tech.summary : tech.summary;

      const card = document.createElement("div");
      card.className = "card";

      const pattern = normalizePattern(tech.pattern || {});

      const tags = `
      <div class="chip-row small">
        <span class="chip">${tech.level}</span>
        <span class="chip">${tech.sessionType}</span>
      </div>
    `;

      card.innerHTML = `
      <div class="library-card-title">
        <h3>${tech.label}</h3>
        <span class="chip chip-primary">${tech.level}</span>
      </div>
      <p class="small text-muted">${summaryText}</p>
      <p class="small text-muted">
        <strong>Pattern:</strong>
        inhale ${pattern.inhale || 0}
        · hold ${pattern.hold || 0}
        · exhale ${pattern.exhale || 0}
        ${pattern.holdEmpty ? " · hold " + pattern.holdEmpty : ""}
      </p>
      ${tags}
      <div class="library-card-action">
        <button class="btn btn-soft btn-small" data-view-detail="${tech.id}">
          ${t("libraryDetails", "Details", "Detaylar")}
        </button>
        <button class="btn btn-primary btn-small" data-start-tech="${tech.id}">
          ${t("libraryUse", "Use this technique")}
        </button>
      </div>
    `;

      container.appendChild(card);
    });

    container.onclick = (e) => {
      const detailBtn = e.target.closest("[data-view-detail]");
      const startBtn = e.target.closest("[data-start-tech]");
      const detailId = detailBtn ? detailBtn.getAttribute("data-view-detail") : null;
      const startId = startBtn ? startBtn.getAttribute("data-start-tech") : null;

      if (detailId) {
        renderDetail(detailId);
        const tech = BREATH_LIBRARY.find((t) => t.id === detailId);
        if (tech) {
          $("#techniqueSelect").value = tech.id;
          useTechnique(tech);
        }
      }

      if (startId) {
        startFromLibrary(startId);
      }
    };

    if (BREATH_LIBRARY.length > 0) {
      renderDetail(BREATH_LIBRARY[0].id);
    }
  }

  function renderDetail(id) {
    const tech = BREATH_LIBRARY.find((t) => t.id === id);
    const detail = $("#libraryDetail");
    if (!tech || !detail) return;
    const summaryText = currentLocale === "tr" ? tech.summaryTr || tech.summary : tech.summary;
    const howToSteps = currentLocale === "tr" ? tech.howToTr || tech.howTo : tech.howTo;
    const whyText = currentLocale === "tr" ? tech.whyTr || tech.whyItWorks : tech.whyItWorks;
    const cautionText = currentLocale === "tr" ? tech.cautionsTr || tech.cautions : tech.cautions;
    const pattern = normalizePattern(tech.pattern || {});
    const patternText = `${pattern.inhale || 0}/${pattern.hold || 0}/${pattern.exhale || 0}${
      pattern.holdEmpty ? `/${pattern.holdEmpty}` : ""
    }`;
    detail.innerHTML = `
      <h3>${tech.label}</h3>
      <div class="detail-meta">
        <span>${tech.level}</span>
        <span>${tech.sessionType}</span>
        <span>${t("patternLabel", "Pattern")}: ${patternText}</span>
      </div>
      <p>${summaryText}</p>
      <h4>${t("howTo", "How to practice")}</h4>
      <ul>${(howToSteps || []).map((step) => `<li>${step}</li>`).join("")}</ul>
      <h4>${t("whyItWorks", "Why it works")}</h4>
      <p>${whyText || ""}</p>
      <p class="text-muted small"><strong>${t("caution", "Caution")}: </strong> ${cautionText || ""}</p>
      <button class="btn btn-primary" data-start-tech="${tech.id}">${t("libraryUse", "Use this technique")}</button>
    `;
    detail.querySelector("button[data-start-tech]").addEventListener("click", () =>
      startFromLibrary(tech.id)
    );
  }

  function startFromLibrary(id) {
    const tech = BREATH_LIBRARY.find((t) => t.id === id);
    if (!tech) return;
    $("#techniqueSelect").value = tech.id;
    currentCycles = tech.defaultCycles || currentCycles;
    $("#roundsInput").value = currentCycles;
    useTechnique(tech);
    setActiveView("coach");
    updateSessionMeta();
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
    $("#statCurrentStreak").textContent = `${profile.currentStreak || 0} days`;
    $("#statBestStreak").textContent = `${profile.bestStreak || 0} days`;
    $("#statTotalSessions").textContent = profile.totalSessions || 0;
    $("#statTotalMinutes").textContent = profile.totalMinutes || 0;

    const maxForBar = Math.max(7, profile.bestStreak || 0);
    const barPercent = Math.min(100, ((profile.currentStreak || 0) / maxForBar) * 100);
    $("#streakFill").style.width = `${barPercent}%`;

    const streakHint = $("#streakHint");
    if (!profile.lastPracticeDate) {
      streakHint.textContent = "No streak yet. Even one 2-minute session today is a great start.";
    } else if (profile.currentStreak >= 3) {
      streakHint.textContent = "Nice consistency. A few conscious breaths each day reshape the nervous system.";
    } else {
      streakHint.textContent = "Keep breathing daily. Streaks help your brain turn this into an automatic habit.";
    }

    const badgeGrid = $("#badgeGrid");
    badgeGrid.innerHTML = "";
    const unlocked = profile.badges || {};
    DEFAULT_BADGES.forEach((b) => {
      const div = document.createElement("div");
      div.className = "badge-card" + (unlocked[b.id] ? " unlocked" : "");
      div.innerHTML = `
        <div class="badge-meta">
          <span class="badge-title">${b.emoji} ${b.label}</span>
          <span class="badge-chip">${unlocked[b.id] ? "Unlocked" : "Locked"}</span>
        </div>
        <p>${b.desc}</p>
      `;
      badgeGrid.appendChild(div);
    });

    const tk = todayKey();
    $("#dailyNote").value = profile.notesByDate?.[tk] || "";
    $("#todayMinutesLabel").textContent = `${profile.totalMinutes || 0} min`;
  }

  function renderAvatar() {
    const profile = getCurrentProfile();
    if (!profile) return;
    ensureAvatarDefaults(profile);

    const { color, accent, shape, sticker } = profile.avatar;

    if (avatarShapeEl) avatarShapeEl.dataset.shape = shape;

    const colorMap = {
      teal: "#14b8a6",
      blue: "#3b82f6",
      purple: "#a855f7",
      amber: "#f59e0b",
    };
    const accentMap = {
      yellow: "#facc15",
      pink: "#ec4899",
      lime: "#84cc16",
      sky: "#0ea5e9",
    };
    const stickerMap = {
      none: "",
      lungs: "🫁",
      heart: "❤️",
      bird: "🐦",
    };

    const baseColor = colorMap[color] || "#38bdf8";
    const accentColor = accentMap[accent] || "#facc15";

    if (avatarInnerEl) {
      avatarInnerEl.style.background = `radial-gradient(circle at top, ${accentColor}, ${baseColor})`;
      avatarInnerEl.style.boxShadow = `0 0 24px ${baseColor}80`;
    }

    if (avatarStickerEl) {
      avatarStickerEl.textContent = stickerMap[sticker] || "";
    }

    colorSwatches.forEach((s) => s.classList.toggle("is-active", s.dataset.color === color));
    accentSwatches.forEach((s) => s.classList.toggle("is-active", s.dataset.accent === accent));
    shapeButtons.forEach((btn) => btn.classList.toggle("avatar-shape-btn--active", btn.dataset.shape === shape));
    stickerButtons.forEach((btn) => btn.classList.toggle("active", btn.dataset.sticker === sticker));

    renderHeaderProfileMini();
  }

  function renderHeaderProfileMini() {
    const container = document.getElementById("headerProfileSummary");
    const profile = getCurrentProfile();
    if (!container || !profile) return;
    ensureAvatarDefaults(profile);
    const { color, accent, sticker } = profile.avatar;

    const colorMap = {
      teal: "#14b8a6",
      blue: "#3b82f6",
      purple: "#a855f7",
      amber: "#f59e0b",
    };
    const accentMap = {
      yellow: "#facc15",
      pink: "#ec4899",
      lime: "#84cc16",
      sky: "#0ea5e9",
    };
    const stickerMap = {
      none: "",
      lungs: "🫁",
      heart: "❤️",
      bird: "🐦",
    };

    const baseColor = colorMap[color] || "#38bdf8";
    const accentColor = accentMap[accent] || "#facc15";
    const stickerChar = stickerMap[sticker] || "";

    container.innerHTML = `
      <div class="header-profile-mini">
        <div class="header-profile-mini-avatar">
          <div class="header-profile-mini-avatar-inner" style="background: radial-gradient(circle at top, ${accentColor}, ${baseColor});"></div>
          <div class="header-profile-mini-sticker">${stickerChar}</div>
        </div>
        <div class="header-profile-mini-name">${profile.name}</div>
      </div>
    `;

    container.querySelector(".header-profile-mini").addEventListener("click", () => {
      setActiveView("profile");
    });
  }

  function applyLocale(lang) {
    currentLocale = lang;
    localStorage.setItem(LANG_KEY, lang);
    const dict = translations[lang] || translations.en;
    $$('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) el.textContent = dict[key];
    });
    resetToReady();
    refreshTechniqueInfo();
    initLibrary();
    updateSessionMeta();
    renderHeaderProfileMini();
  }

  document.addEventListener("DOMContentLoaded", () => {
    const VIEWS = {
      coach: document.getElementById("view-coach"),
      library: document.getElementById("view-library"),
      profile: document.getElementById("view-profile"),
    };

    const navButtons = document.querySelectorAll(".nav-btn[data-view-target]");

    setActiveView = (target) => {
      const nextView = VIEWS[target] ? target : "coach";
      currentView = nextView;
      Object.entries(VIEWS).forEach(([id, el]) => {
        if (!el) return;
        el.classList.toggle("view--active", id === nextView);
      });

      navButtons.forEach((btn) => {
        const isActive = btn.dataset.viewTarget === nextView;
        btn.classList.toggle("nav-btn--active", isActive);
      });

      if (nextView === "library") {
        initLibrary();
      }
      if (nextView === "profile") {
        renderAvatar();
      }
    };

    navButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = btn.dataset.viewTarget;
        setActiveView(target);
      });
    });

    const savedProfileId = localStorage.getItem(PROFILE_ID_KEY) || localStorage.getItem(ACTIVE_PROFILE_KEY);
    if (savedProfileId && profiles[savedProfileId]) {
      currentProfileId = savedProfileId;
    }

    if (!currentProfileId) {
      currentProfileId = Object.keys(profiles)[0];
    }

    initTechniqueSelect();
    initLibrary();
    initProfilesUI();
    setCurrentProfile(currentProfileId);
    initTheme();
    applyTheme(sessionEngine.sessionType);
    applyLocale(currentLocale);
    setActiveView("coach");

    $("#roundsInput").addEventListener("input", (e) => {
      const val = Math.max(1, Math.min(30, Number(e.target.value) || 1));
      currentCycles = val;
      updateSessionMeta();
    });
    $("#techniqueSelect").addEventListener("change", refreshTechniqueInfo);

    $$(".chip-toggle").forEach((chip) => {
      chip.addEventListener("click", () => {
        $$(".chip-toggle").forEach((c) => c.classList.remove("chip-active"));
        chip.classList.add("chip-active");
        sessionEngine.sessionType = chip.getAttribute("data-intent");
        const matchedTechnique = BREATH_LIBRARY.find((t) => t.sessionType === sessionEngine.sessionType);
        if (matchedTechnique) {
          $("#techniqueSelect").value = matchedTechnique.id;
          useTechnique(matchedTechnique);
        } else {
          sessionEngine.pattern = normalizePattern(SESSION_TYPES[sessionEngine.sessionType].pattern);
          applyTheme(sessionEngine.sessionType);
          updateSessionMeta();
          renderCoachTechniqueInfo();
        }
      });
    });

    if (cyclesMinus) {
      cyclesMinus.addEventListener("click", () => {
        if (currentCycles > 1) {
          currentCycles -= 1;
          updateSessionMeta();
        }
      });
    }

    if (cyclesPlus) {
      cyclesPlus.addEventListener("click", () => {
        if (currentCycles < 30) {
          currentCycles += 1;
          updateSessionMeta();
        }
      });
    }

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

    stickerButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const profile = getCurrentProfile();
        if (!profile) return;
        ensureAvatarDefaults(profile);
        profile.avatar.sticker = btn.dataset.sticker;
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
      showToast("Note saved locally ✅");
    });

    $("#langToggle").addEventListener("click", () => {
      const next = currentLocale === "en" ? "tr" : "en";
      applyLocale(next);
    });

    $("#breathStyleLabel").textContent = "Comfortable nasal breathing.";
    updateEstimatedTime();
    resetToReady();
  });
})();
