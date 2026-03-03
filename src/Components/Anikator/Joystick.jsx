import React, { useRef, useState, useCallback } from 'react';

export function Joystick({ onMove, color = '#00d8ff', onActive }) {
    const containerRef = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [active, setActive] = useState(false);

    const handleTouchStart = (e) => {
        setActive(true);
        if (onActive) onActive(true);
        handleTouchMove(e);
    };

    const handleTouchMove = useCallback((e) => {
        if (!containerRef.current) return;

        // Prevent scrolling
        if (e.cancelable) {
            e.preventDefault();
        }

        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Calculate distance from center
        const touch = e.touches[0];
        let dx = touch.clientX - centerX;
        let dy = touch.clientY - centerY;

        // Cap to radius of the container (e.g., 32px for w-16)
        const radius = rect.width / 2;
        const maxRadius = radius;

        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > maxRadius) {
            dx = (dx / distance) * maxRadius;
            dy = (dy / distance) * maxRadius;
        }

        setPosition({ x: dx, y: dy });

        if (onMove) {
            // Normalize to -1 to 1 based on actual movement vs radius
            onMove({ dx: dx / maxRadius, dy: dy / maxRadius });
        }
    }, [onMove]);

    const handleTouchEnd = () => {
        setActive(false);
        if (onActive) onActive(false);
        setPosition({ x: 0, y: 0 });
        if (onMove) {
            onMove({ dx: 0, dy: 0 });
        }
    };

    return (
        <div
            ref={containerRef}
            style={{
                position: 'relative',
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                borderWidth: '3px',
                borderStyle: 'solid',
                borderColor: active ? color : `${color}80`,
                background: 'rgba(0,0,0,0.35)',
                boxShadow: `0 0 24px ${color}55, inset 0 0 18px rgba(0,0,0,0.8)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'border-color 0.2s',
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
        >
            <div
                style={{
                    position: 'absolute',
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: 'rgba(0,0,0,0.55)',
                    border: `1.5px solid ${color}cc`,
                    boxShadow: `0 0 18px ${color}88`,
                    transform: `translate(${position.x}px, ${position.y}px)`,
                    transition: active ? 'none' : 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                }}
            />
        </div>
    );
}
