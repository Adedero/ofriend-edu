import type { Request, Response } from 'express';
import { db } from "../../../../database/db-models";
import { ExpressUser } from '../../../../types/express-user.type';

export default async function toggleLike (req: Request, res: Response) {
  const userId = (req.user as ExpressUser).id;

  const { post_id, comment_id } = req.query;
  if (!post_id && !comment_id) {
    res.status(400).json({ message: 'No post or comment ID provided' });
    return;
  }
  if (post_id && comment_id) {
    res.status(400).json({ message: 'Only one of post ID or comment ID is required '});
    return;
  }
  const query: { liker: string; post?: string; comment?: string } = { liker: userId };

  if (post_id) query.post = post_id as string;
  if (comment_id) query.comment = comment_id as string;

  const like = await db.Like.findOne(query);
  if (like) {
    await like.deleteOne();
    res.status(200).json({ liked: false });
    return;
  }
  await db.Like.create(query);
  res.status(200).json({ liked: true });
}