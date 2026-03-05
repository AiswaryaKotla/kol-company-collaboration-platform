import { useEffect } from "react";

export default function useRealtime(callback) {
  useEffect(() => {
    const handler = () => callback();

    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, [callback]);
}