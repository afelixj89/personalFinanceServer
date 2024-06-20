import express, { Request, Response } from 'express';
import { FinancialRecord } from '../models/FinancialRecord';

const router = express.Router();

router.get("/getAllByUserId/:userId", async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const records = await FinancialRecord.findAll({ where: { userId: userId } });
    if (records.length === 0) {
      return res.status(404).send("No records found for the user.");
    }
    res.status(200).send(records);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const newRecordBody = req.body;
    const newRecord = await FinancialRecord.create(newRecordBody);
    res.status(200).send(newRecord);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const newRecordBody = req.body;
    const [, updatedRecord] = await FinancialRecord.update(newRecordBody, {
      where: { id: id },
      returning: true,
    });
    if (!updatedRecord) return res.status(404).send();
    res.status(200).send(updatedRecord[0]);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const deletedRecord = await FinancialRecord.destroy({ where: { id: id } });
    if (!deletedRecord) return res.status(404).send();
    res.status(200).send(deletedRecord);
  } catch (err) {
    res.status(500).send(err);
  }
});

export default router;
