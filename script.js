// Breath Aurora main script
(() => {
  // ---------- Utility ----------
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

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

  // Lightweight phase chime using Web Audio
  function makeChime() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return () => {};
      const ctx = new AudioCtx();
      return () => {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(680, now);
        gain.gain.setValueAtTime(0.0, now);
        gain.gain.linearRampToValueAtTime(0.18, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
      };
    } catch {
      return () => {};
    }
  }

  const playChime = makeChime();

  // ---------- Data: Techniques ----------
  // For now we pick a few core patterns. You can expand this easily.
  const TECHNIQUES = [
    {
      id: "coherent",
      name: "Coherent Breathing (5–5)",
      level: "Beginner",
      intent: ["calm", "focus"],
      tags: ["HRV", "vagus nerve", "all-purpose"],
      short:
        "Gentle 5-second inhale, 5-second exhale. Great for stress, anxiety, and heart coherence.",
      style: "Inhale through nose · exhale through nose.",
      phases: [
        { label: "Inhale", type: "inhale", duration: 5 },
        { label: "Exhale", type: "exhale", duration: 5 }
      ]
    },
    {
      id: "box",
      name: "Box Breathing (4-4-4-4)",
      level: "Beginner",
      intent: ["calm", "focus"],
      tags: ["Navy SEAL", "sharp focus"],
      short:
        "Inhale 4, hold 4, exhale 4, hold 4. Fast way to reset under stress and sharpen attention.",
      style: "Nose-only, smooth breaths.",
      phases: [
        { label: "Inhale", type: "inhale", duration: 4 },
        { label: "Hold full", type: "hold", duration: 4 },
        { label: "Exhale", type: "exhale", duration: 4 },
        { label: "Hold empty", type: "hold", duration: 4 }
      ]
    },
    {
      id: "478",
      name: "4-7-8 Relaxing Breath",
      level: "Intermediate",
      intent: ["calm"],
      tags: ["sleep", "anxiety relief"],
      short:
        "Inhale 4, hold 7, exhale 8. Powerful downshift for nervous system, useful at night.",
      style: "Inhale nose · long exhale mouth with soft 'whoosh'.",
      phases: [
        { label: "Inhale", type: "inhale", duration: 4 },
        { label: "Hold full", type: "hold", duration: 7 },
        { label: "Exhale", type: "exhale", duration: 8 }
      ]
    },
    {
      id: "bhramari",
      name: "Bhramari (Humming Bee)",
      level: "Beginner",
      intent: ["calm"],
      tags: ["vagus nerve", "instant calm"],
      short:
        "Slow inhale, humming exhale. Vibrations calm the vagus nerve and quiet the mind.",
      style: "Inhale nose · exhale with closed mouth hum.",
      phases: [
        { label: "Inhale", type: "inhale", duration: 4 },
        { label: "Hum exhale", type: "exhale", duration: 6 }
      ]
    },
    {
      id: "wimhof-lite",
      name: "Wim Hof Lite (safety-first)",
      level: "Intermediate",
      intent: ["energy"],
      tags: ["energizing", "immune support"],
      short:
        "20 deep breaths + short hold. Always seated/lying. Never in water, driving, or standing.",
      style:
        "Deep belly-chest inhale, soft mouth exhale. Tingling is ok; stop if dizzy.",
      phases: [
        { label: "Deep inhale", type: "inhale", duration: 1.5 },
        { label: "Soft exhale", type: "exhale", duration: 1.5 }
      ],
      note:
        "After rounds you can add a comfortable breath-hold on empty if you’re experienced."
    }
  ];

  // ---------- Profiles & Badges ----------

  const STORAGE_KEY = "breathAuroraProfiles";

  const DEFAULT_BADGES = [
    {
      id: "first-session",
      label: "First Breath",
      desc: "Complete your very first guided session.",
      emoji: "🌱"
    },
    {
      id: "streak-3",
      label: "3-Day Streak",
      desc: "Breathe at least once a day for 3 days.",
      emoji: "🔥"
    },
    {
      id: "streak-7",
      label: "7-Day Streak",
      desc: "Hold a breathing streak for 7 days.",
      emoji: "🌈"
    },
    {
      id: "minutes-60",
      label: "1 Hour of Presence",
      desc: "Accumulate 60 total minutes of practice.",
      emoji: "⏱️"
    },
    {
      id: "night-owl",
      label: "Night Owl",
      desc: "Complete a session after 22:00.",
      emoji: "🌙"
    }
  ];

  function loadProfiles() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const obj = JSON.parse(raw);
        if (obj && typeof obj === "object") return obj;
      }
    } catch {}
    // default guest profile
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
      notesByDate: {}
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
        notesByDate: {}
      };
    }
    return profiles[name];
  }

  function awardBadges(profile) {
    const unlocked = profile.badges || {};
    const tSessions = profile.totalSessions || 0;
    const tMinutes = profile.totalMinutes || 0;
    const streak = profile.bestStreak || 0;
    const flags = profile.flags || {};

    if (tSessions >= 1) unlocked["first-session"] = true;
    if (streak >= 3) unlocked["streak-3"] = true;
    if (streak >= 7) unlocked["streak-7"] = true;
    if (tMinutes >= 60) unlocked["minutes-60"] = true;
    if (flags.nightOwl) unlocked["night-owl"] = true;

    profile.badges = unlocked;
  }

  // Record a completed session
  function recordSession(durationMinutes) {
    const profile = getCurrentProfile();
    const today = todayKey();
    const yesterday = yesterdayKey();

    if (profile.lastPracticeDate === today) {
      // Already counted for streak; just add minutes and sessions.
    } else if (profile.lastPracticeDate === yesterday) {
      profile.currentStreak = (profile.currentStreak || 0) + 1;
    } else {
      profile.currentStreak = 1;
    }

    profile.bestStreak = Math.max(
      profile.bestStreak || 0,
      profile.currentStreak || 0
    );

    profile.lastPracticeDate = today;
    profile.totalSessions = (profile.totalSessions || 0) + 1;
    profile.totalMinutes = (profile.totalMinutes || 0) + durationMinutes;

    // Night owl flag: any session after 22:00
    const hour = new Date().getHours();
    if (hour >= 22 || hour < 5) {
      profile.flags = profile.flags || {};
      profile.flags.nightOwl = true;
    }

    awardBadges(profile);
    saveProfiles(profiles);
    refreshProfileUI();
  }

  // ---------- Session Engine ----------

  const circleEl = $(".breath-circle-progress");
  let circleCircumference = 339;
  if (circleEl && circleEl.r && circleEl.r.baseVal) {
    const r = circleEl.r.baseVal.value;
    circleCircumference = 2 * Math.PI * r;
    circleEl.style.strokeDasharray = `${circleCircumference} ${circleCircumference}`;
    circleEl.style.strokeDashoffset = circleCircumference;
  }

  function setCircleProgress(p) {
    const clamped = Math.max(0, Math.min(1, p || 0));
    const offset = circleCircumference * (1 - clamped);
    circleEl.style.strokeDashoffset = offset;
  }

  let sessionState = {
    running: false,
    technique: null,
    phases: [],
    phaseIndex: 0,
    phaseEndTime: 0,
    phaseStartTime: 0,
    totalDurationMs: 0,
    startedAt: 0,
    timerId: null,
    soundOn: true
  };

  function buildSchedule(tech, rounds) {
    const phases = [];
    const base = tech.phases || [];
    for (let i = 0; i < rounds; i++) {
      for (const ph of base) {
        phases.push({
          label: ph.label,
          type: ph.type,
          duration: ph.duration
        });
      }
    }
    const total = phases.reduce((sum, p) => sum + p.duration, 0);
    return { phases, totalSeconds: total };
  }

  function updatePhaseLabels(phase, remaining, overallProgress) {
    const phaseMainLabel = $("#phaseMainLabel");
    const phaseSubLabel = $("#phaseSubLabel");
    const phaseCountdown = $("#phaseCountdown");
    const sessionProgressText = $("#sessionProgressText");

    if (!phase) {
      phaseMainLabel.textContent = "Ready";
      phaseSubLabel.textContent = "Press start to begin";
      phaseCountdown.textContent = "00.0 s";
      sessionProgressText.textContent = "0%";
      setCircleProgress(0);
      return;
    }

    phaseMainLabel.textContent = phase.label;
    const typeText =
      phase.type === "inhale"
        ? "Breathe in softly through the nose."
        : phase.type === "exhale"
        ? "Let the exhale be slow and relaxed."
        : "Stay still. Soften the body.";
    phaseSubLabel.textContent = typeText;
    phaseCountdown.textContent = `${remaining.toFixed(1)} s`;
    sessionProgressText.textContent = `${Math.round(overallProgress * 100)}%`;
  }

  function startSession() {
    if (sessionState.running) return;

    const techId = $("#techniqueSelect").value;
    const tech = TECHNIQUES.find((t) => t.id === techId) || TECHNIQUES[0];
    const rounds = Math.max(1, Math.min(20, parseInt($("#roundsInput").value || "1", 10)));
    const schedule = buildSchedule(tech, rounds);

    sessionState.running = true;
    sessionState.technique = tech;
    sessionState.phases = schedule.phases;
    sessionState.phaseIndex = 0;
    sessionState.totalDurationMs = schedule.totalSeconds * 1000;
    sessionState.startedAt = performance.now();
    sessionState.soundOn = $("#soundToggle").checked;

    const first = sessionState.phases[0];
    const now = performance.now();
    sessionState.phaseStartTime = now;
    sessionState.phaseEndTime = now + first.duration * 1000;

    $("#startBtn").disabled = true;
    $("#stopBtn").disabled = false;

    tickSession();
  }

  function stopSession(completed) {
    sessionState.running = false;
    if (sessionState.timerId) {
      cancelAnimationFrame(sessionState.timerId);
      sessionState.timerId = null;
    }
    $("#startBtn").disabled = false;
    $("#stopBtn").disabled = true;

    if (completed && sessionState.totalDurationMs > 0) {
      const minutes = sessionState.totalDurationMs / 1000 / 60;
      const rounded = Math.max(1, Math.round(minutes));
      recordSession(rounded);
    }

    // Reset visuals
    updatePhaseLabels(null, 0, 0);
  }

  function tickSession() {
    if (!sessionState.running) return;

    const now = performance.now();
    const phase = sessionState.phases[sessionState.phaseIndex];

    if (!phase) {
      stopSession(true);
      return;
    }

    const remainingMs = sessionState.phaseEndTime - now;
    if (remainingMs <= 0) {
      // Move to next phase
      sessionState.phaseIndex++;
      const next = sessionState.phases[sessionState.phaseIndex];
      if (!next) {
        stopSession(true);
        return;
      }
      sessionState.phaseStartTime = now;
      sessionState.phaseEndTime = now + next.duration * 1000;
      if (sessionState.soundOn) playChime();
    }

    const current = sessionState.phases[sessionState.phaseIndex];
    const phaseElapsed = now - sessionState.phaseStartTime;
    const phaseDuration = current.duration * 1000;
    const phaseRemaining = Math.max(0, (phaseDuration - phaseElapsed) / 1000);

    const elapsedTotal = now - sessionState.startedAt;
    const overallProgress = Math.min(
      1,
      elapsedTotal / sessionState.totalDurationMs
    );

    // Circle progress: show per-phase fraction
    const phaseProgress = Math.max(
      0,
      Math.min(1, phaseElapsed / phaseDuration)
    );
    setCircleProgress(phaseProgress);

    updatePhaseLabels(current, phaseRemaining, overallProgress);

    sessionState.timerId = requestAnimationFrame(tickSession);
  }

  // ---------- UI: Techniques, Library, Profile ----------

  function initTechniqueSelect() {
    const sel = $("#techniqueSelect");
    TECHNIQUES.forEach((t) => {
      const opt = document.createElement("option");
      opt.value = t.id;
      opt.textContent = `${t.name} · ${t.level}`;
      sel.appendChild(opt);
    });
    sel.value = "coherent";
    refreshTechniqueInfo();
  }

  function refreshTechniqueInfo() {
    const techId = $("#techniqueSelect").value;
    const tech = TECHNIQUES.find((t) => t.id === techId) || TECHNIQUES[0];

    const tagsContainer = $("#techniqueTags");
    tagsContainer.innerHTML = "";
    const baseTags = [...(tech.tags || []), tech.level];
    baseTags.forEach((tag) => {
      const span = document.createElement("span");
      span.className = "chip chip-primary";
      span.textContent = tag;
      tagsContainer.appendChild(span);
    });

    $("#techniqueShort").textContent = tech.short || "";
    $("#breathStyleLabel").textContent = tech.style || "Comfortable nasal breathing.";

    // Estimate time from rounds
    const rounds = Math.max(
      1,
      parseInt($("#roundsInput").value || "1", 10)
    );
    const schedule = buildSchedule(tech, rounds);
    const minutes = schedule.totalSeconds / 60;
    const est =
      minutes < 1
        ? `${Math.round(schedule.totalSeconds)} sec`
        : `${minutes.toFixed(1)} min`;
    $("#estimatedTime").textContent = `Estimated duration: ${est}`;
  }

  function initLibrary() {
    const container = $("#techLibrary");
    container.innerHTML = "";
    TECHNIQUES.forEach((t) => {
      const card = document.createElement("div");
      card.className = "card";
      const tags = (t.tags || []).map((x) => `<span class="chip">${x}</span>`).join(" ");
      card.innerHTML = `
        <div class="library-card-title">
          <h3>${t.name}</h3>
          <span class="chip chip-primary">${t.level}</span>
        </div>
        <p class="small text-muted" style="margin-top:4px;">${t.short}</p>
        <p class="small"><strong>Style:</strong> ${t.style || ""}</p>
        <p class="small text-muted"><strong>Pattern:</strong>
          ${t.phases
            .map((p) => `${p.label} ${p.duration}s`)
            .join(" · ")}
        </p>
        <div class="chip-row small">${tags}</div>
        ${
          t.note
            ? `<p class="small" style="margin-top:6px;color:#f97373;"><strong>Safety:</strong> ${t.note}</p>`
            : ""
        }
      `;
      container.appendChild(card);
    });
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
    $("#profileTagline").textContent = `Hello, ${currentProfileName}. Your breath is your superpower.`;
    refreshProfileUI();
  }

  function refreshProfileUI() {
    const profile = getCurrentProfile();
    if (!profile) return;

    // Stats
    $("#statCurrentStreak").textContent = `${profile.currentStreak || 0} days`;
    $("#statBestStreak").textContent = `${profile.bestStreak || 0} days`;
    $("#statTotalSessions").textContent = profile.totalSessions || 0;
    $("#statTotalMinutes").textContent = profile.totalMinutes || 0;

    const maxForBar = Math.max(7, profile.bestStreak || 0);
    const barPercent = Math.min(
      100,
      ((profile.currentStreak || 0) / maxForBar) * 100
    );
    $("#streakFill").style.width = `${barPercent}%`;

    const streakHint = $("#streakHint");
    if (!profile.lastPracticeDate) {
      streakHint.textContent =
        "No streak yet. Even one 2-minute session today is a great start.";
    } else if (profile.currentStreak >= 3) {
      streakHint.textContent =
        "Nice consistency. A few conscious breaths each day reshape the nervous system.";
    } else {
      streakHint.textContent =
        "Keep breathing daily. Streaks help your brain turn this into an automatic habit.";
    }

    // Badges
    const badgeGrid = $("#badgeGrid");
    badgeGrid.innerHTML = "";
    const unlocked = profile.badges || {};
    DEFAULT_BADGES.forEach((b) => {
      const div = document.createElement("div");
      div.className = "badge-card" + (unlocked[b.id] ? " unlocked" : "");
      div.innerHTML = `
        <div class="badge-meta">
          <span class="badge-title">${b.emoji} ${b.label}</span>
          <span class="badge-chip">${
            unlocked[b.id] ? "Unlocked" : "Locked"
          }</span>
        </div>
        <p>${b.desc}</p>
      `;
      badgeGrid.appendChild(div);
    });

    // Daily note
    const tk = todayKey();
    $("#dailyNote").value = profile.notesByDate?.[tk] || "";

    // Today minutes label under coach
    $("#todayMinutesLabel").textContent = `${profile.totalMinutes || 0} min`;
  }

  // ---------- Navigation ----------

  function switchView(viewId) {
    $$(".view").forEach((v) => v.classList.remove("view-active"));
    $(`#${viewId}`).classList.add("view-active");
    $$(".nav-btn").forEach((b) => b.classList.remove("active"));
    $(`.nav-btn[data-view="${viewId}"]`).classList.add("active");
  }

  // ---------- Events ----------

  document.addEventListener("DOMContentLoaded", () => {
    initTechniqueSelect();
    initLibrary();
    initProfilesUI();

    // Nav
    $$(".nav-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const view = btn.getAttribute("data-view");
        switchView(view);
      });
    });

    // Technique change
    $("#techniqueSelect").addEventListener("change", () => {
      refreshTechniqueInfo();
    });

    $("#roundsInput").addEventListener("input", () => {
      refreshTechniqueInfo();
    });

    // Intent chips (purely cosmetic for now)
    $$(".chip-toggle").forEach((chip) => {
      chip.addEventListener("click", () => {
        $$(".chip-toggle").forEach((c) => c.classList.remove("chip-active"));
        chip.classList.add("chip-active");
      });
    });

    // Start / Stop
    $("#startBtn").addEventListener("click", () => {
      startSession();
    });
    $("#stopBtn").addEventListener("click", () => {
      stopSession(false);
    });

    // Profiles
    $("#profileSelect").addEventListener("change", (e) => {
      currentProfileName = e.target.value;
      $("#profileTagline").textContent = `Hello, ${currentProfileName}. Your breath is your superpower.`;
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

    // Save daily note
    $("#saveNoteBtn").addEventListener("click", () => {
      const profile = getCurrentProfile();
      const tk = todayKey();
      profile.notesByDate = profile.notesByDate || {};
      profile.notesByDate[tk] = $("#dailyNote").value || "";
      saveProfiles(profiles);
      alert("Saved locally ✅");
    });

    // Initial labels
    refreshTechniqueInfo();
    updatePhaseLabels(null, 0, 0);
  });
})();
