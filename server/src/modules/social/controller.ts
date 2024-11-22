import getPosts from "./services/post/get-posts";
import createPost from "./services/post/create-post";
import getFollows from "./services/follow/get-follows";
import searchAndGetUsers from "./services/user/search-and-get-users";
import getPostById from "./services/post/get-post-by-id";
import getPostSaveStatus from "./services/post/get-post-save-status";
import toggleFollow from "./services/follow/toggle-follow";
import togglePostSave from "./services/post/toggle-post-save";


const SocialController = {
  //User
  searchAndGetUsers,

  //Post
  getPosts,
  getPostById,
  createPost,

  getPostSaveStatus,
  togglePostSave,

  //Follows
  getFollows,
  toggleFollow
};

export default SocialController;