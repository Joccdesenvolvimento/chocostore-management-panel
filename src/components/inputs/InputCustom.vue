<template>
  <div>
    <v-sheet
      class="px-3 py-3 d-flex tw-flex-col align-center justify-space-between"
      :class="{ transparent: isTransparent }"
      relative
      @click.stop
    >
      <label v-if="label">{{ label }}</label>
      <!-- <LineBorder
        v-if="lineBorder"
        :color="color"
        v-bind="lineBorder"
      />-->
      <span v-if="text" class="pl-1">{{ text }}</span>
      <v-text-field
        v-if="input"
        type="number"
        :value="value"
        class="text-field-custom"
        v-bind="textFieldOptions"
        @keyup="$emit('keyup', $event)"
        @input="$emit('input', $event)"
        @change="$emit('change', $event)"
      ></v-text-field>
      <InputNumber
        v-if="number"
        :value="value"
        :max="max"
        :isArrowsDisabled="isArrowsDisabled"
        :allowNegativeNumbers="allowNegativeNumbers"
        style="margin-left: 10px"
        :textFieldOptions="textFieldOptions"
        @input="$emit('input', $event)"
      />

      <div v-if="list" class="d-flex">
        <v-icon
          :disabled="disableDecrement"
          small
          color="black"
          class="no-focus"
          @click.stop="decrement"
          >las la-angle-left</v-icon
        >
        <div v-if="list">
          <v-text-field
            :value="listItems[accum].name"
            class="no-border-text-field no-spacing text-center"
            @click.stop
            v-bind="textFieldOptions"
          ></v-text-field>
        </div>
        <v-icon
          :disabled="disableIncrement"
          small
          color="black"
          class="no-focus"
          @click.stop="increment"
          >las la-angle-right</v-icon
        >
      </div>
    </v-sheet>
  </div>
</template>

<script>
export default {
  data() {
    return {
      accum: 0,
    };
  },
  props: {
    input: {
      type: Boolean,
      default: false,
    },
    allowNegativeNumbers: {
      default: false,
    },
    number: {
      type: Boolean,
      default: false,
    },
    list: {
      type: Boolean,
      default: false,
    },
    max: {
      type: Number,
      required: false,
      default: null,
    },
    isTransparent: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: 'success',
    },
    isArrowsDisabled: {
      type: Boolean,
      default: false,
    },
    reset: null,
    text: {},
    label: {},
    textFieldOptions: {},
    value: { default: 0 },
    listItems: [],
    lineBorder: {},
  },
  mounted() {
    this.accum = this.value;
    this.$emit('change', this.accum);
  },
  watch: {
    accum() {
      this.$emit('change', this.accum);
      this.$emit('changeString',this.listItems[this.accum].name);
    },
    reset(){
      this.accum = 0
      this.$emit('change', 0);
      this.$emit('changeString',this.listItems[this.accum].name);
    }
  },
  methods: {
    increment() {
      this.accum++;
    },
    decrement() {
      this.accum--;
    },
  },
  computed: {
    disableDecrement() {
      if (this.accum <= 0) {
        return true;
      }
      return false;
    },
    disableIncrement() {
      if (this.accum >= this.listItems.length - 1) {
        return true;
      }
      return false;
    },
  },
};
</script>

<style scoped>
.v-sheet {
  background: var(--v-backgroundSecondary-base);
}
.transparent {
  background-color: 'transparent';
}
</style>
