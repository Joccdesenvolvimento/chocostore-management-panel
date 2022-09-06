<template>
  <v-card
    class="card-button d-flex justify-center no-border-and-box-shadow"
    outlined
    relative
    @click="$emit('click', $event)"
    v-bind="$attrs"
  >
    <v-btn
      text
      small
      :ripple="false"
      absolute
      color="white"
      style="bottom:5px"
    >{{$attrs.buttonText}}</v-btn>
  </v-card>
</template>
<style scoped>
.card-button {
  height: 90px;
  width: 130px;
}
</style>
