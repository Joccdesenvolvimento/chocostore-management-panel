<template>
  <div class="order-container">
    <div class="content-scroll order-details">
      <v-row align="center" justify="center">
        <v-col md="11" cols="12">
          <v-row class="hidden-sm-and-down">
            <v-col
              cols="12"
              md="12"
              class="tw-flex tw-flex-col md:tw-flex-row align-center"
            >
              <h1 class="title-page-2">{{ title }}</h1>
              <span class="ml-3" style="font-size: 1rem">{{
                formattedCreatedAt
              }}</span>
              <v-spacer></v-spacer>
              <span
                v-show="!showAccept && +order.statusId == 1"
                class="subtitle-1 blue--text"
                >Esse pedido ficará disponível próximo ao horário de
                entrega</span
              >
              <v-btn
                text
                v-if="!clickedOnPrint && order.statusId > 1"
                @click="data_print"
              >
                <PrinterIcon></PrinterIcon>
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <OrderDetails
        :isMobile="isMobile"
        :order="order"
        @openChat="openChat"
        :isVisible="isVisible"
        :title="title"
        :formattedCreatedAt="formattedCreatedAt"
      />
      <!-- <OrderDetailsModalForMobile
        v-if="isMobile"
        class="hidden-md-and-up"
        :isVisible="isVisible"
        :order="order"
        @openChat="openChat"
        @close="$emit('close', true)"
      >
        <template v-slot:actions-buttons>
          <component
            class="blockbuttons"
            :isLoading="isOrderStatusChangedLoading"
            :is="orderStatusComponentName"
            :order="order"
            :isPickup="+order.deliveryMethod != 1"
            :showAccept="showAccept"
            v-if="isFooterButtons && isVisible"
            @changeStatus="onChangeStatus"
          />
        </template>
        <template v-slot:cancel-button>
          <v-btn
            v-if="
              order.statusId != 5 && order.statusId != 4 && order.statusId > 1
            "
            depressed
            color="normal"
            :loading="isCancelling"
            @click="isConfirmCancelOrderDialogVisible = true"
          >
            Cancelar pedido
          </v-btn>
        </template>
      </OrderDetailsModalForMobile> -->

      <v-row
        align="center"
        justify="center"
        class="mt-0 hidden-sm-and-down"
        v-if="order.statusId != 5 && order.statusId != 4 && order.statusId > 1"
      >
        <v-col md="11" sm="12">
          <v-row class="mt-0">
            <v-col md="12" class="d-flex align-center">
              <v-btn
                depressed
                color="normal"
                :loading="isCancelling"
                @click="isConfirmCancelOrderDialogVisible = true"
              >
                Cancelar pedido
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row
        align="center"
        justify="center"
        class="mt-0 hidden-sm-and-down"
        v-if="order.statusId == 4 && order.totalCashback > 0"
      >
        <v-col md="11" sm="12">
          <v-row class="mt-0">
            <v-col md="12" class="d-flex align-center">
              <v-btn
                depressed
                color="normal"
                :loading="isCancelling"
                @click="cashbackChargeback"
              >
                Extornar Cashback
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <ConfirmCancelOrderDialog
        @close="isConfirmCancelOrderDialogVisible = false"
        @cancelOrder="
          (cancelReasonId) => {
            isConfirmCancelOrderDialogVisible = false;
            changeStatus(5, cancelReasonId);
          }
        "
        :isVisible="isConfirmCancelOrderDialogVisible"
      />
      <OrderDetailsToPrint :order="order" style="display: none" />
    </div>
    <div class="order-footer">
      <div relative>
        <OrderChat
          v-if="isMobile == false"
          @openChat="openChat"
          @close="isChatModalVisible = false"
          :isVisible="isChatModalVisible"
          :order="order"
        />
        <!-- <v-btn @click="toggleChatModal" color="primary" fab depressed class="open-chat-button">
          <MessageIcon />
        </v-btn> -->
        <span class="schedule-text" v-if="order.scheduleDate"
          >Agendado para
          <span style="max-width: 150px" class="blue--text"
            >{{
              getDateAndHour(order.scheduleDate).day +
              ' às ' +
              getDateAndHour(order.scheduleDate).hour
            }}
          </span>
          <!-- <span class="red--text">
            {{ getDateAndHour(order.scheduleDate).hour }}
          </span> -->
        </span>

        <component
          :isLoading="isOrderStatusChangedLoading"
          :is="orderStatusComponentName"
          :order="order"
          :isPickup="+order.deliveryMethod != 1"
          :showAccept="showAccept"
          v-if="isFooterButtons"
          @changeStatus="onChangeStatus"
        />
      </div>
    </div>
    <v-snackbar
      v-if="notifyType == 'error'"
      app
      v-model="showNotify"
      :color="colorMessage"
    >
      {{ message }}
      <v-btn
        :color="colorMessage == 'primary' ? 'white' : 'red'"
        icon
        @click="showNotify = false"
      >
        <v-icon>la la-close</v-icon>
      </v-btn>
    </v-snackbar>
    <v-snackbar
      v-if="notifyType == 'success'"
      app
      v-model="showNotify"
      :color="colorMessage"
    >
      {{ message }}
      <v-btn
        :color="colorMessage == 'primary' ? 'white' : 'red'"
        icon
        @click="showNotify = false"
      >
        <v-icon>la la-close</v-icon>
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import OrderDetails from './../components/OrderDetails';
import ConfirmCancelOrderDialog from './../forms/ConfirmCancelOrderDialog';
import OrderDetailsToPrint from './../components/OrderDetailsToPrint';
import OrderPageHeader from './../components/OrderPageHeader';
import OrderChat from './../components/OrderChat';
// import OrderDetailsModalForMobile from './../modals/OrderDetailsModalForMobile';

