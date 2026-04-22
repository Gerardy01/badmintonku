import { Player, MatchRecord } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, PlayCircle } from "lucide-react";

// The populated match type returned by useMatchmaker
export interface PopulatedMatch extends Omit<MatchRecord, "teamAIds" | "teamBIds"> {
  teamA: Player[];
  teamB: Player[];
}

interface MatchCardProps {
  match: PopulatedMatch;
  onEndMatch?: (id: string) => void;
}

function PlayerName({ player }: { player: Player }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="text-sm font-medium text-black">{player.name}</span>
      <span className={`text-[10px] font-bold ${player.gender === "M" ? "text-blue-500" : "text-pink-500"}`}>
        {player.gender}
      </span>
    </span>
  );
}

export function MatchCard({ match, onEndMatch }: MatchCardProps) {
  const isActive = match.status === "Active";

  return (
    <Card
      className={`mb-4 border-none shadow-game rounded-[2.5rem] transition-all ${isActive
        ? "bg-white ring-4 ring-primary/20"
        : "bg-white/60 opacity-80 scale-[0.98]"
        }`}
    >
      <CardHeader className="p-5 pb-2 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-3">
          <div className={`h-10 w-10 rounded-2xl flex items-center justify-center ${isActive ? "bg-primary text-white" : "bg-zinc-200 text-zinc-500"}`}>
            <span className="font-black">#</span>
          </div>
          <CardTitle className="text-xl font-black text-zinc-800">
            Match {match.matchNumber}
          </CardTitle>
        </div>
        <Badge
          className={`rounded-full px-3 py-1 font-black uppercase text-[10px] tracking-widest ${isActive ? "bg-accent text-white" : "bg-zinc-200 text-zinc-500"
            }`}
        >
          {match.format}
        </Badge>
      </CardHeader>

      <CardContent className="p-5 pt-4">
        <div className="grid grid-cols-1 gap-2 relative">

          {/* Team A */}
          <div className="flex flex-col bg-blue-50/50 rounded-[1.5rem] p-4 border-2 border-blue-100">
            <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-2">Team A</span>
            <div className="flex items-center flex-wrap gap-x-4 gap-y-1">
              {match.teamA.map(p => <PlayerName key={p.id} player={p} />)}
            </div>
          </div>

          {/* VS Badge */}
          <div className="flex justify-center -my-3 z-10">
            <div className="bg-primary text-white text-xs font-black px-4 py-1.5 rounded-full shadow-lg transform -rotate-3">
              VS
            </div>
          </div>

          {/* Team B */}
          <div className="flex flex-col bg-purple-50/50 rounded-[1.5rem] p-4 border-2 border-purple-100">
            <span className="text-[10px] font-black text-purple-400 uppercase tracking-[0.2em] mb-2">Team B</span>
            <div className="flex items-center flex-wrap gap-x-4 gap-y-1">
              {match.teamB.map(p => <PlayerName key={p.id} player={p} />)}
            </div>
          </div>

        </div>

        {isActive && onEndMatch && (
          <Button
            className="w-full mt-6 h-12 rounded-full bg-primary hover:bg-primary/90 text-white font-black text-lg shadow-lg active:translate-y-1 transition-all"
            onClick={() => onEndMatch(match.id)}
          >
            END MATCH
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
