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
  mentions?: { userId: string; name: string }[];
  reposting?: boolean;
  repostedPost?: string;
}

interface ExtraFileData {
  name: string;
  width: number;
  height: number;
}

export default async function createPost(req: Request, res: Response) {
  const user = req.user as ExpressUser;
  const { post } = req.body;
  if (!post) {
    res.status(400).json({ message: 'Post cannot be empty' });
    return;
  };
  const parsedPost: Post = JSON.parse(post);

  let media: (FileData & { width: number; height: number })[] = [];

  if (req.files) {
    const fileData : ExtraFileData[] = JSON.parse(req.body.file_data) as ExtraFileData[];

    const { error, data } = await (useBucket(req.files, { path: 'POSTS' }).upload());
    if (error) {
      res.status(400).json({ message: error });
    }
    if (data) {
      media = data.map(file => {
        const file_data = fileData.find(f => f.name === file.originalName);
        return {
          ...file,
          width: file_data?.width ?? 0,
          height: file_data?.height ?? 0
        }
      })
    }
  }

  parsedPost.hasMedia = media.length > 0;
  parsedPost.media = media;

  const newPost = new db.Post({ ...parsedPost, author: user.id });
  await newPost.save();

  res.status(200).json({ postId: newPost._id });
}