<template>
  <div class="text-center">
    <v-dialog persistent v-model="isVisible" width="900">
      <v-card :loading="isLoadingOrdersCancelReasons">
        <v-card-title class="headline lighten-1" primary-title
          >Cancelar</v-card-title
        >
        <v-card-text>
          <v-row>
            <v-col>
              Selecione o motivo pelo qual você não pode atender este pedido:
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <v-radio-group v-model="selectedReasonId" column>
                <v-radio
                  v-for="reason in firstsOrdersCancelReasons"
                  :key="reason.id"
                  :label="reason.name"
                  class="my-2"
                  color="primary"
                  :value="reason.id"
                ></v-radio>
              </v-radio-group>
            </v-col>
            <v-col cols="6">
              <v-radio-group v-model="selectedReasonId" column>
                <v-radio
                  v-for="reason in lastsOrdersCancelReasons"
                  :key="reason.id"
                  :label="reason.name"
                  class="my-2"
                  color="primary"
                  :value="reason.id"
                ></v-radio>
              </v-radio-group>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" class="mr-4" text @click="$emit('close', true)"
            >Voltar</v-btn
          >
          <ButtonPrimary :disabled="+selectedReasonId == 0" @click="cancelOrder">Confirmar!</ButtonPrimary>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
import OrdersService from '../services/orders-service';

const { mapActions } = createNamespacedHelpers('products');

export default {
  props: {
    isVisible: {
      type: Boolean
    }
  },
  methods: {
    cancelOrder() {
      if (+this.selectedReasonId > 0) {
        this.$emit('cancelOrder', this.selectedReasonId);
      }
    }
  },
  computed: {
    firstsOrdersCancelReasons() {
      return this.ordersCancelReasons.filter((_, index) => index < 6);
    },
    lastsOrdersCancelReasons() {
      return this.ordersCancelReasons.filter((_, index) => index >= 6);
    },
  },
  async created() {
    this.isLoadingOrdersCancelReasons = true;

    try{
      const response = await OrdersService.getOrdersCancelReasons();

      this.ordersCancelReasons = response.data;
    }catch(err){
      console.log(err.response);
    }

    this.isLoadingOrdersCancelReasons = false;
  },
  data() {
    return {
      selectedReasonId: null,
      ordersCancelReasons: [],
      isLoadingOrdersCancelReasons: false,
      errorMessages: ''
    };
  }
};
</script>
