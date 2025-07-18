"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Volume2, Bookmark } from "lucide-react";

interface ProblemDisplayProps {
  rewrittenProblem: string;
  onListen: () => void;
  onRephrase: () => void;
  onSave: () => void;
}

export default function ProblemDisplay({
  rewrittenProblem,
  onListen,
  onRephrase,
  onSave,
}: ProblemDisplayProps) {
  return (
    <div className="space-y-4">
      <Card className="p-6 bg-amber-50 min-h-[300px] flex flex-col">
        {rewrittenProblem ? (
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-4">
              Your Personalized Problem
            </h2>
            <p className="text-lg">{rewrittenProblem}</p>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-400 italic text-center">
              Your personalized math problem will appear here after you click
              "Rewrite!"
            </p>
          </div>
        )}
      </Card>

      {rewrittenProblem && (
        <div className="grid grid-cols-3 gap-4">
          <Button
            onClick={onListen}
            variant="outline"
            className="flex flex-col items-center justify-center p-6 h-auto"
          >
            <Volume2 className="h-10 w-10 mb-2 text-teal-500" />
            <span>Read for me</span>
          </Button>

          <Button
            onClick={onRephrase}
            variant="outline"
            className="flex flex-col items-center justify-center p-6 h-auto"
          >
            <RefreshCw className="h-10 w-10 mb-2 text-purple-500" />
            <span>Try another theme</span>
          </Button>

          <Button
            onClick={onSave}
            variant="outline"
            className="flex flex-col items-center justify-center p-6 h-auto"
          >
            <Bookmark className="h-10 w-10 mb-2 text-orange-500" />
            <span>Save problem</span>
          </Button>
        </div>
      )}
    </div>
  );
}
