<template>
  <div>
    <v-data-table
      :headers="
        isMobile
          ? promotionsTable.config.Mobile
          : promotionsTable.config.headers
      "
      fixed-header
      :height="isMobile ? '60vh' : '600px'"
      :items="allPromotions"
      :show-select="false"
      :search="search"
      hide-default-footer
      mobile-breakpoint="0"
      :page.sync="tableConstants.page"
      class="table-hover-pointer striped"
      no-data-text="Sem dados"
      no-results-text="Nenhum resultado encontrado"
      :items-per-page="isMobile ? auto : tableConstants.itemsPerPage - 2"
      sort-by="id"
      :sort-desc="true"
      @page-count="tableConstants.pageCount = $event"
      @click:row="onClickRow"
      v-bind="$attrs"
    >
      <template v-slot:item.turbine="{ item }">
        <v-btn
          v-show="!showActiveOnes ? item.boost : true"
          class="hidden-sm-and-down turbine-button"
          block
          :class="{ 'turbine-details': item.boost }"
          color="primary"
          @click.stop="
            () => {
              if (item.boost) {
                handleClickBoostDetails(item);
              } else handleClickBoostPromotion(item);
            }
          "
          depressed
          >{{
            item.boost ? 'Detalhes da turbinação' : 'Turbinar promoção'
          }}</v-btn
        >
        <v-btn
          v-show="!showActiveOnes ? item.boost : true"
          class="hidden-md-and-up"
          depressed
          text
          :class="{ 'turbine-details': item.boost }"
          color="primary"
          @click.stop="
            () => {
              if (item.boost) {
                handleClickBoostDetails(item);
              } else handleClickBoostPromotion(item);
            }
          "
          >{{ item.boost ? 'Detalhes' : 'Turbinar' }}</v-btn
        >
      </template>
      <template v-slot:item.productPrice="{ item }">{{
        item.product ? toCurrency(item.product.price) : null
      }}</template>
      <template v-slot:item.endsAt="{ item }">{{
        item.endsAt ? formatDate(item.endsAt) : 'Sem expiração'
      }}</template>
      <template v-slot:item.promotionalPrice="{ item }">{{
        toCurrency(item.promotionalPrice)
      }}</template>
      <template v-slot:item.duration="{ item }">{{
        getProductDurationDays(item)
      }}</template>
    </v-data-table>
    <AppFooter class="footer-paginate">
      <v-col cols="6">
        <v-pagination
          v-model="tableConstants.page"
          :total-visible="tableConstants.totalVisible"
          :length="tableConstants.pageCount"
          color="primary"
        ></v-pagination>
      </v-col>
    </AppFooter>

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

    <PromotionFormModal
      :isVisible="isFormModalVisible"
      @close="handleClosePromotionFormModal"
      @submit="handlePromotionFormSubmit"
      @deletePromotion="handleDeletePromotion"
      :isDeletingLoaderVisible="loaders.isDeletingLoaderVisible"
      :product="promotion.product"
      :promotionProp="promotion"
      :disabled="true"
    />

    <PromotionBoostFormModal
      @close="isBoostModalVisible = false"
      :isVisible="isBoostModalVisible"
      :product="promotion.product"
      :promotion="promotionToBoost"
    />

    <PromotionBoostDetailsModal
      @close="isBoostDetailsModalVisible = false"
      :isVisible="isBoostDetailsModalVisible"
      :promotion="promotionToDetail"
    />
  </div>
</template>

<script>
import tableConstants from '@/utils/mixins/table-constants';
import promotionsTable from '../utils/mixins/promotions-table';

import PromotionFormModal from '../modals/PromotionFormModal';
import PromotionBoostFormModal from '../modals/PromotionBoostFormModal';
import PromotionBoostDetailsModal from '../modals/PromotionBoostDetailsModal';

import differenceInDaysBetweenDates from '../utils/helpers/dates-difference-in-days';

import { createNamespacedHelpers } from 'vuex';
const { mapGetters, mapActions, mapState } =
  createNamespacedHelpers('products');

import { currency } from '@/utils/helpers/currency';
import formdata from 'form-data';
import moment from 'moment';

moment.locale('pt-br');

