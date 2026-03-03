/**
 * MediaUI.jsx — Enhanced PS5 Media Hub
 *
 * Features:
 *  • Streaming Integration: Twitch/YouTube live links
 *  • Stream-while-play stats
 *  • Popular streamers section
 *  • Featured content carousel
 *  • Premium glassmorphism design
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDualSenseWS } from './Anikator/useDualSenseWS';

/* ── Icons ── */
const TwitchIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z" />
    </svg>
);
const YouTubeIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
);
const LiveDot = () => (
    <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: "#ff4655", marginRight: "5px", animation: "livePulse 1.5s ease-in-out infinite" }} />
);
const PlayIcon = ({ size = 20 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
);
const ViewersIcon = ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

/* ── DATA ── */
const featuredContent = [
    {
        id: 1,
        title: 'The Mandalorian',
        description: 'A lone gunfighter makes his way through the outer reaches of the galaxy.',
        provider: 'Disney+',
        providerColor: '#00aaff',
        hero: 'https://disney.images.edge.bamgrid.com/ripcut-delivery/v2/variant/disney/ea78b4f8-f180-41e5-9aac-9e99c96fb4ac/compose?aspectRatio=1.78&format=webp&width=1200',
        thumb: 'https://disney.images.edge.bamgrid.com/ripcut-delivery/v2/variant/disney/ea78b4f8-f180-41e5-9aac-9e99c96fb4ac/compose?aspectRatio=1.78&format=webp&width=1200',
        genre: "Sci-Fi • Action",
        duration: "45 min per episode",
    },
    {
        id: 2,
        title: 'Stranger Things',
        description: 'Mysteries unfold in a small town when a girl with telekinetic powers appears.',
        provider: 'Netflix',
        providerColor: '#e50914',
        hero: 'https://cdn.arstechnica.net/wp-content/uploads/2026/01/strangerTOP.jpg',
        thumb: 'https://cdn.arstechnica.net/wp-content/uploads/2026/01/strangerTOP.jpg',
        genre: "Sci-Fi • Horror",
        duration: "50 min per episode",
    },
    {
        id: 3,
        title: 'Horizon Zero Dawn',
        description: 'Follow Aloy in a future Earth dominated by mechanical creatures.',
        provider: 'HBO Max',
        providerColor: '#8b47ff',
        hero: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTd-Kmm8NnDoaxVLNx9LnKzXsGPsk-_A2PiLQ&s',
        thumb: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTd-Kmm8NnDoaxVLNx9LnKzXsGPsk-_A2PiLQ&s',
        genre: "Action • Adventure",
        duration: "Films series",
    },
    {
        id: 4,
        title: 'House of the Dragon',
        description: 'The prequel to Game of Thrones — the story of the Targaryen family.',
        provider: 'HBO Max',
        providerColor: '#8b47ff',
        hero: 'https://m.media-amazon.com/images/M/MV5BODFjYjIyNGMtZWFhOS00ZzkxLTk3NWQtOWU2NTI2ZmNiYWQ4XkEyXkFqcGdeQXVyMTEyMjM2NDc2._V1_FMjpg_UX1000_.jpg',
        thumb: 'https://m.media-amazon.com/images/M/MV5BODFjYjIyNGMtZWFhOS00ZzkxLTk3NWQtOWU2NTI2ZmNiYWQ4XkEyXkFqcGdeQXVyMTEyMjM2NDc2._V1_FMjpg_UX1000_.jpg',
        genre: "Fantasy • Drama",
        duration: "60 min per episode",
    },
];

const twitchStreamers = [
    {
        id: 1,
        name: "shroud",
        game: "Call of Duty: Modern Warfare",
        thumbnail: "https://static-cdn.jtvnw.net/previews-ttv/live_user_shroud-440x248.jpg",
        viewers: "48.2K",
        isLive: true,
        avatar: "SH",
        avatarColor: "#9146ff",
        category: "FPS",
        url: "https://www.twitch.tv/shroud",
    },
    {
        id: 2,
        name: "pokimane",
        game: "Valorant",
        thumbnail: "https://static-cdn.jtvnw.net/previews-ttv/live_user_pokimane-440x248.jpg",
        viewers: "32.5K",
        isLive: true,
        avatar: "PO",
        avatarColor: "#ff69b4",
        category: "Tactical",
        url: "https://www.twitch.tv/pokimane",
    },
    {
        id: 3,
        name: "TimTheTatman",
        game: "Ghost of Tsushima",
        thumbnail: "https://static-cdn.jtvnw.net/previews-ttv/live_user_timthetatman-440x248.jpg",
        viewers: "22.8K",
        isLive: true,
        avatar: "TT",
        avatarColor: "#ffa500",
        category: "Adventure",
        url: "https://www.twitch.tv/timthetatman",
    },
    {
        id: 4,
        name: "NICKMERCS",
        game: "God of War: Ragnarök",
        thumbnail: "https://static-cdn.jtvnw.net/previews-ttv/live_user_nickmercs-440x248.jpg",
        viewers: "18.1K",
        isLive: true,
        avatar: "NM",
        avatarColor: "#ff4444",
        category: "Action RPG",
        url: "https://www.twitch.tv/nickmercs",
    },
    {
        id: 5,
        name: "DrDisrespect",
        game: "Returnal",
        thumbnail: "https://i.ytimg.com/vi/Ff0n6cNh_4Q/maxresdefault.jpg",
        viewers: "15.0K",
        isLive: false,
        avatar: "DD",
        avatarColor: "#00ff00",
        category: "Roguelike",
        url: "https://www.youtube.com/@DrDisRespectLive",
        platform: "youtube",
    },
];

const youtubeContent = [
    {
        id: 1,
        title: "Spider-Man: Miles Morales — Full Gameplay",
        channel: "PlayStation",
        views: "12M views",
        thumb: "https://i.ytimg.com/vi/GqrETfEjjc4/maxresdefault.jpg",
        duration: "1:24:32",
        url: "https://www.youtube.com/@PlayStation",
        verified: true,
        avatarColor: "#003087",
        avatar: "PS",
    },
    {
        id: 2,
        title: "God of War Ragnarök — Official Trailer",
        channel: "Sony Santa Monica",
        views: "8.5M views",
        thumb: "https://i.ytimg.com/vi/EE-4GvjKcfs/maxresdefault.jpg",
        duration: "3:28",
        url: "https://www.youtube.com/@GodofWar",
        verified: true,
        avatarColor: "#c0392b",
        avatar: "SM",
    },
    {
        id: 3,
        title: "Ghost of Tsushima — Legends Trailer",
        channel: "PlayStation",
        views: "5.2M views",
        thumb: "https://i.ytimg.com/vi/RcWk08PBe7k/maxresdefault.jpg",
        duration: "4:15",
        url: "https://www.youtube.com/watch?v=RcWk08PBe7k",
        verified: true,
        avatarColor: "#e67e22",
        avatar: "PS",
    },
];

/* ── Section labels ── */
const MEDIA_SECTIONS = ["Featured", "Streaming", "YouTube", "Music"];

const PSMediaUI = () => {
    const [selectedContent, setSelectedContent] = useState(featuredContent[0]);
    const [activeSection, setActiveSection] = useState("Featured");
    const [hoveredStreamer, setHoveredStreamer] = useState(null);
    const { action } = useDualSenseWS();

    useEffect(() => {
        if (!action) return;
        switch (action) {
            case 'DPAD_LEFT': {
                const i = featuredContent.indexOf(selectedContent);
                if (i > 0) setSelectedContent(featuredContent[i - 1]);
                break;
            }
            case 'DPAD_RIGHT': {
                const i = featuredContent.indexOf(selectedContent);
                if (i < featuredContent.length - 1) setSelectedContent(featuredContent[i + 1]);
                break;
            }
            default: break;
        }
    }, [action, selectedContent]);

    return (
        <div style={{
            position: "relative", height: "100vh", width: "100%",
            background: "#050810",
            color: "white",
            overflow: "hidden", userSelect: "none", display: "flex", flexDirection: "column",
            paddingTop: "80px",
        }}>
            <style>{`
                @keyframes livePulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(0.8); } }
                @keyframes gradientShift { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
                .media-scroll::-webkit-scrollbar { display: none; }
                .media-scroll { -ms-overflow-style: none; scrollbar-width: none; }
                .streamer-card:hover { transform: translateY(-4px) !important; }
                .yt-card:hover { transform: scale(1.02) !important; }
            `}</style>

            {/* BACKGROUND */}
            <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={selectedContent.id}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 0.35, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.2 }}
                        style={{ position: "absolute", inset: 0 }}
                    >
                        <img src={selectedContent.hero} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="bg" />
                    </motion.div>
                </AnimatePresence>
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #050810 0%, rgba(5,8,16,0.7) 50%, rgba(5,8,16,0.4) 100%)" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(5,8,16,0.9) 0%, transparent 60%)" }} />
            </div>

            {/* ── SECTION TABS ── */}
            <div style={{ position: "relative", zIndex: 20, display: "flex", gap: "0", padding: "8px 48px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {MEDIA_SECTIONS.map(section => (
                    <button
                        key={section}
                        onClick={() => setActiveSection(section)}
                        style={{
                            background: "none", border: "none", cursor: "pointer",
                            fontSize: "17px", fontWeight: 400,
                            fontFamily: "var(--font-ui)",
                            color: activeSection === section ? "#fff" : "rgba(255,255,255,0.45)",
                            padding: "10px 20px 12px",
                            borderBottom: activeSection === section ? "2px solid #0070d1" : "2px solid transparent",
                            transition: "all 0.2s ease",
                            letterSpacing: "0.5px",
                        }}
                    >{section}</button>
                ))}

                {/* PS Network badge */}
                <div style={{
                    marginLeft: "auto", display: "flex", alignItems: "center", gap: "6px",
                    padding: "4px 14px", background: "rgba(0,112,209,0.15)", border: "1px solid rgba(0,112,209,0.3)",
                    borderRadius: "20px", fontSize: "12px", fontWeight: 700, color: "#0090ff",
                }}>
                    🌐 PS Network
                </div>
            </div>

            {/* ── SCROLLABLE CONTENT ── */}
            <div className="media-scroll" style={{ flex: 1, overflowY: "auto", position: "relative", zIndex: 10 }}>

                {/* ═══════ FEATURED SECTION ═══════ */}
                {activeSection === "Featured" && (
                    <div>
                        {/* Hero */}
                        <AnimatePresence mode='wait'>
                            <motion.div
                                key={selectedContent.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                style={{ padding: "32px 48px 24px", maxWidth: "600px" }}
                            >
                                <div style={{
                                    display: "inline-flex", alignItems: "center", gap: "6px",
                                    background: `${selectedContent.providerColor}22`, border: `1px solid ${selectedContent.providerColor}44`,
                                    borderRadius: "20px", padding: "4px 14px", marginBottom: "16px",
                                    fontSize: "11px", fontWeight: 700, color: selectedContent.providerColor,
                                    letterSpacing: "0.5px",
                                }}>
                                    {selectedContent.provider}
                                </div>
                                <h1 style={{ fontSize: "56px", fontWeight: 900, letterSpacing: "-2px", lineHeight: 1, marginBottom: "16px", textShadow: "0 4px 24px rgba(0,0,0,0.6)", fontFamily: "var(--font-display)" }}>
                                    {selectedContent.title}
                                </h1>
                                <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.65)", lineHeight: 1.6, marginBottom: "12px", maxWidth: "480px", fontFamily: "var(--font-body)" }}>
                                    {selectedContent.description}
                                </p>
                                <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
                                    <span style={{ background: "rgba(255,255,255,0.08)", borderRadius: "20px", padding: "4px 14px", fontSize: "12px", color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-ui)" }}>{selectedContent.genre}</span>
                                    <span style={{ background: "rgba(255,255,255,0.08)", borderRadius: "20px", padding: "4px 14px", fontSize: "12px", color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-ui)" }}>{selectedContent.duration}</span>
                                </div>
                                <div style={{ display: "flex", gap: "12px" }}>
                                    <button style={{
                                        display: "flex", alignItems: "center", gap: "8px",
                                        padding: "12px 28px", borderRadius: "12px",
                                        background: "#fff", border: "none", cursor: "pointer",
                                        color: "#000", fontWeight: 700, fontSize: "18px",
                                        boxShadow: "0 6px 20px rgba(0,0,0,0.4)",
                                        transition: "all 0.2s", fontFamily: "var(--font-ui)",
                                    }}
                                        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.03)"}
                                        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                                    >
                                        <PlayIcon size={30} /> Watch Now
                                    </button>
                                    <button style={{
                                        padding: "12px 20px", borderRadius: "12px",
                                        background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
                                        cursor: "pointer", color: "#fff", fontWeight: 600, fontSize: "14px",
                                        backdropFilter: "blur(8px)", transition: "all 0.2s", fontFamily: "var(--font-ui)",
                                    }}
                                        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.18)"}
                                        onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                                    >
                                        + My List
                                    </button>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Featured carousel */}
                        <div style={{ padding: "0 48px 32px" }}>
                            <h3 style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "16px", fontFamily: "var(--font-ui)" }}>
                                Featured Content
                            </h3>
                            <div className="media-scroll" style={{ display: "flex", gap: "16px", overflowX: "auto", paddingBottom: "8px" }}>
                                {featuredContent.map((item) => (
                                    <motion.div
                                        data-focusable
                                        key={item.id}
                                        onMouseEnter={() => setSelectedContent(item)}
                                        whileHover={{ scale: 1.04, y: -4 }}
                                        style={{
                                            flexShrink: 0, width: "220px", cursor: "pointer",
                                            borderRadius: "14px", overflow: "hidden",
                                            border: selectedContent.id === item.id ? "2px solid rgba(255,255,255,0.9)" : "2px solid rgba(255,255,255,0.08)",
                                            transition: "border-color 0.3s",
                                            boxShadow: selectedContent.id === item.id ? "0 8px 32px rgba(0,0,0,0.6)" : "0 4px 12px rgba(0,0,0,0.3)",
                                        }}
                                    >
                                        <div style={{ position: "relative", aspectRatio: "16/9", overflow: "hidden" }}>
                                            <img src={item.thumb} alt={item.title} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: selectedContent.id === item.id ? 1 : 0.55, transition: "opacity 0.3s" }} />
                                            <div style={{ position: "absolute", bottom: "6px", left: "8px" }}>
                                                <div style={{ background: `${item.providerColor}dd`, borderRadius: "6px", padding: "2px 8px", fontSize: "9px", fontWeight: 800, color: "#fff", letterSpacing: "0.5px", fontFamily: "var(--font-ui)" }}>
                                                    {item.provider}
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ padding: "10px 12px", background: "rgba(10,14,26,0.95)" }}>
                                            <div style={{ fontSize: "12px", fontWeight: 700, color: "#fff", opacity: selectedContent.id === item.id ? 1 : 0.6, fontFamily: "var(--font-display)" }}>{item.title}</div>
                                            <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", marginTop: "2px", fontFamily: "var(--font-ui)" }}>{item.genre}</div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* ═══════ STREAMING SECTION ═══════ */}
                {activeSection === "Streaming" && (
                    <div style={{ padding: "24px 48px 40px" }}>

                        {/* Header */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
                            <div>
                                <h2 style={{ fontSize: "28px", fontWeight: 900, marginBottom: "4px", fontFamily: "var(--font-display)" }}>Live Streams</h2>
                                <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-body)" }}>Watch popular streamers playing your games</p>
                            </div>
                            <div style={{ display: "flex", gap: "10px" }}>
                                <a href="https://www.twitch.tv/directory/game/PlayStation%205" target="_blank" rel="noopener noreferrer"
                                    style={{
                                        display: "flex", alignItems: "center", gap: "8px",
                                        padding: "10px 18px", borderRadius: "10px",
                                        background: "#9146ff", textDecoration: "none",
                                        color: "#fff", fontSize: "13px", fontWeight: 700,
                                        transition: "all 0.2s", fontFamily: "var(--font-ui)",
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = "#7d2de8"}
                                    onMouseLeave={e => e.currentTarget.style.background = "#9146ff"}
                                >
                                    <TwitchIcon size={16} /> Twitch
                                </a>
                                <a href="https://www.youtube.com/@PlayStation" target="_blank" rel="noopener noreferrer"
                                    style={{
                                        display: "flex", alignItems: "center", gap: "8px",
                                        padding: "10px 18px", borderRadius: "10px",
                                        background: "#ff0000", textDecoration: "none",
                                        color: "#fff", fontSize: "13px", fontWeight: 700,
                                        transition: "all 0.2s", fontFamily: "var(--font-ui)",
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = "#cc0000"}
                                    onMouseLeave={e => e.currentTarget.style.background = "#ff0000"}
                                >
                                    <YouTubeIcon size={16} /> YouTube
                                </a>
                            </div>
                        </div>

                        {/* Stream-while-play stats banner */}
                        <div style={{
                            background: "linear-gradient(135deg, rgba(145,70,255,0.15), rgba(0,112,209,0.15))",
                            border: "1px solid rgba(145,70,255,0.2)", borderRadius: "16px",
                            padding: "20px 24px", marginBottom: "28px",
                            display: "flex", alignItems: "center", gap: "24px", flexWrap: "wrap",
                        }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "rgba(145,70,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <TwitchIcon size={22} />
                                </div>
                                <div>
                                    <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", fontFamily: "var(--font-ui)" }}>Stream-While-Play</div>
                                    <div style={{ fontSize: "15px", fontWeight: 700, fontFamily: "var(--font-display)" }}>Connect your Twitch</div>
                                </div>
                            </div>
                            {[
                                { label: "PS5 Live Streams", value: "42.1K" },
                                { label: "Viewers Right Now", value: "2.8M" },
                                { label: "Top Game", value: "CoD" },
                            ].map(stat => (
                                <div key={stat.label} style={{ textAlign: "center", borderLeft: "1px solid rgba(255,255,255,0.08)", paddingLeft: "24px" }}>
                                    <div style={{ fontSize: "22px", fontWeight: 900, color: "#9146ff", fontFamily: "var(--font-display)" }}>{stat.value}</div>
                                    <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.45)", marginTop: "2px", fontFamily: "var(--font-ui)" }}>{stat.label}</div>
                                </div>
                            ))}
                            <button style={{
                                marginLeft: "auto", padding: "10px 20px", borderRadius: "10px",
                                background: "#9146ff", border: "none", cursor: "pointer",
                                color: "#fff", fontWeight: 700, fontSize: "13px",
                                boxShadow: "0 4px 16px rgba(145,70,255,0.4)",
                                transition: "all 0.2s",
                            }}
                                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.04)"}
                                onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                            >
                                Enable Streaming
                            </button>
                        </div>

                        {/* Live Streamers Grid */}
                        <h3 style={{ fontSize: "13px", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: "16px" }}>
                            Popular Streamers Playing Your Games
                        </h3>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "16px" }}>
                            {twitchStreamers.map(streamer => (
                                <motion.a
                                    key={streamer.id}
                                    href={streamer.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="streamer-card"
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    whileHover={{ y: -4 }}
                                    style={{
                                        background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                                        borderRadius: "16px", overflow: "hidden", textDecoration: "none", color: "#fff",
                                        display: "block", cursor: "pointer",
                                        boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
                                        transition: "all 0.25s ease",
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.border = `1px solid ${streamer.platform === "youtube" ? "#ff000044" : "#9146ff44"}`;
                                        e.currentTarget.style.boxShadow = `0 12px 32px rgba(0,0,0,0.5)`;
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.border = "1px solid rgba(255,255,255,0.08)";
                                        e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.3)";
                                    }}
                                >
                                    {/* Thumbnail */}
                                    <div style={{ position: "relative", aspectRatio: "16/9", overflow: "hidden" }}>
                                        <img src={streamer.thumbnail} alt={streamer.name}
                                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                            onError={e => { e.target.style.background = "#1a1f2e"; e.target.style.display = "none"; }}
                                        />
                                        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)" }} />

                                        {/* Live badge or platform */}
                                        <div style={{
                                            position: "absolute", top: "8px", left: "8px",
                                            display: "flex", alignItems: "center",
                                            background: streamer.isLive ? "#9146ff" : "#ff0000",
                                            borderRadius: "6px", padding: "3px 10px",
                                            fontSize: "10px", fontWeight: 800, letterSpacing: "0.5px", fontFamily: "var(--font-ui)",
                                        }}>
                                            {streamer.isLive ? (
                                                <><LiveDot />{streamer.platform === "youtube" ? <YouTubeIcon size={10} /> : <TwitchIcon size={10} />} LIVE</>
                                            ) : (
                                                <><YouTubeIcon size={10} style={{ marginRight: "4px" }} /> YOUTUBE</>
                                            )}
                                        </div>

                                        {/* Viewers */}
                                        {streamer.isLive && (
                                            <div style={{
                                                position: "absolute", bottom: "8px", right: "8px",
                                                background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)",
                                                borderRadius: "6px", padding: "3px 10px",
                                                fontSize: "11px", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px", fontFamily: "var(--font-ui)",
                                            }}>
                                                <ViewersIcon /> {streamer.viewers}
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div style={{ padding: "12px 14px" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                                            <div style={{
                                                width: "32px", height: "32px", borderRadius: "50%",
                                                background: streamer.avatarColor, flexShrink: 0,
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                fontSize: "11px", fontWeight: 700, color: "#fff",
                                                border: `2px solid ${streamer.avatarColor}88`,
                                            }}>
                                                {streamer.avatar}
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ fontSize: "13px", fontWeight: 700, color: "#fff", fontFamily: "var(--font-display)" }}>{streamer.name}</div>
                                                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.45)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "var(--font-body)" }}>{streamer.game}</div>
                                            </div>
                                        </div>
                                        <div style={{
                                            background: "rgba(255,255,255,0.05)", borderRadius: "6px",
                                            padding: "4px 10px", fontSize: "10px", fontWeight: 600,
                                            color: "rgba(255,255,255,0.45)", display: "inline-block",
                                            letterSpacing: "0.3px", fontFamily: "var(--font-ui)",
                                        }}>
                                            {streamer.category}
                                        </div>
                                    </div>
                                </motion.a>
                            ))}
                        </div>
                    </div>
                )}

                {/* ═══════ YOUTUBE SECTION ═══════ */}
                {activeSection === "YouTube" && (
                    <div style={{ padding: "24px 48px 40px" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
                            <div>
                                <h2 style={{ fontSize: "28px", fontWeight: 900, marginBottom: "4px", fontFamily: "var(--font-display)" }}>PlayStation on YouTube</h2>
                                <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-body)" }}>Official trailers, gameplay, and more</p>
                            </div>
                            <a href="https://www.youtube.com/@PlayStation" target="_blank" rel="noopener noreferrer"
                                style={{
                                    display: "flex", alignItems: "center", gap: "8px",
                                    padding: "10px 18px", borderRadius: "10px",
                                    background: "#ff0000", textDecoration: "none",
                                    color: "#fff", fontSize: "13px", fontWeight: 700, fontFamily: "var(--font-ui)",
                                }}
                            >
                                <YouTubeIcon size={16} /> Subscribe
                            </a>
                        </div>

                        {/* Stats banner */}
                        <div style={{
                            background: "linear-gradient(135deg, rgba(255,0,0,0.1), rgba(0,0,0,0.3))",
                            border: "1px solid rgba(255,0,0,0.15)", borderRadius: "16px",
                            padding: "20px 24px", marginBottom: "28px",
                            display: "flex", gap: "32px", alignItems: "center", flexWrap: "wrap",
                        }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(255,0,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <YouTubeIcon size={26} />
                                </div>
                                <div>
                                    <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.5px", fontFamily: "var(--font-ui)" }}>PlayStation Channel</div>
                                    <div style={{ fontSize: "18px", fontWeight: 800, fontFamily: "var(--font-display)" }}>18.7M Subscribers</div>
                                </div>
                            </div>
                            {[
                                { label: "Total Videos", value: "12.4K" },
                                { label: "Total Views", value: "12.8B" },
                            ].map(s => (
                                <div key={s.label} style={{ textAlign: "center", borderLeft: "1px solid rgba(255,255,255,0.08)", paddingLeft: "32px" }}>
                                    <div style={{ fontSize: "24px", fontWeight: 900, color: "#ff4444", fontFamily: "var(--font-display)" }}>{s.value}</div>
                                    <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-ui)" }}>{s.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Videos */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
                            {youtubeContent.map((video, i) => (
                                <motion.a
                                    key={video.id}
                                    href={video.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="yt-card"
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    style={{
                                        background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                                        borderRadius: "16px", overflow: "hidden", textDecoration: "none", color: "#fff",
                                        display: "block", cursor: "pointer",
                                        transition: "all 0.25s ease",
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.border = "1px solid rgba(255,0,0,0.3)"; e.currentTarget.style.boxShadow = "0 12px 32px rgba(0,0,0,0.5)"; }}
                                    onMouseLeave={e => { e.currentTarget.style.border = "1px solid rgba(255,255,255,0.08)"; e.currentTarget.style.boxShadow = "none"; }}
                                >
                                    <div style={{ position: "relative", aspectRatio: "16/9" }}>
                                        <img src={video.thumb} alt={video.title} style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                            onError={e => e.target.style.background = "#1a1f2e"}
                                        />
                                        <div style={{ position: "absolute", bottom: "8px", right: "8px", background: "rgba(0,0,0,0.85)", borderRadius: "4px", padding: "2px 6px", fontSize: "11px", fontWeight: 700, fontFamily: "var(--font-ui)" }}>
                                            {video.duration}
                                        </div>
                                        <div style={{ position: "absolute", inset: 0, background: "rgba(255,0,0,0)", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s" }}
                                            onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,0.4)"}
                                            onMouseLeave={e => e.currentTarget.style.background = "rgba(0,0,0,0)"}
                                        >
                                            <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "rgba(255,0,0,0.9)", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "opacity 0.2s" }}
                                                className="play-btn">
                                                <PlayIcon size={18} />
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ padding: "14px 16px" }}>
                                        <div style={{ fontSize: "14px", fontWeight: 700, marginBottom: "8px", lineHeight: 1.3, fontFamily: "var(--font-display)" }}>{video.title}</div>
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: video.avatarColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", fontWeight: 800 }}>
                                                {video.avatar}
                                            </div>
                                            <div>
                                                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", fontWeight: 600, fontFamily: "var(--font-ui)" }}>{video.channel} {video.verified && "✓"}</div>
                                                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-body)" }}>{video.views}</div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.a>
                            ))}
                        </div>
                    </div>
                )}

                {/* ═══════ MUSIC SECTION ═══════ */}
                {activeSection === "Music" && (
                    <div style={{ padding: "24px 48px 40px", height: "calc(100vh - 200px)" }}>
                        <div style={{ marginBottom: "16px" }}>
                            <h2 style={{ fontSize: "28px", fontWeight: 900, marginBottom: "8px", fontFamily: "var(--font-display)" }}>Vibify</h2>
                        
                        </div>
                        <iframe
                            src="https://vibeify-obql.onrender.com/"
                            style={{
                                width: "100%",
                                height: "75vh",
                                border: "1px solid rgba(255,255,255,0.1)",
                                borderRadius: "16px",
                                background: "#0a0e1a",
                            }}
                            title="Vibify Music Visualizer"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; microphone"
                            sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-presentation"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default PSMediaUI;
