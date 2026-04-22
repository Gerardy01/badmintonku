"use client";

import { useState } from "react";
import { useMatchmaker } from "@/hooks/useMatchmaker";
import { TopBar } from "@/components/top-bar";
import { AddPlayerForm } from "@/components/add-player-form";
import { PlayerCard } from "@/components/player-card";
import { MatchCard } from "@/components/match-card";
import { MatchFormat } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "@/components/ui/sonner";
import { Dices, ChevronDown, ChevronUp } from "lucide-react";

export default function Home() {
  const {
    isLoaded,
    standbyPlayers,
    activeMatches,
    finishedMatches,
    addPlayer,
    removePlayer,
    resetSession,
    randomizeMatches,
    endMatch,
  } = useMatchmaker();

  const [format, setFormat] = useState<MatchFormat>("Doubles");
  const [showFinished, setShowFinished] = useState(true);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-primary/30 flex items-center justify-center text-zinc-500">
        Loading session...
      </div>
    );
  }

  return (
    <div className="min-h-screen text-zinc-800 font-sans selection:bg-primary/30 pb-10">
      <TopBar onReset={resetSession} />

      <main className="max-w-md mx-auto px-4 pb-20 pt-[4rem] space-y-10">

        {/* Waiting Zone */}
        <section>
          <div className="flex items-center justify-between mb-6 px-2">
            <div className="flex flex-col">
              <h2 className="text-2xl font-black tracking-tight text-zinc-800 leading-none">Waiting Zone</h2>
              <p className="text-xs font-bold text-zinc-400 mt-1 uppercase tracking-widest">Next to play</p>
            </div>
            <AddPlayerForm onAdd={addPlayer} />
          </div>

          <div className="min-h-[160px] relative">
            {standbyPlayers.length === 0 ? (
              <div className="bg-white/40 border-2 border-dashed border-zinc-200 rounded-[2rem] flex flex-col items-center justify-center text-zinc-400 py-12 px-6 text-center">
                <div className="h-16 w-16 bg-zinc-100 rounded-full flex items-center justify-center mb-4 text-2xl">
                  😴
                </div>
                <p className="font-bold">No players waiting.</p>
                <p className="text-xs mt-1">Add someone to start the session!</p>
              </div>
            ) : (
              <div className="space-y-1">
                <AnimatePresence initial={false}>
                  {standbyPlayers.map((player, index) => (
                    <motion.div
                      key={player.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                      transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
                    >
                      <PlayerCard
                        player={player}
                        position={index + 1}
                        onRemove={removePlayer}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          <div className="mt-8 p-6 bg-white/60 backdrop-blur-md rounded-[2.5rem] shadow-game border border-white">
            <Label className="text-xs font-black text-zinc-400 uppercase tracking-[0.2em] mb-4 block px-2">Match Settings</Label>
            <div className="flex flex-col gap-4">
              <Select value={format} onValueChange={(v) => setFormat(v as MatchFormat)}>
                <SelectTrigger className="bg-zinc-100 border-none h-14 rounded-md font-bold text-zinc-700 w-full">
                  <SelectValue placeholder="Format" />
                </SelectTrigger>
                <SelectContent className="bg-white border-zinc-100 rounded-md">
                  <SelectItem value="Singles">Singles (1v1)</SelectItem>
                  <SelectItem value="Doubles">Doubles (2v2)</SelectItem>
                </SelectContent>
              </Select>
              <Button
                className="w-full h-14 bg-accent hover:bg-accent/90 text-white font-black text-lg rounded-2xl shadow-lg active:translate-y-1 transition-all"
                onClick={() => randomizeMatches(format)}
              >
                <Dices className="mr-2 h-6 w-6" />
                GO!
              </Button>
            </div>
          </div>
        </section>

        {/* Active Matches */}
        <section>
          <div className="flex flex-col mb-6 px-2">
            <h2 className="text-2xl font-black tracking-tight text-zinc-800 leading-none flex items-center gap-2">
              On Court
              <span className="flex h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
            </h2>
            <p className="text-xs font-bold text-zinc-400 mt-1 uppercase tracking-widest">Active matches</p>
          </div>

          {activeMatches.length === 0 ? (
            <div className="bg-zinc-100/50 rounded-[2rem] p-8 text-center text-zinc-400 font-bold border-2 border-white">
              Courts are empty.
            </div>
          ) : (
            <AnimatePresence>
              {activeMatches.map(match => (
                <motion.div
                  key={match.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: "spring", bounce: 0.4 }}
                >
                  <MatchCard match={match} onEndMatch={endMatch} />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </section>

        {/* Finished Matches */}
        {finishedMatches.length > 0 && (
          <section className="px-2">
            <button
              onClick={() => setShowFinished(!showFinished)}
              className="w-full flex items-center justify-between py-4 text-xs font-black tracking-[0.2em] text-zinc-400 uppercase hover:text-zinc-600 transition-colors"
            >
              <span>HISTORY ({finishedMatches.length})</span>
              {showFinished ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>

            <AnimatePresence>
              {showFinished && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden mt-4 space-y-4"
                >
                  {finishedMatches.map(match => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        )}
      </main>

      <Toaster position="top-center" />
    </div>
  );
}
