import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const pdfParse = require('pdf-parse'); 
import sgMail from '@sendgrid/mail';
import OpenAI from 'openai';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function processApplication({ file }) {
  const parsed = await pdfParse(file.buffer);
  const pdfText = (parsed.text || '').slice(0, 30000);

  const r = await fetch('http://127.0.0.1:2000/requirements/1');
  const { job, experience, stack } = await r.json();

  const prompt =
    `Analyze the resume for Job: ${job}, Experience: ${experience}, Stack: ${stack}. ` +
    `Return ONLY a rate 0–10 (10=best) and one sentence reason.\n\n` + pdfText;

  const ai = await openai.responses.create({ model: 'gpt-4o-mini', input: prompt });

  await sgMail.send({
    to: 'maison78901@gmail.com',
    from: process.env.DEFAULT_FROM_EMAIL,
    subject: 'New Application!',
    text: String(ai.output_text ?? '').trim(),
  });
}
