import apiClient from '@/utils/api-client';

const suffixEndpoint = '/users-managemant-panel';

export default {
    getAll: () => apiClient.get(suffixEndpoint),
    create: data => {
        return apiClient.post(`${suffixEndpoint}/`, data);
    },
    delete: data => {
        return apiClient.delete(`${suffixEndpoint}/${data.id}`);
    },
    edit: data => {
        return apiClient.put(`${suffixEndpoint}/${data.id}`, data);
    },

};
