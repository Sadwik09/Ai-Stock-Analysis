"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import StockPrediction from "@/components/stock-prediction"
import PortfolioRecommendation from "@/components/portfolio-recommendation"
import StockAnalysis from "@/components/stock-analysis"
import { TrendingUp, PieChart, BarChart3 } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            AI Stock Market Assistant
          </h1>
          <p className="text-lg text-gray-600">
            Advanced stock prediction, portfolio optimization, and market analysis
          </p>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="prediction" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="prediction" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Stock Prediction
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
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  AI Stock Price Prediction
                </CardTitle>
                <CardDescription>
                  Upload historical stock data (CSV) to predict future prices using LSTM neural networks
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
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
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
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
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
          <p>© 2024 AI Stock Market Assistant. Built with Next.js and AI-powered analytics.</p>
        </div>
      </div>
    </div>
  )
}
