"use client"

import { useState } from "react"
import { RefreshCw, Volume2, Save, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function ActionButtons() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleRephrase = () => {
    setIsGenerating(true)
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false)
      toast({
        title: "Problem Rephrased",
        description: "Your math problem has been rephrased with a new approach.",
      })
    }, 1500)
  }

  const handleListen = () => {
    setIsPlaying(!isPlaying)
    // Simulate text-to-speech
    if (!isPlaying) {
      toast({
        title: "Playing Audio",
        description: "Text-to-speech started.",
      })
      // Would integrate with Web Speech API or similar
      setTimeout(() => setIsPlaying(false), 5000)
    }
  }

  const handleSave = () => {
    setIsSaving(true)
    // Simulate saving
    setTimeout(() => {
      setIsSaving(false)
      toast({
        title: "Problem Saved",
        description: "Your personalized problem has been saved successfully.",
      })
    }, 1000)
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-wrap gap-3 justify-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={handleRephrase} disabled={isGenerating} className="bg-blue-600 hover:bg-blue-700">
                  <RefreshCw className={`mr-2 h-4 w-4 ${isGenerating ? "animate-spin" : ""}`} />
                  Rephrase
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Generate a new version of the problem</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleListen}
                  variant={isPlaying ? "destructive" : "default"}
                  className={isPlaying ? "" : "bg-purple-600 hover:bg-purple-700"}
                >
                  <Volume2 className="mr-2 h-4 w-4" />
                  {isPlaying ? "Stop" : "Listen"}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Listen to the problem read aloud</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={handleSave} disabled={isSaving} variant="outline">
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Save this problem for later</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Share this problem with others</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  )
}
