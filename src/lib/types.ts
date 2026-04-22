export type Gender = "M" | "F";
export type PlayerStatus = "Standby" | "InMatch";
export type MatchFormat = "Singles" | "Doubles";
export type MatchStatus = "Active" | "Finished";

export interface Player {
  id: string;
  name: string;
  gender: Gender;
  status: PlayerStatus;
  playCount: number;
  lastPlayed: number | null; // using timestamp for easier sorting
  matchPlayed?: number[];
}

export interface Match {
  id: string;
  matchNumber: number;
  format: MatchFormat;
  teamA: Player[]; // Storing full player object for easier UI rendering, or maybe just IDs?
  teamB: Player[];
  status: MatchStatus;
  createdAt: number;
  endedAt: number | null;
}

// We will store just Player IDs in matches to avoid stale data if player updates
export interface MatchRecord {
  id: string;
  matchNumber: number;
  format: MatchFormat;
  teamAIds: string[];
  teamBIds: string[];
  status: MatchStatus;
  createdAt: number;
  endedAt: number | null;
}
