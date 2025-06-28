import { useState } from "react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white">DeckDex</h1>
        <p className="text-blue-200">Welcome to DeckDex</p>
      </div>
    </div>
  );
}
