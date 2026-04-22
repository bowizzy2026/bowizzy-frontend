import { Menu, Plus, Ticket, Share2, CalendarDays, FileText, Copy, Check } from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';
import { useEffect, useState, useRef, useCallback } from 'react';
import api from '@/api';
import { getResumeTemplates } from '@/services/resumeServices';
import coinSvg from '@/assets/coin.svg';

const WELCOME_BONUS_AMOUNT = import.meta.env.VITE_COIN_WELCOME_BONUS ?? '0';

interface ProfileData {
    name: {
        first_name: string;
        middle_name?: string;
        last_name: string;
    };
    image?: string;
    isWelcomeBonusRedeemed?: boolean;
    credits?: number;
    coupon_code?: string;
}

// ── Coin particle type ─────────────────────────────────────────────────────────
interface CoinParticle {
    id: number;
    x: number;
    delay: number;
    duration: number;
    size: number;
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
    const [coins] = useState(() => generateCoins(50));
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
                className="absolute inset-0 bg-black/55"
                style={{ backdropFilter: 'blur(6px)' }}
                onClick={onDismiss}
            />

            {/* Coin rain */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {coins.map((coin) => (
                    <div
                        key={coin.id}
                        style={{
                            position: 'absolute',
                            left: `${coin.x}%`,
                            top: '-50px',
                            width: `${coin.size}px`,
                            height: `${coin.size}px`,
                            animation: `coinFall ${coin.duration}s ${coin.delay}s ease-in infinite`,
                            filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.4))',
                        }}
                    >
                        <img src={coinSvg} alt="coin" style={{ width: '100%', height: '100%' }} />
                    </div>
                ))}
            </div>

            {/* Modal card */}
            <div
                className="relative z-10 w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl"
                style={{
                    background: 'linear-gradient(155deg, #1a1a2e 0%, #16213e 45%, #0f3460 100%)',
                    border: '1px solid rgba(255,215,0,0.25)',
                    animation: 'modalPop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
                }}
            >
                {/* Top radial glow */}
                <div
                    className="absolute top-0 left-0 right-0 h-40 pointer-events-none"
                    style={{
                        background: 'radial-gradient(ellipse at 50% 0%, rgba(255,215,0,0.18) 0%, transparent 70%)',
                    }}
                />

                {/* Party popper */}
                <div className="relative flex justify-center items-center pt-8 pb-1">
                    <span
                        style={{
                            fontSize: '72px',
                            display: 'block',
                            animation: 'popperBounce 0.5s 0.15s cubic-bezier(0.34, 1.56, 0.64, 1) both',
                            filter: 'drop-shadow(0 4px 20px rgba(255,200,0,0.5))',
                            lineHeight: 1,
                        }}
                    >
                        🎉
                    </span>
                    {[
                        { e: '✨', t: '10px', l: '22%', d: '0.3s' },
                        { e: '⭐', t: '28px', l: '14%', d: '0.45s' },
                        { e: '💫', t: '8px',  l: '68%', d: '0.6s' },
                        { e: '✨', t: '32px', l: '74%', d: '0.2s' },
                    ].map((s, i) => (
                        <span
                            key={i}
                            style={{
                                position: 'absolute',
                                fontSize: '18px',
                                top: s.t,
                                left: s.l,
                                animation: `sparkle 1.4s ${s.d} ease-in-out infinite alternate`,
                            }}
                        >
                            {s.e}
                        </span>
                    ))}
                </div>

                {/* Content */}
                <div className="px-6 pb-7 pt-2 text-center">
                    <h2
                        style={{
                            fontSize: '26px',
                            fontWeight: 900,
                            fontFamily: '"Syne", sans-serif',
                            background: 'linear-gradient(90deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
                            backgroundSize: '200% auto',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            animation: 'shimmer 2.5s linear infinite',
                            letterSpacing: '-0.5px',
                            marginBottom: '6px',
                        }}
                    >
                        Welcome Bonus!
                    </h2>

                    <p
                        className="text-sm mb-5"
                        style={{ color: 'rgba(255,255,255,0.65)', fontFamily: '"DM Sans", sans-serif' }}
                    >
                        Hey{' '}
                        <span style={{ color: '#FCD34D', fontWeight: 600 }}>{name}</span>
                        , you've earned a special reward for joining us 🎁
                    </p>

                    {/* Coin badge */}
                    <div
                        className="rounded-2xl p-4 mb-5 flex items-center justify-center gap-3"
                        style={{
                            background: 'rgba(255,215,0,0.07)',
                            border: '1px solid rgba(255,215,0,0.18)',
                        }}
                    >
                        <div
                            style={{
                                width: '44px',
                                height: '44px',
                                animation: 'coinSpin 3s linear infinite',
                                flexShrink: 0,
                                filter: 'drop-shadow(0 2px 8px rgba(255,180,0,0.5))',
                            }}
                        >
                            <img src={coinSvg} alt="coin" style={{ width: '100%', height: '100%' }} />
                        </div>
                        <div className="text-left">
                            <div
                                style={{
                                    fontSize: '22px',
                                    fontWeight: 900,
                                    fontFamily: '"Syne", sans-serif',
                                    background: 'linear-gradient(90deg, #FFD700, #FFA500)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    lineHeight: 1.1,
                                }}
                            >
                                {WELCOME_BONUS_AMOUNT} Credits
                            </div>
                            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginTop: '2px' }}>
                                Credited to your account instantly
                            </div>
                        </div>
                    </div>

                    {/* Claim button */}
                    <button
                        onClick={handleClaim}
                        disabled={claiming || claimed}
                        style={{
                            width: '100%',
                            padding: '14px',
                            borderRadius: '16px',
                            fontWeight: 700,
                            fontSize: '15px',
                            fontFamily: '"Syne", sans-serif',
                            letterSpacing: '0.4px',
                            border: 'none',
                            cursor: claiming || claimed ? 'default' : 'pointer',
                            background: claimed
                                ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                                : 'linear-gradient(135deg, #FFD700 0%, #F97316 100%)',
                            color: claimed ? '#fff' : '#1a1a2e',
                            boxShadow: claimed
                                ? '0 4px 20px rgba(34,197,94,0.35)'
                                : '0 4px 28px rgba(251,191,36,0.45)',
                            transform: claiming ? 'scale(0.97)' : 'scale(1)',
                            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                        }}
                    >
                        {claiming ? (
                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                <svg
                                    style={{ width: 16, height: 16, animation: 'spin 0.8s linear infinite' }}
                                    viewBox="0 0 24 24"
                                    fill="none"
                                >
                                    <circle opacity="0.25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path opacity="0.75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Claiming…
                            </span>
                        ) : claimed ? (
                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                ✅ Claimed! 🎊
                            </span>
                        ) : (
                            '🎁 Claim Your Bonus'
                        )}
                    </button>

                    {/* Dismiss */}
                    {!claimed && (
                        <button
                            onClick={onDismiss}
                            style={{
                                marginTop: '12px',
                                fontSize: '12px',
                                color: 'rgba(255,255,255,0.28)',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                fontFamily: '"DM Sans", sans-serif',
                                transition: 'color 0.15s',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
                            onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.28)')}
                        >
                            Remind me later
                        </button>
                    )}
                </div>
            </div>

            {/* Global keyframes */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');

                @keyframes coinFall {
                    0%   { transform: translateY(-50px) rotate(0deg) scale(1);    opacity: 1; }
                    85%  { opacity: 1; }
                    100% { transform: translateY(105vh) rotate(540deg) scale(0.5); opacity: 0; }
                }
                @keyframes modalPop {
                    from { opacity: 0; transform: scale(0.6) translateY(40px); }
                    to   { opacity: 1; transform: scale(1) translateY(0); }
                }
                @keyframes popperBounce {
                    from { opacity: 0; transform: scale(0.2) rotate(-25deg); }
                    to   { opacity: 1; transform: scale(1) rotate(0deg); }
                }
                @keyframes sparkle {
                    from { opacity: 0.25; transform: scale(0.7) rotate(-12deg); }
                    to   { opacity: 1;    transform: scale(1.3) rotate(12deg); }
                }
                @keyframes coinSpin {
                    0%   { transform: rotateY(0deg); }
                    100% { transform: rotateY(360deg); }
                }
                @keyframes shimmer {
                    0%   { background-position: 0% center; }
                    100% { background-position: 200% center; }
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

export default function DashNav({ heading }: { heading: string }) {
    const { toggleSidebar } = useSidebar();
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [profileData, setProfileData] = useState<ProfileData | null>(null);
    const [profileLoading, setProfileLoading] = useState(false);
    const [imgError, setImgError] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    // ── Welcome bonus state ────────────────────────────────────────────────────
    const [showWelcomeBonus, setShowWelcomeBonus] = useState(false);
    const snoozeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const isSnoozed = () => {
        const val = localStorage.getItem(WELCOME_BONUS_SNOOZE_KEY);
        return !!val && Date.now() < parseInt(val, 10);
    };

    // Show popup when profile loads (and conditions are met)
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
            setProfileData((prev) => {
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
            const resp = await api.post(`/users/${userId}/claim-welcome-bonus`,{}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = resp?.data ?? resp;
            setProfileData((prev) => {
                if (!prev) return prev;
                return {
                    ...prev,
                    isWelcomeBonusRedeemed: true,
                    // Update credits from API response if returned, otherwise keep existing
                    credits: typeof data?.credits === 'number' ? data.credits : prev.credits,
                };
            });
            window.location.reload();
            
        } catch (err) {
            console.error('Failed to claim bonus', err);
        }
        localStorage.removeItem(WELCOME_BONUS_SNOOZE_KEY);
        if (snoozeTimerRef.current) clearTimeout(snoozeTimerRef.current);
        // Refresh credits so the navbar balance updates immediately
        window.dispatchEvent(new CustomEvent('credits:refresh'));
    }, []);

    useEffect(() => () => { if (snoozeTimerRef.current) clearTimeout(snoozeTimerRef.current); }, []);

    // ── fetch profile (single source of truth for profile + credits) ───────────
    useEffect(() => {
        const loadProfile = async () => {
            try {
                const userData = JSON.parse(localStorage.getItem('user') || 'null');
                const token = userData?.token;
                if (!token) return;

                setProfileLoading(true);
                const resp = await api.get('/personal-details/profile-data', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = resp?.data ?? resp;
                if (data) setProfileData(data);
            } catch (err) {
                console.warn('Failed to load profile data', err);
            } finally {
                setProfileLoading(false);
            }
        };
        loadProfile();
    }, []);

    // ── close dropdown on outside click ───────────────────────────────────────
    useEffect(() => {
        const onDocClick = (e: MouseEvent) => {
            if (!dropdownRef.current) return;
            if (dropdownRef.current.contains(e.target as Node)) return;
            setShowProfileDropdown(false);
        };
        if (showProfileDropdown) document.addEventListener('mousedown', onDocClick);
        return () => document.removeEventListener('mousedown', onDocClick);
    }, [showProfileDropdown]);

    // ── share modal ────────────────────────────────────────────────────────────
    const [showShareModal, setShowShareModal] = useState(false);
    const [templates, setTemplates] = useState<any[]>([]);
    const [templatesLoading, setTemplatesLoading] = useState(false);
    const [copyStatus, setCopyStatus] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [couponCopied, setCouponCopied] = useState(false);

    const fetchTemplates = async () => {
        try {
            const userData = JSON.parse(localStorage.getItem('user') || 'null');
            const userId = userData?.user_id;
            const token = userData?.token;
            if (!userId || !token) return;
            setTemplatesLoading(true);
            const list = await getResumeTemplates(userId, token);
            setTemplates(Array.isArray(list) ? list : []);
        } catch (err) {
            console.warn('Failed to load resume templates', err);
            setTemplates([]);
        } finally {
            setTemplatesLoading(false);
        }
    };

    // ── derived values ─────────────────────────────────────────────────────────
    const displayName = profileData
        ? [profileData.name.first_name, profileData.name.last_name].filter(Boolean).join(' ')
        : null;

    const hasValidImage = !!profileData?.image && !imgError;

    const formattedCredits =
        profileData?.credits != null
            ? Number(profileData.credits).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            : '0.00';

    return (
        <>
            <nav className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
                <div className="text-lg font-medium text-gray-700">{heading}</div>

                <div className="flex items-center gap-2">
                    {/* Profile pill + dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setShowProfileDropdown((s) => !s)}
                            className="flex items-center gap-2 pl-1 pr-3 h-9 rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition"
                            aria-expanded={showProfileDropdown}
                            aria-haspopup="true"
                        >
                            <span className="w-7 h-7 rounded-full overflow-hidden bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                                {hasValidImage ? (
                                    <img
                                        src={profileData!.image}
                                        alt={displayName ?? 'Profile'}
                                        onError={() => setImgError(true)}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                                        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                                    </svg>
                                )}
                            </span>

                            <span className="text-sm text-gray-700 hidden sm:block">
                                {profileLoading ? (
                                    <span className="inline-block w-24 h-3 bg-gray-200 rounded animate-pulse" />
                                ) : displayName ? (
                                    <>
                                        <span className="text-gray-400 font-normal">Hi, </span>
                                        <span className="font-medium">{displayName}</span>
                                    </>
                                ) : (
                                    'My Profile'
                                )}
                            </span>

                            <svg
                                className={`w-3 h-3 text-gray-400 ml-0.5 transition-transform ${showProfileDropdown ? 'rotate-180' : ''}`}
                                viewBox="0 0 10 6"
                                fill="none"
                            >
                                <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>

                        {showProfileDropdown && (
                            <div className="absolute right-0 mt-2 w-56 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                                <div className="absolute right-5 -top-1.5 w-3 h-3 bg-white border-l border-t border-gray-200 transform rotate-45 z-10" />

                                <div className="relative rounded-xl shadow-lg border border-gray-100 bg-white overflow-hidden">
                                    <div className="px-4 py-3 bg-gradient-to-br from-orange-50 to-orange-100 border-b border-orange-100 flex items-center gap-3">
                                        <span className="w-9 h-9 rounded-full overflow-hidden bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center flex-shrink-0 shadow">
                                            {hasValidImage ? (
                                                <img src={profileData!.image} alt={displayName ?? 'Profile'} className="w-full h-full object-cover" />
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                                                    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                                                </svg>
                                            )}
                                        </span>
                                        <div className="min-w-0">
                                            <div className="text-sm font-semibold text-gray-800 truncate">{displayName ?? '—'}</div>
                                            <div className="text-xs text-gray-500">Your Profile</div>
                                        </div>
                                    </div>

                                    <div>
                                        <button
                                            onClick={() => { setShowProfileDropdown(false); setShowShareModal(true); fetchTemplates(); }}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition group"
                                        >
                                            <span className="w-7 h-7 rounded-full bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center transition">
                                                <Share2 size={14} className="text-blue-500" />
                                            </span>
                                            Share Resume
                                        </button>

                                        <button
                                            onClick={() => window.open('https://nammaqa.com/meetups/', '_blank')}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition group"
                                        >
                                            <span className="w-7 h-7 rounded-full bg-purple-50 group-hover:bg-purple-100 flex items-center justify-center transition">
                                                <CalendarDays size={14} className="text-purple-500" />
                                            </span>
                                            View Events
                                        </button>

                                        <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition group">
                                            <span className="w-7 h-7 rounded-full bg-orange-50 group-hover:bg-orange-100 flex items-center justify-center transition">
                                                <Plus size={14} className="text-orange-500" />
                                            </span>
                                            <span className="flex items-center justify-between w-full">
                                                Credits
                                                <span className="ml-auto text-xs font-semibold bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">
                                                    {profileLoading ? '…' : formattedCredits}
                                                </span>
                                            </span>
                                        </button>

                                        <div className="px-4 py-2.5">
                                            <div className="flex items-center gap-3 mb-1.5">
                                                <span className="w-7 h-7 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                                                    <Ticket size={14} className="text-green-500" />
                                                </span>
                                                <span className="text-sm text-gray-700">Coupon</span>
                                            </div>
                                            {profileData?.coupon_code ? (
                                                <div className="ml-10 flex items-center gap-2">
                                                    <div className="flex-1 flex items-center gap-1.5 bg-green-50 border border-green-200 border-dashed rounded-lg px-2.5 py-1.5 min-w-0">
                                                        <span className="text-xs font-mono font-semibold text-green-700 tracking-widest truncate">
                                                            {profileData.coupon_code}
                                                        </span>
                                                    </div>
                                                    <button
                                                        onClick={async () => {
                                                            try {
                                                                await navigator.clipboard.writeText(profileData.coupon_code!);
                                                                setCouponCopied(true);
                                                                setTimeout(() => setCouponCopied(false), 2000);
                                                            } catch { console.error('Failed to copy coupon'); }
                                                        }}
                                                        className={`flex-shrink-0 flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium transition ${
                                                            couponCopied
                                                                ? 'bg-green-500 text-white'
                                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                        }`}
                                                    >
                                                        {couponCopied ? <><Check size={12} />Copied</> : <><Copy size={12} />Copy</>}
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="ml-10 text-xs text-gray-400">No coupon available</div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => toggleSidebar()}
                        className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 bg-white hover:bg-gray-100 transition lg:hidden"
                    >
                        <Menu size={18} />
                    </button>
                </div>

                {/* Share Modal */}
                {showShareModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/40" style={{ backdropFilter: 'blur(4px)' }} onClick={() => setShowShareModal(false)} />
                        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-4 z-20 overflow-hidden">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-lg font-semibold">Share Resume</h3>
                                <button onClick={() => setShowShareModal(false)} className="text-gray-500 hover:text-gray-700">✕</button>
                            </div>
                            <div className="max-h-[70vh] overflow-auto">
                                {templatesLoading ? (
                                    <div className="text-sm text-gray-500">Loading templates…</div>
                                ) : templates.length === 0 ? (
                                    <div className="text-sm text-gray-500">No templates found.</div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-3 p-4">
                                        {templates.map((t) => {
                                            const templateId = t.resume_template_id || t.template_id;
                                            const isCopied = copiedId === templateId;
                                            return (
                                                <div key={templateId} className="flex flex-col md:flex-row items-start gap-3 p-4 border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition group">
                                                    <div className="flex items-center gap-3 w-full">
                                                        <span className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
                                                            <FileText size={20} className="text-red-500" />
                                                        </span>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="text-sm font-semibold text-gray-800 truncate">{t.template_name}</div>
                                                            <div className="text-xs text-gray-500">Resume</div>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={async () => {
                                                            try {
                                                                await navigator.clipboard.writeText(t.template_file_url);
                                                                setCopiedId(templateId);
                                                                setTimeout(() => setCopiedId(null), 2000);
                                                            } catch {
                                                                setCopyStatus('Copy failed');
                                                                setTimeout(() => setCopyStatus(null), 2000);
                                                            }
                                                        }}
                                                        className={`w-full items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${isCopied ? 'bg-green-100 text-green-600' : 'bg-orange-500 text-white hover:bg-orange-600'}`}
                                                    >
                                                        {isCopied ? (
                                                            <><Check size={16} />Copied</>
                                                        ) : (
                                                            <div className="flex items-center justify-center gap-2"><Copy size={16} /><span>Share URL</span></div>
                                                        )}
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                            {copyStatus && <div className="mt-3 text-sm text-green-600">{copyStatus}</div>}
                        </div>
                    </div>
                )}
            </nav>

            {/* Welcome Bonus Modal — rendered at root so it sits above everything */}
            {showWelcomeBonus && profileData && (
                <WelcomeBonusModal
                    name={profileData.name.first_name}
                    onClaim={handleClaimBonus}
                    onDismiss={handleDismissBonus}
                />
            )}
        </>
    );
}