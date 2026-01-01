
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Gamepad2, Play, Trophy, RotateCcw, Zap, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Pizza, Flame, Beer, Star, Target, Disc } from 'lucide-react';

interface Props {
  onClose: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

interface FloatingText {
  id: number;
  x: number;
  y: number;
  text: string;
  life: number;
  size: number;
}

type FoodType = 'NORMAL' | 'CHILI' | 'DRINK' | 'GOLDEN';

interface FoodItem {
  x: number;
  y: number;
  type: FoodType;
}

const GameModal: React.FC<Props> = ({ onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('kd_snake_highscore');
    return saved ? parseInt(saved) : 0;
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number>(null);
  const lastTimeRef = useRef<number>(0);
  const [speed, setSpeed] = useState(130);
  const [isCaliente, setIsCaliente] = useState(false);
  const [shake, setShake] = useState(0);

  const gridSize = 20;
  const initialSnake = [{ x: 10, y: 10 }, { x: 10, y: 11 }, { x: 10, y: 12 }];
  const snakeRef = useRef(initialSnake);
  const foodRef = useRef<FoodItem>({ x: 5, y: 5, type: 'NORMAL' });
  const directionRef = useRef({ x: 0, y: -1 });

  const inputQueueRef = useRef<{ x: number, y: number }[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const floatingTextsRef = useRef<FloatingText[]>([]);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playSound = (type: 'eat' | 'powerup' | 'death') => {
    try {
      if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'eat') {
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.1);
        osc.start(); osc.stop(ctx.currentTime + 0.1);
      } else if (type === 'powerup') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(330, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(990, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
        osc.start(); osc.stop(ctx.currentTime + 0.3);
      } else {
        osc.frequency.setValueAtTime(120, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(20, ctx.currentTime + 0.6);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);
        osc.start(); osc.stop(ctx.currentTime + 0.6);
      }
    } catch (e) {
      console.warn("Audio Context error:", e);
    }
  };

  const createParticles = (x: number, y: number, color: string, count = 12) => {
    for (let i = 0; i < count; i++) {
      particlesRef.current.push({
        id: Math.random(),
        x: x * gridSize + gridSize / 2,
        y: y * gridSize + gridSize / 2,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        life: 1.0,
        color
      });
    }
  };

  const addFloatingText = (x: number, y: number, text: string, size = 16) => {
    floatingTextsRef.current.push({
      id: Math.random(),
      x: x * gridSize + gridSize / 2,
      y: y * gridSize,
      text,
      life: 1.0,
      size
    });
  };

  const spawnFood = useCallback((currentSnake: { x: number, y: number }[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 5, y: 5, type: 'NORMAL' as FoodType };
    const count = canvas.width / gridSize;
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * count),
        y: Math.floor(Math.random() * count)
      };
      if (!currentSnake.some(p => p.x === newFood.x && p.y === newFood.y)) break;
    }

    const rand = Math.random();
    let type: FoodType = 'NORMAL';
    if (rand > 0.96) type = 'GOLDEN';
    else if (rand > 0.88) type = 'CHILI';
    else if (rand > 0.80) type = 'DRINK';

    return { ...newFood, type };
  }, []);

  const startGame = () => {
    snakeRef.current = [...initialSnake];
    directionRef.current = { x: 0, y: -1 };
    inputQueueRef.current = [];
    foodRef.current = spawnFood(initialSnake);
    setScore(0);
    setSpeed(130);
    setIsCaliente(false);
    setIsGameOver(false);
    setIsPlaying(true);
    particlesRef.current = [];
    floatingTextsRef.current = [];
  };

  const handleGameOver = useCallback(() => {
    setShake(30);
    playSound('death');
    setIsPlaying(false);
    setIsGameOver(true);
    setIsCaliente(false);
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('kd_snake_highscore', score.toString());
    }
  }, [score, highScore]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying) return;
      let nextDir = null;
      switch (e.key) {
        case 'ArrowUp': nextDir = { x: 0, y: -1 }; break;
        case 'ArrowDown': nextDir = { x: 0, y: 1 }; break;
        case 'ArrowLeft': nextDir = { x: -1, y: 0 }; break;
        case 'ArrowRight': nextDir = { x: 1, y: 0 }; break;
      }

      if (nextDir) {
        const lastInQueue = inputQueueRef.current[inputQueueRef.current.length - 1] || directionRef.current;
        if (nextDir.x !== -lastInQueue.x || nextDir.y !== -lastInQueue.y) {
          if (inputQueueRef.current.length < 3) {
            inputQueueRef.current.push(nextDir);
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const count = canvas.width / gridSize;

    const update = () => {
      if (inputQueueRef.current.length > 0) {
        directionRef.current = inputQueueRef.current.shift()!;
      }

      const head = {
        x: snakeRef.current[0].x + directionRef.current.x,
        y: snakeRef.current[0].y + directionRef.current.y
      };

      if (head.x < 0 || head.x >= count || head.y < 0 || head.y >= count ||
        snakeRef.current.some(p => p.x === head.x && p.y === head.y)) {
        handleGameOver();
        return;
      }

      const newSnake = [head, ...snakeRef.current];

      if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
        const foodType = foodRef.current.type;
        let points = 10;
        let color = '#ff006e';

        if (foodType === 'GOLDEN') {
          points = 150;
          color = '#ffbe0b';
          playSound('powerup');
          setShake(20);
          addFloatingText(head.x, head.y, "MAX PREMIUM! +150", 24);
        } else if (foodType === 'CHILI') {
          points = 30;
          color = '#fb5607';
          setIsCaliente(true);
          setSpeed(prev => Math.max(60, prev - 30));
          playSound('powerup');
          addFloatingText(head.x, head.y, "CALIENTE! X2 🌶️", 18);
          setTimeout(() => {
            setIsCaliente(false);
            setSpeed(prev => Math.min(130, prev + 20));
          }, 8000);
        } else if (foodType === 'DRINK') {
          points = 5;
          color = '#3a86ff';
          setSpeed(prev => Math.min(180, prev + 30));
          addFloatingText(head.x, head.y, "FRESH... 🥤", 18);
          playSound('eat');
        } else {
          playSound('eat');
          addFloatingText(head.x, head.y, "+10");
        }

        setScore(s => s + (isCaliente ? points * 2 : points));
        createParticles(head.x, head.y, color, 15);
        foodRef.current = spawnFood(newSnake);
      } else {
        newSnake.pop();
      }

      snakeRef.current = newSnake;
    };

    const draw = () => {
      ctx.save();

      if (shake > 0) {
        ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);
        setShake(s => Math.max(0, s - 2));
      }

      // Pro Neon Background
      const bgGrade = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width);
      if (isCaliente) {
        bgGrade.addColorStop(0, '#310a0a');
        bgGrade.addColorStop(1, '#050101');
      } else {
        bgGrade.addColorStop(0, '#0f172a');
        bgGrade.addColorStop(1, '#020617');
      }
      ctx.fillStyle = bgGrade;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Cyber Grid
      ctx.strokeStyle = isCaliente ? '#450a0a' : '#1e293b';
      ctx.lineWidth = 0.5;
      for (let i = 0; i <= canvas.width; i += gridSize) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
      }

      // Food with Glow
      const fx = foodRef.current.x * gridSize;
      const fy = foodRef.current.y * gridSize;
      const fType = foodRef.current.type;

      const fColor = fType === 'GOLDEN' ? '#ffbe0b' : fType === 'CHILI' ? '#fb5607' : fType === 'DRINK' ? '#3a86ff' : '#ff006e';
      ctx.shadowBlur = 25;
      ctx.shadowColor = fColor;
      ctx.fillStyle = fColor;

      ctx.beginPath();
      if (fType === 'NORMAL') {
        const r = gridSize / 2.5;
        const cx = fx + gridSize / 2;
        const cy = fy + gridSize / 2;
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
      } else {
        ctx.roundRect(fx + 4, fy + 4, gridSize - 8, gridSize - 8, 4);
      }
      ctx.fill();
      ctx.shadowBlur = 0;

      // Snake with Neon Trail
      snakeRef.current.forEach((part, i) => {
        const px = part.x * gridSize;
        const py = part.y * gridSize;

        ctx.shadowBlur = i === 0 ? 30 : 10;
        const baseColor = isCaliente ? '#ff006e' : '#00f5d4';
        ctx.shadowColor = baseColor;
        ctx.fillStyle = i === 0 ? '#fff' : baseColor;

        if (i > 0) {
          ctx.globalAlpha = Math.max(0.4, 1 - (i / snakeRef.current.length));
        }

        ctx.beginPath();
        ctx.roundRect(px + 1.5, py + 1.5, gridSize - 3, gridSize - 3, i === 0 ? 8 : 4);
        ctx.fill();
        ctx.globalAlpha = 1.0;
        ctx.shadowBlur = 0;
      });

      // Particles
      particlesRef.current.forEach((p, idx) => {
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15;
        p.life -= 0.025;
        if (p.life <= 0) particlesRef.current.splice(idx, 1);
      });
      ctx.globalAlpha = 1.0;
      ctx.shadowBlur = 0;

      // Floating Texts
      floatingTextsRef.current.forEach((t, idx) => {
        ctx.fillStyle = `rgba(255, 255, 255, ${t.life})`;
        ctx.font = `black ${t.size}px Outfit`;
        ctx.textAlign = 'center';
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'white';
        ctx.fillText(t.text, t.x, t.y);
        t.y -= 1.5;
        t.life -= 0.015;
        if (t.life <= 0) floatingTextsRef.current.splice(idx, 1);
      });

      // Arcade Scanlines & Vignette
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      for (let i = 0; i < canvas.height; i += 3) {
        ctx.fillRect(0, i, canvas.width, 1);
      }

      const vig = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, canvas.width / 3, canvas.width / 2, canvas.height / 2, canvas.width);
      vig.addColorStop(0, 'rgba(0,0,0,0)');
      vig.addColorStop(1, 'rgba(0,0,0,0.4)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.restore();
    };

    const loop = (timestamp: number) => {
      if (timestamp - lastTimeRef.current > speed) {
        update();
        draw();
        lastTimeRef.current = timestamp;
      }
      gameLoopRef.current = requestAnimationFrame(loop);
    };

    gameLoopRef.current = requestAnimationFrame(loop);
    return () => { if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current); };
  }, [isPlaying, speed, isCaliente, shake, spawnFood, handleGameOver, highScore]);

  const setDirection = (x: number, y: number) => {
    if (!isPlaying) return;
    const lastInQueue = inputQueueRef.current[inputQueueRef.current.length - 1] || directionRef.current;
    if (x !== -lastInQueue.x || y !== -lastInQueue.y) {
      if (inputQueueRef.current.length < 3) {
        inputQueueRef.current.push({ x, y });
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#020617]/98 backdrop-blur-3xl animate-in fade-in duration-500" onClick={onClose}></div>

      <div className={`relative w-full max-w-2xl bg-slate-900/40 border-2 rounded-[64px] overflow-hidden transition-all duration-700 ${isCaliente
          ? 'border-red-600 shadow-[0_0_120px_rgba(220,38,38,0.5)] scale-[1.02]'
          : 'border-white/5 shadow-[0_0_80px_rgba(0,0,0,0.8)]'
        }`}>

        {/* Animated Corner Accents */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-red-600/10 rounded-full blur-[80px] animate-pulse" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-600/10 rounded-full blur-[80px] animate-pulse delay-700" />

        <div className="flex items-center justify-between p-10 bg-white/5 border-b border-white/5 relative z-10">
          <div className="flex items-center gap-8">
            <div className={`w-20 h-20 rounded-[32px] flex items-center justify-center shadow-2xl transition-all duration-500 ${isCaliente ? 'bg-red-600 rotate-12 scale-110 shadow-red-900/50' : 'bg-gradient-to-br from-red-500 to-red-700 rotate-0'
              }`}>
              <Gamepad2 className="text-white w-10 h-10" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-4xl font-black tracking-tighter text-white uppercase italic flex items-center gap-3">
                Pizza Snake <span className="text-red-600">Arcade</span>
                <span className="text-[10px] bg-white/10 px-3 py-1 rounded-full text-slate-400 not-italic tracking-[0.3em]">v2.1 PRO</span>
              </h2>
              <div className="flex items-center gap-6 mt-2">
                <div className="flex items-center gap-2 text-[12px] font-black text-yellow-500 uppercase tracking-widest bg-yellow-500/10 px-4 py-1.5 rounded-2xl border border-yellow-500/20">
                  <Trophy className="w-4 h-4" /> HIGHSCORE: {highScore}
                </div>
                {isCaliente && (
                  <div className="flex items-center gap-2 text-[12px] font-black text-white uppercase tracking-widest bg-red-600 px-4 py-1.5 rounded-2xl shadow-lg shadow-red-900/40 animate-bounce">
                    <Flame className="w-4 h-4 fill-current" /> X2 POINTS
                  </div>
                )}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-4 bg-white/5 hover:bg-red-600 hover:text-white rounded-[24px] transition-all text-slate-500 group">
            <X className="w-8 h-8 group-hover:rotate-90 transition-transform" />
          </button>
        </div>

        <div className="p-12 flex flex-col lg:flex-row items-center justify-center gap-12 relative z-10">
          <div className="relative group">
            <div className={`absolute -inset-4 rounded-[48px] blur-3xl opacity-20 group-hover:opacity-40 transition-opacity ${isCaliente ? 'bg-red-600' : 'bg-cyan-500'}`} />
            <canvas
              ref={canvasRef}
              width={400}
              height={400}
              className={`relative bg-slate-950 rounded-[48px] border-8 shadow-2xl transition-all duration-700 ${isCaliente ? 'border-red-600/50' : 'border-white/10'}`}
            />

            {!isPlaying && !isGameOver && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-xl rounded-[40px] z-10 p-12 text-center">
                <div className="w-24 h-24 bg-red-600/10 rounded-full flex items-center justify-center mb-10 border border-red-600/20 shadow-2xl">
                  <Play className="w-10 h-10 text-red-500 fill-current animate-pulse" />
                </div>
                <h3 className="text-3xl font-black text-white mb-4 italic uppercase tracking-tighter">PRONTO PARA O DESAFIO?</h3>
                <p className="text-slate-400 text-sm mb-10 max-w-xs leading-relaxed font-bold">Ganhe pontos e suba de nível no Kantinho Delícia. Quanto mais joga, mais prêmios conquista!</p>
                <button
                  onClick={startGame}
                  className="w-full bg-red-600 hover:bg-red-500 text-white font-black py-6 rounded-3xl transition-all shadow-[0_20px_40px_rgba(220,38,38,0.3)] flex items-center justify-center gap-4 uppercase tracking-[0.3em] active:scale-95 text-sm"
                >
                  INICIAR SESSÃO <Target className="w-5 h-5" />
                </button>
              </div>
            )}

            {isGameOver && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#020617]/95 backdrop-blur-2xl rounded-[40px] z-20 p-12 text-center animate-in zoom-in duration-500">
                <h3 className="text-7xl font-black text-red-600 mb-6 uppercase tracking-tighter italic drop-shadow-2xl">K.O.</h3>
                <div className="bg-white/5 backdrop-blur-md px-12 py-8 rounded-[40px] mb-10 border border-white/5 ring-1 ring-white/10">
                  <p className="text-slate-500 text-[12px] font-black uppercase tracking-[0.4em] mb-3">Score Acumulado</p>
                  <p className="text-7xl font-black text-white leading-none tracking-tighter">{score}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 w-full">
                  <button
                    onClick={startGame}
                    className="bg-white text-black font-black py-6 rounded-3xl transition-all shadow-xl flex items-center justify-center gap-3 uppercase tracking-widest text-[10px] hover:scale-105 active:scale-95"
                  >
                    <RotateCcw className="w-5 h-5" /> TENTAR NOVO
                  </button>
                  <button onClick={onClose} className="bg-slate-800 text-white font-black py-6 rounded-3xl transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-[10px] hover:bg-slate-700">
                    MENU INICIAL
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-8 w-full max-w-[240px]">
            {/* Stats Sidebar */}
            {isPlaying && (
              <div className="grid grid-cols-1 gap-4 animate-in slide-in-from-right duration-500">
                <div className="bg-white/5 border border-white/5 p-8 rounded-[40px] text-center shadow-xl backdrop-blur-md">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Score</p>
                  <p className={`text-6xl font-black transition-all ${isCaliente ? 'text-red-500 scale-110' : 'text-white'}`}>{score}</p>
                </div>
                <div className="bg-white/5 border border-white/5 p-6 rounded-[32px] flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${isCaliente ? 'bg-red-600 animate-pulse' : 'bg-slate-800'}`}>
                    <Flame className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-500 uppercase">Multiplicador</p>
                    <p className="text-sm font-black text-white">{isCaliente ? '2.0X' : '1.0X'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile/Touch Controls */}
            <div className="grid grid-cols-3 gap-3 w-full">
              <div />
              <button onTouchStart={() => setDirection(0, -1)} className="aspect-square bg-white/5 rounded-[24px] flex items-center justify-center text-slate-400 active:bg-red-600 active:text-white shadow-xl border border-white/5 transition-all"><ChevronUp className="w-10 h-10" /></button>
              <div />
              <button onTouchStart={() => setDirection(-1, 0)} className="aspect-square bg-white/5 rounded-[24px] flex items-center justify-center text-slate-400 active:bg-red-600 active:text-white shadow-xl border border-white/5 transition-all"><ChevronLeft className="w-10 h-10" /></button>
              <button onTouchStart={() => setDirection(0, 1)} className="aspect-square bg-white/5 rounded-[24px] flex items-center justify-center text-slate-400 active:bg-red-600 active:text-white shadow-xl border border-white/5 transition-all"><ChevronDown className="w-10 h-10" /></button>
              <button onTouchStart={() => setDirection(1, 0)} className="aspect-square bg-white/5 rounded-[24px] flex items-center justify-center text-slate-400 active:bg-red-600 active:text-white shadow-xl border border-white/5 transition-all"><ChevronRight className="w-10 h-10" /></button>
            </div>

            <div className="bg-blue-600/10 border border-blue-500/20 p-4 rounded-[24px] flex items-center gap-4">
              <Disc className="w-4 h-4 text-blue-500 animate-spin-slow" />
              <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Controles Ativos via D-Pad</p>
            </div>
          </div>
        </div>

        <div className="px-12 py-8 bg-black/40 text-center relative z-10">
          <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.6em] animate-pulse">Siga o mestre, domine o sabor</p>
        </div>
      </div>
    </div>
  );
};

export default GameModal;
