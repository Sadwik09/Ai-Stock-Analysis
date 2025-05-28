"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import StockPrediction from "@/components/stock-prediction"
import PortfolioRecommendation from "@/components/portfolio-recommendation"
import StockAnalysis from "@/components/stock-analysis"
import { TrendingUp, PieChart, Brain } from "lucide-react"

export default function Home() {
  // Enhanced color palette
  const colors = {
    light: "#DFFF6",
    darkPurple: "#231651",
    teal: "#40C6BD",
    blue: "#2374AB",
    coral: "#FF4B4A",
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1
            className="text-4xl font-bold mb-2 flex items-center justify-center gap-2"
            style={{ color: colors.darkPurple }}
          >
            <Brain className="h-8 w-8" style={{ color: colors.coral }} />
            AI Stock Market Adviser
          </h1>
          <p className="text-lg text-gray-600">
            Advanced stock prediction, portfolio optimization, and market analysis
          </p>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="prediction" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="prediction" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              AI Prediction
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              Portfolio Advisor
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Market Analysis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="prediction">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2" style={{ color: colors.darkPurple }}>
                  <Brain className="h-5 w-5" style={{ color: colors.coral }} />
                  AI Stock Price Prediction
                </CardTitle>
                <CardDescription>
                  Get intelligent price forecasts for any stock using our advanced AI models
                </CardDescription>
              </CardHeader>
              <CardContent>
                <StockPrediction />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="portfolio">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2" style={{ color: colors.darkPurple }}>
                  <PieChart className="h-5 w-5" style={{ color: colors.blue }} />
                  Personalized Portfolio Recommendation
                </CardTitle>
                <CardDescription>
                  Get customized investment portfolio suggestions based on your risk profile
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PortfolioRecommendation />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2" style={{ color: colors.darkPurple }}>
                  <TrendingUp className="h-5 w-5" style={{ color: colors.teal }} />
                  Real-time Stock Analysis
                </CardTitle>
                <CardDescription>
                  Analyze stock performance with detailed metrics and interactive charts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <StockAnalysis />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500">
          <p>© 2024 AI Stock Market Adviser. Built with Next.js and AI-powered analytics.</p>
        </div>
      </div>
    </div>
  )
}
