<template>
  <div>
    <v-simple-table >
      <template v-slot:default>
        <v-card
          outlined
          v-for="order in ordersFiltered"
          :key="order.id"
          :ripple="false"
          :class="{
            'order-item': true,
            'order-active': +orderIdSelected == order.id,
          }"
          @click="() => handleClickRow(order)"
        >
          <v-card-text
            class="d-flex flex-column justify-space-between"
          >
            <div class="d-flex flex-row justify-space-between">
              <div class="">{{ order.id }} - {{ order.client }}</div>
              <!-- <div class="" :style="{ color: getColorStatus(order.statusId) }">
                {{ order.status }}
              </div> -->
              <v-chip
                small
                class="chip-status"
                :style="{
                  color: 'white',
                  backgroundColor: getColorStatus(order.statusId),
                }"
              >
                <v-icon
                  color="white"
                  class="exclamation-pulse mr-2"
                  v-if="order.statusId == 1 && type == 0"
                  >la-exclamation-circle</v-icon
                >
                {{
                  order.statusId == 1 && type == 1 ? 'Agendado' : order.status
                }}
              </v-chip>
            </div>
            <div class="mt-7 mr-3 d-flex justify-space-between align-end">
              <div>
                <v-icon>la-clock</v-icon>
                <span v-if="type == 1">
                  agendado para <br />
                  <span class="primary--text">{{
                    getDateAndHour(order.scheduleDate)
                  }}</span>
                </span>
                <span v-else>
                  {{
                    order.statusId == 4 || order.statusId == 5
                      ? formatDate(order.createdAt)
                      : timeAgo(order.createdAt)
                  }}
                </span>
              </div>

              <v-badge
                color="green"
                :content="messageDidntSee(order.id)"
                offset-x="15"
                offset-y="15"
                :style="{ opacity: messageDidntSee(order.id) != '0' ? 1 : 0 }"
              >
                <MessageIcon borderColor="black" />
              </v-badge>
            </div>
          </v-card-text>
        </v-card>
        <v-card-text
          class="tw-text-center"
            v-if="ordersFiltered.length == 0">
            <span class="text-gray-600 tw-text-tw-text-lg">{{
            ` SEM PEDIDOS ${placeholderSearch}`
            }}</span>
          </v-card-text>
      </template>
    </v-simple-table>
  </div>
</template>

<script>
import { STATUS_ARRAY } from '../utils/enums';
import { createNamespacedHelpers } from 'vuex';
import moment from 'moment';
moment.locale('pt-br');
const { mapState, mapGetters, mapActions } = createNamespacedHelpers('orders');
export default {
  props: {
    type: {
      type: Number,
      default: 0,
    },
    search: {
      type: String,
      default: '',
    },
    orderIdSelected: {
      type: Number,
    },
    tab:{
      type: Number
    },
  },
  data() {
    return {
      status: STATUS_ARRAY,
    };
  },
  computed: {
    ...mapState(['ordersMessages']),
    ...mapGetters(['inProgress', 'finished', 'scheduled']),
    ordersFiltered() {
      const ordersFilter =
        this.type == 0
          ? this.inProgress
          : this.type == 1
          ? this.scheduled
          : this.finished;
      const filteredOrders = ordersFilter.filter((o) => {
        if (!this.search) return true;
        return (
          '' + o.id == this.search || this.verifyIncludes(o.client, this.search)
        );
      });
      if (this.type == 1) return filteredOrders;
      return filteredOrders.sort((a, b) => {
        if (a.id < b.id) return 1;
        if (a.id > b.id) return -1;
        return 0;
      });
    },
    placeholderSearch() {
      var local = ' ';
      switch (this.tab) {
        case 0: {
          local = 'EM ANDAMENTO!';
          break;
        }
        case 1: {
          local = 'AGENDADOS!';
          break;
        }
        case 2: {
          local = 'FINALIZADOS!';
          break;
        }
        default: {
          local = ' ';
          break;
        }
      }
      return local;
    },
  },
  methods: {
    messageDidntSee(orderId) {
      const didntsee = this.ordersMessages.filter(
        (m) => m.orderId == orderId && m.seenAt == null && m.senderType == 1
      );
      const messageCount = didntsee.length;
      return messageCount > 9 ? '9+' : `${messageCount}`;
    },
    getDateAndHour(dateParam) {
      const date = moment(dateParam);
      const hour =
        date.format('HH:mm') + ' - ' + date.add(30, 'minutes').format('HH:mm');
      const diffDays = date.diff(moment(), 'days');
      if (+date.format('DD') == +moment().format('DD') + 1) {
        return 'Amanhã às ' + hour;
      } else if (diffDays == 0) {
        return 'Hoje às ' + hour;
      } else if (diffDays <= 6) {
        return date.format('dddd') + ' às ' + hour;
      } else {
        return date.format('DD/MM') + ' às ' + hour;
      }
    },
    verifyIncludes(string1, string2) {
      return string1.toLowerCase().includes(string2.toLowerCase());
    },
    formatDate(date) {
      return moment(date).format('DD/MM/YYYY HH:mm');
    },
    timeAgo(date) {
      return moment(date).fromNow(true) + ' atrás';
    },
    getColorStatus(statusId) {
      try {
        const { backgroundColor: color } = this.status.filter(
          (t) => t.id == statusId
        )[0];
        return color;
      } catch (err) {
        return 'black';
      }
    },
    handleClickRow({ id }) {
      this.$emit('onClickRow', id);
    },
  },
  watch:{
    tab(){
      console.log(this.tab)
    }
    
  }
};
</script>
<style>
.order-active {
  background-color: var(--v-border-base) !important;
}
.order-table td {
  height: 61px !important;
}
.order-item + .order-item {
  margin-top: 8px;
}
.exclamation-pulse {
  /* box-shadow: 0 0 0 0 rgba(0, 0, 0, 1); */
  transform: scale(1);
  animation: pulse 1s infinite;
}
.chip-status.v-chip {
  overflow: inherit !important;
}
@keyframes pulse {
  0% {
    transform: scale(0.8);
    /* box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.7); */
  }
  50% {
    transform: scale(1);
    /* box-shadow: 0 0 0 10px rgba(0, 0, 0, 0); */
  }
  100% {
    transform: scale(0.8);
    /* box-shadow: 0 0 0 0 rgba(0, 0, 0, 0); */
  }
}
</style>