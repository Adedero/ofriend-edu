import { Request, Response } from "express";
import { ExpressUser } from "../../../../types/express-user.type";
import { db } from "../../../../database/db-models";

const LIMIT = 20;

export default async function getBlocks (req: Request, res: Response) {
  const skip = Math.max(parseInt(req.query.skip as string) || 0, 0);
  let limit = Math.max(parseInt(req.query.limit as string) || LIMIT, 0);
  if (limit > LIMIT) limit = LIMIT;

  const userId = (req.user as ExpressUser).id;
  const blocks = await db.Block.find(
    { blocker: userId }, { blockedUser: 1 }
  )
    .skip(skip)
    .limit(limit)
    .populate('blockedUser', 'name, picture')
    .lean();

  const blockedUsers = blocks.map((block) => {
    const user = block.blockedUser as Record<string, unknown>
    return {
      blockdId: block._id,
      userId: user._id,
      name: user.name,
      picture: user.picture
    }
  });
  res.status(200).json(blockedUsers);
};