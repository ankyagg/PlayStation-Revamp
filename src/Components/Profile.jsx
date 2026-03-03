import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDualSenseWS } from './Anikator/useDualSenseWS';

/* ─── Data ─── */
const profile = {
    username: "Astro_Explorer",
    psId: "@astro_explorer",
    memberSince: "Nov 2020",
    subscription: "PS Plus Premium",
    level: 42,
    xp: 7540,
    nextXp: 10000,
    trophies: { platinum: 12, gold: 45, silver: 128, bronze: 342 },
    hours: "2,340",
    games: 87,
    friends: 64,
};

const recentGames = [
    {
        id: 1, name: "God of War Ragnarök", genre: "Action-Adventure",
        hours: 90, progress: 67, lastPlayed: "2 hours ago",
        poster: "https://cdn1.epicgames.com/offer/3ddd6a590da64e3686042d108968a6b2/EGS_GodofWar_SantaMonicaStudio_S1_2560x1440-5d74d9b240bba8f2c40920dcde7c5c67_2560x1440-5d74d9b240bba8f2c40920dcde7c5c67",
        accent: "#b8322a",
    },
    {
        id: 2, name: "Marvel's Spider-Man 2", genre: "Action-Adventure",
        hours: 45, progress: 85, lastPlayed: "Yesterday",
        poster: "https://4kwallpapers.com/images/wallpapers/marvels-spider-man-3840x2160-12554.jpeg",
        accent: "#cc2222",
    },
    {
        id: 3, name: "Ghost of Tsushima", genre: "Action-Adventure",
        hours: 38, progress: 42, lastPlayed: "3 days ago",
        poster: "https://cdn.cloudflare.steamstatic.com/steam/apps/2215430/library_hero.jpg",
        accent: "#c0720a",
    },
    {
        id: 4, name: "The Last of Us", genre: "Survival",
        hours: 22, progress: 100, lastPlayed: "1 week ago",
        poster: "https://cdn.cloudflare.steamstatic.com/steam/apps/1888930/library_hero.jpg",
        accent: "#c8a010",
    },
];

const trophies = [
    { id: 1, name: "Platinum Master", game: "Astro's Playroom", type: "Platinum" },
    { id: 2, name: "Hero of NYC", game: "Spider-Man 2", type: "Gold" },
    { id: 3, name: "Valhalla Awaits", game: "God of War", type: "Gold" },
    { id: 4, name: "Dire Wolf", game: "The Last of Us", type: "Silver" },
    { id: 5, name: "Ghost Armor", game: "Ghost of Tsushima", type: "Silver" },
    { id: 6, name: "First Steps", game: "Returnal", type: "Bronze" },
];

/* Metal colors */
const TROPHY_COLORS = {
    Platinum: { fg: "#d8d8ff", glow: "rgba(180,180,255,0.7)", symbol: "✦" },
    Gold: { fg: "#FFD700", glow: "rgba(255,200,0,0.6)", symbol: "★" },
    Silver: { fg: "#b8c4d0", glow: "rgba(180,200,220,0.5)", symbol: "◆" },
    Bronze: { fg: "#c88050", glow: "rgba(200,128,80,0.5)", symbol: "●" },
};

const totalTrophies = Object.values(profile.trophies).reduce((a, b) => a + b, 0);
const xpPct = Math.round((profile.xp / profile.nextXp) * 100);

/* ─── Simple image with error fallback ─── */
const Img = ({ src, alt, style, fallbackBg = "#1a1a2e" }) => {
    const [err, setErr] = useState(false);
    return err
        ? <div style={{ ...style, background: fallbackBg }} />
        : <img src={src} alt={alt} style={style} onError={() => setErr(true)} />;
};

