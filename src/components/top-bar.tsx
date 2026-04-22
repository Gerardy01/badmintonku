import { Button } from "@/components/ui/button";
import { RotateCcw, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useState } from "react";

interface TopBarProps {
  onReset: () => void;
}

export function TopBar({ onReset }: TopBarProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="pt-4 px-4 max-w-md mx-auto sticky top-0 z-50">
      <div className="flex h-16 items-center justify-between px-6 bg-white/80 backdrop-blur-xl border border-white rounded-[2rem] shadow-game">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-primary/20 rounded-2xl flex items-center justify-center text-xl">
            🏸
          </div>
          <h1 className="text-xl font-black text-zinc-800 tracking-tight">
            Matchmaker
          </h1>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full text-zinc-300 hover:text-red-500 hover:bg-red-50 transition-colors"
            >
              <RotateCcw className="h-5 w-5" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-white border-none rounded-[2.5rem] shadow-game">
            <DialogHeader className="flex flex-col items-center pt-4">
              <div className="h-16 w-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
              <DialogTitle className="text-2xl font-black text-zinc-800 text-center">
                Reset Session?
              </DialogTitle>
              <p className="text-sm font-bold text-zinc-400 text-center mt-2 px-4">
                This will permanently delete all players and match history. This action cannot be undone!
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
                  onReset();
                  setOpen(false);
                }}
                className="h-12 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-black shadow-lg shadow-red-500/20 active:translate-y-1 transition-all"
              >
                RESET
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
