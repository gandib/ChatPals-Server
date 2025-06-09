import express, { NextFunction, Request, Response } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { userValidations } from './user.validation';
import { userControllers } from './user.controller';
import auth from '../../middlewares/auth';
import { multerUpload } from '../../config/multer.config';

const router = express.Router();

router.post(
  '/signup',
  multerUpload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  validateRequest(userValidations.createUserValidationSchema),
  userControllers.createUser,
);

router.post(
  '/login',
  validateRequest(userValidations.loginValidationSchema),
  userControllers.loginUser,
);

router.post(
  '/forget-password',
  validateRequest(userValidations.forgetPasswordValidationSchema),
  userControllers.forgetPassword,
);

router.patch(
  '/update-user',
  validateRequest(userValidations.updateUserValidationSchema),
  userControllers.updateUser,
);

router.delete('/delete-user', auth('admin'), userControllers.deleteUser);

router.post(
  '/reset-password',
  validateRequest(userValidations.resetPasswordValidationSchema),
  userControllers.resetPassword,
);

router.get('/all-user', userControllers.getAllUser);
router.get('/all-admin', userControllers.getAllAdmin);
router.get('/:email', userControllers.getUser);
router.get('/user-by-id/:id', userControllers.getUserById);

export const userRoutes = router;
