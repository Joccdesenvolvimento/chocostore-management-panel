<template>
  <div id="order-print">
    <div class="order-details">
      <p class="print-item-title">Cupom não fiscal</p>
      <p class="print-item-title">Pedido nº {{ order.id }}</p>
      <p class="print-item-title">Cliente</p>
      <p class="print-item-text">
        <span>{{ order.user ? order.user.name : '' }}</span>
      </p>
      <p class="print-item-title">ENTREGA</p>
      <p class="print-item-text">
        {{ order.deliveryMethod == '1' ? order.address : 'Retirada no local' }}
      </p>
      <p class="print-item-title">OBSERVAÇÃO</p>
      <p class="print-item-text">{{ order.notes }}</p>
      <p class="print-item-title">PRODUTOS</p>

      <div class="products">
        <p class="product">Código</p>
        <p class="product ml-2 flex-3">Nome</p>
        <p class="product">Qtde.</p>
        <p class="product">Obs.</p>
        <p class="product">Vlr. Total</p>
      </div>
      <div v-for="product in order.orderProducts" :key="product.id">
        <div class="products mt-8">
          <p class="product barcode-text">{{ product.barCode }}</p>
          <p class="product product-name">{{ product.name.toUpperCase() }}</p>
          <p class="product">{{ product.quantity }}</p>
          <p class="product">{{ product.notes }}</p>
          <p class="product">
            {{
              toCurrency(
                (product.price +
                  getVariationsTotalPrice(product.variations)) * product.quantity
              )
            }}
          </p>
        </div>

        <div v-for="variation in product.variations" :key="variation.id">
          <div v-for="option in variation.options" :key="option.id">
            <div class="products">
              <p class="product"></p>
              <p class="product variation-name">
                {{ option.optionQuantity }}x {{ option.optionName }}
              </p>
              <p class="product"></p>
              <p class="product"></p>
              <p class="product"></p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <p class="order-payment-title">Total</p>
        <div class="order-payment-item">
          <p>Sub-total</p>
          <p>{{ productsAmount }}</p>
        </div>
        <div class="order-payment-item">
          <p>Frete</p>
          <p>{{ deliveryTax }}</p>
        </div>
        <div class="order-payment-item">
          <p>Total</p>
          <p class="font-bold">{{ order.amount }}</p>
        </div>
      </div>
      <div>
        <p class="order-payment-title">Pagamentos</p>
        <div class="order-payment-item">
          <p>Tipo pagamento</p>
          <p>{{ order.paymentMethodDescription }}</p>
        </div>
        <div class="order-payment-item" v-if="order.paymentMethod == '3'">
          <p>Troco para</p>
          <p>{{ order.change || 'Não precisa' }}</p>
        </div>
      </div>

      <div v-if="+order.paymentMethod == 1" class="payment-on-app-item">
        <p class="payment-on-app-text">Pago no aplicativo</p>
      </div>
    </div>
  </div>
</template>

<script>
import { currency } from '@/utils/helpers/currency';

export default {
  props: {
    order: {},
    print: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
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
    toCurrency(value) {
      return currency(value);
    },
  },
  computed: {
    productsAmount() {
      const amountProducs = this.order.orderProducts.reduce(
        (amount, product) =>
          ((+product.price + this.getVariationsTotalPrice(product.variations)) *
          product.quantity) +
          amount,
        0
      );
      return currency(amountProducs);
    },
    deliveryTax() {
      return currency(this.order.deliveryTax);
    },
  },
};
</script>

<style>
#order-print {
  width: 350px;
}

.barcode-text {
  word-break: break-word;
}

.products {
  display: flex;
  justify-content: space-between;
}

.font-bold {
  font-weight: bold;
}

.mt-8 {
  margin-top: 8px;
}

.product {
  grid-column: 1;
  flex: 1;
}

.product-name {
  flex: 3;
  font-weight: bold;
}

.variation-name {
  flex: 3;
}

.flex-2 {
  flex: 2;
}
.flex-3 {
  flex: 3;
}

.b-cupom {
  font-size: 12px;
}

.space-pay,
.space-tot {
  padding-top: 3px !important;
  padding-bottom: 3px;
}

.ttu,
.title-size {
  text-transform: uppercase !important;
}

.title-size {
  font-size: 10px !important;
}

.tr-payment-app {
  background-color: black;
  color: white;
  border-bottom: none;
}
.no-border-bottom th {
  border-bottom: none;
}
.tr-payment-app th {
  border-bottom: none;
}

.printer-ticket {
  display: table !important;
  width: 350px;
  /* max-width: 450px; */
  line-height: 1.3em;
  font-family: Tahoma, Geneva, sans-serif;
  font-size: 11px;
  margin-bottom: 12;
}

.payment-on-app-item {
  background-color: #000;
  padding: 4px 0;
  margin-top: 10px;
  width: 100%;
}

.payment-on-app-text {
  text-align: center;
  color: #fff;
  text-transform: uppercase;
}

.order-details {
  width: 350px;
  line-height: 1.3em;
  font-family: Tahoma, Geneva, sans-serif;
  font-size: 11px;
}

.order-payment-title {
  text-transform: uppercase;
  font-weight: bold;
  margin-top: 14px;
}

.order-payment-item {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}

.print-item-title {
  text-transform: uppercase;
  font-weight: bold;
}

.print-item-title,
.print-item-text {
  border-bottom: 1px dashed #000;
  text-align: center;
  padding: 4px 0;
}

/* th:nth-child(1),
td:nth-child(1) {
  width: 1px;
} */

/* th:nth-child(2),
td:nth-child(2) {
  width: 125px;
} */
/*
th:nth-child(3),
td:nth-child(3) {
  width: 5px;
  text-align: right;
}

th:nth-child(4),
td:nth-child(4) {
  width: 10px;
  text-align: right;
} */

th {
  font-weight: inherit;
  text-align: center;
  width: 100%;
  border-bottom: 1px dashed;
  padding: 5px 0px;
}

@media print {
  @page {
    /* margin: 0px; */
    margin-left: 10px;
    margin-right: 20px;
  }
  body {
    margin-left: 10px;
    margin-right: 20px;
    -webkit-print-color-adjust: exact;
  }

  /* .tr-payment-app {
    background-color: black;
    color: white;
    border-bottom: none;
  }

  .tr-payment-app th{
    background-color: black;
    color: white;
    border-bottom: none;
  }
   */
  #footer {
    display: none;
  }
  #header {
    display: none;
  }
  footer {
    /* width: 100%; */
    border: none;
    padding: 0;
    margin: 0;
  }
}
</style>
