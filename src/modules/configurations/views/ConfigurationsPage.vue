<template>
  <div>
    <ConfigurationPageHeader>
      <v-col>
        <v-col cols="12" class="tw-pt-0">
          <v-slide-group multiple>
            <v-tabs v-model="activeTab" class="pt-1" color="black" @change="activeTab = $event">
              <v-tab :ripple="false">Empresa</v-tab>
              <v-tab :ripple="false">Horários</v-tab>
              <v-tab :ripple="false">Entrega</v-tab>
              <v-tab :ripple="false">Pagamento</v-tab>
              <v-tab :ripple="false">Usuários</v-tab>
              <v-tab :ripple="false">Política de Privacidade</v-tab>
            </v-tabs>
          </v-slide-group>
        </v-col>
        <v-autocomplete class="hidden-md-and-up mb-4 mx-6" label="Status da empresa" v-model="company.status"
          @change="saveCompany({ company })" :items="status" item-text="text" item-value="id" hide-details>
        </v-autocomplete>
      </v-col>
    </ConfigurationPageHeader>
    <CompanyForm @saveAbout="saveAbout" @saveCompany="saveCompany" v-if="company" :company="company"
      v-show="activeTab == 0" />
    <DeliveryHoursForm @error="handleError" v-if="company" :company="company" v-show="activeTab == 1"
      :isMobile="isMobile" />
    <DeliveryValuesForm @saveCompany="saveCompany" @saveDeliveryValue="saveDeliveryValue" @error="handleError"
      v-if="company" :company="company" v-show="activeTab == 2" :isMobile="isMobile" />
    <PaymentForm @saveCompany="saveCompany" v-if="company" :company="company" v-show="activeTab == 3" />

    <UsersPageList :company="company" v-show="activeTab == 4" />

    <PrivacyPolicyForm @savePrivacyPolicy="savePrivacyPolicy"
      :privacyPolicy="company.privacyPolicy ? company.privacyPolicy : {}" v-if="company" v-show="activeTab == 5" />

    <v-snackbar app v-model="isNotifyVisible" :color="notifyColor">
      {{ notifyMessage }}
      <v-btn :color="notifyColor == 'primary' ? 'white' : 'red'" icon @click="isNotifyVisible = false">
        <v-icon>la la-close</v-icon>
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import ConfigurationPageHeader from '../components/ConfigurationPageHeader';

import UsersPageList from './UsersPageList.vue'
import CompanyForm from '../components/CompanyForm';
import DeliveryHoursForm from '../components/DeliveryHoursForm';
import DeliveryValuesForm from '../components/DeliveryValuesForm';
import PaymentForm from '../components/PaymentForm';
import AccountsList from '../components/AccountsList';
import UsersList from '../components/UsersList';
import PrivacyPolicyForm from '../components/PrivacyPolicyForm.vue';

import ConfigurationService from '../services/configuration-service';

import moment from 'moment';

import { createNamespacedHelpers } from 'vuex';

import formdata from 'form-data';

const { mapActions } = createNamespacedHelpers('orders');

export default {
  components: {
    ConfigurationPageHeader,
    CompanyForm,
    UsersPageList,
    DeliveryHoursForm,
    PrivacyPolicyForm,
    DeliveryValuesForm,
    PaymentForm,
    AccountsList,
    UsersList,
  },
  data() {
    return {
      activeTab: 0,
      company: {},
      isNotifyVisible: false,
      notifyColor: '',
      notifyMessage: '',
      status: [
        { text: 'Ativa', id: '3' },
        { text: 'Inativa', id: '2' },
        { text: 'Em breve', id: '1' },
      ],
      windowWidth: window.innerWidth,
      isMobile: false,
      policyText: '',
    };
  },

  async beforeCreate() {
    const response = await ConfigurationService.get();
    const hours = response.data.hours
      ? response.data.hours.map((hour) => ({
        ...hour,
        hour1: hour.hour1 ? this.getFormattedHour(hour.hour1) : null,
        hour2: hour.hour2 ? this.getFormattedHour(hour.hour2) : null,
        hour3: hour.hour3 ? this.getFormattedHour(hour.hour3) : null,
        hour4: hour.hour4 ? this.getFormattedHour(hour.hour4) : null,
      }))
      : [];
    this.company = { ...response.data, hours };
  },
  methods: {
    ...mapActions(['setCompany']),
    getFormattedHour(hour) {
      return moment(`01/01/2001 ${hour}`).format('HH:mm');
    },
    async saveCompany({ company: companyValue, photoData: photoValue, companySocialMedia: socialMediaValue, callback }) {
      let formData = new formdata();
      try {
        const savedCompany = await ConfigurationService.edit(companyValue);

        if (photoValue) {
          if (photoValue.logoUrl == '') {
            if (photoValue.logo) {

              formData.append('logo', photoValue.logo);

            } else {
              formData.append('logo', '');
            }
          }

          if (photoValue.bannerUrl == '') {
            if (photoValue.banner) {

              formData.append('banner', photoValue.banner);

            } else {
              formData.append('banner', '');
            }
          }
        }


        await ConfigurationService.savePhotos(formData)

        await ConfigurationService.saveAboutCompanyValue(this.company.about)

        await ConfigurationService.saveSocialMediaValue(
          socialMediaValue
        )

        this.setCompany({ company: savedCompany.data });
        this.showMessage('Salvo com sucesso');
      } catch (error) {
        console.log(error)
        this.showMessage('Erro ao tentar salvar informações da empresa', 'normal');
      }

      if (callback) callback();
    },
    async saveAbout(aboutValue) {
      this.company.about = aboutValue
    },
    async saveDeliveryValue(deliveryValue) {
      try {
        const savedHour = await ConfigurationService.saveDeliveryValue(
          deliveryValue
        );
        this.showMessage('Salvo com sucesso');
      } catch (error) {
        console.log(error.response);
        this.showMessage('Erro ao tentar salvar valor de entrega', 'normal');
      }
    },
    async savePrivacyPolicy(privacyPolicyValue) {
      try {
        const savedPrivacyPolicy = await ConfigurationService.savePrivacyPolicy(
          privacyPolicyValue
        );
        this.showMessage('Salvo com sucesso');
      } catch (error) {
        console.log(error.response);
        this.showMessage('Erro ao tentar salvar a política de privacidade', 'normal');
      }
    },
    handleError(message) {
      this.showMessage(message, 'normal');
    },
    showMessage(message, color = 'primary') {
      this.notifyMessage = message;
      this.notifyColor = color;
      this.isNotifyVisible = true;
    },
    isMobileTest() {
      this.isMobile = this.windowWidth > 960 ? false : true;
    },
  },
  created() {
    this.isMobileTest();
  },
};
</script>

<style >
/*.v-tabs:not(.v-tabs--vertical):not(.v-tabs--right)
  > .v-slide-group--is-overflowing.v-tabs-bar--is-mobile:not(.v-slide-group--has-affixes)
  .v-slide-group__prev {
  display: none;
}*/
</style>