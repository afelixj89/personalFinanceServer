import { Request, Response } from 'express';
import axios from 'axios';
import { FinancialRecord } from '../models/FinancialRecord';
import rateLimit from 'express-rate-limit';


import 'dotenv/config';


const apiKey = process.env.GEMINI_API_KEY || '';
const apiEndpoint = process.env.GEMINI_API_ENDPOINT || '';


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, 
  message: 'Too many requests from this IP, please try again later.'
});


export const chatWithGPT = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;

    const response = await axios.post(apiEndpoint, {
      model: 'gemini-free-model',
      messages: [{ role: 'user', content: message }],
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });


    if (response.data && response.data.choices && response.data.choices.length > 0) {
     
      const assistantMessage = response.data.choices[0]?.message?.content;

   
      if (assistantMessage && assistantMessage.includes('create record')) {
 
        const recordData: Partial<FinancialRecord> = {
          userId: 'exampleUserId',  
          date: new Date(),
          description: 'Sample description',
          amount: 100.0,
          category: 'Sample category',
          paymentMethod: 'Sample payment method',
        };

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
