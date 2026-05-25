import api from './axios';
export const listPizzas = (params)  => api.get('/pizzas', { params }).then((r) => r.data);
export const getPizza   = (id)      => api.get(`/pizzas/${id}`).then((r) => r.data);
export const createPizza= (data)    => api.post('/pizzas', data).then((r) => r.data);
export const updatePizza= (id, data)=> api.put(`/pizzas/${id}`, data).then((r) => r.data);
export const deletePizza= (id)      => api.delete(`/pizzas/${id}`).then((r) => r.data);