"use client";

import { useState } from "react";
import { Download, Instagram, Loader2 } from "lucide-react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsLoading(true);
    setError("");
    setVideoUrl("");

    try {
      const response = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch reel");
      }

      const data = await response.json();
      if (data.videoUrl) {
        setVideoUrl(data.videoUrl);
      } else {
        throw new Error("Video URL not found in response");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!videoUrl) return;

    // Using window.location.href to navigate to the proxy URL
    // The proxy endpoint forces the 'Content-Disposition: attachment' header,
    // which tells the browser to download the file directly instead of navigating away.
    const proxyUrl = `/api/proxy?url=${encodeURIComponent(videoUrl)}`;
    window.location.href = proxyUrl;
  };

  return (
    <main className="min-h-screen bg-[#fafafa] dark:bg-[#121212] flex flex-col items-center justify-center p-4 selection:bg-pink-500/30">
      <div className="w-full max-w-md mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 sm:p-4 rounded-2xl bg-gradient-to-tr from-yellow-400 via-red-500 to-fuchsia-600 mb-2 sm:mb-4 shadow-lg shadow-pink-500/20">
            <Instagram className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-600">
            IG Looter
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm sm:text-base font-medium">
            Download your favorite reels in seconds
          </p>
        </div>

        {/* Form area */}
        <form onSubmit={handleSubmit} className="relative flex flex-col items-center justify-center h-48 sm:h-56">
          <div
            className={`
              absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.87,0,0.13,1)]
              bg-ig-gradient flex items-center justify-center p-1 sm:p-2 overflow-hidden shadow-2xl shadow-pink-500/30
              ${isLoading ? "animate-liquid animate-gradient-shift scale-110 sm:scale-125" : "rounded-3xl hover:scale-105 active:scale-95"}
            `}
            style={{
              borderRadius: isLoading ? undefined : "30px",
            }}
          >
            {/* Input field wrapper */}
            <div className="relative w-full h-full bg-white/10 dark:bg-black/20 backdrop-blur-md flex items-center justify-center p-4 transition-all duration-500 rounded-[inherit]">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center space-y-3 text-white">
                  <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin" />
                  <p className="font-bold tracking-wide text-sm sm:text-lg animate-pulse">getting your reel for you</p>
                </div>
              ) : (
                <input
                  type="url"
                  placeholder="enter your url..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full h-full bg-transparent border-none outline-none text-white placeholder:text-white/70 text-center text-lg sm:text-2xl font-bold tracking-wide"
                  required
                />
              )}
            </div>
          </div>
        </form>

        {/* Error message */}
        {error && (
          <div className="p-4 bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400 rounded-2xl text-center text-sm font-medium border border-red-100 dark:border-red-900/50">
            {error}
          </div>
        )}

        {/* Result view */}
        {videoUrl && !isLoading && (
          <div className="space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
            <div className="relative aspect-[9/16] w-full max-w-[280px] sm:max-w-xs mx-auto rounded-3xl overflow-hidden shadow-2xl ring-1 ring-neutral-200 dark:ring-neutral-800 bg-black group">
              <video
                src={videoUrl}
                controls
                autoPlay
                className="w-full h-full object-cover"
                playsInline
              />
            </div>

            <button
              onClick={handleDownload}
              className="w-full py-3 sm:py-4 px-6 rounded-2xl bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-600 text-white font-bold text-base sm:text-lg flex items-center justify-center space-x-2 sm:space-x-3 hover:opacity-90 transition-opacity active:scale-[0.98] shadow-lg shadow-pink-500/25"
            >
              <Download className="w-5 h-5 sm:w-6 sm:h-6" />
              <span>Download Video</span>
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
