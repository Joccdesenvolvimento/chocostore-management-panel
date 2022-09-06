<template>
  <div>
    <v-card v-if="!isMobile" class="hidden-sm-and-down" outlined>
      <v-card-title>
        <span>Produtos</span>
        <v-spacer></v-spacer>

        <small v-if="order.deliveryMethod == '1'" class="mr-5"
          >Taxa de entrega: {{ toCurrency(order.deliveryTax) }}
        </small>
        <small v-if="order.totalCashback > 0" class="mr-5"
          >Cashback: {{ toCurrency(order.totalCashback) }}
        </small>
        <span class="blue--text text--accent-3"
          >Valor total: {{ order.amount }}</span
        >
      </v-card-title>
      <v-card-text class="pa-0">
        <v-data-table
          :headers="tableOrderProducts.headers"
          :items="products"
          :single-expand="false"
          :expanded.sync="expanded"
          hide-default-footer
          :items-per-page="-1"
          item-key="id"
          :show-expand="true"
          class="table-hover-pointer striped products-table"
          no-data-text="Nenhum produto selecionado"
        >
          <template
            v-slot:item.data-table-expand="{ item, expand, isExpanded }"
          >
            <v-icon
              v-if="item.variations.length > 0"
              @click="expand(!isExpanded)"
              >las la-angle-down</v-icon
            >
          </template>
          <template v-slot:item.productPrice="{ item }">
            <div>
              <span
                v-if="item.originalPrice"
                class="mr-5"
                style="text-decoration: line-through"
              >
                {{ toCurrency(item.originalPrice) }}
                <br />
              </span>
              <span style="word-break: break-all">
                {{ toCurrency(item.price) }}
              </span>
            </div>
          </template>
          <template v-slot:item.totalCashback="{ item }">
            <div>
              <span style="word-break: break-all">
                {{ toCurrency(item.totalCashback) }}
              </span>
            </div>
          </template>
          <template v-slot:item.additionalValues="{ item }">
            <div>
              <span>
                {{ toCurrency(item.additionalValuesAmount) }}
              </span>
            </div>
          </template>
          <template v-slot:item.amount="{ item }">
            <div>
              <span class="font-weight-bold">
                {{ item.amount }}
              </span>
            </div>
          </template>
          <template v-slot:expanded-item="{ headers, item }">
            <td colspan="1" v-if="item.variations.length > 0"></td>
            <td :colspan="headers.length - 1" v-if="item.variations.length > 0">
              <v-row v-for="variation of item.variations" :key="variation.id">
                <v-col cols="10">
                  <p class="font-weight-medium mb-0">
                    {{ variation.variationInternalName }}
                  </p>
                  <div
                    cols="12"
                    class="option-details mb-2"
                    v-for="option of variation.options"
                    :key="option.id"
                  >
                    <div class="option-quantiy">
                      {{ option.optionQuantity }}x
                    </div>
                    <p class="mb-0">{{ option.optionName }}</p>
                    <p class="mb-0 option-value" v-if="option.optionValue">
                      {{
                        toCurrency(option.optionValue * option.optionQuantity)
                      }}
                    </p>
                  </div>
                </v-col>
              </v-row>
            </td>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <div v-if="isMobile" class="hidden-md-and-up block">
      <v-row>
        <!-- <v-icon class="mr-14">la-dropbox </v-icon>-->
        <span class="fontTitle">Produtos</span>
        <!-- <v-icon class="ml-14">la-dropbox </v-icon>-->
        <v-spacer></v-spacer>

        <small v-if="order.deliveryMethod == '1'" class="fontText"
          >Taxa de entrega: {{ toCurrency(order.deliveryTax) }}
        </small>
        <v-spacer></v-spacer>
        <span class="fontText blue--text text--accent-3"
          >Valor total: {{ order.amount }}</span
        >
      </v-row>
      <div class="fontText pa-0">
        <v-data-table
          :headers="tableOrderProducts.Mobile"
          :items="products"
          :single-expand="false"
          :expanded.sync="expanded"
          hide-default-footer
          mobile-breakpoint="0"
          :items-per-page="-1"
          item-key="id"
          :show-expand="true"
          class="table-hover-pointer striped products-table"
        >
          <template
            v-slot:item.data-table-expand="{ item, expand, isExpanded }"
          >
            <v-icon
              v-if="item.variations.length > 0"
              @click="expand(!isExpanded)"
              >las la-angle-down</v-icon
            >
          </template>
          <template v-slot:item.productPrice="{ item }">
            <div>
              <span
                v-if="item.originalPrice"
                style="text-decoration: line-through"
              >
                {{ toCurrency(item.originalPrice) }}
                <br />
              </span>
              <span style="word-break: break-all">
                {{ toCurrency(item.price) }}
              </span>
            </div>
          </template>
          <template v-slot:item.additionalValues="{ item }">
            <div>
              <span>
                {{ toCurrency(item.additionalValuesAmount) }}
              </span>
            </div>
          </template>
          <template v-slot:item.amount="{ item }">
            <div>
              <span class="font-weight-bold">
                {{ item.amount }}
              </span>
            </div>
          </template>
          <template v-slot:expanded-item="{ headers, item }">
            <td colspan="1" v-if="item.variations.length > 0"></td>
            <td :colspan="headers.length - 1" v-if="item.variations.length > 0">
              <v-row v-for="variation of item.variations" :key="variation.id">
                <v-col cols="12">
                  <p class="font-weight-medium mt-5 tw-justify-end">
                    {{ variation.variationInternalName }}
                  </p>
                  <div
                    class="option-details tw-justify-center"
                    v-for="option of variation.options"
                    :key="option.id"
                  >
                    <div class="mb-5 option-quantiy">
                      {{ option.optionQuantity }}x
                    </div>
                    <p class="mb-5">{{ option.optionName }}</p>
                    <p class="mb-5 option-value" v-if="option.optionValue">
                      {{
                        toCurrency(option.optionValue * option.optionQuantity)
                      }}
                    </p>
                  </div>
                </v-col>
              </v-row>
            </td>
          </template>
        </v-data-table>
      </div>
    </div>
  </div>
