<template>
  <v-select
    :value="value"
    :ripple="false"
    class="custom-select"
    @change="$emit('change', $event)"
    append-icon="las la-angle-down"
    :full-width="false"
    filled
    hide-details
    dense
    v-bind="$attrs"
  ></v-select>
</template>

<script>
export default {
  props: {
    value: {
      default: ''
    }
  }
};
</script>
<style scoped>
.custom-select {
  border: none;
  border-radius: 5px !important;
}
</style>
<style>
.v-select--filled > .v-input__control > .v-input__slot {
  background: var(--v-backgroundSecondary-base) !important;
}

.custom-select > .v-input__control > .v-input__slot:before {
  display: none !important;
}
.custom-select > .v-input__control > .v-input__slot:after {
  display: none !important;
}

.v-select .v-icon.v-icon {
  font-size: 14px;
}
</style>
