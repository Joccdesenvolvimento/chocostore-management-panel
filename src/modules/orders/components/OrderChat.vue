<template>
  <v-menu
    v-model="isVisible"
    :close-on-content-click="false"
    :close-on-click="true"
    @click:outside="$emit('close', true)"
    :nudge-width="200"
    :nudge-height="600"
    :nudge-left="55"
    :nudge-bottom="20"
    offset-y
    left
    top
  >
    <template v-slot:activator="{ on, attrs }">
      <template v-if="isOpenModalButtonVisible">
        <v-btn
          @click="$emit('openChat', true)"
          color="primary"
          fab
          depressed
          v-if="!isVisible"
          class="open-chat-button"
        >
          <template>
            <v-badge
              color="green"
              :content="messageDidntSee"
              v-if="messageDidntSee != '0'"
            >
              <MessageIcon />
            </v-badge>
            <MessageIcon v-else />
          </template>
        </v-btn>
        <v-btn
          @click="$emit('close', true)"
          color="primary"
          fab
          depressed
          v-else
          class="open-chat-button"
        >
          <v-icon color="white">la-close</v-icon>
        </v-btn>
      </template>
    </template>
    <!-- <v-btn color="indigo" dark v-bind="attrs" v-on="on">
        Menu as Popover
      </v-btn> -->

    <v-card :loading="isOrderCanceledOrFinished && isLoadingHistoricMessages" class="chat-menu">
      <v-card-title class="chat-title px-5 py-2">
        <div class="d-flex align-center" style="color:white">
          <MessageIcon borderColor="white" :size="26" color="white" />
          <span class="ml-2">Chat</span>
        </div>
      </v-card-title>
      <v-card-text class="pa-0">
        <div class="chat-messages custom-scroll px-5 py-4" id="chat-messages2">
          <v-row
            no-gutters
            v-for="message in ordersMessagesFiltered"
            :key="message.id"
          >
            <v-col
              cols="12"
              :class="{
                'mb-2': true,
                'user-box': message.senderType == 1,
                'company-box': message.senderType == 0,
              }"
            >
              <div
                :class="{
                  'user-message': message.senderType == 1,
                  'company-message': message.senderType == 0,
                }"
              >
                {{ message.text }}
              </div>
              <div class="d-flex justify-space-between">
                <v-icon
                  small
                  class="mr-2"
                  v-if="message.senderType == 0 && message.seenAt == null"
                  >la-check</v-icon
                >
                <v-icon
                  small
                  class="mr-2"
                  v-if="message.senderType == 0 && message.seenAt != null"
                  color="blue"
                  >la-check-double</v-icon
                >
                <small>{{ formatDate(message.createdAt) }}</small>
              </div>
            </v-col>
          </v-row>
        </div>
      </v-card-text>
      <v-card-actions class="writePlace px-5 py-4">
        <v-row no-gutters>
          <v-col class="pr-2">
            <!-- <v-textarea
              solo
              dense
              v-model="message"
              @keyup.enter="send"
              v-if="!isOrderCanceledOrFinished"
              :rows="rowsLengthTextArea"
              background-color="#f8f8f8"
              class="mt-0 chat-input-message no-box-shadow"
              hide-details
            >
            </v-textarea> -->

            <v-textarea
              v-model="message"
              @keydown.enter.prevent="send"
              v-if="!isOrderCanceledOrFinished"
              rows="1"
              auto-grow
              row-height="15"
              background-color="#e9e9e9"
              class="mt-0 pt-0 chat-input-message no-box-shadow"
              hide-details
            >
            </v-textarea>
            <span v-else class="pa-3 text-gray">
              Esta conversa foi finalizada
            </span>
          </v-col>

          <v-col cols="auto">
            <v-btn
              color="green"
              @click="send"
              depressed
              v-if="!isOrderCanceledOrFinished"
              ><v-icon color="white">la-send</v-icon></v-btn
            >
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

import moment from 'moment';
import OrdersService from '../services/orders-service';

moment.locale('pt-br');

const { mapGetters, mapState, mapActions } = createNamespacedHelpers('orders');

