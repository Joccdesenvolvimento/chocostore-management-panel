<template>
  <div>
    <v-row justify="center" no-gutters class="pt-1">
      <v-spacer></v-spacer>
      <v-col cols="11" md="3">
        <v-btn
          color="normal tw-mr-0"
          @click="$emit('changeStatus', 5)"
          large
          depressed
          block
          >Recusar</v-btn
        >
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="12" md="3" v-if="showAccept">
        <v-btn
          @click="$emit('changeStatus', 2)"
          large
          :loading="isLoading"
          color="primary"
          block
          depressed
          >Aceitar</v-btn
        >
      </v-col>
      <v-spacer></v-spacer>
    </v-row>
  </div>
</template>

<script>
import { STATUS_ARRAY } from './../../utils/enums';

export default {
  props: {
    isLoading: false,
    showAccept: true
  },
  data() {
    return {
      status: STATUS_ARRAY
    };
  },
  computed: {
    styledStatus() {
      try {
        const { backgroundColor } = this.status.filter(t => t.id == 2)[0];

        return {
          backgroundColor,
          color: 'white'
        };
      } catch (err) {
        return {
          backgroundColor: 'white'
          //   borderRadius: '5px'
        };
      }
    }
  }
};
</script>