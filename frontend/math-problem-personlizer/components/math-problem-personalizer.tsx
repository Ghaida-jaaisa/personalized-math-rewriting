"use client"
import { useState } from "react"

// Icons
import { RefreshCw, Lightbulb, Edit, Save, Volume2, Bookmark } from "lucide-react"
import Header from "@/components/header"

export default function MathProblemPersonalizer() {
  // State Management
  const [originalProblem, setOriginalProblem] = useState<string>("")
  const [rewrittenProblem, setRewrittenProblem] = useState<string>("")
  const [customThemeInput, setCustomThemeInput] = useState<string>("Football")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

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
      const response = await fetch("http://127.0.0.1:8000/api/rewrite-problem", {
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

    const speech = new SpeechSynthesisUtterance(rewrittenProblem)
    speech.rate = 0.9
    speech.pitch = 1
    window.speechSynthesis.speak(speech)
  }

  const handleSave = () => {
    if (!rewrittenProblem) return

    const blob = new Blob([rewrittenProblem], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `math-problem-themed.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

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
                className="w-full p-4 border border-gray-200 rounded-md bg-gray-50 text-gray-900 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Type the original problem here..."
                value={originalProblem}
                onChange={(e) => setOriginalProblem(e.target.value)}
                rows={4}
              />
              <div className="absolute bottom-3 right-3 flex gap-2">
                <Edit className="h-4 w-4 text-gray-400" />
                <Save className="h-4 w-4 text-green-500" />
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
              className="w-full p-4 border border-gray-200 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 'Swimming', 'Cooking', 'Football'"
            />

            <div className="flex flex-wrap gap-3 justify-start">
              {themeHints.map((hint, index) => (
                <button
                  key={index}
                  onClick={() => handleHintClick(hint)}
                  className="bg-white rounded-full px-4 py-2 text-sm flex items-center gap-2 text-gray-700 hover:bg-gray-50 transition-colors shadow-sm border border-gray-200"
                >
                  <Lightbulb className="h-4 w-4 text-yellow-500" />
                  <span>{hint}</span>
                </button>
              ))}
            </div>

            {error && (
              <div className="text-red-600 text-sm p-3 bg-red-50 rounded-md border border-red-200">{error}</div>
            )}

            {/* Rewrite Button */}
            <button
              onClick={handleRewrite}
              disabled={!originalProblem || !customThemeInput.trim() || isLoading}
              className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-lg py-4 px-6 rounded-md font-semibold transition-colors shadow-sm"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  <span>Rewriting...</span>
                </div>
              ) : (
                "Rewrite!"
              )}
            </button>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Personalized Problem Card */}
          <div className="bg-amber-50 rounded-lg p-6 shadow-sm min-h-[300px]">
            <h2 className="text-xl font-bold mb-4 text-black">Your Personalized Problem</h2>
            <div className="text-gray-700 leading-relaxed">
              {rewrittenProblem || "Your personalized math problem will appear here after you click 'Rewrite!'"}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={handleTextToSpeech}
              disabled={!hasRewrittenProblem}
              className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 transition-colors flex flex-col items-center gap-2"
            >
              <Volume2 className={`h-6 w-6 ${hasRewrittenProblem ? "text-blue-500" : "text-gray-400"}`} />
              <span className={`text-sm ${hasRewrittenProblem ? "text-gray-700" : "text-gray-400"}`}>Read for me</span>
            </button>

            <button
              onClick={handleRewrite}
              disabled={!originalProblem || !customThemeInput.trim() || isLoading || !hasRewrittenProblem}
              className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 transition-colors flex flex-col items-center gap-2"
            >
              {isLoading ? (
                <RefreshCw className="h-6 w-6 text-purple-500 animate-spin" />
              ) : (
                <RefreshCw className={`h-6 w-6 ${hasRewrittenProblem ? "text-purple-500" : "text-gray-400"}`} />
              )}
              <span className={`text-sm ${hasRewrittenProblem ? "text-gray-700" : "text-gray-400"}`}>
                Try another theme
              </span>
            </button>

            <button
              onClick={handleSave}
              disabled={!hasRewrittenProblem}
              className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 transition-colors flex flex-col items-center gap-2"
            >
              <Bookmark className={`h-6 w-6 ${hasRewrittenProblem ? "text-orange-500" : "text-gray-400"}`} />
              <span className={`text-sm ${hasRewrittenProblem ? "text-gray-700" : "text-gray-400"}`}>Save problem</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
