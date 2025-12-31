// Next, React
import React, { FC, useState, useRef, useEffect } from 'react';
import pkg from '../../../package.json';


// ❌ DO NOT EDIT ANYTHING ABOVE THIS LINE


export const HomeView: FC = () => {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      {/* HEADER – fake Scrolly feed tabs */}
      <header className="flex items-center justify-center border-b border-white/10 py-3">
        <div className="flex items-center gap-2 rounded-full bg-white/5 px-2 py-1 text-[11px]">
          <button className="rounded-full bg-slate-900 px-3 py-1 font-semibold text-white">
            Feed
          </button>
          <button className="rounded-full px-3 py-1 text-slate-400">
            Casino
          </button>
          <button className="rounded-full px-3 py-1 text-slate-400">
            Kids
          </button>
        </div>
      </header>


      {/* MAIN – central game area (phone frame) */}
      <main className="flex flex-1 items-center justify-center p-0 md:px-4 md:py-3">
        <div className="relative h-full w-full md:h-auto md:aspect-[9/16] md:max-w-md overflow-hidden md:rounded-3xl md:border border-white/10 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 md:shadow-[0_0_40px_rgba(56,189,248,0.35)]">
          {/* Fake “feed card” top bar inside the phone */}
          <div className="flex items-center justify-between px-3 py-2 text-[10px] text-slate-400">
            <span className="rounded-full bg-white/5 px-2 py-1 text-[9px] uppercase tracking-wide">
              Scrolly Game
            </span>
            <span className="text-[9px] opacity-70">#NoCodeJam</span>
          </div>


          {/* The game lives INSIDE this phone frame */}
          <div className="flex h-[calc(100%-26px)] flex-col items-center justify-start px-3 pb-3 pt-1">
            <GameSandbox />
          </div>
        </div>
      </main>


      {/* FOOTER – tiny version text */}
      <footer className="flex h-5 items-center justify-center border-t border-white/10 px-2 text-[9px] text-slate-500">
        <span>Scrolly · v{pkg.version}</span>
      </footer>
    </div>
  );
};


// ✅ THIS IS THE ONLY PART YOU EDIT FOR THE JAM
// Replace this entire GameSandbox component with the one AI generates.
// Keep the name `GameSandbox` and the `FC` type.




const Confetti: FC<{ continuous?: boolean }> = ({ continuous }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);


  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;


    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();


    const particles: { x: number; y: number; vx: number; vy: number; color: string; size: number; rotation: number; vRotation: number; opacity: number }[] = [];
    const colors = ['#38bdf8', '#fb7185', '#facc15', '#4ade80', '#a78bfa'];


    for (let i = 0; i < 200; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 20,
        vy: (Math.random() - 1.5) * 20,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
        vRotation: (Math.random() - 0.5) * 10,
        opacity: 1,
      });
    }


    let animationId: number;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
     
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.5; // Gravity
        p.vx *= 0.95; // Friction
        p.vy *= 0.95;
        p.rotation += p.vRotation;
        p.opacity -= 0.015;


        if (p.opacity <= 0) {
          if (continuous) {
            p.x = Math.random() * canvas.width;
            p.y = -20;
            p.vx = (Math.random() - 0.5) * 4;
            p.vy = Math.random() * 5 + 2;
            p.opacity = 1;
          } else {
            return;
          }
        }


        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      });


      animationId = requestAnimationFrame(render);
    };
    render();


    return () => cancelAnimationFrame(animationId);
  }, [continuous]);


  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-50 w-full h-full" />;
};


// -------------------------------------------------------
//  GAME SANDBOX (FINAL DROP-IN VERSION)
// -------------------------------------------------------