export default {
  props: {
    isVisible: {
      default: false,
    },
    isOpenModalButtonVisible: {
      default: true,
    },
    order: {
      required: true,
    },
  },
  data() {
    return {
      message: '',
      isLoadingHistoricMessages: false,
      historicMessages: [],
    };
  },
  methods: {
    ...mapActions(['sendMessage', 'setMessageAsSeen']),
    async loadHistoricMessages(orderId) {
      this.isLoadingHistoricMessages = true;

      try {
        const response = await OrdersService.findHistoricMessages(orderId);

        this.historicMessages = response.data;
      } catch (err) {
        console.log(err.response);
      }

      this.isLoadingHistoricMessages = false;
    },
    formatDate(date) {
      return moment(date).format('HH:mm');
    },
    timeAgo(date) {
      return moment(date).fromNow(true) + ' atrás';
    },
    send() {
      if (this.message.length > 0) {
        this.sendMessage({
          socket: this.$socket,
          message: {
            senderType: 0,
            seenAt: null,
            orderId: this.order.id,
            text: this.message,
          },
        });

        this.message = '';
      }
    },
  },
  computed: {
    ...mapState(['ordersMessages']),
    ordersMessagesFiltered() {
      if (this.isOrderCanceledOrFinished) return this.historicMessages;

      return this.ordersMessages.filter((m) => m.orderId == this.order.id);
    },
    // rowsLengthTextArea(){
    //   return this.message.length
    // },
    messageDidntSee() {
      const messageCount = this.ordersMessagesFiltered.filter(
        (m) => m.seenAt == null && m.senderType == 1
      ).length;
      return messageCount > 9 ? '9+' : `${messageCount}`;
    },
    isOrderCanceledOrFinished() {
      return +this.order.statusId == 4 || +this.order.statusId == 5;
    },
  },
  watch: {
    isVisible(newValue) {
      // alert(newValue);
      if (newValue) {
        this.setMessageAsSeen({ orderId: this.order.id });
        this.$socket.emit('SET_MESSAGES_AS_SEEN', this.order.id);

        if (this.order.statusId == 4 || this.order.statusId == 5) {
          this.loadHistoricMessages(this.order.id);
        }
      }
    },
    ordersMessagesFiltered(newValue, oldValue) {
      // alert(5);
      // alert(newValue.length + " " + oldValue.length);
      if (this.isVisible && newValue.length != oldValue.length) {
        this.setMessageAsSeen({ orderId: this.order.id });
        this.$socket.emit('SET_MESSAGES_AS_SEEN', this.order.id);
      }

      setTimeout(() => {
        var container = document.querySelector('#chat-messages2');
        container.scrollTop = container.scrollHeight;
        // const scrollAnimate = container.scrollHeight - container.scrollTop;

        // const 2000 = scrollToIncrement *
        // const scrollToIncrement = scrollAnimate / 20;
        // const resize = () => {

        //   container.scrollTop = container.scrollHeight + 20;

        //   if()
        // };
        // setTimeout(resize, 50);
      }, 250);
    },
    isOpenModalButtonVisible(newValue) {
      alert(newValue);
    },
  },
};
</script>

<style >
.chat-messages {
  height: 400px;
  padding-right: 5px;
  overflow-y: auto;
}

.user-box {
  display: flex;
  flex-direction: column;
  padding: 0px 15px;
  align-items: flex-start;
}

.company-box {
  display: flex;
  flex-direction: column;
  padding: 0px 15px;
  align-items: flex-end;
}

.user-message {
  padding: 12px 16px;
  width: auto;
  max-width: 360px;
  background-color: var(--v-green-base) !important;
  color: white;
  border-radius: 12px 12px 12px 0px;
}

.company-message {
  padding: 12px 16px;
  width: auto;
  max-width: 360px;
  background-color: #f8f8f8;
  color: black;
  border-radius: 12px 12px 0px 12px;
}

.no-box-shadow .v-input__slot {
  box-shadow: none !important;
}

.chat-input-message {
  border-radius: 8px;
}

.chat-input-message textarea {
  padding: 0px 10px;
  max-height: 85px;
  overflow: auto;
}

.chat-input-message textarea::-webkit-scrollbar {
  border-radius: 30px;
  width: 8px;
}
.chat-input-message textarea::-webkit-scrollbar-track {
  background-color: transparent;
  border-radius: 30px;
}

.chat-input-message textarea::-webkit-scrollbar-thumb {
  background-color: #e0e0e0;
  border-radius: 30px;
}

.chat-input-message .v-text-field__slot {
  padding: 4px 4px;
}

.chat-input-message .v-input__slot:before,
.chat-input-message .v-input__slot:after {
  display: none;
}

.v-menu__content {
  box-shadow: none !important;
  border: 1px solid #dbdadace ;
  border-radius: 14px 14px 0px 14px; 
 
}


.chat-menu {
  border: 1px solid #dbdadace !important;
}

.chat-title {
  background: #51b5fd;
  border-bottom: 1px solid #dbdadace ;
}

.open-chat-button .v-badge__badge {
  padding: 4px !important;
  border-radius: 24px !important;
}
.writePlace{
  border-top: 1px solid #dbdadace ;
}

</style>
