<template>
  <div>
    <v-menu
      ref="menu"
      v-model="menuDatePicker"
      :close-on-content-click="false"
      transition="scale-transition"
      offset-y
      min-width="290px"
    >
      <template v-slot:activator="{ on }">
        <v-text-field
          :value="value"
          @input="$emit('input', $event)"
          :label="label"
          v-on="on"
          v-bind="textFieldOptions"
          v-if="!inputHide"
        ></v-text-field>
        <span v-else></span>
      </template>
      <v-date-picker
        ref="picker"
        locale="pt-BR"
        no-title
        :value="value"
        @input="change"
        v-bind="datePickerOptions"
      ></v-date-picker>
    </v-menu>
  </div>
</template>
<script>
export default {
  props: {
    label: {},
    value: {},
    textFieldOptions: {},
    datePickerOptions: {},
    isDatePickerVisible: false,
    inputHide: false,
  },
  methods: {
    change(event) {
      this.menuDatePicker = false;
      this.$emit('input', event);
    },
    printOn(on) {
      console.log(on);
    },
  },
  watch: {
    isDatePickerVisible(newValue) {
      if (this.menuDatePicker != newValue) {
        this.menuDatePicker = newValue;
      }
    },
    menuDatePicker(newValue) {
      if (this.isDatePickerVisible != newValue) {
        if(newValue) this.$emit('openMenu', event);
        else this.$emit('closeMenu', event);
      }
    },
  },
  data() {
    return {
      menuDatePicker: false,
    };
  },
};
</script>
