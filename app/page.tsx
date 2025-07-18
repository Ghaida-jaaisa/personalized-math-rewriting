import type { Metadata } from "next";
import MathProblemPersonalizer from "@/components/math-problem-personalizer";

export const metadata: Metadata = {
  title: "Math Problem Personalizer",
  description: "Rewrite math word problems based on your interests",
};

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-400 to-sky-300 p-4">
      <div className="max-w-4xl mx-auto">
        <MathProblemPersonalizer />
      </div>
    </main>
  );
}
