import { Document, model, Schema } from "mongoose";

export interface BlockModel extends Document {
  blocker: Schema.Types.ObjectId;
  blockedUser: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const blockSchema = new Schema<BlockModel>({
  blocker: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
    index: true
  },
  blockedUser: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
    index: true
  },
}, { timestamps: true });

const Block = model<BlockModel>('Block', blockSchema);
export default Block;
