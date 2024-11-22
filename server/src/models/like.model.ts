import { Document, model, Schema } from "mongoose";

export interface LikeModel extends Document {
  liker: Schema.Types.ObjectId;
  target: Schema.Types.ObjectId;
  targetType: 'Post' | 'Comment';
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
  targetType: {
    type: String,
    enum: ['Post', 'Comment'],
    required: true,
    index: true,
    default: 'Post'
  },
  target: {
    type: Schema.Types.ObjectId,
    required: true,
    index: true,
    refPath: function() {
      return this.targetType
    }
  }
}, { timestamps: true });

const Like = model<LikeModel>('Like', likeSchema);
export default Like;
