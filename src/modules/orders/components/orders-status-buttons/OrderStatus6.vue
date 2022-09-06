<template>
  <div>
    <v-row justify="center" no-gutters class="pt-1">
      <v-col cols="11" md="4">
        <v-btn
          :style="styledStatus"
          @click="$emit('changeStatus', 4)"
          large
          block
          :loading="isLoading"
          depressed
          >Marcar como entregue</v-btn
        >
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
  computed: {
    styledStatus() {
      try {
        const { backgroundColor } = this.status.filter(
          t => t.id == 4
        )[0];

        return {
          backgroundColor,
          color: 'white'
        };
      } catch (err) {
        return {
          backgroundColor: 'white',
        //   borderRadius: '5px'
        };
      }
    }
  }
}
</script>