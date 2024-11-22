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

router.route('/post/save/:post_id')
  .get(SocialController.getPostSaveStatus)
  .post(SocialController.togglePostSave)

//Follow
router.route('/follow/:user_id?')
  .get(SocialController.getFollows) //get followers
  .post(SocialController.toggleFollow) //Follow or unfollow


export default router;