import { Request, Response } from "express";
import { validatePostId } from "../../utils/validate-ids";
import { db } from "../../../../database/db-models";
import { ExpressUser } from "../../../../types/express-user.type";

export default async function getPostSaveStatus(req: Request, res: Response) {
  const { post_id } = req.params;
  const validatedPostId = validatePostId(post_id);
  if (!validatedPostId.valid) {
    res.status(400).json({ message: validatedPostId.message });
    return;
  }
  const userId = (req.user as ExpressUser).id;

  const savedPost = await db.SavedPost.findOne({ user: userId, post: validatedPostId.value }).lean();

  const saved = !!savedPost;
  res.status(200).json({ saved });
}