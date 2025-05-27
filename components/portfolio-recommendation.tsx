"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Target, Shield, Zap } from "lucide-react"

interface Portfolio {
  [key: string]: number
}

export default function PortfolioRecommendation() {
  const [age, setAge] = useState<number>(35)
  const [experience, setExperience] = useState<string>("medium")
  const [retirementYears, setRetirementYears] = useState<number>(20)
  const [incomeNeeds, setIncomeNeeds] = useState<number[]>([50])
  const [recommendation, setRecommendation] = useState<{
    risk: string
    portfolio: Portfolio
  } | null>(null)

  const assessRisk = () => {
    if (age < 30 && experience === "high") {
      return "aggressive"
    } else if (age > 50 || experience === "low") {
      return "conservative"
    } else if (retirementYears < 10) {
      return "conservative"
    } else if (incomeNeeds[0] > 50) {
      return "moderate"
    }
    return "moderate"
  }

  const getPortfolio = (risk: string): Portfolio => {
    const portfolios = {
      aggressive: { "Tech Stocks": 50, "Emerging Markets": 30, Bonds: 20 },
      moderate: { "Tech Stocks": 30, Bonds: 40, "Blue-chip Stocks": 30 },
      conservative: { Bonds: 60, "Dividend Stocks": 30, "Gold/Commodities": 10 },
    }
    return portfolios[risk as keyof typeof portfolios]
  }

  const generateRecommendation = () => {
    const risk = assessRisk()
    const portfolio = getPortfolio(risk)
    setRecommendation({ risk, portfolio })
  }

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case "aggressive":
        return <Zap className="h-5 w-5 text-red-500" />
      case "moderate":
        return <Target className="h-5 w-5 text-yellow-500" />
      case "conservative":
        return <Shield className="h-5 w-5 text-green-500" />
      default:
        return <Target className="h-5 w-5" />
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "aggressive":
        return "border-red-200 bg-red-50"
      case "moderate":
        return "border-yellow-200 bg-yellow-50"
      case "conservative":
        return "border-green-200 bg-green-50"
      default:
        return "border-gray-200 bg-gray-50"
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="experience">Investment Experience</Label>
            <Select value={experience} onValueChange={setExperience}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low - New to investing</SelectItem>
                <SelectItem value="medium">Medium - Some experience</SelectItem>
                <SelectItem value="high">High - Experienced investor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="retirement">Years until retirement</Label>
            <Input
              id="retirement"
              type="number"
              value={retirementYears}
              onChange={(e) => setRetirementYears(Number(e.target.value))}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="income">Income needs from investments (%)</Label>
            <div className="mt-2 px-2">
              <Slider value={incomeNeeds} onValueChange={setIncomeNeeds} max={100} step={5} className="w-full" />
              <div className="text-center text-sm text-gray-600 mt-1">{incomeNeeds[0]}%</div>
            </div>
          </div>
        </div>
      </div>

      <Button onClick={generateRecommendation} className="w-full">
        <PieChart className="mr-2 h-4 w-4" />
        Get Portfolio Recommendation
      </Button>

      {recommendation && (
        <Card className={`${getRiskColor(recommendation.risk)}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getRiskIcon(recommendation.risk)}
              Risk Profile: {recommendation.risk.charAt(0).toUpperCase() + recommendation.risk.slice(1)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className="font-semibold mb-3">Recommended Portfolio Allocation:</h3>
            <div className="space-y-3">
              {Object.entries(recommendation.portfolio).map(([asset, percentage]) => (
                <div key={asset} className="flex items-center justify-between">
                  <span className="font-medium">{asset}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${percentage}%` }} />
                    </div>
                    <span className="text-sm font-semibold w-8">{percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">Portfolio Strategy Guide:</h3>
        <div className="grid gap-2 text-sm text-blue-800">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-green-500" />
            <span>
              <strong>Conservative:</strong> Focus on capital preservation with bonds and dividends
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-yellow-500" />
            <span>
              <strong>Moderate:</strong> Balanced growth and income with mixed assets
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-red-500" />
            <span>
              <strong>Aggressive:</strong> Maximum growth potential with higher volatility
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
