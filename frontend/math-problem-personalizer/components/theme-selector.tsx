"use client"

import { useState } from "react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const themes = [
  { id: "minecraft", name: "Minecraft", icon: "🧱" },
  { id: "football", name: "Football", icon: "⚽" },
  { id: "space", name: "Space Exploration", icon: "🚀" },
  { id: "wildlife", name: "Wildlife", icon: "🦁" },
  { id: "superhero", name: "Superheroes", icon: "🦸" },
  { id: "cooking", name: "Cooking", icon: "👨‍🍳" },
  { id: "music", name: "Music", icon: "🎵" },
  { id: "fantasy", name: "Fantasy", icon: "🧙" },
]

export default function ThemeSelector() {
  const [selectedTheme, setSelectedTheme] = useState("")

  return (
    <Card>
      <CardHeader>
        <CardTitle>Choose Your Theme</CardTitle>
      </CardHeader>
      <CardContent>
        <Select value={selectedTheme} onValueChange={setSelectedTheme}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Themes</SelectLabel>
              {themes.map((theme) => (
                <SelectItem key={theme.id} value={theme.id}>
                  <div className="flex items-center">
                    <span className="mr-2">{theme.icon}</span>
                    <span>{theme.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {selectedTheme && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
            {themes
              .filter((t) => t.id !== selectedTheme)
              .slice(0, 4)
              .map((theme) => (
                <button
                  key={theme.id}
                  className="p-2 text-center border rounded-md hover:bg-gray-50 transition-colors"
                  onClick={() => setSelectedTheme(theme.id)}
                >
                  <div className="text-xl">{theme.icon}</div>
                  <div className="text-xs mt-1">{theme.name}</div>
                </button>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
