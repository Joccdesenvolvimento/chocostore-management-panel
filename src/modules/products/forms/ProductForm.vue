<template>
  <div>
    <v-dialog
      v-model="dialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <template v-slot:activator="{ on }">
        <slot name="activator" :on="on"></slot>
      </template>
      <v-card class="noBoxShadow">
        <v-card-title>
          <v-btn icon @click="$emit('close', $event)">
            <v-icon>la-angle-left</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <ProductFormInputs
            @close="$emit('close', $event)"
            @onSubmit="onSubmitProductForm"
            :dialogTitle="dialogTitle"
            :productToEdit="product"
            :isSaving="isSaving"
          />
        </v-card-text>
      </v-card>
      <v-snackbar
        v-if="notifyType == 'error'"
        app
        v-model="showNotify"
        :color="colorMessage"
      >
        {{ message }}
        <v-btn
          :color="colorMessage == 'primary' ? 'white' : 'red'"
          icon
          @click="showNotify = false"
        >
          <v-icon>la la-close</v-icon>
        </v-btn>
      </v-snackbar>
    </v-dialog>
    <v-snackbar
      v-if="notifyType == 'success'"
      app
      v-model="showNotify"
      :color="colorMessage"
    >
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
const { mapActions } = createNamespacedHelpers('products');

import ProductFormInputs from './ProductFormInputs';

import { createNamespacedHelpers } from 'vuex';
import formdata from 'form-data';
// import axios from 'axios';

import moment from 'moment';

moment.locale('pt-br');

export default {
  components: {
    ProductFormInputs,
  },
  props: {
    dialogTitle: {
      type: String,
      default: 'Cadastro de produto',
    },
    dialog: {
      type: Boolean,
      default: false,
    },
    product: {},
  },
  data() {
    return {
      isSaving: false,
      showNotify: false,
      colorMessage: '',
      message: '',
      notifyType: '',
    };
  },
  methods: {
    ...mapActions([
      'createProduct',
      'editProduct',
      'deletePromotion',
      'boostPromotion',
      'findBoostHistoric',
    ]),

    async onSubmitProductForm({ product, enabledButtonSave, clear, dataSheets }) {
      this.isSaving = true;
      try {
        let formData = new formdata();

        if (!product.description) product.description = '';
        if (product.stock === null) product.stock = '';
        formData.append('name', product.name);
        formData.append('barCode', product.barCode != undefined ? product.barCode : '');
        formData.append('price', product.price);
        formData.append('cashback', product.cashback);
        if (product.categoryId && product.categoryId != undefined) {
          formData.append('categoryId', product.categoryId);
        }
        console.log(product.photo)
        formData.append('photo', product.photo);
        formData.append('description', product.description);
        formData.append('status', product.status);
        formData.append('isExternal', product.isExternal);
        formData.append('stock', product.stock);
        formData.append('dataSheets', JSON.stringify(dataSheets));

        if (!product.variations) product.variations = [];
        formData.append(
          'variations',
          JSON.stringify(product.variations.map((v) => v.id))
        );

        if (product.promotion) {
          delete product.promotion.product;

          if (!product.promotion.durationInDays) {
            delete product.promotion.endsAt;
          } else {
            product.promotion.endsAt = moment().add(
              product.promotion.durationInDays,
              'days'
            );
          }
          formData.append('promotion', JSON.stringify(product.promotion));
        }

        let promotionsToDelete = null;

        if (Array.isArray(product.promotionsToDelete))
          promotionsToDelete = [...product.promotionsToDelete];

        delete product.promotionsToDelete;

        if (!product.id) {
          await this.createProduct({ product: formData});
        } else {
          if (promotionsToDelete) {
            for (let i = 0; i < promotionsToDelete.length; i++) {
              await this.deletePromotion({ id: promotionsToDelete[i] });
            }
          }

          formData.append('id', product.id);
          await this.editProduct({ product: formData });
        }

        if (product.promotion) {
          await this.findBoostHistoric();
        }

        this.showMessage('Salvo com sucesso!', 'success', 'primary');

        enabledButtonSave();
        this.isSaving = false;
        this.$emit('close');
        clear();
      } catch (err) {
        console.log(err)
        enabledButtonSave();
        this.isSaving = false;

        this.showMessage(err.response.data.errors[0].message, 'error');
      }
    },
    showMessage(message, type, color = '') {
      this.message = message;
      this.colorMessage = color;
      this.showNotify = true;
      this.notifyType = type;
    },
  },
};
</script>

<style scoped>
.v-dialog {
  overflow-y: hidden;
}

.noBoxShadow {
  box-shadow: none !important;
}
</style>
