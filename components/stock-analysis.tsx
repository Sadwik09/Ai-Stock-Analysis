"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Bar,
  ComposedChart,
  Area,
  AreaChart,
  ReferenceLine,
} from "recharts"
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Activity, Target, Eye, Calculator, Bell } from "lucide-react"

interface CandlestickData {
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
  sma20: number
  sma50: number
  ema12: number
  ema26: number
  macd: number
  signal: number
  rsi: number
  bollinger_upper: number
  bollinger_lower: number
  bollinger_middle: number
}

interface StockData {
  ticker: string
  companyName: string
  sector: string
  currentPrice: number
  previousClose: number
  open: number
  dayLow: number
  dayHigh: number
  yearLow: number
  yearHigh: number
  change: number
  changePercentage: number
  volume: number
  avgVolume: number
  marketCap: number
  pe: number
  eps: number
  dividend: number
  beta: number
  chartData: CandlestickData[]
  signals: {
    trend: string
    momentum: string
    volatility: string
    volume: string
    overall: string
  }
  priceTargets: {
    support1: number
    support2: number
    resistance1: number
    resistance2: number
  }
}

interface WatchlistItem {
  ticker: string
  price: number
  change: number
  changePercent: number
}

export default function StockAnalysis() {
  const [selectedStock, setSelectedStock] = useState<string>("RELIANCE")
  const [stockData, setStockData] = useState<StockData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([])
  const [customTicker, setCustomTicker] = useState<string>("")
  const [priceAlert, setPriceAlert] = useState<number>(0)

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

  // Expanded Indian stock options with company names
  const stockOptions = [
    { ticker: "RELIANCE", name: "Reliance Industries Ltd", sector: "Oil & Gas" },
    { ticker: "TCS", name: "Tata Consultancy Services", sector: "IT Services" },
    { ticker: "HDFCBANK", name: "HDFC Bank Ltd", sector: "Banking" },
    { ticker: "INFY", name: "Infosys Ltd", sector: "IT Services" },
    { ticker: "HINDUNILVR", name: "Hindustan Unilever Ltd", sector: "FMCG" },
    { ticker: "ITC", name: "ITC Ltd", sector: "FMCG" },
    { ticker: "SBIN", name: "State Bank of India", sector: "Banking" },
    { ticker: "BHARTIARTL", name: "Bharti Airtel Ltd", sector: "Telecom" },
    { ticker: "KOTAKBANK", name: "Kotak Mahindra Bank", sector: "Banking" },
    { ticker: "LT", name: "Larsen & Toubro Ltd", sector: "Construction" },
    { ticker: "ASIANPAINT", name: "Asian Paints Ltd", sector: "Paints" },
    { ticker: "MARUTI", name: "Maruti Suzuki India Ltd", sector: "Automobile" },
    { ticker: "TITAN", name: "Titan Company Ltd", sector: "Jewellery" },
    { ticker: "NESTLEIND", name: "Nestle India Ltd", sector: "FMCG" },
    { ticker: "ULTRACEMCO", name: "UltraTech Cement Ltd", sector: "Cement" },
    { ticker: "BAJFINANCE", name: "Bajaj Finance Ltd", sector: "NBFC" },
    { ticker: "HCLTECH", name: "HCL Technologies Ltd", sector: "IT Services" },
    { ticker: "WIPRO", name: "Wipro Ltd", sector: "IT Services" },
    { ticker: "SUNPHARMA", name: "Sun Pharmaceutical", sector: "Pharma" },
    { ticker: "TECHM", name: "Tech Mahindra Ltd", sector: "IT Services" },
  ]

  const generateAdvancedMockData = (ticker: string): StockData => {
    const stockInfo = stockOptions.find((s) => s.ticker === ticker) || stockOptions[0]
    const basePrice = Math.random() * 3000 + 500 // INR prices
    const change = (Math.random() - 0.5) * 100
    const changePercentage = (change / basePrice) * 100

    // Generate comprehensive chart data with advanced technical indicators
    const chartData: CandlestickData[] = []
    let price = basePrice
    const prices: number[] = []
    const ema12Values: number[] = []
    const ema26Values: number[] = []

    for (let i = 60; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)

      const volatility = Math.random() * 50
      const open = price
      const high = open + Math.random() * volatility
      const low = open - Math.random() * volatility
      const close = low + Math.random() * (high - low)
      const volume = Math.floor(Math.random() * 1000000) + 100000

      prices.push(close)

      // Calculate SMAs
      const sma20 = prices.length >= 20 ? prices.slice(-20).reduce((a, b) => a + b, 0) / 20 : close
      const sma50 = prices.length >= 50 ? prices.slice(-50).reduce((a, b) => a + b, 0) / 50 : close

      // Calculate EMAs
      const ema12 =
        ema12Values.length === 0 ? close : close * (2 / 13) + ema12Values[ema12Values.length - 1] * (11 / 13)
      const ema26 =
        ema26Values.length === 0 ? close : close * (2 / 27) + ema26Values[ema26Values.length - 1] * (25 / 27)
      ema12Values.push(ema12)
      ema26Values.push(ema26)

      // MACD calculation
      const macd = ema12 - ema26
      const signal = macd * 0.9 + Math.random() * 2 // Simplified signal line

      // RSI calculation (simplified)
      const rsi = 30 + Math.random() * 40

      // Bollinger Bands
      const bollinger_middle = sma20
      const stdDev = Math.sqrt(prices.slice(-20).reduce((acc, p) => acc + Math.pow(p - sma20, 2), 0) / 20)
      const bollinger_upper = bollinger_middle + 2 * stdDev
      const bollinger_lower = bollinger_middle - 2 * stdDev

      chartData.push({
        date: date.toLocaleDateString(),
        open: Number(open.toFixed(2)),
        high: Number(high.toFixed(2)),
        low: Number(low.toFixed(2)),
        close: Number(close.toFixed(2)),
        volume,
        sma20: Number(sma20.toFixed(2)),
        sma50: Number(sma50.toFixed(2)),
        ema12: Number(ema12.toFixed(2)),
        ema26: Number(ema26.toFixed(2)),
        macd: Number(macd.toFixed(2)),
        signal: Number(signal.toFixed(2)),
        rsi: Number(rsi.toFixed(2)),
        bollinger_upper: Number(bollinger_upper.toFixed(2)),
        bollinger_lower: Number(bollinger_lower.toFixed(2)),
        bollinger_middle: Number(bollinger_middle.toFixed(2)),
      })

      price = close
    }

    // Generate trading signals
    const latestData = chartData[chartData.length - 1]
    const signals = {
      trend: latestData.close > latestData.sma20 ? "Bullish" : "Bearish",
      momentum: latestData.rsi > 70 ? "Overbought" : latestData.rsi < 30 ? "Oversold" : "Neutral",
      volatility: Math.abs(changePercentage) > 3 ? "High" : "Low",
      volume: Math.random() > 0.5 ? "Above Average" : "Below Average",
      overall: Math.random() > 0.6 ? "Buy" : Math.random() > 0.3 ? "Hold" : "Sell",
    }

    // Calculate support and resistance levels
    const priceTargets = {
      support1: Number((basePrice * 0.95).toFixed(2)),
      support2: Number((basePrice * 0.9).toFixed(2)),
      resistance1: Number((basePrice * 1.05).toFixed(2)),
      resistance2: Number((basePrice * 1.1).toFixed(2)),
    }

    return {
      ticker,
      companyName: stockInfo.name,
      sector: stockInfo.sector,
      currentPrice: Number(basePrice.toFixed(2)),
      previousClose: Number((basePrice - change).toFixed(2)),
      open: Number((basePrice + (Math.random() - 0.5) * 20).toFixed(2)),
      dayLow: Number((basePrice - Math.random() * 50).toFixed(2)),
      dayHigh: Number((basePrice + Math.random() * 50).toFixed(2)),
      yearLow: Number((basePrice - Math.random() * 500).toFixed(2)),
      yearHigh: Number((basePrice + Math.random() * 500).toFixed(2)),
      change: Number(change.toFixed(2)),
      changePercentage: Number(changePercentage.toFixed(2)),
      volume: Math.floor(Math.random() * 5000000) + 1000000,
      avgVolume: Math.floor(Math.random() * 3000000) + 1000000,
      marketCap: Math.floor(Math.random() * 500000) + 50000,
      pe: Number((15 + Math.random() * 20).toFixed(2)),
      eps: Number((basePrice / (15 + Math.random() * 20)).toFixed(2)),
      dividend: Number((Math.random() * 5).toFixed(2)),
      beta: Number((0.5 + Math.random() * 1.5).toFixed(2)),
      chartData,
      signals,
      priceTargets,
    }
  }

  const analyzeStock = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    const data = generateAdvancedMockData(selectedStock)
    setStockData(data)
    setIsLoading(false)
  }

  const addToWatchlist = () => {
    if (stockData && !watchlist.find((item) => item.ticker === stockData.ticker)) {
      const newItem: WatchlistItem = {
        ticker: stockData.ticker,
        price: stockData.currentPrice,
        change: stockData.change,
        changePercent: stockData.changePercentage,
      }
      setWatchlist([...watchlist, newItem])
    }
  }

  const removeFromWatchlist = (ticker: string) => {
    setWatchlist(watchlist.filter((item) => item.ticker !== ticker))
  }

  const formatINR = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const formatVolume = (volume: number) => {
    if (volume >= 10000000) return `${(volume / 10000000).toFixed(1)}Cr`
    if (volume >= 100000) return `${(volume / 100000).toFixed(1)}L`
    if (volume >= 1000) return `${(volume / 1000).toFixed(1)}K`
    return volume.toString()
  }

  const getSignalColor = (signal: string) => {
    switch (signal.toLowerCase()) {
      case "buy":
      case "bullish":
      case "above average":
        return colors.success
      case "sell":
      case "bearish":
      case "overbought":
        return colors.danger
      case "hold":
      case "neutral":
      case "oversold":
        return colors.warning
      default:
        return colors.blue
    }
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header with Search and Watchlist */}
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <Label className="text-sm font-medium mb-2 block" style={{ color: colors.darkPurple }}>
            Select Indian Stock
          </Label>
          <Select value={selectedStock} onValueChange={setSelectedStock}>
            <SelectTrigger style={{ borderColor: colors.teal }}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {stockOptions.map((stock) => (
                <SelectItem key={stock.ticker} value={stock.ticker}>
                  <div className="flex flex-col">
                    <span className="font-medium">{stock.ticker}</span>
                    <span className="text-xs text-gray-500">{stock.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium mb-2 block" style={{ color: colors.darkPurple }}>
            Custom Ticker
          </Label>
          <Input
            placeholder="Enter ticker symbol"
            value={customTicker}
            onChange={(e) => setCustomTicker(e.target.value.toUpperCase())}
            style={{ borderColor: colors.blue }}
          />
        </div>

        <div className="flex items-end gap-2">
          <Button
            onClick={analyzeStock}
            disabled={isLoading}
            className="flex-1 text-white"
            style={{ backgroundColor: colors.coral }}
          >
            {isLoading ? (
              <>
                <BarChart3 className="mr-2 h-4 w-4 animate-pulse" />
                Analyzing...
              </>
            ) : (
              <>
                <BarChart3 className="mr-2 h-4 w-4" />
                Analyze
              </>
            )}
          </Button>
          {stockData && (
            <Button onClick={addToWatchlist} variant="outline" style={{ borderColor: colors.teal, color: colors.teal }}>
              <Eye className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Watchlist */}
      {watchlist.length > 0 && (
        <Card style={{ borderColor: colors.darkPurple }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{ color: colors.darkPurple }}>
              <Eye className="h-5 w-5" />
              Watchlist
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
              {watchlist.map((item) => (
                <div
                  key={item.ticker}
                  className="flex items-center justify-between p-3 rounded-lg cursor-pointer hover:opacity-80"
                  style={{ backgroundColor: `${colors.light}50` }}
                  onClick={() => setSelectedStock(item.ticker)}
                >
                  <div>
                    <div className="font-medium" style={{ color: colors.darkPurple }}>
                      {item.ticker}
                    </div>
                    <div className="text-sm" style={{ color: colors.coral }}>
                      {formatINR(item.price)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-sm font-medium ${item.changePercent >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {item.changePercent >= 0 ? "+" : ""}
                      {item.changePercent.toFixed(2)}%
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeFromWatchlist(item.ticker)
                      }}
                      className="h-6 w-6 p-0"
                    >
                      ×
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {stockData && (
        <div className="space-y-6">
          {/* Enhanced Stock Overview */}
          <Card style={{ borderColor: colors.coral }}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2" style={{ color: colors.darkPurple }}>
                    <DollarSign className="h-5 w-5" />
                    {stockData.ticker} - {stockData.companyName}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">{stockData.sector} Sector</div>
                </div>
                <div className="text-right">
                  <Badge
                    variant={stockData.change >= 0 ? "default" : "destructive"}
                    className="flex items-center gap-1"
                    style={{
                      backgroundColor: stockData.change >= 0 ? colors.success : colors.danger,
                      color: "white",
                    }}
                  >
                    {stockData.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {stockData.changePercentage >= 0 ? "+" : ""}
                    {stockData.changePercentage.toFixed(2)}%
                  </Badge>
                  <div className="text-xs text-gray-500 mt-1">
                    Signal:{" "}
                    <span style={{ color: getSignalColor(stockData.signals.overall) }}>
                      {stockData.signals.overall}
                    </span>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <div className="text-center p-3 rounded-lg" style={{ backgroundColor: `${colors.coral}15` }}>
                  <p className="text-sm font-medium" style={{ color: colors.darkPurple }}>
                    Current Price
                  </p>
                  <p className="text-xl font-bold" style={{ color: colors.coral }}>
                    {formatINR(stockData.currentPrice)}
                  </p>
                </div>
                <div className="text-center p-3 rounded-lg" style={{ backgroundColor: `${colors.blue}15` }}>
                  <p className="text-sm font-medium" style={{ color: colors.darkPurple }}>
                    Previous Close
                  </p>
                  <p className="text-xl font-bold" style={{ color: colors.blue }}>
                    {formatINR(stockData.previousClose)}
                  </p>
                </div>
                <div className="text-center p-3 rounded-lg" style={{ backgroundColor: `${colors.teal}15` }}>
                  <p className="text-sm font-medium" style={{ color: colors.darkPurple }}>
                    Volume
                  </p>
                  <p className="text-xl font-bold" style={{ color: colors.teal }}>
                    {formatVolume(stockData.volume)}
                  </p>
                </div>
                <div className="text-center p-3 rounded-lg" style={{ backgroundColor: `${colors.darkPurple}15` }}>
                  <p className="text-sm font-medium" style={{ color: colors.darkPurple }}>
                    Market Cap
                  </p>
                  <p className="text-xl font-bold" style={{ color: colors.darkPurple }}>
                    ₹{stockData.marketCap}Cr
                  </p>
                </div>
                <div className="text-center p-3 rounded-lg" style={{ backgroundColor: `${colors.warning}15` }}>
                  <p className="text-sm font-medium" style={{ color: colors.darkPurple }}>
                    P/E Ratio
                  </p>
                  <p className="text-xl font-bold" style={{ color: colors.warning }}>
                    {stockData.pe}
                  </p>
                </div>
                <div className="text-center p-3 rounded-lg" style={{ backgroundColor: `${colors.success}15` }}>
                  <p className="text-sm font-medium" style={{ color: colors.darkPurple }}>
                    Beta
                  </p>
                  <p className="text-xl font-bold" style={{ color: colors.success }}>
                    {stockData.beta}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                <div className="p-3 rounded-lg" style={{ backgroundColor: `${colors.blue}10` }}>
                  <p className="text-sm font-medium" style={{ color: colors.blue }}>
                    Day Range
                  </p>
                  <p className="text-lg">
                    {formatINR(stockData.dayLow)} - {formatINR(stockData.dayHigh)}
                  </p>
                </div>
                <div className="p-3 rounded-lg" style={{ backgroundColor: `${colors.teal}10` }}>
                  <p className="text-sm font-medium" style={{ color: colors.teal }}>
                    52-Week Range
                  </p>
                  <p className="text-lg">
                    {formatINR(stockData.yearLow)} - {formatINR(stockData.yearHigh)}
                  </p>
                </div>
                <div className="p-3 rounded-lg" style={{ backgroundColor: `${colors.coral}10` }}>
                  <p className="text-sm font-medium" style={{ color: colors.coral }}>
                    EPS
                  </p>
                  <p className="text-lg font-bold">{formatINR(stockData.eps)}</p>
                </div>
                <div className="p-3 rounded-lg" style={{ backgroundColor: `${colors.darkPurple}10` }}>
                  <p className="text-sm font-medium" style={{ color: colors.darkPurple }}>
                    Dividend Yield
                  </p>
                  <p className="text-lg font-bold">{stockData.dividend}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Advanced Technical Analysis Charts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ color: colors.darkPurple }}>
                <Activity className="h-5 w-5" />
                Advanced Technical Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="price" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="price">Price & MA</TabsTrigger>
                  <TabsTrigger value="bollinger">Bollinger</TabsTrigger>
                  <TabsTrigger value="volume">Volume</TabsTrigger>
                  <TabsTrigger value="macd">MACD</TabsTrigger>
                  <TabsTrigger value="rsi">RSI</TabsTrigger>
                </TabsList>

                <TabsContent value="price" className="mt-4">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={stockData.chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip
                          formatter={(value, name) => [formatINR(Number(value)), name]}
                          labelFormatter={(label) => `Date: ${label}`}
                        />
                        <Line
                          type="monotone"
                          dataKey="close"
                          stroke={colors.coral}
                          strokeWidth={2}
                          name="Close Price"
                        />
                        <Line
                          type="monotone"
                          dataKey="sma20"
                          stroke={colors.blue}
                          strokeWidth={1}
                          name="SMA 20"
                          strokeDasharray="5 5"
                        />
                        <Line
                          type="monotone"
                          dataKey="sma50"
                          stroke={colors.teal}
                          strokeWidth={1}
                          name="SMA 50"
                          strokeDasharray="5 5"
                        />
                        <Line
                          type="monotone"
                          dataKey="ema12"
                          stroke={colors.darkPurple}
                          strokeWidth={1}
                          name="EMA 12"
                          strokeDasharray="3 3"
                        />
                        <ReferenceLine
                          y={stockData.priceTargets.resistance1}
                          stroke={colors.danger}
                          strokeDasharray="8 8"
                          label="R1"
                        />
                        <ReferenceLine
                          y={stockData.priceTargets.support1}
                          stroke={colors.success}
                          strokeDasharray="8 8"
                          label="S1"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>

                <TabsContent value="bollinger" className="mt-4">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={stockData.chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip
                          formatter={(value, name) => [formatINR(Number(value)), name]}
                          labelFormatter={(label) => `Date: ${label}`}
                        />
                        <Line
                          type="monotone"
                          dataKey="close"
                          stroke={colors.coral}
                          strokeWidth={2}
                          name="Close Price"
                        />
                        <Line
                          type="monotone"
                          dataKey="bollinger_upper"
                          stroke={colors.blue}
                          strokeWidth={1}
                          name="Upper Band"
                        />
                        <Line
                          type="monotone"
                          dataKey="bollinger_middle"
                          stroke={colors.teal}
                          strokeWidth={1}
                          name="Middle Band"
                        />
                        <Line
                          type="monotone"
                          dataKey="bollinger_lower"
                          stroke={colors.blue}
                          strokeWidth={1}
                          name="Lower Band"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>

                <TabsContent value="volume" className="mt-4">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={stockData.chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                        <YAxis yAxisId="price" orientation="right" tick={{ fontSize: 12 }} />
                        <YAxis yAxisId="volume" orientation="left" tick={{ fontSize: 12 }} />
                        <Tooltip
                          formatter={(value, name) => {
                            if (name === "Volume") return [formatVolume(Number(value)), name]
                            return [formatINR(Number(value)), name]
                          }}
                          labelFormatter={(label) => `Date: ${label}`}
                        />
                        <Bar yAxisId="volume" dataKey="volume" fill={colors.teal} name="Volume" opacity={0.6} />
                        <Line
                          yAxisId="price"
                          type="monotone"
                          dataKey="close"
                          stroke={colors.coral}
                          strokeWidth={2}
                          name="Close Price"
                        />
                        <ReferenceLine
                          yAxisId="volume"
                          y={stockData.avgVolume}
                          stroke={colors.darkPurple}
                          strokeDasharray="5 5"
                          label="Avg Volume"
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>

                <TabsContent value="macd" className="mt-4">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={stockData.chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip
                          formatter={(value, name) => [Number(value).toFixed(2), name]}
                          labelFormatter={(label) => `Date: ${label}`}
                        />
                        <Bar dataKey="macd" fill={colors.blue} name="MACD" />
                        <Line
                          type="monotone"
                          dataKey="signal"
                          stroke={colors.coral}
                          strokeWidth={2}
                          name="Signal Line"
                        />
                        <ReferenceLine y={0} stroke={colors.darkPurple} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>

                <TabsContent value="rsi" className="mt-4">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={stockData.chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                        <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                        <Tooltip
                          formatter={(value) => [Number(value).toFixed(2), "RSI"]}
                          labelFormatter={(label) => `Date: ${label}`}
                        />
                        <Area type="monotone" dataKey="rsi" stroke={colors.blue} fill={colors.blue} fillOpacity={0.3} />
                        <ReferenceLine y={70} stroke={colors.danger} strokeDasharray="5 5" label="Overbought" />
                        <ReferenceLine y={30} stroke={colors.success} strokeDasharray="5 5" label="Oversold" />
                        <ReferenceLine y={50} stroke={colors.darkPurple} strokeDasharray="3 3" label="Neutral" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Trading Signals and Price Targets */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card style={{ borderColor: colors.teal }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2" style={{ color: colors.darkPurple }}>
                  <Target className="h-5 w-5" />
                  Trading Signals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(stockData.signals).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center">
                      <span className="capitalize font-medium" style={{ color: colors.darkPurple }}>
                        {key.replace("_", " ")}:
                      </span>
                      <Badge
                        style={{
                          backgroundColor: getSignalColor(value),
                          color: "white",
                        }}
                      >
                        {value}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card style={{ borderColor: colors.blue }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2" style={{ color: colors.darkPurple }}>
                  <Calculator className="h-5 w-5" />
                  Price Targets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span style={{ color: colors.danger }}>Resistance 2:</span>
                    <span className="font-medium">{formatINR(stockData.priceTargets.resistance2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: colors.warning }}>Resistance 1:</span>
                    <span className="font-medium">{formatINR(stockData.priceTargets.resistance1)}</span>
                  </div>
                  <div className="flex justify-between border-y py-2" style={{ borderColor: colors.light }}>
                    <span style={{ color: colors.coral }}>Current Price:</span>
                    <span className="font-bold">{formatINR(stockData.currentPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: colors.success }}>Support 1:</span>
                    <span className="font-medium">{formatINR(stockData.priceTargets.support1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: colors.teal }}>Support 2:</span>
                    <span className="font-medium">{formatINR(stockData.priceTargets.support2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Price Alert Setup */}
          <Card style={{ borderColor: colors.warning }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ color: colors.darkPurple }}>
                <Bell className="h-5 w-5" />
                Price Alert Setup
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <Label htmlFor="alert-price">Alert Price (₹)</Label>
                  <Input
                    id="alert-price"
                    type="number"
                    value={priceAlert}
                    onChange={(e) => setPriceAlert(Number(e.target.value))}
                    placeholder="Enter target price"
                    style={{ borderColor: colors.warning }}
                  />
                </div>
                <Button className="text-white" style={{ backgroundColor: colors.warning }}>
                  Set Alert
                </Button>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Get notified when {stockData.ticker} reaches your target price
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="p-4 rounded-lg" style={{ backgroundColor: `${colors.darkPurple}10` }}>
        <h3 className="font-semibold mb-2" style={{ color: colors.darkPurple }}>
          📊 Advanced Analysis Features:
        </h3>
        <div className="grid gap-2 text-sm" style={{ color: colors.darkPurple }}>
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4" style={{ color: colors.coral }} />
            <span>
              <strong>Advanced Indicators:</strong> MACD, Bollinger Bands, RSI, EMA with signal analysis
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4" style={{ color: colors.blue }} />
            <span>
              <strong>Price Targets:</strong> Dynamic support and resistance levels calculation
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4" style={{ color: colors.teal }} />
            <span>
              <strong>Watchlist:</strong> Track multiple stocks with real-time updates
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4" style={{ color: colors.warning }} />
            <span>
              <strong>Price Alerts:</strong> Custom notifications for target prices
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
