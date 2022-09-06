<template>
  <div class="text-center">
    <v-dialog @click:outside="$emit('close')" v-model="isVisible" width="80vw">
      <v-card>
        <div class="dialog-content">
          <PromotionsBoostedList
            :boostedPromotionsList="boostedPromotions"
          />
          <div class="d-flex justify-end">
            <ButtonPrimary @click="$emit('close')" class="mt-6"
              >Pronto</ButtonPrimary
            >
          </div>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import PromotionsBoostedList from '../components/PromotionsBoostedList';

import PromotionsService from './../services/promotions-service';

import { createNamespacedHelpers } from 'vuex';
const { mapState } = createNamespacedHelpers(
  'products'
);

export default {
  components: {
    PromotionsBoostedList,
  },
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState(['boostedPromotions'])
  }
};
</script>

<style>
.dialog-content {
  background-color: #fff;
}
</style>
