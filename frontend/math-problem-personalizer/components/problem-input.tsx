"use client"

import type React from "react"

import { useState } from "react"
import { Camera, Upload, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ProblemInput() {
  const [isCapturing, setIsCapturing] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const handleCapture = () => {
    setIsCapturing(true)
    // Simulate camera capture
    setTimeout(() => {
      setImagePreview("/placeholder.svg?height=200&width=300")
      setIsCapturing(false)
    }, 1500)
  }

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true)
      const file = e.target.files[0]
      const reader = new FileReader()

      reader.onloadend = () => {
        setImagePreview(reader.result as string)
        setIsUploading(false)
      }

      reader.readAsDataURL(file)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Math Problem</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={handleCapture} className="flex-1" disabled={isCapturing}>
              {isCapturing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Camera className="mr-2 h-4 w-4" />}
              Take a Photo
            </Button>

            <div className="relative flex-1">
              <Button
                className="w-full"
                disabled={isUploading}
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                Upload Image
              </Button>
              <input id="file-upload" type="file" accept="image/*" className="hidden" onChange={handleUpload} />
            </div>
          </div>

          {imagePreview && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
              <div className="border rounded-md overflow-hidden">
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt="Problem preview"
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
          )}

          {imagePreview && (
            <div className="mt-2 p-4 bg-gray-50 rounded-md">
              <h3 className="font-medium text-gray-900 mb-2">Original Problem:</h3>
              <p className="text-gray-700">
                A train travels 120 miles in 2 hours. If it maintains the same speed, how far will it travel in 5 hours?
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
