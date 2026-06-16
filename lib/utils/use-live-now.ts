"use client";

import { useEffect, useState } from "react";

export function useLiveNow(intervalMs = 1000) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setNow(Date.now());
    }, intervalMs);

    return () => {
      clearInterval(intervalId);
    };
  }, [intervalMs]);

  return now;
}
