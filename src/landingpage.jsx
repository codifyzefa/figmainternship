import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from './utils/api';
import {
  ArrowRight, BookOpen, ClipboardCheck, FileText, Users,
  Bell, Mail, Phone, MapPin, Info, ChevronRight, ExternalLink,
  GraduationCap, Menu, X, CheckCircle, Zap, Shield, Building2,
  Flag, Calendar, Lightbulb, Play, Plus, Minus
} from 'lucide-react';


/* ─── Teams Exact Color Tokens ───────────────────────────────── */
const C = {
  /* teams purple family */
  purple50:  '#efeffb',
  purple100: '#cdccf2',
  purple200: '#b4b4eb',
  purple300: '#9291e2',
  purple500: '#5d5bd4',
  purple600: '#5553c1',
  purple700: '#424197',
  purple900: '#201f48',
  /* backgrounds */
  heroBg:    'linear-gradient(135deg, #f0efff 0%, #e8f1ff 40%, #f5efff 100%)',
  sectionBg: 'linear-gradient(180deg, #f7f6ff 0%, #eef3ff 100%)',
  darkBg:    '#201f48',
  midPurple: '#7b79e0',
  /* text */
  textDark:  '#1a1a2e',
  textMid:   '#3d3c6e',
  textMuted: '#6c6c8a',
  textLight: '#9a9ab5',
  /* cards */
  cardBg:    '#ffffff',
  cardBorder:'#e0dff5',
  cardHover: '#f5f4ff',
  /* blues */
  blue500:   '#0078d4',
  /* neutrals */
  navBg:     '#ffffff',
  white:     '#ffffff',
  divider:   '#e8e8f0',
};

const font = "'Segoe UI', SegoeUI, 'Helvetica Neue', Helvetica, Arial, sans-serif";

/* ─── Shadow tokens ──────────────────────────────────────────── */
const sh = {
  s1: '0 1px 4px rgba(93,91,212,.06)',
  s2: '0 2px 8px rgba(93,91,212,.10)',
  s3: '0 4px 16px rgba(93,91,212,.12)',
  s4: '0 8px 32px rgba(93,91,212,.16)',
  nav:'0 1px 0 rgba(0,0,0,.06)',
};

/* ═══════════════════════════════════════════════════════════════
   Teams-style Purple Button
═══════════════════════════════════════════════════════════════ */
const TeamsBtn = ({ children, onClick, variant = 'filled', size = 'md', style = {} }) => {
  const [hov, setHov] = useState(false);
  const pad = size === 'lg' ? '12px 28px' : size === 'sm' ? '6px 16px' : '10px 22px';
  const fs  = size === 'lg' ? '1rem' : '0.9375rem';

  const styles = variant === 'filled'
    ? { background: hov ? C.purple600 : C.purple500, color: C.white, border: `2px solid transparent` }
    : { background: hov ? C.purple50 : 'transparent', color: C.purple500, border: `1.5px solid ${hov ? C.purple500 : C.purple300}` };

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        fontFamily: font, fontWeight: 600, fontSize: fs,
        letterSpacing: '-0.01em', lineHeight: '1.4',
        borderRadius: 4, cursor: 'pointer',
        padding: pad, display: 'inline-flex',
        alignItems: 'center', gap: 8,
        transition: 'all 0.15s ease',
        boxShadow: variant === 'filled' && hov ? sh.s3 : 'none',
        transform: hov ? 'translateY(-1px)' : 'none',
        ...styles, ...style,
      }}
    >
      {children}
    </button>
  );
};

/* ─── Teams card-action button (purple square + text) ────────── */
const CardAction = ({ children, onClick }) => {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        background: 'none', border: 'none', cursor: 'pointer',
        padding: 0, fontFamily: font,
      }}
    >
      {/* Purple rounded square with ">" */}
      <span style={{
        width: 32, height: 32, borderRadius: 6,
        background: hov ? C.purple600 : C.purple500,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background 0.15s',
        flexShrink: 0,
      }}>
        <ChevronRight size={16} color={C.white} />
      </span>
      <span style={{
        fontWeight: 600, fontSize: '0.9375rem',
        color: hov ? C.purple600 : C.purple500,
        transition: 'color 0.15s',
        textDecoration: hov ? 'underline' : 'none',
      }}>
        {children}
      </span>
    </button>
  );
};

/* ─── Section nav tab ────────────────────────────────────────── */
const TabBtn = ({ active, children, onClick }) => (
  <button
    onClick={onClick}
    style={{
      fontFamily: font, fontWeight: 600,
      fontSize: '0.9375rem', letterSpacing: '-0.01em',
      color: active ? C.purple500 : C.textMuted,
      background: 'none', border: 'none',
      borderBottom: active ? `2px solid ${C.purple500}` : '2px solid transparent',
      padding: '12px 4px', cursor: 'pointer',
      transition: 'color 0.15s, border-color 0.15s',
      marginRight: 28,
      whiteSpace: 'nowrap',
    }}
  >
    {children}
  </button>
);

