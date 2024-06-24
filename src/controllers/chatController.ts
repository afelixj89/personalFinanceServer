import { Request, Response } from 'express';
import OpenAI from 'openai';
import { FinancialRecord } from '../models/FinancialRecord';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

      // Example logic to create a financial record from the assistant message
      if (assistantMessage && assistantMessage.includes('create record')) {
        const recordData = {
          userId: 'exampleUserId',  // Replace with actual user ID or extract from message
          date: new Date(),
          description: 'Sample description',
          amount: 100.0,
          category: 'Sample category',
          paymentMethod: 'Sample payment method',
        };

        // Create a new FinancialRecord using Sequelize's create method
        const record = await FinancialRecord.create(recordData);

        res.json({ message: 'Record created successfully' });
      } else {
        res.json({ message: assistantMessage });
      }
    } else {
      res.status(500).json({ error: 'Invalid response from OpenAI API' });
    }
  } catch (error) {
    console.error('Error communicating with OpenAI:', error);
    res.status(500).json({ error: 'Failed to communicate with OpenAI' });
  }
};
