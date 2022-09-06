<template>
  <div>
    <v-btn
      color="primary"
      depressed
      @click="$emit('click')"
      v-bind="$attrs"
    >
      <slot></slot>
    </v-btn>
  </div>
</template>

<style scoped>
/* .v-btn:not(.v-btn--round).v-size--default {
  height: 39px !important;
  font-size: 11px;
} */
</style>
