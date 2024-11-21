import{ Document, model, Schema } from 'mongoose';

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
  isVisibleToViewer: boolean;
  isEdited: boolean;
  reposting: boolean;
  repostedPost?: Schema.Types.ObjectId;
  mentions: { id: Schema.Types.ObjectId; name: string }[];
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
  media: { type: [Schema.Types.Mixed], default: [] },
  likesCount: { type: Number, required: true, default: 0 },
  commentsCount: { type: Number, required: true, default: 0 },
  repostsCount: { type: Number, required: true, default: 0 },
  status: { type: String, enum: ['PUBLIC', 'PRIVATE', 'FOLLOWERS'], required: true, default: 'PUBLIC', index: true },
  isVisibleToViewer: { type: Boolean, required: true, default: true },
  isEdited: { type: Boolean, required: true, default: false },
  reposting: { type: Boolean, required: true, default: false },
  repostedPost: { type: Schema.Types.ObjectId, ref: 'Post' },
  mentions: { userId: Schema.Types.ObjectId, mentionText: String },
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
    await Post.updateOne(
      { _id: post.repostedPost },
      { $inc: { repostsCount: 1 } }
    );
  }

  if (!post.reposting && post.repostedPost) {
    await Post.updateOne(
      { _id: post.repostedPost },
      { $inc: { repostsCount: -1 } }
    );
  }

  next();
});


postSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
  const post = this as PostModel;

  if (post.reposting && post.repostedPost) {
    await Post.updateOne(
      { _id: post.repostedPost },
      { $inc: { repostsCount: -1 } }
    );
  }
  next();
});


const Post = model<PostModel>('Post', postSchema);

export default Post;
