<template>
  <div>
    <div class="d-flex">
      <v-icon :disabled="isArrowsDisabled" small color="black" class="no-focus" @click.stop="decrement">las la-angle-left</v-icon>
      <div>
        <v-text-field
          :value="value"
          class="no-border-text-field no-spacing text-center"
          @change="changeInput"
          @click.stop
          :rules="[rules.number]"
          type="number"
          v-bind="textFieldOptions"
        ></v-text-field>
      </div>
      <v-icon :disabled="isArrowsDisabled" small color="black" class="no-focus" @click.stop="increment">las la-angle-right</v-icon>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    input: {
      type: Boolean,
      default: false
    },
    allowNegativeNumbers: {
      default: false
    },
    max: {
      type: Number,
      required: false,
      default: null
    },
    isArrowsDisabled: {
      type: Boolean,
      default: false
    },
    textFieldOptions: {},
    value: {}
  },
  methods: {
    increment() {
      if(this.max == null || this.value < +this.max) this.$emit('input', parseInt(this.value) + 1 || 0);
    },
    decrement() {
      if (this.value > 0 || this.allowNegativeNumbers) this.$emit('input', parseInt(this.value) - 1 || 0);
    },
    changeInput(value) {
      this.$emit('input', value);
    }
  },
  data() {
    return {
      rules: {
        number: value =>
          !Number.isNaN(value) || 'Digite apenas números inteiros'
      }
    };
  }
};
</script>

<style>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type='number'] {
  -moz-appearance: textfield;
}
</style>
