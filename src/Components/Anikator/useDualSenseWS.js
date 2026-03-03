import { useEffect, useState, useCallback, useMemo } from 'react';

const getOrCreateInstanceSession = () => {
    let sid = window.sessionStorage.getItem('ps_session');
    if (!sid) {
        sid = Math.random().toString(36).substring(2, 6).toUpperCase();
        window.sessionStorage.setItem('ps_session', sid);
    }
    return sid;
};

// A shared hook for Desktop to listen and Controller to emit messages via WebSocket
export function useDualSenseWS(customSession) {
    const [ws, setWs] = useState(null);
    const [action, setAction] = useState(null);
    const [joystick, setJoystick] = useState({ dx: 0, dy: 0 }); // add joystick state

    const session = useMemo(() => {
        if (customSession) return customSession;
        const params = new URLSearchParams(window.location.search);
        const urlSession = params.get('session');
        return urlSession || getOrCreateInstanceSession();
    }, [customSession]);

    useEffect(() => {
        // Determine the WS URL (using the same host/port, but wss/ws protocol)
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        // Add session to the ws URL
        const wsUrl = `${protocol}//${window.location.host}/playstation-ws?session=${session}`;

        let socket;
        let reconnectTimeout;

        const connect = () => {
            socket = new WebSocket(wsUrl);

            socket.onopen = () => {
                console.log('WS Connected');
                setWs(socket);
            };

            socket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.type === 'ACTION') {
                    // simply mirror whatever event arrives (including RELEASE) and
                    // allow the UI to control when it should snap back.  previously
                    // we wiped the action after 100ms which prevented a held button
                    // from keeping the 3D controller tilted.  removing the timeout
                    // lets the desktop stay tilted until a RELEASE message arrives.
                    setAction(data.payload); // e.g., 'LEFT', 'RIGHT', 'SELECT', 'RELEASE'
                } else if (data.type === 'JOYSTICK') {
                    setJoystick(data.payload);
                }
            };

            socket.onclose = () => {
                console.log('WS Disconnected, reconnecting...');
                setWs(null);
                reconnectTimeout = setTimeout(connect, 1000);
            };

            socket.onerror = (err) => {
                console.error('WS Error:', err);
                socket.close();
            };
        };

        connect();

        return () => {
            clearTimeout(reconnectTimeout);
            if (socket) {
                socket.close();
            }
        };
    }, []);

    const sendAction = useCallback((payload) => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'ACTION', payload }));
        }
    }, [ws]);

    const sendJoystick = useCallback((payload) => {
        if (ws && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'JOYSTICK', payload }));
        }
    }, [ws]);

    return { action, sendAction, joystick, sendJoystick, session };
}
