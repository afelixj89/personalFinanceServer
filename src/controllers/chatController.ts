import { Request, Response } from 'express';
import { FinancialRecord } from '../models/FinancialRecord';
import rateLimit from 'express-rate-limit';
import 'dotenv/config';
import { TextServiceClient } from '@google-ai/generativelanguage';
import { GoogleAuth } from 'google-auth-library';

// Load environment variables
const apiKey = process.env.GEMINI_API_KEY || '';

// Initialize the Gemini client
const geminiClient = new TextServiceClient({
  auth: new GoogleAuth({
    credentials: {
      client_email: process.env.CLIENT_EMAIL,
      private_key: process.env.PRIVATE_KEY,
    },
  }),
});

// Set up rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

export const chatWithGPT = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;

    // Make a request to the Gemini API
    const [response] = await geminiClient.generateText({
      model: 'models/gemini-free-model', // Replace with the appropriate model identifier
      prompt: {
        text: message,
      },
    });

    // Check if response is valid and has candidates
    if (response && response.candidates && response.candidates.length > 0) {
      // Extract the assistant's response from the API response
      const assistantMessage = response.candidates[0].output;

      // Example logic to create a financial record from the assistant message
      if (assistantMessage && assistantMessage.includes('create record')) {
        // Define recordData with the correct type assertion
        const recordData: Partial<FinancialRecord> = {
          userId: 'exampleUserId',  // Replace with actual user ID or extract from message
          date: new Date(),
          description: 'Sample description',
          amount: 100.0,
          category: 'Sample category',
          paymentMethod: 'Sample payment method',
        };

        // Use FinancialRecord.create to directly create the instance
        const record = await FinancialRecord.create(recordData as FinancialRecord);

        res.json({ message: 'Record created successfully' });
      } else {
        res.json({ message: assistantMessage });
      }
    } else {
      res.status(500).json({ error: 'Invalid response from Gemini API' });
    }
  } catch (error) {
    console.error('Error communicating with Gemini:', error);
    if (error instanceof Error) {
      if (error.message.includes('429')) {
        res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
      } else if (error.message.includes('404')) {
        res.status(404).json({ error: 'Model not found or access denied.' });
      } else {
        res.status(500).json({ error: 'Failed to communicate with Gemini' });
      }
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  }
};
