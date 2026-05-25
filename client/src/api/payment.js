import api from './axios';

export const createRazorpayOrder = async (amount) => {

  const { data } = await api.post(
    '/payments/create-order',
    { amount }
  );

  return data;
};

export const verifyPayment = async (payload) => {

  const { data } = await api.post(
    '/payments/verify',
    payload
  );

  return data;
};