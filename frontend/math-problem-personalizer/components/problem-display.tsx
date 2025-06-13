"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProblemDisplay() {
  const [isLoading, setIsLoading] = useState(true)
  const [rewrittenProblem, setRewrittenProblem] = useState("")

  useEffect(() => {
    // Simulate API call to rewrite the problem
    const timer = setTimeout(() => {
      setRewrittenProblem(
        "Steve is mining diamonds in Minecraft and travels 120 blocks in 2 minutes. If he maintains the same speed, how many blocks will he travel in 5 minutes? Remember, watch out for creepers along the way!",
      )
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personalized Problem</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[90%]" />
            <Skeleton className="h-4 w-[95%]" />
            <Skeleton className="h-4 w-[85%]" />
          </div>
        ) : (
          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
            <p className="text-gray-800 leading-relaxed">{rewrittenProblem}</p>
          </div>
        )}

        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Learning Objectives:</h3>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            <li>Proportional relationships</li>
            <li>Rate and distance calculations</li>
            <li>Applying math to real-world scenarios</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
