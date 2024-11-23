
import { Request, Response } from "express";
import { validateUserId } from "../../utils/validate-ids";
import { db } from "../../../../database/db-models";
import { ExpressUser } from "../../../../types/express-user.type";

export default async function toggleUserBlock(req: Request, res: Response) {
  const { user_id } = req.params;
  const validatedId = validateUserId(user_id);
  if (!validatedId.valid) {
    res.status(400).json({ message: validatedId.message });
    return;
  }
  const userId = (req.user as ExpressUser).id;

  const block = await db.Block.findOne({ blocker: userId, blockedUser: validatedId.value }).lean();

  if (block) {
    //unblock
    await block.deleteOne();
    res.status(200).json({ blocked: false });
    return;
  }

  await Promise.all([
    db.Block.create({ blocker: userId, blockedUser: validatedId.value }),
    db.Follow.deleteMany({
      $or: [
        { user: userId, follower: validatedId.value },
        { user: validatedId.value, follower: userId }
      ]
    })
  ]);
  res.status(200).json({ blocked: true });
};