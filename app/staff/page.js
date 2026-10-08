"use client";

import { useEffect, useState } from "react";

export default function StaffPage() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadWaitlist() {
    try {
      setError("");

      const response = await fetch("/api/waitlist", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load waitlist.");
      }

      setEntries(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function removeEntry(ticketNumber) {
    try {
      setError("");

      const response = await fetch(
        `/api/waitlist/${ticketNumber}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to remove party.");
      }

      setEntries((currentEntries) =>
        currentEntries.filter(
          (entry) => entry.ticketNumber !== ticketNumber
        )
      );
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadWaitlist();
  }, []);

  return (
    <main className="min-h-screen bg-zinc-100 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-zinc-900">
              Staff Waitlist
            </h1>

            <p className="mt-1 text-zinc-600">
              Manage the current waiting parties.
            </p>
          </div>

          <button
            onClick={loadWaitlist}
            className="rounded-xl border border-zinc-300 bg-white px-4 py-2 text-sm font-medium hover:bg-zinc-50"
          >
            Refresh
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-2xl bg-white p-8 text-center text-zinc-500">
            Loading waitlist...
          </div>
        ) : entries.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center">
            <p className="text-lg font-medium text-zinc-900">
              No parties waiting
            </p>

            <p className="mt-1 text-sm text-zinc-500">
              The waitlist is currently empty.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="divide-y divide-zinc-200">
              {entries.map((entry) => (
                <div
                  key={entry.ticketNumber}
                  className="flex items-center justify-between gap-4 p-5"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 font-bold text-zinc-900">
                      #{entry.ticketNumber}
                    </div>

                    <div>
                      <p className="font-semibold text-zinc-900">
                        {entry.name}
                      </p>

                      <p className="text-sm text-zinc-500">
                        Party of {entry.partySize}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      removeEntry(entry.ticketNumber)
                    }
                    className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}