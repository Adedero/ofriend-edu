import { Router } from 'express';
import SocialController from './controller';

const router = Router();

//User
router.get('/user/search', SocialController.searchAndGetUsers);

//Post
router.get('/post', SocialController.getAllPosts);

//Follow
router.get('/follow', SocialController.getFollows);


export default router;