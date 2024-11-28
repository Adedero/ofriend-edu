import type { Request, Response } from 'express';
import { db } from "../../../../database/db-models";

const LIMIT = 20;
export default async function getLikers (req: Request, res: Response) {
  const { post_id, comment_id } = req.query;
  const skip = parseInt(req.query.skip as string) || 0;
  const limit = Math.min(parseInt(req.query.limit as string) || LIMIT, LIMIT);

  if (!post_id && !comment_id) {
    res.status(400).json({ message: 'No post or comment ID provided' });
    return;
  }
  if (post_id && comment_id) {
    res.status(400).json({ message: 'Only one of post ID or comment ID is required '});
    return;
  }
  const query: { post?: string; comment?: string } = {};

  if (post_id) query.post = post_id as string;
  if (comment_id) query.comment = comment_id as string;

  const likes = await db.Like.find(query, { liker: 1 })
    .skip(skip)
    .limit(limit)
    .populate('liker', 'name picture')
    .lean()

  const likers = likes.map((like) => like.liker);
  res.status(200).json(likers);
};