</template>

<script>
// import tableConstants from '@/utils/mixins/table-constants';
import tableOrderProductList from '../utils/mixins/table/order-products-config';

import { currency } from '@/utils/helpers/currency';

export default {
  props: {
    order: {},
    isMobile: { default: false },
  },
  data: () => ({
    expanded: [],
  }),
  methods: {
    toCurrency(value) {
      return currency(value);
    },
    handleExpand(item) {
      console.log(item);
    },
    getVariationsTotalPrice(variations) {
      if (!variations) return 0;

      const total = variations.reduce(
        (acum, variation) =>
          acum + +this.getOptionsTotalPrice(variation.options),
        0
      );

      return total;
    },
    getOptionsTotalPrice(options) {
      if (!options) return 0;

      return options.reduce(
        (acum, option) => acum + option.optionValue * option.optionQuantity,
        0
      );
    },
  },
  watch: {
    order(newOrder) {
      this.expanded = newOrder.orderProducts.filter(
        (product) => product.variations.length > 0
      );
    },
  },
  computed: {
    products() {
      return this.order.orderProducts.map((product) => {
        const additionalValuesAmount = this.getVariationsTotalPrice(
          product.variations
        );

        return {
          ...product,
          additionalValuesAmount: additionalValuesAmount,
          amount: currency(
            product.quantity * (product.price + additionalValuesAmount)
          ),
        };
      });
    },
  },
  mixins: [tableOrderProductList],
};
</script>

<style>
.v-data-table tbody tr.v-data-table__expanded__content {
  box-shadow: 0 !important;
  box-shadow: none !important;
}
.option-details {
  display: flex;
  align-items: center;
}
.option-value {
  margin-left: 20px;
}
.expand-icon-active {
  transform: rotate(180deg);
}
.products-table {
  overflow-x: hidden;
}

.option-quantiy {
  /* background-color: #d1d1d1; */
  padding-top: 2px;
  padding-bottom: 2px;
  min-width: 20px;
  text-align: center;
  border-radius: 4px;
  margin-right: 6px;
}

.v-data-table tbody tr.v-data-table__expanded__content {
  box-shadow: 0 !important;
  box-shadow: none !important;
}
.option-details {
  display: flex;
  align-items: center;
}
.option-value {
  margin-left: 20px;
}
.expand-icon-active {
  transform: rotate(180deg);
}
.products-table {
  overflow-x: hidden;
}

.option-quantiy {
  /* background-color: #d1d1d1; */
  padding-top: 2px;
  padding-bottom: 2px;
  min-width: 20px;
  text-align: center;
  border-radius: 4px;
  margin-right: 6px;
}
</style>

