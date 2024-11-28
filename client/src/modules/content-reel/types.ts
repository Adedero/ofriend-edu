export interface Follows {
  followers: { id: string; name: string; picture?: { url: string; name: string }; bio?: string }[];
  following: { id: string; name: string; picture?: { url: string; name: string }; bio?: string }[];
}

export interface MentionedUser {
  id: string;
  name: string;
  picture?: { url: string, name: string }
}

export interface Post {
  textContent: string;
  status: string;
  hasText: boolean;
  hasMedia: boolean;
  mentions?: { userId: string; name: string}[];
  reposting?: boolean;
  repostedPost?: string;
}

export interface MediaFile {
  file: File;
  data: {
    url: string;
    width: number;
    height: number;
  }
}

export interface FullPost {
  _id: string;
  author: { _id: string; name: string; picture: { url: string; name: string }};
  commentsCount: number;
  edited: boolean;
  hasBlockRecord: boolean;
  hasMedia: boolean;
  hasText: boolean;
  isLikedByViewer: boolean;
  isOpenForComments: boolean;
  isViewedByAuthor: boolean;
  isVisibleToViewer: boolean;
  likesCount: number;
  media?: { _id: string; url: string; name: string; mimetype: string, width: number; height: number }[];
  mentions: { userId: string; name: string }[];
  repostedPost?: FullPost;
  reposting: boolean;
  repostsCount: number;
  status: 'PUBLIC' | 'PRIVATE' | 'FOLLOWERS';
  textContent?: string;
  viewerFollowsAuthor: boolean;

  createdAt: string | Date;
  updatedAt: string | Date;
}

/* 
author: Schema.Types.ObjectId;
  post: Schema.Types.ObjectId;
  replying: boolean;
  parentComment?: Schema.Types.ObjectId;
  hasText: boolean;
  textContent?: string;
  hasMedia: boolean;
  media?: { url: string; name: string; mimetype: string }[];
  likesCount: number;
  repliesCount: number;
  edited: boolean;
  mentions: { userId: string; name: string }[];
  isLikedByViewer: boolean;
  isViewedByAuthor: boolean;
  createdAt: Date;
  updatedAt: Date; */

export interface FullComment {
  _id: string;
  author: { _id: string; name: string; picture: { url: string; name: string }};
  edited: boolean;
  hasBlockRecord: boolean;
  hasMedia: boolean;
  hasText: boolean;
  isLikedByViewer: boolean;
  isOpenForComments: boolean;
  isViewedByAuthor: boolean;
  isVisibleToViewer: boolean;
  likesCount: number;
  media?: { _id: string; url: string; name: string; mimetype: string, width: number; height: number };
  mentions: { userId: string; name: string }[];
  parentComment?: string;
  post: string;
  repliesCount: number;
  replying: boolean;
  textContent?: string;

  createdAt: string | Date;
  updatedAt: string | Date;
}
