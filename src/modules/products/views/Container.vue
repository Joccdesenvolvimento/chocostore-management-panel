<template>
  <AppLayout>
    <keep-alive>
      <router-view v-if="!loading"></router-view>
    </keep-alive>
  </AppLayout>
</template>

<script>
import register from './../store/register';
import { createNamespacedHelpers } from 'vuex';

const { mapState, mapActions } = createNamespacedHelpers('products');

export default {
  computed: {
    ...mapState(['loading']),
  },
  methods: {
    ...mapActions([
      'getProducts',
      'findBoostHistoric',
      'getCategories',
      'getVariations',
      'getPromotions',
      'getBanners',
      'getHighlights'
    ]),
  },
  created() {
    register(this.$store);
    this.getBanners();
    this.getHighlights();
    this.getCategories();
    this.getProducts();
    this.getVariations();
    this.getPromotions();
    this.findBoostHistoric();
  },
};
</script>

<style>
</style>
