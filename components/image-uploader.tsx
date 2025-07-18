"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Camera, Upload } from "lucide-react"

interface ImageUploaderProps {
  onImageProcessed: (text: string) => void
}

export default function ImageUploader({ onImageProcessed }: ImageUploaderProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    processImage(file)
  }

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })

      // Create video and canvas elements for capturing the photo
      const video = document.createElement("video")
      video.srcObject = stream
      video.play()

      // Wait for video to be ready
      video.onloadedmetadata = () => {
        const canvas = document.createElement("canvas")
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        // Draw video frame to canvas
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        ctx.drawImage(video, 0, 0)

        // Stop the camera stream
        stream.getTracks().forEach((track) => track.stop())

        // Convert canvas to file
        canvas.toBlob((blob) => {
          if (!blob) return
          const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" })
          processImage(file)
        }, "image/jpeg")
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      alert("Could not access camera. Please check permissions.")
    }
  }

  const processImage = (file: File) => {
    setIsProcessing(true)

    // Simulate OCR processing
    setTimeout(() => {
      // In a real app, this would be an API call to an OCR service
      const exampleExtractedText =
        "A teacher has 6 shelves. Each shelf holds 12 books. How many books are there in total?"
      onImageProcessed(exampleExtractedText)
      setIsProcessing(false)
    }, 1500)
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Upload Math Problem</h2>
      <div className="grid grid-cols-2 gap-4">
        <Button
          onClick={handleCameraCapture}
          className="flex items-center justify-center space-x-2 py-6"
          variant="outline"
        >
          <Camera className="h-5 w-5" />
          <span>Take a Photo</span>
        </Button>

        <Button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center justify-center space-x-2 py-6"
          variant="outline"
        >
          <Upload className="h-5 w-5" />
          <span>Upload Image</span>
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
        </Button>
      </div>

      {isProcessing && <div className="mt-4 text-center text-sm text-gray-500">Processing image...</div>}
    </Card>
  )
}
