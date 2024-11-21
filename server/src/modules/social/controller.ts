import getAllPosts from "./services/getAllPosts";
import getFollows from "./services/getFollows";
import searchAndGetUsers from "./services/search-and-get-users";


const SocialController = {
  //User
  searchAndGetUsers,

  //Post
  getAllPosts,

  //Follows
  getFollows
};

export default SocialController;