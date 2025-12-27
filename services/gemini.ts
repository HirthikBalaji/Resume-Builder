import { GoogleGenAI } from "@google/genai";
import { ResumeData } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const MODEL_NAME = 'gemini-3-flash-preview';

/**
 * Enhances a specific piece of text (e.g., a bullet point) to be more professional.
 */
export const enhanceText = async (text: string, context: string): Promise<string> => {
  if (!text.trim()) return "";

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `You are an expert career coach. Rewrite the following resume bullet point to be more professional, action-oriented, and impactful. Keep it concise.
      
      Context (Job Title/Field): ${context}
      Original Text: "${text}"
      
      Return ONLY the rewritten text. Do not add quotes or explanations.`,
    });
    return response.text?.trim() || text;
  } catch (error) {
    console.error("Gemini enhancement failed:", error);
    return text; // Fallback to original
  }
};

/**
 * Generates a professional summary based on the user's data.
 */
export const generateSummary = async (data: ResumeData): Promise<string> => {
  const { personalInfo, experience, skills } = data;
  
  const experienceText = experience
    .map(exp => `${exp.title} at ${exp.company}`)
    .join(", ");

  const prompt = `Write a compelling, professional resume summary (3-4 sentences max) for a ${personalInfo.jobTitle}.
  
  Key Experience: ${experienceText}
  Key Skills: ${skills.join(", ")}
  
  The summary should highlight expertise and career goals. Return ONLY the summary text.`;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });
    return response.text?.trim() || "";
  } catch (error) {
    console.error("Gemini summary generation failed:", error);
    return "";
  }
};

/**
 * Suggests skills based on the job title.
 */
export const suggestSkills = async (jobTitle: string): Promise<string[]> => {
  if (!jobTitle) return [];

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `List 10 relevant hard and soft skills for a "${jobTitle}" role. Return the result as a comma-separated list of strings only. No bullets, no numbering.`,
    });
    
    const text = response.text?.trim() || "";
    return text.split(',').map(s => s.trim()).filter(s => s.length > 0);
  } catch (error) {
    console.error("Gemini skill suggestion failed:", error);
    return [];
  }
};
