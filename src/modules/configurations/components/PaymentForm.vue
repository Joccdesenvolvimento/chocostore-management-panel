<template>
  <div class="content-scroll">
    <v-row justify="center" class="tw-pb-60 md:tw-pb-1" no-gutters>
      <v-col cols="8">
        <v-row class="mt-10">
          <v-col cols="12" class="pb-0">
            <p class="mb-0">Formas de pagamento</p>
          </v-col>
          <v-col cols="12" md="6" class="mt-6">
            <div>
              <v-checkbox
                class="mt-0"
                @change="
                  () =>
                    onCompanyChange({
                      acceptCash: companyData.acceptCash,
                    })
                "
                v-model="companyData.acceptCash"
                label="Dinheiro"
              ></v-checkbox>
              <v-checkbox
                class="mt-0"
                @change="
                  () =>
                    onCompanyChange({
                      acceptCardOnDelivery: companyData.acceptCardOnDelivery,
                    })
                "
                v-model="companyData.acceptCardOnDelivery"
                label="Cartão na entrega"
              ></v-checkbox>
              <v-checkbox
                class="mt-0"
                disabled
                v-model="companyData.acceptCardOnApp"
                label="Cartão no aplicativo (obrigatório)"
              ></v-checkbox>
            </div>
          </v-col>
        </v-row>

        <v-row class="mt-0">
          <v-col cols="12" md="8">
            <p>Tipos de Pagamento</p>
            <v-select
              v-model="companyData.acceptedPayments"
              item-text="name"
              item-value="name"
              label="Bandeiras"
              :items="paymentList"
              :disabled="companyData.acceptCardOnDelivery == false"
              outlined
              dense
              multiple
              no-data-text="Sem Métodos de Pagamento"
            >
              <template v-slot:prepend-item>
                <v-list-item ripple @mousedown.prevent @click="toggle">
                  <v-list-item-action>
                    <v-icon
                      :color="
                        companyData.acceptedPayments.length > 0
                          ? 'indigo darken-4'
                          : ''
                      "
                    >
                      {{ icon }}
                    </v-icon>
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title> Selecionar Todos </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-divider class="mt-2"></v-divider>
              </template>

              <template v-slot:selection="{ item, index }">
                <img
                  v-if="
                    index === 0 ||
                    index === 1 ||
                    index === 2 ||
                    index === 3 ||
                    index === 4 ||
                    index === 5
                  "
                  class="mr-2 d-block"
                  style="width: 60px"
                  :src="item.url"
                />
                <span v-if="index === 6" class="grey--text text-caption">
                  (+{{ companyData.acceptedPayments.length - 6 }} outros)
                </span>
              </template>
            </v-select>
          </v-col>
        </v-row>
        <v-row class="mt-2">
          <v-col cols="12" md="12">
            <p>Cashback</p>
            <v-row no-gutters>
              <v-col cols="12" md="3">
                <InputTextField
                  @change="
                    () =>
                      onCompanyChange({
                        cashbackExpiry: companyData.cashbackExpiry,
                      })
                  "
                  @keyup="hasChange = true"
                  v-model="companyData.cashbackExpiry"
                />
              </v-col>
              <v-col cols="12" md="6" class="ml-2 d-flex align-center">
                <p class="my-auto">
                  Tempo para o cashback expirar (em dias)
                </p></v-col
              >
            </v-row>
          </v-col>
        </v-row>

        <v-row class="mt-2" justify="center">
          <v-col cols="12" md="4">
            <ButtonPrimary
              :disabled="isButtonSubmitDisabled || !hasChange"
              :loading="isButtonSubmitLoading"
              block
              @click="onSubmit"
              >Salvar</ButtonPrimary
            >
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { PAYMENT_METHODS } from '../../orders/utils/enums';
import ConfigurationService from '../services/configuration-service';

export default {
  props: {
    company: Object,
  },
  data() {
    return {
      paymentMethods: PAYMENT_METHODS,
      companyData: {},
      isButtonSubmitDisabled: false,
      isButtonSubmitLoading: false,
      hasChange: false,
      paymentList: [],
      selectedPayments: [],
    };
  },
  computed: {
    hasAllPayments() {
      return (
        this.companyData.acceptedPayments.length === this.paymentList.length
      );
    },
    hasAlmostAllPayments() {
      return (
        this.companyData.acceptedPayments.length > 0 && !this.hasAllPayments
      );
    },

    icon() {
      if (this.hasAllPayments) return 'mdi-close-box-outline';
      if (this.hasAlmostAllPayments) return 'mdi-minus-box-outline';
      return 'mdi-checkbox-blank-outline';
    },
  },
  async created() {
    const response = await ConfigurationService.getAllPaymentMethods();
    this.paymentList = response.data;
  },
  watch: {
    company(newCompanyValue) {
      this.companyData = { ...newCompanyValue };
    },
    'companyData.acceptedPayments'() {
      this.hasChange = true;
    },
  },
  methods: {
    toggle() {
      this.$nextTick(() => {
        if (this.hasAllPayments || this.hasAlmostAllPayments) {
          this.companyData.acceptedPayments = [];
        } else {
          let tempPaymentList = this.paymentList;
          this.companyData.acceptedPayments = tempPaymentList.map((item) => {
            return item.name;
          });
        }
      });
    },
    onCompanyChange(data) {
      this.hasChange = true;
    },

    onSubmit() {
      this.isButtonSubmitLoading = true;
      this.isButtonSubmitDisabled = true;

      const companyData = this.companyData;
      console.log(companyData.cashbackExpiry)
      this.$emit('saveCompany', {
        company: {
          acceptCash: companyData.acceptCash,
          acceptCardOnApp: true,
          acceptCardOnDelivery: companyData.acceptCardOnDelivery,
          acceptedPayments: companyData.acceptedPayments,
          cashbackExpiry: companyData.cashbackExpiry,
        },
        callback: () => {
          this.isButtonSubmitLoading = false;
          this.isButtonSubmitDisabled = false;
          this.hasChange = false;
        },
      });
    },
  },
};
</script>
