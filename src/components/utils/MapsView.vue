<template>
  <v-dialog
    v-model="showModal"
    width="700"
  >
    <v-card>
      <v-card-title>
        <span>Localização</span>
      </v-card-title>
      <v-card-text >
        <iframe
          width="100%"
          height="300"
          frameborder="0"
          style="border:0"
          :src="url_maps"
          allowfullscreen
        ></iframe>
      </v-card-text>
      <v-card-actions class="card-actions">
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          text
          @click="$emit('close', $event)"
        >Fechar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    showModal: {
      default: false
    },
    location: {
      type: String,
      default: 'Rua+Guilherme+Tartarotti,240,404,Farroupilha'
    }
  },
  data () {
    return {
      googleMapsKey: "AIzaSyAts95Yws3HjaM2JrTBCAErjzB5Ydtg454"
    };
  },
  computed: {
    url_maps () {
      return (
        'https://www.google.com/maps/embed/v1/place?key=' +
        this.googleMapsKey +
        '&q=' +
        this.location
      );
    }
  }
};
</script>
<style scoped>
.card-actions {
  padding-top: 10px !important;
}
.v-dialog>.v-card>.v-card__subtitle, .v-dialog>.v-card>.v-card__text{
  padding: 0.2rem 1rem !important;
}
</style>
