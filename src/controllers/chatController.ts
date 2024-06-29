import { Request, Response } from 'express';
import axios from 'axios';
import { FinancialRecord } from '../models/FinancialRecord';
import rateLimit from 'express-rate-limit';

// Load environment variables from .env file
import 'dotenv/config';

// Assuming you have your API key set in an environment variable
const apiKey = process.env.GEMINI_API_KEY || '';
const apiEndpoint = process.env.GEMINI_API_ENDPOINT || '';

// Set up rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// Example controller method using Gemini API
export const chatWithGPT = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;

    // Make a request to the Gemini API
    const response = await axios.post(apiEndpoint, {
      model: 'gemini-free-model', // Replace with the appropriate model identifier
      messages: [{ role: 'user', content: message }],
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    // Check if response is valid and has choices
    if (response.data && response.data.choices && response.data.choices.length > 0) {
      // Extract the assistant's response from the API response
      const assistantMessage = response.data.choices[0]?.message?.content;

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
    if (axios.isAxiosError(error) && error.response?.status === 429) {
      res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
    } else if (axios.isAxiosError(error) && error.response?.status === 404) {
      res.status(404).json({ error: 'Model not found or access denied.' });
    } else {
      res.status(500).json({ error: 'Failed to communicate with Gemini' });
    }
  }
};
