"use client";

// 1. Imports
// React and hooks
import type React from "react";
import { useState } from "react";

// UI Components
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Assuming you have a reusable Input component

// Icons (grouped for clarity)
import {
  RefreshCw,
  Gamepad2,
  Smile,
  ClubIcon as Football,
  Cat,
  Lightbulb, // New icon for hints
} from "lucide-react";

// Custom Components (grouped)
// import ImageUploader from "@/components/image-uploader"; // Keep commented if not in use
import ActionButtons from "@/components/action-buttons";
import ProblemDisplay from "@/components/problem-display";
import Header from "@/components/header";

// 2. Type Definitions - No longer strictly needed for 'Theme' if it's just a string input
// The old 'Theme' type is kept for reference but not directly used for theme selection.

// 3. Main Component Definition
export default function MathProblemPersonalizer() {
  // 4. State Management
  // Group related state variables together
  const [originalProblem, setOriginalProblem] = useState<string>("");
  const [rewrittenProblem, setRewrittenProblem] = useState<string>("");
  const [customThemeInput, setCustomThemeInput] = useState<string>("football"); // State for user's theme input
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null); // State for error messages

  // 5. Constants and Configuration Data
  // Predefined hints for the theme input
  const themeHints: string[] = [
    "Football",
    "Minecraft",
    "Cooking",
    "Space Exploration",
    "Zoo animals",
    "Music",
  ];

  // 6. Event Handlers and Functions
  // Functions that handle user interactions or component logic

  // Placeholder for image upload handling (if ImageUploader is used)
  const handleImageUpload = (text: string) => {
    setOriginalProblem(text);
  };

  // Handles updating the custom theme input when a hint button is clicked
  const handleHintClick = (hint: string) => {
    setCustomThemeInput(hint);
  };

  const handleRewrite = async () => {
    if (!originalProblem) {
      setError("Please provide an original math problem first.");
      return;
    }
    if (!customThemeInput.trim()) {
      setError("Please enter a theme for the rewrite.");
      return;
    }

    setIsLoading(true);
    setError(null); // Clear previous errors

    try {
      // Construct the prompt for the LLM
      const prompt = `Rewrite the following math problem using a '${customThemeInput}' theme. Ensure the core mathematical problem (numbers and operation) remains the same, but change the context and characters to fit the theme. The original problem is: "${originalProblem}"`;

      let chatHistory = [];
      chatHistory.push({ role: "user", parts: [{ text: prompt }] });
      const payload = { contents: chatHistory };
      const apiKey = ""; // Canvas will provide this in runtime
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const result = await response.json();

      if (
        result.candidates &&
        result.candidates.length > 0 &&
        result.candidates[0].content &&
        result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0
      ) {
        const text = result.candidates[0].content.parts[0].text;
        setRewrittenProblem(text);
      } else {
        setError(
          "Failed to get a rewritten problem from the AI. Please try again."
        );
        setRewrittenProblem(
          "Could not rewrite the problem. Please check your input and try again."
        );
      }
    } catch (err) {
      console.error("Error rewriting problem:", err);
      setError(
        `Failed to rewrite the problem: ${
          err instanceof Error ? err.message : String(err)
        }. Please try again.`
      );
      setRewrittenProblem(
        "An error occurred during rewriting. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextToSpeech = () => {
    if (!rewrittenProblem) return;

    // Use the Web Speech API for text-to-speech
    const speech = new SpeechSynthesisUtterance(rewrittenProblem);
    speech.rate = 0.9;
    speech.pitch = 1;
    window.speechSynthesis.speak(speech);
  };

  const handleSave = () => {
    if (!rewrittenProblem) return;

    // Create a text file and trigger download
    const blob = new Blob([rewrittenProblem], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `math-problem-themed.txt`; // Generic name since theme is custom
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 7. Render Logic (JSX)
  // The structure of the component's output
  return (
    <div className="space-y-6 py-4">
      <Header />

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card className="p-4">
            <h2 className="text-xl font-bold mb-2">Original Problem</h2>
            <div className="min-h-24 p-4 bg-amber-50 rounded-md">
              {originalProblem || (
                <p className="text-gray-400 italic">
                  Upload or take a photo of a math problem to get started
                </p>
              )}
              {/* For demonstration, allow manual input of original problem */}
              <textarea
                className="w-full mt-2 p-2 border rounded-md"
                placeholder="Or type the original problem here..."
                value={originalProblem}
                onChange={(e) => setOriginalProblem(e.target.value)}
                rows={3}
              />
            </div>
          </Card>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              Choose a Theme or Enter Your Own:
            </h3>
            <Input
              type="text"
              placeholder="e.g., 'Space adventure', 'Dinosaur world'"
              value={customThemeInput}
              onChange={(e) => setCustomThemeInput(e.target.value)}
              className="w-full p-2 border rounded-md"
            />

            <div className="flex flex-wrap gap-2 justify-center">
              {themeHints.map((hint, index) => (
                <Button
                  key={index}
                  onClick={() => handleHintClick(hint)}
                  variant="outline"
                  className="rounded-full px-4 py-2 text-sm flex items-center space-x-1 hover:bg-gray-100 transition-colors"
                >
                  <Lightbulb className="h-4 w-4 text-yellow-500" />
                  <span>{hint}</span>
                </Button>
              ))}
            </div>

            {error && (
              <div className="text-red-500 text-sm p-2 bg-red-100 rounded-md">
                {error}
              </div>
            )}

            <Button
              onClick={handleRewrite}
              disabled={
                !originalProblem || !customThemeInput.trim() || isLoading
              }
              className="w-full bg-orange-400 hover:bg-orange-500 text-white text-lg py-6"
            >
              {isLoading ? (
                <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                "Rewrite!"
              )}
            </Button>
          </div>
        </div>

        {/* ProblemDisplay and ActionButtons are now grouped and ProblemDisplay comes first */}
        <div className="space-y-6">
          <ProblemDisplay
            rewrittenProblem={rewrittenProblem}
            onListen={handleTextToSpeech}
            onRephrase={handleRewrite}
            onSave={handleSave}
          />
          <ActionButtons />
        </div>
      </div>
    </div>
  );
}
