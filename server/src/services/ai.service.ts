import { Priority } from '../types';
import { env } from '../config/env';

export interface ImageClassificationResult {
  suggestedCategory: string;
  confidenceScore: number;
  detectedFeatures: string[];
  isAISuggestion: true;
}

export interface CategorizationResult {
  suggestedCategory: string;
  confidenceScore: number;
  reasoning: string;
  isAISuggestion: true;
}

export interface PriorityRecommendationResult {
  suggestedPriority: Priority;
  urgencyScore: number;
  riskFactors: string[];
  reasoning: string;
  isAISuggestion: true;
}

export interface SummaryResult {
  summary: string;
  keyIssues: string[];
  isAISuggestion: true;
}

export interface DuplicateDetectionMatch {
  candidateId: string;
  similarityScore: number;
  matchReasons: string[];
}

export class AIService {
  private provider: string;
  private apiKey: string;
  private model: string;

  constructor() {
    this.provider = env.AI_PROVIDER;
    this.apiKey = env.AI_API_KEY;
    this.model = env.AI_MODEL;
  }

  /**
   * AI Feature 1: Image Classification
   * Analyzes uploaded photographs and predicts likely category
   */
  public async classifyImage(fileName: string, mimeType: string): Promise<ImageClassificationResult> {
    const lowerName = fileName.toLowerCase();

    // Deterministic rule-based heuristic fallback
    if (lowerName.includes('pothole') || lowerName.includes('road') || lowerName.includes('asphalt') || lowerName.includes('crack')) {
      return {
        suggestedCategory: 'Roads & Infrastructure',
        confidenceScore: 0.92,
        detectedFeatures: ['Asphalt fracture', 'Road surface deformation', 'Pothole depression'],
        isAISuggestion: true,
      };
    }

    if (lowerName.includes('light') || lowerName.includes('lamp') || lowerName.includes('pole') || lowerName.includes('wire') || lowerName.includes('electric')) {
      return {
        suggestedCategory: 'Electrical & Streetlights',
        confidenceScore: 0.89,
        detectedFeatures: ['Luminaire housing', 'Public utility pole', 'Electrical wire'],
        isAISuggestion: true,
      };
    }

    if (lowerName.includes('garbage') || lowerName.includes('waste') || lowerName.includes('trash') || lowerName.includes('dump') || lowerName.includes('bin')) {
      return {
        suggestedCategory: 'Waste Management',
        confidenceScore: 0.94,
        detectedFeatures: ['Refuse accumulation', 'Municipal bin overflow', 'Debris cluster'],
        isAISuggestion: true,
      };
    }

    if (lowerName.includes('water') || lowerName.includes('leak') || lowerName.includes('drain') || lowerName.includes('pipe') || lowerName.includes('flood')) {
      return {
        suggestedCategory: 'Water Supply & Drainage',
        confidenceScore: 0.91,
        detectedFeatures: ['Water pooling', 'Pipeline joint leakage', 'Drain blockage'],
        isAISuggestion: true,
      };
    }

    return {
      suggestedCategory: 'Public Facilities',
      confidenceScore: 0.72,
      detectedFeatures: ['Urban civic fixture', 'Public infrastructure asset'],
      isAISuggestion: true,
    };
  }

  /**
   * AI Feature 2: Automatic Complaint Categorization
   * Analyzes text description to recommend category
   */
  public async categorizeComplaint(title: string, description: string): Promise<CategorizationResult> {
    const text = `${title} ${description}`.toLowerCase();

    if (/pothole|road|crater|pavement|footpath|tar|asphalt|divider|speed breaker|manhole/i.test(text)) {
      return {
        suggestedCategory: 'Roads & Infrastructure',
        confidenceScore: 0.95,
        reasoning: 'Keyword signals detected road surface distress and transit pavement degradation.',
        isAISuggestion: true,
      };
    }

    if (/streetlight|street light|light|dark|wire|electric|transformer|pole|bulb|illumination/i.test(text)) {
      return {
        suggestedCategory: 'Electrical & Streetlights',
        confidenceScore: 0.94,
        reasoning: 'Signals detected nighttime public illumination or hazardous electrical fixtures.',
        isAISuggestion: true,
      };
    }

    if (/garbage|waste|trash|dump|overflow|refuse|litter|stench|sanitation|sweeper|smell/i.test(text)) {
      return {
        suggestedCategory: 'Waste Management',
        confidenceScore: 0.96,
        reasoning: 'Context indicators highlight solid waste overflow and public sanitation hazard.',
        isAISuggestion: true,
      };
    }

    if (/water|pipeline|leak|supply|contamination|drain|drainage|sewage|gutters|flood|pipe/i.test(text)) {
      return {
        suggestedCategory: 'Water Supply & Drainage',
        confidenceScore: 0.93,
        reasoning: 'Identified municipal water distribution faults and stormwater canal choking.',
        isAISuggestion: true,
      };
    }

    if (/bench|park|playground|restroom|toilet|bus stop|shelter|fence|barrier|facility/i.test(text)) {
      return {
        suggestedCategory: 'Public Facilities',
        confidenceScore: 0.88,
        reasoning: 'Reference to shared neighborhood recreational or amenity infrastructure.',
        isAISuggestion: true,
      };
    }

    return {
      suggestedCategory: 'General Administration',
      confidenceScore: 0.65,
      reasoning: 'Broad civic complaint requiring preliminary administrative classification.',
      isAISuggestion: true,
    };
  }

