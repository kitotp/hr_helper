import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const { PDFParse } = require('pdf-parse');
import sgMail from '@sendgrid/mail';
import OpenAI from 'openai';
import { prisma } from '../prisma.js';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function processApplication({ file }) {
  const parser = new PDFParse({ data: file.buffer });

  const parsed = await parser.getText()
  const pdfText = (parsed.text || '').slice(0, 30000);

  const defaults = {
    id: '1',
    email: process.env.ADMIN_EMAIL || 'admin@example.com',
    job: 'Any position',
    experience: 'any',
    stack: 'general',
  };

  const req = await prisma.requirements.findUnique({
    where: {
      id: "1"
    },
    update: {},
    create: defaults
  })

  const { email, job, experience, stack } = req;

  const prompt =
    `Analyze the resume for Job: ${job}, Experience: ${experience}, Stack: ${stack}. ` +
    `Return ONLY a rate 0–10 (10=best) and one sentence reason.\n\n` + pdfText;

  const ai = await openai.responses.create({ model: 'gpt-4o-mini', input: prompt });

  await sgMail.send({
    to: email,
    from: email,
    subject: 'New Application!',
    text: String(ai.output_text ?? '').trim(),
  });
}
