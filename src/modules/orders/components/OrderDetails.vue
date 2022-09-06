<template>
  <div>
    <v-row v-if="!isMobile" align="center" justify="center">
      <v-col cols="12" style="padding: 5px !important">
        <div class="hidden-sm-and-down d-grid">
          <OrderClient
            :isMobile="isMobile"
            @openChat="$emit('openChat', true)"
            :order="order"
            class="client-data"
          />
          <OrderPayment
            :isMobile="isMobile"
            :order="order"
            class="payment-data"
          />
          <OrderDelivery
            :isMobile="isMobile"
            :order="order"
            class="delivery-data"
          />

          <OrderNotes :isMobile="isMobile" :order="order" class="notes-data" />
          <OrderProductList
            :isMobile="isMobile"
            :order="order"
            class="products-data"
          />
        </div>
      </v-col>
    </v-row>
    <v-dialog
      v-if="isMobile"
      width="350"
      v-model="isVisible"
      class="hidden-md-and-up tw-pb-5 tw-overflow-hidden tw-overflow-x-hidden tw-overflow-y-hidden"
    >
      <v-card class="hidden-md-and-up tw-flex tw-flex-col">
        <div class="tw-flex tw-justify-end">
          <v-btn
            class="mr-1 tw-fixed"
            icon
            color="red"
            large
            @click="$emit('close', true)"
          >
            <v-icon>la-close</v-icon>
          </v-btn>
        </div>
        <v-row align="center" justify="center">
          <v-col cols="11">
            <v-row>
              <v-col
                cols="12"
                class="tw-flex tw-flex-col tw-mt-10 align-center"
              >
                <h1 class="title-page-2">{{ title }}</h1>
                <span style="font-size: 1rem">{{ formattedCreatedAt }}</span>
                <v-spacer></v-spacer>
                <OrderClient
                  :isMobile="isMobile"
                  @openChat="$emit('openChat', true)"
                  :order="order"
                />
                <v-spacer class="space"></v-spacer>
                <OrderPayment :isMobile="isMobile" :order="order" />
                <v-spacer class="space"></v-spacer>
                <OrderDelivery :isMobile="isMobile" :order="order" />
                <v-spacer class="space"></v-spacer>
                <OrderNotes :isMobile="isMobile" :order="order" />
                <v-spacer class="space"></v-spacer>
                <OrderProductList :isMobile="isMobile" :order="order" />
                <v-spacer class="space"></v-spacer>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import OrderClient from './OrderClient';
import OrderPayment from './OrderPayment';
import OrderDelivery from './OrderDelivery';
import OrderNotes from './OrderNotes';
import OrderProductList from './OrderProductList';

export default {
  props: {
    isMobile: {
      default: false,
    },
    order: {
      type: Object,
      required: true,
    },
    isVisible: {
      type: Boolean,
      default: false,
    },
    formattedCreatedAt: {
      type: String,
    },
    title: {
      type: String,
    },
  },
  components: {
    OrderClient,
    OrderPayment,
    OrderDelivery,
    OrderNotes,
    OrderProductList,
  },
};
</script>

<style scoped>
.d-grid {
  display: grid;
  grid-template-areas:
    'order payment'
    'delivery notes'
    'products products';
  grid-template-columns: 2fr 1fr;
  grid-gap: 25px;
}

.order-data {
  grid-area: order;
}
.payment-data {
  grid-area: payment;
}
.delivery-data {
  grid-area: delivery;
}
.notes-data {
  grid-area: notes;
}

.products-data {
  grid-area: products;
}

.space {
  padding: 0.8rem 0rem;
}
</style>
