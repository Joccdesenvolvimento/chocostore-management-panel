<template>
  <div class="text-center">
    <v-dialog persistent v-model="isVisible" width="600">
      <div class="dialog-content">
        <div
          class="hidden-md-and-up tw-flex tw-flex-row tw-justify-end tw-mb-4"
        >
          <v-btn color="normal" depressed @click="handleCloseModal"
            ><v-icon>la-times</v-icon></v-btn
          >
        </div>
        <div class="tw-text-center md:tw-text-left mb-1">
          <p class="dialog-title" style="margin-bottom: 1rem !important">
            {{ promotion.id || disabled ? 'Visualizar' : 'Criar' }} promoção
          </p>
        </div>

        <v-row>
          <v-col cols="12" md="6" class="tw-flex tw-justify-center">
            <div class="d-flex flex-column justify-center align-center">
              <span class="text-product-normal-price"
                >Preço normal do produto</span
              >
              <div class="d-flex align-center">
                <p class="product-price">{{ toCurrency(product.price) }}</p>
              </div>
            </div>
          </v-col>

          <v-col cols="12" md="6">
            <InputQuantityCard
              text="% de desconto"
              :value="discountPercentage"
              :min="0"
              :max="100"
              :disabled="disabled"
              @input="setPromotionalPriceByDiscountPercentage"
            />
          </v-col>
        </v-row>

        <p class="medium-text mt-6 tw-text-center md:tw-text-left">
          Preço promocional
        </p>

        <v-row class="tw-flex tw-justify-center my-4">
          <span class="money-sign mr-2">R$</span>
          <v-col cols="3">
            <input
              type="number"
              class="input-quantity-button-text-number"
              style="max-width: 150px"
              @input="setDiscountPercentageByPromotionalPrice"
              :disabled="disabled"
              v-model="promotion.promotionalPrice"
            />
          </v-col>
        </v-row>

        <v-slider
          :value="promotion.promotionalPrice"
          @change="
            (newValue) => {
              promotion.promotionalPrice = newValue;
              setDiscountPercentageByPromotionalPrice();
            }
          "
          :max="product.price"
          min="0"
          :disabled="disabled"
        />

        <div class="mb-6 d-flex justify-center" v-if="!disabled">
          <ButtonSecondary
            large
            v-show="!isControllingPromotionDuration"
            @click="toggleisControllingPromotionDuration"
            >Definir duração</ButtonSecondary
          >
        </div>

        <div v-if="isControllingPromotionDuration">
          <v-row>
            <v-col class="tw-text-center md:tw-text-left" cols="12" md="6">
              Duração
              <InputQuantityCard
                :value="promotion.durationInDays"
                @input="handleKeyupDurationDays"
                :min="1"
                :disabled="disabled"
                text="Dias"
              />
            </v-col>
            <v-col cols="12" md="6" v-if="!disabled">
              <p
                class="small-primary-text mb-1 tw-text-right"
                @click="toggleisControllingPromotionDuration"
              >
                Não definir duração
              </p>
              <div class="small-card">
                <p class="small-text-full">Data de término</p>
                <p class="medium-text">{{ formatDate(promotion.endsAt) }}</p>
              </div>
            </v-col>
          </v-row>
        </div>

        <div
          class="
            flex
            tw-flex-col tw-space-y-2
            sm:tw-mt-2
            align-center
            md:tw-flex-row
            dialog-actions
          "
        >
          <div v-if="promotion.promotionalPrice" class="tw-mb-4 md:tw-mb-0">
            <v-btn
              :disabled="isDeletingLoaderVisible"
              :loading="isDeletingLoaderVisible"
              depressed
              text
              @click="handleDeletePromotion"
            >
              <v-icon>la la-trash</v-icon>
              <p class="medium-text">Excluir promoção</p>
            </v-btn>
          </div>
          <div v-else></div>
          <div class="d-flex tw-space-x-3.5 md:tw-space-x-0">
            <v-btn color="primary" class="mr-4" text @click="handleCloseModal"
              ><p class="medium-text">Cancelar</p></v-btn
            >
            <ButtonPrimary v-if="!disabled" @click="onSubmitPromotionForm"
              ><p class="medium-text">
                {{ promotion.id ? 'Salvar' : 'Criar' }}
              </p></ButtonPrimary
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
import moment from 'moment';
import { currency } from '@/utils/helpers/currency';

import '../styles/promotion-form-modal.css';

import differenceInDaysBetweenDates from '../utils/helpers/dates-difference-in-days';