import OrdersService from '../services/orders-service';

import OrderStatus1 from './../components/orders-status-buttons/OrderStatus1';
import OrderStatus2 from './../components/orders-status-buttons/OrderStatus2';
import OrderStatus3 from './../components/orders-status-buttons/OrderStatus3';
import OrderStatus4 from './../components/orders-status-buttons/OrderStatus4';
import OrderStatus5 from './../components/orders-status-buttons/OrderStatus5';
import OrderStatus6 from './../components/orders-status-buttons/OrderStatus6';

import { STATUS_ARRAY } from './../utils/enums';
import {
  mapOrder,
  isScheduledOrderAvailableToPrepare,
} from './../utils/helpers/orders';
import { createNamespacedHelpers } from 'vuex';

const { mapGetters, mapState, mapActions } = createNamespacedHelpers('orders');

import moment from 'moment';

export default {
  components: {
    OrderChat,
    OrderDetails,
    // OrderDetailsModalForMobile,
    OrderPageHeader,
    OrderDetailsToPrint,
    OrderStatus1,
    OrderStatus2,
    OrderStatus3,
    OrderStatus4,
    OrderStatus5,
    OrderStatus6,
    ConfirmCancelOrderDialog,
  },
  props: {
    orderId: Number,

    isVisible: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState(['company']),
    ...mapGetters(['getOrder']),
    showAccept() {
      if (!this.order.scheduleDate) return true;
      else {
        if (
          isScheduledOrderAvailableToPrepare(
            this.order,
            this.company.deliveryTime
          )
        )
          return true;
        else return !this.order.statusId === 1;
      }
    },
    isFooterButtons() {
      if (!this.order.scheduleDate) return true;
      else {
        if (
          isScheduledOrderAvailableToPrepare(
            this.order,
            this.company.deliveryTime
          )
        )
          return true;
        else return this.order.statusId === 1;
      }
    },
    orderStatusComponentName() {
      return `OrderStatus${this.order.statusId}`;
    },
    title() {
      return `Pedido nº ${this.order.id}`;
    },
    formattedCreatedAt() {
      return moment(this.order.createdAt).format('DD/MM/YYYY HH:mm');
    },
    styledStatus() {
      try {
        const { backgroundColor } = this.status.filter(
          (t) => t.id == this.order.statusId
        )[0];

        return {
          backgroundColor,
          borderRadius: '5px',
        };
      } catch (err) {
        return {
          backgroundColor: 'white',
          borderRadius: '5px',
        };
      }
    },
  },
  methods: {
    ...mapActions(['editOrder']),
    onChangeStatus(statusId) {
      if (statusId == 5) this.isConfirmCancelOrderDialogVisible = true;
      else this.changeStatus(statusId);
    },
    async cashbackChargeback() {
      this.isCancelling = true;
      let response = await OrdersService.processCashback({
        orderId: this.order.id,
        statusId: 5,
      });
      this.showMessage(response.data.message, 'success', 'primary');
      this.isCancelling = false;
    },
    isMobileTest() {
      this.isMobile = this.windowWidth > 960 ? false : true;
    },
    getDateAndHour(dateParam) {
      const date = moment(dateParam);
      const hour =
        date.format('HH:mm') + ' - ' + date.add(30, 'minutes').format('HH:mm');

      const diffDays = date.diff(moment(), 'days');

      if (+date.format('DD') == +moment().format('DD') + 1) {
        return { day: 'Amanhã', hour };
      } else if (diffDays == 0) {
        return { day: 'Hoje', hour };
      } else if (diffDays <= 6) {
        return { day: date.format('dddd'), hour };
      } else {
        return { day: date.format('DD/MM'), hour };
      }
    },
    openChat() {
      this.isChatModalVisible = false;

      this.$nextTick(() => {
        this.isChatModalVisible = true;
      });
    },
    async changeStatus(statusId, cancelReasonId = null) {
      if (statusId == 5) {
        this.isCancelling = true;
        await OrdersService.processCashback({
          orderId: this.order.id,
          statusId: 4,
        });
      } else {
        this.isOrderStatusChangedLoading = true;
      }

      // alert(statusId);
      try {
        // alert(cancelOrderReasonId);
        //console.log(this.order.id, +statusId)
        await this.editOrder({
          order: {
            id: this.order.id,
            statusId: +statusId,
            ...(cancelReasonId ? { cancelReasonId } : {}),
          },
        });
        // this.order.statusId = statusId;
        this.setOrder(this.order.id);

        if (statusId == 4) {
          await OrdersService.processCashback({
            orderId: this.order.id,
            statusId: 2,
          });
        }
      } catch (err) {
        alert(err.response.data.errors[0].message);
      }

      this.isCancelling = false;
      this.isOrderStatusChangedLoading = false;
    },
    setOrder(orderId) {
      if (Number.isInteger(+orderId)) {
        this.order = this.getOrder(+orderId);
      }
    },
    toggleChatModal() {
      this.isChatModalVisible = !this.isChatModalVisible;
    },
    data_print() {
      const restoreBody = document.body.innerHTML;
      const printContent = document.querySelector('#order-print').innerHTML;
      document.body.innerHTML = printContent;
      window.print();
      window.location.href = '/pedidos';
    },
    showMessage(message, type, color = '') {
      this.message = message;
      this.colorMessage = color;
      this.showNotify = true;
      this.notifyType = type;
    },
  },
  mounted() {
    this.setOrder();
  },
  watch: {
    orderId(newValue) {
      if (+newValue > 0) {
        this.setOrder(newValue);
      }
    },
    isChatModalVisible() {
      console.log('sassa', this.isChatModalVisible);
    },
  },
  data() {
    return {
      windowWidth: window.innerWidth,
      isMobile: false,
      order: {},
      isCancelling: false,
      isChatModalVisible: false,
      isConfirmCancelOrderDialogVisible: false,
      isOrderStatusChangedLoading: false,
      clickedOnPrint: false,
      isOpenModalButtonVisible: true,
      status: STATUS_ARRAY,
      showNotify: false,
      colorMessage: null,
      message: null,
      notifyType: null,
    };
  },
  created: function () {
    this.isMobileTest();
    ///console.log("a" , this.isMobile)
  },
};
</script>

<style>
.open-chat-button {
  position: absolute;
  top: -46px;
  right: 55px;
}

.order-details {
  height: 85vh;
  width: 100%;
  padding: 0px 20px;
}
.order-footer {
  height: 15vh;
  border-top: 1px solid var(--v-border-base);
  padding: 20px;
}

.order-container {
  display: flex;
  flex-direction: column;
}

.schedule-text {
  position: absolute;
  left: -10px;
  top: -8px;
  display: flex;
  flex-direction: column;
  width: 35vh;
  font-size: 13px;
}

.schedule-text span {
  font-size: 16px;
}

.order-container > * {
  font-family: 'poppins', sans-serif !important;
}
.blockbuttons {
  margin: 0rem 0.5rem;
  padding: 1rem 0rem 1rem 0rem;
  text-align: center;
  box-sizing: border-box;
  border-top: 0.2rem solid #cccccfad;
  border-radius: 2%;
}
</style>
