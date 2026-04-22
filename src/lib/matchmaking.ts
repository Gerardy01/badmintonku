import { Player, MatchFormat, MatchRecord } from "./types";

/**
 * Sorts the players for the priority queue.
 * Priority 1: Oldest lastPlayed (null = highest priority)
 * Priority 2: Fewest play count
 */
export function sortQueue(players: Player[]): Player[] {
  return [...players]
    .filter((p) => p.status === "Standby")
    .sort((a, b) => {
      // 1. Primary: Last Played Time (Longest wait / Never played first)
      if (a.lastPlayed === null && b.lastPlayed !== null) return -1;
      if (a.lastPlayed !== null && b.lastPlayed === null) return 1;
      
      if (a.lastPlayed !== null && b.lastPlayed !== null) {
        if (a.lastPlayed !== b.lastPlayed) {
          return a.lastPlayed - b.lastPlayed;
        }
      }
      
      // 2. Secondary: Play count (fewer plays first)
      return a.playCount - b.playCount;
    });
}

/**
 * Validates if 4 players form a valid doubles match based on gender rules:
 * - All Male (M+M vs M+M)
 * - All Female (F+F vs F+F)
 * - Mixed (M+F vs M+F)
 */
export function isValidDoubles(p1: Player, p2: Player, p3: Player, p4: Player): boolean {
  const males = [p1, p2, p3, p4].filter((p) => p.gender === "M").length;
  const females = 4 - males;

  // 4 Males or 4 Females
  if (males === 4 || females === 4) return true;
  // Mixed (2 Males, 2 Females)
  if (males === 2 && females === 2) return true;

  // 3 of one, 1 of another is invalid
  return false;
}

export function calculateSharedMatches(players: Player[]): number {
  let sharedCount = 0;
  for (let i = 0; i < players.length; i++) {
    for (let j = i + 1; j < players.length; j++) {
      const matchPlayedA = players[i].matchPlayed || [];
      const matchPlayedB = players[j].matchPlayed || [];
      const setB = new Set(matchPlayedB);
      for (const matchId of matchPlayedA) {
        if (setB.has(matchId)) {
          sharedCount++;
        }
      }
    }
  }
  return sharedCount;
}

/**
 * Generates matches recursively or iteratively by trying combinations.
 * Returns the generated matches and the unassigned standby players.
 */
export function generateMatches(
  standbyPlayers: Player[],
  format: MatchFormat,
  currentMatchNumber: number
): { matches: Omit<MatchRecord, "id" | "createdAt" | "endedAt">[]; unassigned: Player[] } {
  let queue = sortQueue(standbyPlayers);
  const matches: Omit<MatchRecord, "id" | "createdAt" | "endedAt">[] = [];
  let matchNum = currentMatchNumber;

  if (format === "Singles") {
    while (queue.length >= 2) {
      let bestCombo = null;
      let lowestPenalty = Infinity;

      for (let i = 0; i < queue.length - 1; i++) {
        for (let j = i + 1; j < queue.length; j++) {
          const p1 = queue[i];
          const p2 = queue[j];
          
          const sharedMatches = calculateSharedMatches([p1, p2]);
          const penaltyScore = (i + j) + (sharedMatches * 5);
          
          if (penaltyScore < lowestPenalty) {
            lowestPenalty = penaltyScore;
            bestCombo = { p1, p2 };
          }
        }
      }

      if (bestCombo) {
        const { p1, p2 } = bestCombo;
        matches.push({
          matchNumber: matchNum++,
          format: "Singles",
          teamAIds: [p1.id],
          teamBIds: [p2.id],
          status: "Active",
        });
        const idsToRemove = new Set([p1.id, p2.id]);
        queue = queue.filter(p => !idsToRemove.has(p.id));
      } else {
        break;
      }
    }
  } else {
    while (queue.length >= 4) {
      let bestCombo = null;
      let lowestPenalty = Infinity;
      
      // Limit search depth if queue is extremely large, but for typical badminton sessions (<30) it's fine.
      for (let i = 0; i < queue.length - 3; i++) {
        for (let j = i + 1; j < queue.length - 2; j++) {
          for (let k = j + 1; k < queue.length - 1; k++) {
            for (let l = k + 1; l < queue.length; l++) {
              const p1 = queue[i];
              const p2 = queue[j];
              const p3 = queue[k];
              const p4 = queue[l];

              if (isValidDoubles(p1, p2, p3, p4)) {
                const sharedMatches = calculateSharedMatches([p1, p2, p3, p4]);
                const penaltyScore = (i + j + k + l) + (sharedMatches * 5);

                if (penaltyScore < lowestPenalty) {
                  lowestPenalty = penaltyScore;
                  bestCombo = { p1, p2, p3, p4 };
                }
              }
            }
          }
        }
      }

      if (bestCombo) {
        const { p1, p2, p3, p4 } = bestCombo;
        let teamAIds: string[] = [];
        let teamBIds: string[] = [];

        if (p1.gender === p2.gender && p1.gender === p3.gender && p1.gender === p4.gender) {
            teamAIds = [p1.id, p2.id];
            teamBIds = [p3.id, p4.id];
        } else {
            const males = [p1, p2, p3, p4].filter(p => p.gender === "M");
            const females = [p1, p2, p3, p4].filter(p => p.gender === "F");
            teamAIds = [males[0].id, females[0].id];
            teamBIds = [males[1].id, females[1].id];
        }

        matches.push({
          matchNumber: matchNum++,
          format: "Doubles",
          teamAIds,
          teamBIds,
          status: "Active",
        });

        const idsToRemove = new Set([p1.id, p2.id, p3.id, p4.id]);
        queue = queue.filter(p => !idsToRemove.has(p.id));
      } else {
        break;
      }
    }
  }

  return { matches, unassigned: queue };
}
