<template>
  <div>
    <div class="button-toggle-menu text-center">
      <v-btn icon @click="$emit('toggleMenu')">
        <v-icon
          class="icon-toggle-modules icon-toggle"
          size="18"
          :class="{ 'primary--text': statusMenu >= 1 }"
        >la-bars</v-icon>
        <v-icon
          class="icon-toggle-submenu icon-toggle"
          size="18"
          :class="{ 'primary--text': statusMenu == 2 }"
        >la-bars</v-icon>
      </v-btn>
    </div>
  </div>
</template>
<script>

export default {
  name: 'ToggleMenuIcon',
  props: {
    statusMenu: Number
  }
};
</script>
<style scoped>

.v-input__icon--clear .v-icon {
  font-size: 18px !important;
}

.icon-toggle-modules {
  width: 7px!important;
  min-width: 7px !important;
  margin-left: 3px;
  margin-right: 1px;
  overflow: hidden;
}

.button-toggle-menu {
  width: 90px;
}
</style>
