import { type Request, Response} from 'express';
import { ExpressUser } from '../../../../types/express-user.type';
import { db } from '../../../../database/db-models';
import { validateUserId } from '../../utils/validate-ids';
//import mongoose from 'mongoose';

export default async function toggleBlock(req: Request, res: Response) {
  const blockerId = (req.user as ExpressUser).id;

  const { id } = req.params;
  const validatedId = validateUserId(id);
  if (!validatedId.valid) {
    res.status(400).json({ message: validatedId.message });
    return;
  };
  const blockedUserId = validatedId.value;

  const block = await db.Block.findOne({ blocker: blockerId, blockedUser: blockedUserId });

  if (block) {
    await block.deleteOne();
    res.status(200).json({ blocked: false });
    return;
  }
  await db.Block.create({ blocker: blockerId, blockedUser: blockedUserId });
  res.status(200).json({ blocked: true });
}
