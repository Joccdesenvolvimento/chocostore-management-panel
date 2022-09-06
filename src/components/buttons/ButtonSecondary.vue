<template>
  <v-btn
    small
    outlined
    :color="!$attrs.color ? 'secondary' : $attrs.color"
    @click="$emit('click', $event)"
    v-bind="$attrs"
  >
    <slot></slot>
  </v-btn>
</template>

<style scoped>
.v-btn.secondary--text {
  background-color: var(--v-backgroundSecondary-base) !important;
  color: var(--v-primary-base) !important;
  border: none;
}
</style>
