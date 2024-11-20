import { type Request, Response} from 'express';
import { ExpressUser } from '../../../types/express-user.type';
import { db } from './../../../database/db-models';
export default async function getFollows(req: Request, res: Response) {
  const userId = (req.user as ExpressUser).id;
  const skip = parseInt(req.query.skip as string, 10) || 0;
  const limit = parseInt(req.query.limit as string, 10) || 10;
  const type = (req.query.type as string) || 'followers,following';

  // Determine which data to retrieve based on the `type` query parameter
  const fetchFollowers = type.includes('followers');
  const fetchFollowing = type.includes('following');

  const queries = [];

  if (fetchFollowers) {
    queries.push(
      db.Follow.find({ user: userId }, { follower: 1 })
        .skip(skip)
        .limit(limit)
        .populate('follower', 'id name picture bio')
        .lean()
    );
  }

  if (fetchFollowing) {
    queries.push(
      db.Follow.find({ follower: userId }, { user: 1 })
        .skip(skip)
        .limit(limit)
        .populate('user', 'id name picture bio')
        .lean()
    );
  }

  const [followers = [], following = []] = await Promise.all(queries);

  res.status(200).json({
    followers: fetchFollowers ? followers.map(record => record.follower) : undefined,
    following: fetchFollowing ? following.map(record => record.user) : undefined,
  });
}