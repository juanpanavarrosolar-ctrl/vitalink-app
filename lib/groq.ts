import Groq from 'groq-sdk';

export function getGroq() {
  if (!process.env.GROQ_API_KEY) throw new Error('GROQ_API_KEY no configurada');
  return new Groq({ apiKey: process.env.GROQ_API_KEY });
}

export const GROQ_MODEL = 'llama-3.3-70b-versatile';
