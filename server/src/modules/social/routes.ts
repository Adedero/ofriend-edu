import path from 'node:path';
import * as fileUpload from 'express-fileupload';
import { Router } from 'express';
import SocialController from './controller';

const router = Router();

router.use(fileUpload.default({
  limits: { fileSize: 100 * 1024 * 1024 },
  useTempFiles: true,
  tempFileDir: path.resolve('temp')
}));

//User
router.get('/user/search', SocialController.searchAndGetUsers);

//Post
router.route('/post')
  .get(SocialController.getPosts)
  .post(SocialController.createPost)

router.route('/post/:post_id')
  .get(SocialController.getPostById)
  .delete(SocialController.deletePost)

router.route('/post/save/:post_id')
  .get(SocialController.getPostSaveStatus)
  .post(SocialController.togglePostSave)


//Post
router.route('/like')
  .get(SocialController.getLikers)
  .post(SocialController.toggleLike)

//Follow
router.route('/follow/:user_id?')
  .get(SocialController.getFollows) //get followers
  .post(SocialController.toggleFollow) //Follow or unfollow

//Block
router.route('/block/:id?')
  .get(SocialController.getBlocks) // /block: get people that have been blocked by req.user
  .post(SocialController.toggleBlock) // /block/user_id block or unblock the user with id: user_id
  .delete(SocialController.deleteBlock) // block/block_id delete a block record using the block_id

export default router;