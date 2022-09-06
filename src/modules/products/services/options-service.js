import api from '@/utils/api-client';

export default {
  delete: ({ id: optionId, variationId }) => {
    return api.delete(`variations/${variationId}/options/${optionId}`);
  },
  create: (option, variationId) => {
    return api.post(`variations/${variationId}/options`, option);
  },
  edit: option => {
    const { variationId, id: optionId } = option;
    return api.put(`variations/${variationId}/options/${optionId}`, option);
  }
};