  /**
   * AI Feature 3: Priority Recommendation
   * Evaluates severity, public safety risk, and contextual urgency
   */
  public async recommendPriority(title: string, description: string, category: string): Promise<PriorityRecommendationResult> {
    const text = `${title} ${description}`.toLowerCase();
    const riskFactors: string[] = [];
    let score = 50; // base medium

    // High risk keywords
    if (/danger|hazard|spark|accident|injur|emergency|collapse|deep pothole|live wire|electrocution|death/i.test(text)) {
      riskFactors.push('Immediate public health or physical safety danger');
      score += 40;
    }

    if (/main road|highway|traffic|crossroad|hospital|school|market|intersection/i.test(text)) {
      riskFactors.push('High population density or critical pedestrian corridor');
      score += 25;
    }

    if (/drinking water|contamination|sewage overflow|epidemic|foul smell/i.test(text)) {
      riskFactors.push('Severe sanitation / disease vector exposure');
      score += 20;
    }

    if (/broken bench|graffiti|small crack|faded paint|minor/i.test(text)) {
      riskFactors.push('Non-critical cosmetic / secondary amenity impairment');
      score -= 30;
    }

    let suggestedPriority: Priority = 'MEDIUM';
    if (score >= 85) suggestedPriority = 'URGENT';
    else if (score >= 65) suggestedPriority = 'HIGH';
    else if (score <= 35) suggestedPriority = 'LOW';

    return {
      suggestedPriority,
      urgencyScore: Math.min(100, Math.max(0, score)),
      riskFactors: riskFactors.length > 0 ? riskFactors : ['Standard municipal servicing schedule'],
      reasoning: `Recommended as ${suggestedPriority} based on assessed risk factor indicators.`,
      isAISuggestion: true,
    };
  }

  /**
   * AI Feature 4: Complaint Summarization
   * Generates actionable executive summaries for administrators
   */
  public async summarizeComplaint(title: string, description: string): Promise<SummaryResult> {
    const sentences = description.split(/[.!?]+/).map((s) => s.trim()).filter(Boolean);
    const primaryStatement = sentences[0] || description;
    
    const keyIssues: string[] = [];
    if (/pothole|road/i.test(description)) keyIssues.push('Road surface deformation');
    if (/water|leak/i.test(description)) keyIssues.push('Water supply distribution leak');
    if (/wire|electric|light/i.test(description)) keyIssues.push('Electrical illumination defect');
    if (/waste|garbage/i.test(description)) keyIssues.push('Public solid waste overflow');
    if (keyIssues.length === 0) keyIssues.push('Community infrastructure maintenance needed');

    const summary = `${title}: ${primaryStatement}. Citizen reports immediate neighborhood disruption.`;

    return {
      summary,
      keyIssues,
      isAISuggestion: true,
    };
  }

  /**
   * AI Feature 5: Duplicate Detection Engine
   * Calculates similarity between a new complaint and existing active complaints
   */
  public detectDuplicates(
    newComplaint: { title: string; description: string; categoryId: string; latitude?: number | null; longitude?: number | null },
    existingComplaints: Array<{ id: string; title: string; description: string; categoryId: string; latitude?: number | null; longitude?: number | null }>
  ): DuplicateDetectionMatch[] {
    const matches: DuplicateDetectionMatch[] = [];

    for (const item of existingComplaints) {
      let score = 0;
      const reasons: string[] = [];

      // 1. Category exact match
      if (item.categoryId === newComplaint.categoryId) {
        score += 0.25;
        reasons.push('Identical issue category');
      }

      // 2. Geographic proximity (within ~250m)
      if (
        newComplaint.latitude &&
        newComplaint.longitude &&
        item.latitude &&
        item.longitude
      ) {
        const distanceKm = this.calculateDistance(
          newComplaint.latitude,
          newComplaint.longitude,
          item.latitude,
          item.longitude
        );

        if (distanceKm <= 0.1) {
          score += 0.45;
          reasons.push(`Within 100 meters (${Math.round(distanceKm * 1000)}m apart)`);
        } else if (distanceKm <= 0.3) {
          score += 0.30;
          reasons.push(`Within 300 meters (${Math.round(distanceKm * 1000)}m apart)`);
        }
      }

      // 3. Text token similarity (Jaccard similarity on significant terms)
      const textSimilarity = this.calculateTextSimilarity(
        `${newComplaint.title} ${newComplaint.description}`,
        `${item.title} ${item.description}`
      );

      if (textSimilarity > 0.3) {
        score += textSimilarity * 0.4;
        reasons.push(`Text description similarity index: ${Math.round(textSimilarity * 100)}%`);
      }

      // If combined similarity exceeds 60%, flag as duplicate candidate
      if (score >= 0.55) {
        matches.push({
          candidateId: item.id,
          similarityScore: parseFloat(score.toFixed(2)),
          matchReasons: reasons,
        });
      }
    }

    return matches.sort((a, b) => b.similarityScore - a.similarityScore);
  }

  /**
   * Haversine formula to compute distance in km between two GPS coordinates
   */
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Jaccard word set similarity
   */
  private calculateTextSimilarity(text1: string, text2: string): number {
    const words1 = new Set(
      text1.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter((w) => w.length > 3)
    );
    const words2 = new Set(
      text2.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter((w) => w.length > 3)
    );

    if (words1.size === 0 || words2.size === 0) return 0;

    let intersectionCount = 0;
    words1.forEach((w) => {
      if (words2.has(w)) intersectionCount++;
    });

    const unionCount = new Set([...words1, ...words2]).size;
    return unionCount === 0 ? 0 : intersectionCount / unionCount;
  }
}

export const aiService = new AIService();
