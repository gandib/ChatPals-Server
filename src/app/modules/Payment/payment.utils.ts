import axios from 'axios';
import config from '../../config';

export const verifyPayment = async (tnxId: string) => {
  try {
    const response = await axios.get(config.verify_payment_url!, {
      params: {
        store_id: config.store_id,
        signature_key: config.signature_key,
        type: 'json',
        request_id: tnxId,
      },
    });

    return response.data;
  } catch (err) {
    throw new Error('Payment validation failed!');
  }
};
