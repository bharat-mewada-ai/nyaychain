import { analyzePropertyWithGemini, isGeminiConfigured } from './geminiService';
import { MOCK_PROPERTIES, MOCK_ANALYSIS_RESULTS } from '../constants/mockData';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Analyze a property using Gemini AI or fallback mock data
 */
export const analyzeProperty = async (plotId) => {
  // Find the full property data
  const property = MOCK_PROPERTIES.find(p => p.plotId === plotId);
  
  if (!property) {
    throw new Error(`Property with Plot ID ${plotId} not found.`);
  }

  // Add a small delay for UX (loading animation)
  await delay(800);

  // Use Gemini AI if configured, otherwise use smart mock
  try {
    const result = await analyzePropertyWithGemini(property);
    return result;
  } catch (error) {
    console.error('Analysis error, falling back to mock:', error);
    
    // Final fallback to static mock data
    const mockResult = MOCK_ANALYSIS_RESULTS[property.id];
    if (mockResult) {
      return {
        risk_level: mockResult.riskLevel === 'high' ? 'High' : 
                    mockResult.riskLevel === 'medium' ? 'Medium' : 'Low',
        fraud_probability: mockResult.fraudProbability,
        dispute_risk: mockResult.disputeProbability,
        dispute_summary: `${mockResult.disputeProbability}% chance of ownership dispute based on historical analysis.`,
        reasons: mockResult.reasons,
        recommendation: mockResult.riskLevel === 'high' 
          ? 'Immediate review recommended.' 
          : 'No immediate action needed.',
      };
    }
    
    throw new Error('Analysis failed. Please try again.');
  }
};
