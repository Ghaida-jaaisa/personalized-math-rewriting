"use client"
import { useState } from "react"
import { Bookmark } from "lucide-react" // Import Bookmark icon

// Icons
import { RefreshCw, Lightbulb, Edit, Save, Volume2, VolumeX, Pause, Play } from "lucide-react"
import Header from "@/components/header"

export default function MathProblemPersonalizer() {
  // State Management
  const [originalProblem, setOriginalProblem] = useState<string>("")
  const [rewrittenProblem, setRewrittenProblem] = useState<string>("")
  const [customThemeInput, setCustomThemeInput] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // Text-to-speech state
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [isPaused, setIsPaused] = useState<boolean>(false)
  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null)

  // Constants
  const themeHints: string[] = ["Football", "Minecraft", "Cooking", "Space Exploration", "Zoo animals"]

  // Check if we have a rewritten problem to enable action buttons
  const hasRewrittenProblem = rewrittenProblem.trim().length > 0

  // Event Handlers
  const handleHintClick = (hint: string) => {
    setCustomThemeInput(hint)
  }

  const handleRewrite = async () => {
    if (!originalProblem) {
      setError("Please provide an original math problem first.")
      return
    }
    if (!customThemeInput.trim()) {
      setError("Please enter a theme for the rewrite.")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      
      // const response = await fetch("http://127.0.0.1:8000/api/rewrite-problem", {
      const response = await fetch("https://math-rewriter-api.onrender.com/api/rewrite-problem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          problem: originalProblem,
          theme: customThemeInput,
        }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()

      if (result.rewritten_problem) {
        setRewrittenProblem(result.rewritten_problem)
      } else if (result.problem) {
        setRewrittenProblem(result.problem)
      } else if (typeof result === "string") {
        setRewrittenProblem(result)
      } else {
        setError("Unexpected response format from API")
        setRewrittenProblem("Could not parse the API response. Please try again.")
      }
    } catch (err) {
      console.error("Error rewriting problem:", err)
      if (err instanceof Error) {
        if (err.message.includes("fetch")) {
          setError("Could not connect to the local API. Make sure your server is running on http://127.0.0.1:8000")
        } else {
          setError(`Failed to rewrite the problem: ${err.message}`)
        }
      } else {
        setError("An unexpected error occurred. Please try again.")
      }
      setRewrittenProblem("An error occurred during rewriting. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleTextToSpeech = () => {
    if (!rewrittenProblem) return

    // If currently playing, stop it
    if (isPlaying) {
      window.speechSynthesis.cancel()
      setIsPlaying(false)
      setIsPaused(false)
      setCurrentUtterance(null)
      return
    }

    // If paused, resume
    if (isPaused && currentUtterance) {
      window.speechSynthesis.resume()
      setIsPlaying(true)
      setIsPaused(false)
      return
    }

    // Start new speech
    const speech = new SpeechSynthesisUtterance(rewrittenProblem)
    speech.rate = 0.9
    speech.pitch = 1

    // Event listeners
    speech.onstart = () => {
      setIsPlaying(true)
      setIsPaused(false)
    }

    speech.onend = () => {
      setIsPlaying(false)
      setIsPaused(false)
      setCurrentUtterance(null)
    }

    speech.onerror = () => {
      setIsPlaying(false)
      setIsPaused(false)
      setCurrentUtterance(null)
    }

    setCurrentUtterance(speech)
    window.speechSynthesis.speak(speech)
  }

  const handlePauseSpeech = () => {
    if (isPlaying) {
      window.speechSynthesis.pause()
      setIsPlaying(false)
      setIsPaused(true)
    }
  }

  const handleSave = () => {
    if (!rewrittenProblem) return

    // Create a comprehensive file content
    const fileContent = `MATH PROBLEM PERSONALIZER
========================

ORIGINAL PROBLEM:
${originalProblem}

THEME USED:
${customThemeInput}

PERSONALIZED PROBLEM:
${rewrittenProblem}

========================
Generated on: ${new Date().toLocaleString()}
`

    const blob = new Blob([fileContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `math-problem-${customThemeInput.toLowerCase().replace(/\s+/g, "-")}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Get the appropriate icon and text for the speech button
  const getSpeechButtonContent = () => {
    if (isPlaying) {
      return {
        icon: <VolumeX className="h-6 w-6 text-red-500 transition-all duration-300" />,
        text: "Stop reading",
        color: "text-red-500",
      }
    } else if (isPaused) {
      return {
        icon: <Play className="h-6 w-6 text-green-500 transition-all duration-300" />,
        text: "Resume reading",
        color: "text-green-500",
      }
    } else {
      return {
        icon: (
          <Volume2
            className={`h-6 w-6 transition-all duration-300 ${hasRewrittenProblem ? "text-blue-500" : "text-gray-400"}`}
          />
        ),
        text: "Read for me",
        color: hasRewrittenProblem ? "text-blue-500" : "text-gray-400",
      }
    }
  }

  const speechButtonContent = getSpeechButtonContent()

  return (
    <div className="space-y-6 py-4">
      <Header />

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Original Problem Card */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4 text-black">Original Problem</h2>
            <div className="relative">
              <textarea
                className="w-full p-4 border border-gray-200 rounded-md bg-gray-50 text-gray-900 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 focus:shadow-lg transform  hover:shadow-md hover:scale-[1.02]"
                placeholder="Type the original problem here..."
                value={originalProblem}
                onChange={(e) => setOriginalProblem(e.target.value)}
                rows={4}
              />
              <div className="absolute bottom-3 right-3 flex gap-2">
                <Edit className="h-4 w-4 text-gray-400 transition-colors duration-200 hover:text-blue-500" />
                <Save className="h-4 w-4 text-green-500 transition-all duration-200 hover:scale-110" />
              </div>
            </div>
          </div>

          {/* Theme Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Choose a Theme or Enter Your Own:</h3>

            <input
              type="text"
              value={customThemeInput}
              onChange={(e) => setCustomThemeInput(e.target.value)}
              className="w-full p-4 border border-gray-200 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 focus:shadow-lg transform hover:scale-[1.01]"
              placeholder="e.g., 'Swimming', 'Cooking', 'Football'"
            />

            <div className="flex flex-wrap gap-3 justify-start">
              {themeHints.map((hint, index) => (
                <button
                  key={index}
                  onClick={() => handleHintClick(hint)}
                  className="bg-white rounded-full px-4 py-2 text-sm flex items-center gap-2 text-gray-700 hover:bg-gray-50 transition-all duration-300 shadow-sm border border-gray-200 transform hover:scale-105 hover:shadow-md active:scale-95"
                >
                  <Lightbulb className="h-4 w-4 text-yellow-500 transition-all duration-300 hover:rotate-12" />
                  <span className="transition-colors duration-200">{hint}</span>
                </button>
              ))}
            </div>

            {error && (
              <div className="text-red-600 text-sm p-3 bg-red-50 rounded-md border border-red-200 animate-pulse">
                {error}
              </div>
            )}

            {/* Rewrite Button */}
            <button
              onClick={handleRewrite}
              disabled={!originalProblem || !customThemeInput.trim() || isLoading}
              className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-lg py-4 px-6 rounded-md font-semibold transition-all duration-300 shadow-sm transform hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] disabled:transform-none disabled:hover:scale-100"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  <span className="animate-pulse">Rewriting...</span>
                </div>
              ) : (
                <span className="transition-all duration-200">Rewrite!</span>
              )}
            </button>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Personalized Problem Card */}
          <div className="bg-amber-50 rounded-lg p-6 shadow-sm min-h-[300px] ">
            <h2 className="text-xl font-bold mb-4 text-black">Your Personalized Problem</h2>
            <div className="text-gray-700 leading-relaxed transition-all duration-500">
              {rewrittenProblem || "Your personalized math problem will appear here after you click 'Rewrite!'"}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-4 gap-3">
            {/* Speech Control Button */}
            <button
              onClick={handleTextToSpeech}
              disabled={!hasRewrittenProblem}
              className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 flex flex-col items-center gap-1 transform hover:scale-105 active:scale-95 disabled:transform-none disabled:hover:scale-100 hover:shadow-md"
            >
              <div className={`transition-all duration-300 ${isPlaying ? "animate-pulse" : ""}`}>
                {speechButtonContent.icon}
              </div>
              <span
                className={`text-xs transition-all duration-300 ${hasRewrittenProblem ? speechButtonContent.color : "text-gray-400"}`}
              >
                {speechButtonContent.text}
              </span>
            </button>

            {/* Pause Button (only show when playing) */}
            {isPlaying && (
              <button
                onClick={handlePauseSpeech}
                className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 hover:bg-gray-50 transition-all duration-300 flex flex-col items-center gap-1 transform hover:scale-105 active:scale-95 hover:shadow-md animate-fadeIn"
              >
                <Pause className="h-6 w-6 text-orange-500 transition-all duration-300 hover:scale-110" />
                <span className="text-xs text-orange-500 transition-colors duration-200">Pause</span>
              </button>
            )}

            {/* Try Another Theme Button */}
            <button
              onClick={handleRewrite}
              disabled={!originalProblem || !customThemeInput.trim() || isLoading || !hasRewrittenProblem}
              className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 flex flex-col items-center gap-1 transform hover:scale-105 active:scale-95 disabled:transform-none disabled:hover:scale-100 hover:shadow-md"
            >
              {isLoading ? (
                <RefreshCw className="h-6 w-6 text-purple-500 animate-spin" />
              ) : (
                <RefreshCw
                  className={`h-6 w-6 transition-all duration-300 hover:rotate-180 ${hasRewrittenProblem ? "text-purple-500" : "text-gray-400"}`}
                />
              )}
              <span
                className={`text-xs transition-all duration-300 ${hasRewrittenProblem ? "text-purple-500" : "text-gray-400"}`}
              >
                Try another theme
              </span>
            </button>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={!hasRewrittenProblem}
              className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 flex flex-col items-center gap-1 transform hover:scale-105 active:scale-95 disabled:transform-none disabled:hover:scale-100 hover:shadow-md"
            >
              <Bookmark
                className={`h-6 w-6 transition-all duration-300 hover:scale-110 ${hasRewrittenProblem ? "text-green-500" : "text-gray-400"}`}
              />
              <span
                className={`text-xs transition-all duration-300 ${hasRewrittenProblem ? "text-green-500" : "text-gray-400"}`}
              >
                Save Problem
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
