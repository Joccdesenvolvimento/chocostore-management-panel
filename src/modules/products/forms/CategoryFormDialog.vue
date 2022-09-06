<template>
  <div class="text-center">
    <v-dialog persistent v-model="showDialog" width="500">
      <v-card>
        <v-card-title class="headline lighten-1" primary-title>{{
          title
        }}</v-card-title>

        <v-card-text
          style="display: flex; flex-direction: column; align-items: center"
        >
          <v-col cols="12">
            <v-text-field label="Nome" v-model="category.description" />
            <v-row class="tw-pt-4 d-flex justify-center">
              <v-col cols="6" class="tw-flex tw-justify-center">
                <InputImagePreview
                  :value="category.photo"
                  @remove="category.photo = null"
                  @change="changePhoto"
                />
              </v-col>
              <v-col cols="6" class="tw-flex tw-justify-center">
                <v-switch
                  style="width: 100px"
                  hide-details
                  v-model="category.isActive"
                  :label="`${category.isActive ? 'Ativa' : 'Inativa'}`"
                ></v-switch>
              </v-col>
            </v-row>
          </v-col>
        </v-card-text>

        <v-card-actions>
          <v-btn color="primary" class="mr-4" text @click="$emit('close', true)"
            >Cancelar</v-btn
          >
          <v-spacer></v-spacer>
          <ButtonPrimary
            :disabled="disabledButtonSave"
            @click="onSubmitCategoryForm"
            >Pronto!</ButtonPrimary
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="showNotify" :color="colorMessage">
      {{ message }}
      <v-btn
        :color="colorMessage == 'primary' ? 'white' : 'red'"
        icon
        @click="showNotify = false"
      >
        <v-icon>la la-close</v-icon>
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
const { mapActions } = createNamespacedHelpers('products');
import formdata from 'form-data';

export default {
  props: {
    showDialog: {
      type: Boolean,
    },
    title: {
      default: 'Cadastrar categoria',
    },
    category: {
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      disabledButtonSave: false,
      showNotify: false,
      colorMessage: '',
      message: '',
    };
  },
  watch: {
    showDialog() {
      this.category.isActive = true;
    },
  },
  methods: {
    ...mapActions(['createCategory', 'editCategory']),
    changePhoto(photo) {
      this.category.photo = photo;
    },
    async onSubmitCategoryForm() {
      this.disabledButtonSave = true;

      try {
        let formData = new formdata();
        formData.append('description', this.category.description);
        formData.append('isActive', this.category.isActive);
        formData.append('photo', this.category.photo);
        if (this.category.id) {
          formData.append('id', this.category.id);
          const response = await this.editCategory({ category: formData });
        } else {
          await this.createCategory({
            category: formData,
          });
        }

        this.showMessage('Categoria salva com sucesso!', 'primary');

        this.$emit('close', { loadLatestCategory: true });
      } catch (err) {
        this.showMessage(err.response.data.errors[0].message);
      }
      this.disabledButtonSave = false;
    },
    showMessage(message, color = '') {
      this.message = message;
      this.colorMessage = color;
      this.showNotify = true;
    },
  },
};
</script>
