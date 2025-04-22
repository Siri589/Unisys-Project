import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyCDmhlaxBwu-THoZvvfSaGND9GSZ9qhvgM";
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-pro",
  generationConfig: {
    temperature: 0.7,
    topP: 1,
    topK: 1,
    maxOutputTokens: 2048,
  },
});

export async function chatSession(userPrompt, type = 'fertilizer') {
  try {
    // Generate content directly instead of using chat
    const result = await model.generateContent(userPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('AI Service Error:', error);
    throw error;
  }
}
