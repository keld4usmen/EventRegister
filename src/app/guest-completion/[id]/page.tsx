"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function GuestCompletionPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      id,
      businessStage: formData.get("businessStage"),
      prayerRequested: formData.get("prayerRequested") === "on",
    };

    try {
      const res = await fetch("/api/guest-completion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        alert("Failed to submit. Please try again.");
      }
    } catch (error) {
      alert("An error occurred.");
    }

    setLoading(false);
  }

  if (success) {
    return (
      <main className="min-h-screen p-8 flex items-center justify-center">
        <div className="glass-panel p-8 text-center max-w-md w-full animate-fade-in">
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Profile Complete!
          </h2>
          <p className="text-[var(--text-secondary)] mb-6">
            Thank you for providing your information. We look forward to seeing you at the event.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8 flex items-center justify-center">
      <div className="glass-panel p-8 max-w-md w-full animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
            Complete Registration
          </h1>
          <p className="text-[var(--text-secondary)]">
            Please finish your profile to complete your ticket registration.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-group">
            <label className="block text-sm font-medium mb-2 text-white">
              Business Stage <span className="text-red-400">*</span>
            </label>
            <select name="businessStage" required className="w-full">
              <option value="">Select a stage</option>
              <option value="Idea">Idea / Conceptual</option>
              <option value="Startup">Startup (0-2 years)</option>
              <option value="Growth">Growth (2+ years)</option>
              <option value="Mature">Mature / Scale</option>
            </select>
          </div>

          <div className="form-group p-4 rounded-xl bg-white/5 border border-white/10 flex items-start gap-4">
            <div className="pt-1">
              <input
                type="checkbox"
                name="prayerRequested"
                id="prayerRequested"
                className="w-5 h-5 rounded border-white/20 bg-black/20 text-purple-500 focus:ring-purple-500 focus:ring-offset-gray-900"
              />
            </div>
            <div>
              <label htmlFor="prayerRequested" className="font-medium text-white block mb-1">
                Prayer Request
              </label>
              <p className="text-sm text-[var(--text-secondary)]">
                Would you like our team to pray for you or your business during the event?
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-xl transition-all shadow-lg shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Submitting..." : "Complete Profile"}
          </button>
        </form>
      </div>
    </main>
  );
}
