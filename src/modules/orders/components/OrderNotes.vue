<template>
<div>
  <v-card v-if="!isMobile" class="hidden-sm-and-down" outlined>
    <v-card-title >Observação</v-card-title>
    <v-card-text>
      <div class="d-flex flex-column justify-space-between">
        <div>
          <span>{{ order.notes }}</span>
        </div>
      </div>
    </v-card-text>
  </v-card>
  <div v-if="isMobile" class="hidden-md-and-up block">
    <!-- <v-icon class="mr-10">la-pencil-alt </v-icon> -->
    <p class="fontTitle">Observação</p>
    <!-- <v-icon class="ml-10">la-pencil-alt </v-icon>-->
    <div class="fontText">
      <div class="d-flex flex-column justify-space-between">
        <div>
          <span v-if="order.notes != ' '"> SEM OBSERVAÇÕES</span>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
export default {
  props: {
    order: {},
    isMobile: { default: false },
  }
};
</script>

<style>
.fontText {
  font-size: 1rem;
}

.fontTitle {
  font-size: 1.3rem;
}

.block {
  margin: 0rem 0.5rem;
  padding: 1rem 0rem;
  text-align: center;
  /* box-sizing: border-box;
  border-top: 0.2rem solid #cccccfad;
  border-radius: 2%; */
}
</style>
