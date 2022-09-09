<template>
  <AppLayout>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </AppLayout>
</template>

<script>
import register from './../store/register';

import { createNamespacedHelpers } from 'vuex';

const { mapActions } = createNamespacedHelpers('users');

export default {
  created(){
    register(this.$store);
    this.getUsers()
    this.getCustomers()
  },
  methods: {
    ...mapActions(['getUsers']),
    ...mapActions(['getCustomers']),
  }
};
</script>

<style>
</style>
