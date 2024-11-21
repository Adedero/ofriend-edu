import getPosts from "./services/get-posts";
import createPost from "./services/create-post";
import getFollows from "./services/get-follows";
import searchAndGetUsers from "./services/search-and-get-users";


const SocialController = {
  //User
  searchAndGetUsers,

  //Post
  getPosts,
  createPost,

  //Follows
  getFollows
};

export default SocialController;