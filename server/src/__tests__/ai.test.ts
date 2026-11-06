import { describe, it, expect } from 'vitest';
import { aiService } from '../services/ai.service';

describe('AI Intelligence & Decision-Support Services', () => {
  it('classifies road damage photographs correctly', async () => {
    const result = await aiService.classifyImage('pothole_crater_indiranagar.jpg', 'image/jpeg');
    expect(result.suggestedCategory).toBe('Roads & Infrastructure');
    expect(result.confidenceScore).toBeGreaterThan(0.8);
    expect(result.isAISuggestion).toBe(true);
  });

  it('classifies streetlight defect photographs correctly', async () => {
    const result = await aiService.classifyImage('broken_street_light_pole.png', 'image/png');
    expect(result.suggestedCategory).toBe('Electrical & Streetlights');
    expect(result.confidenceScore).toBeGreaterThan(0.8);
  });

  it('categorizes complaint text descriptions accurately', async () => {
    const result = await aiService.categorizeComplaint(
      'Massive pipeline leak on main avenue',
      'Fresh drinking water is gushing out of an underground pipeline fracture and flooding the street corner.'
    );
    expect(result.suggestedCategory).toBe('Water Supply & Drainage');
    expect(result.confidenceScore).toBeGreaterThan(0.9);
  });

  it('recommends URGENT priority for hazardous safety emergencies', async () => {
    const result = await aiService.recommendPriority(
      'Live wire sparking near primary school gate',
      'High-voltage electric wire hanging down, severe electrocution hazard and immediate danger to pedestrians!',
      'Electrical'
    );
    expect(result.suggestedPriority).toBe('URGENT');
    expect(result.urgencyScore).toBeGreaterThan(80);
    expect(result.riskFactors.length).toBeGreaterThan(0);
  });

  it('generates concise executive summaries for administrators', async () => {
    const result = await aiService.summarizeComplaint(
      'Garbage Dump Overflow',
      'The municipal waste container has been uncollected for 5 days. Foul stench spreading across neighborhood.'
    );
    expect(result.summary).toContain('Garbage Dump Overflow');
    expect(result.isAISuggestion).toBe(true);
  });

  it('detects spatial and text duplicates within geographic proximity', () => {
    const newReport = {
      title: 'Deep road crater pothole',
      description: 'Dangerous pothole damaging cars on main crossroad.',
      categoryId: 'cat-roads',
      latitude: 12.9716,
      longitude: 77.5946,
    };

    const existingReports = [
      {
        id: 'comp-existing-01',
        title: 'Deep road pothole crater',
        description: 'Pothole damaging vehicle tires on main road crossroad.',
        categoryId: 'cat-roads',
        latitude: 12.972, // ~45 meters away
        longitude: 77.595,
      },
      {
        id: 'comp-unrelated-02',
        title: 'Broken park swing',
        description: 'Children playground swing in park damaged.',
        categoryId: 'cat-public-facilities',
        latitude: 13.05,
        longitude: 77.65,
      },
    ];

    const matches = aiService.detectDuplicates(newReport, existingReports);
    expect(matches.length).toBe(1);
    expect(matches[0].candidateId).toBe('comp-existing-01');
    expect(matches[0].similarityScore).toBeGreaterThan(0.5);
  });
});
