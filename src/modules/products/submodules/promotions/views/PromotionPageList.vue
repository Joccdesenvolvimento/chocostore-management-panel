<template>
  <div class="tw-mt-2">
    <div class="promotion-table-header">
      <div>
        <v-tabs v-model="activeTab" class="tab" color="black">
          <v-tab :ripple="false" v-for="(tab, index) in tabs" :key="index">{{
            tab
          }}</v-tab>
        </v-tabs>
      </div>
      <div class="payments">
        <!-- <div>
          <h1 class="payment-value payment-total">
            {{ amountSpentBoostedPromotions }}
          </h1>
          <span>Valor total gasto</span>
        </div> -->
        <!-- <div>
          <h1 class="payment-value payment-monthly"></h1>
          <span>Saldo da mensalidade</span>
        </div> -->
        <!-- <div>
          <h1 class="payment-value payment-missing">- R$ 180,00</h1>
          <span>Valor a ser pago</span>
        </div> -->
        <!-- <v-btn
          depressed
          @click="isBoostedPromotionsModalVisible = true"
          color="primary"
          >Ver extrato completo</v-btn
        > -->
      </div>
    </div>

    <PromotionsList
      :isMobile="isMobile"
      :showActiveOnes="activeTab == 0"
      :search="search"
    />

    <PromotionsBoostedListModal
      @close="isBoostedPromotionsModalVisible = false"
      :isVisible="isBoostedPromotionsModalVisible"
    />
  </div>
</template>

<script>
import PromotionsList from '../components/PromotionsList';

import PromotionsBoostedListModal from '../modals/PromotionsBoostedListModal';

import moment from 'moment';
import differenceInDaysBetweenDates from '../utils/helpers/dates-difference-in-days';
import { currency } from '@/utils/helpers/currency';

import { createNamespacedHelpers } from 'vuex';
const { mapGetters } = createNamespacedHelpers('products');

export default {
  components: {
    PromotionsList,
    PromotionsBoostedListModal,
  },
  props: {
    isMobile: {
        type: Boolean,
        default: false,
    },
    search: {
      type: String,
      default: '',
    },
  },
  computed: {
    ...mapGetters(['amountSpentBoostedPromotions']),
  },
  data() {
    return {
      tabs: ['Ativas', 'Expiradas'],
      activeTab: 0,
      isBoostedPromotionsModalVisible: false,
    };
  },
};
</script>

<style>
.promotion-table-header {
  display: flex;
  justify-content: space-between;
  padding: 0 3rem 0rem 2rem;
  /* margin-bottom: 2.4rem; */
}

@media (max-width: 960px) {
  .promotion-table-header {
    /* margin-bottom: 0.5rem; */
    justify-content: center;
  }
}
.payment-value {
  font-size: 1rem;
}
.payment-value ~ span {
  font-size: 0.8rem;
}
.payments {
  font-weight: normal;
  display: flex;
}

.payments > div {
  margin-right: 4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.payment-total {
  color: #555555;
}
.payment-monthly {
  color: #5acee4;
}
.payment-missing {
  color: #ff6171;
}
</style>
