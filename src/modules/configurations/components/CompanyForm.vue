<template>
  <div class="content-scroll">
    <v-row justify="center" class="tw-pb-60 md:tw-pb-1" no-gutters>
      <v-col cols="8">
        <v-row class="mt-2">
          <v-col cols="12" class="pb-0">
            <p class="mb-0">Fotos da Empresa</p>
          </v-col>
          <v-col cols="12" xs="12" sm="6" md="6" lg="6" xl="6">
            <InputImage
              :url="photoData.logoUrl"
              :tooltip="{
                title: 'Guia de Logo',
                desc: 'Imagem principal da empresa no App',
              }"
              @changed="handlePhoto"
              inputImageId="logo"
              title="Logo da Empresa"
            />
          </v-col>
          <v-col cols="12" xs="12" sm="6" md="6" lg="6" xl="6">
            <InputImage
              :url="photoData.bannerUrl"
              :tooltip="{
                title: 'Guia de Banner',
                desc: `Imagem que aparece na parte 'Sobre a Empresa' (sugerido: 1280x240)`,
              }"
              @changed="handlePhoto"
              inputImageId="banner"
              title="Banner da Empresa"
            />
          </v-col>
        </v-row>
        <v-row class="mt-2">
          <v-col cols="12" class="pb-0">
            <p class="mb-0">Endereço</p>
          </v-col>
          <v-col md="4" cols="12">
            <InputTextField
              label="CEP"
              @keyup="hasChange = true"
              @change="
                () =>
                  onCompanyChange({
                    zipCode: companyData.zipCode,
                    latitude: null,
                    longitude: null,
                  })
              "
              v-model="companyData.zipCode"
            />
          </v-col>
          <v-col md="8" cols="12">
            <InputTextField
              label="Endereço"
              @keyup="hasChange = true"
              @change="
                () =>
                  onCompanyChange({
                    street: companyData.street,
                    latitude: null,
                    longitude: null,
                  })
              "
              v-model="companyData.street"
            />
          </v-col>
          <v-col md="2" cols="12">
            <InputTextField
              type="number"
              label="Número"
              @keyup="hasChange = true"
              @change="
                () =>
                  onCompanyChange({
                    number: companyData.number,
                    latitude: null,
                    longitude: null,
                  })
              "
              v-model="companyData.number"
            />
          </v-col>
          <v-col md="4" cols="12">
            <InputTextField
              label="Bairro"
              @keyup="hasChange = true"
              @change="
                () =>
                  onCompanyChange({
                    neighborhood: companyData.neighborhood,
                    latitude: null,
                    longitude: null,
                  })
              "
              v-model="companyData.neighborhood"
            />
          </v-col>
          <v-col md="4" cols="12">
            <InputTextField
              label="Cidade"
              @keyup="hasChange = true"
              @change="
                () =>
                  onCompanyChange({
                    city: companyData.city,
                    latitude: null,
                    longitude: null,
                  })
              "
              v-model="companyData.city"
            />
          </v-col>
          <v-col md="2" cols="12">
            <v-select
              v-model="companyData.state"
              label="Estado"
              item-text="abbr"
              item-value="abbr"
              dense
              outlined
              :items="ufList"
            >
            </v-select>
            <!-- <InputTextField
              label="Estado"
              @keyup="hasChange = true"
              @change="
                () =>
                  onCompanyChange({
                    state: companyData.state,
                  })
              "
              v-model="companyData.state"
            /> -->
          </v-col>
        </v-row>
        <v-row class="mt-2">
          <v-col
            cols="12"
            md="3"
            align-self="center"
            class="tw-flex tw-flex-col tw-p-0"
          >
            <v-col cols="12" class="pb-0">
              <p class="mb-0">Telefone</p>
            </v-col>
            <v-col cols="12" align-self="center">
              <InputTextField
                label="Telefone"
                v-mask="'(##) #####-####'"
                @change="
                  () =>
                    onCompanyChange({
                      phone: companyData.phone,
                    })
                "
                @keyup="hasChange = true"
                v-model="companyData.phone"
              />
            </v-col>
          </v-col>
          <v-col
            cols="12"
            md="4"
            align-self="center"
            class="tw-flex tw-flex-col tw-p-0"
          >
            <v-col cols="12" class="pb-0">
              <p class="mb-0">Email para contato</p>
            </v-col>
            <v-col cols="12" align-self="center">
              <InputTextField
                label="Email"
                @change="
                  () =>
                    onCompanyChange({
                      contactEmail: companyData.contactEmail,
                    })
                "
                @keyup="hasChange = true"
                v-model="companyData.contactEmail"
              />
            </v-col>
          </v-col>
          <v-col
            md="2"
            cols="12"
            align-self="center"
            class="tw-flex tw-flex-col tw-p-0"
          >
            <v-col cols="12" class="pb-0">
              <p class="mb-0">Pedido mínimo</p>
            </v-col>
            <v-col cols="12" align-self="center">
              <InputCustom
                input
                v-model="companyData.minOrderValue"
                @keyup="hasChange = true"
                @change="
                  () =>
                    onCompanyChange({
                      minOrderValue: companyData.minOrderValue,
                    })
                "
                :textFieldOptions="{ prefix: 'R$', 'hide-details': true }"
              />
            </v-col>
          </v-col>
          <v-col
            md="3"
            cols="12"
            align-self="center"
            class="tw-flex tw-flex-col tw-p-0"
          >
            <v-col cols="12" class="pb-0">
              <p class="mb-0">Sobre a Empresa</p>
            </v-col>
            <v-col cols="12" align-self="center">
              <ButtonSecondary @click="handleDialog" block x-large
                >Alterar</ButtonSecondary
              >
            </v-col>
          </v-col>
        </v-row>
        <v-row class="mt-2">
          <v-col cols="12" class="pb-0">
            <p class="mb-0">Redes Sociais</p>
          </v-col>
          <v-col md="4" cols="12">
            <InputTextField
              hint="*Apenas Links"
              v-model="socialMediaData.twitter"
              clearable
              clear-icon="mdi-window-close"
              prepend-inner-icon="mdi-twitter"
              label="Twitter"
              @keyup="hasChange = true"
              @change="
                () =>
                  onCompanyChange({
                    twitter: socialMediaData.twitter,
                  })
              "
            />
          </v-col>
          <v-col md="4" cols="12">
            <InputTextField
              hint="*Apenas Links"
              v-model="socialMediaData.instagram"
              clearable
              clear-icon="mdi-window-close"
              prepend-inner-icon="mdi-instagram"
              label="Instagram"
              @keyup="hasChange = true"
              @change="
                () =>
                  onCompanyChange({
                    instagram: socialMediaData.instagram,
                  })
              "
            />
          </v-col>
          <v-col md="4" cols="12">
            <InputTextField
              hint="*Apenas Links"
              v-model="socialMediaData.facebook"
              clearable
              clear-icon="mdi-window-close"
              prepend-inner-icon="mdi-facebook"
              label="Facebook"
              @keyup="hasChange = true"
              @change="
                () =>
                  onCompanyChange({
                    facebook: socialMediaData.facebook,
                  })
              "
            />
          </v-col>
          <v-col md="4" cols="12">
            <InputTextField
              hint="*Apenas Links"
              v-model="socialMediaData.youtube"
              clearable
              clear-icon="mdi-window-close"
              prepend-inner-icon="mdi-youtube"
              label="Youtube"
              @keyup="hasChange = true"
              @change="
                () =>
                  onCompanyChange({
                    youtube: socialMediaData.youtube,
                  })
              "
            />
          </v-col>
          <v-col md="4" cols="12">
            <InputTextField
              hint="*Apenas Links"
              v-model="socialMediaData.whatsapp"
              clearable
              clear-icon="mdi-window-close"
              prepend-inner-icon="mdi-whatsapp"
              label="Whatsapp"
              @keyup="hasChange = true"
              @change="
                () =>
                  onCompanyChange({
                    whatsapp: socialMediaData.whatsapp,
                  })
              "
            />
          </v-col>
          <v-col md="4" cols="12">
            <InputTextField
              hint="*Apenas Links"
              v-model="socialMediaData.messenger"
              clearable
              clear-icon="mdi-window-close"
              prepend-inner-icon="mdi-facebook-messenger"
              label="Messenger"
              @keyup="hasChange = true"
              @change="
                () =>
                  onCompanyChange({
                    messenger: socialMediaData.messenger,
                  })
              "
            />
          </v-col>
        </v-row>
        <v-row class="mt-2" justify="center">
          <v-col cols="4">
            <ButtonPrimary
              :disabled="isButtonSubmitDisabled"
              :loading="isButtonSubmitLoading"
              block
              @click="onSubmit"
              v-if="hasChange"
              >Salvar!</ButtonPrimary
            >
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <AboutForm
      @saveAbout="saveAbout"
      :about="
        this.company.about
          ? this.company.about
          : { title: '', subtitle: '', text: '' }
      "
      v-if="showDialog"
      @close="showDialog = false"
      :showDialog="showDialog"
    />
  </div>
