import express, { Request, Response } from 'express';
import { FinancialRecord } from '../models/FinancialRecord';
import { chatWithGPT } from './chatController'; // Import the chatWithGPT method

const router = express.Router();

router.get('/getAllByUserId/:userId', async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const records = await FinancialRecord.findAll({ where: { userId } });
    if (records.length === 0) {
      return res.status(404).send('No records found for the user.');
    }
    res.status(200).send(records);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const newRecordBody = req.body;
    const newRecord = await FinancialRecord.create(newRecordBody);
    res.status(200).send(newRecord);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const newRecordBody = req.body;
    const record = await FinancialRecord.update(newRecordBody, {
      where: { id },
      returning: true,
    });
    if (!record[0]) return res.status(404).send();
    res.status(200).send(record[1][0]);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const result = await FinancialRecord.destroy({ where: { id } });
    if (!result) return res.status(404).send();
    res.status(200).send({ message: 'Record deleted successfully' });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post('/chat', chatWithGPT);

export default router;
