// Adaptador de Gemini. Para cambiar de proveedor, se escribe otro archivo con la misma función
// generar({ sistema, mensajes }) y se elige con ZOFT_PROVEEDOR.
import { GoogleGenAI } from '@google/genai';

const MODELO = process.env.ZOFT_MODELO || 'gemini-3.8-flash';
let cliente = null;

export async function generar({ sistema, mensajes }) {
  if (!process.env.GEMINI_API_KEY) throw new Error('Falta GEMINI_API_KEY');
  cliente ??= new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const r = await cliente.models.generateContent({
    model: MODELO,
    contents: mensajes.map((m) => ({ role: m.rol === 'zoft' ? 'model' : 'user', parts: [{ text: m.texto }] })),
    config: {
      systemInstruction: sistema,
      temperature: 0.3,
      // el modelo "piensa" antes de responder y eso consume del mismo tope: hay que dejar margen
      maxOutputTokens: 2048,
      thinkingConfig: { thinkingLevel: 'low' },
    },
  });
  return { texto: (r.text || '').trim(), uso: r.usageMetadata };
}

export const nombre = `gemini:${MODELO}`;
