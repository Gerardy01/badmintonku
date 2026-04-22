"use client";

import { useState, useEffect, useCallback } from "react";
import { Player, MatchRecord, MatchFormat, Gender } from "@/lib/types";
import { generateMatches, sortQueue } from "@/lib/matchmaking";
import { toast } from "sonner";

const STORAGE_KEY = "badmintonku_session_data";

interface SessionData {
  players: Player[];
  matches: MatchRecord[];
  globalMatchNumber: number;
}

const defaultData: SessionData = {
  players: [],
  matches: [],
  globalMatchNumber: 1,
};

export function useMatchmaker() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [players, setPlayers] = useState<Player[]>(defaultData.players);
  const [matches, setMatches] = useState<MatchRecord[]>(defaultData.matches);
  const [globalMatchNumber, setGlobalMatchNumber] = useState(defaultData.globalMatchNumber);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPlayers(parsed.players || []);
        setMatches(parsed.matches || []);
        setGlobalMatchNumber(parsed.globalMatchNumber || 1);
      } catch (e) {
        console.error("Failed to parse local storage data", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to local storage whenever state changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ players, matches, globalMatchNumber })
      );
    }
  }, [players, matches, globalMatchNumber, isLoaded]);

  const addPlayer = useCallback((name: string, gender: Gender) => {
    const newPlayer: Player = {
      id: crypto.randomUUID(),
      name,
      gender,
      status: "Standby",
      playCount: 0,
      lastPlayed: null,
      matchPlayed: [],
    };
    setPlayers((prev) => [...prev, newPlayer]);
    toast.success(`${name} added to the waiting zone.`);
  }, []);

  const removePlayer = useCallback((id: string) => {
    setPlayers((prev) => prev.filter((p) => p.id !== id));
    toast.info("Player removed from session.");
  }, []);

  const resetSession = useCallback(() => {
    setPlayers([]);
    setMatches([]);
    setGlobalMatchNumber(1);
    toast.success("Session reset.");
  }, []);

  const randomizeMatches = useCallback((format: MatchFormat) => {
    const standbyPlayers = sortQueue(players.filter((p) => p.status === "Standby"));
    
    if (format === "Singles" && standbyPlayers.length < 2) {
      toast.error("Need at least 2 standby players for Singles.");
      return;
    }
    if (format === "Doubles" && standbyPlayers.length < 4) {
      toast.error("Need at least 4 standby players for Doubles.");
      return;
    }

    const { matches: newMatches, unassigned } = generateMatches(standbyPlayers, format, globalMatchNumber);

    if (newMatches.length === 0) {
      toast.error("Cannot form any valid matches with current players and gender rules.");
      return;
    }

    const newMatchRecords: MatchRecord[] = newMatches.map(m => ({
      ...m,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      endedAt: null
    }));

    // Mark players as "InMatch"
    const inMatchIds = new Set<string>();
    newMatchRecords.forEach((m) => {
      m.teamAIds.forEach((id) => inMatchIds.add(id));
      m.teamBIds.forEach((id) => inMatchIds.add(id));
    });

    setPlayers((prev) =>
      prev.map((p) => (inMatchIds.has(p.id) ? { ...p, status: "InMatch" } : p))
    );

    setMatches((prev) => [...prev, ...newMatchRecords]);
    setGlobalMatchNumber((prev) => prev + newMatchRecords.length);
    
    toast.success(`Generated ${newMatchRecords.length} match(es)!`);
  }, [players, globalMatchNumber]);

  const endMatch = useCallback((matchId: string) => {
    const timestamp = Date.now();
    let playerIdsToUpdate: string[] = [];
    let matchNumberToRecord: number | null = null;

    setMatches((prev) =>
      prev.map((m) => {
        if (m.id === matchId) {
          playerIdsToUpdate = [...m.teamAIds, ...m.teamBIds];
          matchNumberToRecord = m.matchNumber;
          return { ...m, status: "Finished", endedAt: timestamp };
        }
        return m;
      })
    );

    setPlayers((prev) =>
      prev.map((p) => {
        if (playerIdsToUpdate.includes(p.id)) {
          return {
            ...p,
            status: "Standby",
            playCount: p.playCount + 1,
            lastPlayed: timestamp,
            matchPlayed: matchNumberToRecord !== null ? [...(p.matchPlayed || []), matchNumberToRecord] : (p.matchPlayed || []),
          };
        }
        return p;
      })
    );

    toast.info("Match ended. Players returned to waiting zone.");
  }, []);

  const getPopulatedMatches = useCallback((status?: MatchRecord["status"]) => {
    let filtered = matches;
    if (status) {
      filtered = matches.filter(m => m.status === status);
    }
    // Most recent first for finished matches, earliest first for active? 
    // Let's just sort by matchNumber descending (newest at top)
    filtered = [...filtered].sort((a, b) => b.matchNumber - a.matchNumber);

    return filtered.map((m) => ({
      ...m,
      teamA: m.teamAIds.map(id => players.find(p => p.id === id)).filter(Boolean) as Player[],
      teamB: m.teamBIds.map(id => players.find(p => p.id === id)).filter(Boolean) as Player[],
    }));
  }, [matches, players]);

  return {
    isLoaded,
    players,
    standbyPlayers: sortQueue(players),
    activeMatches: getPopulatedMatches("Active"),
    finishedMatches: getPopulatedMatches("Finished"),
    addPlayer,
    removePlayer,
    resetSession,
    randomizeMatches,
    endMatch,
  };
}
