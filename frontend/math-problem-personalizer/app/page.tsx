import type { Metadata } from "next"
import Header from "@/components/header"
import ProblemInput from "@/components/problem-input"
import ProblemDisplay from "@/components/problem-display"
import ThemeSelector from "@/components/theme-selector"
import ActionButtons from "@/components/action-buttons"

export const metadata: Metadata = {
  title: "Math Problem Personalizer",
  description: "Personalize math problems based on your interests",
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Header />

        <div className="mt-8 bg-white rounded-xl shadow-lg p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <ProblemInput />
              <ThemeSelector />
            </div>

            <div className="space-y-6">
              <ProblemDisplay />
              <ActionButtons />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
