import { Request, Response } from 'express';
import OpenAI from 'openai';
import { FinancialRecord } from '../models/FinancialRecord';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const chatWithGPT = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;

    // Prepare the request to OpenAI API
    const request = {
      model: "gpt-4",
      messages: [{ role: "user", content: message }] as OpenAI.ChatCompletionMessageParam[], // Type assertion
    };

    // Send the request to OpenAI API
    const response = await openai.chat.completions.create(request);

    const assistantMessage = response.data.choices[0]?.message?.content;

    // Example logic to create a financial record from the assistant message
    if (assistantMessage && assistantMessage.includes('create record')) {
      const record = new FinancialRecord({
        userId: 'exampleUserId',  // Replace with actual user ID or extract from message
        date: new Date(),
        description: 'Sample description',
        amount: 100.0,
        category: 'Sample category',
        paymentMethod: 'Sample payment method',
      });
      await record.save();
      res.json({ message: 'Record created successfully' });
    } else {
      res.json({ message: assistantMessage });
    }
  } catch (error) {
    console.error('Error communicating with OpenAI:', error);
    res.status(500).json({ error: 'Failed to communicate with OpenAI' });
  }
};
