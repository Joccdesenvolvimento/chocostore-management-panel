<template>
  <v-speed-dial
    v-model="fab"
    fixed
    bottom
    right
    direction="left"
    transition="slide-y-reverse-transition"
    v-bind="$attrs"
  >
    <template v-slot:activator>
      <v-btn
      class="adc_button"
      elevation="0"
        v-model="fab"
        color="primary"
        fab
        @click="$emit('clickFloating')"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>
    <slot></slot>
  </v-speed-dial>
</template>

<script>
export default {
  data: () => ({
    fab: false
  })
};
</script>

<style>
.top-left-speed-dial .v-speed-dial__list {
  top: -75px !important;
  right: 80% !important;
}

.list-floating {
  border: 1px solid var(--v-border-base) !important;
  border-radius: 8px 8px 0px 8px !important;
}

.list-floating .v-list-item__icon {
  margin: 10px 5px !important;
}

.floating-button-footer {
  right: 40px !important;
  bottom: 40px !important;
}

@media (max-width: 960px) {
.floating-button-footer {
  right: 0.6rem !important;
  bottom: 0.6rem !important;
}

.adc_button{
  max-height: 50px;
  max-width: 50px;
}

}


</style>
