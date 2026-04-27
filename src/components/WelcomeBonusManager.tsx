import React, { useEffect, useState, useRef, useCallback } from 'react';
import api from '@/api';
import coinSvg from '@/assets/coin.svg';

const WELCOME_BONUS_AMOUNT = import.meta.env.VITE_COIN_WELCOME_BONUS ?? '0';

// ── Coin particle type ─────────────────────────────────────────────────────────
interface CoinParticle {
    id: number;
    x: number;
    delay: number;
    duration: number;
    size: number;
}

// ── Burst coin particle type ───────────────────────────────────────────────────
interface BurstCoin {
    id: number;
    angle: number;
    distance: number;
    size: number;
    delay: number;
    duration: number;
    rotations: number;
}

function generateCoins(count: number): CoinParticle[] {
    return Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 1.4,
        duration: 1.8 + Math.random() * 1.6,
        size: 18 + Math.random() * 16,
    }));
}

function generateBurstCoins(count: number): BurstCoin[] {
    return Array.from({ length: count }, (_, i) => ({
        id: i,
        angle: (360 / count) * i + (Math.random() - 0.5) * 20,
        distance: 90 + Math.random() * 90,
        size: 14 + Math.random() * 18,
        delay: Math.random() * 0.18,
        duration: 0.7 + Math.random() * 0.5,
        rotations: 2 + Math.random() * 4,
    }));
}

