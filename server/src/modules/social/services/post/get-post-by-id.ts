import { type Request, Response } from 'express';
import { ExpressUser } from '../../../../types/express-user.type';
import { db } from '../../../../database/db-models';
import { Types } from 'mongoose';
import { validatePostId } from '../../utils/validate-ids';

export default async function getPostById (req: Request, res: Response) {
  const { post_id } = req.params;
  const validatedPostId = validatePostId(post_id);
  if (!validatedPostId.valid) {
    res.status(400).json({ message: validatedPostId.message });
    return;
  }
  const userId = (req.user as ExpressUser).id;

  const query = db.Post.aggregate([
    { $match: { _id: new Types.ObjectId(validatedPostId.value) } },
    {
      $lookup: {
        from: 'users',
        localField: 'author',
        foreignField: '_id',
        as: 'author',
        pipeline: [
          { $project: { name: 1, picture: 1 } }
        ]
      }
    },
    {
      $unwind: {
        path: '$author',
        preserveNullAndEmptyArrays: true 
      }
    },
  
    // Lookup the reposted post if it exists
    {
      $lookup: {
        from: 'posts',
        localField: 'repostedPost',
        foreignField: '_id',
        as: 'repostedPost'
      }
    },
    {
      $unwind: {
        path: '$repostedPost', 
        preserveNullAndEmptyArrays: true
      }
    },
  
    // Lookup the author of the reposted post
    {
      $lookup: {
        from: 'users',
        localField: 'repostedPost.author',
        foreignField: '_id',
        as: 'repostedPost.author',
        pipeline: [
          { $project: { name: 1, picture: 1 } }
        ]
      }
    },{
      $unwind: {
        path: '$repostedPost.author', 
        preserveNullAndEmptyArrays: true
      }
    },

     // Lookup the likes collection to see if the user has liked the post
    {
      $lookup: {
        from: 'likes', // The 'Like' collection
        localField: '_id',
        foreignField: 'post',
        as: 'userLikes',
        pipeline: [
          { $match: {
            $and: [
                { liker: userId },  // Ensure the 'liker' matches the provided userId
                { post: { $eq: '$_id' } }  // Ensure the 'post' matches the current post (_id)
              ]
            } 
          }
        ]
      }
    },
  
    // Lookup the follows collection to see if the user follows the author
    {
      $lookup: {
        from: 'follows',
        let: { authorId: '$author._id', userId: userId },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$user', '$$authorId'] },    // Match the user being followed (the post's author)
                  { $eq: ['$follower', '$$userId'] }    // Ensure the current user is following the author
                ]
              }
            }
          }
        ],
        as: 'userFollows'
      }
    },
  
    // Lookup the blocks collection to check if the user is blocked
    {
      $lookup: {
        from: 'blocks',
        let: { userId: userId, authorId: '$author._id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $or: [
                  { $and: [{ $eq: ['$blocker', '$$userId'] }, { $eq: ['$blockedUser', '$$authorId'] }] }, // Current user is blocker and author is blocked
                  { $and: [{ $eq: ['$blockedUser', '$$userId'] }, { $eq: ['$blocker', '$$authorId'] }] }  // Current user is blocked and author is blocker
                ]
              }
            }
          }
        ],
        as: 'userBlocks'
      }
    },
  
    // Add fields based on the results of the lookup queries
    {
      $addFields: {
        isLikedByViewer: { $gt: [{ $size: '$userLikes' }, 0] },
        viewerFollowsAuthor: { $gt: [{ $size: '$userFollows' }, 0] },
        hasBlockRecord: { $gt: [{ $size: '$userBlocks' }, 0] }
      },
    },
  
    // Optionally, remove unnecessary fields (likes, follows, blocks) from the output
    { $project: { userLikes: 0, userFollows: 0, userBlocks: 0 } }
  ]);

  const post = await query;

  if (!post || post.length === 0) {
    res.status(404).json({ message: 'Post not found. This post may have been deleted.' });
    return;
  }

  const postDetails = post[0];

  if (postDetails.hasBlockRecord || postDetails.status === 'PRIVATE' || 
    (postDetails.status === 'FOLLOWERS' && !postDetails.viewerFollowsAuthor)) {
    res.status(403).json({ message: 'You are not allowed to view this post' });
    return;
  }

  postDetails.isViewedByAuthor = userId === postDetails.author._id.toString();

  res.status(200).json(postDetails);
};