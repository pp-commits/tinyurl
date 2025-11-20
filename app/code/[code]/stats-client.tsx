"use client";

import React, { useEffect, useState } from "react";

type Link = {
  id: string;
  code: string;
  url: string;
  clicks: number;
  lastClicked?: string | null;
  createdAt: string;
};

export default function CodeStatsClient({ code }: { code: string }) {
  const [link, setLink] = useState<Link | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadStats() {
    try {
      const res = await fetch(`/api/links/${code}`);
      if (!res.ok) throw new Error("Not found");
      const data = await res.json();
      setLink(data);
      setError(null);
    } catch {
      setError("Not found");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStats(); // initial load

    const interval = setInterval(loadStats, 3000); // auto-refresh
    return () => clearInterval(interval);
  }, [code]);

  if (loading) {
    return <div className="bg-white p-4 rounded shadow-sm">Loading stats...</div>;
  }

  if (error || !link) {
    return (
      <div className="bg-white p-4 rounded shadow-sm text-red-600">
        Link not found
      </div>
    );
  }

  const base =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (typeof window !== "undefined" ? window.location.origin : "");

  return (
    <div className="bg-white p-4 rounded shadow-sm">
      <h2 className="text-lg font-semibold mb-3">
        Stats for <span className="text-blue-600">{link.code}</span>
      </h2>

      <div className="space-y-3">
        <div>
          <strong>Short URL:</strong>{" "}
          <a
            href={`${base}/${link.code}`}
            className="text-blue-600 underline"
            target="_blank"
            rel="noreferrer"
          >
            {base}/{link.code}
          </a>
        </div>

        <div>
          <strong>Target:</strong>{" "}
          <a
            href={link.url}
            className="text-blue-600 underline break-all"
            target="_blank"
            rel="noreferrer"
          >
            {link.url}
          </a>
        </div>

        <div>
          <strong>Clicks:</strong> {link.clicks}
        </div>

        <div>
          <strong>Last clicked:</strong>{" "}
          {link.lastClicked ? new Date(link.lastClicked).toLocaleString() : "-"}
        </div>

        <div>
          <strong>Created at:</strong>{" "}
          {new Date(link.createdAt).toLocaleString()}
        </div>
      </div>
    </div>
  );
}
