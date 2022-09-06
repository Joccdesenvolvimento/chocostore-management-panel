<template>
  <div>
    <v-row justify="center" no-gutters class="pt-1">
      <v-col cols="11" md="6" class="text-center">
        <v-chip
          normal
          :style="{
            color: 'white',
            backgroundColor: getColorStatus()
          }"
        >
          Entregue
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
    isLoading: false
  },
  data() {
    return {
      status: STATUS_ARRAY
    };
  },
  methods: {
    getColorStatus() {
      try {
        const { backgroundColor: color } = this.status.filter(
          t => t.id == 4
        )[0];

        return color;
      } catch (err) {
        return 'black';
      }
    }
  }
};
</script>
