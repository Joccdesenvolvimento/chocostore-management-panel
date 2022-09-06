<template>
  <v-col height="100%" cols="auto" class="px-0 py-0 fill-height">
    <v-card
      class="px-3 py-0 fill-height"
      height="100%"
      outlined
      :loading="loading"
    >
      <template slot="progress">
        <v-progress-linear
          color="primary"
          height="3"
          indeterminate
        ></v-progress-linear>
      </template>
      <v-row class="fill-height" no-gutters>
        <v-col xs="12" md="7" cols="12" class="px-2 py-0 text-center">
          <v-list-item two-line>
            <v-list-item-content class="pt-4">
              <v-list-item-title class="mb-1">
                {{ title }}
              </v-list-item-title>
              <v-list-item-subtitle v-if="tooltip.title && tooltip.desc">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <span
                      style="
                        display: flex;
                        align-items: baseline;
                        justify-content: center;
                      "
                      v-bind="attrs"
                      v-on="on"
                    >
                      <p style="font-size: 14px">{{ tooltip.title }}</p>
                      <p style="font-size: 12px; padding-left: 4px">(?)</p>
                    </span>
                  </template>
                  <span>{{ tooltip.desc }}</span>
                </v-tooltip>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-card-actions>
            <v-row no-gutters justify="space-between">
              <ButtonSecondary
                class="my-2"
                @click="document.getElementById(inputImageId).click()"
              >
                Alterar
              </ButtonSecondary>
              <ButtonSecondary @click="removePhoto" class="my-2">
                Remover
              </ButtonSecondary>
            </v-row>
          </v-card-actions>
        </v-col>
        <v-col xs="12" md="5" cols="12" align-self="center" align="center" >
          <v-card flat>
            <v-card
              @click="isZoomModalOpen = true"
              flat
              v-if="localUrl"
              class="hover-pointer"
              ><v-img
                :src="photoUrl"
                contain
                class="text-center tw-flex tw-flex-col py-4 tw-items-center"
              >
                <template v-slot:placeholder>
                  <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                  >
                    <v-progress-circular indeterminate color="primary">
                    </v-progress-circular>
                  </v-row>
                </template>
              </v-img>
            </v-card>

            <v-card
              v-else
              outlined
              color="backgroundSecondary"
              class="text-center tw-flex tw-flex-col py-4 tw-items-center"
            >
              <CameraIcon />
              Sem Foto
            </v-card>
          </v-card>
        </v-col>
      </v-row>
    </v-card>
    <v-file-input
      @click="$event.target.value = ''"
      @change="photoChanged"
      v-show="false"
      :id="inputImageId"
      accept="image/*"
      v-bind="$attrs"
    >
    </v-file-input>

    <v-dialog v-model="isZoomModalOpen" width="65vw">
      <template v-slot:activator="{ on }">
        <slot name="activator" :on="on"></slot>
      </template>
      <div class="tw-flex tw-flex-col">
        <v-btn
          color="white"
          outlined
          class="align-self-end"
          icon
          @click="isZoomModalOpen = false"
        >
          <v-icon color="white">mdi-window-close</v-icon>
        </v-btn>
        <v-img
          min-width="100%"
          min-height="100%"
          :src="photoUrl"
          class="text-center tw-flex tw-flex-col py-4 tw-items-center"
          contain
        >
          <template v-slot:placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular indeterminate color="primary">
              </v-progress-circular>
            </v-row>
          </template>
        </v-img>
      </div>
    </v-dialog>
  </v-col>
</template>
<script>
export default {
  props: {
    title: {
      default: 'Input',
    },
    loading: {
      default: false,
    },
    url: {
      default: null,
    },
    inputImageId: {
      default: 'inputImage',
    },
    tooltip: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      document,
      isZoomModalOpen: false,
      localUrl: null,
    };
  },
  computed: {
    photoUrl: {
      get: function () {
        if (this.localUrl.startsWith('blob:')) {
          return this.localUrl;
        }
        return `${this.localUrl}?${Date.now()}`;
      },
      set: function (value) {
        return value;
      },
    },
  },
  methods: {
    photoChanged(file) {
      this.localUrl = URL.createObjectURL(file);
      this.$emit('changed', {
        file: file,
        id: this.inputImageId,
        url: this.localUrl,
      });
    },
    removePhoto() {
      this.localUrl = null;
      this.photoUrl = null;
      this.$emit('changed', { file: null, id: this.inputImageId, url: null });
    },
  },
  watch: {
    url(value) {
      if (value) this.localUrl = value;
    },
  },
  mounted() {
    /*   if (this.url) {
            this.localUrl = this.url
        } */
  },
};
</script>
<style>
.v-dialog {
  box-shadow: none;
}
</style>