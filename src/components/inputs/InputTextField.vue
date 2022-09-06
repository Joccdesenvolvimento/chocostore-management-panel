<template>
  <v-text-field
    hide-details="auto"
    dense
    outlined
    @input="$emit('input', $event)"
    :value="value"
    :hint="hint"
    @keyup="$emit('keyup', $event)"
    @change="$emit('change', $event)"
    v-bind="$attrs"
  ></v-text-field>
</template>

<script>
export default {
  props: {
    value: {
      default: ''
    },
    hint: {
      default: ''
    }
  }
};
</script>
