import { type Request, Response } from 'express';
import { ExpressUser } from '../../../types/express-user.type';
import { db } from '../../../database/db-models';

const LIMIT = 5;
export default async function getAllPosts (req: Request, res: Response) {
  const skip = parseInt(req.query.skip as string) || 0;
  const limit = parseInt(req.query.limit as string) || LIMIT;
  const userId = (req.user as ExpressUser).id;

  const posts = await db.Post.find()
    .skip(skip)
    .limit(limit)
    .populate('author', 'id name picture')
    .populate({
      path: 'repostedPost',
      populate: {
        path: 'author',
        select: 'id name picture'
      }
    });

  const postIds = posts.map(post => post.id);
  const authorIds = posts.map(post => post.author);

  const [likes, follows, blocks] = await Promise.all([
    db.Like.find({ liker: userId, targetId: { $in: postIds } }),
    db.Follow.find({ follower: userId, user: { $in: authorIds }}),
    db.Block.find({
      $or: [
        { blocker: userId, blockedUser: { $in: authorIds } },
        { blockedUser: userId, blocker: { $in: authorIds } },
      ],
    })
  ]);

  const likedPostIds = new Set(likes.map(like => like.targetId));
  const followedUserIds = new Set(follows.map(follow => follow.user.toString()));
  const blockedUserIds = new Set(
    blocks.map(block =>
      block.blocker.toString() === userId ? block.blockedUser.toString() : block.blocker.toString()
    )
  );

  // Filter posts that are viewable
  const viewablePosts = posts.filter(post => {
    const postAuthorId = post.author.toString();
    const postId = post._id.toString();
    const isBlocked = blockedUserIds.has(postAuthorId);
    const isFollowed = followedUserIds.has(postAuthorId);

    const isViewable = !(post.status === 'PRIVATE' ||
      (post.status === 'FOLLOWERS' && !isFollowed) ||
      isBlocked);

    if (isViewable) {
      post.isVisibleToViewer = true;
      post.isLikedByViewer = likedPostIds.has(postId);
      post.viewerFollowsAuthor = isFollowed;
      post.isViewedByAuthor = (userId === postAuthorId);
    }

    return isViewable;
  });
  
  res.status(200).json(viewablePosts);
}