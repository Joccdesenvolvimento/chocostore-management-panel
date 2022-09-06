<template>
  <div>
    <v-row justify="center" no-gutters class="pt-1">
      <v-col cols="6" md="6" class="text-center">
        <v-chip
          normal
          :style="{
            color: 'white',
            backgroundColor: getColorStatus(),
          }"
          v-if="isMobile == false"
        >
          Cancelado ({{
            order.cancelReason
              ? order.cancelReason.name
              : 'Motivo não específicado'
          }})
        </v-chip>
        <v-chip
          normal
          :style="{
            color: 'white',
            backgroundColor: getColorStatus(),
          }"
          v-else
        >
          Cancelado 
        </v-chip>
        <!-- <v-icon color="normal" x-small class="mr-3">la-close</v-icon> Pedido cancelado -->
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { STATUS_ARRAY } from './../../utils/enums';

export default {
  props: {
    isLoading: false,
    order: null
  },
  data() {
    return {
      status: STATUS_ARRAY,
      isMobile: false,
      windowWidth: window.innerWidth,
    };
  },
  methods: {
    getColorStatus() {
      try {
        const { backgroundColor: color } = this.status.filter(
          t => t.id == 5
        )[0];

        return color;
      } catch (err) {
        return 'black';
      }
    },
    isMobileTest() {
      this.isMobile = this.windowWidth > 960 ? false : true;
    },
  },
  created: function(){
    this.isMobileTest()
  }
};
</script>
