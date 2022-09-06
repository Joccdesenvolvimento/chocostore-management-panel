<template>
  <div class="text-center">
    <v-dialog persistent v-model="isVisible" width="600">
      <div class="dialog-content">
        <p class="dialog-title mb-0">Turbinar promoção</p>
        <p
          class="dialog-description mb-8"
        >Promoções turbinadas aparecem na tela inicial do aplicativo</p>

        <v-row>
          <v-col cols="12 pb-2">Duração</v-col>
        </v-row>
        <v-row>
          <v-col cols="12 pt-0" md="6">
            <InputQuantityCard
              @input="setBoostValue"
              v-model="boost.durationDays"
              :min="1"
              :max="maxDays"
              text="Dias"
            />
          </v-col>
          <v-col cols="12 pt-0" md="6">
            <div class="small-card">
              <p class="small-text-full">Data de término</p>
              <p class="medium-text">{{boost.endDate}}</p>
            </div>
          </v-col>
        </v-row>

        <!-- <p class="medium-text mt-6">Orçamento total</p>

        <div class="d-flex justify-center my-4">
          <span class="money-sign mr-2">R$</span>
          <input
            type="text"
            v-on:keyup="handleBoostCostChange"
            class="input-quantity-button-text-number"
            v-model="boost.cost"
          />
        </div>

        <v-slider
          v-model="boost.cost"
          @change="handleBoostCostChange"
          step="2"
          :max="maxPrice"
          :min="0"
        /> -->

        <div class="dialog-actions justify-end">
          <div class="d-flex">
            <v-btn color="primary" class="mr-4" text @click="handleCloseModal">Cancelar</v-btn>
            <ButtonPrimary :loading="isSavingBoost" :disabled="isSavingBoost" @click="onSubmitPromotionForm">Turbinar</ButtonPrimary>
          </div>
        </div>
      </div>
    </v-dialog>

    <v-snackbar v-model="snackbar.isVisible" :color="snackbar.color">
      {{ snackbar.message }}
      <v-btn
        :color="snackbar.color == 'primary' ? 'white' : 'red'"
        icon
        @click="snackbar.isVisible = false"
      >
        <v-icon>la la-close</v-icon>
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import moment from 'moment';
import { currency } from '@/utils/helpers/currency';

import '../styles/promotion-form-modal.css';

import { createNamespacedHelpers } from 'vuex';
const { mapGetters, mapActions, mapState } = createNamespacedHelpers(
  'products'
);

import differenceInDaysBetweenDates from '../utils/helpers/dates-difference-in-days';

moment.locale('pt-br');

export default {
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
    promotion: Object,
  },
  data() {
    return {
      boost: {
        cost: 2,
        durationDays: 1,
        endDate: null,
      },
      isSavingBoost: false,
      snackbar: {
        message: null,
        color: null,
        isVisible: false,
      },
    };
  },
  watch: {
    isVisible(isVisible) {
      if (isVisible) {
        console.log('isvisible');
        console.log(this.promotion);
        this.setBoostEndDateByBoostDurationDays();
      }
    },
  },
  computed: {
    maxDays(){
      // alert(this.boost.endDate);
      if(!this.promotion.endsAt) return 60;
      console.log(this.promotion);
      const diff = differenceInDaysBetweenDates(this.promotion.endsAt, moment());
      return Math.ceil(diff);
    },
    maxPrice(){
      if(!this.promotion.endsAt) return 120;
      return this.maxDays * 2;
    }
  },
  methods: {
    ...mapActions(['boostPromotion', 'findBoostHistoric']),
    setBoostEndDateByBoostDurationDays() {
      this.boost.endDate = moment()
        .add(this.boost.durationDays, 'days')
        .format('LL');
    },
    async onSubmitPromotionForm() {

      this.isSavingBoost = true;
      
      const boost = {
        promotionId: this.promotion.id,
        endsAt: moment().add(this.boost.durationDays, 'days').format(),
      };

      try {
        await this.boostPromotion({ boost });
        await this.findBoostHistoric();
        this.$emit('close');
        this.showSnackbar('Promoção turbinada')
      } catch (error) {
        this.$emit('close');
      }

      this.isSavingBoost = false;
    },
    setDurationEndDate() {
      this.boost.endDate = moment()
        .add(this.boost.durationDays, 'days')
        .format('LL');
    },
    handleBoostCostChange() {
      this.boost.durationDays = this.boost.cost / 2;
      this.setDurationEndDate();
    },
    setBoostValue(value) {
      this.boost.durationDays = +value;
      this.setDurationEndDate();
      this.boost.cost = this.boost.durationDays * 2;
    },
    handleCloseModal() {
      this.clearData();
      this.$emit('close');
    },
    clearData() {
      this.boost.cost = 2;
      this.boost.durationDays = 1;
    },

    // helpers
    toCurrency(value) {
      return currency(value);
    },
    showSnackbar(message, color = 'primary') {
      this.snackbar.message = message;
      this.snackbar.color = color;
      this.snackbar.isVisible = true;
    },
  },
};
</script>
