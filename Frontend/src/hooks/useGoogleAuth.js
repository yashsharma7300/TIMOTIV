import { useEffect, useRef } from "react";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export const useGoogleAuth = (onSuccess) => {
    const tokenClient = useRef(null);

    useEffect(() => {
        const initializeGoogle = () => {
            if (!window.google) return;

            window.google.accounts.id.initialize({
                client_id: CLIENT_ID,
                callback: onSuccess,
            });
        };

        const existingScript = document.querySelector(
            'script[src="https://accounts.google.com/gsi/client"]'
        );

        if (window.google) {
            initializeGoogle();
            return;
        }

        if (existingScript) {
            existingScript.addEventListener("load", initializeGoogle);

            return () => {
                existingScript.removeEventListener("load", initializeGoogle);
            };
        }

        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = initializeGoogle;

        document.body.appendChild(script);

        return () => {
            script.onload = null;
        };
    }, [onSuccess]);

    const loginWithGoogle = () => {
        if (!window.google) {
            console.error("Google SDK not loaded");
            return;
        }

        window.google.accounts.id.prompt();
    };

    return {
        loginWithGoogle,
    };
};