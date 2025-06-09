import { Router } from 'express';
import { userRoutes } from '../modules/User/user.route';
import { messageRoutes } from '../modules/Message/Message.route';
import { paymentRoutes } from '../modules/Payment/payment.route';

const router = Router();
const modulesRoutes = [
  {
    path: '/auth',
    route: userRoutes,
  },
  {
    path: '/message',
    route: messageRoutes,
  },
  {
    path: '/payment',
    route: paymentRoutes,
  },
];

modulesRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
