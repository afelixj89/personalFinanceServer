import { Request, Response } from "express";
import OpenAI from "openai";
import { FinancialRecord } from "../models/FinancialRecord";

const apiKey = process.env.OPENAI_API_KEY || "";

const openai = new OpenAI({
  apiKey: apiKey,
});

export const chatWithGPT = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: message }],
    });

    if (response && response.choices && response.choices.length > 0) {
      const assistantMessage = response.choices[0]?.message?.content;

      if (assistantMessage && assistantMessage.includes("create record")) {
        const recordData: Partial<FinancialRecord> = {
          userId: "exampleUserId",
          date: new Date(),
          description: "Sample description",
          amount: 100.0,
          category: "Sample category",
          paymentMethod: "Sample payment method",
        };

        try {
          const record = await FinancialRecord.create(
            recordData as FinancialRecord
          );

          res.json({ message: "Record created successfully" });
        } catch (createError) {
          console.error("Error creating FinancialRecord:", createError);
          res.status(500).json({ error: "Failed to create financial record" });
        }
      } else {
        res.json({ message: assistantMessage });
      }
    } else {
      res.status(500).json({ error: "Invalid response from OpenAI API" });
    }
  } catch (error) {
    console.error("Error communicating with OpenAI:", error);
    res.status(500).json({ error: "Failed to communicate with OpenAI" });
  }
};
