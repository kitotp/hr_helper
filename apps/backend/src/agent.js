import {Agent, run, tool} from "@openai/agents"
import {z} from "zod"
import OpenAI from 'openai';
import 'dotenv/config';

const analizePdfTool = tool({
    name: 'analize_pdf',
    description: 'analize the provided text',
    parameters: z.object({
        text: z.string(),
        stack: z.string()
    }),
    execute: async ({text}) => {
        const prompt = `Analize the following text: ${text} based on the demanded stack: ${stack}. Answer just with a rating from 0 to 10 based on how the candidate fits for the stack`
        const client = new OpenAI({apiKey: process.env.OPENAI_API_KEY})
        const resp = client.responses.create({
            model: "gpt-4o-mini",
            input: prompt
        })


        return (await resp).output_text
    }
})

const pdfAnalizer = new Agent({
    name: 'Pdf Analizer',
    model: 'gpt-4o-mini',
    instructions: 'You have to analize the provided pdf file and evaluate it from 0 to 10 depending on the demanded stack',
    tools: [analizePdfTool],
})

const resumeText = 'i am frontend developer with 2 years of experience. Programming with react';
const stack = 'frontend 2 years of experience react.js redux';

const input = [
  {
    role: 'user',
    content: `Use the analyze_pdf tool with these args: text: """${resumeText}""" stack: """${stack}"""`,
  },
];

const result = await run(pdfAnalizer, input)
console.log(result.finalOutput)