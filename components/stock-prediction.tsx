"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, TrendingUp, Calendar, BarChart3, LineChart } from "lucide-react"
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"

interface PredictionResult {
  nextDay: number
  nextWeek: number
  nextMonth: number
  confidence: number
  trend: "bullish" | "bearish" | "neutral"
  support: number
  resistance: number
  riskLevel: "low" | "medium" | "high"
  forecastData: Array<{
    date: string
    predicted: number
    lower: number
    upper: number
  }>
}

export default function StockPrediction() {
  const [selectedCompany, setSelectedCompany] = useState<string>("")
  const [customCompany, setCustomCompany] = useState<string>("")
  const [timeframe, setTimeframe] = useState<string>("short")
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [progress, setProgress] = useState(0)

  // Enhanced color palette
  const colors = {
    light: "#DFFF6",
    darkPurple: "#231651",
    teal: "#40C6BD",
    blue: "#2374AB",
    coral: "#FF4B4A",
    success: "#22C55E",
    warning: "#F59E0B",
    danger: "#EF4444",
  }

  // Popular Indian companies
  const popularCompanies = [
    { value: "RELIANCE", label: "Reliance Industries Ltd", sector: "Oil & Gas" },
    { value: "TCS", label: "Tata Consultancy Services", sector: "IT Services" },
    { value: "HDFCBANK", label: "HDFC Bank Ltd", sector: "Banking" },
    { value: "INFY", label: "Infosys Ltd", sector: "IT Services" },
    { value: "HINDUNILVR", label: "Hindustan Unilever Ltd", sector: "FMCG" },
    { value: "ITC", label: "ITC Ltd", sector: "FMCG" },
    { value: "SBIN", label: "State Bank of India", sector: "Banking" },
    { value: "BHARTIARTL", label: "Bharti Airtel Ltd", sector: "Telecom" },
    { value: "KOTAKBANK", label: "Kotak Mahindra Bank", sector: "Banking" },
    { value: "LT", label: "Larsen & Toubro Ltd", sector: "Construction" },
    { value: "ASIANPAINT", label: "Asian Paints Ltd", sector: "Paints" },
    { value: "MARUTI", label: "Maruti Suzuki India Ltd", sector: "Automobile" },
    { value: "TITAN", label: "Titan Company Ltd", sector: "Jewellery" },
    { value: "NESTLEIND", label: "Nestle India Ltd", sector: "FMCG" },
    { value: "ULTRACEMCO", label: "UltraTech Cement Ltd", sector: "Cement" },
  ]

  const generatePrediction = async () => {
    const company = selectedCompany || customCompany
    if (!company) return

    setIsProcessing(true)
    setProgress(0)
    setResult(null)

    // Simulate AI processing steps
    const steps = [
      { message: "Fetching historical data...", duration: 800 },
      { message: "Analyzing market trends...", duration: 1000 },
      { message: "Training AI model...", duration: 1500 },
      { message: "Generating predictions...", duration: 700 },
      { message: "Calculating confidence intervals...", duration: 500 },
    ]

    for (let i = 0; i < steps.length; i++) {
      setProgress(((i + 1) / steps.length) * 100)
      await new Promise((resolve) => setTimeout(resolve, steps[i].duration))
    }

    // Generate mock prediction data
    const basePrice = 1000 + Math.random() * 4000 // Base price between 1000-5000 INR
    const volatility = Math.random() * 0.05 // 0-5% volatility
    const trend = Math.random() > 0.5 ? 1 : -1 // Random trend direction
    const trendStrength = Math.random() * 0.1 // 0-10% trend strength

    // Generate forecast data
    const forecastData = []
    const currentDate = new Date()
    let currentPrice = basePrice

    for (let i = 1; i <= 30; i++) {
      currentDate.setDate(currentDate.getDate() + 1)
      const randomFactor = 1 + (Math.random() - 0.5) * volatility
      const trendFactor = 1 + trend * trendStrength * (i / 30) // Increasing trend effect over time
      currentPrice = currentPrice * randomFactor * trendFactor

      const confidenceFactor = 0.02 + (i / 30) * 0.08 // Widening confidence interval over time

      forecastData.push({
        date: currentDate.toLocaleDateString(),
        predicted: Math.round(currentPrice * 100) / 100,
        lower: Math.round(currentPrice * (1 - confidenceFactor) * 100) / 100,
        upper: Math.round(currentPrice * (1 + confidenceFactor) * 100) / 100,
      })
    }

    // Create prediction result
    const mockResult: PredictionResult = {
      nextDay: Math.round(forecastData[0].predicted * 100) / 100,
      nextWeek: Math.round(forecastData[6].predicted * 100) / 100,
      nextMonth: Math.round(forecastData[29].predicted * 100) / 100,
      confidence: Math.round((70 + Math.random() * 20) * 10) / 10, // 70-90% confidence
      trend: trend > 0 ? "bullish" : trend < 0 ? "bearish" : "neutral",
      support: Math.round(basePrice * 0.95 * 100) / 100,
      resistance: Math.round(basePrice * 1.05 * 100) / 100,
      riskLevel: volatility < 0.02 ? "low" : volatility < 0.04 ? "medium" : "high",
      forecastData,
    }

    setResult(mockResult)
    setIsProcessing(false)
  }

  const formatINR = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "bullish":
        return colors.success
      case "bearish":
        return colors.danger
      default:
        return colors.warning
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return colors.success
      case "medium":
        return colors.warning
      case "high":
        return colors.danger
      default:
        return colors.blue
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <Label htmlFor="company-select" className="text-base font-medium" style={{ color: colors.darkPurple }}>
              Select Company
            </Label>
            <Select value={selectedCompany} onValueChange={setSelectedCompany}>
              <SelectTrigger id="company-select" className="mt-1" style={{ borderColor: colors.teal }}>
                <SelectValue placeholder="Choose a company" />
              </SelectTrigger>
              <SelectContent>
                {popularCompanies.map((company) => (
                  <SelectItem key={company.value} value={company.value}>
                    <div className="flex flex-col">
                      <span className="font-medium">{company.label}</span>
                      <span className="text-xs text-gray-500">{company.sector}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="custom-company" className="text-base font-medium" style={{ color: colors.darkPurple }}>
              Or Enter Custom Company/Ticker
            </Label>
            <Input
              id="custom-company"
              value={customCompany}
              onChange={(e) => setCustomCompany(e.target.value)}
              placeholder="e.g., TATAMOTORS, WIPRO"
              className="mt-1"
              style={{ borderColor: colors.blue }}
            />
          </div>

          <div>
            <Label htmlFor="timeframe" className="text-base font-medium" style={{ color: colors.darkPurple }}>
              Prediction Timeframe
            </Label>
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger id="timeframe" className="mt-1" style={{ borderColor: colors.teal }}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short">Short-term (1-7 days)</SelectItem>
                <SelectItem value="medium">Medium-term (1-4 weeks)</SelectItem>
                <SelectItem value="long">Long-term (1-3 months)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={generatePrediction}
            disabled={isProcessing || (!selectedCompany && !customCompany)}
            className="w-full text-white"
            style={{ backgroundColor: colors.coral }}
          >
            {isProcessing ? (
              <>
                <Brain className="mr-2 h-4 w-4 animate-spin" />
                Processing AI Prediction...
              </>
            ) : (
              <>
                <TrendingUp className="mr-2 h-4 w-4" />
                Generate AI Prediction
              </>
            )}
          </Button>

          {isProcessing && (
            <div className="space-y-2">
              <Progress value={progress} className="w-full" style={{ backgroundColor: `${colors.light}50` }} />
              <p className="text-sm text-center text-gray-600">Processing... {progress.toFixed(0)}%</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-lg" style={{ backgroundColor: `${colors.darkPurple}10` }}>
            <h3 className="font-semibold mb-3" style={{ color: colors.darkPurple }}>
              <Brain className="inline-block mr-2 h-5 w-5" />
              How Our AI Prediction Works
            </h3>
            <ul className="space-y-2 text-sm" style={{ color: colors.darkPurple }}>
              <li className="flex items-start gap-2">
                <div className="rounded-full bg-blue-100 p-1 mt-0.5">
                  <BarChart3 className="h-3 w-3" style={{ color: colors.blue }} />
                </div>
                <span>
                  <strong>Historical Analysis:</strong> Our AI analyzes years of historical price data, trading volumes,
                  and patterns
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="rounded-full bg-teal-100 p-1 mt-0.5">
                  <LineChart className="h-3 w-3" style={{ color: colors.teal }} />
                </div>
                <span>
                  <strong>Advanced Algorithms:</strong> Combines LSTM neural networks, time series analysis, and
                  statistical models
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="rounded-full bg-coral-100 p-1 mt-0.5">
                  <Calendar className="h-3 w-3" style={{ color: colors.coral }} />
                </div>
                <span>
                  <strong>Multi-timeframe Predictions:</strong> Generates short, medium, and long-term forecasts with
                  confidence intervals
                </span>
              </li>
            </ul>
          </div>

          {result && (
            <Alert className="border-0" style={{ backgroundColor: `${colors.teal}15` }}>
              <TrendingUp className="h-4 w-4" style={{ color: getTrendColor(result.trend) }} />
              <AlertDescription className="font-medium" style={{ color: colors.darkPurple }}>
                AI predicts a{" "}
                <span style={{ color: getTrendColor(result.trend), fontWeight: "bold" }}>{result.trend}</span> trend for{" "}
                {selectedCompany || customCompany} with <span style={{ color: colors.blue }}>{result.confidence}%</span>{" "}
                confidence.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>

      {result && (
        <div className="space-y-6">
          <Card style={{ borderColor: colors.coral }}>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 rounded-lg" style={{ backgroundColor: `${colors.coral}15` }}>
                  <p className="text-sm font-medium" style={{ color: colors.darkPurple }}>
                    Next Day Prediction
                  </p>
                  <p className="text-xl font-bold" style={{ color: colors.coral }}>
                    {formatINR(result.nextDay)}
                  </p>
                </div>
                <div className="text-center p-3 rounded-lg" style={{ backgroundColor: `${colors.blue}15` }}>
                  <p className="text-sm font-medium" style={{ color: colors.darkPurple }}>
                    Next Week Prediction
                  </p>
                  <p className="text-xl font-bold" style={{ color: colors.blue }}>
                    {formatINR(result.nextWeek)}
                  </p>
                </div>
                <div className="text-center p-3 rounded-lg" style={{ backgroundColor: `${colors.teal}15` }}>
                  <p className="text-sm font-medium" style={{ color: colors.darkPurple }}>
                    Next Month Prediction
                  </p>
                  <p className="text-xl font-bold" style={{ color: colors.teal }}>
                    {formatINR(result.nextMonth)}
                  </p>
                </div>
                <div className="text-center p-3 rounded-lg" style={{ backgroundColor: `${colors.darkPurple}15` }}>
                  <p className="text-sm font-medium" style={{ color: colors.darkPurple }}>
                    Risk Level
                  </p>
                  <p className="text-xl font-bold" style={{ color: getRiskColor(result.riskLevel) }}>
                    {result.riskLevel.charAt(0).toUpperCase() + result.riskLevel.slice(1)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <Tabs defaultValue="forecast" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="forecast">Price Forecast</TabsTrigger>
                  <TabsTrigger value="confidence">Confidence Intervals</TabsTrigger>
                </TabsList>

                <TabsContent value="forecast" className="mt-4">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsLineChart data={result.forecastData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="date"
                          tick={{ fontSize: 12 }}
                          interval={Math.floor(result.forecastData.length / 5)}
                        />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip
                          formatter={(value) => [formatINR(Number(value)), "Predicted Price"]}
                          labelFormatter={(label) => `Date: ${label}`}
                        />
                        <Line
                          type="monotone"
                          dataKey="predicted"
                          stroke={colors.coral}
                          strokeWidth={2}
                          dot={false}
                          name="Predicted Price"
                        />
                        <ReferenceLine
                          y={result.support}
                          stroke={colors.success}
                          strokeDasharray="3 3"
                          label={{ value: "Support", position: "insideBottomRight" }}
                        />
                        <ReferenceLine
                          y={result.resistance}
                          stroke={colors.danger}
                          strokeDasharray="3 3"
                          label={{ value: "Resistance", position: "insideTopRight" }}
                        />
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>

                <TabsContent value="confidence" className="mt-4">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsLineChart data={result.forecastData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="date"
                          tick={{ fontSize: 12 }}
                          interval={Math.floor(result.forecastData.length / 5)}
                        />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip
                          formatter={(value) => [formatINR(Number(value)), "Price"]}
                          labelFormatter={(label) => `Date: ${label}`}
                        />
                        <Line
                          type="monotone"
                          dataKey="predicted"
                          stroke={colors.blue}
                          strokeWidth={2}
                          dot={false}
                          name="Predicted"
                        />
                        <Line
                          type="monotone"
                          dataKey="upper"
                          stroke={colors.teal}
                          strokeWidth={1}
                          strokeDasharray="5 5"
                          dot={false}
                          name="Upper Bound"
                        />
                        <Line
                          type="monotone"
                          dataKey="lower"
                          stroke={colors.teal}
                          strokeWidth={1}
                          strokeDasharray="5 5"
                          dot={false}
                          name="Lower Bound"
                        />
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card style={{ borderColor: colors.teal }}>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4" style={{ color: colors.darkPurple }}>
                  Technical Insights
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium" style={{ color: colors.darkPurple }}>
                      Support Level:
                    </span>
                    <span style={{ color: colors.success }}>{formatINR(result.support)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium" style={{ color: colors.darkPurple }}>
                      Resistance Level:
                    </span>
                    <span style={{ color: colors.danger }}>{formatINR(result.resistance)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium" style={{ color: colors.darkPurple }}>
                      Trend Direction:
                    </span>
                    <span style={{ color: getTrendColor(result.trend) }}>
                      {result.trend.charAt(0).toUpperCase() + result.trend.slice(1)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium" style={{ color: colors.darkPurple }}>
                      Prediction Confidence:
                    </span>
                    <span style={{ color: colors.blue }}>{result.confidence}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card style={{ borderColor: colors.blue }}>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4" style={{ color: colors.darkPurple }}>
                  AI Recommendation
                </h3>
                <div className="p-4 rounded-lg" style={{ backgroundColor: `${getTrendColor(result.trend)}15` }}>
                  <p className="text-sm" style={{ color: colors.darkPurple }}>
                    {result.trend === "bullish" && (
                      <>
                        <strong>Consider Buying:</strong> Our AI predicts an upward trend with{" "}
                        <strong>{result.confidence}%</strong> confidence. The stock shows strong momentum with support
                        at {formatINR(result.support)}. Target price: {formatINR(result.nextMonth)}.
                      </>
                    )}
                    {result.trend === "bearish" && (
                      <>
                        <strong>Consider Selling/Avoiding:</strong> Our AI predicts a downward trend with{" "}
                        <strong>{result.confidence}%</strong> confidence. The stock may face resistance at{" "}
                        {formatINR(result.resistance)}. Expected to decline to {formatINR(result.nextMonth)}.
                      </>
                    )}
                    {result.trend === "neutral" && (
                      <>
                        <strong>Hold/Monitor:</strong> Our AI predicts a sideways trend with{" "}
                        <strong>{result.confidence}%</strong> confidence. The stock is trading between{" "}
                        {formatINR(result.support)} and {formatINR(result.resistance)}. Wait for clearer signals.
                      </>
                    )}
                  </p>
                </div>
                <div className="mt-4">
                  <p className="text-xs text-gray-500">
                    Risk Level:{" "}
                    <span style={{ color: getRiskColor(result.riskLevel) }}>
                      {result.riskLevel.toUpperCase()} -{" "}
                      {result.riskLevel === "low" && "Suitable for conservative investors"}
                      {result.riskLevel === "medium" && "Suitable for balanced portfolios"}
                      {result.riskLevel === "high" && "Only for aggressive investors"}
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      <div className="p-4 rounded-lg" style={{ backgroundColor: `${colors.darkPurple}10` }}>
        <h3 className="font-semibold mb-2" style={{ color: colors.darkPurple }}>
          📊 AI Prediction Features:
        </h3>
        <div className="grid gap-2 text-sm" style={{ color: colors.darkPurple }}>
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4" style={{ color: colors.coral }} />
            <span>
              <strong>Advanced AI Models:</strong> LSTM neural networks and time series forecasting
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" style={{ color: colors.blue }} />
            <span>
              <strong>Multi-timeframe Analysis:</strong> Short, medium, and long-term predictions
            </span>
          </div>
          <div className="flex items-center gap-2">
            <LineChart className="h-4 w-4" style={{ color: colors.teal }} />
            <span>
              <strong>Confidence Intervals:</strong> Upper and lower bounds for price predictions
            </span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" style={{ color: colors.success }} />
            <span>
              <strong>Actionable Insights:</strong> Clear buy/sell/hold recommendations
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