const GameSandbox: FC = () => {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { setMounted(true); }, []);

  // -------------------------------------------------------
  //  STATS & LEVEL PROGRESSION
  // -------------------------------------------------------
  const [stats, setStats] = React.useState(() => {
    if (typeof window === 'undefined') return { gamesPlayed: 0, gamesWon: 0, totalScore: 0, bestStreak: 0, currentStreak: 0, totalTime: 0, fastestWin: 0, dailyStreak: 0, lastDailyWin: null, bestSpeedRun: 0 };
    const saved = localStorage.getItem("crossing-sum-stats");
    if (saved) {
      const parsed = JSON.parse(saved);
      // Migration for legacy stats
      if (typeof parsed.games === 'number' && typeof parsed.gamesPlayed === 'undefined') {
        return {
          gamesPlayed: parsed.games,
          gamesWon: parsed.games,
          totalScore: parsed.totalScore,
          bestStreak: parsed.games,
          currentStreak: parsed.games,
          totalTime: 0,
          fastestWin: 0,
          dailyStreak: 0,
          lastDailyWin: null,
          bestSpeedRun: 0
        };
      }
      return { dailyStreak: 0, lastDailyWin: null, bestSpeedRun: 0, ...parsed };
    }
    return { gamesPlayed: 0, gamesWon: 0, totalScore: 0, bestStreak: 0, currentStreak: 0, totalTime: 0, fastestWin: 0, dailyStreak: 0, lastDailyWin: null, bestSpeedRun: 0 };
  });


  // NEW: Load saved game state if exists
  const [savedState] = React.useState(() => {
    if (typeof window === 'undefined') return null;
    try {
      const saved = localStorage.getItem("crossing-sum-gamestate");
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });


  const [startTime, setStartTime] = React.useState(() => savedState?.startTime || Date.now());


  const getGridSize = (games: number) => {
    // Levels 1-2: 3x3 Grid
    if (games < 2) return 3;
    // Levels 3-4: 4x4 Grid
    if (games < 4) return 4;
    // Levels 5+: 5x5 Grid
    return 5;
  };


  // Initialize gameMode from saved state if available
  const [gameMode, setGameMode] = React.useState<"normal" | "daily" | "speedrun">(() => savedState?.gameMode || "normal");




  const seededRandom = (seed: number) => {
    return function () {
      var t = (seed += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };




  // -------------------------------------------------------
  //  SOUNDS (Web Audio API)
  // -------------------------------------------------------
  const [muted, setMuted] = React.useState(false);




  const playSound = (type: "pop" | "error" | "win") => {
    if (muted) return;
    // @ts-ignore
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;




    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();




    osc.connect(gain);
    gain.connect(ctx.destination);




    const now = ctx.currentTime;




    if (type === "pop") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(880, now);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === "error") {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.linearRampToValueAtTime(55, now + 0.2);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    } else if (type === "win") {
      osc.type = "square";
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.setValueAtTime(600, now + 0.1);
      osc.frequency.setValueAtTime(1000, now + 0.2);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.4);
    }
  };




  // -------------------------------------------------------
  //  PUZZLE GENERATION
  // -------------------------------------------------------
  const generatePuzzle = (rows: number, cols: number, rng = Math.random, maxCellValue = 9) => {
    const newGrid = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => Math.floor(rng() * maxCellValue) + 1)
    );




    let mask: boolean[][] = [];




    const isMaskGood = (m: boolean[][]) => {
      let total = 0;
      for (let r = 0; r < rows; r++) {
        let countRow = 0;
        for (let c = 0; c < cols; c++) {
          if (m[r][c]) {
            countRow++;
            total++;
          }
        }
        if (countRow === 0) return false;
      }
      for (let c = 0; c < cols; c++) {
        let countCol = 0;
        for (let r = 0; r < rows; r++) {
          if (m[r][c]) countCol++;
        }
        if (countCol === 0) return false;
      }
      return total >= 5;
    };




    for (;;) {
      mask = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => rng() < 0.5)
      );
      if (isMaskGood(mask)) break;
    }




    const rowT = Array.from({ length: rows }, () => 0);
    const colT = Array.from({ length: cols }, () => 0);




    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (mask[r][c]) {
          rowT[r] += newGrid[r][c];
          colT[c] += newGrid[r][c];
        }
      }
    }




    return {
      grid: newGrid,
      mask,
      rowTargets: rowT,
      colTargets: colT,
    };
  };




  // -------------------------------------------------------
  //  STATE
  // -------------------------------------------------------
  const [puzzle, setPuzzle] = React.useState(() => {
    if (savedState?.puzzle) return savedState.puzzle;
    const size = getGridSize(stats.gamesWon);
    const maxVal = stats.gamesWon >= 4 ? 25 : 9;
    return generatePuzzle(size, size, Math.random, maxVal);
  });
  const [cells, setCells] = React.useState<number[][]>(() => savedState?.cells || puzzle.grid);
  const [solutionMask, setSolutionMask] = React.useState<boolean[][]>(() => savedState?.solutionMask || puzzle.mask);
  const [rowTargets, setRowTargets] = React.useState<number[]>(() => savedState?.rowTargets || puzzle.rowTargets);
  const [colTargets, setColTargets] = React.useState<number[]>(() => savedState?.colTargets || puzzle.colTargets);
  const [speedRunCount, setSpeedRunCount] = React.useState(() => savedState?.speedRunCount || 0);
  const [speedRunStartTime, setSpeedRunStartTime] = React.useState(() => savedState?.speedRunStartTime || 0);




  const ROWS = cells.length;
  const COLS = cells[0]?.length || 0;




  const [marks, setMarks] = React.useState<boolean[][]>(
    () => savedState?.marks || Array.from({ length: puzzle.grid.length }, () => Array.from({ length: puzzle.grid[0].length }, () => false))
  );




  const [score, setScore] = React.useState(() => savedState?.score || 0);


  // Power-ups
  const [powerups, setPowerups] = React.useState(() => savedState?.powerups || { freeze: 2, reveal: 1 });
  const [isFrozen, setIsFrozen] = React.useState(false);


  // -------------------------------------------------------
  //  HIGH SCORE
  // -------------------------------------------------------
  const [highScore, setHighScore] = React.useState(0);




  React.useEffect(() => {
    const saved = localStorage.getItem("crossing-sum-highscore");
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);




  React.useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem("crossing-sum-highscore", score.toString());
    }
  }, [score]);




  // Initial game start tracking (if not restoring)
  React.useEffect(() => {
    if (!savedState) {
      setStats((s: any) => {
        const next = { ...s, gamesPlayed: s.gamesPlayed + 1 };
        localStorage.setItem("crossing-sum-stats", JSON.stringify(next));
        return next;
      });
      setStartTime(Date.now());
    }
  }, []);


  // -------------------------------------------------------
  const updateStats = (finalScore: number) => {
    const now = Date.now();
    const timeTaken = (now - startTime) / 1000;


    setStats((s: any) => {
      let newDailyStreak = s.dailyStreak || 0;
      let newLastDailyWin = s.lastDailyWin;
      let newBestSpeedRun = s.bestSpeedRun || 0;


      if (gameMode === "daily") {
        const today = new Date();
        const todayStr = `${today.getUTCFullYear()}-${today.getUTCMonth()}-${today.getUTCDate()}`;
       
        if (newLastDailyWin !== todayStr) {
          const yesterday = new Date();
          yesterday.setUTCDate(yesterday.getUTCDate() - 1);
          const yesterdayStr = `${yesterday.getUTCFullYear()}-${yesterday.getUTCMonth()}-${yesterday.getUTCDate()}`;


          if (newLastDailyWin === yesterdayStr) {
            newDailyStreak += 1;
          } else {
            newDailyStreak = 1;
          }
          newLastDailyWin = todayStr;
        }
      }
     
      if (gameMode === "speedrun" && speedRunCount >= 5) {
         const runTime = (Date.now() - speedRunStartTime) / 1000;
         if (newBestSpeedRun === 0 || runTime < newBestSpeedRun) newBestSpeedRun = runTime;
      }


      const newStats = {
        ...s,
        gamesWon: s.gamesWon + 1,
        totalScore: s.totalScore + finalScore,
        currentStreak: s.currentStreak + 1,
        bestStreak: Math.max(s.bestStreak, s.currentStreak + 1),
        totalTime: s.totalTime + timeTaken,
        fastestWin: s.fastestWin === 0 ? timeTaken : Math.min(s.fastestWin, timeTaken),
        dailyStreak: newDailyStreak,
        lastDailyWin: newLastDailyWin,
        bestSpeedRun: newBestSpeedRun,
      };
      localStorage.setItem("crossing-sum-stats", JSON.stringify(newStats));
      return newStats;
    });
  };




  const [penalties, setPenalties] = React.useState(() => savedState?.penalties || 0);
  const [attempts, setAttempts] = React.useState(() => savedState?.attempts || 0);
  const [status, setStatus] = React.useState<"playing" | "won" | "lost">(() => savedState?.status || "playing");
  const [maxTime, setMaxTime] = React.useState(() => savedState?.maxTime || 60);
  const [timeLeft, setTimeLeft] = React.useState(() => savedState?.timeLeft || 60);
  const [flash, setFlash] = React.useState<{ r: number; c: number } | null>(null);
  const [finalTime, setFinalTime] = React.useState(() => savedState?.finalTime || 0);
  const [copied, setCopied] = React.useState(false);
  const [earnedStreakBonus, setEarnedStreakBonus] = React.useState(0);




  const [hintsUsed, setHintsUsed] = React.useState(() => savedState?.hintsUsed || 0);
  const [hardMode, setHardMode] = React.useState(() => {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem("crossing-sum-hardmode");
    return saved ? JSON.parse(saved) : false;
  });
  const [combo, setCombo] = React.useState(() => savedState?.combo || 0);
  const [isShaking, setIsShaking] = React.useState(false);
  const [showSettings, setShowSettings] = React.useState(false);
  const [showStats, setShowStats] = React.useState(false);
  const [darkMode, setDarkMode] = React.useState(() => {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem("crossing-sum-darkmode");
    return saved ? JSON.parse(saved) : false;
  });
  const [zenMode, setZenMode] = React.useState(() => {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem("crossing-sum-zenmode");
    return saved ? JSON.parse(saved) : false;
  });
  const [colorblindMode, setColorblindMode] = React.useState(() => {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem("crossing-sum-colorblindmode");
    return saved ? JSON.parse(saved) : false;
  });
  const [musicEnabled, setMusicEnabled] = React.useState(() => {
    if (typeof window === 'undefined') return true;
    const saved = localStorage.getItem("crossing-sum-music-v2");
    return saved ? JSON.parse(saved) : true;
  });
  const [musicVolume, setMusicVolume] = React.useState(() => {
    if (typeof window === 'undefined') return 0.3;
    const saved = localStorage.getItem("crossing-sum-music-volume");
    return saved ? parseFloat(saved) : 0.3;
  });
  const [showTutorial, setShowTutorial] = React.useState(() => {
    if (typeof window === 'undefined') return true;
    return !localStorage.getItem("crossing-sum-tutorial-seen");
  });

  const [showSplash, setShowSplash] = React.useState(true);
  const [splashLevel, setSplashLevel] = React.useState(stats.gamesWon + 1);
  const [showModeSelector, setShowModeSelector] = React.useState(false);
  const [showFooterModeSelector, setShowFooterModeSelector] = React.useState(false);

  const closeTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem("crossing-sum-tutorial-seen", "true");
  };


  const audioRef = React.useRef<HTMLAudioElement>(null);


  // Keyboard navigation state
  const [focusedCell, setFocusedCell] = React.useState<{r: number, c: number} | null>(null);


  React.useEffect(() => {
    localStorage.setItem("crossing-sum-darkmode", JSON.stringify(darkMode));
  }, [darkMode]);
  React.useEffect(() => {
    localStorage.setItem("crossing-sum-zenmode", JSON.stringify(zenMode));
  }, [zenMode]);
  React.useEffect(() => {
    localStorage.setItem("crossing-sum-colorblindmode", JSON.stringify(colorblindMode));
  }, [colorblindMode]);
  React.useEffect(() => {
    localStorage.setItem("crossing-sum-hardmode", JSON.stringify(hardMode));
  }, [hardMode]);
  React.useEffect(() => {
    localStorage.setItem("crossing-sum-music-v2", JSON.stringify(musicEnabled));
    if (audioRef.current) {
      if (musicEnabled) {
        // @ts-ignore
        audioRef.current.volume = musicVolume; // Set volume (0.0 to 1.0)
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }
  }, [musicEnabled, musicVolume]);
  React.useEffect(() => {
    localStorage.setItem("crossing-sum-music-volume", musicVolume.toString());
  }, [musicVolume]);

  // Fix for browser autoplay policy: try to play music on user interaction
  React.useEffect(() => {
    if (!musicEnabled) return;

    const attemptPlay = () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play().catch(() => {});
      }
    };

    window.addEventListener("click", attemptPlay);
    window.addEventListener("keydown", attemptPlay);
    window.addEventListener("touchstart", attemptPlay);

    return () => {
      window.removeEventListener("click", attemptPlay);
      window.removeEventListener("keydown", attemptPlay);
      window.removeEventListener("touchstart", attemptPlay);
    };
  }, [musicEnabled]);


  // Timer Logic
  React.useEffect(() => {
    if (status !== 'playing' || showSettings || showStats || zenMode || showTutorial || gameMode === 'speedrun' || isFrozen || showSplash) return;


    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setStatus('lost');
          playSound('error');
          return 0;
        }
        return t - 1;
      });
    }, 1000);


    return () => clearInterval(timer);
  }, [status, showSettings, showStats, zenMode, showTutorial, gameMode, isFrozen, showSplash]);


  const clone2D = <T,>(arr: T[][]) => arr.map((row) => row.slice());




  const resetProgress = () => {
    if (!window.confirm("Are you sure you want to reset all progress? This cannot be undone.")) return;




    localStorage.removeItem("crossing-sum-stats");
    localStorage.removeItem("crossing-sum-highscore");
    localStorage.removeItem("crossing-sum-gamestate");




    setStats({ gamesPlayed: 1, gamesWon: 0, totalScore: 0, bestStreak: 0, currentStreak: 0, totalTime: 0, fastestWin: 0, dailyStreak: 0, lastDailyWin: null, bestSpeedRun: 0 });
    setHighScore(0);
    setScore(0);
    setStartTime(Date.now());




    // Reset to level 1
    const size = getGridSize(0);
    const np = generatePuzzle(size, size);


    const baseTime = 60; // Level 1 time
    const adjustedTime = hardMode ? Math.floor(baseTime * 0.7) : baseTime;
    setMaxTime(adjustedTime);
    setTimeLeft(adjustedTime);


    setPuzzle(np);
    setCells(np.grid);
    setSolutionMask(np.mask);
    setRowTargets(np.rowTargets);
    setColTargets(np.colTargets);




    setMarks(Array.from({ length: size }, () => Array(size).fill(false)));
    setPenalties(0);
    setAttempts(0);
    setFlash(null);
    setStatus("playing");
    setHintsUsed(0);
    setCombo(0);
    setFocusedCell(null);
    setCopied(false);
    setEarnedStreakBonus(0);
    setSpeedRunCount(0);
    setSpeedRunStartTime(0);
    setPowerups({ freeze: 2, reveal: 1 });
   
    setShowSettings(false);
  };




  const triggerError = () => {
    playSound("error");
    setCombo(0);
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 400);
  };




  // Confetti particles
  const confettiParticles = React.useMemo(() => {
    return Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 8 + 4,
      color: ["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899"][Math.floor(Math.random() * 6)],
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2,
      shape: Math.random() > 0.5 ? "50%" : "2px",
    }));
  }, []);




  // -------------------------------------------------------
  //  LOAD NEW PUZZLE
  // -------------------------------------------------------
  const loadNewPuzzle = (mode: "normal" | "daily" | "speedrun" = gameMode, levelOverride?: number) => {
    let np;
    let size;




    if (mode === "speedrun") {
      let nextCount = speedRunCount;
      // If switching to speedrun, or restarting (lost/won final), or explicit reset
      if (gameMode !== "speedrun" || (status !== "playing" && speedRunCount >= 5) || (status === "lost")) {
         nextCount = 1;
         setSpeedRunStartTime(Date.now());
      } else if (status === "won") {
         nextCount += 1;
      }
     
      setSpeedRunCount(nextCount);
     
      size = nextCount <= 2 ? 3 : 4; // 1-2: 3x3, 3-5: 4x4
      np = generatePuzzle(size, size);
      setMaxTime(0); // No countdown
      setTimeLeft(0);
    } else if (mode === "daily") {
      const today = new Date();
      const seedStr = `${today.getUTCFullYear()}-${today.getUTCMonth()}-${today.getUTCDate()}`;
      let seed = 0;
      for (let i = 0; i < seedStr.length; i++) {
        seed = ((seed << 5) - seed) + seedStr.charCodeAt(i);
        seed |= 0;
      }
      size = 6;
      np = generatePuzzle(size, size, seededRandom(seed));
      const baseTime = 180;
      const adjustedTime = hardMode ? Math.floor(baseTime * 0.7) : baseTime;
      setMaxTime(adjustedTime);
      setTimeLeft(adjustedTime);
    } else {
      size = getGridSize(stats.gamesWon);
      np = generatePuzzle(size, size);
      const baseTime = size === 3 ? 60 : (size === 4 ? 120 : 180);
      const adjustedTime = hardMode ? Math.floor(baseTime * 0.7) : baseTime;
      setMaxTime(adjustedTime);
      setTimeLeft(adjustedTime);
    }




    setPuzzle(np);
    setCells(np.grid);
    setSolutionMask(np.mask);
    setRowTargets(np.rowTargets);
    setColTargets(np.colTargets);




    setMarks(Array.from({ length: size }, () => Array(size).fill(false)));
    setPenalties(0);
    setAttempts(0);
    setFlash(null);
    setStatus("playing");
    setHintsUsed(0);
    setCombo(0);
    setFocusedCell(null);
    setCopied(false);
    setEarnedStreakBonus(0);

    // Grant powerups occasionally
    if ((stats.gamesWon + 1) % 3 === 0) {
      setPowerups((p: any) => ({ ...p, freeze: p.freeze + 1 }));
    }


    setStats((s: any) => {
      const next = { ...s, gamesPlayed: s.gamesPlayed + 1 };
      localStorage.setItem("crossing-sum-stats", JSON.stringify(next));
      return next;
    });
    setStartTime(Date.now());
  };




  // -------------------------------------------------------
  //  RESTART SAME PUZZLE
  // -------------------------------------------------------
  const restart = () => {
    setMarks(Array.from({ length: ROWS }, () => Array(COLS).fill(false)));
    setPenalties(0);
    setAttempts(0);
    setFlash(null);
    setStatus("playing");
    setHintsUsed(0);
    setCombo(0);
    setFocusedCell(null);
    setCopied(false);
    setEarnedStreakBonus(0);
    setTimeLeft(maxTime);
  };




  // -------------------------------------------------------
  //  HINT
  // -------------------------------------------------------
  const giveHint = () => {
    if (status !== "playing") return;
    if (hardMode) return; // Disable hints in hard mode
    if (score < 50) return;




    const wrong = [];




    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (marks[r][c] !== solutionMask[r][c]) wrong.push({ r, c });
      }
    }




    if (wrong.length === 0) return;




    const choice = wrong[Math.floor(Math.random() * wrong.length)];
    const original = clone2D(marks);
    const temp = clone2D(marks);
    temp[choice.r][choice.c] = solutionMask[choice.r][choice.c];




    setScore((s) => s - 50);
    setHintsUsed((h) => h + 1);
    setMarks(temp);
    triggerError();




    setFlash({ r: choice.r, c: choice.c });




    setTimeout(() => {
      setFlash(null);
      setMarks(original);
    }, 760);
  };

  // -------------------------------------------------------
  //  POWER-UPS
  // -------------------------------------------------------
  const activateFreeze = () => {
    if (score >= 100 && !isFrozen && status === 'playing') {
      setScore((s) => s - 100);
      setIsFrozen(true);
      if (navigator.vibrate) navigator.vibrate(50);
      setTimeout(() => setIsFrozen(false), 10000);
    }
  };

  const activateReveal = () => {
    if (score >= 100 && status === 'playing') {
      const incompleteRows = [];
      for (let r = 0; r < ROWS; r++) {
        if (marks[r].some((m, c) => m !== solutionMask[r][c])) incompleteRows.push(r);
      }
      
      if (incompleteRows.length > 0) {
        const r = incompleteRows[Math.floor(Math.random() * incompleteRows.length)];
        const newMarks = clone2D(marks);
        for (let c = 0; c < COLS; c++) { newMarks[r][c] = solutionMask[r][c]; }
        setMarks(newMarks);
        setScore((s) => s - 100);
        playSound("pop");
      }
    }
  };



  // -------------------------------------------------------
  //  TOGGLE CELL
  // -------------------------------------------------------
  const toggle = (r: number, c: number) => {
    if (status !== "playing") return;


    if (navigator.vibrate) navigator.vibrate(5); // Light haptic tap


    setAttempts((a) => a + 1);




    const next = clone2D(marks);
    const isMarking = !next[r][c];
    next[r][c] = !next[r][c];




    const rowSum = (ri: number) =>
      next[ri].reduce((s, m, ci) => s + (m ? cells[ri][ci] : 0), 0);
    const colSum = (ci: number) =>
      next.reduce((s, row, ri) => s + (row[ci] ? cells[ri][ci] : 0), 0);




    let impossible = false;




    for (let ri = 0; ri < ROWS; ri++) {
      if (rowSum(ri) > rowTargets[ri]) impossible = true;
      const possibleMax =
        rowSum(ri) +
        cells[ri].reduce((s, v, ci) => s + (!next[ri][ci] ? v : 0), 0);
      if (possibleMax < rowTargets[ri]) impossible = true;
    }




    for (let ci = 0; ci < COLS; ci++) {
      if (colSum(ci) > colTargets[ci]) impossible = true;
      const possibleMax =
        colSum(ci) +
        cells.reduce((s, row, ri) => s + (!next[ri][ci] ? row[ci] : 0), 0);
      if (possibleMax < colTargets[ci]) impossible = true;
    }




    if (impossible) {
      if (navigator.vibrate) navigator.vibrate(50); // Heavy haptic for error
      setFlash({ r, c });
      setPenalties((p) => p + 1);
      setScore((s) => Math.max(0, s - 3));
      triggerError();
      setTimeout(() => setFlash(null), 420);
    } else if (isMarking && !solutionMask[r][c]) {
      setScore((s) => Math.max(0, s - 3));
      setPenalties((p) => p + 1);
      if (navigator.vibrate) navigator.vibrate(50);
      triggerError();
    } else if (isMarking && solutionMask[r][c]) {
      playSound("pop");
      setCombo((c) => {
        const newCombo = c + 1;
        setScore((s) => s + 5 * newCombo);
        return newCombo;
      });
    } else {
      playSound("pop");
    }




    setMarks(next);
  };




  // -------------------------------------------------------
  //  WIN CHECK
  // -------------------------------------------------------
  React.useEffect(() => {
    if (status === 'playing' && penalties >= 3) {
      setStatus('lost');
      playSound('error');
    }
  }, [penalties, status]);

  React.useEffect(() => {
    if (status === "won") return;




    let ok = true;
    for (let r = 0; r < ROWS && ok; r++) {
      for (let c = 0; c < COLS; c++) {
        if (marks[r][c] !== solutionMask[r][c]) ok = false;
      }
    }




    if (ok) {
      const now = Date.now();
      const timeTaken = (now - startTime) / 1000;
      setFinalTime(timeTaken);


      setStatus("won");
      playSound("win");


      let earned = 100 + Math.max(0, 20 - attempts * 2 - penalties * 5);
      if (penalties === 0) earned += 50; // Perfect Clear Bonus


      let sBonus = 0;
      if (gameMode === "daily") {
        const today = new Date();
        const todayStr = `${today.getUTCFullYear()}-${today.getUTCMonth()}-${today.getUTCDate()}`;
       
        if (stats.lastDailyWin !== todayStr) {
           const yesterday = new Date();
           yesterday.setUTCDate(yesterday.getUTCDate() - 1);
           const yesterdayStr = `${yesterday.getUTCFullYear()}-${yesterday.getUTCMonth()}-${yesterday.getUTCDate()}`;
           
           let currentStreak = stats.dailyStreak || 0;
           if (stats.lastDailyWin === yesterdayStr) {
               currentStreak++;
           } else {
               currentStreak = 1;
           }
           sBonus = currentStreak * 10;
        }
      }
     
      if (gameMode === "speedrun" && speedRunCount >= 5) {
        sBonus += 100; // Bonus for finishing speed run
      }


      setEarnedStreakBonus(sBonus);
      earned += sBonus;
     
      setScore((s) => s + earned);
      updateStats(earned);
    }
  }, [marks, attempts, penalties, stats, gameMode, startTime, score, speedRunCount, speedRunStartTime]);


  // -------------------------------------------------------
  //  PERSISTENCE & KEYBOARD EFFECTS
  // -------------------------------------------------------
 
  // Save game state on every move
  React.useEffect(() => {
    if (status === 'playing') {
      const stateToSave = {
        puzzle, cells, solutionMask, rowTargets, colTargets, marks, score, penalties, attempts, hintsUsed, combo, gameMode, status, startTime, maxTime, timeLeft, finalTime, speedRunCount, speedRunStartTime, powerups
      };
      localStorage.setItem("crossing-sum-gamestate", JSON.stringify(stateToSave));
    } else if (status === 'won' || status === 'lost') {
      localStorage.removeItem("crossing-sum-gamestate");
    }
  }, [puzzle, cells, solutionMask, rowTargets, colTargets, marks, score, penalties, attempts, hintsUsed, combo, status, gameMode, startTime, maxTime, timeLeft, finalTime, speedRunCount, speedRunStartTime, powerups]);


  // Keyboard Navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (status !== 'playing') return;
     
      // Prevent scrolling with arrows/space if game is active
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'Enter'].includes(e.key)) {
        e.preventDefault();
      }


      if (!focusedCell) {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
          setFocusedCell({ r: 0, c: 0 });
        }
        return;
      }


      const { r, c } = focusedCell;
      if (e.key === 'ArrowUp') setFocusedCell({ r: Math.max(0, r - 1), c });
      if (e.key === 'ArrowDown') setFocusedCell({ r: Math.min(ROWS - 1, r + 1), c });
      if (e.key === 'ArrowLeft') setFocusedCell({ r, c: Math.max(0, c - 1) });
      if (e.key === 'ArrowRight') setFocusedCell({ r, c: Math.min(COLS - 1, c + 1) });
      if (e.key === ' ' || e.key === 'Enter') toggle(r, c);
    };


    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedCell, status, ROWS, COLS, marks]); // Dependencies ensure toggle uses fresh state


  // -------------------------------------------------------
  //  UI
  // -------------------------------------------------------
  const isDense = COLS > 6;
  const LABEL = isDense ? 28 : (COLS < 5 ? 32 : 40);


  const formatTime = (seconds: number) => {
    if (!seconds) return "--:--";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };


  const shareResult = () => {
    const timeStr = formatTime(finalTime);
    let displayTitle = `Level ${stats.gamesWon}`;
    if (gameMode === "daily") displayTitle = "Daily Challenge";
    if (gameMode === "speedrun") displayTitle = "Speed Run 5/5";
   
    const text = `Scrolly Sum Grid 🧮\n${displayTitle}\nScore: ${score}\nTime: ${timeStr}\nMistakes: ${penalties}\n\nPlay now!`;
   
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };


  if (!mounted) return <div className="w-full h-full bg-slate-900" />;

  return (
    <div className={`w-full h-full flex flex-col font-sans relative transition-colors duration-300 animate-gradient-xy ${darkMode ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-200" : "bg-gradient-to-br from-[#fdfbf7] via-white to-[#f0f9ff] text-slate-800"}`}>
      {/* SPLASH SCREEN */}
      {showSplash && (
        <div className={`absolute inset-0 z-[100] flex flex-col items-center justify-center transition-colors duration-500 ${darkMode ? "bg-slate-950" : "bg-[#fdfbf7]"}`}>
          {/* Beautiful Grid Background */}
          <div 
            className="absolute inset-0 opacity-[0.08] pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(to right, ${darkMode ? '#94a3b8' : '#64748b'} 1px, transparent 1px), linear-gradient(to bottom, ${darkMode ? '#94a3b8' : '#64748b'} 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
              maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)'
            }}
          />
          
          {/* Floating Elements for Cuteness */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
             <div className="absolute top-1/4 left-1/4 text-4xl animate-bounce delay-100 opacity-50">✨</div>
             <div className="absolute bottom-1/3 right-1/4 text-3xl animate-bounce delay-700 opacity-50">🌸</div>
             <div className="absolute top-1/3 right-10 text-2xl animate-pulse delay-300 opacity-50">⭐</div>
          </div>

          <div className="relative z-10 flex flex-col items-center text-center p-6 animate-in zoom-in-95 duration-500">
            <div className="mb-6 relative">
              <div className="text-8xl animate-[bounce_2s_infinite]">🎲</div>
              <div className="absolute -bottom-2 -right-2 text-4xl animate-[bounce_2.5s_infinite]">✨</div>
            </div>
            <h1 className={`text-5xl font-black tracking-tight mb-2 ${darkMode ? "text-white" : "text-slate-800"}`}>
              Grid<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Sum</span>
            </h1>
            <p className={`text-sm font-bold uppercase tracking-widest mb-10 ${darkMode ? "text-slate-500" : "text-slate-400"}`}>Connect & Solve</p>
            
            {/* Level Selector */}
            <div className="flex items-center gap-4 mb-8 bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/20 shadow-lg">
              <button 
                onClick={() => setSplashLevel(l => Math.max(1, l - 1))}
                className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold text-xl transition-colors active:scale-90 ${darkMode ? "bg-slate-800 text-white hover:bg-slate-700" : "bg-white text-slate-800 hover:bg-stone-100"}`}
              >
                -
              </button>
              <div className="flex flex-col items-center w-24">
                <span className={`text-[10px] font-bold uppercase tracking-wider ${darkMode ? "text-slate-400" : "text-slate-600"}`}>Start Level</span>
                <span className={`text-2xl font-black ${darkMode ? "text-white" : "text-slate-800"}`}>{splashLevel}</span>
              </div>
              <button 
                onClick={() => setSplashLevel(l => l + 1)}
                className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold text-xl transition-colors active:scale-90 ${darkMode ? "bg-slate-800 text-white hover:bg-slate-700" : "bg-white text-slate-800 hover:bg-stone-100"}`}
              >
                +
              </button>
            </div>

            <button onClick={() => { 
              setStats((s: any) => {
                const next = { ...s, gamesWon: splashLevel - 1 };
                localStorage.setItem("crossing-sum-stats", JSON.stringify(next));
                return next;
              });
              loadNewPuzzle("normal", splashLevel - 1);
              setShowSplash(false); 
              playSound("pop"); 
            }} className="group relative px-10 py-4 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full text-white text-xl font-black shadow-[0_10px_20px_-10px_rgba(245,158,11,0.5)] hover:shadow-[0_20px_30px_-10px_rgba(245,158,11,0.6)] hover:scale-110 transition-all duration-300 active:scale-95">
              <span className="relative z-10 flex items-center gap-2">PLAY NOW 🚀</span>
            </button>
          </div>
        </div>
      )}

      {status === "won" && (
        <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
          {confettiParticles.map((p) => (
            <div
              key={p.id}
              className="absolute top-[-20px]"
              style={{
                left: `${p.left}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                backgroundColor: p.color,
                animation: `confetti-fall ${p.duration}s linear infinite`,
                animationDelay: `${p.delay}s`,
                borderRadius: p.shape,
              }}
            />
          ))}
          <style>{`
            @keyframes shake {
              10%, 90% { transform: translate3d(-1px, 0, 0); }
              20%, 80% { transform: translate3d(2px, 0, 0); }
              30%, 50%, 70% { transform: translate3d(-3px, 0, 0); }
              40%, 60% { transform: translate3d(3px, 0, 0); }
            }
            .animate-shake {
              animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
            }
            @keyframes confetti-fall {
              0% { transform: translateY(0) rotate(0deg); opacity: 1; }
              100% { transform: translateY(800px) rotate(720deg); opacity: 0; }
            }
            @keyframes gradient-xy {
              0%, 100% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
            }
            .animate-gradient-xy { background-size: 200% 200%; animation: gradient-xy 15s ease infinite; }
          `}</style>
        </div>
      )}


      {/* LOST OVERLAY */}
      {status === "lost" && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-stone-900/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="text-6xl mb-4">{penalties >= 3 ? "💔" : "⏰"}</div>
          <h2 className="text-3xl font-black text-white mb-2 tracking-tight">{penalties >= 3 ? "GAME OVER" : "TIME'S UP!"}</h2>
          <p className="text-stone-300 mb-8 font-medium">{penalties >= 3 ? "Too many mistakes." : "You ran out of time."}</p>
          <button onClick={restart} className="px-8 py-3 bg-white text-stone-900 rounded-xl font-black text-lg hover:scale-105 transition-transform">
            TRY AGAIN
          </button>
        </div>
      )}




      {/* SETTINGS OVERLAY */}
      {showSettings && (
        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-stone-900/40 backdrop-blur-sm p-6 animate-in fade-in duration-200">
          <div className={`w-full max-w-xs rounded-2xl shadow-2xl p-6 border ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-stone-100"}`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-black tracking-tight ${darkMode ? "text-white" : "text-stone-800"}`}>SETTINGS</h2>
              <button onClick={() => setShowSettings(false)} className={`${darkMode ? "text-slate-500 hover:text-slate-300" : "text-stone-400 hover:text-stone-600"}`}>
                ✕
              </button>
            </div>




            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className={`font-bold text-sm ${darkMode ? "text-slate-400" : "text-stone-600"}`}>Music</span>
                <button
                  onClick={() => setMusicEnabled(!musicEnabled)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${musicEnabled ? (darkMode ? 'bg-slate-200 text-slate-900' : 'bg-stone-800 text-white') : (darkMode ? 'bg-slate-800 text-slate-500' : 'bg-stone-100 text-stone-500')}`}
                >
                  {musicEnabled ? "On" : "Off"}
                </button>
              </div>
              {musicEnabled && (
                <div className="flex items-center justify-between">
                  <span className={`font-bold text-sm ${darkMode ? "text-slate-400" : "text-stone-600"}`}>Volume</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={musicVolume}
                    onChange={(e) => setMusicVolume(parseFloat(e.target.value))}
                    className="w-24 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-emerald-500"
                  />
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className={`font-bold text-sm ${darkMode ? "text-slate-400" : "text-stone-600"}`}>Sound Effects</span>
                <button
                  onClick={() => setMuted(!muted)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${muted ? (darkMode ? 'bg-slate-800 text-slate-500' : 'bg-stone-100 text-stone-500') : 'bg-emerald-100 text-emerald-700'}`}
                >
                  {muted ? "Muted" : "On"}
                </button>
              </div>




              <div className="flex items-center justify-between">
                <span className={`font-bold text-sm ${darkMode ? "text-slate-400" : "text-stone-600"}`}>Hard Mode</span>
                <button
                  onClick={() => setHardMode(!hardMode)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${hardMode ? (darkMode ? 'bg-slate-200 text-slate-900' : 'bg-stone-800 text-white') : (darkMode ? 'bg-slate-800 text-slate-500' : 'bg-stone-100 text-stone-500')}`}
                >
                  {hardMode ? "On" : "Off"}
                </button>
              </div>




              <div className="flex items-center justify-between">
                <span className={`font-bold text-sm ${darkMode ? "text-slate-400" : "text-stone-600"}`}>Colorblind Mode</span>
                <button
                  onClick={() => setColorblindMode(!colorblindMode)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${colorblindMode ? (darkMode ? 'bg-slate-200 text-slate-900' : 'bg-stone-800 text-white') : (darkMode ? 'bg-slate-800 text-slate-500' : 'bg-stone-100 text-stone-500')}`}
                >
                  {colorblindMode ? "On" : "Off"}
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className={`font-bold text-sm ${darkMode ? "text-slate-400" : "text-stone-600"}`}>Zen Mode</span>
                <button
                  onClick={() => setZenMode(!zenMode)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${zenMode ? (darkMode ? 'bg-slate-200 text-slate-900' : 'bg-stone-800 text-white') : (darkMode ? 'bg-slate-800 text-slate-500' : 'bg-stone-100 text-stone-500')}`}
                >
                  {zenMode ? "On" : "Off"}
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className={`font-bold text-sm ${darkMode ? "text-slate-400" : "text-stone-600"}`}>Dark Mode</span>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${darkMode ? 'bg-slate-200 text-slate-900' : 'bg-stone-100 text-stone-500'}`}
                >
                  {darkMode ? "On" : "Off"}
                </button>
              </div>




              <div className={`pt-4 mt-4 border-t ${darkMode ? "border-slate-800" : "border-stone-100"}`}>
                <button
                  onClick={() => { setShowSettings(false); setShowTutorial(true); }}
                  className={`w-full py-3 mb-3 rounded-xl font-bold text-xs transition-colors ${darkMode ? "bg-slate-800 text-slate-300 hover:bg-slate-700" : "bg-stone-100 text-stone-600 hover:bg-stone-200"}`}
                >
                  How to Play
                </button>
                <button
                  onClick={resetProgress}
                  className="w-full py-3 rounded-xl font-bold text-xs transition-colors bg-red-500/10 text-red-500 hover:bg-red-500/20"
                >
                  Reset Progress
                </button>
              </div>
            </div>




            <button
              onClick={() => setShowSettings(false)}
              className={`w-full mt-8 py-3 rounded-xl font-bold text-sm transition-colors ${darkMode ? "bg-slate-800 text-white hover:bg-slate-700" : "bg-stone-800 text-white hover:bg-stone-900"}`}
            >
              Close
            </button>
          </div>
        </div>
      )}


      {/* STATS OVERLAY */}
      {showStats && (
        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-stone-900/40 backdrop-blur-sm p-6 animate-in fade-in duration-200">
          <div className={`w-full max-w-xs rounded-2xl shadow-2xl p-6 border ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-stone-100"}`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-black tracking-tight ${darkMode ? "text-white" : "text-stone-800"}`}>STATISTICS</h2>
              <button onClick={() => setShowStats(false)} className={`${darkMode ? "text-slate-500 hover:text-slate-300" : "text-stone-400 hover:text-stone-600"}`}>
                ✕
              </button>
            </div>


            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center">
                <div className={`text-3xl font-black ${darkMode ? "text-white" : "text-stone-800"}`}>{stats.gamesPlayed}</div>
                <div className={`text-[10px] font-bold uppercase tracking-wider ${darkMode ? "text-slate-500" : "text-stone-400"}`}>Played</div>
              </div>
              <div className="text-center">
                <div className={`text-3xl font-black ${darkMode ? "text-white" : "text-stone-800"}`}>
                  {stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0}%
                </div>
                <div className={`text-[10px] font-bold uppercase tracking-wider ${darkMode ? "text-slate-500" : "text-stone-400"}`}>Win Rate</div>
              </div>
              <div className="text-center">
                <div className={`text-3xl font-black ${darkMode ? "text-white" : "text-stone-800"}`}>{stats.currentStreak}</div>
                <div className={`text-[10px] font-bold uppercase tracking-wider ${darkMode ? "text-slate-500" : "text-stone-400"}`}>Current Streak</div>
              </div>
              <div className="text-center">
                <div className={`text-3xl font-black ${darkMode ? "text-white" : "text-stone-800"}`}>{stats.bestStreak}</div>
                <div className={`text-[10px] font-bold uppercase tracking-wider ${darkMode ? "text-slate-500" : "text-stone-400"}`}>Max Streak</div>
              </div>
              <div className="text-center col-span-2 border-t pt-4 mt-2 border-dashed border-stone-200 dark:border-slate-800">
                <div className={`text-3xl font-black ${darkMode ? "text-orange-400" : "text-orange-500"}`}>{stats.dailyStreak || 0} 🔥</div>
                <div className={`text-[10px] font-bold uppercase tracking-wider ${darkMode ? "text-slate-500" : "text-stone-400"}`}>Daily Challenge Streak</div>
              </div>
            </div>


            <div className={`space-y-3 pt-4 border-t ${darkMode ? "border-slate-800" : "border-stone-100"}`}>
               <div className="flex justify-between items-center">
                 <span className={`text-sm font-bold ${darkMode ? "text-slate-400" : "text-stone-500"}`}>Average Time</span>
                 <span className={`text-lg font-black ${darkMode ? "text-white" : "text-stone-800"}`}>{formatTime(stats.gamesWon > 0 ? stats.totalTime / stats.gamesWon : 0)}</span>
               </div>
               <div className="flex justify-between items-center">
                 <span className={`text-sm font-bold ${darkMode ? "text-slate-400" : "text-stone-500"}`}>Best Time</span>
                 <span className={`text-lg font-black ${darkMode ? "text-white" : "text-stone-800"}`}>{formatTime(stats.fastestWin)}</span>
               </div>
               <div className="flex justify-between items-center">
                 <span className={`text-sm font-bold ${darkMode ? "text-slate-400" : "text-stone-500"}`}>Best Speed Run</span>
                 <span className={`text-lg font-black ${darkMode ? "text-white" : "text-stone-800"}`}>{formatTime(stats.bestSpeedRun)}</span>
               </div>
            </div>


            <button onClick={() => setShowStats(false)} className={`w-full mt-6 py-3 rounded-xl font-bold text-sm transition-colors ${darkMode ? "bg-slate-800 text-white hover:bg-slate-700" : "bg-stone-800 text-white hover:bg-stone-900"}`}>
              Close
            </button>
          </div>
        </div>
      )}


      {/* TUTORIAL OVERLAY */}
      {showTutorial && (
        <div className="absolute inset-0 z-[70] flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-6 animate-in fade-in duration-300">
          <div className={`w-full max-w-xs rounded-2xl shadow-2xl p-6 border ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-stone-100"}`}>
            <div className="text-center mb-6">
              <div className="text-4xl mb-2">🎓</div>
              <h2 className={`text-2xl font-black tracking-tight ${darkMode ? "text-white" : "text-stone-800"}`}>HOW TO PLAY</h2>
            </div>


            <div className={`space-y-4 text-sm ${darkMode ? "text-slate-300" : "text-stone-600"}`}>
              <p>
                <strong className={darkMode ? "text-white" : "text-stone-900"}>1. Goal:</strong> Match the sums!
              </p>
              <p>
                Select numbers in the grid so that they add up to the <strong className={darkMode ? "text-white" : "text-stone-900"}>Target Numbers</strong> at the end of each row and column.
              </p>
              <div className={`p-3 rounded-xl border ${darkMode ? "bg-slate-800 border-slate-700" : "bg-stone-50 border-stone-200"}`}>
                <div className="flex justify-center items-center gap-2 font-bold">
                  <span className="w-8 h-8 flex items-center justify-center rounded bg-amber-400 text-white shadow-sm">5</span>
                  <span>+</span>
                  <span className="w-8 h-8 flex items-center justify-center rounded bg-amber-400 text-white shadow-sm">3</span>
                  <span>=</span>
                  <span className={darkMode ? "text-white" : "text-stone-900"}>8</span>
                </div>
              </div>
              <p>
                <strong className={darkMode ? "text-white" : "text-stone-900"}>2. Watch out:</strong> If a sum goes over the target, you lose points!
              </p>
            </div>


            <button
              onClick={closeTutorial}
              className={`w-full mt-8 py-3 rounded-xl font-black text-sm tracking-wide uppercase shadow-lg transition-transform active:scale-95 ${darkMode ? "bg-emerald-500 text-white hover:bg-emerald-600" : "bg-stone-800 text-white hover:bg-stone-900"}`}
            >
              Let's Play!
            </button>
          </div>
        </div>
      )}


      {/* HEADER */}
      <div className={`flex-none flex items-center justify-between px-5 py-4 border-b backdrop-blur-sm z-10 transition-colors duration-300 ${darkMode ? "border-slate-800/60 bg-slate-900/50" : "border-stone-200/60 bg-white/50"}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20 text-white font-black text-lg">
            #
          </div>
          <div className="relative">
            <div
              className="cursor-pointer active:opacity-70 transition-opacity"
              onClick={() => setShowModeSelector(!showModeSelector)}
            >
              <div className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1 ${darkMode ? "text-slate-400" : "text-stone-500"}`}>
                {gameMode === "daily" ? (
                  <span className="flex items-center gap-1">
                    Daily Challenge {(stats.dailyStreak || 0) > 0 && <span className="text-orange-500">🔥 {stats.dailyStreak}</span>}
                  </span>
                ) : (gameMode === "speedrun" ? `Speed Run ${speedRunCount}/5` : (
                  <span className="flex items-center gap-2">
                    Level {stats.gamesWon + 1}
                    {stats.gamesWon >= 4 && <span className="px-1.5 py-0.5 rounded bg-red-500 text-white text-[9px] animate-pulse shadow-sm shadow-red-500/50">SUPER HARD</span>}
                  </span>
                ))}
                <span className="text-[10px] opacity-50">▼</span>
              </div>
              <div className={`text-base font-black tracking-tight ${darkMode ? "text-slate-200" : "text-stone-800"}`}>
                {gameMode === "daily" ? "6x6 GRID" : (gameMode === "speedrun" ? "TIME ATTACK" : "SUM GRID")}
              </div>
            </div>

            {showModeSelector && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowModeSelector(false)} />
                <div className={`absolute top-full left-0 mt-2 w-48 rounded-xl shadow-xl border z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 ${darkMode ? "bg-slate-900 border-slate-700" : "bg-white border-stone-200"}`}>
                  {[
                    { id: "normal", label: "Normal Mode", sub: "Sum Grid" },
                    { id: "daily", label: "Daily Challenge", sub: "6x6 Grid" },
                    { id: "speedrun", label: "Speed Run", sub: "Time Attack" }
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => {
                        setGameMode(m.id as any);
                        loadNewPuzzle(m.id as any);
                        setShowModeSelector(false);
                      }}
                      className={`w-full text-left px-4 py-3 transition-colors flex flex-col ${
                        gameMode === m.id 
                          ? (darkMode ? "bg-slate-800" : "bg-stone-100") 
                          : (darkMode ? "hover:bg-slate-800" : "hover:bg-stone-50")
                      }`}
                    >
                      <span className={`text-sm font-bold ${gameMode === m.id ? "text-amber-500" : (darkMode ? "text-slate-200" : "text-stone-700")}`}>
                        {m.label}
                      </span>
                      <span className={`text-[10px] font-medium uppercase tracking-wider ${darkMode ? "text-slate-500" : "text-stone-400"}`}>
                        {m.sub}
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>




        <div className="text-right">
          {!zenMode && (
            <>
              <div className={`text-[10px] font-bold uppercase tracking-wider ${darkMode ? "text-slate-400" : "text-stone-500"}`}>
                Score
              </div>
              <div className={`text-2xl font-black leading-none ${darkMode ? "text-orange-400" : "text-orange-500"}`}>
                {score}
              </div>
              {combo > 1 && (
                <div className="text-xs font-bold text-orange-400 animate-pulse leading-none mt-1">
                  🔥 {combo}x COMBO
                </div>
              )}
            </>
          )}
        </div>
      </div>


      {/* TIMER BAR */}
      {!zenMode && gameMode !== "speedrun" && (
        <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 relative overflow-hidden">
          <div
            className={`absolute top-0 left-0 h-full transition-all duration-1000 ease-linear ${isFrozen ? 'bg-blue-400 animate-pulse' : (timeLeft < 10 ? 'bg-red-500' : (darkMode ? 'bg-slate-500' : 'bg-stone-400'))}`}
            style={{ width: `${(timeLeft / maxTime) * 100}%` }}
          />
        </div>
      )}

      {/* POWER-UPS BAR */}
      {!zenMode && status === 'playing' && (
        <div className="flex justify-center gap-4 py-2">
          <button onClick={activateFreeze} disabled={score < 100 || isFrozen} className={`flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold transition-all active:scale-95 ${score >= 100 ? (isFrozen ? "bg-blue-500 text-white ring-2 ring-blue-300" : "bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/60 dark:text-blue-100") : "bg-stone-200 text-stone-400 dark:bg-slate-800 dark:text-slate-600"}`}>
            <span>❄️</span>
            <span>Freeze</span>
            <span className="bg-black/10 dark:bg-white/10 px-1.5 rounded-md">-100</span>
          </button>
          <button onClick={activateReveal} disabled={score < 100} className={`flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold transition-all active:scale-95 ${score >= 100 ? "bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900/60 dark:text-purple-100" : "bg-stone-200 text-stone-400 dark:bg-slate-800 dark:text-slate-600"}`}>
            <span>👁️</span>
            <span>Reveal</span>
            <span className="bg-black/10 dark:bg-white/10 px-1.5 rounded-md">-100</span>
          </button>
        </div>
      )}



      {/* BOARD AREA */}
      <div className="flex-1 flex flex-col items-center justify-center p-2 min-h-0">
        <div className={`w-full ${COLS < 4 ? "max-w-[180px]" : (COLS === 4 ? "max-w-[220px]" : "max-w-[260px]")} ${isShaking ? 'animate-shake' : ''}`}>
          <div
            className={`grid ${isDense ? "gap-1" : "gap-2"}`}
            style={{
              gridTemplateColumns: `${LABEL}px repeat(${COLS}, minmax(0, 1fr))`,
              alignItems: "center",
            }}
          >
            {/* Top-Left Corner (Empty) */}
            <div className={isDense ? "h-6" : "h-8"} />




            {/* COLUMN TARGETS */}
            {colTargets.map((t, ci) => {
              const currentColSum = marks.reduce((acc, row, ri) => acc + (row[ci] ? cells[ri][ci] : 0), 0);
              const isComplete = currentColSum === t;
              return (
                <div key={ci} className={`flex items-center justify-center ${isDense ? "h-6" : "h-8"} group ${hardMode ? "cursor-help" : ""}`}>
                  <span className={`${isDense ? "text-xs" : "text-sm"} font-black transition-all duration-300 
                    ${isComplete ? "text-emerald-500 scale-110" : (darkMode ? "text-slate-400" : "text-stone-600")}
                    ${hardMode && !isComplete ? "opacity-0 group-hover:opacity-100" : ""}
                  `}>
                    {t}
                  </span>
                </div>
              );
            })}




            {/* ROWS + CELLS */}
            {Array.from({ length: ROWS }).map((_, ri) => (
              <React.Fragment key={ri}>
                {/* ROW TARGET */}
                {(() => {
                  const currentRowSum = marks[ri].reduce((acc, m, ci) => acc + (m ? cells[ri][ci] : 0), 0);
                  const isComplete = currentRowSum === rowTargets[ri];
                  return (
                    <div className={`flex items-center justify-center group ${hardMode ? "cursor-help" : ""}`}>
                      <span className={`${isDense ? "text-xs" : "text-sm"} font-black transition-all duration-300
                        ${isComplete ? "text-emerald-500 scale-110" : (darkMode ? "text-slate-400" : "text-stone-600")}
                        ${hardMode && !isComplete ? "opacity-0 group-hover:opacity-100" : ""}
                      `}>
                        {rowTargets[ri]}
                      </span>
                    </div>
                  );
                })()}




                {Array.from({ length: COLS }).map((__, ci) => {
                  const marked = marks[ri]?.[ci];
                  const isSolution = solutionMask[ri]?.[ci];
                  const isFlashing = flash && flash.r === ri && flash.c === ci;
                  const isFocused = focusedCell?.r === ri && focusedCell?.c === ci;
                  const isCorrectAndWon = status === "won" && isSolution;
                  const cellValue = cells[ri]?.[ci];
                  if (cellValue === undefined) return null;




                  return (
                    <button
                      key={`${ri}-${ci}`}
                      onClick={() => {
                        setFocusedCell({ r: ri, c: ci });
                        toggle(ri, ci);
                      }}
                      className={`
                        relative w-full aspect-square rounded-xl transition-all duration-200
                        flex items-center justify-center group shadow-sm border-b-4 active:border-b-0 active:translate-y-1
                        backdrop-blur-sm
                        ${
                          marked
                            ? isCorrectAndWon
                              ? (colorblindMode ? "bg-blue-500 border-blue-700 shadow-blue-300" : "bg-emerald-400 border-emerald-600 shadow-emerald-200") // Keep vibrant for win
                              : (colorblindMode ? "bg-orange-400 border-orange-600 shadow-orange-200" : "bg-amber-400 border-amber-600 shadow-amber-200") // Keep vibrant for mark
                            : darkMode
                              ? "bg-slate-900/80 border-slate-800 hover:border-slate-700"
                              : "bg-white/80 border-stone-200 hover:border-stone-300"
                        }
                        ${isFocused ? "ring-2 ring-offset-2 ring-blue-500 z-10" : ""}
                      `}
                    >
                      <span
                        className={`
                        ${isDense ? "text-xs" : (COLS <= 5 ? "text-lg" : "text-xl")} font-black transition-colors duration-200
                        ${marked ? "text-white" : (darkMode ? "text-slate-200" : "text-stone-900")}
                      `}
                      >
                        {cellValue}
                      </span>




                      {/* X mark for wrong selection */}
                      <div
                        className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-200 ${
                          marked && !isSolution ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        <span className={`${colorblindMode ? "text-slate-900/50" : "text-red-500/50"} ${isDense ? "text-lg" : "text-3xl"} font-black`}>
                          ×
                        </span>
                      </div>




                      {/* Flash effect */}
                      {isFlashing && (
                        <div className="absolute inset-0 rounded-xl bg-red-500/20 animate-pulse pointer-events-none" />
                      )}
                    </button>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>




      {/* FOOTER */}
      <div className="flex-none p-5 pt-0 bg-transparent">
        <div className={`rounded-2xl p-4 shadow-sm border transition-colors duration-300 ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-stone-100"}`}>
          <div className="flex flex-col gap-4 mb-4">
            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-3">
              <div className={`rounded-lg p-2 text-center border ${darkMode ? "bg-slate-950 border-slate-800" : "bg-stone-50 border-stone-200/80"}`}>
                <div className={`text-[9px] font-bold uppercase tracking-wider ${darkMode ? "text-slate-400" : "text-stone-500"}`}>
                  Best
                </div>
                <div className={`text-lg font-black leading-tight ${darkMode ? "text-slate-200" : "text-stone-700"}`}>
                  {highScore}
                </div>
              </div>
              <div className={`rounded-lg p-2 text-center border ${darkMode ? "bg-slate-950 border-slate-800" : "bg-stone-50 border-stone-200/80"}`}>
                <div className={`text-[9px] font-bold uppercase tracking-wider ${darkMode ? "text-slate-400" : "text-stone-500"}`}>
                  Mistakes
                </div>
                <div className="text-lg font-black text-red-500 leading-tight">{penalties}/3</div>
              </div>
            </div>




            {/* Controls Row - Hide when lost to focus on retry */}
            <div className="flex items-center justify-between gap-2">
              <div className="relative">
                <button
                  onClick={() => setShowFooterModeSelector(!showFooterModeSelector)}
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 ${darkMode ? "bg-slate-800 hover:bg-slate-700 text-slate-400" : "bg-stone-100 hover:bg-stone-200 text-stone-600"}`}
                >
                  {gameMode === "normal" ? "Normal" : (gameMode === "daily" ? "Daily" : "Speed Run")}
                  <span className="opacity-50 text-[10px]">▲</span>
                </button>
                {showFooterModeSelector && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowFooterModeSelector(false)} />
                    <div className={`absolute bottom-full left-0 mb-2 w-40 rounded-xl shadow-xl border z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 ${darkMode ? "bg-slate-900 border-slate-700" : "bg-white border-stone-200"}`}>
                      {[
                        { id: "normal", label: "Normal Mode" },
                        { id: "daily", label: "Daily Challenge" },
                        { id: "speedrun", label: "Speed Run" }
                      ].map((m) => (
                        <button
                          key={m.id}
                          onClick={() => {
                            setGameMode(m.id as any);
                            loadNewPuzzle(m.id as any);
                            setShowFooterModeSelector(false);
                          }}
                          className={`w-full text-left px-4 py-3 transition-colors ${
                            gameMode === m.id 
                              ? (darkMode ? "bg-slate-800 text-amber-500" : "bg-stone-100 text-amber-600") 
                              : (darkMode ? "text-slate-300 hover:bg-slate-800" : "text-stone-600 hover:bg-stone-50")
                          }`}
                        >
                          <span className="text-xs font-bold">{m.label}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowSettings(true)}
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors ${darkMode ? "bg-slate-800 hover:bg-slate-700 text-slate-400" : "bg-stone-100 hover:bg-stone-200 text-stone-600"}`}
                >
                  ⚙️
                </button>
                <button
                  onClick={() => setShowStats(true)}
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors ${darkMode ? "bg-slate-800 hover:bg-slate-700 text-slate-400" : "bg-stone-100 hover:bg-stone-200 text-stone-600"}`}
                >
                  📊
                </button>
              {status === "won" ? (
                <button
                  onClick={shareResult}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${darkMode ? "bg-indigo-500 hover:bg-indigo-600 text-white" : "bg-indigo-500 hover:bg-indigo-600 text-white"}`}
                >
                  {copied ? "Copied!" : "Share 📤"}
                </button>
              ) : (
                <button
                  onClick={giveHint}
                  disabled={score < 50 || status !== "playing" || hardMode}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors disabled:opacity-50 ${darkMode ? "bg-slate-800 hover:bg-slate-700 text-slate-400" : "bg-stone-100 hover:bg-stone-200 text-stone-600"}`}
                >
                  {hardMode ? "No Hints" : `Hint (-50)`}
                </button>
              )}
              </div>
            </div>
          </div>




          <button
            onClick={() => (status === "won" ? loadNewPuzzle() : (status === "lost" ? restart() : restart()))}
            className={`
              w-full py-3.5 rounded-xl font-black text-sm tracking-widest uppercase shadow-lg transition-all transform active:scale-[0.98]
              ${
                status === "won"
                  ? (colorblindMode ? "bg-blue-500 text-white shadow-blue-500/30 hover:bg-blue-600" : "bg-emerald-500 text-white shadow-emerald-500/30 hover:bg-emerald-600")
                  : (status === "lost" ? "bg-stone-500 text-white" : (darkMode ? "bg-slate-200 text-slate-900 shadow-slate-900/20 hover:bg-white" : "bg-stone-800 text-white shadow-stone-800/20 hover:bg-stone-900"))
              }
            `}
          >
            {status === "won" ? (gameMode === "speedrun" && speedRunCount >= 5 ? "New Run" : "Next Level") : (status === "lost" ? "Try Again" : "Restart")}
          </button>
          </div>
        </div>


      {/* BACKGROUND MUSIC */}
      <audio
        ref={audioRef}
        loop
        src="/bg-sound.mp3"
      />
    </div>
  );
};
