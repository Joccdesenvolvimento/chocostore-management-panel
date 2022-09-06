<template>
  <div class="tw-mt-2">
    <v-data-table
      :headers="
        isMobile
          ? tableProducts.config.headersMobile
          : tableProducts.config.headers
      "
      :items="productsFiltered"
      :search="search"
      :show-select="showSelectMobile"
      hide-default-footer
      :page.sync="tableConstants.page"
      class="table-hover-pointer striped"
      mobile-breakpoint="0"
      item-key="id"
      no-data-text="Sem dados"
      no-results-text="Nenhum resultado encontrado"
      :items-per-page="tableConstants.itemsPerPage"
      sort-by="name"
      :sort-desc="false"
      fixed-header
      :height="isMobile ? '60vh' : '600px'"
      @page-count="tableConstants.pageCount = $event"
      @click:row="handleClickRow"
      @input="emitSelected"
      v-bind="$attrs"
    >
      <template v-slot:item.cashback="{ item }">
        <p>{{ item.cashback > 0 ? `${item.cashback}%` : null }}</p>
      </template>
      <template v-slot:item.price="{ item }">{{
        toCurrency(item.price)
      }}</template>
      <template v-slot:item.data-table-select="{ isSelected, select }">
        <v-simple-checkbox
          color="primary"
          @click.stop
          :value="isSelected"
          @input="select($event)"
        ></v-simple-checkbox>
      </template>
      <template v-slot:item.stock="{ item }">
        <InputNumber
          v-if="item.stock != null"
          v-model.lazy="item.stock"
          label
          color="red"
          isTransparent
          :isArrowsDisabled="
            isFieldLoading && productsOnSaving.indexOf(item.id) > -1
          "
          :allowNegativeNumbers="false"
          style="width: 150px"
          :textFieldOptions="{
            'hide-details': true,
            dense: true,
            loading: isFieldLoading && productsOnSaving.indexOf(item.id) > -1,
            disabled: isFieldLoading && productsOnSaving.indexOf(item.id) > -1,
          }"
          @input="saveProductStock(item)"
        />
        <!-- <InputCustom
          v-if="item.stock != null"
          number
          v-model.lazy="item.stock"
          @input="saveProductStock(item)"
          style="width: 150px"
          label
          color="red"
          isTransparent
          :isArrowsDisabled="
            isFieldLoading && productsOnSaving.indexOf(item.id) > -1
          "
          :textFieldOptions="{
            'hide-details': true,
            dense: true,
            loading: isFieldLoading && productsOnSaving.indexOf(item.id) > -1,
            disabled: isFieldLoading && productsOnSaving.indexOf(item.id) > -1,
          }"
        /> -->
        <v-btn
          v-else
          color="primary"
          @click.stop="saveProductStock({ id: item.id, stock: 1 })"
          depressed
          text
          >Controlar estoque</v-btn
        >
      </template>
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
    <ProductForm
      :product="product"
      @close="showEditProductDialog = false"
      :dialog="showEditProductDialog"
      :dialogTitle="dialogTitle"
    />
  </div>
</template>

<script>
import tableConstants from '@/utils/mixins/table-constants';
import { currency } from '@/utils/helpers/currency';
import tableProducts from '../utils/mixins/table-products';
import ProductForm from '../forms/ProductForm';

import formdata from 'form-data';

import { createNamespacedHelpers } from 'vuex';

const { mapGetters, mapActions } = createNamespacedHelpers('products');

export default {
  mixins: [tableConstants, tableProducts],
  computed: {
    ...mapGetters(['products', 'productsWithoutImage']),
    productsFiltered() {
      if (!this.filter) return this.products;
      const filters = Object.entries(this.filter);

      return this.products.filter((product) => {
        let retorno = true;
        filters.forEach((filter) => {
          if (filter[1] != '-1') {
            if (filter[1] == 'withoutImage') retorno = !product.photo;
            else if (filter[1] == 'withImage') retorno = !!product.photo;
            else if (product[filter[0]] != filter[1]) {
              retorno = false;
            }
          }
        });
        return retorno;
      });
    },
  },
  components: {
    ProductForm,
  },
  data() {
    return {
      showEditProductDialog: false,
      dialogTitle: null,
      product: null,
      productsOnSaving: [],
      isFieldLoading: false,
    };
  },
  props: {
    search: {
      type: String,
      default: '',
    },
    filter: {},
    showSelectMobile: {
      type: Boolean,
      default: false,
    },
    isMobile: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    ...mapActions(['updateProductStock']),
    handleClickRow({ id }) {
      this.dialogTitle = 'Editar produto';

      this.showEditProductDialog = true;
      this.product = { id };
    },
    emitSelected(event) {
      this.$emit('itemsSelected', event);
    },
    async saveProductStock(item) {
      try {
        const { id, stock } = item;
        console.log(item.stock);

        this.isFieldLoading = true;
        this.productsOnSaving.push(id);

        let product = new formdata();

        product.append('id', id);
        product.append('stock', stock > 0 ? stock : '');

        await this.updateProductStock({ product });

        this.productsOnSaving.splice(this.productsOnSaving.indexOf(item.id));
        this.isFieldLoading = false;
      } catch (error) {
        this.productsOnSaving.splice(this.productsOnSaving.indexOf(item.id));
        this.isFieldLoading = false;
      }
    },
    toCurrency(value) {
      return currency(value);
    },
  },
};
</script>
