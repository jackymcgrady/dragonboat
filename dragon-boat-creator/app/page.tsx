"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import { Loader2 } from "lucide-react"

// Dragon boat options with descriptions
const dragonBoatOptions = [
  {
    id: 1,
    title: "Fiery Dragon",
    description: "A red and orange dragon boat with flames",
  },
  {
    id: 2,
    title: "Ocean Dragon",
    description: "A blue and green dragon boat with waves",
  },
  {
    id: 3,
    title: "Golden Dragon",
    description: "A shiny gold dragon boat with treasures",
  },
  {
    id: 4,
    title: "Rainbow Dragon",
    description: "A colorful dragon boat with rainbow scales",
  },
]

export default function Home() {
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  // Function to handle option selection
  const handleOptionSelect = (optionId: number) => {
    setSelectedOption(optionId)
    setGeneratedImage(null)
  }

  // Function to generate image based on selected option
  const generateImage = async () => {
    if (!selectedOption) return

    setIsGenerating(true)

    // Simulate AI image generation with a delay
    setTimeout(() => {
      // In a real app, this would call an AI image generation API
      const selectedBoat = dragonBoatOptions.find((option) => option.id === selectedOption)
      setGeneratedImage(
        `/placeholder.svg?height=400&width=600&text=${encodeURIComponent(selectedBoat?.title || "Dragon Boat")}`,
      )
      setIsGenerating(false)
    }, 2000)
  }

  // Function to reset all selections
  const startOver = () => {
    setSelectedOption(null)
    setGeneratedImage(null)
    setIsGenerating(false)
  }

  return (
    <main className="min-h-screen bg-yellow-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-purple-700 mb-2">Dragon Boat Creator</h1>
          <p className="text-xl text-purple-600">Choose an option to create your magical dragon boat!</p>
        </div>

        {!generatedImage ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {dragonBoatOptions.map((option) => (
                <Card
                  key={option.id}
                  className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
                    selectedOption === option.id ? "ring-4 ring-purple-500 bg-purple-50" : ""
                  }`}
                  onClick={() => handleOptionSelect(option.id)}
                >
                  <div className="flex flex-col items-center text-center">
                    <h3 className="text-2xl font-bold text-purple-700 mb-2">{option.title}</h3>
                    <p className="text-gray-600">{option.description}</p>
                  </div>
                </Card>
              ))}
            </div>

            <div className="flex justify-center gap-4">
              <Button
                onClick={generateImage}
                disabled={!selectedOption || isGenerating}
                size="lg"
                className="bg-green-600 hover:bg-green-700"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Dragon Boat...
                  </>
                ) : (
                  "Create My Dragon Boat!"
                )}
              </Button>

              <Button
                onClick={startOver}
                variant="outline"
                size="lg"
                className="border-red-500 text-red-500 hover:bg-red-50"
              >
                Start Over
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center">
            <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold text-purple-700 mb-4 text-center">Your Magical Dragon Boat</h2>
              <Image
                src={generatedImage || "/placeholder.svg"}
                alt="Generated Dragon Boat"
                width={600}
                height={400}
                className="rounded-lg"
              />
            </div>

            <div className="flex gap-4">
              <Button onClick={() => setGeneratedImage(null)} className="bg-blue-600 hover:bg-blue-700" size="lg">
                Choose Different Option
              </Button>

              <Button
                onClick={startOver}
                variant="outline"
                size="lg"
                className="border-red-500 text-red-500 hover:bg-red-50"
              >
                Start Over
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
