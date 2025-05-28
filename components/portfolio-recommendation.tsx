"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { PieChartIcon, Target, Shield, Zap, TrendingUp, DollarSign, CheckCircle } from "lucide-react"

interface Portfolio {
  [key: string]: number
}

interface PortfolioItem {
  name: string
  value: number
  color: string
  expectedReturn: number
  risk: string
}

interface RiskProfile {
  score: number
  category: string
  description: string
  color: string
}

export default function PortfolioRecommendation() {
  const [age, setAge] = useState<number>(35)
  const [experience, setExperience] = useState<string>("medium")
  const [retirementYears, setRetirementYears] = useState<number>(20)
  const [incomeNeeds, setIncomeNeeds] = useState<number[]>([50])
  const [investmentGoal, setInvestmentGoal] = useState<string>("growth")
  const [riskTolerance, setRiskTolerance] = useState<number[]>([5])
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(10000)
  const [recommendation, setRecommendation] = useState<{
    risk: RiskProfile
    portfolio: PortfolioItem[]
    expectedReturn: number
    insights: string[]
  } | null>(null)

  // Color palette from the image
  const colors = {
    light: "#DFFF6",
    darkPurple: "#231651",
    teal: "#40C6BD",
    blue: "#2374AB",
    coral: "#FF4B4A",
  }

  const assessRisk = (): RiskProfile => {
    let score = 0

    // Age factor (younger = higher risk tolerance)
    if (age < 30) score += 3
    else if (age < 40) score += 2
    else if (age < 50) score += 1
    else score += 0

    // Experience factor
    if (experience === "high") score += 3
    else if (experience === "medium") score += 2
    else score += 1

    // Time horizon factor
    if (retirementYears > 20) score += 3
    else if (retirementYears > 10) score += 2
    else score += 1

    // Income needs factor (lower needs = higher risk tolerance)
    if (incomeNeeds[0] < 30) score += 3
    else if (incomeNeeds[0] < 60) score += 2
    else score += 1

    // Risk tolerance factor
    score += Math.floor(riskTolerance[0] / 2)

    // Investment goal factor
    if (investmentGoal === "aggressive_growth") score += 3
    else if (investmentGoal === "growth") score += 2
    else if (investmentGoal === "balanced") score += 1
    else score += 0

    if (score >= 15) {
      return {
        score,
        category: "aggressive",
        description: "High growth potential with higher volatility",
        color: colors.coral,
      }
    } else if (score >= 10) {
      return { score, category: "moderate", description: "Balanced approach with moderate risk", color: colors.blue }
    } else {
      return {
        score,
        category: "conservative",
        description: "Capital preservation with steady returns",
        color: colors.teal,
      }
    }
  }

  const getPortfolio = (riskProfile: RiskProfile): PortfolioItem[] => {
    const portfolios = {
      aggressive: [
        { name: "Technology Stocks", value: 35, color: colors.coral, expectedReturn: 12, risk: "High" },
        { name: "Emerging Markets", value: 25, color: colors.darkPurple, expectedReturn: 10, risk: "High" },
        { name: "Growth Stocks", value: 20, color: colors.blue, expectedReturn: 9, risk: "Medium" },
        { name: "Corporate Bonds", value: 15, color: colors.teal, expectedReturn: 6, risk: "Low" },
        { name: "REITs", value: 5, color: colors.light, expectedReturn: 7, risk: "Medium" },
      ],
      moderate: [
        { name: "Blue-chip Stocks", value: 30, color: colors.blue, expectedReturn: 8, risk: "Medium" },
        { name: "Government Bonds", value: 25, color: colors.teal, expectedReturn: 5, risk: "Low" },
        { name: "Technology Stocks", value: 20, color: colors.coral, expectedReturn: 12, risk: "High" },
        { name: "Dividend Stocks", value: 15, color: colors.darkPurple, expectedReturn: 7, risk: "Low" },
        { name: "International Funds", value: 10, color: colors.light, expectedReturn: 6, risk: "Medium" },
      ],
      conservative: [
        { name: "Government Bonds", value: 40, color: colors.teal, expectedReturn: 5, risk: "Low" },
        { name: "Dividend Stocks", value: 25, color: colors.blue, expectedReturn: 7, risk: "Low" },
        { name: "Fixed Deposits", value: 20, color: colors.darkPurple, expectedReturn: 4, risk: "Very Low" },
        { name: "Gold/Commodities", value: 10, color: colors.coral, expectedReturn: 6, risk: "Medium" },
        { name: "Money Market", value: 5, color: colors.light, expectedReturn: 3, risk: "Very Low" },
      ],
    }
    return portfolios[riskProfile.category as keyof typeof portfolios]
  }

  const generateInsights = (riskProfile: RiskProfile, portfolio: PortfolioItem[]): string[] => {
    const insights = []

    if (riskProfile.category === "aggressive") {
      insights.push("Your portfolio is optimized for maximum growth potential over the long term")
      insights.push("Consider dollar-cost averaging to reduce timing risk")
      insights.push("Review and rebalance quarterly to maintain target allocation")
    } else if (riskProfile.category === "moderate") {
      insights.push("Your balanced approach provides steady growth with manageable risk")
      insights.push("Consider increasing equity allocation if market conditions are favorable")
      insights.push("Rebalance semi-annually to maintain optimal risk-return profile")
    } else {
      insights.push("Your conservative approach prioritizes capital preservation")
      insights.push("Consider inflation-protected securities for long-term purchasing power")
      insights.push("Review allocation annually and adjust based on changing needs")
    }

    if (monthlyInvestment >= 20000) {
      insights.push("Your substantial monthly investment allows for excellent diversification")
    } else if (monthlyInvestment >= 10000) {
      insights.push("Your monthly investment provides good foundation for wealth building")
    }

    return insights
  }

  const generateRecommendation = () => {
    const riskProfile = assessRisk()
    const portfolio = getPortfolio(riskProfile)
    const expectedReturn = portfolio.reduce((acc, item) => acc + (item.value * item.expectedReturn) / 100, 0)
    const insights = generateInsights(riskProfile, portfolio)

    setRecommendation({ risk: riskProfile, portfolio, expectedReturn, insights })
  }

  const formatINR = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const calculateProjectedValue = () => {
    if (!recommendation) return 0
    const monthlyAmount = monthlyInvestment
    const annualReturn = recommendation.expectedReturn / 100
    const months = retirementYears * 12

    // Future value of annuity formula
    const futureValue = monthlyAmount * (((1 + annualReturn / 12) ** months - 1) / (annualReturn / 12))
    return futureValue
  }

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card style={{ borderColor: colors.teal }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{ color: colors.darkPurple }}>
              <Target className="h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
                  <SelectItem value="low">Beginner - New to investing</SelectItem>
                  <SelectItem value="medium">Intermediate - Some experience</SelectItem>
                  <SelectItem value="high">Advanced - Experienced investor</SelectItem>
                </SelectContent>
              </Select>
            </div>

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
          </CardContent>
        </Card>

        <Card style={{ borderColor: colors.blue }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{ color: colors.darkPurple }}>
              <DollarSign className="h-5 w-5" />
              Investment Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="goal">Investment Goal</Label>
              <Select value={investmentGoal} onValueChange={setInvestmentGoal}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="conservative">Capital Preservation</SelectItem>
                  <SelectItem value="balanced">Balanced Growth</SelectItem>
                  <SelectItem value="growth">Long-term Growth</SelectItem>
                  <SelectItem value="aggressive_growth">Aggressive Growth</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="monthly">Monthly Investment (₹)</Label>
              <Input
                id="monthly"
                type="number"
                value={monthlyInvestment}
                onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
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

            <div>
              <Label htmlFor="risk">Risk Tolerance (1-10)</Label>
              <div className="mt-2 px-2">
                <Slider
                  value={riskTolerance}
                  onValueChange={setRiskTolerance}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="text-center text-sm text-gray-600 mt-1">{riskTolerance[0]}/10</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Button onClick={generateRecommendation} className="w-full text-white" style={{ backgroundColor: colors.coral }}>
        <PieChartIcon className="mr-2 h-4 w-4" />
        Generate Portfolio Recommendation
      </Button>

      {recommendation && (
        <div className="space-y-6">
          {/* Risk Profile Summary */}
          <Card style={{ borderColor: recommendation.risk.color }}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2" style={{ color: colors.darkPurple }}>
                  {recommendation.risk.category === "aggressive" && <Zap className="h-5 w-5" />}
                  {recommendation.risk.category === "moderate" && <Target className="h-5 w-5" />}
                  {recommendation.risk.category === "conservative" && <Shield className="h-5 w-5" />}
                  Risk Profile:{" "}
                  {recommendation.risk.category.charAt(0).toUpperCase() + recommendation.risk.category.slice(1)}
                </span>
                <Badge style={{ backgroundColor: recommendation.risk.color, color: "white" }}>
                  Score: {recommendation.risk.score}/18
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">{recommendation.risk.description}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 rounded-lg" style={{ backgroundColor: `${colors.teal}20` }}>
                  <p className="text-sm font-medium" style={{ color: colors.darkPurple }}>
                    Expected Return
                  </p>
                  <p className="text-xl font-bold" style={{ color: colors.coral }}>
                    {recommendation.expectedReturn.toFixed(1)}%
                  </p>
                </div>
                <div className="text-center p-3 rounded-lg" style={{ backgroundColor: `${colors.blue}20` }}>
                  <p className="text-sm font-medium" style={{ color: colors.darkPurple }}>
                    Time Horizon
                  </p>
                  <p className="text-xl font-bold" style={{ color: colors.coral }}>
                    {retirementYears} years
                  </p>
                </div>
                <div className="text-center p-3 rounded-lg" style={{ backgroundColor: `${colors.coral}20` }}>
                  <p className="text-sm font-medium" style={{ color: colors.darkPurple }}>
                    Monthly SIP
                  </p>
                  <p className="text-xl font-bold" style={{ color: colors.coral }}>
                    {formatINR(monthlyInvestment)}
                  </p>
                </div>
                <div className="text-center p-3 rounded-lg" style={{ backgroundColor: `${colors.darkPurple}20` }}>
                  <p className="text-sm font-medium" style={{ color: colors.darkPurple }}>
                    Projected Value
                  </p>
                  <p className="text-xl font-bold" style={{ color: colors.coral }}>
                    {formatINR(calculateProjectedValue())}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Portfolio Visualization */}
          <Card>
            <CardHeader>
              <CardTitle style={{ color: colors.darkPurple }}>Portfolio Allocation</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="pie" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="pie">Pie Chart</TabsTrigger>
                  <TabsTrigger value="bar">Bar Chart</TabsTrigger>
                </TabsList>

                <TabsContent value="pie" className="mt-4">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={recommendation.portfolio}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {recommendation.portfolio.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, "Allocation"]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>

                <TabsContent value="bar" className="mt-4">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={recommendation.portfolio}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value}%`, "Allocation"]} />
                        <Bar dataKey="value" fill={colors.blue} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-6 space-y-3">
                {recommendation.portfolio.map((asset, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg"
                    style={{ backgroundColor: `${asset.color}15` }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: asset.color }} />
                      <span className="font-medium" style={{ color: colors.darkPurple }}>
                        {asset.name}
                      </span>
                      <Badge variant="outline" style={{ borderColor: asset.color, color: asset.color }}>
                        {asset.risk} Risk
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="font-bold" style={{ color: colors.coral }}>
                        {asset.value}%
                      </div>
                      <div className="text-sm text-gray-600">{asset.expectedReturn}% return</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Insights and Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ color: colors.darkPurple }}>
                <TrendingUp className="h-5 w-5" />
                Investment Insights & Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recommendation.insights.map((insight, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg"
                    style={{ backgroundColor: `${colors.teal}10` }}
                  >
                    <CheckCircle className="h-5 w-5 mt-0.5" style={{ color: colors.teal }} />
                    <span className="text-gray-700">{insight}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: `${colors.blue}10` }}>
                <h4 className="font-semibold mb-2" style={{ color: colors.darkPurple }}>
                  Portfolio Performance Projection
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Total Investment:</span>
                    <div className="font-bold" style={{ color: colors.coral }}>
                      {formatINR(monthlyInvestment * retirementYears * 12)}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Expected Value:</span>
                    <div className="font-bold" style={{ color: colors.coral }}>
                      {formatINR(calculateProjectedValue())}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Potential Gains:</span>
                    <div className="font-bold" style={{ color: colors.coral }}>
                      {formatINR(calculateProjectedValue() - monthlyInvestment * retirementYears * 12)}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="p-4 rounded-lg" style={{ backgroundColor: `${colors.darkPurple}10` }}>
        <h3 className="font-semibold mb-2" style={{ color: colors.darkPurple }}>
          📊 Enhanced Portfolio Features:
        </h3>
        <div className="grid gap-2 text-sm" style={{ color: colors.darkPurple }}>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4" style={{ color: colors.teal }} />
            <span>
              <strong>Advanced Risk Assessment:</strong> Multi-factor analysis for precise risk profiling
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4" style={{ color: colors.blue }} />
            <span>
              <strong>Interactive Visualizations:</strong> Pie charts and bar graphs for clear allocation view
            </span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" style={{ color: colors.coral }} />
            <span>
              <strong>Performance Projections:</strong> Expected returns and future value calculations
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4" style={{ color: colors.coral }} />
            <span>
              <strong>Personalized Insights:</strong> Tailored recommendations based on your profile
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
