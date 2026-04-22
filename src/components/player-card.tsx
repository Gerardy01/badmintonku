import { Player } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, Clock, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useState } from "react";

interface PlayerCardProps {
  player: Player;
  position: number;
  onRemove: (id: string) => void;
}

export function PlayerCard({ player, position, onRemove }: PlayerCardProps) {
  const [open, setOpen] = useState(false);
  const isMale = player.gender === "M";

  const lastPlayedTime = player.lastPlayed
    ? new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(new Date(player.lastPlayed))
    : null;

  return (
    <Card className="mb-3 bg-white/90 backdrop-blur-md border-none shadow-game rounded-[2rem] transition-all hover:-translate-y-1 overflow-hidden group">
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary font-black text-lg">
            {position}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-zinc-800">{player.name}</span>
              <Badge variant="secondary" className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${isMale ? "bg-blue-100 text-blue-600" : "bg-pink-100 text-pink-600"}`}>
                {player.gender}
              </Badge>
            </div>

            <div className="flex items-center gap-4 mt-1 text-xs font-medium text-zinc-500">
              <span className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-primary" />
                {player.playCount} play
              </span>
              {lastPlayedTime !== null && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {lastPlayedTime}
                </span>
              )}
            </div>
          </div>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full text-zinc-300 hover:text-red-500 hover:bg-red-50 transition-colors"
            >
              <X className="h-5 w-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-white border-none rounded-[2.5rem] shadow-game">
            <DialogHeader className="flex flex-col items-center pt-4">
              <div className="h-16 w-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
              <DialogTitle className="text-2xl font-black text-zinc-800 text-center">
                Remove Player?
              </DialogTitle>
              <p className="text-sm font-bold text-zinc-400 text-center mt-2 px-4">
                Are you sure you want to remove <span className="text-zinc-800">{player.name}</span> from the session?
              </p>
            </DialogHeader>
            <DialogFooter className="grid grid-cols-2 gap-3 mt-6 sm:justify-center">
              <DialogClose asChild>
                <Button variant="secondary" className="h-12 rounded-2xl font-black text-zinc-500 bg-zinc-100 hover:bg-zinc-200">
                  CANCEL
                </Button>
              </DialogClose>
              <Button
                onClick={() => {
                  onRemove(player.id);
                  setOpen(false);
                }}
                className="h-12 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-black shadow-lg shadow-red-500/20 active:translate-y-1 transition-all"
              >
                REMOVE
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
