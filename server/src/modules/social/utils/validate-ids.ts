import Validator from '../../../validators/validator';

export function validateUserId (userId: string) {
  const validatedId = new Validator(userId)
    .string()
    .trim()
    .notEmpty({ message: 'User ID is required' })
    .objectId({ message: 'User ID is not valid'})
    .validate();
  return validatedId;
}

export function validatePostId (postId: string) {
  const validatedId = new Validator(postId)
    .string()
    .trim()
    .notEmpty({ message: 'Post ID is required' })
    .objectId({ message: 'Post ID is not valid'})
    .validate();
  return validatedId;
}