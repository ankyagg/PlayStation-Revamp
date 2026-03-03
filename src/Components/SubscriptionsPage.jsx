/**
 * SubscriptionsPage.jsx — PS Plus Subscription Management
 *
 * Features:
 *  • PS Plus Essential / Extra / Premium plans
 *  • Current subscription status
 *  • Payment integration (calls PaymentModal)
 *  • Beautiful PS5-style UI with glassmorphism
 */
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PaymentModal from "./PaymentModal";

const CheckIcon = ({ color = "#0070d1" }) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);
const StarIcon = ({ size = 20, fill = "currentColor" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
);

const PLANS = [
    {
        id: "essential",
        name: "PS Plus Essential",
        tagline: "The Gateway Plan",
        monthlyPrice: "₹499",
        yearlyPrice: "₹3,999",
        color: "#0070d1",
        gradient: "linear-gradient(135deg, #003087, #0070d1)",
        icon: "🎮",
        features: [
            { text: "2 Monthly PS4™ Free Games", included: true },
            { text: "Exclusive Member Discounts", included: true },
            { text: "Online Multiplayer Access", included: true },
            { text: "Cloud Storage (100GB)", included: true },
            { text: "Share Play", included: true },
            { text: "PS4 & PS5 Game Catalog", included: false },
            { text: "Classic Games (PS1/PS2/PSP)", included: false },
            { text: "Game Trials", included: false },
            { text: "Cloud Streaming", included: false },
        ],
    },
    {
        id: "extra",
        name: "PS Plus Extra",
        tagline: "The Complete Experience",
        monthlyPrice: "₹999",
        yearlyPrice: "₹7,499",
        color: "#9b59b6",
        gradient: "linear-gradient(135deg, #6c3483, #9b59b6)",
        icon: "⭐",
        popular: true,
        features: [
            { text: "2 Monthly PS4™ Free Games", included: true },
            { text: "Exclusive Member Discounts", included: true },
            { text: "Online Multiplayer Access", included: true },
            { text: "Cloud Storage (100GB)", included: true },
            { text: "Share Play", included: true },
            { text: "400+ PS4 & PS5 Game Catalog", included: true },
            { text: "Ubisoft+ Classics", included: true },
            { text: "Game Trials", included: true },
            { text: "Cloud Streaming", included: false },
        ],
    },
    {
        id: "premium",
        name: "PS Plus Premium",
        tagline: "The Ultimate Pass",
        monthlyPrice: "₹1,349",
        yearlyPrice: "₹9,999",
        color: "#f5a623",
        gradient: "linear-gradient(135deg, #b7771d, #f5a623)",
        icon: "👑",
        features: [
            { text: "2 Monthly PS4™ Free Games", included: true },
            { text: "Exclusive Member Discounts", included: true },
            { text: "Online Multiplayer Access", included: true },
            { text: "Cloud Storage (100GB)", included: true },
            { text: "Share Play", included: true },
            { text: "700+ PS4 & PS5 Game Catalog", included: true },
            { text: "Ubisoft+ Classics", included: true },
            { text: "Game Trials", included: true },
            { text: "Cloud Streaming (Classic games)", included: true },
        ],
    },
];

const BENEFITS = [
    { icon: "🎁", title: "Free Monthly Games", desc: "Get 2 free PS4/PS5 games every month to keep forever" },
    { icon: "🌐", title: "Online Multiplayer", desc: "Play with friends and strangers across the globe" },
    { icon: "☁️", title: "Cloud Storage", desc: "Save your game data in the cloud — never lose progress" },
    { icon: "💸", title: "Exclusive Discounts", desc: "Up to 60% off PS Store titles for members only" },
    { icon: "📚", title: "Game Catalog", desc: "Hundreds of PS4 & PS5 games to download and play" },
    { icon: "🎮", title: "Share Play", desc: "Let a friend play your games remotely for free" },
];

const SubscriptionsPage = () => {
    const [billingCycle, setBillingCycle] = useState("monthly");
    const [showPayment, setShowPayment] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [currentPlan] = useState("essential"); // Simulate user is on Essential

    const handleSubscribe = (plan) => {
        setSelectedPlan(plan);
        setShowPayment(true);
    };

    return (
        <div style={{
            minHeight: "100vh",
            background: "#050810",
            color: "#fff",
            paddingTop: "80px",
            overflowY: "auto",
        }}>
            <style>{`
                .sub-scroll::-webkit-scrollbar { width: 4px; }
                .sub-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
                @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
            `}</style>

            {/* Background */}
            <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
                <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 30% 20%, rgba(0,112,209,0.12) 0%, transparent 55%)" }} />
                <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 70% 80%, rgba(155,89,182,0.1) 0%, transparent 50%)" }} />
                {[...Array(50)].map((_, i) => (
                    <div key={i} style={{
                        position: "absolute",
                        width: "1px", height: "1px",
                        background: `rgba(255,255,255,${0.2 + Math.random() * 0.5})`,
                        borderRadius: "50%",
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }} />
                ))}
            </div>

            <div style={{ position: "relative", zIndex: 10, maxWidth: "1200px", margin: "0 auto", padding: "40px 40px 80px" }}>

                {/* ── HERO HEADER ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ textAlign: "center", marginBottom: "48px" }}
                >
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                        <div style={{
                            background: "linear-gradient(135deg, #0070d1, #9b59b6, #f5a623)",
                            backgroundSize: "200% 200%",
                            animation: "shimmer 3s ease infinite",
                            borderRadius: "12px", padding: "8px 20px",
                            fontSize: "13px", fontWeight: 400,
                            fontFamily: "var(--font-ui)",
                            letterSpacing: "1px",
                            textTransform: "uppercase",
                        }}>
                            ✨ PlayStation Plus
                        </div>
                    </div>
                    <h1 style={{ fontSize: "52px", fontWeight: 900, letterSpacing: "-2px", marginBottom: "16px", lineHeight: 1 }}>
                        Level Up Your
                        <span style={{
                            display: "block",
                            background: "linear-gradient(135deg, #0070d1, #9b59b6, #f5a623)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                        }}>
                            Gaming Experience
                        </span>
                    </h1>
                    <p style={{ fontSize: "18px", color: "rgba(255,255,255,0.55)", maxWidth: "520px", margin: "0 auto 32px", lineHeight: 1.6 }}>
                        Choose the plan that fits your play style. Cancel anytime, no commitments.
                    </p>

                    {/* Current plan badge */}
                    <div style={{
                        display: "inline-flex", alignItems: "center", gap: "8px",
                        background: "rgba(0,112,209,0.15)", border: "1px solid rgba(0,112,209,0.3)",
                        borderRadius: "20px", padding: "6px 16px",
                        fontSize: "13px", fontWeight: 600, color: "#4da6ff",
                    }}>
                        <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#4da6ff", boxShadow: "0 0 8px #4da6ff" }} />
                        Current Plan: PS Plus Essential
                    </div>

                    {/* Billing toggle */}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginTop: "28px" }}>
                        <span style={{ fontSize: "15px", color: billingCycle === "monthly" ? "#fff" : "rgba(255,255,255,0.4)", fontFamily: "var(--font-ui)", transition: "color 0.2s" }}>Monthly</span>
                        <button
                            onClick={() => setBillingCycle(prev => prev === "monthly" ? "yearly" : "monthly")}
                            style={{
                                width: "52px", height: "28px", borderRadius: "14px",
                                background: billingCycle === "yearly" ? "#0070d1" : "rgba(255,255,255,0.15)",
                                border: "none", cursor: "pointer", position: "relative", transition: "background 0.3s",
                            }}
                        >
                            <div style={{
                                position: "absolute", top: "3px",
                                left: billingCycle === "yearly" ? "26px" : "3px",
                                width: "22px", height: "22px", borderRadius: "50%",
                                background: "#fff", transition: "left 0.3s ease",
                            }} />
                        </button>
                        <span style={{ fontSize: "15px", color: billingCycle === "yearly" ? "#fff" : "rgba(255,255,255,0.4)", fontFamily: "var(--font-ui)", transition: "color 0.2s" }}>
                            Yearly
                            <span style={{
                                marginLeft: "6px", background: "#00c853", borderRadius: "8px",
                                padding: "1px 7px", fontSize: "10px", fontWeight: 800,
                                color: "#fff", opacity: billingCycle === "yearly" ? 1 : 0.5,
                            }}>SAVE 30%</span>
                        </span>
                    </div>
                </motion.div>

                {/* ── PLANS GRID ── */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "64px" }}>
                    {PLANS.map((plan, i) => (
                        <motion.div
                            data-focusable
                            key={plan.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            style={{
                                position: "relative",
                                background: plan.popular
                                    ? "linear-gradient(155deg, rgba(20,10,40,0.95) 0%, rgba(12,6,30,0.95) 100%)"
                                    : "rgba(255,255,255,0.04)",
                                border: plan.popular ? `1px solid ${plan.color}55` : "1px solid rgba(255,255,255,0.08)",
                                borderRadius: "20px",
                                overflow: "hidden",
                                boxShadow: plan.popular ? `0 20px 60px ${plan.color}22` : "0 4px 20px rgba(0,0,0,0.3)",
                                transition: "all 0.3s ease",
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = "translateY(-6px)";
                                e.currentTarget.style.boxShadow = `0 24px 64px ${plan.color}33`;
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = plan.popular ? `0 20px 60px ${plan.color}22` : "0 4px 20px rgba(0,0,0,0.3)";
                            }}
                        >
                            {/* Popular badge */}
                            {plan.popular && (
                                <div style={{
                                    position: "absolute", top: 0, left: 0, right: 0,
                                    height: "3px", background: plan.gradient,
                                }} />
                            )}
                            {plan.popular && (
                                <div style={{
                                    position: "absolute", top: "16px", right: "16px",
                                    background: plan.gradient, borderRadius: "20px",
                                    padding: "4px 12px", fontSize: "10px", fontWeight: 800, letterSpacing: "0.5px",
                                }}>
                                    ⭐ MOST POPULAR
                                </div>
                            )}

                            {/* Plan header */}
                            <div style={{ padding: "28px 24px 20px" }}>
                                <div style={{ fontSize: "32px", marginBottom: "8px" }}>{plan.icon}</div>
                                <div style={{ fontSize: "20px", fontWeight: 700, fontFamily: "var(--font-display)", marginBottom: "4px" }}>{plan.name}</div>
                                <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-ui)", marginBottom: "20px" }}>{plan.tagline}</div>

                                {/* Price */}
                                <div style={{ marginBottom: "20px" }}>
                                    <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                                        <span style={{ fontSize: "36px", fontWeight: 900, color: plan.color }}>
                                            {billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice}
                                        </span>
                                        <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)" }}>
                                            /{billingCycle === "monthly" ? "mo" : "yr"}
                                        </span>
                                    </div>
                                    {billingCycle === "yearly" && (
                                        <div style={{ fontSize: "12px", color: "#00c853", marginTop: "4px" }}>
                                            You save ₹{parseInt(plan.monthlyPrice.replace("₹", "")) * 12 - parseInt(plan.yearlyPrice.replace("₹", ""))} per year
                                        </div>
                                    )}
                                </div>

                                {/* CTA Button */}
                                {currentPlan === plan.id ? (
                                    <div style={{
                                        padding: "12px", borderRadius: "12px",
                                        background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
                                        textAlign: "center", fontSize: "14px", fontWeight: 700, color: "rgba(255,255,255,0.5)",
                                    }}>
                                        ✓ Current Plan
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => handleSubscribe(plan)}
                                        style={{
                                            width: "100%", padding: "12px", borderRadius: "12px",
                                            background: plan.popular ? plan.gradient : "rgba(255,255,255,0.08)",
                                            border: plan.popular ? "none" : `1px solid ${plan.color}44`,
                                            cursor: "pointer", color: "#fff",
                                            fontFamily: "var(--font-ui)",
                                            fontSize: "15px", letterSpacing: "0.5px",
                                            boxShadow: plan.popular ? `0 6px 20px ${plan.color}44` : "none",
                                            transition: "all 0.2s",
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.02)"}
                                        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                                    >
                                        {plan.id === "premium" ? "Upgrade to Premium" : plan.id === "extra" ? "Upgrade to Extra" : "Downgrade to Essential"}
                                    </button>
                                )}
                            </div>

                            {/* Divider */}
                            <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", margin: "0 24px" }} />

                            {/* Features */}
                            <div style={{ padding: "20px 24px 24px" }}>
                                <div style={{ fontSize: "13px", fontWeight: 700, fontFamily: "var(--font-ui)", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "1.5px", marginBottom: "14px" }}>
                                    What's Included
                                </div>
                                {plan.features.map((f, fi) => (
                                    <div key={fi} style={{
                                        display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "10px",
                                        opacity: f.included ? 1 : 0.35,
                                    }}>
                                        <div style={{
                                            width: "20px", height: "20px", borderRadius: "50%", flexShrink: 0, marginTop: "1px",
                                            background: f.included ? `${plan.color}22` : "rgba(255,255,255,0.05)",
                                            border: f.included ? `1px solid ${plan.color}44` : "1px solid rgba(255,255,255,0.1)",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                        }}>
                                            {f.included ? <CheckIcon color={plan.color} /> : <span style={{ fontSize: "8px", color: "rgba(255,255,255,0.25)" }}>✕</span>}
                                        </div>
                                        <span style={{ fontSize: "14px", lineHeight: 1.4, color: f.included ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.4)" }}>
                                            {f.text}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* ── BENEFITS SECTION ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <h2 style={{ fontSize: "32px", fontWeight: 900, textAlign: "center", marginBottom: "8px" }}>Why PS Plus?</h2>
                    <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.45)", textAlign: "center", marginBottom: "40px" }}>
                        Join millions of players enjoying these exclusive benefits
                    </p>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "48px" }}>
                        {BENEFITS.map((b, i) => (
                            <motion.div
                                data-focusable
                                key={b.title}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 + i * 0.07 }}
                                style={{
                                    padding: "24px",
                                    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                                    borderRadius: "16px", transition: "all 0.25s ease",
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                                    e.currentTarget.style.borderColor = "rgba(0,112,209,0.3)";
                                    e.currentTarget.style.transform = "translateY(-3px)";
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                                    e.currentTarget.style.transform = "translateY(0)";
                                }}
                            >
                                <div style={{ fontSize: "32px", marginBottom: "12px" }}>{b.icon}</div>
                                <div style={{ fontSize: "17px", fontWeight: 700, fontFamily: "var(--font-display)", marginBottom: "6px" }}>{b.title}</div>
                                <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>{b.desc}</div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* ── FAQ / CANCEL INFO ── */}
                <div style={{
                    textAlign: "center", padding: "32px",
                    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: "20px",
                }}>
                    <div style={{ fontSize: "24px", fontWeight: 800, marginBottom: "8px" }}>No risk, cancel anytime</div>
                    <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.45)", maxWidth: "480px", margin: "0 auto", lineHeight: 1.6 }}>
                        Your subscription automatically renews until cancelled. Cancel before your renewal date to avoid being charged for the next period.
                    </div>
                </div>
            </div>

            {/* Payment Modal */}
            {showPayment && selectedPlan && (
                <PaymentModal
                    mode="subscription"
                    onClose={() => { setShowPayment(false); setSelectedPlan(null); }}
                />
            )}
        </div>
    );
};

export default SubscriptionsPage;
