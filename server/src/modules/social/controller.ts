import getPosts from "./services/post/get-posts";
import createPost from "./services/post/create-post";
import getFollows from "./services/follow/get-follows";
import searchAndGetUsers from "./services/user/search-and-get-users";
import getPostById from "./services/post/get-post-by-id";
import getPostSaveStatus from "./services/post/get-post-save-status";
import toggleFollow from "./services/follow/toggle-follow";
import togglePostSave from "./services/post/toggle-post-save";
import getBlocks from "./services/block/get-blocks";
import toggleBlock from "./services/block/toggle-block";
import deleteBlock from "./services/block/delete-block";
import deletePost from "./services/post/delete-post";


const SocialController = {
  //User
  searchAndGetUsers,

  //Post
  getPosts,
  getPostById,
  createPost,
  deletePost,

  getPostSaveStatus,
  togglePostSave,

  //Follow
  getFollows,
  toggleFollow,

  //Block
  getBlocks,
  toggleBlock,
  deleteBlock
};

export default SocialController;