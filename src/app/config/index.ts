import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  bcrypt_salt_rounds: process.env.DCRYPT_SALT_ROUNDS,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_access_secret_expire_in: process.env.JWT_ACCESS_EXPIRE_IN as string,
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  store_id: process.env.STORE_ID,
  signature_key: process.env.SIGNATURE_KEY,
  payment_url: process.env.PAYMENT_URL,
  verify_payment_url: process.env.PAYMENT_VERIFY_URL,
  reset_password_ui_link: process.env.RESET_PASSWORD_UI_LINK,
  profile_photo: process.env.PROFILE_PHOTO,
  recipe_photo: process.env.RECIPE_PHOTO,
};
