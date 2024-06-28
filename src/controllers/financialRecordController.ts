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
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
    });

    if (response && response.choices && response.choices.length > 0) {
      const assistantMessage = response.choices[0]?.message?.content;

      res.json({ message: assistantMessage });
    } else {
      res.status(500).json({ error: "Invalid response from OpenAI API" });
    }
  } catch (error) {
    console.error("Error communicating with OpenAI:", error);
    res.status(500).json({ error: "Failed to communicate with OpenAI" });
  }
};
