import{ Document, model, Schema } from 'mongoose';

// Define the Post interface to enforce typing
export interface PostModel extends Document {
  author: Schema.Types.ObjectId;
  hasText: boolean;
  textContent?: string;
  hasMedia: boolean;
  media?: { url: string; ext: string; type: string }[];
  likesCount: number;
  commentsCount: number;
  repostsCount: number;
  status: 'PUBLIC' | 'PRIVATE' | 'FOLLOWERS';
  isVisibleToViewer: boolean;
  isEdited: boolean;
  isReposting: boolean;
  repostedPost?: Schema.Types.ObjectId;
  mentions: { userId: Schema.Types.ObjectId; mentionText: string }[];
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
  isReposting: { type: Boolean, required: true, default: false },
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

const Post = model<PostModel>('Post', postSchema);

export default Post;
