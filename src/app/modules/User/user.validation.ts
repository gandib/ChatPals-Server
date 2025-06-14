import { z } from 'zod';

const createUserValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required!' }),
    email: z.string({ required_error: 'Email is required!' }),
    password: z.string({ required_error: 'Password is required!' }),
    image: z.string({ required_error: 'Image is required!' }),
  }),
});

const updateUserValidationSchema = z.object({
  body: z
    .object({
      name: z.string().optional(),
      oldPassword: z.string().optional(),
      newPassword: z.string().optional(),
      image: z.string().optional(),
      bio: z.string().optional(),
    })
    .strict(),
});

const loginValidationSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required!' }),
    password: z.string({ required_error: 'Password is required!' }),
  }),
});

const forgetPasswordValidationSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: 'User email is required!',
    }),
  }),
});

const resetPasswordValidationSchema = z.object({
  body: z.object({
    id: z.string({
      required_error: 'User id is required!',
    }),
    newPassword: z.string({
      required_error: 'User password is required!',
    }),
  }),
});

export const userValidations = {
  createUserValidationSchema,
  updateUserValidationSchema,
  loginValidationSchema,
  forgetPasswordValidationSchema,
  resetPasswordValidationSchema,
};
