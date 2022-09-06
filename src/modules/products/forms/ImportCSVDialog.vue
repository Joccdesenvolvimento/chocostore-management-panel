<template>
  <div class="text-center">
    <v-dialog persistent v-model="showDialog" width="500">
      <v-card>
        <v-card-title class="headline lighten-1" primary-title
          >Importar produtos</v-card-title
        >
        <v-card-text>
          <v-file-input v-model="csv" accept=".csv"> </v-file-input>
          <small>* os produtos com códigos barras já existente serão sobrescritos</small>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" class="mr-4" text @click="$emit('close')"
            >Cancelar</v-btn
          >
          <v-spacer></v-spacer>
          <ButtonPrimary :disabled="disabledButtonSave" @click="readCsv"
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
import Papa from 'papaparse';

import { utilsBr, validateBr } from 'js-brasil';
import { createNamespacedHelpers } from 'vuex';
const { mapActions } = createNamespacedHelpers('products');

export default {
  props: {
    showDialog: {
      type: Boolean
    }
  },
  data() {
    return {
      csv: [],
      disabledButtonSave: false,
      showNotify: false,
      colorMessage: '',
      message: ''
    };
  },
  methods: {
    ...mapActions(['createProductArray']),
    readCsv() {
      this.disabledButtonSave = true;

      Papa.parse(this.csv, {
	      encoding: 'ISO-8859-1',
        complete: results => {
          const rows = results.data;
          const order = rows.splice(0, 1);

          const products = [];
          try {
            rows.forEach(product => {
              if (product.length == 4) {
                products.push(this.readProduct(product));
              }else{
                throw 'Todos os produtos devem conter código de barras, nome, preço e código da categoria';
              }
            });
            
            this.saveProducts(products);
          } catch (err) {
            this.disabledButtonSave = false;
            alert(err);
          }
        }
      });
    },
    async saveProducts(products) {
      try {
        
        await this.createProductArray({ products });
        this.showMessage('Importado com sucesso!', 'primary');

        this.$emit('close', true);
      } catch (err) {
        
        this.showMessage(err.response.data.errors[0].message);
      }
      this.disabledButtonSave = false;
    },
    readProduct(rowCsv) {
      const price = rowCsv[2].includes(",") ? utilsBr.currencyToNumber(rowCsv[2] + '') : parseFloat(rowCsv[2]);
      
      if (rowCsv.length != 4)
        throw 'Todos os produtos devem conter código de barras, nome, preço e código da categoria';
      return {
        barCode: rowCsv[0],
        name: rowCsv[1],
        price,
        categoryId: +rowCsv[3]
      };
    },
    showMessage(message, color = '') {
      this.message = message;
      this.colorMessage = color;
      this.showNotify = true;
    }
  }
};
</script>
