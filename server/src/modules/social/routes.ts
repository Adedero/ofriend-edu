import { Router } from 'express';
import SocialController from './controller';

const router = Router();

//Post
router.get('/post', SocialController.getAllPosts);

//Follow
router.get('/follow', SocialController.getFollows);


export default router;