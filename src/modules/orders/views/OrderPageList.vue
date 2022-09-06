<template>
  <div class="pl-3 fill-height">
    <v-row no-gutters class="fill-height">
      <v-col cols="12" md="3" class="pa-5 pt-2">
        <v-row>
          <v-col cols="12">
            <h1 class="title-page">Pedidos</h1>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="d-flex tw-justify-center">
            <InputSearch
              :placeholder="` Procurar ${placeholderSearch}`"
              v-model="search"
            />
          </v-col>
        </v-row>
        <v-row no-gutters style="margin-left: -20px; margin-right: -20px">
          <v-col cols="12">
            <v-slide-group multiple show-arrows v-if="isSlideGroupVisible">
              <v-tabs
                v-model="tab"
                class="pt-1"
                color="black"
                @change="tabActive = $event"
              >
                <v-tab :ripple="false">Em andamento</v-tab>
                <v-tab :ripple="false">Agendados</v-tab>
                <v-tab :ripple="false">Finalizados</v-tab>
              </v-tabs>
            </v-slide-group>
          </v-col>
        </v-row>
        <v-row class="fill-height">
          <v-col cols="12" class="fill-height">
            <div class="orders-list-scroll">
              <OrderList
                @onClickRow="selectOrder"
                :orderIdSelected="orderIdSelected"
                :type="typeList"
                :search="search"
                :tab="tabActive"
                @click="isVisibleMethod"
              ></OrderList>
            </div>
          </v-col>
        </v-row>
      </v-col>
      <v-col
        cols="12"
        md="9"
        class="order-details-col d-flex justify-center align-center"
      >
        <v-col cols="12" style="padding:0px !important;">
          <OrderPageDetails
            :orderId="orderIdSelected"
            v-show="+orderIdSelected > 0"
            :isVisible="isVisible"
            @close=" isVisible = false"
          />

          <AppTips v-show="+ordersLength == 0" />
          <AppTips v-show="+ordersLength > 0 && +orderIdSelected == 0" />

        </v-col>
        
      </v-col>
    </v-row>
  </div>
</template>

<script>
import OrderList from './../components/OrderList';
import OrderPageDetails from './../views/OrderPageDetails';

import { createNamespacedHelpers, mapGetters } from 'vuex';

import moment from 'moment';
import AppTips from '../../../components/utils/AppTips.vue';
moment.locale('pt-br');

const { mapState } = createNamespacedHelpers('orders');

export default {
  components: {
    OrderList,
    OrderPageDetails,
    AppTips,
  },
  computed: {
    ...mapState(['orders']),
    ordersLength() {
      return this.orders.length;
    },
    placeholderSearch() {
      var local = ' ';
      switch (this.tabActive) {
        case 0: {
          local = 'em andamento';
          break;
        }
        case 1: {
          local = 'em agendados';
          break;
        }
        case 2: {
          local = 'em finalizados';
          break;
        }
        default: {
          local = ' ';
          break;
        }
      }
      return local;
    },
    typeList() {
      return this.tabActive;
    },
  },
  methods: {
    selectOrder(orderId) {
      this.orderIdSelected = orderId;
      this.isVisible = true 
    }
  },
  created() {
    this.$nextTick(() => {
      });
    setTimeout(() => {
      this.isSlideGroupVisible = true
    }, 500);
  },
  data() {
    return {
      search: '',
      orderIdSelected: null,
      tab: true,
      tabActive: 0,
      isVisible: false,
      isSlideGroupVisible: false
    };
  },
};
</script>

<style>
/* .col-orders-list{
  min-height: 100%;
} */

.orders-list-scroll {
  overflow-y: auto;
  max-height: 60vh;
  padding-right: 5px;
}

.orders-list-scroll::-webkit-scrollbar {
  border-radius: 30px;
  width: 8px;
}
.orders-list-scroll::-webkit-scrollbar-track {
  background-color: white;
  border-radius: 30px;
}

.orders-list-scroll::-webkit-scrollbar-thumb {
  background-color: #f0f0f0;
  border-radius: 30px;
}
.order-details-col {
  border-left: 1px solid var(--v-border-base);
}
@media (max-width: 960px) {
  .order-details-col {
  border:none;
}
}
/*.orders-list-scroll::-webkit-scrollbar-thumb.v-tabs:not(.v-tabs--vertical):not(.v-tabs--right)
  > .v-slide-group--is-overflowing.v-tabs-bar--is-mobile:not(.v-slide-group--has-affixes)
  .v-slide-group__prev {
  display: none;
}*/

/* .container-orders{
  height: 
} */
</style>
