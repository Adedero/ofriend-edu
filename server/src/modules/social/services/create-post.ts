import { type Request, Response } from 'express';
import { ExpressUser } from '../../../types/express-user.type';
import { db } from '../../../database/db-models';

interface Post {
  textContent: string;
  status: string;
  hasText: boolean;
  hasMedia: boolean;
  mentions?: { id: string; name: string }[];
  reposting?: boolean;
  repostedPost?: string;
}

interface RequestWithFiles extends Request {
  files?: Record<string, File>
}
export default async function createPost(req: RequestWithFiles, res: Response) {
  const user = req.user as ExpressUser;
  const post = req.body as string;
  if (!post) {
    res.status(400).json({ message: 'Post cannot be empty' });
    return;
  }
  const parsedPost: Post = JSON.parse(post);
  let media = [];
  if (req.files) {

  }
  
  /* 
  let { post } = req.body;
    if (!post) {
      return res.status(400).json({
        success: false,
        info: 'Failed to create post',
        message: 'Your post cannot be empty.'
      });
    }
    const user = req.user;
    post = JSON.parse(post);
    let media = [];

    try {
      if (req.files) {
        try {
          media = await uploadMultipleFiles(req.files, {
            path: "POSTS"
          });
        } catch (err) {
          console.error('Error uploading files: ', err);
          throw new Error('Error uploading files: ' + err);
        }
      }

      if (media.length) {
        post.hasMedia = true;
        post.media = media;
      } else {
        post.hasMedia = false;
        post.media = [];
      }

      const processedPost = {
        authorId: user.id,
        ...post
      };

      if (processedPost.isReposting && processedPost.repostedPostId) {
        const newPost = await sequelize.transaction(async (t) => {
          const createdPost = await Post.create(processedPost, { transaction: t });
          await Post.increment(
            { repostsCount: 1 },
            { where: { id: processedPost.repostedPostId }, transaction: t }
          )
          return createdPost;
        });

        return res.status(200).json({
          success: true,
          info: 'Post created',
          message: 'Your post has been created successfully.',
          post: newPost
        });
      } else {
        const newPost = await Post.create(processedPost);

        return res.status(200).json({
          success: true,
          info: 'Post created',
          message: 'Your post has been created successfully.',
          post: newPost
        });
      }
    } catch (error) {
      console.error('Error creating post:', error);
      return res.status(500).json({
        success: false,
        info: 'Failed to create post',
        message: 'An error occurred while creating the post.'
      });
    } */
}