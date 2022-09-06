<template>
  <div class="text-center">
    <v-dialog persistent v-model="isVisible" width="600">
      <div class="dialog-content">
        <p class="dialog-title mb-0">Detalhes da turbinação</p>
        <!-- <p class="dialog-description mb-8">
          Ao cancelar a turbinação, o saldo dos dias ainda não utilizados será
          retornado.
        </p> -->

        <v-row>
          <v-col cols="12 pb-2">Duração</v-col>
        </v-row>
        <v-row>
          <v-col cols="12 pt-0" md="6">
            <div class="small-card">
              <p class="small-text-full">Dias</p>
              <p class="large-text">{{ boost.durationDays }}</p>
            </div>
          </v-col>
          <v-col cols="12 pt-0" md="6">
            <div class="small-card">
              <p class="small-text-full">Data de término</p>
              <p class="medium-text">{{ boost.endsAt }}</p>
            </div>
          </v-col>
        </v-row>

        <!-- <p class="medium-text mt-6">Orçamento total</p>

        <div class="d-flex justify-center my-4">
          <span class="money-sign mr-2">R$</span>
          <span class="input-quantity-button-text-number">{{
            boost.cost
          }}</span>
        </div> -->

        <div class="dialog-actions">
          <div>
            <v-btn :loading="isCancellingBoost" :disabled="isCancellingBoost" depressed text @click="handleCancelBoost">
              Cancelar turbinação
            </v-btn>
          </div>
          <div class="d-flex">
            <v-btn color="primary" class="mr-4" text @click="handleCloseModal"
              >Voltar</v-btn
            >
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
import moment, { duration } from 'moment';
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
        durationDays: 0,
        cost: 0,
        endsAt: null,
      },
      isCancellingBoost: false,
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

        this.populateBoost();
      }
    },
  },
  methods: {
    ...mapActions(['cancelBoostPromotion', 'findBoostHistoric']),

    populateBoost() {
      let durationDays = differenceInDaysBetweenDates(
        this.promotion.boost.endsAt,
        this.promotion.boost.createdAt
      );

      if(!this.promotion.boost.endsAt) durationDays = '';

      this.boost.durationDays = durationDays;
      this.boost.cost = durationDays * 2;
      this.boost.endsAt = moment(this.promotion.boost.endsAt).format('LL');
      
      if(!this.promotion.boost.endsAt) this.boost.endsAt = 'Sem expiração';
    },

    // TODO: retornar ao saldo os dias não utilizados

    async handleCancelBoost() {
      this.isCancellingBoost = true;
      try {
        await this.cancelBoostPromotion({ boost: this.promotion.boost });
        await this.findBoostHistoric();
        this.$emit('close');
        this.showSnackbar('Turbinação cancelada');
      } catch (error) {
        this.$emit('close');
      }
      this.isCancellingBoost = false;
    },

    handleCloseModal() {
      this.$emit('close');
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