import React, { useState, useEffect } from 'react';
import { useDualSenseWS } from './useDualSenseWS';
import { Joystick } from './Joystick';

export default function ControllerInterface() {
    const { sendAction, sendJoystick } = useDualSenseWS();
    const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);
    const [leftActive, setLeftActive] = useState(false);
    const [rightActive, setRightActive] = useState(false);
    const [pressed, setPressed] = useState(null); // track which button is pressed for glow

    useEffect(() => {
        g
        const checkOrientation = () => {
            setIsPortrait(window.innerHeight > window.innerWidth);
        };
        window.addEventListener('resize', checkOrientation);
        window.addEventListener('orientationchange', checkOrientation);
        return () => {
            window.removeEventListener('resize', checkOrientation);
            window.removeEventListener('orientationchange', checkOrientation);
        };
    }, []);

    const handleRelease = (side) => {
        if (side === 'left') setLeftActive(false);
        if (side === 'right') setRightActive(false);
        setPressed(null);
        sendAction('RELEASE');
    };

    const handlePress = (action, side) => {
        if (side === 'left') setLeftActive(true);
        if (side === 'right') setRightActive(true);
        setPressed(action);

        if ('vibrate' in navigator) {
            try {
                let pattern;
                if (action === 'LEFT' || action === 'RIGHT') pattern = 100;
                else if (action === 'SELECT') pattern = [150, 50, 150];
                else if (action === 'L_TRIGGER' || action === 'R_TRIGGER') pattern = [200, 100, 200];
                else pattern = 80;
                navigator.vibrate(pattern);
            } catch (e) { /* silent */ }
        }
        sendAction(action);
    };

    // Shared button styles
    const triggerBtn = (label, action, side, color) => ({
        onTouchStart: () => handlePress(action, side),
        onTouchEnd: () => handleRelease(side),
        style: {
            width: '100%',
            minWidth: '70px',
            height: '50px',
            borderRadius: '14px',
            background: pressed === action ? `${color}40` : 'rgba(255,255,255,0.12)',
            border: `2px solid ${pressed === action ? color : 'rgba(255,255,255,0.35)'}`,
            color: pressed === action ? '#fff' : 'rgba(255,255,255,0.9)',
            fontSize: '16px',
            fontWeight: 800,
            letterSpacing: '1.5px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            boxShadow: pressed === action ? `0 0 24px ${color}50` : '0 0 8px rgba(255,255,255,0.05)',
            WebkitTapHighlightColor: 'transparent',
            outline: 'none',
            userSelect: 'none',
            backdropFilter: 'blur(4px)',
        },
        children: label,
    });

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(145deg, #0a0e18 0%, #0d1220 40%, #0a0f1a 100%)',
            overflow: 'hidden',
            userSelect: 'none',
            touchAction: 'none',
            fontFamily: "'Inter', -apple-system, sans-serif",
            margin: 0,
            padding: 0,
        }}>
            {/* Ambient glows */}
            <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                opacity: leftActive ? 0.6 : 0,
                background: 'radial-gradient(circle at 15% 60%, rgba(255,0,85,0.35) 0%, transparent 45%)',
                transition: 'opacity 0.3s',
            }} />
            <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                opacity: rightActive ? 0.6 : 0,
                background: 'radial-gradient(circle at 85% 60%, rgba(0,150,255,0.35) 0%, transparent 45%)',
                transition: 'opacity 0.3s',
            }} />

            {/* Subtle grid pattern */}
            <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.03,
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
            }} />

            {/* ── Rotate Message ── */}
            {isPortrait && (
                <div style={{
                    position: 'absolute', inset: 0, zIndex: 50,
                    background: '#0a0f16',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', gap: '20px',
                }}>
                    <div style={{
                        width: '64px', height: '64px', border: '2px solid rgba(255,255,255,0.3)',
                        borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        animation: 'spin90 2s ease-in-out infinite',
                    }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect width="14" height="20" x="5" y="2" rx="2" />
                            <path d="M12 18h.01" />
                        </svg>
                    </div>
                    <p style={{ fontSize: '18px', fontWeight: 600, opacity: 0.9 }}>Rotate to landscape</p>
                    <p style={{ fontSize: '13px', opacity: 0.4, maxWidth: '240px', textAlign: 'center', lineHeight: 1.5 }}>
                        Turn your phone sideways to use the DualSense controller
                    </p>
                    <style>{`@keyframes spin90 { 0%,100%{transform:rotate(0deg)} 30%,70%{transform:rotate(-90deg)} }`}</style>
                </div>
            )}

            {/* ══════ MAIN CONTROLLER LAYOUT ══════ */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: isPortrait ? 'none' : 'flex',
                padding: 'env(safe-area-inset-top, 6px) env(safe-area-inset-right, 12px) env(safe-area-inset-bottom, 6px) env(safe-area-inset-left, 12px)',
                gap: '8px',
                boxSizing: 'border-box',
            }}>

                {/* ── LEFT SECTION ── */}
                <div style={{
                    flex: '0 0 30%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '4px',
                    boxSizing: 'border-box',
                    minHeight: 0,
                }}>
                    {/* L Triggers */}
                    <div style={{ display: 'flex', gap: '10px', width: '100%', maxWidth: '200px' }}>
                        <button {...triggerBtn('L2', 'L_TRIGGER', 'left', '#ff0055')} />
                        <button {...triggerBtn('L1', 'L_TRIGGER', 'left', '#ff0055')} />
                    </div>

                    {/* D-Pad */}
                    <div style={{
                        position: 'relative',
                        width: 'min(150px, 45vw)',
                        height: 'min(150px, 55vh)',
                        marginLeft: '10px',
                        flex: '1 1 auto',
                        maxHeight: '160px',
                    }}>
                        {/* Up */}
                        <button
                            onTouchStart={() => handlePress('DPAD_UP', 'left')}
                            onTouchEnd={() => handleRelease('left')}
                            style={{
                                position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                                width: '50px', height: '50px',
                                borderRadius: '12px 12px 4px 4px',
                                background: pressed === 'DPAD_UP' ? 'rgba(255,0,85,0.25)' : 'rgba(255,255,255,0.06)',
                                border: `1.5px solid ${pressed === 'DPAD_UP' ? '#ff0055' : 'rgba(255,255,255,0.15)'}`,
                                color: '#fff', fontSize: '18px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: pressed === 'DPAD_UP' ? '0 0 16px rgba(255,0,85,0.3)' : 'none',
                                transition: 'all 0.12s', outline: 'none', cursor: 'pointer',
                                WebkitTapHighlightColor: 'transparent',
                            }}
                        >▲</button>

                        {/* Down */}
                        <button
                            onTouchStart={() => handlePress('DPAD_DOWN', 'left')}
                            onTouchEnd={() => handleRelease('left')}
                            style={{
                                position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
                                width: '50px', height: '50px',
                                borderRadius: '4px 4px 12px 12px',
                                background: pressed === 'DPAD_DOWN' ? 'rgba(255,0,85,0.25)' : 'rgba(255,255,255,0.06)',
                                border: `1.5px solid ${pressed === 'DPAD_DOWN' ? '#ff0055' : 'rgba(255,255,255,0.15)'}`,
                                color: '#fff', fontSize: '18px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: pressed === 'DPAD_DOWN' ? '0 0 16px rgba(255,0,85,0.3)' : 'none',
                                transition: 'all 0.12s', outline: 'none', cursor: 'pointer',
                                WebkitTapHighlightColor: 'transparent',
                            }}
                        >▼</button>

                        {/* Left */}
                        <button
                            onTouchStart={() => handlePress('DPAD_LEFT', 'left')}
                            onTouchEnd={() => handleRelease('left')}
                            style={{
                                position: 'absolute', top: '50%', left: 0, transform: 'translateY(-50%)',
                                width: '50px', height: '50px',
                                borderRadius: '12px 4px 4px 12px',
                                background: pressed === 'DPAD_LEFT' ? 'rgba(255,0,85,0.25)' : 'rgba(255,255,255,0.06)',
                                border: `1.5px solid ${pressed === 'DPAD_LEFT' ? '#ff0055' : 'rgba(255,255,255,0.15)'}`,
                                color: '#fff', fontSize: '18px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: pressed === 'DPAD_LEFT' ? '0 0 16px rgba(255,0,85,0.3)' : 'none',
                                transition: 'all 0.12s', outline: 'none', cursor: 'pointer',
                                WebkitTapHighlightColor: 'transparent',
                            }}
                        >◀</button>

                        {/* Right */}
                        <button
                            onTouchStart={() => handlePress('DPAD_RIGHT', 'left')}
                            onTouchEnd={() => handleRelease('left')}
                            style={{
                                position: 'absolute', top: '50%', right: 0, transform: 'translateY(-50%)',
                                width: '50px', height: '50px',
                                borderRadius: '4px 12px 12px 4px',
                                background: pressed === 'DPAD_RIGHT' ? 'rgba(255,0,85,0.25)' : 'rgba(255,255,255,0.06)',
                                border: `1.5px solid ${pressed === 'DPAD_RIGHT' ? '#ff0055' : 'rgba(255,255,255,0.15)'}`,
                                color: '#fff', fontSize: '18px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: pressed === 'DPAD_RIGHT' ? '0 0 16px rgba(255,0,85,0.3)' : 'none',
                                transition: 'all 0.12s', outline: 'none', cursor: 'pointer',
                                WebkitTapHighlightColor: 'transparent',
                            }}
                        >▶</button>

                        {/* Center fill */}
                        <div style={{
                            position: 'absolute', top: '50%', left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '46px', height: '46px',
                            background: 'rgba(0,0,0,0.4)',
                            borderRadius: '4px',
                        }} />
                    </div>
                </div>

                {/* ── CENTER SECTION (Joysticks + branding) ── */}
                <div style={{
                    flex: '1 1 40%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '4px 8px',
                    minHeight: 0,
                    boxSizing: 'border-box',
                }}>
                    {/* PS Logo / Session info */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '6px 16px',
                        background: 'rgba(255,255,255,0.04)',
                        borderRadius: '20px',
                        border: '1px solid rgba(255,255,255,0.08)',
                    }}>
                        <div style={{
                            width: '8px', height: '8px', borderRadius: '50%',
                            background: '#00e676',
                            boxShadow: '0 0 8px #00e676',
                        }} />
                        <span style={{
                            fontSize: '11px', fontWeight: 600,
                            color: 'rgba(255,255,255,0.5)',
                            letterSpacing: '1.5px',
                        }}>
                            DUALSENSE CONNECTED
                        </span>
                    </div>

                    {/* Joysticks */}
                    <div style={{
                        display: 'flex',
                        gap: '48px',
                        alignItems: 'center',
                        marginBottom: '0',
                        paddingBottom: '4px',
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                            <Joystick onMove={(data) => sendJoystick({ side: 'left', ...data })} color="#ff0055" onActive={(act) => setLeftActive(act)} />
                            <span style={{ fontSize: '9px', fontWeight: 700, color: 'rgba(255,255,255,0.2)', letterSpacing: '2px' }}>L3</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                            <Joystick onMove={(data) => sendJoystick({ side: 'right', ...data })} color="#0096ff" onActive={(act) => setRightActive(act)} />
                            <span style={{ fontSize: '9px', fontWeight: 700, color: 'rgba(255,255,255,0.2)', letterSpacing: '2px' }}>R3</span>
                        </div>
                    </div>
                </div>

                {/* ── RIGHT SECTION ── */}
                <div style={{
                    flex: '0 0 30%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    padding: '4px',
                    boxSizing: 'border-box',
                    minHeight: 0,
                }}>
                    {/* R Triggers */}
                    <div style={{ display: 'flex', gap: '10px', width: '100%', maxWidth: '200px' }}>
                        <button {...triggerBtn('R1', 'R_TRIGGER', 'right', '#0096ff')} />
                        <button {...triggerBtn('R2', 'R_TRIGGER', 'right', '#0096ff')} />
                    </div>

                    {/* Action Buttons (PlayStation diamond) */}
                    <div style={{
                        position: 'relative',
                        width: 'min(160px, 45vw)',
                        height: 'min(160px, 55vh)',
                        marginRight: '6px',
                        flex: '1 1 auto',
                        maxHeight: '170px',
                    }}>
                        {/* Triangle (top) */}
                        <button
                            onTouchStart={() => handlePress('TRIANGLE', 'right')}
                            onTouchEnd={() => handleRelease('right')}
                            style={{
                                position: 'absolute',
                                top: 0, left: '50%', transform: 'translateX(-50%)',
                                width: '56px', height: '56px', borderRadius: '50%',
                                background: pressed === 'TRIANGLE' ? 'rgba(0,229,255,0.2)' : 'rgba(255,255,255,0.05)',
                                border: `1.5px solid ${pressed === 'TRIANGLE' ? '#00E5FF' : 'rgba(255,255,255,0.15)'}`,
                                color: '#00E5FF', fontSize: '24px', fontWeight: 700,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: pressed === 'TRIANGLE' ? '0 0 20px rgba(0,229,255,0.4)' : 'none',
                                transition: 'all 0.12s', outline: 'none', cursor: 'pointer',
                                WebkitTapHighlightColor: 'transparent',
                            }}
                        >△</button>

                        {/* Cross (bottom) */}
                        <button
                            onTouchStart={() => handlePress('CROSS', 'right')}
                            onTouchEnd={() => handleRelease('right')}
                            style={{
                                position: 'absolute',
                                bottom: 0, left: '50%', transform: 'translateX(-50%)',
                                width: '56px', height: '56px', borderRadius: '50%',
                                background: pressed === 'CROSS' ? 'rgba(68,138,255,0.2)' : 'rgba(255,255,255,0.05)',
                                border: `1.5px solid ${pressed === 'CROSS' ? '#448AFF' : 'rgba(255,255,255,0.15)'}`,
                                color: '#448AFF', fontSize: '22px', fontWeight: 700,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: pressed === 'CROSS' ? '0 0 20px rgba(68,138,255,0.4)' : 'none',
                                transition: 'all 0.12s', outline: 'none', cursor: 'pointer',
                                WebkitTapHighlightColor: 'transparent',
                            }}
                        >✕</button>

                        {/* Square (left) */}
                        <button
                            onTouchStart={() => handlePress('SQUARE', 'right')}
                            onTouchEnd={() => handleRelease('right')}
                            style={{
                                position: 'absolute',
                                top: '50%', left: 0, transform: 'translateY(-50%)',
                                width: '56px', height: '56px', borderRadius: '50%',
                                background: pressed === 'SQUARE' ? 'rgba(255,82,82,0.2)' : 'rgba(255,255,255,0.05)',
                                border: `1.5px solid ${pressed === 'SQUARE' ? '#FF5252' : 'rgba(255,255,255,0.15)'}`,
                                color: '#FF5252', fontSize: '22px', fontWeight: 700,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: pressed === 'SQUARE' ? '0 0 20px rgba(255,82,82,0.4)' : 'none',
                                transition: 'all 0.12s', outline: 'none', cursor: 'pointer',
                                WebkitTapHighlightColor: 'transparent',
                            }}
                        >□</button>

                        {/* Circle (right) */}
                        <button
                            onTouchStart={() => handlePress('CIRCLE', 'right')}
                            onTouchEnd={() => handleRelease('right')}
                            style={{
                                position: 'absolute',
                                top: '50%', right: 0, transform: 'translateY(-50%)',
                                width: '56px', height: '56px', borderRadius: '50%',
                                background: pressed === 'CIRCLE' ? 'rgba(105,240,174,0.2)' : 'rgba(255,255,255,0.05)',
                                border: `1.5px solid ${pressed === 'CIRCLE' ? '#69F0AE' : 'rgba(255,255,255,0.15)'}`,
                                color: '#69F0AE', fontSize: '24px', fontWeight: 700,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: pressed === 'CIRCLE' ? '0 0 20px rgba(105,240,174,0.4)' : 'none',
                                transition: 'all 0.12s', outline: 'none', cursor: 'pointer',
                                WebkitTapHighlightColor: 'transparent',
                            }}
                        >○</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
