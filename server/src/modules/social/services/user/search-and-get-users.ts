import type { Request, Response } from 'express';
import { db } from './../../../../database/db-models';
import { ExpressUser } from '../../../../types/express-user.type';

const LIMIT = 10;
export default async function searchAndGetUsers (req: Request, res: Response) {
  const { value } = req.query;
  const skip = parseInt(req.query.skip as string) || 0;
  const limit = parseInt(req.query.limit as string) || LIMIT;

  const user = req.user as ExpressUser;
  
  const users = await db.User.aggregate([
    {
      $match: {
        _id: { $ne: user.id },
        name: { $regex: value, $options: 'i' }
      }
    },
    {
      $lookup: {
        from: 'blocks',
        let: { userId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $or: [
                  { $and: [{ $eq: ['$blocker', user.id] }, { $eq: ['$blockedUser', '$$userId'] }] },
                  { $and: [{ $eq: ['$blocker', '$$userId'] }, { $eq: ['$blockedUser', user.id] }] }
                ]
              }
            }
          }
        ],
        as: 'blockInfo'
      }
    },
    {
      $match: {
        'blockInfo.0': { $exists: false }
      }
    },
    {
      $skip: Number(skip)
    },
    {
      $limit: Number(limit)
    },
    {
      $project: {
        name: 1,
        picture: 1
      }
    }
  ]);

  res.status(200).json(users.map(user => ({ ...user, id: user._id })));
}