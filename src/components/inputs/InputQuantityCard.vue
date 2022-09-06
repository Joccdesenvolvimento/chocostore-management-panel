<template>
  <div class="quantity-button-container">
    <div class="quantity-button-text">
      <p class="small-text" v-if="text">{{ text }}</p>
      <input
        type="number"
        class="input-quantity-button-text-number"
        :value="value"
        :disabled="disabled"
        @keyup="handleKeyUp"
      />
    </div>
    <div class="quantity-button-actions" v-if="!disabled">
      <v-icon @click="decrement">la la-minus</v-icon>
      <v-icon @click="increment">la la-plus</v-icon>
    </div>
  </div>
</template>

<script>
import { currency } from '@/utils/helpers/currency';

export default {
  props: {
    text: {
      type: String,
      default: null,
    },
    value: {
      type: Number,
      default: null,
    },
    min: {
      type: Number,
      default: null,
    },
    max: {
      type: Number,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    decrement() {
      let newValue = this.value;
      if (this.min && this.value <= this.min) {
        newValue = this.min;
      } else {
        newValue--;
      }

      this.$emit('input', newValue);
    },
    handleKeyUp(e) {

      let newValue = e.target.value;

      if (this.min && newValue <= this.min) {
        newValue = this.min;
      }

      if (this.max && newValue >= this.max) {
        newValue = this.max;
      }

      this.$emit('input', newValue);
    },
    increment() {
      let newValue = this.value;
      if (this.max && this.value >= this.max) {
        newValue = this.max;
      } else {
        newValue++;
      }

      this.$emit('input', newValue);
    },
  },
};
</script>

<style>
.quantity-button-container {
  display: flex;
  justify-content: space-between;
  font-size: 0.2rem;
  border: 1px solid #d9d9d9;
  border-radius: 1rem;
  padding: 1rem;
  min-height: 6.2rem;
}
.quantity-button-actions .v-icon {
  border: 1px solid #555555;
  border-radius: 50rem;
  padding: 0.2rem;
  font-size: 1rem;
}
.quantity-button-text {
  /* max-width: 6rem; */
  display: flex;
  flex-direction: column;
  margin-right: 2rem;
}
.input-quantity-button-text-number {
  font-size: 1.2rem;
  outline: none;
}
</style>
