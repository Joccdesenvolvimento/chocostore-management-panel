<template>
  <div class="page-header">
    <v-row class="justify-center ">
      <!-- <v-col cols="12" md="auto" class="pr-0" v-if="title != 'Produtos'">
        <h1 class="title-page">{{ title }}</h1>
      </v-col>
      <v-col cols="12" md="auto" class="pr-0" v-if="title == 'Produtos'">
        <h1 class="hidden-sm-and-down title-page">{{ title }}</h1>
      </v-col> -->
      <slot></slot>
    </v-row>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      default: '',
    },
  },
};
</script>
<style>
.title-page {
  display: inline-block;
  font-size: 1.9rem;
  font-weight: 500;
  line-height: 1.7;
}
.title-page-2 {
  display: inline-block;
  font-size: 1.4rem;
  font-weight: 500;
  line-height: 1.7;
}

.page-header {
  padding: 0px 30px;
}

@media (max-width: 960px) {
  .page-header {
    padding: 0px 15px;
  }
}
</style>