// ── Welcome Bonus Modal ────────────────────────────────────────────────────────
function WelcomeBonusModal({
    name,
    onClaim,
    onDismiss,
}: {
    name: string;
    onClaim: () => Promise<void>;
    onDismiss: () => void;
}) {
    const [coins] = useState(() => generateCoins(40));
    const [burstCoins] = useState(() => generateBurstCoins(22));
    const [claiming, setClaiming] = useState(false);
    const [claimed, setClaimed] = useState(false);

    const handleClaim = async () => {
        setClaiming(true);
        try {
            await onClaim();
            setClaimed(true);
        } catch {
            setClaimed(true);
        } finally {
            setClaiming(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'radial-gradient(ellipse at 50% 40%, rgba(20,10,60,0.85) 0%, rgba(0,0,0,0.92) 100%)',
                    backdropFilter: 'blur(8px)',
                    animation: 'backdropIn 0.4s ease forwards',
                }}
                onClick={onDismiss}
            />

            {/* Ambient light beams */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(6)].map((_, i) => (
                    <div key={i} style={{
                        position: 'absolute',
                        top: '30%',
                        left: '50%',
                        width: '2px',
                        height: '55vh',
                        background: `linear-gradient(to bottom, rgba(255,200,0,${0.12 + i * 0.03}), transparent)`,
                        transformOrigin: 'top center',
                        transform: `translateX(-50%) rotate(${-60 + i * 24}deg)`,
                        animation: `beamPulse ${2.5 + i * 0.4}s ease-in-out infinite alternate`,
                    }} />
                ))}
            </div>

            {/* Falling coin rain */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {coins.map((coin) => (
                    <div
                        key={coin.id}
                        style={{
                            position: 'absolute',
                            left: `${coin.x}%`,
                            top: '-60px',
                            width: `${coin.size}px`,
                            height: `${coin.size}px`,
                            animation: `coinFall ${coin.duration}s ${coin.delay}s ease-in infinite`,
                            filter: 'drop-shadow(0 2px 8px rgba(255,180,0,0.6))',
                        }}
                    >
                        <img src={coinSvg} alt="coin" style={{ width: '100%', height: '100%' }} />
                    </div>
                ))}
            </div>

            {/* Modal card */}
            <div
                className="relative z-10 w-full max-w-sm overflow-visible"
                style={{ animation: 'modalPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' }}
            >
                {/* ── COIN BURST SPLASH ── */}
                <div
                    className="absolute pointer-events-none"
                    style={{ top: '-10px', left: '50%', transform: 'translateX(-50%)', width: 0, height: 0 }}
                >
                    {burstCoins.map((c) => {
                        const rad = (c.angle * Math.PI) / 180;
                        const tx = Math.cos(rad) * c.distance;
                        const ty = Math.sin(rad) * c.distance;
                        return (
                            <div
                                key={c.id}
                                style={{
                                    position: 'absolute',
                                    width: `${c.size}px`,
                                    height: `${c.size}px`,
                                    left: `-${c.size / 2}px`,
                                    top: `-${c.size / 2}px`,
                                    animation: `burstCoin ${c.duration}s ${c.delay}s cubic-bezier(0.2, 0.8, 0.4, 1) both`,
                                    '--tx': `${tx}px`,
                                    '--ty': `${ty}px`,
                                    '--rot': `${c.rotations * 360}deg`,
                                    filter: 'drop-shadow(0 2px 6px rgba(255,200,0,0.7))',
                                } as React.CSSProperties}
                            >
                                <img src={coinSvg} alt="" style={{ width: '100%', height: '100%' }} />
                            </div>
                        );
                    })}

                    {/* Central flash ring */}
                    <div style={{
                        position: 'absolute',
                        width: '80px', height: '80px',
                        left: '-40px', top: '-40px',
                        borderRadius: '50%',
                        border: '3px solid rgba(255,215,0,0.9)',
                        animation: 'burstRing 0.6s 0.05s ease-out both',
                    }} />
                    <div style={{
                        position: 'absolute',
                        width: '140px', height: '140px',
                        left: '-70px', top: '-70px',
                        borderRadius: '50%',
                        border: '2px solid rgba(255,215,0,0.45)',
                        animation: 'burstRing 0.7s 0.12s ease-out both',
                    }} />
                </div>

                {/* Card body */}
                <div
                    style={{
                        borderRadius: '28px',
                        overflow: 'hidden',
                        background: 'linear-gradient(160deg, #0d0d1a 0%, #111128 50%, #0a0a1f 100%)',
                        border: '1px solid rgba(255,215,0,0.2)',
                        boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 30px 80px rgba(0,0,0,0.7), 0 0 60px rgba(255,180,0,0.12)',
                        position: 'relative',
                    }}
                >
                    {/* Top shimmer strip */}
                    <div style={{
                        height: '3px',
                        background: 'linear-gradient(90deg, transparent, #FFD700 30%, #FF8C00 60%, transparent)',
                        animation: 'stripSlide 2s linear infinite',
                        backgroundSize: '200% 100%',
                    }} />

                    {/* Radial glow top */}
                    <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0, height: '200px',
                        background: 'radial-gradient(ellipse at 50% -10%, rgba(255,200,0,0.14) 0%, transparent 70%)',
                        pointerEvents: 'none',
                    }} />

                    {/* Hero section */}
                    <div style={{ padding: '36px 28px 24px', textAlign: 'center', position: 'relative' }}>
                        {/* Big coin pulse */}
                        <div style={{
                            width: '88px', height: '88px',
                            margin: '0 auto 20px',
                            position: 'relative',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            {/* Halo rings */}
                            <div style={{
                                position: 'absolute', inset: '-16px',
                                borderRadius: '50%',
                                border: '2px solid rgba(255,215,0,0.15)',
                                animation: 'haloExpand 2s ease-out infinite',
                            }} />
                            <div style={{
                                position: 'absolute', inset: '-8px',
                                borderRadius: '50%',
                                border: '2px solid rgba(255,215,0,0.25)',
                                animation: 'haloExpand 2s 0.5s ease-out infinite',
                            }} />
                            {/* Glow bg */}
                            <div style={{
                                position: 'absolute', inset: 0, borderRadius: '50%',
                                background: 'radial-gradient(circle, rgba(255,200,0,0.3) 0%, transparent 70%)',
                                animation: 'glowPulse 2s ease-in-out infinite alternate',
                            }} />
                            <img
                                src={coinSvg}
                                alt="coin"
                                style={{
                                    width: '72px', height: '72px',
                                    animation: 'coinFloat 3s ease-in-out infinite, coinSpin3d 4s linear infinite',
                                    filter: 'drop-shadow(0 4px 20px rgba(255,180,0,0.7))',
                                    position: 'relative', zIndex: 1,
                                }}
                            />
                        </div>

                        {/* Headline */}
                        <div style={{
                            fontSize: '11px',
                            fontFamily: '"Space Mono", monospace',
                            letterSpacing: '4px',
                            textTransform: 'uppercase',
                            color: 'rgba(255,215,0,0.6)',
                            marginBottom: '8px',
                        }}>
                            🎉 Special Reward
                        </div>
                        <h2 style={{
                            fontSize: '32px',
                            fontWeight: 900,
                            fontFamily: '"Clash Display", "Syne", sans-serif',
                            background: 'linear-gradient(135deg, #FFE566 0%, #FFB020 40%, #FF6B00 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            lineHeight: 1.1,
                            marginBottom: '10px',
                            letterSpacing: '-1px',
                        }}>
                            Welcome Bonus!
                        </h2>
                        <p style={{
                            color: 'rgba(255,255,255,0.5)',
                            fontSize: '14px',
                            fontFamily: '"DM Sans", sans-serif',
                            lineHeight: 1.6,
                        }}>
                            Hey <span style={{ color: '#FFD700', fontWeight: 700 }}>{name}</span> 👋<br />
                            You've unlocked a special reward for joining.
                        </p>
                    </div>

                    {/* Divider */}
                    <div style={{
                        margin: '0 28px',
                        height: '1px',
                        background: 'linear-gradient(90deg, transparent, rgba(255,215,0,0.15), transparent)',
                    }} />

                    {/* Reward badge */}
                    <div style={{ padding: '20px 28px' }}>
                        <div style={{
                            borderRadius: '20px',
                            padding: '16px 20px',
                            background: 'linear-gradient(135deg, rgba(255,215,0,0.07) 0%, rgba(255,120,0,0.05) 100%)',
                            border: '1px solid rgba(255,215,0,0.15)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                            position: 'relative',
                            overflow: 'hidden',
                        }}>
                            {/* Scan line */}
                            <div style={{
                                position: 'absolute', top: 0, left: '-100%', right: 0, bottom: 0,
                                background: 'linear-gradient(90deg, transparent, rgba(255,215,0,0.06), transparent)',
                                animation: 'scanLine 2.5s ease-in-out infinite',
                            }} />
                            <div style={{ flexShrink: 0 }}>
                                <img src={coinSvg} alt="coin" style={{
                                    width: '40px', height: '40px',
                                    animation: 'coinSpin3d 3s linear infinite',
                                    filter: 'drop-shadow(0 0 10px rgba(255,180,0,0.5))',
                                }} />
                            </div>
                            <div>
                                <div style={{
                                    fontSize: '26px',
                                    fontWeight: 900,
                                    fontFamily: '"Syne", sans-serif',
                                    background: 'linear-gradient(90deg, #FFE566, #FF8C00)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    lineHeight: 1,
                                }}>
                                    {WELCOME_BONUS_AMOUNT} Credits
                                </div>
                                <div style={{
                                    color: 'rgba(255,255,255,0.35)',
                                    fontSize: '11px',
                                    marginTop: '4px',
                                    fontFamily: '"DM Sans", sans-serif',
                                    letterSpacing: '0.3px',
                                }}>
                                    Instantly credited • No expiry
                                </div>
                            </div>
                            {/* Corner accent */}
                            <div style={{
                                position: 'absolute', top: '8px', right: '12px',
                                fontSize: '20px', opacity: 0.3,
                                animation: 'sparkle 2s ease-in-out infinite alternate',
                            }}>✦</div>
                        </div>
                    </div>

                    {/* Action area */}
                    <div style={{ padding: '0 28px 28px' }}>
                        {/* Claim button */}
                        <button
                            onClick={handleClaim}
                            disabled={claiming || claimed}
                            style={{
                                width: '100%',
                                padding: '16px',
                                borderRadius: '18px',
                                fontWeight: 800,
                                fontSize: '15px',
                                fontFamily: '"Syne", sans-serif',
                                letterSpacing: '0.5px',
                                border: 'none',
                                cursor: claiming || claimed ? 'default' : 'pointer',
                                position: 'relative',
                                overflow: 'hidden',
                                background: claimed
                                    ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                                    : claiming
                                        ? 'linear-gradient(135deg, #b8900a, #c05a00)'
                                        : 'linear-gradient(135deg, #FFE566 0%, #FFB020 50%, #FF6B00 100%)',
                                color: claimed ? '#fff' : '#0a0a0a',
                                boxShadow: claimed
                                    ? '0 4px 24px rgba(34,197,94,0.4)'
                                    : '0 4px 30px rgba(255,160,0,0.45), 0 0 0 1px rgba(255,220,0,0.2)',
                                transition: 'transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease',
                                transform: claiming ? 'scale(0.97)' : 'scale(1)',
                            }}
                            onMouseEnter={(e) => {
                                if (!claiming && !claimed) {
                                    e.currentTarget.style.transform = 'scale(1.02)';
                                    e.currentTarget.style.boxShadow = '0 8px 40px rgba(255,160,0,0.6), 0 0 0 1px rgba(255,220,0,0.3)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!claiming && !claimed) {
                                    e.currentTarget.style.transform = 'scale(1)';
                                    e.currentTarget.style.boxShadow = '0 4px 30px rgba(255,160,0,0.45), 0 0 0 1px rgba(255,220,0,0.2)';
                                }
                            }}
                        >
                            {/* Button shimmer sweep */}
                            {!claimed && !claiming && (
                                <div style={{
                                    position: 'absolute', top: 0, left: '-100%', width: '60%', height: '100%',
                                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)',
                                    animation: 'btnShimmer 2.5s ease-in-out infinite',
                                    pointerEvents: 'none',
                                }} />
                            )}
                            {claiming ? (
                                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'rgba(255,255,255,0.7)' }}>
                                    <svg style={{ width: 16, height: 16, animation: 'spin 0.8s linear infinite' }} viewBox="0 0 24 24" fill="none">
                                        <circle opacity="0.25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path opacity="0.75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Claiming…
                                </span>
                            ) : claimed ? (
                                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    ✅ Claimed! Enjoy your credits 🎊
                                </span>
                            ) : (
                                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    <img src={coinSvg} alt="" style={{ width: 18, height: 18, animation: 'coinSpin3d 2s linear infinite' }} />
                                    Claim Your Bonus
                                </span>
                            )}
                        </button>

                        {/* Dismiss */}
                        {!claimed && (
                            <button
                                onClick={onDismiss}
                                style={{
                                    marginTop: '14px',
                                    width: '100%',
                                    fontSize: '12px',
                                    color: 'rgba(255,255,255,0.22)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontFamily: '"DM Sans", sans-serif',
                                    transition: 'color 0.15s',
                                    letterSpacing: '0.3px',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
                                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.22)')}
                            >
                                Remind me later
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Global keyframes */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600&family=Space+Mono:wght@700&display=swap');

                @keyframes backdropIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
                @keyframes coinFall {
                    0%   { transform: translateY(-60px) rotate(0deg); opacity: 0.9; }
                    85%  { opacity: 0.8; }
                    100% { transform: translateY(105vh) rotate(540deg); opacity: 0; }
                }
                @keyframes burstCoin {
                    0%   { transform: translate(0, 0) rotate(0deg) scale(0.3); opacity: 1; }
                    60%  { opacity: 1; }
                    100% { transform: translate(var(--tx), var(--ty)) rotate(var(--rot)) scale(0.6); opacity: 0; }
                }
                @keyframes burstRing {
                    0%   { transform: scale(0.2); opacity: 0.9; }
                    100% { transform: scale(4);   opacity: 0; }
                }
                @keyframes modalPop {
                    from { opacity: 0; transform: scale(0.7) translateY(30px); }
                    to   { opacity: 1; transform: scale(1) translateY(0); }
                }
                @keyframes coinSpin3d {
                    0%   { transform: rotateY(0deg); }
                    100% { transform: rotateY(360deg); }
                }
                @keyframes coinFloat {
                    0%, 100% { transform: translateY(0px); }
                    50%       { transform: translateY(-8px); }
                }
                @keyframes haloExpand {
                    0%   { opacity: 0.8; transform: scale(0.8); }
                    100% { opacity: 0;   transform: scale(1.6); }
                }
                @keyframes glowPulse {
                    from { opacity: 0.5; transform: scale(0.9); }
                    to   { opacity: 1;   transform: scale(1.1); }
                }
                @keyframes beamPulse {
                    from { opacity: 0.3; }
                    to   { opacity: 1; }
                }
                @keyframes scanLine {
                    0%   { left: -100%; }
                    100% { left: 200%; }
                }
                @keyframes stripSlide {
                    0%   { background-position: 0% 0%; }
                    100% { background-position: 200% 0%; }
                }
                @keyframes btnShimmer {
                    0%   { left: -100%; }
                    60%, 100% { left: 200%; }
                }
                @keyframes sparkle {
                    from { opacity: 0.2; transform: scale(0.8) rotate(-15deg); }
                    to   { opacity: 0.6; transform: scale(1.3) rotate(15deg); }
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to   { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}

// ── Snooze helpers ─────────────────────────────────────────────────────────────
const WELCOME_BONUS_SNOOZE_KEY = 'welcome_bonus_snoozed_until';
const SNOOZE_MS = 5 * 60 * 1000; // 5 minutes

export default function WelcomeBonusManager() {
    const [showWelcomeBonus, setShowWelcomeBonus] = useState(false);
    const snoozeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [profileData, setProfileData] = useState<any>(null);

    const isSnoozed = () => {
        const val = localStorage.getItem(WELCOME_BONUS_SNOOZE_KEY);
        return !!val && Date.now() < parseInt(val, 10);
    };

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const userData = JSON.parse(localStorage.getItem('user') || 'null');
                const token = userData?.token;
                if (!token) return;

                const resp = await api.get('/personal-details/profile-data', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = resp?.data ?? resp;
                if (data) setProfileData(data);
            } catch (err) {
                console.warn('Failed to load profile data for welcome bonus', err);
            }
        };
        loadProfile();
    }, []);

    useEffect(() => {
        if (!profileData) return;
        if (!profileData.isWelcomeBonusRedeemed && !isSnoozed()) {
            setShowWelcomeBonus(true);
        }
    }, [profileData]);

    const handleDismissBonus = useCallback(() => {
        setShowWelcomeBonus(false);
        localStorage.setItem(WELCOME_BONUS_SNOOZE_KEY, String(Date.now() + SNOOZE_MS));

        if (snoozeTimerRef.current) clearTimeout(snoozeTimerRef.current);
        snoozeTimerRef.current = setTimeout(() => {
            setProfileData((prev: any) => {
                if (prev && !prev.isWelcomeBonusRedeemed) {
                    setShowWelcomeBonus(true);
                }
                return prev;
            });
        }, SNOOZE_MS);
    }, []);

    const handleClaimBonus = useCallback(async () => {
        setShowWelcomeBonus(false);
        const userData = JSON.parse(localStorage.getItem('user') || 'null');
        const userId = userData?.user_id;
        const token = userData?.token;
        try {
            await api.post(`/users/${userId}/claim-welcome-bonus`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            window.location.reload();
        } catch (err) {
            console.error('Failed to claim bonus', err);
        }
        localStorage.removeItem(WELCOME_BONUS_SNOOZE_KEY);
        if (snoozeTimerRef.current) clearTimeout(snoozeTimerRef.current);
        window.dispatchEvent(new CustomEvent('credits:refresh'));
    }, []);

    useEffect(() => () => { if (snoozeTimerRef.current) clearTimeout(snoozeTimerRef.current); }, []);

    if (!showWelcomeBonus || !profileData) return null;

    return (
        <WelcomeBonusModal
            name={profileData.name?.first_name || 'User'}
            onClaim={handleClaimBonus}
            onDismiss={handleDismissBonus}
        />
    );
}