import { Request, Response } from 'express';
import OpenAI from 'openai';
import { FinancialRecord } from '../models/FinancialRecord';
import rateLimit from 'express-rate-limit';


const apiKey = process.env.OPENAI_API_KEY || '';

const openai = new OpenAI({
  apiKey: apiKey,
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: 'Too many requests from this IP, please try again later.'
});


export const chatWithGPT = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: message }],
    });


    if (response && response.choices && response.choices.length > 0) {
 
      const assistantMessage = response.choices[0]?.message?.content;

   
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
      res.status(500).json({ error: 'Invalid response from OpenAI API' });
    }
  } catch (error) {
    console.error('Error communicating with OpenAI:', error);
    if (error instanceof OpenAI.APIError && error.status === 429) {
      res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
    } else if (error instanceof OpenAI.APIError && error.status === 404) {
      res.status(404).json({ error: 'Model not found or access denied.' });
    } else {
      res.status(500).json({ error: 'Failed to communicate with OpenAI' });
    }
  }
};
