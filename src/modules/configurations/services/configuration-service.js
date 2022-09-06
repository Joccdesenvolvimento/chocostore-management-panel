import apiClient from '@/utils/api-client';

export default {
  get: id => {
    return apiClient.get('/');
  },
  edit: data => {
    return apiClient.put('/', data);
  },
  editHour: data => {
    return apiClient.put('/hour', data);
  },
  saveDeliveryValue: data => {
    return apiClient.put('/save-delivery-value', data);
  },
  saveSocialMediaValue: data => {
    return apiClient.put('/save-social-media-value', data);
  },
  saveAboutCompanyValue: data => {
    return apiClient.put('/save-about-value', data);
  },
  savePrivacyPolicy: data => {
    return apiClient.put('/save-privacy-policy-value', data);
  },
  savePhotos: data => {
    return apiClient.put('/save-photos', data);
  },
  getPhoto: type => {
    return apiClient.get(`/${type}/get-photo`)
  },
  getAllPaymentMethods: id => {
    return apiClient.get(`/get-all-payment-flags`)
  }
};