</template>

<script>
import AboutForm from '../forms/AboutForm';
import InputImage from '../../../components/inputs/InputImage';
import ConfigurationService from '../services/configuration-service';
import states from '../../../utils/mixins/states-brazil';

export default {
  components: {
    AboutForm,
    InputImage,
  },
  props: {
    company: Object,
  },
  data() {
    return {
      companyData: {},
      ufList: states,
      socialMediaData: {},
      photoData: { banner: null, bannerUrl: '', logo: null, logoUrl: '' },
      showDialog: false,
      //cities: [],
      isButtonSubmitDisabled: false,
      isButtonSubmitLoading: false,
      hasChange: false,
    };
  },
  async beforeCreate() {
    /*     let response = await CityService.get();
    this.cities = response.data; */
    let response = await ConfigurationService.getPhoto('banner');
    this.photoData.bannerUrl = response.data;
    response = await ConfigurationService.getPhoto('logo');
    this.photoData.logoUrl = response.data;
  },
  watch: {
    company(newCompanyValue) {
      this.companyData = { ...newCompanyValue };
      this.socialMediaData = { ...newCompanyValue.socialMedia };
    },
  },
  methods: {
    handlePhoto({ file, id, url }) {
      console.log(url);
      /* if (url == null)  */ this.photoData[`${id}Url`] = '';
      this.hasChange = true;
      if (file == null) delete this.photoData[id];
      this.photoData[id] = file;
    },

    handleDialog() {
      this.showDialog = true;
    },
    onCompanyChange() {
      this.hasChange = true;
    },
    onSubmit() {
      this.isButtonSubmitLoading = true;
      this.isButtonSubmitDisabled = true;

      const companyData = this.companyData;
      const socialMediaData = this.socialMediaData;

      this.$emit('saveCompany', {
        company: {
          phone: companyData.phone,
          minOrderValue: companyData.minOrderValue,
          zipCode: companyData.zipCode,
          latitude: null,
          longitude: null,
          street: companyData.street,
          number: companyData.number,
          neighborhood: companyData.neighborhood,
          city: companyData.city,
          state: companyData.state,
          contactEmail: companyData.contactEmail,
        },
        photoData: this.photoData,
        companySocialMedia: {
          twitter: socialMediaData.twitter,
          facebook: socialMediaData.facebook,
          instagram: socialMediaData.instagram,
          youtube: socialMediaData.youtube,
          whatsapp: socialMediaData.whatsapp,
          messenger: socialMediaData.messenger,
        },
        callback: () => {
          this.isButtonSubmitLoading = false;
          this.isButtonSubmitDisabled = false;
          this.hasChange = false;
        },
      });
    },
    async saveAbout(value) {
      this.hasChange = true;
      this.$emit('saveAbout', value);
    },
  },
};
</script>

<style scoped>
.v-dialog {
  overflow-y: hidden;
}

.subtitle-2 {
  font-family: 'poppins' !important;
  font-weight: normal;
}
</style>
