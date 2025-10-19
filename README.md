# AI Trading Assistant 📈

An intelligent trading assistant app built with React Native and Expo that uses Google's Gemini AI to analyze trading charts and provide trading recommendations.

## Features

- **AI-Powered Chart Analysis**: Upload trading chart images and get AI-powered analysis using OpenRouter with Google Gemma 2 9B
- **Trading Signals**: Receive clear trading recommendations (HOLD, BUY LONG, BUY SHORT, SELL)
- **Confidence Levels**: Get confidence percentages for each trading recommendation
- **Multiple Timeframes**: Support for Scalping, Intraday, Swing, and Position trading
- **Technical Indicators**: Advanced dropdown with search functionality for 20+ technical indicators (RSI, MACD, Moving Average, Bollinger Bands, Fibonacci, Ichimoku, Williams %R, CCI, ATR, ADX, Parabolic SAR, OBV, Money Flow Index, Aroon, TRIX, Ultimate Oscillator, Rate of Change, and more)
- **Risk Assessment**: Get risk level assessments (LOW, MEDIUM, HIGH)
- **Market Analysis**: Comprehensive market condition analysis including support/resistance levels, trend analysis, and volume analysis
- **Separate Results Page**: View detailed analysis results in a dedicated results tab
- **Portrait Image Support**: Optimized for portrait chart screenshots with fullscreen display
- **Custom Navbar**: Clean navigation between Analyze, Results, and History tabs
- **Auto-Navigation**: Automatically navigates to results after successful analysis
- **Search & Filter**: Search through indicators quickly with real-time filtering
- **Clear All**: Easy way to clear all selected indicators at once
- **Analysis History**: Cache and view all past analyses with images and details
- **History Management**: Delete individual analyses or clear all history with confirmation
- **Persistent Storage**: History is saved locally and persists between app sessions

## Tech Stack

- **React Native** with **Expo**
- **TypeScript** for type safety
- **OpenRouter with Google Gemma 2 9B** for chart analysis
- **Expo Router** for navigation
- **Expo Image Picker** for chart uploads
- **AsyncStorage** for persistent local data storage

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure API Key**
   The app is pre-configured with an OpenRouter API key. If you need to use your own:
   - Get an API key from [OpenRouter](https://openrouter.ai/keys)
   - Update the API key in `services/aiService.ts`

3. **Start the app**
   ```bash
   npm start
   ```

## Usage

1. **Upload Chart**: Tap the upload area to select a trading chart image from your device
2. **Select Timeframe**: Choose your trading timeframe (Scalping, Intraday, Swing, or Position)
3. **Choose Indicators**: Select the technical indicators you want the AI to consider
4. **Enter Symbol** (Optional): Add the trading symbol for better context
5. **Analyze**: Tap "Analyze Chart" to get AI-powered trading recommendations

## Trading Recommendations

The AI provides:
- **Action**: HOLD, BUY LONG, BUY SHORT, or SELL
- **Confidence**: Percentage confidence in the recommendation
- **Reasoning**: Detailed explanation of the analysis
- **Risk Level**: Assessment of trade risk
- **Market Analysis**: Comprehensive market condition analysis

## Important Notes

⚠️ **This is NOT a trading app** - it's an AI assistant that helps with trading decisions based on chart analysis. Always do your own research and consider your risk tolerance before making any trading decisions.

## Development

- **Linting**: `npm run lint`
- **Reset Project**: `npm run reset-project`

## License

This project is for educational and informational purposes only. Trading involves risk, and past performance does not guarantee future results.
