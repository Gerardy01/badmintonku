"use client";

import { useState } from "react";
import { Gender } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus } from "lucide-react";

interface AddPlayerFormProps {
  onAdd: (name: string, gender: Gender) => void;
}

export function AddPlayerForm({ onAdd }: AddPlayerFormProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [gender, setGender] = useState<Gender | "">("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !gender) return;

    onAdd(name.trim(), gender as Gender);

    // Reset and close
    setName("");
    setGender("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-12 px-6 rounded-full bg-primary hover:bg-primary/90 text-white font-black shadow-lg shadow-primary/20 active:translate-y-1 transition-all">
          <UserPlus className="mr-2 h-5 w-5" />
          Add Player
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white border-none rounded-[2.5rem] pt-[1.5rem] shadow-game">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-zinc-800">Add New Player</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-6 py-4">
          <div className="grid gap-3">
            <Label htmlFor="name" className="text-xs font-black text-zinc-400 uppercase tracking-widest px-1">Player Name</Label>
            <Input
              id="name"
              placeholder="e.g. Wawan Gunawan"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-zinc-100 border-none h-12 rounded-2xl font-bold text-zinc-700 placeholder:text-zinc-400 focus-visible:ring-primary"
              autoComplete="off"
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="gender" className="text-xs font-black text-zinc-400 uppercase tracking-widest px-1">Gender</Label>
            <Select value={gender} onValueChange={(val) => setGender(val as Gender)}>
              <SelectTrigger className="bg-zinc-100 border-none h-12 rounded-2xl font-bold text-zinc-700 focus:ring-primary">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent className="bg-white border-zinc-100 rounded-2xl">
                <SelectItem value="M">Male (M)</SelectItem>
                <SelectItem value="F">Female (F)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            type="submit"
            disabled={!name.trim() || !gender}
            className="w-full mt-4 h-14 bg-primary hover:bg-primary/90 text-white font-black text-lg rounded-2xl shadow-lg active:translate-y-1 transition-all"
          >
            ADD TO QUEUE
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
