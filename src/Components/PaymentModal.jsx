/**
 * PaymentModal.jsx — Stripe/PayPal Style Payment Checkout
 *
 * Features:
 *  • Card payment (Stripe-style UI)
 *  • PayPal option
 *  • PS Store wallet top-up
 *  • Subscription plans
 *  • Premium glassmorphism design
 */
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const CardIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" />
    </svg>
);
const PayPalIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="#003087">
        <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.969.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.395.842-4.395h1.33c3.73 0 6.655-1.517 7.509-5.903.356-1.845.174-3.384-.574-4.997z" />
    </svg>
);
const LockIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
);
const CheckIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);
const PSPlusIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
    </svg>
);

const PAYMENT_METHODS = [
    { id: "card", label: "Credit / Debit Card", icon: <CardIcon /> },
    { id: "paypal", label: "PayPal", icon: <PayPalIcon /> },
    { id: "wallet", label: "PS Wallet (₹2,340)", icon: "💳" },
];

const PS_PLUS_PLANS = [
    {
        id: "essential",
        name: "PS Plus Essential",
        price: "₹499",
        period: "/month",
        color: "#0070d1",
        features: ["2 Monthly PS4™ Games", "Exclusive Discounts", "Online Multiplayer", "Cloud Storage (100GB)"],
    },
    {
        id: "extra",
        name: "PS Plus Extra",
        price: "₹999",
        period: "/month",
        color: "#9b59b6",
        popular: true,
        features: ["All Essential benefits", "400+ PS4 & PS5 Games", "Ubisoft+ Classics", "Game Trials"],
    },
    {
        id: "premium",
        name: "PS Plus Premium",
        price: "₹1,349",
        period: "/month",
        color: "#f5a623",
        features: ["All Extra benefits", "700+ Games Library", "Classic PS1/PS2/PSP Games", "Cloud Streaming", "Game Trials"],
    },
];

