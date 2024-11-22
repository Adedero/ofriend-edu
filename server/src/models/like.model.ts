import { Document, model, Schema } from "mongoose";

export interface LikeModel extends Document {
  liker: Schema.Types.ObjectId;
  post: Schema.Types.ObjectId;
  comment?: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const likeSchema = new Schema<LikeModel>({
  liker: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
    index: true
  },
  post: {
    type: Schema.Types.ObjectId,
    index: true,
    ref: 'Post',
    required: true
  },
  comment: {
    type: Schema.Types.ObjectId,
    index: true,
    ref: 'Comment'
  }
}, { timestamps: true });

const Like = model<LikeModel>('Like', likeSchema);
export default Like;
