"use client";

import { useState } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const [partySize, setPartySize] = useState("");
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function joinWaitlist(event) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          partySize: Number(partySize),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to join waitlist.");
      }

      setTicket(data);
      setName("");
      setPartySize("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function refreshTicket() {
    if (!ticket) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `/api/waitlist/${ticket.ticketNumber}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ticket not found.");
      }

      setTicket(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (ticket) {
    return (
      <main className="min-h-screen bg-zinc-100 px-4 py-10">
        <div className="mx-auto max-w-md rounded-2xl bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-zinc-900">
            Your Waitlist Ticket
          </h1>

          <div className="mt-8 text-center">
            <p className="text-sm text-zinc-500">Ticket</p>

            <p className="mt-1 text-6xl font-bold text-zinc-900">
              #{ticket.ticketNumber}
            </p>
          </div>

          <div className="mt-8 rounded-xl bg-zinc-100 p-5 text-center">
            <p className="text-sm text-zinc-500">
              Parties ahead of you
            </p>

            <p className="mt-1 text-4xl font-bold text-zinc-900">
              {ticket.partiesAhead}
            </p>
          </div>

          <div className="mt-6 space-y-2 text-sm text-zinc-600">
            <p>
              <strong>Name:</strong> {ticket.name}
            </p>

            <p>
              <strong>Party size:</strong> {ticket.partySize}
            </p>
          </div>

          <button
            onClick={refreshTicket}
            disabled={loading}
            className="mt-8 w-full rounded-xl bg-black px-4 py-3 font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
          >
            {loading ? "Refreshing..." : "Refresh Position"}
          </button>

          {error && (
            <p className="mt-4 text-center text-sm text-red-600">
              {error}
            </p>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-100 px-4 py-10">
      <div className="mx-auto max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-zinc-900">
            Restaurant Waitlist
          </h1>

          <p className="mt-2 text-zinc-600">
            Join the queue from your phone.
          </p>
        </div>

        <form
          onSubmit={joinWaitlist}
          className="rounded-2xl bg-white p-6 shadow-sm"
        >
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Name
              </label>

              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
                className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-black"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Party size
              </label>

              <input
                type="number"
                min="1"
                step="1"
                value={partySize}
                onChange={(event) =>
                  setPartySize(event.target.value)
                }
                placeholder="Number of people"
                className="w-full rounded-xl border border-zinc-300 px-4 py-3 outline-none focus:border-black"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-black px-4 py-3 font-medium text-white hover:bg-zinc-800 disabled:opacity-50"
            >
              {loading ? "Joining..." : "Join Waitlist"}
            </button>
          </div>

          {error && (
            <p className="mt-4 text-sm text-red-600">
              {error}
            </p>
          )}
        </form>

        <div className="mt-6 text-center">
          <a
            href="/staff"
            className="text-sm text-zinc-500 underline"
          >
            Staff screen
          </a>
        </div>
      </div>
    </main>
  );
}