/* ─── Main Component ─────────────────────────────────────────── */
const HomePage = () => {
  const navigate  = useNavigate();
  const [notices, setNotices]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [scrolled, setScrolled]   = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    apiRequest('/notices/public', { silent: true })
      .then(d => setNotices(d || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 4);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  const goto = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMenuOpen(false);
    setActiveTab(id);
  };

  /* ── nav links ── */
  const tabs = [
    { id: 'overview',      label: 'Overview'       },
    { id: 'process',       label: 'Process'        },
    { id: 'announcements', label: 'Announcements'  },
    { id: 'contact',       label: 'Contact'        },
  ];

  return (
    <div style={{ minHeight: '100vh', fontFamily: font, color: C.textDark, background: C.white }}>

      {/* ══════════════════════════════════════════════════════
          NAV — white, pipe-separated, like Teams
      ══════════════════════════════════════════════════════ */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: C.navBg,
        boxShadow: scrolled ? sh.nav : sh.nav,
        borderBottom: `1px solid ${C.divider}`,
      }}>
        <div style={{
          maxWidth: 1320, margin: '0 auto',
          padding: '0 40px', height: 56,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 20,
        }}>
          {/* Logo area */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, cursor: 'pointer', flexShrink: 0 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img src="/cuilogo.png" alt="CUI" style={{ height: 28, width: 'auto', marginRight: 10 }}
              onError={e => e.target.style.display = 'none'} />
            <span style={{ fontWeight: 700, fontSize: '1rem', color: '#737373', marginRight: 8 }}>CUI Abbottabad</span>
            {/* Teams-style pipe separator */}
            <span style={{ color: C.divider, fontSize: '1.4rem', fontWeight: 100, marginRight: 8 }}>|</span>
            <NavLink onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              Internship Portal
            </NavLink>
          </div>

          {/* Desktop links */}
          <div className="hp-nav-links" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <NavLink onClick={() => goto('overview')}>Overview</NavLink>
            <NavLink onClick={() => goto('process')}>Process</NavLink>
            <NavLink onClick={() => goto('announcements')}>Announcements</NavLink>
            <NavLink onClick={() => goto('contact')}>Contact</NavLink>
          </div>

          {/* CTA */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <TeamsBtn variant="outline" size="sm" onClick={() => navigate('/login')}
              style={{ display: 'none' }} className="hp-signin">
              Sign in
            </TeamsBtn>
            <TeamsBtn variant="filled" size="sm" onClick={() => navigate('/login')}>
              Access Portal
            </TeamsBtn>
            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="hp-hamburger"
              style={{
                display: 'none', background: 'none', border: 'none',
                cursor: 'pointer', padding: 6, borderRadius: 4, color: C.textDark,
              }}
            >{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
          </div>
        </div>
        {/* Mobile dropdown */}
        {menuOpen && (
          <div style={{
            background: C.white, borderTop: `1px solid ${C.divider}`,
            padding: '12px 28px 20px', boxShadow: sh.s3,
          }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => goto(t.id)} style={{
                display: 'block', width: '100%', textAlign: 'left',
                fontFamily: font, fontWeight: 600, fontSize: '0.9375rem',
                color: C.textDark, background: 'none', border: 'none',
                padding: '10px 0', cursor: 'pointer',
                borderBottom: `1px solid ${C.divider}`,
              }}>{t.label}</button>
            ))}
            <div style={{ marginTop: 14 }}>
              <TeamsBtn variant="filled" onClick={() => navigate('/login')} style={{ width: '100%', justifyContent: 'center' }}>
                Access Portal
              </TeamsBtn>
            </div>
          </div>
        )}
      </nav>

      {/* ══════════════════════════════════════════════════════
          HERO — Teams layout: left text + right abstract visual
      ══════════════════════════════════════════════════════ */}
      <section style={{
        paddingTop: 56,
        background: C.heroBg,
        minHeight: '88vh',
        display: 'flex', alignItems: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          maxWidth: 1320, margin: '0 auto',
          padding: '80px 40px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 64, alignItems: 'center',
          width: '100%',
        }} className="hp-hero-grid">
          {/* Left: text */}
          <div>
            <h1 style={{
              fontWeight: 700,
              fontSize: 'clamp(2.4rem, 5vw, 3.75rem)',
              lineHeight: 1.08,
              letterSpacing: '-0.04em',
              color: C.textDark,
              marginBottom: 20,
            }}>
              CUI Internship<br />Portal Login
            </h1>
            <p style={{
              fontWeight: 400,
              fontSize: '1.125rem',
              lineHeight: 1.75,
              color: C.textMid,
              marginBottom: 36,
              maxWidth: 420,
            }}>
              DIMS helps you manage your internship journey — track progress, submit
              reports, and collaborate with faculty and supervisors.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <TeamsBtn variant="filled" size="lg" onClick={() => navigate('/login')}>
                Sign in
              </TeamsBtn>
              <TeamsBtn variant="outline" size="lg" onClick={() => navigate('/login')}>
                Access Portal
              </TeamsBtn>
            </div>
            {/* Compare link (Teams style) */}
            <div style={{ marginTop: 24 }}>
              <button
                onClick={() => goto('overview')}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: C.purple50, border: 'none',
                  borderRadius: 4, padding: '8px 14px',
                  cursor: 'pointer', fontFamily: font,
                  fontWeight: 600, fontSize: '0.9375rem',
                  color: C.purple500,
                  transition: 'background 0.15s',
                }}
              >
                <span style={{
                  width: 22, height: 22, borderRadius: 4,
                  background: C.purple500,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <ChevronRight size={13} color={C.white} />
                </span>
                Learn about the program
              </button>
            </div>
          </div>

          {/* Right: Teams-style abstract 3D visual */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <HeroVisual />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          STICKY SECTION TABS (Overview / Plans / Resources / FAQ)
      ══════════════════════════════════════════════════════ */}
      <div style={{
        position: 'sticky', top: 56, zIndex: 900,
        background: C.white, borderBottom: `1px solid ${C.divider}`,
        boxShadow: sh.nav,
      }}>
        <div style={{
          maxWidth: 1320, margin: '0 auto',
          padding: '0 40px',
          display: 'flex', alignItems: 'flex-end',
          overflowX: 'auto',
        }}>
          {tabs.map(t => (
            <TabBtn key={t.id} active={activeTab === t.id} onClick={() => goto(t.id)}>
              {t.label}
            </TabBtn>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          OVERVIEW — "Learn how to use Teams" style
      ══════════════════════════════════════════════════════ */}
      <section id="overview" style={{ padding: '80px 40px', background: C.white }}>
        <div style={{ maxWidth: 1320, margin: '0 auto' }}>
          <p style={{
            fontWeight: 600, fontSize: '0.8125rem',
            letterSpacing: '0.06em', textTransform: 'uppercase',
            color: C.purple500, marginBottom: 12,
          }}>OVERVIEW</p>
          <h2 style={{
            fontWeight: 700, fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
            letterSpacing: '-0.04em', lineHeight: 1.1,
            color: C.textDark, marginBottom: 48,
          }}>
            How the Internship Portal works
          </h2>

          {/* 3-column cards — exact Teams card style */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 20,
          }}>
            {[
              {
                icon: <Flag size={24} color={C.purple500} />,
                title: 'Getting started',
                desc: 'Create your internship proposal, find a company, and submit it for departmental approval through the portal.',
                action: 'Access Portal',
              },
              {
                icon: <ClipboardCheck size={24} color={C.purple500} />,
                title: 'Weekly Reporting',
                desc: 'Log your activities weekly, get them verified by your site supervisor, and tracked by your faculty in real time.',
                action: 'View process',
              },
              {
                icon: <Lightbulb size={24} color={C.purple500} />,
                title: 'Evaluation & Certification',
                desc: 'Receive mid-term and final assessments from assigned faculty and earn your internship completion certificate.',
                action: 'Learn more',
              },
            ].map((card, i) => (
              <TeamsCard key={i} {...card} onAction={() => i === 0 ? navigate('/login') : goto('process')} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          ABOUT — Full-width description + Teams tiles below
      ══════════════════════════════════════════════════════ */}
      <section style={{
        background: C.sectionBg,
        borderTop: `1px solid ${C.cardBorder}`,
        borderBottom: `1px solid ${C.cardBorder}`,
        padding: '80px 40px',
      }}>
        <div style={{ maxWidth: 1320, margin: '0 auto' }}>

          {/* ── Full-width description ── */}
          <div style={{ marginBottom: 52 }}>
            <p style={{
              fontWeight: 700, fontSize: '0.75rem',
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: C.purple500, marginBottom: 14,
            }}>THE PROGRAM</p>

            <div style={{
              display: 'flex', flexWrap: 'wrap',
              gap: 48, alignItems: 'flex-start',
            }}>
              {/* Left: heading */}
              <div style={{ flex: '1 1 320px', minWidth: 0 }}>
                <h2 style={{
                  fontWeight: 700,
                  fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
                  letterSpacing: '-0.04em', lineHeight: 1.15,
                  color: C.textDark, marginBottom: 0,
                }}>
                  Empowering Students Through Real-World Experience
                </h2>
              </div>

              {/* Right: description + checklist */}
              <div style={{ flex: '1 1 400px', minWidth: 0 }}>
                <p style={{
                  fontSize: '0.9375rem', lineHeight: 1.8,
                  color: C.textMuted, marginBottom: 24,
                }}>
                  COMSATS University's Digital Internship Management System (DIMS)
                  bridges academic learning and industry practice through structured
                  oversight and professional guidance.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {[
                    'Industry connections with 150+ partner organizations',
                    'Structured weekly reporting with supervisor verification',
                    'Faculty-led academic evaluation and mentorship',
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <div style={{
                        width: 22, height: 22, borderRadius: '50%',
                        background: C.purple50,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, marginTop: 1,
                      }}>
                        <CheckCircle size={14} color={C.purple500} />
                      </div>
                      <span style={{ fontSize: '0.9375rem', color: C.textMid, lineHeight: 1.65 }}>
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Teams feature tiles (full-width grid below) ── */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 16,
          }} className="hp-tiles-grid">
            {[
              {
                icon: <Flag size={22} />,
                title: '400+ Active Interns',
                desc: 'Students currently enrolled across diverse industry sectors in structured programs.',
                action: 'View statistics',
              },
              {
                icon: <Building2 size={22} />,
                title: '150+ Partner Firms',
                desc: 'Leading organizations collaborating with CUI to provide quality internship roles.',
                action: 'Explore partners',
              },
              {
                icon: <FileText size={22} />,
                title: '100% Digital Reports',
                desc: 'All documentation, weekly logs, and evaluations fully digitized through DIMS.',
                action: 'See how it works',
              },
              {
                icon: <GraduationCap size={22} />,
                title: 'Top Accreditations',
                desc: 'Our program is recognized by leading academic and industry accreditation bodies.',
                action: 'Learn more',
              },
            ].map((card, i) => (
              <TeamsCard key={i} {...card} onAction={() => goto('overview')} />
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          PROCESS — "Teams plan" style section
      ══════════════════════════════════════════════════════ */}
      <section id="process" style={{ padding: '80px 40px', background: C.white }}>
        <div style={{ maxWidth: 1320, margin: '0 auto' }}>
          <p style={{
            fontWeight: 600, fontSize: '0.8125rem',
            letterSpacing: '0.06em', textTransform: 'uppercase',
            color: C.purple500, marginBottom: 12,
          }}>PROCESS</p>
          <h2 style={{
            fontWeight: 700, fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
            letterSpacing: '-0.04em', lineHeight: 1.1,
            color: C.textDark, marginBottom: 48,
          }}>
            Understanding the Internship Lifecycle
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 20,
          }}>
            {[
              { step:'01', icon:<FileText size={22} />,      title:'Proposal Submission',  desc:'Submit your internship offer and company details for departmental approval.' },
              { step:'02', icon:<ClipboardCheck size={22} />, title:'Weekly Reporting',    desc:'Maintain a digital log of activities verified by your site supervisor.' },
              { step:'03', icon:<Users size={22} />,          title:'Faculty Evaluation',  desc:'Mid-term and final assessments conducted by your assigned faculty supervisor.' },
              { step:'04', icon:<GraduationCap size={22} />,  title:'Certification',       desc:'Final completion certificate issued upon successful evaluation.' },
            ].map((item, i) => (
              <ProcessCard key={i} {...item} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          ANNOUNCEMENTS — Teams medium periwinkle CTA section
      ══════════════════════════════════════════════════════ */}
      <section id="announcements" style={{
        background: 'linear-gradient(130deg, #6664b0ff 45%)',
        padding: '80px 40px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Subtle lighter glow orbs */}
        <div style={{
          position:'absolute', top:-120, right:-80, width:480, height:480,
          borderRadius:'50%',
          background:'radial-gradient(circle, rgba(255,255,255,.18) 0%, transparent 65%)',
          pointerEvents:'none',
        }} />
        <div style={{
          position:'absolute', bottom:-100, left:-60, width:360, height:360,
          borderRadius:'50%',
          background:'radial-gradient(circle, rgba(255,255,255,.12) 0%, transparent 65%)',
          pointerEvents:'none',
        }} />

        <div style={{ maxWidth: 1320, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{
            display:'flex', justifyContent:'space-between', alignItems:'flex-end',
            marginBottom:40, flexWrap:'wrap', gap:16,
          }}>
            <div>
              <p style={{
                fontWeight:700, fontSize:'0.75rem',
                letterSpacing:'0.1em', textTransform:'uppercase',
                color:'rgba(255,255,255,.85)', marginBottom:12,
              }}>LATEST UPDATES</p>
              <h2 style={{
                fontWeight:700, fontSize:'clamp(1.75rem, 4vw, 2.5rem)',
                letterSpacing:'-0.04em', lineHeight:1.1, color:'#fff',
              }}>
                University Announcements<br />& Program News
              </h2>
            </div>
            <button style={{
              display:'flex', alignItems:'center', gap:6,
              fontFamily:font, fontWeight:600, fontSize:'0.875rem',
              color:'rgba(255,255,255,.9)',
              background:'#eadede2e',
              border:'1px solid rgba(255,255,255,.35)',
              borderRadius:6, padding:'9px 18px', cursor:'pointer',
              backdropFilter: 'blur(4px)',
            }}>
              View All <ExternalLink size={14} />
            </button>
          </div>

          <div style={{
            display:'grid',
            gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))',
            gap:16,
          }}>
            {loading ? [1,2,3].map(i => (
              <div key={i} style={{
                height:240, borderRadius:12,
                background:'rgba(255,255,255,.15)',
                border:'1px solid rgba(255,255,255,.2)',
              }} />
            )) : notices.length > 0 ? notices.slice(0,3).map((n, i) => (
              <AnnouncementCard key={i} notice={n} />
            )) : (
              <div style={{
                gridColumn:'1/-1', padding:'56px 24px', textAlign:'center',
                background:'rgba(255,255,255,.15)',
                border:'1px dashed rgba(255,255,255,.3)', borderRadius:12,
                backdropFilter:'blur(4px)',
              }}>
                <Info size={36} style={{ color:'rgba(255,255,255,.6)', marginBottom:14 }} />
                <p style={{ color:'rgba(255,255,255,.8)', fontWeight:600 }}>
                  No active announcements.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          CONTACT — light lavender background (Teams app CTA style)
      ══════════════════════════════════════════════════════ */}
      <section id="contact" style={{
        background: C.sectionBg,
        borderTop: `1px solid ${C.cardBorder}`,
        padding: '80px 40px',
      }}>
        <div style={{ maxWidth: 1320, margin: '0 auto' }}>
          <p style={{
            fontWeight:600, fontSize:'0.8125rem',
            letterSpacing:'0.06em', textTransform:'uppercase',
            color:C.purple500, marginBottom:12,
          }}>CONTACT</p>
          <h2 style={{
            fontWeight:700, fontSize:'clamp(1.75rem, 3.5vw, 2.5rem)',
            letterSpacing:'-0.04em', lineHeight:1.1,
            color:C.textDark, marginBottom:48,
            textAlign:'center',
          }}>
            Need Assistance?
          </h2>

          <div style={{
            display:'grid',
            gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))',
            gap:20,
          }}>
            {/* Contact detail cards — Teams card style */}
            {[
              { icon:<Mail size={24} />,    title:'Email Us',      value:'internship.office@cuiatd.edu.pk', action:'Send Email' },
              { icon:<Phone size={24} />,   title:'Call Us',       value:'+92-992-383591-6',                  action:'Call Now'  },
              { icon:<MapPin size={24} />,  title:'Our Location',  value:'CUI Abbottabad, University Road, Tobe Camp',   action:'Get Directions' },
            ].map((item, i) => (
              <TeamsCard
                key={i}
                icon={item.icon}
                title={item.title}
                desc={item.value}
                action={item.action}
                onAction={() => {}}
              />
            ))}
          </div>

          {/* Office hours card */}
          <div style={{
            marginTop:32,
            background:C.white,
            border:`1px solid ${C.cardBorder}`,
            borderRadius:16,
            padding:'32px 40px',
            textAlign:'center',
            boxShadow:sh.s2,
          }}>
            <h3 style={{ fontWeight:700, fontSize:'1.25rem', color:C.textDark, marginBottom:8 }}>
              Internship Office Hours
            </h3>
            <p style={{ color:C.textMuted, fontSize:'1rem', marginBottom:24 }}>
              Monday – Friday &nbsp;|&nbsp; 08:30 AM – 04:30 PM
            </p>
            <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
              <TeamsBtn variant="filled" size="lg" onClick={() => navigate('/login')}>
                Access Portal <ArrowRight size={16} />
              </TeamsBtn>
              <TeamsBtn variant="outline" size="lg">
                Official Website
              </TeamsBtn>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FAQ — Microsoft Teams accordion style
      ══════════════════════════════════════════════════════ */}
      <FAQSection />

      {/* ══════════════════════════════════════════════════════
          FOOTER — Microsoft Teams multi-column style
      ══════════════════════════════════════════════════════ */}
      <MsFooter />

      {/* ─── Responsive & animation styles ─── */}
      <style>{`
        @keyframes float-a { 0%,100%{transform:translateY(0) rotate(0deg);}  50%{transform:translateY(-18px) rotate(2deg);} }
        @keyframes float-b { 0%,100%{transform:translateY(0) rotate(0deg);}  50%{transform:translateY(-12px) rotate(-3deg);} }
        @keyframes float-c { 0%,100%{transform:translateY(0);}               50%{transform:translateY(-8px);} }
        @keyframes shimmer  { 0%,100%{opacity:.5;} 50%{opacity:.9;} }

        @media (max-width: 768px) {
          .hp-nav-links   { display:none !important; }
          .hp-signin      { display:none !important; }
          .hp-hamburger   { display:flex !important; }
          .hp-hero-grid   { grid-template-columns:1fr !important; }
          .hp-hero-visual { display:none !important; }
          .hp-about-grid  { grid-template-columns:1fr !important; gap:32px !important; }
          .hp-tiles-grid  { grid-template-columns:1fr !important; }
        }
        @media (min-width: 769px) and (max-width:1100px) {
          .hp-tiles-grid  { grid-template-columns:repeat(2,1fr) !important; }
        }
        @media (min-width: 769px) {
          .hp-nav-links  { display:flex !important; }
          .hp-hamburger  { display:none !important; }
        }

        html { scroll-behavior:smooth; scroll-padding-top:114px; }

        /* Hide scrollbar on tab strip */
        .hp-tabs::-webkit-scrollbar { display:none; }

        /* Footer responsive */
        @media (max-width: 900px) {
          .hp-footer-cols { gap:20px !important; }
          .hp-footer-cols > div { flex: 1 1 180px !important; }
        }
        @media (max-width: 600px) {
          .hp-footer-cols { padding: 32px 20px 24px !important; }
          .hp-footer-cols > div { flex: 1 1 140px !important; }
          .hp-footer-bar {
            flex-direction: column !important;
            align-items: flex-start !important;
            padding: 16px 20px !important;
            gap: 14px !important;
          }
        }
      `}</style>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   HeroVisual — Teams-style abstract 3D shapes using CSS
═══════════════════════════════════════════════════════════════ */
const HeroVisual = () => (
  <div className="hp-hero-visual" style={{ position:'relative', width:460, height:460, flexShrink:0 }}>
    {/* Large background glow blob */}
    <div style={{
      position:'absolute', inset:0,
      background:'radial-gradient(ellipse at 60% 50%, rgba(93,91,212,.22) 0%, rgba(147,145,226,.12) 40%, transparent 70%)',
      borderRadius:'50%',
    }} />

    {/* Main orb — glassy sphere */}
    <div style={{
      position:'absolute', left:'28%', top:'18%',
      width:180, height:180, borderRadius:'50%',
      background:'linear-gradient(135deg, rgba(147,145,226,.85) 0%, rgba(93,91,212,.6) 50%, rgba(66,65,151,.5) 100%)',
      backdropFilter:'blur(2px)',
      boxShadow:'inset -20px -20px 40px rgba(255,255,255,.25), 0 20px 60px rgba(93,91,212,.35)',
      animation:'float-a 6s ease-in-out infinite',
    }} />

    {/* Teardrop / abstract shape */}
    <div style={{
      position:'absolute', right:'8%', top:'30%',
      width:130, height:160,
      background:'linear-gradient(160deg, rgba(120,100,220,.7) 0%, rgba(60,100,200,.5) 100%)',
      borderRadius:'50% 50% 50% 50% / 60% 60% 40% 40%',
      transform:'rotate(20deg)',
      boxShadow:'0 16px 48px rgba(93,91,212,.25)',
      animation:'float-b 7s ease-in-out infinite',
    }} />

    {/* Small glossy sphere */}
    <div style={{
      position:'absolute', left:'12%', top:'42%',
      width:100, height:100, borderRadius:'50%',
      background:'linear-gradient(120deg, rgba(180,180,240,.9) 0%, rgba(140,138,220,.6) 100%)',
      boxShadow:'inset -10px -10px 24px rgba(255,255,255,.35), 0 12px 32px rgba(93,91,212,.2)',
      animation:'float-c 5s ease-in-out infinite',
    }} />

    {/* Arrow / pointer shape */}
    <div style={{
      position:'absolute', right:'15%', bottom:'18%',
      width:90, height:90,
      background:'linear-gradient(135deg, rgba(80,80,200,.8) 0%, rgba(50,60,180,.6) 100%)',
      clipPath:'polygon(50% 0%, 100% 50%, 75% 50%, 75% 100%, 25% 100%, 25% 50%, 0% 50%)',
      animation:'float-b 8s ease-in-out infinite 1s',
      filter:'drop-shadow(0 8px 20px rgba(80,80,200,.35))',
    }} />

    {/* Shimmer ring */}
    <div style={{
      position:'absolute', left:'20%', bottom:'12%',
      width:60, height:60, borderRadius:'50%',
      border:'6px solid rgba(147,145,226,.5)',
      boxShadow:'0 0 20px rgba(93,91,212,.25)',
      animation:'shimmer 4s ease-in-out infinite',
    }} />

    {/* Plus / circle badge */}
    <div style={{
      position:'absolute', right:'6%', top:'10%',
      width:52, height:52, borderRadius:'50%',
      background:'linear-gradient(135deg, rgba(93,91,212,.9), rgba(66,65,151,.7))',
      display:'flex', alignItems:'center', justifyContent:'center',
      boxShadow:'0 8px 24px rgba(93,91,212,.35)',
      fontSize:28, color:C.white, fontWeight:300,
      animation:'float-c 5.5s ease-in-out infinite .5s',
    }}>+</div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════
   TeamsCard — exact Teams card with icon, title, desc, action btn
═══════════════════════════════════════════════════════════════ */
const TeamsCard = ({ icon, title, desc, action, onAction }) => {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? C.cardHover : C.cardBg,
        border:`1px solid ${hov ? C.purple200 : C.cardBorder}`,
        borderRadius:16,
        padding:'28px 28px 24px',
        boxShadow: hov ? sh.s3 : sh.s1,
        transition:'all 0.2s ease',
        display:'flex', flexDirection:'column', gap:16,
        cursor:'default',
      }}
    >
      {/* Icon */}
      <div style={{ color:C.purple500 }}>{icon}</div>

      {/* Title */}
      <div style={{
        fontWeight:700, fontSize:'1.0625rem',
        color:C.textDark, lineHeight:1.3,
      }}>{title}</div>

      {/* Description */}
      <div style={{
        fontWeight:400, fontSize:'0.9375rem',
        color:C.textMid, lineHeight:1.65, flex:1,
      }}>{desc}</div>

      {/* Action button — Teams style */}
      <div style={{ marginTop:8 }}>
        <CardAction onClick={onAction}>{action}</CardAction>
      </div>
    </div>
  );
};

/* ─── DashStatCard — Teams-style dashboard stat card ──────────── */
const DashStatCard = ({ val, label, color, icon, bg, stagger }) => {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: C.white,
        border: `1.5px solid ${hov ? color + '55' : C.cardBorder}`,
        borderRadius: 20,
        padding: '28px 24px 24px',
        boxShadow: hov
          ? `0 8px 32px ${color}22, 0 2px 8px rgba(0,0,0,.06)`
          : '0 1px 4px rgba(0,0,0,.06), 0 2px 8px rgba(0,0,0,.04)',
        transition: 'all 0.22s ease',
        transform: stagger
          ? `translateY(${hov ? '20px' : '24px'})`
          : `translateY(${hov ? '-5px' : '0'})`,
        cursor: 'default',
      }}
    >
      {/* Icon roundel */}
      <div style={{
        width: 40, height: 40, borderRadius: 10,
        background: bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color, marginBottom: 16,
        transition: 'background 0.2s',
      }}>
        {icon}
      </div>
      {/* Large number */}
      <div style={{
        fontWeight: 700,
        fontSize: 'clamp(1.6rem, 3vw, 2.25rem)',
        color,
        letterSpacing: '-0.05em',
        lineHeight: 1,
        marginBottom: 8,
        fontFamily: font,
      }}>{val}</div>
      {/* Label */}
      <div style={{
        fontWeight: 600,
        fontSize: '0.6875rem',
        color: C.textLight,
        textTransform: 'uppercase',
        letterSpacing: '0.09em',
      }}>{label}</div>
    </div>
  );
};

/* ─── StatCard (legacy — kept for safety) ───────────────────── */
const StatCard = ({ val, label, color, icon, offset }) => {
  return <DashStatCard val={val} label={label} color={color} icon={icon} bg={color + '18'} stagger={offset} />;
};

/* ─── ProcessCard ────────────────────────────────────────────── */
const ProcessCard = ({ step, icon, title, desc }) => {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? C.cardHover : C.white,
        border:`1px solid ${hov ? C.purple300 : C.cardBorder}`,
        borderRadius:16, padding:'28px 24px',
        boxShadow: hov ? sh.s4 : sh.s1,
        transition:'all 0.2s',
        transform: hov ? 'translateY(-4px)' : 'translateY(0)',
        position:'relative', overflow:'hidden',
      }}
    >
      {/* Watermark step number */}
      <div style={{
        position:'absolute', top:8, right:14,
        fontWeight:700, fontSize:'3.5rem', letterSpacing:'-0.05em',
        color: hov ? C.purple50 : '#f4f4ff',
        lineHeight:1, userSelect:'none', transition:'color 0.2s',
      }}>{step}</div>

      {/* Icon box */}
      <div style={{
        width:44, height:44, borderRadius:8,
        background: hov ? C.purple500 : C.purple50,
        display:'flex', alignItems:'center', justifyContent:'center',
        color: hov ? C.white : C.purple500,
        transition:'all 0.2s', marginBottom:18,
      }}>{icon}</div>

      <div style={{ fontWeight:700, fontSize:'1rem', color:C.textDark, marginBottom:8 }}>{title}</div>
      <p style={{ fontSize:'0.875rem', lineHeight:1.65, color:C.textMuted }}>{desc}</p>
    </div>
  );
};