/* ─── Component ─── */
export default function Profile() {
    const { action } = useDualSenseWS();
    const [focus, setFocus] = useState(0);   // which recent game is highlighted
    const [view, setView] = useState("games"); // "games" | "trophies"

    useEffect(() => {
        if (!action) return;
        if (action === "DPAD_RIGHT") setFocus(f => Math.min(recentGames.length - 1, f + 1));
        if (action === "DPAD_LEFT") setFocus(f => Math.max(0, f - 1));
    }, [action]);

    const active = recentGames[focus];

    return (
        <div style={{
            width: "100vw", height: "100vh", overflow: "hidden",
            background: "#07080f", position: "relative",
            fontFamily: "'Inter', system-ui, sans-serif", color: "#fff",
        }}>
            {/* ══ CINEMATIC BACKGROUND — game art (same approach as HomeDashboard) ══ */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={active.id}
                    initial={{ opacity: 0, scale: 1.06 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
                    style={{
                        position: "absolute", inset: 0,
                        backgroundImage: `url(${active.poster})`,
                        backgroundSize: "cover", backgroundPosition: "center 20%",
                    }}
                />
            </AnimatePresence>

            {/* Heavy asymmetric vignette — left side almost opaque, right lets art show */}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(105deg, rgba(7,8,15,0.97) 0%, rgba(7,8,15,0.82) 38%, rgba(7,8,15,0.45) 65%, rgba(7,8,15,0.15) 100%)" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(7,8,15,1) 0%, rgba(7,8,15,0.55) 28%, transparent 55%)" }} />

            {/* Accent color ambient from active game */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={`glow-${active.id}`}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    transition={{ duration: 1.2 }}
                    style={{
                        position: "absolute", inset: 0,
                        background: `radial-gradient(ellipse at 75% 60%, ${active.accent}18 0%, transparent 55%)`,
                    }}
                />
            </AnimatePresence>

            {/* ══ SCROLLABLE CONTENT ══ */}
            <div style={{
                position: "relative", zIndex: 10,
                height: "100%", overflowY: "auto", overflowX: "hidden",
                paddingTop: "80px",
            }}>
                {/* ── HERO HEADER — no boxes, text directly on gradient ── */}
                <div style={{ padding: "40px 60px 0" }}>

                    {/* Subscription chip — tiny, elegant */}
                    <div style={{
                        display: "inline-flex", alignItems: "center", gap: "6px",
                        marginBottom: "20px",
                        fontSize: "12px", fontWeight: 700, letterSpacing: "2.5px",
                        fontFamily: "var(--font-ui)",
                        textTransform: "uppercase", color: "rgba(255,255,255,0.35)",
                    }}>
                        <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#7b2ff7", display: "inline-block" }} />
                        {profile.subscription}
                    </div>

                    {/* USERNAME — massive editorial headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        style={{
                            fontSize: "clamp(52px, 7vw, 88px)",
                            fontFamily: "var(--font-display)",
                            fontWeight: 900,
                            letterSpacing: "-3px",
                            lineHeight: 0.92,
                            margin: "0 0 14px",
                            // Slight gradient on the text for depth (not AI blue gradient, just white→white/80)
                            background: "linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.82) 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}
                    >
                        {profile.username}
                    </motion.h1>

                    {/* Sub info — one inline line, no box */}
                    <div style={{
                        fontSize: "13px", color: "rgba(255,255,255,0.38)",
                        fontWeight: 400, marginBottom: "28px", letterSpacing: "0.1px",
                    }}>
                        {profile.psId}
                        <span style={{ margin: "0 8px", opacity: 0.4 }}>·</span>
                        Since {profile.memberSince}
                    </div>

                    {/* Inline stats — NO cards. Just numbers with labels */}
                    <div style={{ display: "flex", alignItems: "baseline", gap: "32px", marginBottom: "24px" }}>
                        {[
                            { n: totalTrophies, l: "trophies" },
                            { n: profile.games, l: "games" },
                            { n: profile.hours + "h", l: "played" },
                            { n: profile.friends, l: "friends" },
                        ].map(({ n, l }, i) => (
                            <React.Fragment key={l}>
                                {i > 0 && <div style={{ width: "1px", height: "24px", background: "rgba(255,255,255,0.1)" }} />}
                                <div>
                                    <span style={{ fontSize: "26px", fontWeight: 800, letterSpacing: "-0.5px", lineHeight: 1 }}>{n}</span>
                                    <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", fontWeight: 500, marginLeft: "6px" }}>{l}</span>
                                </div>
                            </React.Fragment>
                        ))}
                    </div>

                    {/* Level + XP — minimal, linear */}
                    <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "48px" }}>
                        <span style={{
                            fontSize: "10px", fontWeight: 700, letterSpacing: "2px",
                            color: "rgba(255,255,255,0.3)", textTransform: "uppercase",
                            fontFamily: "var(--font-ui)",
                        }}>Lv {profile.level}</span>
                        <div style={{ width: "180px", height: "2px", background: "rgba(255,255,255,0.1)", borderRadius: "1px", position: "relative" }}>
                            <motion.div
                                initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                                transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                style={{
                                    position: "absolute", left: 0, top: 0,
                                    width: `${xpPct}%`, height: "100%",
                                    background: "#fff",
                                    borderRadius: "1px",
                                    transformOrigin: "left",
                                }}
                            />
                        </div>
                        <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)", fontWeight: 600 }}>{xpPct}%</span>
                    </div>
                </div>

                {/* ── VIEW SWITCHER — minimal underline style ── */}
                <div style={{ padding: "0 60px", display: "flex", gap: "28px", marginBottom: "28px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                    {[{ id: "games", label: "Recent Games" }, { id: "trophies", label: "Trophies" }].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setView(tab.id)}
                            style={{
                                background: "none", border: "none", cursor: "pointer",
                                paddingBottom: "12px",
                                fontSize: "15px", fontWeight: 400,
                                fontFamily: "var(--font-ui)",
                                color: view === tab.id ? "#fff" : "rgba(255,255,255,0.35)",
                                borderBottom: view === tab.id ? "1px solid #fff" : "1px solid transparent",
                                marginBottom: "-1px",
                                letterSpacing: "1px",
                                transition: "color 0.15s, border-color 0.15s",
                            }}
                            onMouseEnter={e => { if (view !== tab.id) e.currentTarget.style.color = "rgba(255,255,255,0.65)"; }}
                            onMouseLeave={e => { if (view !== tab.id) e.currentTarget.style.color = "rgba(255,255,255,0.35)"; }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {/* ══ RECENTLY PLAYED — cinematic asymmetric layout ══ */}
                    {view === "games" && (
                        <motion.div
                            key="games"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            style={{ padding: "0 60px 60px" }}
                        >
                            {/* Section label */}
                            <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "2px", fontFamily: "var(--font-ui)", color: "rgba(255,255,255,0.28)", textTransform: "uppercase", marginBottom: "16px" }}>
                                Continue Playing
                            </div>

                            {/* Asymmetric card row:  LARGE (first) + smaller stack */}
                            <div style={{ display: "flex", gap: "10px", height: "200px" }}>
                                {/* FEATURED — first game, double width, shows detail */}
                                {(() => {
                                    const g = recentGames[0];
                                    return (
                                        <div
                                            data-focusable
                                            onClick={() => setFocus(0)}
                                            style={{
                                                position: "relative",
                                                flex: "0 0 380px",
                                                borderRadius: "12px",
                                                overflow: "hidden",
                                                cursor: "pointer",
                                                border: focus === 0 ? `1px solid rgba(255,255,255,0.4)` : "1px solid rgba(255,255,255,0.07)",
                                                transition: "border-color 0.2s",
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)"}
                                            onMouseLeave={e => e.currentTarget.style.borderColor = focus === 0 ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.07)"}
                                        >
                                            <Img src={g.poster} alt={g.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
                                            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.3) 55%, transparent 100%)" }} />
                                            {/* Left accent bar from game color */}
                                            <div style={{ position: "absolute", left: 0, top: "16px", bottom: "16px", width: "3px", background: g.accent, borderRadius: "0 2px 2px 0" }} />
                                            <div style={{ position: "absolute", inset: 0, padding: "16px 18px", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                                                <div style={{ fontSize: "8px", fontWeight: 700, letterSpacing: "2px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginBottom: "5px" }}>{g.genre}</div>
                                                <div style={{ fontSize: "16px", fontWeight: 800, lineHeight: 1.2, marginBottom: "10px" }}>{g.name}</div>
                                                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                                    <div style={{ flex: 1, height: "2px", background: "rgba(255,255,255,0.12)", borderRadius: "1px" }}>
                                                        <div style={{ width: `${g.progress}%`, height: "100%", background: g.accent, borderRadius: "1px" }} />
                                                    </div>
                                                    <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>{g.progress}%</span>
                                                </div>
                                                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
                                                    <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.35)" }}>{g.lastPlayed}</span>
                                                    <button style={{
                                                        background: "#fff", color: "#000",
                                                        border: "none", borderRadius: "5px",
                                                        padding: "5px 14px", fontSize: "10px", fontWeight: 800,
                                                        cursor: "pointer", letterSpacing: "0.3px",
                                                        transition: "opacity 0.15s, transform 0.15s",
                                                    }}
                                                        onMouseEnter={e => { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.transform = "scale(0.97)"; }}
                                                        onMouseLeave={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "scale(1)"; }}
                                                    >
                                                        ▶ Continue
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })()}

                                {/* Smaller cards */}
                                {recentGames.slice(1).map((g, i) => (
                                    <div
                                        data-focusable
                                        key={g.id}
                                        onClick={() => setFocus(i + 1)}
                                        style={{
                                            position: "relative",
                                            flex: "1 1 0",
                                            borderRadius: "12px",
                                            overflow: "hidden",
                                            cursor: "pointer",
                                            border: focus === i + 1 ? "1px solid rgba(255,255,255,0.35)" : "1px solid rgba(255,255,255,0.07)",
                                            transition: "border-color 0.15s",
                                        }}
                                        onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)"; }}
                                        onMouseLeave={e => { e.currentTarget.style.borderColor = focus === i + 1 ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.07)"; }}
                                    >
                                        <Img src={g.poster} alt={g.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, transparent 65%)" }} />
                                        <div style={{ position: "absolute", left: 0, top: "12px", bottom: "12px", width: "2px", background: g.accent, borderRadius: "0 1px 1px 0" }} />
                                        <div style={{ position: "absolute", inset: 0, padding: "12px", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                                            <div style={{ fontSize: "11px", fontWeight: 700, marginBottom: "5px", lineHeight: 1.2 }}>{g.name}</div>
                                            <div style={{ height: "2px", background: "rgba(255,255,255,0.1)", borderRadius: "1px" }}>
                                                <div style={{ width: `${g.progress}%`, height: "100%", background: g.accent }} />
                                            </div>
                                            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "5px" }}>
                                                <span style={{ fontSize: "8px", color: "rgba(255,255,255,0.35)" }}>{g.lastPlayed}</span>
                                                <span style={{ fontSize: "8px", color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>{g.progress}%</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* ── TROPHY QUICK COUNTS — inline display ── */}
                            <div style={{ marginTop: "48px" }}>
                                <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "2px", fontFamily: "var(--font-ui)", color: "rgba(255,255,255,0.28)", textTransform: "uppercase", marginBottom: "20px" }}>
                                    Trophy Cabinet
                                </div>
                                <div style={{ display: "flex", gap: "0px" }}>
                                    {[
                                        { label: "Platinum", count: profile.trophies.platinum, ...TROPHY_COLORS.Platinum },
                                        { label: "Gold", count: profile.trophies.gold, ...TROPHY_COLORS.Gold },
                                        { label: "Silver", count: profile.trophies.silver, ...TROPHY_COLORS.Silver },
                                        { label: "Bronze", count: profile.trophies.bronze, ...TROPHY_COLORS.Bronze },
                                    ].map((t, i) => (
                                        <React.Fragment key={t.label}>
                                            {i > 0 && <div style={{ width: "1px", background: "rgba(255,255,255,0.07)", margin: "0 28px" }} />}
                                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                                <span style={{ fontSize: "22px", filter: `drop-shadow(0 0 8px ${t.glow})`, color: t.fg }}>{t.symbol}</span>
                                                <div>
                                                    <div style={{ fontSize: "22px", fontWeight: 900, letterSpacing: "-0.5px", lineHeight: 1, color: t.fg }}>{t.count}</div>
                                                    <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.28)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>{t.label}</div>
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* ══ TROPHIES — elegant list, not a grid ══ */}
                    {view === "trophies" && (
                        <motion.div
                            key="trophies"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            style={{ padding: "0 60px 60px" }}
                        >
                            <div style={{ maxWidth: "640px" }}>
                                {trophies.map((t, i) => {
                                    const meta = TROPHY_COLORS[t.type];
                                    return (
                                        <motion.div
                                            data-focusable
                                            key={t.id}
                                            initial={{ opacity: 0, x: -12 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.06, duration: 0.3 }}
                                            style={{
                                                display: "flex", alignItems: "center",
                                                gap: "18px", padding: "16px 0",
                                                borderBottom: i < trophies.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                                                cursor: "pointer",
                                                transition: "none",  /* don't let global transition override this */
                                            }}
                                            whileHover={{ x: 4 }}
                                        >
                                            {/* Trophy metal symbol */}
                                            <span style={{
                                                fontSize: "24px",
                                                filter: `drop-shadow(0 0 8px ${meta.glow})`,
                                                color: meta.fg,
                                                flexShrink: 0,
                                                width: "32px",
                                                textAlign: "center",
                                            }}>
                                                {meta.symbol}
                                            </span>

                                            {/* Info */}
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "2px" }}>{t.name}</div>
                                                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", fontWeight: 400 }}>{t.game}</div>
                                            </div>

                                            {/* Type label */}
                                            <div style={{
                                                fontSize: "9px", fontWeight: 700,
                                                letterSpacing: "1.5px", textTransform: "uppercase",
                                                color: meta.fg,
                                                opacity: 0.7,
                                            }}>
                                                {t.type}
                                            </div>

                                            {/* Subtle chevron */}
                                            <div style={{ color: "rgba(255,255,255,0.15)", fontSize: "12px" }}>›</div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Controller hint — bottom-left, very subtle */}
            <div style={{
                position: "absolute", bottom: "20px", left: "60px",
                zIndex: 20, pointerEvents: "none", display: "flex", gap: "16px",
            }}>
                {[["◀▶", "Switch game"]].map(([icon, label]) => (
                    <div key={label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{
                            width: "22px", height: "22px", borderRadius: "50%",
                            border: "1px solid rgba(255,255,255,0.12)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "8px", color: "rgba(255,255,255,0.4)",
                        }}>{icon}</span>
                        <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.2)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>{label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
