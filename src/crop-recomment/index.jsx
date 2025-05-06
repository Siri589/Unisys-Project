import React, { useState } from 'react';
import './crop.css';
import { chatSession } from '../service/AIModal.jsx';
import Header from '../components/custom/Header';

function CropRecommendation() {
  const [soilTexture, setSoilTexture] = useState('');
  const [phLevel, setPhLevel] = useState('');
  const [nitrogen, setNitrogen] = useState('');
  const [phosphorus, setPhosphorus] = useState('');
  const [potassium, setPotassium] = useState('');
  const [temperature, setTemperature] = useState('');
  const [rainfall, setRainfall] = useState('');
  const [humidity, setHumidity] = useState('');
  const [windConditions, setWindConditions] = useState('');
  const [waterSource, setWaterSource] = useState('');
  const [irrigationSystem, setIrrigationSystem] = useState(false);
  const [waterUsage, setWaterUsage] = useState('');
  const [farmingTech, setFarmingTech] = useState('');
  const [prevCrops, setPrevCrops] = useState('');
  const [cropPreferences, setCropPreferences] = useState('');
  const [region, setRegion] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setRecommendations(null);

    try {
      const prompt = `You are an agricultural expert AI. Based on these conditions, recommend suitable crops:

Soil Properties:
- Texture: ${soilTexture}
- pH Level: ${phLevel}
- Nitrogen: ${nitrogen} mg/kg
- Phosphorus: ${phosphorus} mg/kg
- Potassium: ${potassium} mg/kg

Climate Conditions:
- Temperature: ${temperature}°C
- Annual Rainfall: ${rainfall} mm
- Humidity: ${humidity}%
- Wind: ${windConditions}

Water Availability:
- Source: ${waterSource}
- Irrigation System: ${irrigationSystem ? 'Available' : 'Not Available'}
- Location: ${region}

Provide 3 crop recommendations in this exact format:

1. [Crop Name]
- Suitability: [percentage]
- Growing Season: [months]
- Care Instructions: [details]

2. [Crop Name]
- Suitability: [percentage]
- Growing Season: [months]
- Care Instructions: [details]

3. [Crop Name]
- Suitability: [percentage]
- Growing Season: [months]
- Care Instructions: [details]`;

      const response = await chatSession(prompt, 'crop');
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

        // Check for new crop recommendation (starts with number followed by dot)
        if (/^\d+\./.test(trimmedLine)) {
          if (currentRec?.crop) {
            recommendations.push(currentRec);
          }
          currentRec = {
            crop: trimmedLine.replace(/^\d+\.\s*/, '').trim(),
            suitability: '',
            season: '',
            care: ''
          };
        }
        // Update fields of current recommendation
        else if (currentRec && trimmedLine.startsWith('-')) {
          const [key, ...valueParts] = trimmedLine.substring(1).split(':');
          const value = valueParts.join(':').trim();
          
          switch (key.trim().toLowerCase()) {
            case 'suitability':
              const match = value.match(/\d+/);
              currentRec.suitability = match ? `${match[0]}%` : '90%';
              break;
            case 'growing season':
              currentRec.season = value || 'Year-round';
              break;
            case 'care instructions':
              currentRec.care = value || 'Regular monitoring and maintenance required';
              break;
          }
        }
      }

      // Add the last recommendation
      if (currentRec?.crop) {
        recommendations.push(currentRec);
      }

      // Validate recommendations
      if (recommendations.length === 0) {
        throw new Error('Could not extract any recommendations from the AI response');
      }

      // Fill in any missing fields with defaults
      const validRecommendations = recommendations.map(rec => ({
        crop: rec.crop || 'Unknown Crop',
        suitability: rec.suitability || '90%',
        season: rec.season || 'Year-round',
        care: rec.care || 'Regular monitoring and maintenance required'
      }));

      setRecommendations(validRecommendations);

    } catch (err) {
      console.error('Error getting crop recommendations:', err);
      setError('Failed to get crop recommendations. Please try again.');
      setRecommendations(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="crop-recommendation">
      <Header />
      <div className="container">
        <h1>Crop Recommendation</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h2>Soil Properties</h2>
            <div className="form-group">
              <label>Soil Texture:</label>
              <select value={soilTexture} onChange={(e) => setSoilTexture(e.target.value)} required>
                <option value="">Select...</option>
                <option value="Clay">Clay</option>
                <option value="Loam">Loamy</option>
                <option value="Sand">Sandy</option>
                <option value="Silt">Silty</option>
                <option value="Clay Loam">Clay Loam</option>
              </select>
            </div>

            <div className="form-group">
              <label>Soil pH Level:</label>
              <select value={phLevel} onChange={(e) => setPhLevel(e.target.value)} required>
                <option value="">Select...</option>
                <option value="Acidic">Acidic (Below 6.5)</option>
                <option value="Neutral">Neutral (6.5-7.5)</option>
                <option value="Alkaline">Alkaline (Above 7.5)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Nitrogen Level (mg/kg):</label>
              <input 
                type="number" 
                value={nitrogen} 
                onChange={(e) => setNitrogen(e.target.value)}
                required
                min="0"
                max="1000"
              />
            </div>

            <div className="form-group">
              <label>Phosphorus Level (mg/kg):</label>
              <input 
                type="number" 
                value={phosphorus} 
                onChange={(e) => setPhosphorus(e.target.value)}
                required
                min="0"
                max="1000"
              />
            </div>

            <div className="form-group">
              <label>Potassium Level (mg/kg):</label>
              <input 
                type="number" 
                value={potassium} 
                onChange={(e) => setPotassium(e.target.value)}
                required
                min="0"
                max="1000"
              />
            </div>
          </div>

          <div className="form-section">
            <h2>Environmental Conditions</h2>
            <div className="form-group">
              <label>Average Temperature (°C):</label>
              <input 
                type="number" 
                value={temperature} 
                onChange={(e) => setTemperature(e.target.value)}
                required
                min="-20"
                max="50"
              />
            </div>

            <div className="form-group">
              <label>Annual Rainfall (mm):</label>
              <input 
                type="number" 
                value={rainfall} 
                onChange={(e) => setRainfall(e.target.value)}
                required
                min="0"
                max="5000"
              />
            </div>

            <div className="form-group">
              <label>Humidity (%):</label>
              <input 
                type="number" 
                value={humidity} 
                onChange={(e) => setHumidity(e.target.value)}
                required
                min="0"
                max="100"
              />
            </div>

            <div className="form-group">
              <label>Wind Conditions:</label>
              <select value={windConditions} onChange={(e) => setWindConditions(e.target.value)} required>
                <option value="">Select...</option>
                <option value="Calm">Calm</option>
                <option value="Moderate">Moderate</option>
                <option value="Strong">Strong</option>
              </select>
            </div>
          </div>

          <div className="form-section">
            <h2>Additional Information</h2>
            <div className="form-group">
              <label>Water Source:</label>
              <select value={waterSource} onChange={(e) => setWaterSource(e.target.value)} required>
                <option value="">Select...</option>
                <option value="Well">Well</option>
                <option value="River">River</option>
                <option value="Rain">Rainwater</option>
                <option value="Canal">Canal</option>
              </select>
            </div>

            <div className="form-group">
              <label>Irrigation System:</label>
              <select 
                value={irrigationSystem} 
                onChange={(e) => setIrrigationSystem(e.target.value === 'true')}
                required
              >
                <option value="">Select...</option>
                <option value="true">Available</option>
                <option value="false">Not Available</option>
              </select>
            </div>

            <div className="form-group">
              <label>Region/Location:</label>
              <input 
                type="text" 
                value={region} 
                onChange={(e) => setRegion(e.target.value)}
                placeholder="Enter your region"
                required
              />
            </div>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Analyzing Data...' : 'Get Recommendations'}
          </button>
        </form>
        {error && <div className="error-message">{error}</div>}
        {recommendations && (
          <div className="recommendations">
            <h2>Recommended Crops</h2>
            {recommendations.map((recommendation, index) => (
              <div key={index} className="recommendation-item">
                <h3>{recommendation.crop}</h3>
                <div className="recommendation-details">
                  <p><strong>Suitability:</strong> {recommendation.suitability}</p>
                  <p><strong>Growing Season:</strong> {recommendation.season}</p>
                  <p><strong>Care Instructions:</strong> {recommendation.care}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CropRecommendation;
