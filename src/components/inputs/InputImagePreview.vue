<template>
  <div>
    <label :for="imageInputLabel" v-if="!photoSelected" class="hover-pointer">
      <v-card
        outlined
        width="120px"
        color="backgroundSecondary"
        class="pa-2 text-center tw-flex tw-flex-col tw-items-center"
      >
        <CameraIcon />
        Adicionar foto
      </v-card>
    </label>

    <v-badge color="transparent" v-else>
      <template v-slot:badge>
        <v-btn xs-small icon color="gray" @click="removeFile">
          <v-icon>la-close</v-icon>
        </v-btn>
      </template>
      <label :for="imageInputLabel" class="hover-pointer">
        <v-hover v-slot:default="{ hover }">
          <v-img
            :src="photoSelectedWithoutCache"
            @error="$emit('errorLoad')"
            width="180"
            height="210"
            contain
            class="align-center"
            :class="{ 'opacity-low': hover }"
          >
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular
                  indeterminate
                  color="grey darken-1"
                ></v-progress-circular>
              </v-row>
            </template>
            <span :class="{ 'opacity-high': hover }" v-show="hover"
              >Alterar a imagem</span
            >
          </v-img>
        </v-hover>
      </label>
    </v-badge>

    <v-file-input
      v-show="false"
      :id="imageInputLabel"
      @change="changePhotoSelected"
      accept="image/*"
    >
    </v-file-input>
  </div>
</template>

<script>
export default {
  props: {
    url: {
      default: null,
    },
    imageInputLabel: {
      type: String,
      default: 'imageInput',
    },
    reset: null,
  },
  data() {
    return {
      photoSelected: null,
    };
  },
  computed: {
    photoSelectedWithoutCache: {
      get() {
        if (this.photoSelected.startsWith('blob:')) {
          return this.photoSelected;
        }
        return `${this.photoSelected}?${Date.now()}`;
      },
      set() {
        this.photoSelected = null;
      },
    },
  },
  methods: {
    removeFile() {
      //this.photoSelected = null;
      this.url = null;
      this.photoSelectedWithoutCache = null;
      this.$emit('change', null);
      this.$emit('remove', null);
    },
    changePhotoSelected(file) {
      this.photoSelected = URL.createObjectURL(file);
      this.$emit('change', file);
    },
  },
  watch: {
    /* imageInputLabel(val) {
    },
    photoSelected(val) {
    }, */
    url(value) {
      if (value) {
        this.photoSelected = value;
      } else {
        this.photoSelected = null;
      }
    },
    reset() {
      this.removeFile();
    },
  },
};
</script>

<style>
.opacity-low .v-image__image {
  opacity: 0.1;
  transition: 0.2s;
}
.opacity-medium .v-image__image {
  opacity: 0.5;
  transition: 0.2s;
}

.opacity-high {
  opacity: 1 !important;
  transition: 0.5s;
}
</style>