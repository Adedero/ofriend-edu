import { Request, Response } from "express";
import { validatePostId } from "../../utils/validate-ids";
import { db } from "../../../../database/db-models";
import { ExpressUser } from "../../../../types/express-user.type";

export default async function deletePost (req: Request, res: Response) {
  const validatedPostId = validatePostId(req.params.post_id);
  if (!validatedPostId.valid) {
    res.status(400).json({ message: validatedPostId.value });
    return;
  }
  const userId: string = (req.user as ExpressUser).id;

  const postId = validatedPostId.value;
  const post = await db.Post.findById(postId);
  if (!post) {
    res.status(200).json({ deleted: true });
    return;
  }
  if (userId !== post.author.toString()) {
    res.status(403).json({ message: 'You are not authorized to delete this post' });
    return;
  }

  //Delete post likes
    //delete post comments
    //delete likes of each comment
    //If post is reposting, decrease the repostsCount of the repostedPost 
    //delete post

}