"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/`
        );
        const data = await response.text();
        setMessage(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setMessage("Failed to fetch from backend");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">Relaix Monorepo</h1>
      <div className="rounded-lg border border-gray-300 p-4">
        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : (
          <p className="text-lg">{message}</p>
        )}
      </div>
      <p className="text-sm text-gray-500">
        NestJS Backend + Next.js Frontend + Shared Libraries
      </p>
    </main>
  );
}