/* ─── AnnouncementCard ───────────────────────────────────────── */
const AnnouncementCard = ({ notice }) => {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? 'rgba(255,255,255,.09)' : 'rgba(255,255,255,.05)',
        border:`1px solid ${hov ? 'rgba(255,255,255,.2)' : 'rgba(255,255,255,.1)'}`,
        borderRadius:12, padding:'24px 22px',
        transition:'all 0.2s',
        boxShadow: hov ? '0 0 32px rgba(93,91,212,.18)' : 'none',
      }}
    >
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
        <Bell size={13} color={C.purple300} />
        <span style={{
          fontWeight:600, fontSize:'0.6875rem',
          letterSpacing:'0.06em', textTransform:'uppercase',
          color:C.purple300,
        }}>
          {new Date(notice.createdAt).toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'})}
        </span>
      </div>
      <h3 style={{
        fontWeight:700, fontSize:'1rem', color:C.white, marginBottom:10,
        lineHeight:1.45,
        display:'-webkit-box', WebkitBoxOrient:'vertical', WebkitLineClamp:2, overflow:'hidden',
      }}>{notice.title}</h3>
      <p style={{
        fontSize:'0.875rem', lineHeight:1.6,
        color:'rgba(255,255,255,.5)', marginBottom:18,
        display:'-webkit-box', WebkitBoxOrient:'vertical', WebkitLineClamp:3, overflow:'hidden',
      }}>{notice.content}</p>
      <CardActionLight>Read full notice</CardActionLight>
    </div>
  );
};

