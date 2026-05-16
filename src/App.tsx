import { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
}

interface SubModule {
  name: string;
  url: string;
}

interface Module {
  id: string;
  title: string;
  subtitle: string;
  color: string;
  icon: string;
  description: string;
  url: string;
  subModules?: SubModule[];
  telemetryKey: keyof TelemetryData;
}

interface Owner {
  name: string;
  designation: string;
  initials: string;
  accent: string;
  quote: string;
}

interface TelemetryData {
  costEfficiency: number;
  labourUtilization: number;
  overallAccuracy: number;
}

type ThemeAccent = 'gold' | 'blue' | 'emerald' | 'copper';
type AssistantMood = 'idle' | 'curious' | 'thinking' | 'error' | 'success';

function App() {
  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('dpf_portal_logged') === 'true';
  });
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [assistantMood, setAssistantMood] = useState<AssistantMood>('idle');
  const [focusedField, setFocusedField] = useState<'user' | 'password' | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);

  // General Portal State
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [ownerIndex, setOwnerIndex] = useState(0);
  
  // Dynamic UI theme customizer
  const [activeAccent, setActiveAccent] = useState<ThemeAccent>('gold');

  // Real-time dynamic telemetry updating inside cards
  const [telemetry, setTelemetry] = useState<TelemetryData>({
    costEfficiency: 96.4,
    labourUtilization: 88.2,
    overallAccuracy: 94.8
  });

  const [redirectState, setRedirectState] = useState<{
    isRedirecting: boolean;
    targetUrl: string;
    moduleTitle: string;
    progress: number;
  }>({
    isRedirecting: false,
    targetUrl: '',
    moduleTitle: '',
    progress: 0,
  });

  const [metrics, setMetrics] = useState({
    efficiency: 94.2,
    load: 42,
    bandwidth: '24.8 Gb/s',
    ping: 18,
  });

  const owners: Owner[] = [
    {
      name: 'Priya Suhas',
      designation: 'Founder & Design Director',
      initials: 'PS',
      accent: 'var(--accent-gold)',
      quote: 'Architecture is the thoughtful making of space.',
    },
    {
      name: 'Suhas Gujarathi',
      designation: 'Co-Founder & Managing Partner',
      initials: 'SG',
      accent: 'var(--accent-blue)',
      quote: 'A facade tells the story of those within.',
    },
    {
      name: 'Lekh Suhas Gujarathi',
      designation: 'Partner & Operations Head',
      initials: 'LG',
      accent: 'var(--accent-green)',
      quote: 'Precision in execution defines our legacy.',
    },
  ];

  const initParticles = useCallback(() => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < 30; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.25,
        speedY: (Math.random() - 0.5) * 0.25,
        opacity: Math.random() * 0.4 + 0.15,
      });
    }
    return newParticles;
  }, []);

  const particleRef = useRef<Particle[]>([]);

  useEffect(() => {
    particleRef.current = initParticles();
    setIsLoaded(true);

    const interval = setInterval(() => {
      setMetrics({
        efficiency: parseFloat((92 + Math.random() * 5).toFixed(1)),
        load: Math.floor(35 + Math.random() * 15),
        bandwidth: `${(22 + Math.random() * 5).toFixed(1)} Gb/s`,
        ping: Math.floor(15 + Math.random() * 8),
      });

      // Update telemetry values in real-time for dynamic UI feel
      setTelemetry({
        costEfficiency: parseFloat((94 + Math.random() * 4).toFixed(1)),
        labourUtilization: parseFloat((85 + Math.random() * 8).toFixed(1)),
        overallAccuracy: parseFloat((92 + Math.random() * 5).toFixed(1))
      });
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [initParticles]);

  // Auto-sliding owner carousel
  useEffect(() => {
    if (!isLoggedIn) return;
    const ownerInterval = setInterval(() => {
      setOwnerIndex((prev) => (prev + 1) % owners.length);
    }, 4500);
    return () => clearInterval(ownerInterval);
  }, [owners.length, isLoggedIn]);

  useEffect(() => {
    if (!isLoaded) return;

    const animateParticles = () => {
      setParticles((prevParticles) => {
        return prevParticles.map((p) => {
          let nx = p.x + p.speedX;
          let ny = p.y + p.speedY;
          if (nx < 0) nx = 100;
          if (nx > 100) nx = 0;
          if (ny < 0) ny = 100;
          if (ny > 100) ny = 0;
          return { ...p, x: nx, y: ny };
        });
      });
    };

    const interval = setInterval(animateParticles, 40);
    return () => clearInterval(interval);
  }, [isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    setParticles(particleRef.current);
  }, [isLoaded]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = document.querySelector('.app-container')?.getBoundingClientRect();
    if (rect) {
      setMouseX(e.clientX - rect.left);
      setMouseY(e.clientY - rect.top);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setLoginError('');
    setAssistantMood('thinking');
    playTone(520, 0.08, 'sine');

    setTimeout(() => {
      if (userId === 'admin' && password === 'dpfllp') {
        setAssistantMood('success');
        playTone(760, 0.12, 'sine');
        localStorage.setItem('dpf_portal_logged', 'true');
        setTimeout(() => setIsLoggedIn(true), 850);
      } else {
        setAssistantMood('error');
        playTone(180, 0.14, 'sawtooth');
        setLoginError('ACCESS DENIED. INVALID CREDENTIALS.');
        setTimeout(() => {
          setAssistantMood(focusedField ? 'curious' : 'idle');
        }, 1400);
      }
      setIsAuthenticating(false);
    }, 1200);
  };

  const handleLoginFieldFocus = (field: 'user' | 'password') => {
    setFocusedField(field);
    if (!isAuthenticating && assistantMood !== 'error') {
      setAssistantMood('curious');
    }
  };

  const handleLoginFieldBlur = () => {
    setFocusedField(null);
    if (!isAuthenticating && assistantMood !== 'error') {
      setAssistantMood('idle');
    }
  };

  const playTone = (frequency: number, duration: number, type: OscillatorType) => {
    if (!soundEnabled) return;
    const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const context = new AudioContextClass();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.035, context.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + duration + 0.02);
  };

  const handleLogout = () => {
    localStorage.removeItem('dpf_portal_logged');
    setIsLoggedIn(false);
    setUserId('');
    setPassword('');
  };

  const modules: Module[] = [
    {
      id: 'cost-control',
      title: 'Cost Control',
      subtitle: 'Financial Intelligence',
      color: 'var(--accent-gold)',
      icon: '◈',
      description:
        'Optimized financial intelligence systems tracking projects, palettes, and material assets with precision analytics.',
      url: '/cost-control',
      telemetryKey: 'costEfficiency',
      subModules: [
        { name: 'Set Dashboard 1.0', url: '/cost-control/v1' },
        { name: 'Advance Set Dashboard 2.0', url: '/cost-control/v2' },
      ],
    },
    {
      id: 'labour-management',
      title: 'Labour Management',
      subtitle: 'Workforce & Planning',
      color: 'var(--accent-blue)',
      icon: '◇',
      description:
        'Comprehensive workforce tracking, real-time budget adjustments, and resource scheduling tools for every project.',
      url: '/labour-management',
      telemetryKey: 'labourUtilization',
      subModules: [{ name: 'Budget Calculator', url: '/labour-management/calculator' }],
    },
    {
      id: 'budget-analysis',
      title: 'Overall Budget Analysis',
      subtitle: 'Enterprise Intelligence',
      color: 'var(--accent-green)',
      icon: '◉',
      description:
        'Holistic forecasting engine compiling architectural elements, design costs, and timeline factors at scale.',
      url: '/budget-analysis',
      telemetryKey: 'overallAccuracy',
      subModules: [{ name: 'Analytical Overview', url: '/budget-analysis/overview' }],
    },
  ];

  const triggerRedirect = (module: Module, customUrl?: string) => {
    const targetUrl = customUrl || module.url;
    setRedirectState({
      isRedirecting: true,
      targetUrl,
      moduleTitle: module.title,
      progress: 0,
    });

    let prog = 0;
    const timer = setInterval(() => {
      prog += Math.floor(Math.random() * 15) + 5;
      if (prog >= 100) {
        prog = 100;
        clearInterval(timer);
        setTimeout(() => {
          window.location.href = targetUrl;
        }, 800);
      }
      setRedirectState((prev) => ({ ...prev, progress: prog }));
    }, 100);
  };



  return (
    <div className={`app-container theme-${activeAccent}`} onMouseMove={handleMouseMove}>
      {/* Background Layers */}
      <div className="industrial-background">
        <div className="gradient-mesh"></div>
        <div className="grid-overlay"></div>
        <div className="vignette-overlay"></div>

        {/* Animated Vector Schematics */}
        <svg
          className="vector-blueprint-bg"
          viewBox="0 0 1000 1000"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
        >
          <circle
            cx="500"
            cy="500"
            r="420"
            stroke="rgba(201, 169, 97, 0.06)"
            strokeWidth="1"
            strokeDasharray="3,8"
            fill="none"
            className="slow-spin"
          />
          <circle
            cx="500"
            cy="500"
            r="320"
            stroke="rgba(123, 167, 201, 0.05)"
            strokeWidth="1.2"
            fill="none"
          />
          <circle
            cx="500"
            cy="500"
            r="220"
            stroke="rgba(201, 169, 97, 0.04)"
            strokeWidth="1"
            strokeDasharray="2,6"
            fill="none"
            className="slow-spin-reverse"
          />

          {/* Architectural elevation blueprint */}
          <g className="float-slow" opacity="0.4">
            <rect
              x="100"
              y="650"
              width="180"
              height="220"
              stroke="var(--accent-glow)"
              strokeWidth="1"
              fill="none"
              opacity="0.15"
            />
            <line x1="100" y1="700" x2="280" y2="700" stroke="var(--accent-glow)" opacity="0.08" />
            <line x1="100" y1="750" x2="280" y2="750" stroke="var(--accent-glow)" opacity="0.08" />
            <line x1="100" y1="800" x2="280" y2="800" stroke="var(--accent-glow)" opacity="0.08" />
            <line x1="160" y1="650" x2="160" y2="870" stroke="var(--accent-glow)" opacity="0.08" />
            <line x1="220" y1="650" x2="220" y2="870" stroke="var(--accent-glow)" opacity="0.08" />
          </g>

          {/* Rotating compass gear */}
          <g className="rotating-gear-right" opacity="0.5">
            <circle
              cx="850"
              cy="200"
              r="80"
              stroke="var(--accent-glow)"
              strokeWidth="1"
              strokeDasharray="6,6"
              fill="none"
              opacity="0.1"
            />
            <line x1="850" y1="120" x2="850" y2="280" stroke="var(--accent-glow)" opacity="0.06" />
            <line x1="770" y1="200" x2="930" y2="200" stroke="var(--accent-glow)" opacity="0.06" />
          </g>
        </svg>

        {/* Soft dynamic color orbs */}
        <div className="bg-orb orb-1"></div>
        <div className="bg-orb orb-2"></div>
        <div className="bg-orb orb-3"></div>
      </div>

      {/* Floating Particles */}
      {particles.map((p, i) => (
        <div
          key={i}
          className="floating-particle"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size * 2}px`,
            height: `${p.size * 2}px`,
            opacity: p.opacity,
          }}
        />
      ))}

      {/* Theme Accent Selector (Highly Dynamic UI Accent Customizer) */}
      {isLoggedIn && (
        <div className="theme-customizer">
          <div className="customizer-label">ACCENT PANEL</div>
          <div className="accent-dots">
            {(['gold', 'blue', 'emerald', 'copper'] as ThemeAccent[]).map((acc) => (
              <button
                key={acc}
                className={`accent-selector-btn ${acc} ${activeAccent === acc ? 'active' : ''}`}
                onClick={() => setActiveAccent(acc)}
                aria-label={`Set accent theme to ${acc}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Authentication Gate (Cinematic Secure Login Panel) */}
      {!isLoggedIn ? (
        <div className={`login-gate-overlay assistant-${assistantMood}`}>
          <div className="login-cinematic-shell">
            <section className="assistant-stage" aria-label="Reactive AI assistant status">
              <div className="assistant-orbit orbit-one"></div>
              <div className="assistant-orbit orbit-two"></div>
              <div className="assistant-status-chip">
                <span className="chip-pulse"></span>
                {assistantMood === 'idle' && 'AI COMPANION STANDING BY'}
                {assistantMood === 'curious' && `WATCHING ${focusedField === 'password' ? 'ACCESS KEY' : 'USER IDENTITY'}`}
                {assistantMood === 'thinking' && 'VERIFYING CREDENTIALS'}
                {assistantMood === 'error' && 'ACCESS PATTERN REJECTED'}
                {assistantMood === 'success' && 'CLEARANCE ACCEPTED'}
              </div>

              <div className="assistant-scene">
                <div className="assistant-shadow"></div>
                <div className="assistant-body">
                  <div className="assistant-head">
                    <div className="assistant-antenna"></div>
                    <div className="assistant-faceplate">
                      <div className="assistant-eye eye-left">
                        <span></span>
                      </div>
                      <div className="assistant-eye eye-right">
                        <span></span>
                      </div>
                      <div className="assistant-mouth"></div>
                    </div>
                  </div>
                  <div className="assistant-core">
                    <div className="core-light"></div>
                    <div className="core-line line-a"></div>
                    <div className="core-line line-b"></div>
                  </div>
                  <div className="assistant-arm arm-left"></div>
                  <div className="assistant-arm arm-right"></div>
                </div>
                <div className="assistant-holo-ring ring-a"></div>
                <div className="assistant-holo-ring ring-b"></div>
              </div>

              <div className="emotion-readout">
                <div className="readout-line">
                  <span>EMOTION</span>
                  <strong>{assistantMood.toUpperCase()}</strong>
                </div>
                <div className="readout-line">
                  <span>TRACKING</span>
                  <strong>{focusedField ? focusedField.toUpperCase() : 'NATURAL'}</strong>
                </div>
              </div>
            </section>

          <div className={`login-card ${loginError ? 'has-error' : ''}`}>
            <button
              type="button"
              className={`sound-toggle ${soundEnabled ? 'enabled' : ''}`}
              onClick={() => setSoundEnabled((prev) => !prev)}
              aria-pressed={soundEnabled}
              aria-label="Toggle subtle interface sounds"
            >
              SOUND {soundEnabled ? 'ON' : 'OFF'}
            </button>

            <div className="login-header">
              <div className="brand-initials">DPF</div>
              <h1 className="login-brand">DESIGNS PALETTES &amp; FACADES <span className="brand-llp">LLP</span></h1>
              <p className="login-tagline">CINEMATIC SECURE AI GATEWAY</p>
            </div>

            <form onSubmit={handleLogin} className="login-form">
              <div className="form-group">
                <label htmlFor="userId">USER IDENTITY</label>
                <div className="input-wrapper">
                  <span className="input-icon">ID</span>
                  <input
                    id="userId"
                    type="text"
                    placeholder="ENTER USER ID"
                    value={userId}
                    onFocus={() => handleLoginFieldFocus('user')}
                    onBlur={handleLoginFieldBlur}
                    onChange={(e) => {
                      setUserId(e.target.value);
                      if (!isAuthenticating) setAssistantMood('curious');
                    }}
                    required
                    autoComplete="username"
                    aria-describedby={loginError ? 'login-error' : undefined}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password">ACCESS KEY</label>
                <div className="input-wrapper">
                  <span className="input-icon">KEY</span>
                  <input
                    id="password"
                    type="password"
                    placeholder="ENTER PASSWORD"
                    value={password}
                    onFocus={() => handleLoginFieldFocus('password')}
                    onBlur={handleLoginFieldBlur}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (!isAuthenticating) setAssistantMood('curious');
                    }}
                    required
                    autoComplete="current-password"
                    aria-describedby={loginError ? 'login-error' : undefined}
                  />
                </div>
              </div>

              {loginError && <div className="login-error-msg" id="login-error" role="alert">{loginError}</div>}

              <button type="submit" className="login-submit-btn" disabled={isAuthenticating}>
                {isAuthenticating ? (
                  <>
                    <span className="auth-spinner"></span>
                    <span>AUTHENTICATING...</span>
                  </>
                ) : (
                  <>
                    <span>REQUEST SYSTEM CLEARANCE</span>
                    <span className="arrow">→</span>
                  </>
                )}
              </button>
            </form>

            <div className="security-notice">
              AUTHORIZED PERSONNEL ONLY. ASSISTANT AUDIO IS OPTIONAL AND USER-CONTROLLED.
            </div>
          </div>
          </div>
        </div>
      ) : (
        <>
          {/* Cinematic Redirection Overlay */}
          {redirectState.isRedirecting && (
            <div className="redirect-overlay">
              <div className="redirect-card">
                <div className="redirect-spinner-container">
                  <div className="redirect-spinner"></div>
                  <div className="redirect-spinner-inner"></div>
                  <div className="redirect-spinner-core"></div>
                </div>
                <div className="redirect-title">ESTABLISHING PORTAL LINK</div>
                <div className="redirect-subtitle">
                  CONNECTING TO {redirectState.moduleTitle.toUpperCase()}
                </div>

                <div className="progress-bar-container">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${redirectState.progress}%` }}
                  ></div>
                </div>

                <div className="redirect-metrics">
                  <div>TARGET: {redirectState.targetUrl}</div>
                  <div>{redirectState.progress}%</div>
                </div>
                <div className="terminal-text">
                  &gt; SECURE UPLINK DEPLOYED <br />
                  &gt; ENCRYPTING PROTOCOLS... <br />
                  &gt; HANDSHAKE SUCCESSFUL
                </div>
              </div>
            </div>
          )}

          {/* Minimal Cinematic Header — DPF centered, only logout on the side */}
          <header className="interface-header">
            <div className="header-brand-wrap">
              <span className="brand-mark">DPF · LLP</span>
              <span className="brand-underline"></span>
            </div>
            <button onClick={handleLogout} className="logout-action-btn header-logout">
              LOGOUT ⎋
            </button>
          </header>

          {/* Main Content Area */}
          <div className="main-scroll-wrapper">
            <div className="main-content">
              <div className={`cinematic-header ${isLoaded ? 'fade-in' : ''}`}>
                <div className="header-decoration">
                  <span className="line-decor"></span>
                  <span className="diamond-decor">◆</span>
                  <span className="line-decor"></span>
                </div>
                <div className="company-name">DESIGNS PALETTES & FACADES</div>
                <div className="company-suffix">L L P</div>
                <div className="tagline">Portal · Industrial Simulation & Control Hub</div>
              </div>

              <div className={`module-grid ${isLoaded ? 'fade-in' : ''}`}>
                {modules.map((mod) => (
                  <div
                    key={mod.id}
                    className={`module-card ${activeModule === mod.id ? 'active' : ''}`}
                    onMouseEnter={(e) => {
                      setActiveModule(mod.id);
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = e.clientX - rect.left;
                      const y = e.clientY - rect.top;
                      e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
                      e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
                    }}
                    onMouseLeave={() => setActiveModule(null)}
                    style={
                      {
                        '--glow-color': mod.color,
                        '--card-border': mod.color,
                      } as React.CSSProperties
                    }
                  >
                    <div className="card-corner tl"></div>
                    <div className="card-corner tr"></div>
                    <div className="card-corner bl"></div>
                    <div className="card-corner br"></div>

                    <div className="module-card-inner">
                      <div className="module-header-row">
                        <div className="module-icon" style={{ color: mod.color }}>
                          {mod.icon}
                        </div>
                        <div className="tech-code">
                          NODE · {mod.id.toUpperCase().slice(0, 4)}
                        </div>
                      </div>

                      <div className="module-title">{mod.title}</div>
                      <div className="module-subtitle" style={{ color: mod.color }}>
                        {mod.subtitle}
                      </div>

                      <p className="module-desc">{mod.description}</p>

                      {/* Dynamic UI Telemetry Widget */}
                      <div className="card-telemetry-bar">
                        <div className="telemetry-label">LIVE EFFICIENCY</div>
                        <div className="telemetry-track">
                          <div 
                            className="telemetry-fill" 
                            style={{ 
                              width: `${telemetry[mod.telemetryKey]}%`,
                              backgroundColor: mod.color
                            }}
                          ></div>
                        </div>
                        <div className="telemetry-value">{telemetry[mod.telemetryKey]}%</div>
                      </div>

                      {mod.subModules && (
                        <div className="submodule-links">
                          {mod.subModules.map((sub, index) => (
                            <button
                              key={index}
                              className="submodule-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                triggerRedirect(mod, sub.url);
                              }}
                            >
                              <span className="submodule-bullet">›</span>
                              <span className="submodule-name">{sub.name}</span>
                              <span className="arrow">→</span>
                            </button>
                          ))}
                        </div>
                      )}

                      <button className="launch-btn" onClick={() => triggerRedirect(mod)}>
                        <span>LAUNCH MAIN SYSTEM</span>
                        <span className="pulse-dot"></span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Auto-sliding Leadership Footer */}
          <footer className="leadership-footer">
            <div className="footer-inner">
              <div className="footer-label">
                <span className="footer-label-line"></span>
                <span>LEADERSHIP</span>
                <span className="footer-label-line"></span>
              </div>

              <div className="owner-carousel">
                {owners.map((owner, i) => (
                  <div key={i} className={`owner-slide ${i === ownerIndex ? 'active' : ''}`}>
                    <div
                      className="owner-avatar"
                      style={{
                        background: `linear-gradient(135deg, ${owner.accent}33 0%, ${owner.accent}11 100%)`,
                        borderColor: owner.accent,
                        color: owner.accent,
                      }}
                    >
                      {owner.initials}
                      <div className="avatar-ring" style={{ borderColor: owner.accent }}></div>
                    </div>
                    <div className="owner-info">
                      <div className="owner-name">{owner.name}</div>
                      <div className="owner-designation" style={{ color: owner.accent }}>
                        {owner.designation}
                      </div>
                      <div className="owner-quote">"{owner.quote}"</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="owner-dots">
                {owners.map((_, i) => (
                  <button
                    key={i}
                    className={`owner-dot ${i === ownerIndex ? 'active' : ''}`}
                    onClick={() => setOwnerIndex(i)}
                    aria-label={`View owner ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className="footer-meta">
              <span className="meta-copy">© {new Date().getFullYear()} Designs Palettes &amp; Facades LLP</span>
              <span className="meta-divider" aria-hidden="true"></span>
              <span className="meta-info">All Rights Reserved</span>
              <span className="meta-divider" aria-hidden="true"></span>
              <span className="meta-info">
                <span className="meta-dot"></span> Secure VPN · {metrics.bandwidth}
              </span>
            </div>
          </footer>
        </>
      )}

      {/* Interactive Grid Details */}
      <div className="corner-accent top-left"></div>
      <div className="corner-accent top-right"></div>
      <div className="corner-accent bottom-left"></div>
      <div className="corner-accent bottom-right"></div>

      {/* Mouse ambient lighting */}
      <div
        className="ambient-light"
        style={{
          left: `${mouseX}px`,
          top: `${mouseY}px`,
        }}
      ></div>
    </div>
  );
}

export default App;
