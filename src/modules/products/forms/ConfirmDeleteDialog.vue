<template>
  <div class="text-center">
    <v-dialog persistent v-model="showDialog" width="500">
      <v-card>
        <v-card-title class="headline lighten-1" primary-title
          >Excluir</v-card-title
        >
        <v-card-text>{{ description }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" class="mr-4" text @click="$emit('close')"
            >Cancelar</v-btn
          >
          <ButtonPrimary :disabled="disableButton" @click="onConfirm"
            >Confirmar!</ButtonPrimary
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
export default {
  props: {
    showDialog: {
      type: Boolean,
    },
    description: '',
    typeToDelete: {
      default: 'product',
    },
    ids: {},
  },
  data() {
    return {
      showNotify: false,
      disableButton: false,
      colorMessage: '',
      message: '',
      deleteOptions: {
        product: async (id) => {
          await this.deleteProduct({ id });
        },
        category: async (id) => {
          await this.deleteCategory({ id });
        },
        variation: async (id) => {
          await this.deleteVariation({ id });
        },
        banner: async (id) => {
          await this.deleteBanner({ id });
        },
        highlight: async(id)=>{
          await this.deleteHighlight({id});
        }
      },
      deleteMessages: {
        product: 'Produto(s) excluído(s) com sucesso!',
        category: 'Categoria(s) excluída(s) com sucesso!',
        variation: 'Variação excluída com sucesso!',
        banner: 'Banner(s) excluído(s) com sucesso!',
        highlight: 'Destaque(s) excluído(s) com sucesso!'
      },
    };
  },
  methods: {
    ...mapActions([
      'deleteProduct',
      'deleteCategory',
      'deleteVariation',
      'deleteBanner',
      'deleteHighlight'
    ]),
    async onConfirm() {
      try {
        this.disableButton = true;
        for (const data of this.ids) {
          const idToDelete = data.id || data;

          const deleteData = this.deleteOptions[this.typeToDelete];
          const deletedData = await deleteData(idToDelete);
        }

        this.showMessage(this.deleteMessages[this.typeToDelete]);

        this.disableButton = false;
        this.$emit('close', true);
      } catch (err) {
        let message = '';

        if (err.response.data && err.response.data.errors)
          message = err.response.data.errors[0].message;
        else if (this.typeToDelete == 'variation')
          message = 'Variações vinculadas a um produto não podem ser excluídas';
        else message = 'Erro ao excluir';

        this.disableButton = false;
        this.showMessage(message, 'normal');
        this.$emit('close', true);
      }
    },
    showMessage(message, color = 'primary') {
      this.message = message;
      this.colorMessage = color;
      this.showNotify = true;
    },
  },
};
</script>
