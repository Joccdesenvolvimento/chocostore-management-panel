<template>
  <div>
    <v-card v-if="!isMobile" class="hidden-sm-and-down" outlined>
      <v-card-title>Pagamento</v-card-title>
      <v-card-text>
        <div class="d-flex flex-column justify-space-between">
          <div>
            <span
              >Forma de pagamento: {{ order.paymentMethodDescription }}</span
            >
          </div>
          <div v-if="order.paymentMethod == '3'">
            <span v-if="order.change">Troco para: {{ order.change }}</span>
            <span v-else>Troco para: Não precisa</span>
          </div>
          <div v-if="order.paymentMethod == '1'">
            <span>Bandeira: {{ order.cardBrand || 'Não identificada' }}</span>
          </div>
          <template v-if="+order.paymentMethod == 1">
            <!-- <div class="px-8"> -->
            <v-alert
              type="success"
              class="text-center badge-payment"
              :icon="false"
              dense
            >
              PAGO PELO APLICATIVO
            </v-alert>
            <!-- </div> -->
          </template>
        </div>
      </v-card-text>
    </v-card>
    <div v-if="isMobile" class="hidden-md-and-up block">
    <!-- <v-icon class="mr-14"> la-money-bill-wave </v-icon>-->
    <p class="fontTitle">Pagamento</p
    ><!-- <v-icon class="ml-14"> la-money-bill-wave </v-icon>-->
    <div class="fontText">
      <div class="d-flex flex-column justify-space-between">
        <div>
          <span>Forma de pagamento: {{ order.paymentMethodDescription }}</span>
        </div>
        <div v-if="order.paymentMethod == '3'">
          <span v-if="order.change">Troco para: {{ order.change }}</span>
          <span v-else>Troco para: Não precisa</span>
        </div>
        <div v-if="order.paymentMethod == '1'">
          <span>Bandeira: {{ order.cardBrand || 'Não identificada' }}</span>
        </div>
        <template v-if="+order.paymentMethod == 1">
          <!-- <div class="px-8"> -->
          <v-alert
            type="success"
            class="text-center badge-payment"
            :icon="false"
            dense
          >
            PAGO PELO APLICATIVO
          </v-alert>
          <!-- </div> -->
        </template>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
export default {
  props: {
    order: {},
    isMobile: { default: false },
  },
};
</script>

<style >
.badge-payment {
  font-size: 13px;
  padding: 4px;
  margin-top: 15px !important;
  margin-bottom: 0px !important;
}

.fontText {
  font-size: 1rem;
}

.fontTitle {
  font-size: 1.3rem;
}

.block {
  margin: 0rem 0.5rem;
  padding: 1rem 0rem;
  text-align: center;
  /* box-sizing: border-box;
  border-top: 0.2rem solid #cccccfad;
  border-radius: 2%; */
}
</style>