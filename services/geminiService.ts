import { GoogleGenAI } from "@google/genai";
import { Billboard } from "../types";

const apiKey = process.env.API_KEY;

export const analyzeInventory = async (inventory: Billboard[]): Promise<string> => {
  if (!apiKey) {
    return "API Key no configurada. Por favor configura process.env.API_KEY.";
  }

  if (inventory.length === 0) {
    return "No hay inventario seleccionado para analizar.";
  }

  // Limit context size for demo purposes
  const dataSummary = inventory.slice(0, 20).map(b => 
    `- ${b.elemento} (${b.tipo}) en ${b.distrito}, ${b.departamento}. Audiencia diaria: ${b.audiencia}. Ubicación: ${b.direccionComercial}`
  ).join("\n");

  const prompt = `
    Actúa como un estratega experto en publicidad OOH (Out of Home).
    Analiza la siguiente lista filtrada de ubicaciones de publicidad exterior:

    ${dataSummary}

    1. Proporciona un breve "Pitch de Venta" de 2 oraciones sobre por qué este conjunto de ubicaciones es valioso para una marca.
    2. Sugiere 3 tipos de industrias (rubros) ideales para pautar en estos espacios basándote en la audiencia y ubicación.
    
    Formatea la respuesta en Markdown simple.
  `;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "No se pudo generar el análisis.";
  } catch (error) {
    console.error("Error calling Gemini:", error);
    return "Error al conectar con Gemini AI para el análisis.";
  }
};