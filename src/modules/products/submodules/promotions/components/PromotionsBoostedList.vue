<template>
  <div>
    <h3 class="font-weight-medium">Extrato de promoções turbinadas</h3>
    <div class="d-flex justify-space-between mt-10">
      <div>
        <v-tabs v-model="activeTab" class="tab" color="black">
          <v-tab :ripple="false" v-for="(tab, index) in tabs" :key="index">{{
            tab
          }}</v-tab>
        </v-tabs>
      </div>
      <div class="d-flex text-center">
        <div>
          <h4 class="font-weight-medium">{{ amountSpentBoostedPromotions }}</h4>
          <p class="subtitle-2">Valor total gasto</p>
        </div>
        <!-- <div class="mx-6">
          <h4 class="text-green font-weight-medium">- R$ 180,00</h4>
          <p class="subtitle-2">Saldo da mensalidade</p>
        </div>
        <div>
          <h4 class="text-primary font-weight-medium">- R$ 180,00</h4>
          <p class="subtitle-2">Valor a ser pago</p>
        </div> -->
      </div>
    </div>

    <v-data-table
      :headers="boostedPromotionsTable.config.headers"
      :items="boostedPromotions"
      :show-select="false"
      hide-default-footer
      :page.sync="tableConstants.page"
      class="table-hover-pointer striped mt-8"
      no-data-text="Sem dados"
      no-results-text="Nenhum resultado encontrado"
      :items-per-page="tableConstants.itemsPerPage"
      sort-by="id"
      :sort-desc="true"
      @page-count="tableConstants.pageCount = $event"
    >
      <template v-slot:item.amountSpent="{ item }">{{
        getBoostAmountSpent(item)
      }}</template>
      <template v-slot:item.endsAt="{ item }">{{
        getBoostDurationDaysDisplay(item)
      }}</template>
    </v-data-table>
  </div>
</template>

<script>
import tableConstants from '@/utils/mixins/table-constants';
import promotionsBoostedTable from '../utils/mixins/promotions-boosted-table';

import moment from 'moment';
import differenceInDaysBetweenDates from '../utils/helpers/dates-difference-in-days';
import { currency } from '@/utils/helpers/currency';

import { createNamespacedHelpers, mapActions } from 'vuex';
const { mapGetters } = createNamespacedHelpers('products');

export default {
  mixins: [tableConstants, promotionsBoostedTable],
  props: {
    boostedPromotionsList: {
      type: Array,
    },
  },
  data: () => ({
    tabs: ['Mês atual', 'Mês anterior'],
    activeTab: 0,
  }),
  computed: {
    boostedPromotions() {
      const today = new Date();
      const month =
        this.activeTab == 0 ? today : today.setMonth(today.getMonth() - 1);

      return this.boostedPromotionsList.filter((boost) =>
        moment(boost.createdAt).isSame(month, 'month')
      );
    },
    ...mapGetters(['amountSpentBoostedPromotions']),
  },
  methods: {
    getBoostAmountSpent(boost) {
      const days = this.getBoostDurationDays(boost);

      return currency(days * 2);
    },
    getBoostDurationDays(boost) {
      if (!boost.endsAt) return null;

      const days = differenceInDaysBetweenDates(boost.endsAt, boost.createdAt);

      return days;
    },
    getBoostDurationDaysDisplay(promotion) {
      const days = this.getBoostDurationDays(promotion);

      if (days) return `${days} dias`;

      return 'Sem expiração';
    },
  },
};
</script>

<style>
.text-green {
  color: #5acee4;
}
.text-primary {
  color: #ff6171;
}
</style>
