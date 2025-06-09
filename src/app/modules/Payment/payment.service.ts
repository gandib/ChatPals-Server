/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import config from '../../config';
import { User } from '../User/user.model';
import AppError from '../../errors/appError';
import httpStatus from 'http-status';
import { join } from 'path';
import { readFileSync } from 'fs';
import { verifyPayment } from './payment.utils';

const initiatePayment = async (paymentData: any) => {
  const user = await User.findById(paymentData.userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }
  try {
    const response = await axios.post(config.payment_url!, {
      store_id: config.store_id,
      signature_key: config.signature_key,
      tran_id: `${paymentData.userId}-${paymentData.transactionId}`,
      success_url: `https://chatpals-server.vercel.app/api/payment/confirmation?transactionId=${paymentData.userId}-${paymentData.transactionId}&status=success&validity=${paymentData.validity}`,
      fail_url: `https://chatpals-server.vercel.app/api/payment/confirmation?status=failed`,
      cancel_url: 'https://chatpals.vercel.app',
      amount: paymentData.amount,
      currency: 'BDT',
      desc: 'Merchant Registration Payment',
      cus_name: user.name,
      cus_email: user.email,
      cus_add1: 'N/A',
      cus_add2: 'N/A',
      cus_city: 'N/A',
      cus_state: 'N/A',
      cus_postcode: 'N/A',
      cus_country: 'N/A',
      cus_phone: 'N/A',
      type: 'json',
    });

    await User.findByIdAndUpdate(
      paymentData.userId,
      {
        transactionId: `${paymentData.userId}-${paymentData.transactionId}`,
      },
      { new: true },
    );

    //console.log(response);
    return response.data;
  } catch (err) {
    throw new Error('Payment initiation failed!');
  }
};

const paymentConfirmation = async (transactionId: string, validity: string) => {
  const verifyResponse = await verifyPayment(transactionId);

  let message = '';
  const trnxId = (transactionId as string)?.split('-')[0];
  if (verifyResponse && verifyResponse.pay_status === 'Successful') {
    await User.findByIdAndUpdate(trnxId, {
      membership: 'premium',
      subscriptionValidity: validity,
    });
    message = 'Successfully Paid!';
  } else {
    message = 'Payment Failed!';
  }

  // const filePath = join(
  //   __dirname,
  //   '../../../../dist/app/modules/Views/confirmation.html',
  // );
  const filePath = join(__dirname, '../../../../public/confirmation.html');
  let template = readFileSync(filePath, 'utf-8');

  template = template.replace('{{message}}', message);

  return template;
};

export const paymentServices = {
  initiatePayment,
  paymentConfirmation,
};
