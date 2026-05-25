import api from './axios';
export const placeOrder      = (data)         => api.post('/orders', data).then((r) => r.data);
export const myOrders        = ()             => api.get('/orders/my').then((r) => r.data);
export const allOrders       = ()             => api.get('/orders').then((r) => r.data);
export const updateOrderStatus = (id, status) => api.put(`/orders/${id}/status`, { status }).then((r) => r.data);
export const deleteOrder     = (id)           => api.delete(`/orders/${id}`).then((r) => r.data);
export const cancelOrder = async (id) => {

  const { data } = await api.patch(
    `/orders/${id}/cancel`
  );

  return data;
};