import { type Request, Response } from 'express';
import { ExpressUser } from '../../../../types/express-user.type';
import { db } from '../../../../database/db-models';
import useBucket, { FileData } from '../../../../utils/use-bucket';

interface Post {
  textContent: string;
  status: string;
  hasText: boolean;
  hasMedia: boolean;
  media?: { url: string; name: string; mimetype: string }[];
  mentions?: { id: string; name: string }[];
  reposting?: boolean;
  repostedPost?: string;
}

export default async function createPost(req: Request, res: Response) {
  const user = req.user as ExpressUser;
  const { post } = req.body;
  if (!post) {
    res.status(400).json({ message: 'Post cannot be empty' });
    return;
  };
  const parsedPost: Post = JSON.parse(post);

  let media: FileData[] = [];

  if (req.files) {
    const { error, data } = await (useBucket(req.files, { path: 'POSTS' }).upload());
    if (error) {
      res.status(400).json({ message: error });
    }
    if (data) media = data;
  }

  parsedPost.hasMedia = media.length > 0;
  parsedPost.media = media;

  const newPost = new db.Post({ ...parsedPost, author: user.id });
  await newPost.save();

  res.status(200).json({ postId: newPost._id });
}