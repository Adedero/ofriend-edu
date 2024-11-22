import { Document, model, Schema } from "mongoose";

export interface SavedPostModel extends Document {
  user: Schema.Types.ObjectId;
  post: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const savedPostSchema = new Schema<SavedPostModel>({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
    index: true
  },
  post: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Post',
    index: true
  },
}, { timestamps: true });

const SavedPost = model<SavedPostModel>('SavedPost', savedPostSchema);
export default SavedPost;