/* ─── CardActionLight (for dark bg) ─────────────────────────── */
const CardActionLight = ({ children, onClick }) => {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display:'flex', alignItems:'center', gap:8,
        background:'none', border:'none', cursor:'pointer', padding:0, fontFamily:font,
      }}>
      <span style={{
        width:28, height:28, borderRadius:4,
        background: hov ? C.purple600 : C.purple500,
        display:'flex', alignItems:'center', justifyContent:'center',
        transition:'background 0.15s', flexShrink:0,
      }}><ChevronRight size={14} color={C.white} /></span>
      <span style={{
        fontWeight:600, fontSize:'0.875rem',
        color: hov ? C.purple200 : C.purple300,
        transition:'color 0.15s',
      }}>{children}</span>
    </button>
  );
};

/* ─── NavLink ──────────────────────────────────────────────── */
const NavLink = ({ children, onClick }) => {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        fontFamily:font, fontWeight:600, fontSize:'0.9375rem',
        color: hov ? C.purple500 : C.textMid,
        background: hov ? C.purple50 : 'none',
        border:'none', borderRadius:4,
        padding:'6px 14px', cursor:'pointer',
        transition:'color 0.15s, background 0.15s',
      }}>{children}</button>
  );
};

/* ─── FooterLink ─────────────────────────────────────────────── */
const FooterLink = ({ children }) => {
  const [hov, setHov] = useState(false);
  return (
    <a href="#"
      onMouseEnter={e => e.target.style.color = 'rgba(255,255,255,.75)'}
      onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,.4)'}
      style={{
        fontWeight:600, fontSize:'0.8125rem',
        color:'rgba(255,255,255,.4)',
        textDecoration:'none', transition:'color 0.15s',
      }}>{children}</a>
  );
};
/* ═══════════════════════════════════════════════════════════════
   FAQItem — single accordion row, Teams-exact style
═══════════════════════════════════════════════════════════════ */
const FAQItem = ({ index, question, answer, isOpen, onToggle }) => {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ borderBottom: `1px solid ${C.cardBorder}` }}
    >
      {/* Row */}
      <div
        onClick={onToggle}
        style={{
          display: 'flex', alignItems: 'center', gap: 28,
          padding: '22px 0',
          cursor: 'pointer',
          background: hov && !isOpen ? 'rgba(93,91,212,.03)' : 'transparent',
          transition: 'background 0.15s',
          borderRadius: 8,
        }}
      >
        {/* Index number */}
        <span style={{
          fontFamily: font, fontWeight: 700,
          fontSize: '0.9375rem', color: C.purple500,
          minWidth: 44, flexShrink: 0,
          letterSpacing: '0.02em',
        }}>
          {String(index).padStart(2, '0')}/
        </span>

        {/* Question */}
        <span style={{
          flex: 1,
          fontFamily: font, fontWeight: isOpen ? 600 : 500,
          fontSize: '1rem',
          color: isOpen ? C.purple600 : C.textDark,
          lineHeight: 1.5,
          transition: 'color 0.15s',
        }}>
          {question}
        </span>

        {/* Toggle button — rounded square, purple fill */}
        <button
          onClick={e => { e.stopPropagation(); onToggle(); }}
          style={{
            width: 38, height: 38, borderRadius: 8, flexShrink: 0,
            background: isOpen ? C.purple500 : C.purple50,
            border: `1.5px solid ${isOpen ? C.purple500 : C.purple200}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            color: isOpen ? C.white : C.purple500,
            transition: 'all 0.2s ease',
            transform: isOpen ? 'rotate(0deg)' : 'rotate(0deg)',
          }}
          aria-label={isOpen ? 'Collapse' : 'Expand'}
        >
          {isOpen
            ? <Minus size={16} strokeWidth={2.5} />
            : <Plus  size={16} strokeWidth={2.5} />
          }
        </button>
      </div>

      {/* Answer — smooth height animation via max-height trick */}
      <div style={{
        overflow: 'hidden',
        maxHeight: isOpen ? 300 : 0,
        opacity: isOpen ? 1 : 0,
        transition: 'max-height 0.32s ease, opacity 0.22s ease',
      }}>
        <p style={{
          fontFamily: font,
          fontSize: '0.9375rem', lineHeight: 1.8,
          color: C.textMuted,
          paddingLeft: 72, paddingBottom: 22, paddingRight: 8,
        }}>
          {answer}
        </p>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   FAQSection — full-width Teams-style FAQ with expand/collapse all
═══════════════════════════════════════════════════════════════ */
const FAQ_DATA = [
  {
    q: 'How do I submit my internship proposal?',
    a: 'Log in to the portal, navigate to Proposals, and fill in your company details, supervisor information, and internship description. Your coordinator will review and approve it within 3–5 working days.',
  },
  {
    q: 'What is the weekly reporting process?',
    a: 'Every week you must submit a digital activity log through the portal. Your site supervisor reviews and signs off the log, and your faculty supervisor monitors progress in real time.',
  },
  {
    q: 'How are faculty supervisors assigned?',
    a: 'Faculty supervisors are assigned by the Internship Coordinator based on your department and area of study. You can view your assigned supervisor on your dashboard after proposal approval.',
  },
  {
    q: 'When are mid-term and final evaluations conducted?',
    a: 'Mid-term evaluations are conducted at the halfway point of your internship duration, and final evaluations are held in the last week. Both are conducted by your assigned faculty supervisor.',
  },
  {
    q: 'How do I obtain my internship completion certificate?',
    a: 'After your final evaluation is approved and all weekly reports are submitted, a digital certificate is automatically generated and available for download from your portal dashboard.',
  },
  {
    q: 'Can I change my internship company after submission?',
    a: 'Changes are only allowed before proposal approval. Once approved, you must request a change through your department coordinator with a valid reason and supporting documentation.',
  },
  {
    q: 'What happens if I miss a weekly report submission?',
    a: 'Missed reports affect your internship grade. You must contact your faculty supervisor immediately to explain the reason. Late submissions may be accepted with a penalty at the supervisor\'s discretion.',
  },
];

const FAQSection = () => {
  const total = FAQ_DATA.length;
  const [openMap, setOpenMap] = useState({});

  const toggle = (i) =>
    setOpenMap(prev => ({ ...prev, [i]: !prev[i] }));

  const expandAll  = () => {
    const all = {};
    FAQ_DATA.forEach((_, i) => { all[i] = true; });
    setOpenMap(all);
  };
  const collapseAll = () => setOpenMap({});

  const anyOpen = Object.values(openMap).some(Boolean);
  const allOpen = Object.values(openMap).filter(Boolean).length === total;

  return (
    <section style={{
      background: C.white,
      borderTop: `1px solid ${C.cardBorder}`,
      padding: '80px 40px',
    }}>
      <div style={{ maxWidth: 1320, margin: '0 auto' }}>

        {/* Header row */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', flexWrap: 'wrap',
          gap: 20, marginBottom: 40,
        }}>
          <h2 style={{
            fontFamily: font,
            fontWeight: 700,
            fontSize: 'clamp(1.6rem, 3.5vw, 2.5rem)',
            letterSpacing: '-0.04em', lineHeight: 1.1,
            color: C.textDark, margin: 0,
          }}>
            Frequently asked questions
          </h2>

          {/* Expand / Collapse buttons */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={expandAll}
              style={{
                fontFamily: font, fontWeight: 600, fontSize: '0.875rem',
                color: C.purple500,
                background: 'transparent',
                border: `1.5px solid ${C.purple500}`,
                borderRadius: 6, padding: '9px 20px',
                cursor: 'pointer', transition: 'all 0.15s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = C.purple50;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              Expand all
            </button>
            <button
              onClick={collapseAll}
              style={{
                fontFamily: font, fontWeight: 600, fontSize: '0.875rem',
                color: C.textMuted,
                background: 'transparent',
                border: `1.5px solid ${C.cardBorder}`,
                borderRadius: 6, padding: '9px 20px',
                cursor: 'pointer', transition: 'all 0.15s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = C.sectionBg;
                e.currentTarget.style.borderColor = C.purple200;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = C.cardBorder;
              }}
            >
              Collapse all
            </button>
          </div>
        </div>

        {/* Top divider */}
        <div style={{ borderTop: `1px solid ${C.cardBorder}` }} />

        {/* FAQ list */}
        {FAQ_DATA.map((item, i) => (
          <FAQItem
            key={i}
            index={i + 1}
            question={item.q}
            answer={item.a}
            isOpen={!!openMap[i]}
            onToggle={() => toggle(i)}
          />
        ))}
      </div>
    </section>
  );
};

/* ═══════════════════════════════════════════════════════════════
   MsFooter — Microsoft Teams multi-column footer
═══════════════════════════════════════════════════════════════ */

const FOOTER_COLS = [
  {
    heading: "What's New",
    links: [
      "Portal Updates",
      "New Features",
      "Announcement Board",
      "Internship Guidelines 2026",
      "Digital Report System",
      "Mobile Access",
    ],
  },
  {
    heading: "Internship Portal",
    links: [
      "Student Login",
      "Faculty Login",
      "Office Login",
      "Submit Proposal",
      "Weekly Reports",
      "Dashboard",
    ],
  },
  {
    heading: "Student Resources",
    links: [
      "Internship Handbook",
      "Report Templates",
      "FAQ",
      "Evaluation Criteria",
      "Certificate Guide",
      "Contact Support",
    ],
  },
  {
    heading: "Partner Companies",
    links: [
      "Join as Partner",
      "Company Directory",
      "Post Internship",
      "Supervisor Portal",
      "Partnership Policy",
    ],
  },
  {
    heading: "Developer & IT",
    links: [
      "API Documentation",
      "System Status",
      "IT Support",
      "Accessibility",
      "Security Policy",
    ],
  },
  {
    heading: "About CUI",
    links: [
      "About COMSATS",
      "Internship Program",
      "Faculty Directory",
      "Research & Innovation",
      "Alumni Network",
      "Careers",
    ],
  },
];

const FCol = ({ heading, links }) => (
  <div style={{ flex: '1 1 130px', minWidth: 0 }}>
    <p style={{
      fontFamily: font, fontWeight: 700,
      fontSize: '0.8125rem', color: '#1a1a2e',
      marginBottom: 14, lineHeight: 1.4,
    }}>
      {heading}
    </p>
    <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
      {links.map(l => (
        <li key={l}>
          <a
            href="#"
            style={{
              fontFamily: font, fontWeight: 400,
              fontSize: '0.8125rem', color: '#3d3c6e',
              textDecoration: 'none',
              transition: 'color 0.12s',
            }}
            onMouseEnter={e => e.target.style.color = '#5d5bd4'}
            onMouseLeave={e => e.target.style.color = '#3d3c6e'}
          >
            {l}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

const MsFooter = () => (
  <footer style={{
    background: '#f2f2f2',
    borderTop: '1px solid #e0dff5',
    fontFamily: font,
  }}>
    {/* Main columns area */}
    <div style={{
      maxWidth: 1320, margin: '0 auto',
      padding: '48px 40px 40px',
      display: 'flex', flexWrap: 'wrap', gap: 28,
    }} className="hp-footer-cols">
      {FOOTER_COLS.map(col => (
        <FCol key={col.heading} {...col} />
      ))}
    </div>

    {/* Divider */}
    <div style={{ borderTop: '1px solid #dddce8', margin: '0 40px' }} />

    {/* Bottom bar */}
    <div style={{
      maxWidth: 1320, margin: '0 auto',
      padding: '18px 40px',
      display: 'flex', flexWrap: 'wrap', alignItems: 'center',
      gap: 12, justifyContent: 'space-between',
    }} className="hp-footer-bar">
      {/* Left: globe + language */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5d5bd4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        <a href="#" style={{
          fontSize: '0.8125rem', fontWeight: 500,
          color: '#3d3c6e', textDecoration: 'none',
          transition: 'color 0.12s',
        }}
          onMouseEnter={e => e.target.style.color = '#5d5bd4'}
          onMouseLeave={e => e.target.style.color = '#3d3c6e'}
        >
          English (Pakistan)
        </a>
      </div>

      {/* Center: policy links */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
        {[
          'Sitemap', 'Contact Support', 'Privacy', 'Terms of Use',
          'Trademarks', 'Safety & Policy', 'Accessibility', 'About DIMS',
        ].map((l, i, arr) => (
          <React.Fragment key={l}>
            <a
              href="#"
              style={{
                fontSize: '0.75rem', fontWeight: 500,
                color: '#6c6c8a', textDecoration: 'none',
                transition: 'color 0.12s',
              }}
              onMouseEnter={e => e.target.style.color = '#5d5bd4'}
              onMouseLeave={e => e.target.style.color = '#6c6c8a'}
            >
              {l}
            </a>
            {i < arr.length - 1 && (
              <span style={{ color: '#c8c7e0', fontSize: '0.75rem' }}>|</span>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Right: copyright */}
      <span style={{ fontSize: '0.75rem', color: '#9a9ab5', fontWeight: 400 }}>
        © 2026 COMSATS University Abbottabad
      </span>
    </div>
  </footer>
);

export default HomePage;
