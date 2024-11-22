import { config } from 'dotenv';
import mongoose, { Document, model, Schema } from 'mongoose';
import { db } from '../database/db-models';
import useBucket from '../utils/use-bucket';

config();

// Define the Post interface to enforce typing
export interface PostModel extends Document {
  author: Schema.Types.ObjectId;
  hasText: boolean;
  textContent?: string;
  hasMedia: boolean;
  media?: { url: string; name: string; mimetype: string }[];
  likesCount: number;
  commentsCount: number;
  repostsCount: number;
  status: 'PUBLIC' | 'PRIVATE' | 'FOLLOWERS';
  edited: boolean;
  reposting: boolean;
  repostedPost?: Schema.Types.ObjectId;
  mentions: { userId: string; name: string }[];
  isLikedByViewer: boolean;
  isOpenForComments: boolean;
  isViewedByAuthor: boolean;
  viewerFollowsAuthor: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Define the Post schema
const postSchema = new Schema<PostModel>({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  hasText: { type: Boolean, required: true, default: false },
  textContent: { type: String },
  hasMedia: { type: Boolean, required: true, default: false },
  media: { type: [{ url: String, name: String, mimetype: String }], default: [] },
  likesCount: { type: Number, required: true, default: 0 },
  commentsCount: { type: Number, required: true, default: 0 },
  repostsCount: { type: Number, required: true, default: 0 },
  status: { type: String, enum: ['PUBLIC', 'PRIVATE', 'FOLLOWERS'], required: true, default: 'PUBLIC', index: true },
  edited: { type: Boolean, required: true, default: false },
  reposting: { type: Boolean, required: true, default: false },
  repostedPost: { type: Schema.Types.ObjectId, ref: 'Post' },
  mentions: [{ userId: String, name: String }],
  isLikedByViewer: { type: Boolean, required: true, default: false },
  isOpenForComments: { type: Boolean, required: true, default: true },
  isViewedByAuthor: { type: Boolean, required: true, default: false },
  viewerFollowsAuthor: { type: Boolean, required: true, default: false }
}, { timestamps: true }); 

postSchema.pre('find', function (next) {
  this.sort({ updatedAt: -1 });
  next();
});

// Pre-save hook to handle repost count logic
postSchema.pre('save', async function (next) {
  const post = this as PostModel;
  if (post.reposting && post.repostedPost) {
    try {
      await Post.updateOne(
        { _id: post.repostedPost },
        { $inc: { repostsCount: 1 } }
      );
    } catch (error) {
      return next(error as Error); 
    }
  };

  if (!post.reposting && post.repostedPost) {
    try {
      await Post.updateOne(
        { _id: post.repostedPost },
        { $inc: { repostsCount: -1 } }
      );
      this.repostedPost = undefined;
    } catch (error) {
      return next(error as Error);
    }
  };
  next();
});

postSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
  const post = this as PostModel;

  if (process.env.NODE_ENV === 'production') {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      if (post.media && post.media.length > 0) {
        await (useBucket(post.media, { path: 'POSTS' }).delete())
      }
      if (post.reposting && post.repostedPost) {
        await db.Post.updateOne({ _id: post.repostedPost },{ $inc: { repostsCount: -1 } }, { session });
      }
      await db.Comment.deleteMany({ post: post._id }, { session })
      await db.Like.deleteMany({ post: post._id }, { session });
      await session.commitTransaction();
      session.endSession();
      next();
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      next(error as Error);
    }
    return;
  }

  try {
    const query: unknown[] = [
      db.Comment.deleteMany({ post: post._id }),
      db.Like.deleteMany({ post: post._id }),
    ]
    if (post.reposting && post.repostedPost) {
      query.push( db.Post.updateOne({ _id: post.repostedPost },{ $inc: { repostsCount: -1 } }) );
    }
    if (post.media && post.media.length > 0) {
      query.push( (useBucket(post.media, { path: 'POSTS' }).delete()) )
    }
    await Promise.all(query);
  } catch (error) {
    next(error as Error);
  }
  next();
});


const Post = model<PostModel>('Post', postSchema);

export default Post;