const PaymentModal = ({ game, onClose, mode = "purchase" }) => {
    const [payMethod, setPayMethod] = useState("card");
    const [cardNum, setCardNum] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvv, setCvv] = useState("");
    const [name, setName] = useState("");
    const [step, setStep] = useState("method"); // method | details | confirm | success
    const [processing, setProcessing] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState("extra");

    const formatCard = (v) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
    const formatExpiry = (v) => {
        const d = v.replace(/\D/g, "").slice(0, 4);
        return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
    };

    const handlePay = () => {
        setProcessing(true);
        setTimeout(() => { setProcessing(false); setStep("success"); }, 2200);
    };

    const inputStyle = {
        width: "100%", padding: "13px 16px",
        background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: "12px", color: "#fff", fontSize: "14px", outline: "none",
        fontFamily: "'Inter', sans-serif", transition: "border-color 0.2s",
        boxSizing: "border-box",
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                    position: "fixed", inset: 0, zIndex: 99999,
                    background: "rgba(0,0,0,0.88)", backdropFilter: "blur(24px)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    padding: "20px",
                }}
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 24 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 26 }}
                    onClick={e => e.stopPropagation()}
                    style={{
                        width: "min(560px, 95vw)",
                        background: "linear-gradient(155deg, rgba(12,16,30,0.99) 0%, rgba(6,10,22,0.99) 100%)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "24px",
                        overflow: "hidden",
                        boxShadow: "0 40px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.05)",
                        fontFamily: "'Inter', sans-serif",
                        color: "#fff",
                    }}
                >
                    {/* Header */}
                    <div style={{
                        padding: "24px 28px 20px",
                        borderBottom: "1px solid rgba(255,255,255,0.06)",
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        background: "linear-gradient(to right, rgba(0,112,209,0.1), transparent)",
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <div style={{
                                width: "40px", height: "40px", borderRadius: "10px",
                                background: "linear-gradient(135deg, #0070d1, #00d4ff)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: "18px",
                            }}>
                                {mode === "subscription" ? "⭐" : "🛒"}
                            </div>
                            <div>
                                <div style={{ fontSize: "17px", fontWeight: 800 }}>
                                    {mode === "subscription" ? "Choose Your Plan" : "Secure Checkout"}
                                </div>
                                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", display: "flex", alignItems: "center", gap: "4px" }}>
                                    <LockIcon /> SSL Secured Checkout
                                </div>
                            </div>
                        </div>
                        <button onClick={onClose} style={{
                            background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: "50%", width: "32px", height: "32px", cursor: "pointer",
                            color: "rgba(255,255,255,0.6)", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center",
                            transition: "all 0.2s",
                        }}
                            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.14)"}
                            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.07)"}
                        >✕</button>
                    </div>

                    <div style={{ padding: "24px 28px" }}>

                        {/* ── SUCCESS ── */}
                        {step === "success" && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                style={{ textAlign: "center", padding: "20px 0" }}
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 12 }}
                                    style={{
                                        width: "80px", height: "80px", borderRadius: "50%",
                                        background: "linear-gradient(135deg, #00e676, #00c853)",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        margin: "0 auto 20px",
                                        boxShadow: "0 8px 32px rgba(0,230,118,0.4)",
                                    }}
                                >
                                    <CheckIcon />
                                </motion.div>
                                <div style={{ fontSize: "24px", fontWeight: 900, marginBottom: "8px" }}>Payment Successful!</div>
                                <div style={{ fontSize: "15px", color: "rgba(255,255,255,0.55)", marginBottom: "6px" }}>
                                    {mode === "subscription" ? `PS Plus ${PS_PLUS_PLANS.find(p => p.id === selectedPlan)?.name} activated` : `${game?.title} added to your library`}
                                </div>
                                <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", marginBottom: "28px" }}>
                                    Confirmation sent to your email
                                </div>
                                <button onClick={onClose} style={{
                                    padding: "12px 36px", borderRadius: "12px",
                                    background: "linear-gradient(135deg, #0070d1, #00d4ff)",
                                    border: "none", cursor: "pointer", color: "#fff",
                                    fontWeight: 700, fontSize: "14px",
                                    boxShadow: "0 6px 20px rgba(0,112,209,0.4)",
                                    transition: "all 0.2s",
                                }}
                                    onMouseEnter={e => e.currentTarget.style.transform = "scale(1.03)"}
                                    onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                                >
                                    Done
                                </button>
                            </motion.div>
                        )}

                        {/* ── SUBSCRIPTION PLANS ── */}
                        {step === "method" && mode === "subscription" && (
                            <div>
                                <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
                                    {PS_PLUS_PLANS.map(plan => (
                                        <motion.div
                                            key={plan.id}
                                            onClick={() => setSelectedPlan(plan.id)}
                                            whileHover={{ scale: 1.01 }}
                                            style={{
                                                padding: "16px 20px", borderRadius: "14px", cursor: "pointer",
                                                border: selectedPlan === plan.id ? `2px solid ${plan.color}` : "2px solid rgba(255,255,255,0.08)",
                                                background: selectedPlan === plan.id ? `${plan.color}18` : "rgba(255,255,255,0.04)",
                                                transition: "all 0.2s",
                                                position: "relative",
                                            }}
                                        >
                                            {plan.popular && (
                                                <div style={{
                                                    position: "absolute", top: "-10px", right: "16px",
                                                    background: plan.color, borderRadius: "20px",
                                                    padding: "3px 12px", fontSize: "10px", fontWeight: 800, letterSpacing: "0.5px",
                                                }}>MOST POPULAR</div>
                                            )}
                                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                                                <div style={{ fontSize: "15px", fontWeight: 700 }}>{plan.name}</div>
                                                <div style={{ textAlign: "right" }}>
                                                    <span style={{ fontSize: "22px", fontWeight: 900, color: plan.color }}>{plan.price}</span>
                                                    <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)" }}>{plan.period}</span>
                                                </div>
                                            </div>
                                            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                                                {plan.features.map(f => (
                                                    <div key={f} style={{
                                                        display: "flex", alignItems: "center", gap: "4px",
                                                        fontSize: "11px", color: "rgba(255,255,255,0.55)",
                                                        background: "rgba(255,255,255,0.05)", borderRadius: "6px",
                                                        padding: "3px 8px",
                                                    }}>
                                                        <span style={{ color: plan.color, fontSize: "8px" }}>✓</span> {f}
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                                <button onClick={() => setStep("details")} style={{
                                    width: "100%", padding: "14px",
                                    background: `linear-gradient(135deg, ${PS_PLUS_PLANS.find(p => p.id === selectedPlan)?.color}, ${PS_PLUS_PLANS.find(p => p.id === selectedPlan)?.color}bb)`,
                                    border: "none", borderRadius: "12px", cursor: "pointer",
                                    color: "#fff", fontWeight: 700, fontSize: "15px",
                                    boxShadow: `0 6px 24px ${PS_PLUS_PLANS.find(p => p.id === selectedPlan)?.color}44`,
                                    transition: "all 0.2s",
                                }}>
                                    Continue with {PS_PLUS_PLANS.find(p => p.id === selectedPlan)?.name}
                                </button>
                            </div>
                        )}

                        {/* ── GAME PURCHASE SUMMARY ── */}
                        {step === "method" && mode === "purchase" && game && (
                            <div>
                                {/* Game Info Card */}
                                <div style={{
                                    display: "flex", gap: "14px", padding: "16px",
                                    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                                    borderRadius: "14px", marginBottom: "20px",
                                }}>
                                    <div style={{
                                        width: "60px", height: "60px", borderRadius: "10px", flexShrink: 0,
                                        background: "linear-gradient(135deg, #1a2040, #0d1128)",
                                        overflow: "hidden",
                                    }}>
                                        {game.thumb && <img src={game.thumb} alt={game.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: "15px", fontWeight: 700 }}>{game.title}</div>
                                        <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", marginTop: "2px" }}>PS5 Digital</div>
                                        <div style={{ fontSize: "20px", fontWeight: 900, color: "#0090ff", marginTop: "4px" }}>{game.price}</div>
                                    </div>
                                </div>

                                {/* Payment methods */}
                                <div style={{ marginBottom: "20px" }}>
                                    <div style={{ fontSize: "12px", fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "10px" }}>
                                        Payment Method
                                    </div>
                                    {PAYMENT_METHODS.map(m => (
                                        <motion.button
                                            key={m.id}
                                            onClick={() => setPayMethod(m.id)}
                                            whileHover={{ scale: 1.01 }}
                                            style={{
                                                width: "100%", display: "flex", alignItems: "center", gap: "12px",
                                                padding: "13px 16px", marginBottom: "8px", borderRadius: "12px",
                                                background: payMethod === m.id ? "rgba(0,112,209,0.15)" : "rgba(255,255,255,0.04)",
                                                border: payMethod === m.id ? "2px solid rgba(0,112,209,0.6)" : "2px solid rgba(255,255,255,0.07)",
                                                cursor: "pointer", color: "#fff", textAlign: "left",
                                                transition: "all 0.2s",
                                            }}
                                        >
                                            <div style={{ width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>
                                                {m.icon}
                                            </div>
                                            <span style={{ fontWeight: 600, fontSize: "14px" }}>{m.label}</span>
                                            {payMethod === m.id && (
                                                <div style={{ marginLeft: "auto", width: "20px", height: "20px", borderRadius: "50%", background: "#0070d1", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                    <CheckIcon />
                                                </div>
                                            )}
                                        </motion.button>
                                    ))}
                                </div>

                                <button onClick={() => setStep("details")} style={{
                                    width: "100%", padding: "14px",
                                    background: "linear-gradient(135deg, #0070d1, #00a8ff)",
                                    border: "none", borderRadius: "12px", cursor: "pointer",
                                    color: "#fff", fontWeight: 700, fontSize: "15px",
                                    boxShadow: "0 6px 24px rgba(0,112,209,0.4)",
                                    transition: "all 0.2s",
                                }}>
                                    Continue →
                                </button>
                            </div>
                        )}

                        {/* ── CARD DETAILS ── */}
                        {step === "details" && (
                            <div>
                                <button onClick={() => setStep("method")} style={{
                                    background: "none", border: "none", cursor: "pointer",
                                    color: "rgba(255,255,255,0.5)", fontSize: "13px", fontWeight: 600,
                                    display: "flex", alignItems: "center", gap: "4px", marginBottom: "20px",
                                    padding: "0",
                                }}>
                                    ← Back
                                </button>

                                {payMethod === "paypal" ? (
                                    <div style={{ textAlign: "center", padding: "20px 0" }}>
                                        <div style={{ fontSize: "48px", marginBottom: "16px" }}>🅿️</div>
                                        <div style={{ fontSize: "18px", fontWeight: 800, marginBottom: "8px", color: "#003087" }}>PayPal</div>
                                        <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", marginBottom: "24px" }}>
                                            You'll be redirected to PayPal to complete your payment securely
                                        </p>
                                        <button onClick={handlePay} style={{
                                            width: "100%", padding: "14px",
                                            background: "#ffc439", border: "none", borderRadius: "12px",
                                            cursor: "pointer", color: "#0a0a0a", fontWeight: 800, fontSize: "16px",
                                            boxShadow: "0 4px 16px rgba(255,196,57,0.4)", transition: "all 0.2s",
                                        }}>
                                            Pay with PayPal
                                        </button>
                                    </div>
                                ) : payMethod === "wallet" ? (
                                    <div style={{ textAlign: "center", padding: "20px 0" }}>
                                        <div style={{ fontSize: "48px", marginBottom: "16px" }}>💳</div>
                                        <div style={{ fontSize: "18px", fontWeight: 800, marginBottom: "8px" }}>PS Wallet Balance</div>
                                        <div style={{ fontSize: "36px", fontWeight: 900, color: "#0090ff", marginBottom: "6px" }}>₹2,340</div>
                                        <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", marginBottom: "24px" }}>
                                            Sufficient balance for this purchase
                                        </p>
                                        <button onClick={handlePay} style={{
                                            width: "100%", padding: "14px",
                                            background: "linear-gradient(135deg, #0070d1, #00a8ff)",
                                            border: "none", borderRadius: "12px",
                                            cursor: "pointer", color: "#fff", fontWeight: 700, fontSize: "15px",
                                            boxShadow: "0 6px 20px rgba(0,112,209,0.4)", transition: "all 0.2s",
                                        }}>
                                            Pay from Wallet
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <div style={{ fontSize: "12px", fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "16px" }}>
                                            Card Details
                                        </div>

                                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                            <div>
                                                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", marginBottom: "6px" }}>Cardholder Name</div>
                                                <input
                                                    value={name} onChange={e => setName(e.target.value)}
                                                    placeholder="John Doe" style={inputStyle}
                                                    onFocus={e => e.target.style.borderColor = "rgba(0,112,209,0.6)"}
                                                    onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.12)"}
                                                />
                                            </div>
                                            <div>
                                                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", marginBottom: "6px" }}>Card Number</div>
                                                <div style={{ position: "relative" }}>
                                                    <input
                                                        value={cardNum}
                                                        onChange={e => setCardNum(formatCard(e.target.value))}
                                                        placeholder="1234 5678 9012 3456"
                                                        style={{ ...inputStyle, paddingRight: "48px", letterSpacing: "2px" }}
                                                        onFocus={e => e.target.style.borderColor = "rgba(0,112,209,0.6)"}
                                                        onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.12)"}
                                                    />
                                                    <div style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", display: "flex", gap: "4px" }}>
                                                        {["VISA", "MC"].map(b => (
                                                            <div key={b} style={{ fontSize: "8px", fontWeight: 800, color: "rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.08)", borderRadius: "4px", padding: "2px 4px" }}>{b}</div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                                                <div>
                                                    <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", marginBottom: "6px" }}>Expiry Date</div>
                                                    <input
                                                        value={expiry} onChange={e => setExpiry(formatExpiry(e.target.value))}
                                                        placeholder="MM/YY" style={inputStyle}
                                                        onFocus={e => e.target.style.borderColor = "rgba(0,112,209,0.6)"}
                                                        onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.12)"}
                                                    />
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", marginBottom: "6px" }}>CVV</div>
                                                    <input
                                                        value={cvv} onChange={e => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                                                        placeholder="•••" type="password" style={inputStyle}
                                                        onFocus={e => e.target.style.borderColor = "rgba(0,112,209,0.6)"}
                                                        onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.12)"}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Order summary */}
                                        <div style={{
                                            marginTop: "20px", padding: "14px 16px",
                                            background: "rgba(255,255,255,0.03)", borderRadius: "12px",
                                            border: "1px solid rgba(255,255,255,0.06)",
                                        }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "rgba(255,255,255,0.5)", marginBottom: "6px" }}>
                                                <span>{mode === "subscription" ? `PS Plus ${selectedPlan}` : game?.title}</span>
                                                <span>{mode === "subscription" ? PS_PLUS_PLANS.find(p => p.id === selectedPlan)?.price : game?.price}</span>
                                            </div>
                                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "rgba(255,255,255,0.5)", paddingBottom: "8px", borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: "8px" }}>
                                                <span>GST (18%)</span>
                                                <span>Included</span>
                                            </div>
                                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "16px", fontWeight: 800 }}>
                                                <span>Total</span>
                                                <span style={{ color: "#0090ff" }}>{mode === "subscription" ? PS_PLUS_PLANS.find(p => p.id === selectedPlan)?.price : game?.price}</span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={handlePay}
                                            disabled={processing}
                                            style={{
                                                width: "100%", padding: "15px", marginTop: "16px",
                                                background: processing ? "rgba(0,112,209,0.5)" : "linear-gradient(135deg, #0070d1, #00a8ff)",
                                                border: "none", borderRadius: "12px",
                                                cursor: processing ? "not-allowed" : "pointer",
                                                color: "#fff", fontWeight: 700, fontSize: "15px",
                                                boxShadow: processing ? "none" : "0 6px 24px rgba(0,112,209,0.4)",
                                                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                                                transition: "all 0.2s",
                                            }}
                                        >
                                            {processing ? (
                                                <>
                                                    <motion.div
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                        style={{ width: "18px", height: "18px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%" }}
                                                    />
                                                    Processing...
                                                </>
                                            ) : (
                                                <><LockIcon /> Pay Securely</>
                                            )}
                                        </button>

                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", marginTop: "12px", fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>
                                            <LockIcon /> Secured by Stripe · 256-bit SSL encryption
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default PaymentModal;
