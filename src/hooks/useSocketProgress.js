import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const host = import.meta.env.VITE_BASE_URL_BACKEND;

export default function useSocketProgress(resetSignal) {
    const [progress, setProgress] = useState(0);
    const [message, setMessage] = useState("");
    const socketRef = useRef(null);

    useEffect(() => {
        // Crear un socket nuevo
        socketRef.current = io(host, { reconnection: true });

        const handleProgress = (data) => {
            if (!data) return;
            if (typeof data.progress === "number") setProgress(data.progress);
            if (typeof data.message === "string") setMessage(data.message);
        };

        socketRef.current.on("progress-update", handleProgress);

        // Cleanup: desconectar socket y quitar listener
        return () => {
            if (socketRef.current) {
                socketRef.current.off("progress-update", handleProgress);
                socketRef.current.disconnect();
            }
        };
    }, [resetSignal]); // 🔑 Nuevo socket cada vez que resetSignal cambie

    const resetProgress = () => {
        setProgress(0);
        setMessage("");
    };

    return { progress, message, resetProgress, socket: socketRef.current };
}
