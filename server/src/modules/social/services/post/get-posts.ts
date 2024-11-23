import { type Request, Response } from 'express';
import { ExpressUser } from '../../../../types/express-user.type';
import { db } from '../../../../database/db-models';

const LIMIT = 5;
export default async function getPosts (req: Request, res: Response) {
  const skip = parseInt(req.query.skip as string) || 0;
  const limit = parseInt(req.query.limit as string) || LIMIT;
  const userId = (req.user as ExpressUser).id;

  const posts = await db.Post.aggregate([
    { $skip: skip },
    { $limit: limit },
    {
      $lookup: {
        from: 'users', // The 'author' collection
        localField: 'author',
        foreignField: '_id',
        as: 'author'
      }
    },
    {
      $lookup: {
        from: 'posts', // The 'repostedPost' collection
        localField: 'repostedPost',
        foreignField: '_id',
        as: 'repostedPost'
      }
    },
    {
      $lookup: {
        from: 'users', // The 'repostedPost.author' collection
        localField: 'repostedPost.author',
        foreignField: '_id',
        as: 'repostedPost.author'
      }
    },
    {
      $lookup: {
        from: 'likes', // The 'Like' collection
        localField: '_id',
        foreignField: 'post',
        as: 'likes',
        pipeline: [
          { $match: { liker: userId } }
        ]
      }
    },
    {
      $lookup: {
        from: 'follows', // The 'Follow' collection
        localField: 'author',
        foreignField: 'user',
        as: 'follows',
        pipeline: [
          { $match: { follower: userId } }
        ]
      }
    },
    {
      $lookup: {
        from: 'blocks', // The 'Block' collection
        let: { authorId: '$author', postAuthorId: '$author' },
        pipeline: [
          {
            $match: {
              $or: [
                { blocker: userId, blockedUser: { $eq: '$$authorId' } },
                { blockedUser: userId, blocker: { $eq: '$$postAuthorId' } }
              ]
            }
          }
        ],
        as: 'blocks'
      }
    },
    {
      $addFields: {
        isLikedByViewer: { $gt: [{ $size: '$likes' }, 0] },
        isFollowedByViewer: { $gt: [{ $size: '$follows' }, 0] },
        isBlockedByViewer: { $gt: [{ $size: '$blocks' }, 0] }
      }
    },
    {
      $project: {
        author: { id: 1, name: 1, picture: 1 },
        repostedPost: 1,
        isLikedByViewer: 1,
        isFollowedByViewer: 1,
        isBlockedByViewer: 1,
        status: 1,
        id: 1,
        repostCount: 1,
        isVisibleToViewer: { 
          $cond: {
            if: {
              $or: [
                { $eq: ['$status', 'PRIVATE'] },
                { $and: [{ $eq: ['$status', 'FOLLOWERS'] }, { $not: '$isFollowedByViewer' }] },
                '$isBlockedByViewer'
              ]
            },
            then: false,
            else: true
          }
        }
      }
    }
  ]);

  // Filter out non-viewable posts before sending them back
  const viewablePosts = posts.filter(post => post.isVisibleToViewer);

  // Return filtered and transformed posts
  res.status(200).json(viewablePosts);
  return;

  /* const skip = parseInt(req.query.skip as string) || 0;
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
    const postId = post.id.toString();
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
  
  res.status(200).json(viewablePosts); */
}