moment.locale('pt-br');

export default {
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
    promotionProp: {
      type: Object,
      default: () => ({
        durationInDays: 1.0,
      }),
    },
    product: {
      type: Object,
      default: () => ({}),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    isDeletingLoaderVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      discountPercentage: 0,
      promotion: {
        ...this.promotionProp,
      },

      isControllingPromotionDuration: false,

      snackbar: {
        message: null,
        color: null,
        isVisible: false,
      },
    };
  },
  watch: {
    promotionProp(newValue) {
      this.promotion = { ...newValue };
    },
    isVisible(isVisible) {
      if (!isVisible) return;

      if (this.promotion.endsAt) {
        this.isControllingPromotionDuration = true;
        this.setPromotionDurationInDays();
      }

      if (this.promotion.id) {
        this.setInitialValues();
      } else {
        this.setDefaultValues();
      }
    },
  },
  methods: {
    setInitialValues() {
      this.setDiscountPercentageByPromotionalPrice();
    },
    setDefaultValues() {
      const defaultDiscountPercentage = 15;
      this.discountPercentage = defaultDiscountPercentage;

      this.setPromotionalPriceByDiscountPercentage();
      this.setPromotionDurationInDays();
    },
    setPromotionDurationInDays() {
      if (!this.promotion.endsAt) {
        this.promotion.durationInDays = 1;
        this.promotion.endsAt = new Date();
      } else {
        this.promotion.durationInDays = differenceInDaysBetweenDates(
          this.promotion.endsAt,
          this.promotion.createdAt
        );
      }
    },
    toggleisControllingPromotionDuration() {
      this.isControllingPromotionDuration =
        !this.isControllingPromotionDuration;
    },
    handleDeletePromotion() {
      this.$emit('deletePromotion', this.promotion);
    },
    onSubmitPromotionForm() {
      if (!this.isControllingPromotionDuration) {
        this.promotion.endsAt = null;
        this.promotion.durationInDays = null;
      } else {
        // this.promotion.promotionalPrice = +((""+this.promotion.promotionalPrice).replace(",", "."));

        this.promotion.endsAt = moment()
          .add(this.promotion.durationInDays, 'days')
          .format();
      }

      this.$emit('submit', { ...this.promotion });
    },
    handleCloseModal() {
      this.$emit('close');
    },
    handleKeyupDurationDays(value) {
      this.promotion = {
        ...this.promotion,
        durationInDays: +value,
      };

      this.setPromotionEndDate();
    },
    setPromotionEndDate() {
      this.promotion.endsAt = moment()
        .add(this.promotion.durationInDays, 'days')
        .format();
    },
    setDiscountPercentageByPromotionalPrice() {
      if (('' + this.promotion.promotionalPrice).includes(',')) {
        this.promotion.promotionalPrice = this.getFixedNumber(
          this.promotion.promotionalPrice.replace(',', '.'),
          2
        );
      }

      const discount = this.getFixedNumber(
        (+this.promotion.promotionalPrice * 100) / this.product.price,
        2
      );

      this.discountPercentage = this.getFixedNumber(100 - discount, 2);
    },
    getFixedNumber(number, decimalsQuantity = 2) {
      if (`${number}`.includes('.') && `${number}`.split('.')[1].length > 2) {
        return parseFloat(number).toFixed(decimalsQuantity);
      } else {
        return parseFloat(number);
      }
    },
    setPromotionalPriceByDiscountPercentage(newDiscountPercentage = null) {
      if (newDiscountPercentage)
        this.discountPercentage = +newDiscountPercentage;

      const result = this.getFixedNumber(
        (this.product.price * this.discountPercentage) / 100,
        2
      );

      this.promotion.promotionalPrice = this.getFixedNumber(
        this.product.price - result,
        2
      );
    },

    decrementDiscountPercentage() {
      this.discountPercentage--;
      if (this.discountPercentage < 0) this.discountPercentage = 0;

      this.setPromotionalPriceByDiscountPercentage();
    },
    incrementDiscountPercentage() {
      this.discountPercentage++;
      if (this.discountPercentage > 100) this.discountPercentage = 100;

      this.setPromotionalPriceByDiscountPercentage();
    },

    // helpers
    toCurrency(value) {
      return currency(value);
    },
    formatDate(date, type = 'LL') {
      return moment(date).format(type);
    },
    showSnackbar(message, color = 'primary') {
      this.snackbar.message = message;
      this.snackbar.color = color;
      this.snackbar.isVisible = true;
    },
  },
};
</script>
