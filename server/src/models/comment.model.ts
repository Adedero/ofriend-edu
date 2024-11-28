import { Document, model, Schema } from 'mongoose';

// Define the Post interface to enforce typing
export interface CommentModel extends Document {
  author: Schema.Types.ObjectId;
  post: Schema.Types.ObjectId;
  replying: boolean;
  parentComment?: Schema.Types.ObjectId;
  hasText: boolean;
  textContent?: string;
  hasMedia: boolean;
  media?: { url: string; name: string; mimetype: string, height: number, width: number };
  likesCount: number;
  repliesCount: number;
  edited: boolean;
  mentions: { userId: string; name: string }[];
  isLikedByViewer: boolean;
  isViewedByAuthor: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<CommentModel>({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  replying: { type: Boolean, required: true, default: false },
  parentComment: { type: Schema.Types.ObjectId, ref: 'Comment' },
  hasText: { type: Boolean, required: true, default: false },
  textContent: { type: String },
  hasMedia: { type: Boolean, required: true, default: false },
  media: { type: { url: String, name: String,mimetype: String, height: Number, width: Number } },
  likesCount: { type: Number, required: true, default: 0 },
  repliesCount: { type: Number, required: true, default: 0 },
  edited: { type: Boolean, required: true, default: false },
  mentions: [{ userId: String, name: String }],
  isLikedByViewer: { type: Boolean, required: true, default: false },
  isViewedByAuthor: { type: Boolean, required: true, default: false },
}, { timestamps: true }); 

commentSchema.pre('find', function (next) {
  this.sort({ updatedAt: -1 });
  next();
});

const Comment = model<CommentModel>('Comment', commentSchema);

export default Comment;
