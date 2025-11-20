
"use client";
export const dynamic = "force-dynamic";

import React, { useEffect, useState } from "react";

type Link = {
  id: string;
  code: string;
  url: string;
  clicks: number;
  lastClicked?: string | null;
  createdAt: string;
};

export default function DashboardPage() {
  const [links, setLinks] = useState<Link[]>([]);
  const [url, setUrl] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const base = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;

  async function fetchLinks() {
    const res = await fetch("/api/links");
    if (res.ok) {
      const data = await res.json();
      setLinks(data);
    }
  }

  // ⬇⬇⬇ THIS IS THE NEW UPDATED LOGIC
  useEffect(() => {
    fetchLinks(); // initial load

    const interval = setInterval(() => {
      fetchLinks(); // auto-refresh every 3s
    }, 3000);

    return () => clearInterval(interval);
  }, []);
  // ⬆⬆⬆ END OF UPDATED LOGIC

  async function createLink(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, code: code || undefined })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || "Failed to create");
      } else {
        setUrl("");
        setCode("");
        setLinks(prev => [data, ...prev]);
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  async function deleteLink(codeToDelete: string) {
    if (!confirm(`Delete ${codeToDelete}?`)) return;
    const res = await fetch(`/api/links/${codeToDelete}`, { method: "DELETE" });
    if (res.ok) {
      setLinks(prev => prev.filter(l => l.code !== codeToDelete));
    } else {
      alert("Failed to delete");
    }
  }

  return (
    <div>
      <section className="mb-6">
        <form onSubmit={createLink} className="bg-white p-4 rounded shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium">Long URL</label>
              <input
                value={url}
                onChange={e => setUrl(e.target.value)}
                className="mt-1 block w-full border rounded p-2"
                placeholder="https://example.com/very/long/url"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Custom code (optional)</label>
              <input
                value={code}
                onChange={e => setCode(e.target.value)}
                className="mt-1 block w-full border rounded p-2"
                placeholder="6-8 alphanumeric"
              />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <button
              disabled={loading}
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create"}
            </button>
            {error && <div className="text-sm text-red-600">{error}</div>}
          </div>
        </form>
      </section>

      <section>
        <div className="bg-white p-4 rounded shadow-sm">
          <h2 className="font-semibold mb-3">Links</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr>
                  <th className="py-2">Short</th>
                  <th className="py-2">Target URL</th>
                  <th className="py-2">Clicks</th>
                  <th className="py-2">Last clicked</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {links.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-gray-500">
                      No links yet
                    </td>
                  </tr>
                )}
                {links.map(link => (
                  <tr key={link.id} className="border-t">
                    <td className="py-2">
                      <a
                        href={`${base}/${link.code}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline"
                      >
                        {link.code}
                      </a>
                    </td>
                    <td className="py-2 max-w-lg truncate" title={link.url}>
                      <a href={link.url} target="_blank" rel="noreferrer" className="hover:underline">
                        {link.url}
                      </a>
                    </td>
                    <td className="py-2">{link.clicks}</td>
                    <td className="py-2">{link.lastClicked ? new Date(link.lastClicked).toLocaleString() : "-"}</td>
                    <td className="py-2">
                      <a className="mr-3 text-sm" href={`/code/${link.code}`}>Stats</a>
                      <button className="text-sm text-red-600" onClick={() => deleteLink(link.code)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
