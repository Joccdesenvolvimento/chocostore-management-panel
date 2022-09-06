<template>
  <div class="content-scroll">
    <v-row justify="center" class="tw-pb-24 md:tw-pb-1" v-if="company">
      <v-col cols="10" md="8">
        <v-row class="md:tw-my-10 tw-my-2" justify="center">
          <v-col
            class="tw-flex tw-flex-col md:tw-flex-row align-center"
            cols="10"
            md="4"
          >
            <p class="subtitle-2 black--text mr-6 mb-0">Raio de entrega</p>
            <InputCustom
              number
              v-model="companyData.distanceServed"
              :max="30"
              @input="
                () =>
                  onCompanyChange({
                    distanceServed: companyData.distanceServed,
                  })
              "
              :textFieldOptions="{ suffix: 'km', 'hide-details': true }"
            />
          </v-col>
          <v-col cols="10" md="4">
            <InputTextField
              type="number"
              label="Tempo de entrega (em minutos)"
              @change="
                () =>
                  onCompanyChange({
                    deliveryTime: companyData.deliveryTime,
                  })
              "
              v-model="companyData.deliveryTime"
            />
          </v-col>
          <v-col cols="10" md="4" class="d-flex align-center">
            <v-checkbox
              class="mt-0"
              @change="
                () =>
                  onCompanyChange({
                    isPickupableOnPlace: companyData.isPickupableOnPlace,
                  })
              "
              v-model="companyData.isPickupableOnPlace"
              label="Permitir retirada no local"
            ></v-checkbox>
          </v-col>
        </v-row>
        <v-row class="mt-5" justify="center">
          <v-col cols="10" xs="10" md="12">
            <p class="font-weight-medium">Valores de entrega</p>
            <p class="font-weight-light">
              Para frete grátis, deixe o campo de valor em branco.
            </p>
          </v-col>
        </v-row>
        <v-row class="mt-5 hidden-sm-and-down">
          <v-col cols="10" md="2">
            <p class="font-weight-medium">Alcance</p>
          </v-col>
          <v-col cols="10" md="2">
            <p class="font-weight-medium">Valor</p>
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col cols="10" md="12">
            <div
              class="hour-grid tw-mt-4 md:tw-mt-0"
              v-for="(deliveryValue, index) in companyDeliveryValues"
              :key="index"
            >
              <div>
                <p>Até {{ deliveryValue.range }} km</p>
              </div>
              <div>
                <InputCustom
                  input
                  v-model="deliveryValue.value"
                  @keyup="hasChange = true"
                  @change="(e) => onDeliveryValueChange(deliveryValue)"
                  :textFieldOptions="{
                    prefix: 'R$',
                    dense: true,
                    'hide-details': true,
                  }"
                />
              </div>
            </div>
          </v-col>
          <div v-show="isMobile == true && hasChange == true" class="hidden-md-and-up" style="margin-top: 12px; width: 30%">
            <ButtonPrimary
              :disabled="isButtonSubmitDisabled"
              :loading="isButtonSubmitLoading"
              block
              @click="onSubmit"
              >Salvar!</ButtonPrimary
            >
          </div>
        </v-row>

        <!-- <v-row class="mt-2" justify="center">
          <v-col cols="4">
            <ButtonPrimary
              :disabled="isButtonSubmitDisabled"
              :loading="isButtonSubmitLoading"
              block
              v-if="hasChange"
              style="position: absolute; width: 250px; bottom: 45px"
              @click="onSubmit"
              >Salvar</ButtonPrimary
            >
          </v-col>
        </v-row> -->
      </v-col>
    </v-row>

    <div
      class="d-flex justify-center align-center"
      v-if="hasChange"
      style="
        position: absolute;
        z-index: 999;
        bottom: 25px;
        height: 75px;
        width: 100%;
        background: white;
      "
    >
      <div v-show="isMobile == false" style="margin-top: 12px; width: 30%">
        <ButtonPrimary
          :disabled="isButtonSubmitDisabled"
          :loading="isButtonSubmitLoading"
          block
          @click="onSubmit"
          >Salvar!</ButtonPrimary
        >
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  props: {
    company: Object,
    isMobile:{
      type: Boolean,
      default:false
    }
  },
  data() {
    return {
      companyData: {},
      isButtonSubmitDisabled: false,
      isButtonSubmitLoading: false,
      hasChange: false,
    };
  },

  computed: {
    companyDeliveryValues() {
      const deliveryValues = [];
      let kmRange = 0;

      if (!this.companyData.distanceServed) return [];

      do {
        // até 5 km, vai de 1 em 1
        // até 12 km, vai de 3 em 3
        // acima de 12 km, vai de 5 em 5

        if (kmRange == this.companyData.distanceServed) break;

        if (kmRange < 5) {
          kmRange += 1;
        } else if (kmRange < 14) {
          kmRange += 3;
        } else {
          kmRange += 5;
        }

        const deliveryValuePrice = this.companyData.deliveryValues.find(
          (d) => d.range == kmRange
        );

        deliveryValues.push({
          range: kmRange,
          value: deliveryValuePrice ? deliveryValuePrice.value : null,
        });
      } while (kmRange <= +this.companyData.distanceServed);

      return deliveryValues;
    },
  },
  created() {
    this.companyData = this.company;
  },
  watch: {
    company(newCompanyValue) {
      this.companyData = { ...newCompanyValue };
    },
  },
  methods: {
    onDeliveryValueChange(deliveryValue) {
      // this.$emit('saveDeliveryValue', deliveryValue);
    },
    onCompanyChange(data) {
      // this.$emit('saveCompany', data);
      this.hasChange = true;
    },
    onSubmit() {
      this.isButtonSubmitLoading = true;
      this.isButtonSubmitDisabled = true;

      this.companyData.companyDeliveryValues = this.companyDeliveryValues;

      this.$emit('saveCompany', {
        company: {
          id: this.companyData.id,
          companyDeliveryValues: this.companyDeliveryValues,
          distanceServed: this.companyData.distanceServed,
          deliveryTime: this.companyData.deliveryTime,
          isPickupableOnPlace: this.companyData.isPickupableOnPlace,
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

<style scoped>
.content-scroll {
  padding-bottom: 6rem;
}

.hour-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(6, minmax(0, 1fr));
}

.hour-grid div {
  width: 100%;
  margin-top: 0.4rem;
  display: flex;
  align-items: center;
}

@media (max-width: 960px) {
  .hour-grid {
    display: flex;
    gap: 0.3rem;
    flex-direction: column;
  }
  .hour-grid div {
    margin-top: 0.2rem;
  }
}

.hour-field {
  padding-left: 1rem !important;
  padding-top: 0.6rem !important;
  height: 3.2rem !important;
  border-radius: 0.6rem;
  text-align: center;
}

.theme--light.v-text-field--filled > .v-input__control > .v-input__slot {
  border-color: #f8f8f8 !important;
  background: #f8f8f8 !important;
}

.add-hour-button {
  background-color: #f8f8f8;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem !important;
  height: 2rem !important;
  border-radius: 0.2rem;
}

.add-hour-icon {
  font-size: 1.2rem;
  color: black;
}

.subtitle-2 {
  font-family: 'poppins' !important;
  font-weight: normal;
}

p {
  margin-bottom: 0;
}
</style>

<style>
.v-text-field--filled:not(.v-text-field--single-line) input {
  margin-top: 0 !important;
}
</style>
