import { type Request, Response} from 'express';
import { db } from '../../../../database/db-models';
import { validateUserId } from '../../utils/validate-ids';
//import mongoose from 'mongoose';

export default async function deleteBlock(req: Request, res: Response) {
  const { id } = req.params;
  const validatedId = validateUserId(id);
  if (!validatedId.valid) {
    res.status(400).json({ message: validatedId.message });
    return;
  };
  const blockId = validatedId.value;

  await db.Block.deleteOne({ _id: blockId });

  res.status(200).json({ blocked: false });
}
