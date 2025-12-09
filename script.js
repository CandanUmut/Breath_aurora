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
    },
    tr: {
      title: "Nefes Aurora",
      tagline: "Nefes, mudra ve hareket · Kadim + modern",
      profileLabel: "Profil",
      navCoach: "Koç",
      navLibrary: "Kütüphane",
      navProfile: "Profil",
      sessionHeading: "Nefes Seansı",
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
    },
  };

  const STORAGE_KEY = "breathAuroraProfiles";
  const SOUND_PREF_KEY = "breathAurora_soundEnabled";
  const LANG_KEY = "breathAurora_lang";

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

  function loadProfiles() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const obj = JSON.parse(raw);
        if (obj && typeof obj === "object") return obj;
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
    };
    const profiles = { Guest: guest };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
    return profiles;
  }

  function saveProfiles(profiles) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
  }

  let profiles = loadProfiles();
  let currentProfileName = Object.keys(profiles)[0] || "Guest";

  function getCurrentProfile() {
    return profiles[currentProfileName];
  }

  function ensureProfile(name) {
    if (!profiles[name]) {
      profiles[name] = {
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
      };
    }
    return profiles[name];
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

  let sessionState = {
    status: "idle", // idle | countdown | running | paused | finished
    sessionType: "calm",
    pattern: { ...SESSION_TYPES.calm.pattern },
    phases: [],
    phaseIndex: 0,
    phaseStartTime: 0,
    phaseEndTime: 0,
    countdownValue: 0,
    sessionDurationMs: 0,
    startedAt: 0,
    pausedRemainingMs: 0,
    timerId: null,
  };

  let currentLocale = localStorage.getItem(LANG_KEY) || "en";

  function updateProgress(progressFraction) {
    const root = document.documentElement;
    const clamped = Math.max(0, Math.min(1, progressFraction || 0));
    root.style.setProperty("--progress", String(clamped * 100));
  }

  function applyTheme(typeId) {
    const type = SESSION_TYPES[typeId] || SESSION_TYPES.calm;
    const root = document.documentElement;
    const circle = breathCircle;
    const phase = sessionState.phases[sessionState.phaseIndex]?.type || "idle";
    const colors = type.colors;
    const colorForPhase = colors[phase] || colors.inhale;
    root.style.setProperty("--phase-color", colorForPhase);
    root.style.setProperty("--phase-shadow", hexToRgba(colorForPhase, 0.35));
    root.style.setProperty("--bg-gradient", colors.background);
    if (circle) {
      circle.dataset.sessionType = typeId;
      circle.dataset.phase = phase;
      circle.style.transitionTimingFunction = type.easing || "ease-in-out";
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
    return (
      (pattern.inhale || 0) +
      (pattern.hold || 0) +
      (pattern.exhale || 0) +
      (pattern.holdEmpty || 0)
    );
  }

  function buildPhases(pattern, minutes) {
    const totalSeconds = Math.max(1, minutes * 60);
    const singleCycle = patternCycleSeconds(pattern) || 1;
    const cycles = Math.max(1, Math.ceil(totalSeconds / singleCycle));
    const phases = [];
    for (let i = 0; i < cycles; i++) {
      phases.push({ label: "Inhale", type: "inhale", duration: pattern.inhale || 0 });
      if (pattern.hold) phases.push({ label: "Hold", type: "hold", duration: pattern.hold });
      phases.push({ label: "Exhale", type: "exhale", duration: pattern.exhale || 0 });
      if (pattern.holdEmpty)
        phases.push({ label: "Hold", type: "hold", duration: pattern.holdEmpty });
    }
    return phases.filter((p) => p.duration > 0);
  }

  function setCoreText(main, sub) {
    breathCoreLabel.textContent = main;
    breathCoreSub.textContent = sub;
    breathCoreButton.setAttribute("aria-label", `${main}. ${sub}`);
  }

  function resetToReady() {
    sessionState.status = "idle";
    sessionState.phaseIndex = 0;
    sessionState.phases = [];
    sessionState.sessionDurationMs = 0;
    sessionState.pausedRemainingMs = 0;
    updateProgress(0);
    breathCircle.dataset.phase = "idle";
    setCoreText(currentLocale === "tr" ? "Hazır" : "Ready", currentLocale === "tr" ? "Başlamak için dokun" : "Tap to begin");
    $("#phaseLabel").textContent = "—";
    $("#phaseCountdown").textContent = "00.0 s";
    $("#sessionProgressText").textContent = "0%";
    $("#startBtn").disabled = false;
    $("#stopBtn").disabled = true;
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
    setCoreText(phase.label.toUpperCase(), `${Math.ceil(remaining)}s`);
    breathCircle.dataset.phase = phase.type;
    countdownEl.textContent = `${remaining.toFixed(1)} s`;
    progressText.textContent = `${Math.round(overall * 100)}%`;
    breathCoreSub.textContent = `${Math.ceil(remaining)}s · ${hints[phase.type]}`;
    breathCoreButton.setAttribute("aria-label", `${phase.label}. ${Math.ceil(remaining)} seconds remaining. Tap to pause.`);
  }

  function beginBreathing() {
    const type = SESSION_TYPES[sessionState.sessionType] || SESSION_TYPES.calm;
    const minutes = Number($("#roundsInput").value) || type.durationMinutes;
    sessionState.pattern = { ...type.pattern };
    sessionState.phases = buildPhases(sessionState.pattern, minutes);
    sessionState.phaseIndex = 0;
    sessionState.sessionDurationMs =
      sessionState.phases.reduce((sum, p) => sum + p.duration, 0) * 1000;
    sessionState.startedAt = performance.now();
    sessionState.status = "running";
    const first = sessionState.phases[0];
    const now = performance.now();
    sessionState.phaseStartTime = now;
    sessionState.phaseEndTime = now + (first.duration || 1) * 1000;
    $("#startBtn").disabled = true;
    $("#stopBtn").disabled = false;
    playPhaseSound(first.type);
    tickSession();
  }

  function startCountdown() {
    if (sessionState.status === "running") return;
    sessionState.status = "countdown";
    sessionState.countdownValue = 3;
    setCoreText("3", currentLocale === "tr" ? "Hazırlan" : "Get ready");
    const interval = setInterval(() => {
      if (sessionState.status !== "countdown") {
        clearInterval(interval);
        return;
      }
      sessionState.countdownValue -= 1;
      if (sessionState.countdownValue <= 0) {
        clearInterval(interval);
        setCoreText("Go", currentLocale === "tr" ? "Başla" : "Begin");
        beginBreathing();
        return;
      }
      setCoreText(String(sessionState.countdownValue), currentLocale === "tr" ? "Hazırlan" : "Get ready");
    }, 1000);
  }

  function pauseSession() {
    if (sessionState.status !== "running") return;
    sessionState.status = "paused";
    sessionState.pausedRemainingMs = sessionState.phaseEndTime - performance.now();
    setCoreText(currentLocale === "tr" ? "Duraklatıldı" : "Paused", currentLocale === "tr" ? "Devam etmek için dokun" : "Tap to resume");
    if (sessionState.timerId) cancelAnimationFrame(sessionState.timerId);
  }

  function resumeSession() {
    if (sessionState.status !== "paused") return;
    const now = performance.now();
    const phase = sessionState.phases[sessionState.phaseIndex];
    const phaseDurationMs = (phase?.duration || 0) * 1000;
    const elapsed = Math.max(0, phaseDurationMs - sessionState.pausedRemainingMs);
    sessionState.phaseStartTime = now - elapsed;
    sessionState.phaseEndTime = now + sessionState.pausedRemainingMs;
    sessionState.status = "running";
    sessionState.pausedRemainingMs = 0;
    tickSession();
  }

  function stopSession(completed) {
    if (sessionState.timerId) cancelAnimationFrame(sessionState.timerId);
    sessionState.timerId = null;
    if (completed && sessionState.sessionDurationMs > 0) {
      const minutes = Math.max(1, Math.round(sessionState.sessionDurationMs / 1000 / 60));
      recordSession(minutes, sessionState.sessionType);
    }
    resetToReady();
    sessionState.status = completed ? "finished" : "idle";
  }

  function tickSession() {
    if (sessionState.status !== "running") return;
    const now = performance.now();
    const phase = sessionState.phases[sessionState.phaseIndex];
    if (!phase) {
      stopSession(true);
      return;
    }

    const remainingMs = sessionState.phaseEndTime - now;
    if (remainingMs <= 0) {
      sessionState.phaseIndex += 1;
      const next = sessionState.phases[sessionState.phaseIndex];
      if (!next) {
        stopSession(true);
        return;
      }
      sessionState.phaseStartTime = now;
      sessionState.phaseEndTime = now + next.duration * 1000;
      playPhaseSound(next.type);
      applyTheme(sessionState.sessionType);
    }

    const current = sessionState.phases[sessionState.phaseIndex];
    const phaseElapsed = now - sessionState.phaseStartTime;
    const phaseDuration = current.duration * 1000;
    const phaseRemaining = Math.max(0, (phaseDuration - phaseElapsed) / 1000);
    const elapsedTotal = now - sessionState.startedAt;
    const overallProgress = Math.min(1, elapsedTotal / sessionState.sessionDurationMs);
    const phaseProgress = Math.max(0, Math.min(1, phaseElapsed / phaseDuration));

    updateProgress(phaseProgress);
    updatePhaseUI(current, phaseRemaining, overallProgress);
    applyTheme(sessionState.sessionType);

    sessionState.timerId = requestAnimationFrame(tickSession);
  }

  // Library + UI helpers
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
    $("#breathStyleLabel").textContent = tech.summary;
    $("#techniqueShort").textContent = tech.summary;
    const tagsContainer = $("#techniqueTags");
    tagsContainer.innerHTML = "";
    [tech.level, tech.sessionType].forEach((tag) => {
      const span = document.createElement("span");
      span.className = "chip chip-primary";
      span.textContent = tag;
      tagsContainer.appendChild(span);
    });
    sessionState.sessionType = tech.sessionType;
    sessionState.pattern = { ...tech.pattern };
    $$(".chip-toggle").forEach((chip) => {
      chip.classList.toggle("chip-active", chip.getAttribute("data-intent") === tech.sessionType);
    });
    applyTheme(sessionState.sessionType);
    updateEstimatedTime();
  }

  function updateEstimatedTime() {
    const type = SESSION_TYPES[sessionState.sessionType];
    const minutes = Number($("#roundsInput").value) || type.durationMinutes;
    const pattern = sessionState.pattern || type.pattern;
    const cycleSeconds = patternCycleSeconds(pattern);
    const cycles = Math.ceil((minutes * 60) / cycleSeconds);
    const estText = minutes < 1 ? `${Math.round(minutes * 60)} sec` : `${minutes.toFixed(1)} min`;
    $("#estimatedTime").textContent = `Estimated duration: ${estText} (${cycles} cycles)`;
  }

  function initLibrary() {
    const container = $("#techLibrary");
    const detail = $("#libraryDetail");
    container.innerHTML = "";
    BREATH_LIBRARY.forEach((t) => {
      const card = document.createElement("div");
      card.className = "card";
      const tags = `<div class="chip-row small"><span class="chip">${t.level}</span><span class="chip">${t.sessionType}</span></div>`;
      card.innerHTML = `
        <div class="library-card-title">
          <h3>${t.label}</h3>
          <span class="chip chip-primary">${t.level}</span>
        </div>
        <p class="small text-muted">${t.summary}</p>
        <p class="small text-muted"><strong>Pattern:</strong> inhale ${t.pattern.inhale || 0} · hold ${t.pattern.hold || 0} · exhale ${t.pattern.exhale || 0}${t.pattern.holdEmpty ? ` · hold ${t.pattern.holdEmpty}` : ""}</p>
        ${tags}
        <div class="library-card-action">
          <button class="btn btn-soft btn-small" data-view-detail="${t.id}">Details</button>
          <button class="btn btn-primary btn-small" data-start-tech="${t.id}">Start</button>
        </div>
      `;
      container.appendChild(card);
    });

    container.addEventListener("click", (e) => {
      const detailId = e.target.getAttribute("data-view-detail");
      const startId = e.target.getAttribute("data-start-tech");
      if (detailId) renderDetail(detailId);
      if (startId) startFromLibrary(startId);
    });

    renderDetail(BREATH_LIBRARY[0].id);
  }

  function renderDetail(id) {
    const tech = BREATH_LIBRARY.find((t) => t.id === id);
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
      <h4>How to practice</h4>
      <ul>${tech.howTo.map((step) => `<li>${step}</li>`).join("")}</ul>
      <h4>Why it works</h4>
      <p>${tech.whyItWorks}</p>
      <p class="text-muted small"><strong>Caution:</strong> ${tech.cautions}</p>
      <button class="btn btn-primary" data-start-tech="${tech.id}">Start this technique</button>
    `;
    detail.querySelector("button[data-start-tech]").addEventListener("click", () =>
      startFromLibrary(tech.id)
    );
  }

  function startFromLibrary(id) {
    const tech = BREATH_LIBRARY.find((t) => t.id === id);
    if (!tech) return;
    $("#techniqueSelect").value = tech.id;
    $("#roundsInput").value = SESSION_TYPES[tech.sessionType].durationMinutes;
    sessionState.sessionType = tech.sessionType;
    sessionState.pattern = { ...tech.pattern };
    applyTheme(sessionState.sessionType);
    switchView("coachView");
    refreshTechniqueInfo();
    setCoreText(currentLocale === "tr" ? "Hazır" : "Ready", currentLocale === "tr" ? "Başlamak için dokun" : "Tap to begin");
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
    sel.value = currentProfileName;
    $("#profileTagline").textContent = `${currentProfileName}, your breath is your superpower.`;
    refreshProfileUI();
  }

  function refreshProfileUI() {
    const profile = getCurrentProfile();
    if (!profile) return;
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
  }

  function switchView(viewId) {
    $$(".view").forEach((v) => v.classList.remove("view-active"));
    $(`#${viewId}`).classList.add("view-active");
    $$(".nav-btn").forEach((b) => b.classList.remove("active"));
    $(`.nav-btn[data-view="${viewId}"]`).classList.add("active");
  }

  document.addEventListener("DOMContentLoaded", () => {
    initTechniqueSelect();
    initLibrary();
    initProfilesUI();
    applyTheme(sessionState.sessionType);
    applyLocale(currentLocale);

    $("#roundsInput").addEventListener("input", updateEstimatedTime);
    $("#techniqueSelect").addEventListener("change", refreshTechniqueInfo);

    $$(".chip-toggle").forEach((chip) => {
      chip.addEventListener("click", () => {
        $$(".chip-toggle").forEach((c) => c.classList.remove("chip-active"));
        chip.classList.add("chip-active");
        sessionState.sessionType = chip.getAttribute("data-intent");
        sessionState.pattern = { ...SESSION_TYPES[sessionState.sessionType].pattern };
        applyTheme(sessionState.sessionType);
        updateEstimatedTime();
      });
    });

    $("#startBtn").addEventListener("click", () => startCountdown());
    $("#stopBtn").addEventListener("click", () => stopSession(false));

    breathCoreButton.addEventListener("click", () => {
      if (sessionState.status === "idle" || sessionState.status === "finished") {
        startCountdown();
      } else if (sessionState.status === "running") {
        pauseSession();
      } else if (sessionState.status === "paused") {
        resumeSession();
      }
    });

    soundToggle.addEventListener("change", () => {
      soundEnabled = soundToggle.checked;
      localStorage.setItem(SOUND_PREF_KEY, String(soundEnabled));
    });

    $("#profileSelect").addEventListener("change", (e) => {
      currentProfileName = e.target.value;
      $("#profileTagline").textContent = `${currentProfileName}, your breath is your superpower.`;
      refreshProfileUI();
    });

    $("#newProfileBtn").addEventListener("click", () => {
      const name = prompt("New profile name:");
      if (!name) return;
      const trimmed = name.trim();
      if (!trimmed) return;
      ensureProfile(trimmed);
      saveProfiles(profiles);
      currentProfileName = trimmed;
      initProfilesUI();
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
