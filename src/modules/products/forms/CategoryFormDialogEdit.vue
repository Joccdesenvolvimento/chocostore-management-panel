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
              <v-col cols="6" class="tw-px-0 tw-flex tw-justify-center">
                <InputImagePreview
                  :value="category.photo"
                  @remove="category.photo = null"
                  @change="changePhoto"
                  @errorLoad="photoUrl = ''"
                  :url="photoUrl"
                />
              </v-col>
              <v-col cols="6" class="tw-px-0 tw-flex tw-justify-center">
                <v-switch
                  style="width: 100px"
                  hide-details
                  v-model="category.isActive"
                  :label="`${category.isActive ? 'Ativa' : 'Inativa'}`"
                ></v-switch>
              </v-col>
            </v-row>
            <v-col cols="12" class="tw-px-0 tw-pt-6" align="center">
              <InputCustom
                number
                v-model="category.sortPosition"
                :allowNegativeNumbers="true"
                style="width: 100%"
                label="Ordem"
                color="red"
                :textFieldOptions="{ 'hide-details': true, dense: true }"
                :lineBorder="lineBorderOptions"
              />
            </v-col>
          </v-col>
        </v-card-text>

        <v-card-actions>
          <v-btn color="primary" class="mr-4" text @click="$emit('close')"
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
import awsUrls from '@/utils/aws-urls';
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
      lineBorderOptions: {
        top: '27px',
        size: '5px',
        height: '25px',
        left: true,
      },
      photoUrl: null,
    };
  },
  mounted() {
    if (this.category.photo) {
      this.photoUrl = `${awsUrls.AWS_URL}${awsUrls.FOLDER_CATEGORIES}${this.category.photo}`;
    } else {
      this.photoUrl = '';
    }
  },
  methods: {
    ...mapActions(['editCategory']),
    changePhoto(photo) {
      this.category.photo = photo;
    },
    async onSubmitCategoryForm() {
      this.disabledButtonSave = true;

      try {
        // const category = {
        //   description: this.category.description,
        //   sortPosition: this.category.sortPosition,
        //   isActive: this.category.isActive,
        //   id: this.category.id,
        // };
        let formData = new formdata();
        formData.append('description', this.category.description);
        formData.append('sortPosition', this.category.sortPosition);
        formData.append('isActive', this.category.isActive);
        formData.append('id', this.category.id);
        formData.append('photo', this.category.photo);
        // console.log(this.category)
        const response = await this.editCategory({ category: formData });

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
