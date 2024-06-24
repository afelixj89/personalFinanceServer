import { Request, Response } from 'express';
import OpenAI from 'openai';
import { FinancialRecord } from '../models/FinancialRecord';

// Assuming you have your API key set in an environment variable
const apiKey = process.env.OPENAI_API_KEY || '';

// Create an OpenAI instance
const openai = new OpenAI({
  apiKey: apiKey,
});

// Example controller method using OpenAI
export const chatWithGPT = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;

    // Make a request to OpenAI using the correct method
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: message }],
    });

    // Check if response is valid and has choices
    if (response && response.choices && response.choices.length > 0) {
      // Extract the assistant's response from the API response
      const assistantMessage = response.choices[0]?.message?.content;

      // Handle assistant's response here...

      res.json({ message: assistantMessage });
    } else {
      res.status(500).json({ error: 'Invalid response from OpenAI API' });
    }
  } catch (error) {
    console.error('Error communicating with OpenAI:', error);
    res.status(500).json({ error: 'Failed to communicate with OpenAI' });
  }
};
