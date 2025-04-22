import React, { useState } from 'react';
import { chatSession } from '../service/AIModal';
import './fertilizer.css';
import Header from '../components/custom/Header';

function FertilizerSuggestion() {
  const [formData, setFormData] = useState({
    soilType: '',
    phLevel: '',
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    moisture: '',
    crop: ''
  });

  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setRecommendations(null);

    try {
      const prompt = `You are an agricultural expert AI. Based on these conditions, recommend suitable fertilizers:

Soil Properties:
- Soil Type: ${formData.soilType}
- pH Level: ${formData.phLevel}
- Current Nitrogen Level: ${formData.nitrogen} mg/kg
- Current Phosphorus Level: ${formData.phosphorus} mg/kg
- Current Potassium Level: ${formData.potassium} mg/kg
- Moisture Level: ${formData.moisture}
- Target Crop: ${formData.crop}

Provide 2-3 fertilizer recommendations in this exact format:

1. [Fertilizer Name]
- NPK Ratio: [ratio]
- Application: [detailed instructions]
- Benefits: [expected improvements]
- Environmental: [considerations]

2. [Fertilizer Name]
- NPK Ratio: [ratio]
- Application: [detailed instructions]
- Benefits: [expected improvements]
- Environmental: [considerations]

3. [Fertilizer Name] (optional)
- NPK Ratio: [ratio]
- Application: [detailed instructions]
- Benefits: [expected improvements]
- Environmental: [considerations]`;

      const response = await chatSession(prompt, 'fertilizer');
      console.log('AI Response:', response);

      if (!response) {
        throw new Error('No response received from AI service');
      }

      // Parse the AI response
      const lines = response.split('\n');
      const recommendations = [];
      let currentRec = null;

      for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;

        // Check for new fertilizer recommendation (starts with number followed by dot)
        if (/^\d+\./.test(trimmedLine)) {
          if (currentRec?.fertilizer_name) {
            recommendations.push(currentRec);
          }
          currentRec = {
            fertilizer_name: trimmedLine.replace(/^\d+\.\s*/, '').trim(),
            npk_ratio: '',
            application_instructions: '',
            expected_yield_improvements: '',
            environmental_considerations: ''
          };
        }
        // Update fields of current recommendation
        else if (currentRec && trimmedLine.startsWith('-')) {
          const [key, ...valueParts] = trimmedLine.substring(1).split(':');
          const value = valueParts.join(':').trim();
          
          switch (key.trim().toLowerCase()) {
            case 'npk ratio':
              currentRec.npk_ratio = value || 'Standard NPK ratio';
              break;
            case 'application':
              currentRec.application_instructions = value || 'Apply as per standard guidelines';
              break;
            case 'benefits':
              currentRec.expected_yield_improvements = value || 'Improved crop yield';
              break;
            case 'environmental':
              currentRec.environmental_considerations = value || 'Follow environmental guidelines';
              break;
          }
        }
      }

      // Add the last recommendation
      if (currentRec?.fertilizer_name) {
        recommendations.push(currentRec);
      }

      // Validate recommendations
      if (recommendations.length === 0) {
        throw new Error('Could not extract any recommendations from the AI response');
      }

      // Fill in any missing fields with defaults
      const validRecommendations = recommendations.map(rec => ({
        fertilizer_name: rec.fertilizer_name || 'General Purpose Fertilizer',
        npk_ratio: rec.npk_ratio || 'Standard NPK ratio',
        application_instructions: rec.application_instructions || 'Apply as per standard guidelines',
        expected_yield_improvements: rec.expected_yield_improvements || 'Improved crop yield',
        environmental_considerations: rec.environmental_considerations || 'Follow environmental guidelines'
      }));

      setRecommendations(validRecommendations);

    } catch (err) {
      console.error('Error getting fertilizer recommendations:', err);
      setError('Failed to get fertilizer recommendations. Please try again.');
      setRecommendations(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fertilizer-suggestion">
      <Header />
      <div className="container">
        <h2>Fertilizer Recommendation Form</h2>
        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Soil Type:</label>
            <select 
              name="soilType"
              value={formData.soilType}
              onChange={handleInputChange}
              required
            >
              <option value="">Select...</option>
              <option value="Clay">Clay</option>
              <option value="Loamy">Loamy</option>
              <option value="Sandy">Sandy</option>
              <option value="Black">Black</option>
              <option value="Red">Red</option>
            </select>
          </div>

          <div className="form-group">
            <label>pH Level:</label>
            <input
              type="number"
              name="phLevel"
              value={formData.phLevel}
              onChange={handleInputChange}
              step="0.1"
              required
            />
          </div>

          <div className="form-group">
            <label>Nitrogen Level (mg/kg):</label>
            <input
              type="number"
              name="nitrogen"
              value={formData.nitrogen}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Phosphorus Level (mg/kg):</label>
            <input
              type="number"
              name="phosphorus"
              value={formData.phosphorus}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Potassium Level (mg/kg):</label>
            <input
              type="number"
              name="potassium"
              value={formData.potassium}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Moisture Level:</label>
            <select
              name="moisture"
              value={formData.moisture}
              onChange={handleInputChange}
              required
            >
              <option value="">Select...</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="form-group">
            <label>Crop Type:</label>
            <input
              type="text"
              name="crop"
              value={formData.crop}
              onChange={handleInputChange}
              required
              placeholder="e.g., Rice, Wheat, Cotton"
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Generating...' : 'Get Recommendations'}
          </button>
        </form>

        {recommendations && (
          <div className="recommendations-container">
            <h3>Fertilizer Recommendations</h3>
            <div className="recommendations">
              {recommendations.map((recommendation, index) => (
                <div key={index} className="recommendation-card">
                  <h4>{recommendation.fertilizer_name}</h4>
                  <p><strong>NPK Ratio:</strong> {recommendation.npk_ratio}</p>
                  <p><strong>Application:</strong> {recommendation.application_instructions}</p>
                  <p><strong>Expected Benefits:</strong> {recommendation.expected_yield_improvements}</p>
                  <p><strong>Environmental Notes:</strong> {recommendation.environmental_considerations}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FertilizerSuggestion;
