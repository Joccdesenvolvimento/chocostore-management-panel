<template>
  <div>
    <v-card v-if="!isMobile" class="hidden-sm-and-down" outlined>
      <v-card-title>Cliente</v-card-title>
      <v-card-text>
        <div class="d-flex justify-space-between tw-flex-col md:tw-flex-row">
          <div>
            <v-icon class="mr-2">la-user</v-icon>
            <span class="mt-1">{{ order.user ? order.user.name : '' }}</span>
          </div>
          <div>
            <ButtonSecondary @click="$emit('openChat', true)"
              >Conversar com cliente</ButtonSecondary
            >
          </div>
        </div>
      </v-card-text>
    </v-card>
    <div v-if="isMobile" class="block hidden-md-and-up">
      <!-- <v-icon class="mr-6">la-user</v-icon>-->
      <p class="fontTitle">Cliente</p>
      <!-- <v-icon class="ml-6">la-user</v-icon>-->
      <div class="fontText">
        <div class="d-flex tw-flex-col">
          <div>
            <span class="mt-1">{{ order.user ? order.user.name : '' }}</span>
          </div>
          <div>
            <ButtonSecondary
              @click="$emit('openChat', true)"
              class="tw-mt-5"
              style="font-weight: 400"
              >Conversar com cliente</ButtonSecondary
            >
          </div>
        </div>
      </div>
      <OrderChatMobile
        v-if="isChatModalVisible"
        @openChat="openChat"
        @close="isChatModalVisible = false"
        :isOpen="isChatModalVisible"
        :order="order"
      />
    </div>
  </div>
</template>

<script>
import OrderChatMobile from './OrderChatMobile.vue';
export default {
  props: {
    order: {},
    isMobile: { default: false },
  },
  data() {
    return {
      isChatModalVisible: false,
    };
  },
  components: {
    OrderChatMobile,
  },
  methods: {
    openChat() {
      this.isChatModalVisible = !this.isChatModalVisible;
    },
  },
};
</script>



<style>
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