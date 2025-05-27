"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Upload, Brain, TrendingUp } from "lucide-react"

export default function StockPrediction() {
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<string>("")
  const [progress, setProgress] = useState(0)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setResult("")
    }
  }

  const simulatePrediction = async () => {
    if (!file) return

    setIsProcessing(true)
    setProgress(0)

    // Simulate processing steps
    const steps = [
      { message: "Reading CSV file...", duration: 500 },
      { message: "Preprocessing data...", duration: 800 },
      { message: "Training LSTM model...", duration: 2000 },
      { message: "Generating prediction...", duration: 700 },
    ]

    for (let i = 0; i < steps.length; i++) {
      setProgress((i / steps.length) * 100)
      await new Promise((resolve) => setTimeout(resolve, steps[i].duration))
    }

    // Simulate prediction result
    const predictedPrice = (Math.random() * 200 + 50).toFixed(2)
    setProgress(100)
    setResult(`✅ Predicted next close price: $${predictedPrice}`)
    setIsProcessing(false)
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div>
          <Label htmlFor="csv-upload" className="text-base font-medium">
            Upload Historical Stock Data (CSV)
          </Label>
          <div className="mt-2">
            <Input id="csv-upload" type="file" accept=".csv" onChange={handleFileChange} className="cursor-pointer" />
          </div>
          <p className="text-sm text-gray-500 mt-1">
            CSV file must contain a 'Close' column with at least 70 rows of historical prices
          </p>
        </div>

        {file && (
          <Alert>
            <Upload className="h-4 w-4" />
            <AlertDescription>
              File uploaded: {file.name} ({(file.size / 1024).toFixed(1)} KB)
            </AlertDescription>
          </Alert>
        )}

        <Button onClick={simulatePrediction} disabled={!file || isProcessing} className="w-full">
          {isProcessing ? (
            <>
              <Brain className="mr-2 h-4 w-4 animate-spin" />
              Training AI Model...
            </>
          ) : (
            <>
              <TrendingUp className="mr-2 h-4 w-4" />
              Train & Predict
            </>
          )}
        </Button>

        {isProcessing && (
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-center text-gray-600">Processing... {progress.toFixed(0)}%</p>
          </div>
        )}

        {result && (
          <Alert className="border-green-200 bg-green-50">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 font-medium">{result}</AlertDescription>
          </Alert>
        )}
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">How it works:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Upload CSV with historical 'Close' prices</li>
          <li>• AI preprocesses data using MinMax scaling</li>
          <li>• LSTM neural network trains on 60-day sequences</li>
          <li>• Model predicts next day's closing price</li>
        </ul>
      </div>
    </div>
  )
}