export default {
  mixins: [tableConstants, promotionsTable],
  components: {
    PromotionFormModal,
    PromotionBoostFormModal,
    PromotionBoostDetailsModal,
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
    showActiveOnes: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      isBoostedPromotionsModalVisible: false,

      promotionToEdit: {},
      promotionToBoost: {},
      promotionToDetail: {},

      isFormModalVisible: false,
      isBoostModalVisible: false,
      isBoostDetailsModalVisible: false,

      loaders: {
        isDeletingLoaderVisible: false,
      },

      windowWidth: window.innerWidth,

      promotion: {
        product: {},
      },
      snackbar: {
        message: null,
        color: null,
        isVisible: false,
      },
    };
  },
  methods: {
    ...mapActions(['editProduct', 'editPromotion', 'deletePromotion']),

    async handleDeletePromotion(promotion) {
      this.loaders.isDeletingLoaderVisible = true;

      try {
        await this.deletePromotion({ id: promotion.id });

        await this.removePromotionOfProduct(promotion);

        this.isFormModalVisible = false;
        this.showSnackbar('Promoção excluída com sucesso');
      } catch (err) {
        console.log(err.response);
        this.isFormModalVisible = false;
        this.showSnackbar('Erro ao excluir a promoção', 'black');
      }

      this.loaders.isDeletingLoaderVisible = false;
    },

    async savePromotion(promotion) {
      try {
        await this.editPromotion({ promotion });

        this.showSnackbar('Promoção salva com sucesso');
        this.isFormModalVisible = false;
      } catch (error) {
        this.showSnackbar('Erro ao salvar a promoção', 'normal');
        this.isFormModalVisible = false;
      }
    },

    async removePromotionOfProduct(promotion) {
      const formData = new formdata();

      formData.append('id', promotion.productId);
      formData.append('promotionId', null);

      await this.editProduct({ product: formData });
    },

    handleClosePromotionFormModal() {
      this.isFormModalVisible = false;
    },

    handlePromotionFormSubmit(promotion) {
      this.savePromotion(promotion);
    },

    handleClickBoostPromotion(product) {
      if (!this.showActiveOnes) return;

      this.promotionToBoost = { ...product };
      this.isBoostModalVisible = true;
    },

    handleClickBoostDetails(product) {
      if (!this.showActiveOnes) return;

      this.promotionToDetail = { ...product };
      this.isBoostDetailsModalVisible = true;
    },

    onClickRow(promotion) {
      if (!this.showActiveOnes) return;

      this.promotion = { ...promotion };
      this.promotionToEdit = { ...promotion };
      this.isFormModalVisible = true;
    },

    // helpers
    formatDate(date) {
      return moment(date).format('L');
    },
    showSnackbar(message, color = 'primary') {
      this.snackbar.message = message;
      this.snackbar.color = color;
      this.snackbar.isVisible = true;
    },
    toCurrency(value) {
      return value == undefined ? null : currency(value);
    },
    getProductDurationDays(promotion) {
      if (!promotion.endsAt) return 'Sem expiração';

      const days = differenceInDaysBetweenDates(
        promotion.endsAt,
        promotion.createdAt
      );

      if (days) return `${days} dias`;

      return 'Sem expiração';
    },
    getPromotionEndDate(product) {
      return product.promotion.endsAt
        ? moment(product.promotion.endsAt).format('L')
        : 'Sem data final';
    },
    includes(string1, string2) {
      return string1.toLowerCase().includes(string2.toLowerCase());
    },
  },
  computed: {
    ...mapGetters(['activePromotions', 'inactivePromotions']),
    allPromotions() {
      let filteredPromotions = this.inactivePromotions;
      if (this.showActiveOnes) filteredPromotions = this.activePromotions;
      // console.log(filteredPromotions);
      return filteredPromotions;
      // return filteredPromotions.filter(p => this.includes(p.productName, this.search));
    },
  },
};
</script>

<style>
.v-data-table .turbine-button,
.v-data-table .delete-button {
  opacity: 0;
}
.v-data-table .turbine-details {
  opacity: 1 !important;
}

.v-data-table tr:hover .turbine-button,
.v-data-table tr:hover .delete-button {
  opacity: 1;
}
</style>
