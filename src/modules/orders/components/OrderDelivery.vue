<template>
<div>
  <v-card v-if="!isMobile" class="hidden-sm-and-down" outlined>
    <v-card-title>Dados de entrega</v-card-title>
    <v-card-text>
      <div class="d-flex tw-flex-col md:tw-flex-row  justify-space-between">
        <div >
          <v-icon v-if="order.deliveryMethod == '1'" class="mr-2">la-truck</v-icon>
          <span>{{ order.deliveryMethod == '1' ? order.address : 'Retirada no local'}}</span>
        </div>
        <div>
          <ButtonSecondary v-if="order.deliveryMethod == '1'" @click="showMaps = !showMaps"
            >Ver no mapa</ButtonSecondary
          >

          <MapsView
            v-if="showMaps"
            @close="showMaps = false"
            :showModal="showMaps"
            :location="completeAddress"
          ></MapsView>
        </div>
      </div>
    </v-card-text>
  </v-card>
  <div v-if="isMobile" class="hidden-md-and-up block">
    <!-- <v-icon v-if="order.deliveryMethod == '1'" class="mr-4">la-truck</v-icon>-->
    <p class="fontTitle">Dados de entrega</p>
    <!-- <v-icon v-if="order.deliveryMethod == '1'" class="ml-4">la-truck</v-icon>-->
    <div class="fontText">
      <div class="d-flex tw-flex-col justify-space-between">
        <div >
          <span>{{ order.deliveryMethod == '1' ? order.address : 'Retirada no local'}}</span>
        </div>
        <div>
          <ButtonSecondary v-if="order.deliveryMethod == '1'" @click="showMaps = !showMaps " class="tw-mt-5" style="font-weight:400"
            >Ver no mapa</ButtonSecondary
          >

          <MapsView
            v-if="showMaps"
            @close="showMaps = false"
            :showModal="showMaps"
            :location="completeAddress"
          ></MapsView>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import { mapAddressToFindAtGoogleMaps } from '@/utils/helpers/address';

export default {
  props: {
    order: {},
     isMobile: { default: false },
  },
  computed: {
    completeAddress() {
      return mapAddressToFindAtGoogleMaps(this.order);
    }
  },
  data() {
    return {
      showMaps: false
    };
  }
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