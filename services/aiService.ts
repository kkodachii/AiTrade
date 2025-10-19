const OPENROUTER_API_KEY = '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';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export interface TradingSignal {
  action: 'HOLD' | 'BUY_LONG' | 'BUY_SHORT' | 'SELL';
  confidence: number; // 0-100
  reasoning: string;
  timeframe: 'SCALPING' | 'INTRADAY' | 'SWING' | 'POSITION';
  indicators: string[];
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface ChartAnalysis {
  signal: TradingSignal;
  marketCondition: string;
  supportResistance: string;
  trendAnalysis: string;
  volumeAnalysis: string;
}

class AIService {
  constructor() {
    console.log('AI Service: Initializing with OpenRouter API key:', OPENROUTER_API_KEY ? `${OPENROUTER_API_KEY.substring(0, 10)}...` : 'NO API KEY');
  }

  async analyzeChart(
    imageBase64: string,
    timeframe: 'SCALPING' | 'INTRADAY' | 'SWING' | 'POSITION',
    selectedIndicators: string[],
    symbol?: string
  ): Promise<ChartAnalysis> {
    try {
      console.log('AI Service: Starting chart analysis with OpenRouter...');
      console.log('AI Service: API Key present:', !!OPENROUTER_API_KEY);
      console.log('AI Service: Image base64 length:', imageBase64.length);
      console.log('AI Service: Timeframe:', timeframe);
      console.log('AI Service: Indicators:', selectedIndicators);

      const prompt = this.buildAnalysisPrompt(timeframe, selectedIndicators, symbol);
      console.log('AI Service: Prompt built, length:', prompt.length);

      // Prepare the request body for OpenRouter
      const requestBody = {
        model: "google/gemma-3-27b-it:free",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/png;base64,${imageBase64}`
                }
              }
            ]
          }
        ],
        max_tokens: 2000,
        temperature: 0.7
      };

      console.log('AI Service: Calling OpenRouter API...');
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('API call timeout after 30 seconds')), 30000);
      });
      
      const apiPromise = fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://aitrade.app',
          'X-Title': 'AI Trading Assistant',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      const response = await Promise.race([apiPromise, timeoutPromise]) as Response;
      console.log('AI Service: API call successful, status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('AI Service: API error response:', errorText);
        throw new Error(`API request failed with status ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('AI Service: Response received');
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        console.error('AI Service: Invalid response structure:', data);
        throw new Error('Invalid response from API');
      }

      const text = data.choices[0].message.content;
      console.log('AI Service: Response text length:', text.length);
      console.log('AI Service: Response preview:', text.substring(0, 200));

      const parsed = this.parseAIResponse(text);
      console.log('AI Service: Response parsed successfully');
      return parsed;
    } catch (error) {
      console.error('AI Service: Error analyzing chart:', error);
      console.error('AI Service: Error details:', JSON.stringify(error, null, 2));
      throw new Error('Failed to analyze chart. Please try again.');
    }
  }

  private buildAnalysisPrompt(
    timeframe: string,
    indicators: string[],
    symbol?: string
  ): string {
    return `
You are an expert trading analyst. Analyze this trading chart image and provide a comprehensive trading recommendation.

CHART ANALYSIS REQUIREMENTS:
1. Analyze the chart pattern, trend, and price action
2. Consider the following indicators: ${indicators.join(', ')}
3. Timeframe context: ${timeframe}
4. Symbol: ${symbol || 'Unknown'}

RESPONSE FORMAT (return as JSON):
{
  "signal": {
    "action": "HOLD|BUY_LONG|BUY_SHORT|SELL",
    "confidence": 85,
    "reasoning": "Detailed explanation of the analysis",
    "timeframe": "${timeframe}",
    "indicators": ["RSI", "MACD", "Moving Average"],
    "riskLevel": "LOW|MEDIUM|HIGH"
  },
  "marketCondition": "Bullish/Bearish/Sideways market conditions",
  "supportResistance": "Key support and resistance levels identified",
  "trendAnalysis": "Current trend direction and strength",
  "volumeAnalysis": "Volume analysis and its significance"
}

ANALYSIS GUIDELINES:
- Be conservative with confidence levels
- Consider risk management
- Provide clear reasoning for your recommendation
- Focus on technical analysis from the chart
- Consider the timeframe context for the recommendation

Return only the JSON response, no additional text.
    `;
  }

  private parseAIResponse(response: string): ChartAnalysis {
    try {
      console.log('AI Service: Parsing response...');
      console.log('AI Service: Raw response:', response);
      
      // Clean the response to extract JSON
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error('AI Service: No valid JSON found in response');
        throw new Error('No valid JSON found in response');
      }

      console.log('AI Service: JSON match found:', jsonMatch[0]);
      const parsed = JSON.parse(jsonMatch[0]);
      console.log('AI Service: JSON parsed successfully:', parsed);
      
      // Validate the response structure
      if (!parsed.signal || !parsed.signal.action) {
        console.error('AI Service: Invalid response structure');
        throw new Error('Invalid response structure');
      }

      console.log('AI Service: Response validation passed');
      return parsed as ChartAnalysis;
    } catch (error) {
      console.error('AI Service: Error parsing AI response:', error);
      console.error('AI Service: Response that failed to parse:', response);
      // Return a fallback response
      return {
        signal: {
          action: 'HOLD',
          confidence: 50,
          reasoning: 'Unable to parse AI response. Please try again.',
          timeframe: 'INTRADAY',
          indicators: [],
          riskLevel: 'MEDIUM'
        },
        marketCondition: 'Unable to determine',
        supportResistance: 'Unable to identify',
        trendAnalysis: 'Unable to analyze',
        volumeAnalysis: 'Unable to analyze'
      };
    }
  }

  async testAPI(): Promise<boolean> {
    try {
      console.log('AI Service: Testing OpenRouter API key...');
      
      const requestBody = {
        model: "google/gemma-3-27b-it:free",
        messages: [
          {
            role: "user",
            content: "Hello, respond with 'API working'"
          }
        ],
        max_tokens: 50,
        temperature: 0.1
      };

      const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://aitrade.app',
          'X-Title': 'AI Trading Assistant',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        console.error('AI Service: API test failed with status:', response.status);
        return false;
      }

      const data = await response.json();
      const text = data.choices[0].message.content;
      console.log('AI Service: API test response:', text);
      return text.includes('API working') || text.length > 0;
    } catch (error) {
      console.error('AI Service: API test failed:', error);
      return false;
    }
  }

  async getMarketInsight(symbol: string): Promise<string> {
    try {
      const prompt = `
Provide a brief market insight for ${symbol} based on current market conditions.
Focus on:
- Key market drivers
- Recent price action
- Important levels to watch
- Risk factors

Keep it concise and actionable.
      `;

      const requestBody = {
        model: "google/gemma-3-27b-it:free",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      };

      const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://aitrade.app',
          'X-Title': 'AI Trading Assistant',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error getting market insight:', error);
      return 'Unable to fetch market insight at this time.';
    }
  }
}

export default new AIService();
