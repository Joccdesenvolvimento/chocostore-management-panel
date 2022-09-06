<template>
  <div>
    <v-row no-gutters justify="center">
      <v-col cols="12" md="8">
        <v-row no-gutters>
          <v-col class="mb-6 tw-text-center md:tw-text-left" cols="12" md="6">
            <span class="title">{{ dialogTitle }}</span>
          </v-col>
          <v-col cols="12" md="6" class="d-flex md:tw-justify-end tw-justify-center">
            <InputSwitch :labels="labelsSwitch" :value="product.status" @change="product.status = $event.value"
              default="Ativo" />
          </v-col>
        </v-row>

        <v-row no-margin>
          <v-col cols="12">
            <InputTextField label="Nome" v-model="product.name" />
          </v-col>
        </v-row>

        <v-row no-margin>
          <v-col cols="12" md="6">
            <InputTextField label="Código" :disabled="isDisableBarCode" v-model="product.barCode" />
          </v-col>

          <v-col cols="12" md="6">
            <v-autocomplete dense outlined label="Categoria" append-icon="las la-angle-down"
              v-model="product.categoryId" :items="categories" hide-details item-text="description" item-value="id"
              no-data-text="Não há categoria cadastrada">
              <v-list-item slot="prepend-item" ripple @click="showDialog = true">
                <v-list-item-action>
                  <v-icon>la-plus</v-icon>
                </v-list-item-action>
                <v-list-item-content>Adicionar</v-list-item-content>
              </v-list-item>
            </v-autocomplete>
          </v-col>
        </v-row>

        <v-row no-margin>
          <v-col cols="12" md="6">
            <v-textarea dense outlined :rules="descriptionRules" :counter="400" rows="5" label="Descrição"
              v-model="product.description"></v-textarea>
          </v-col>
          <v-col cols="12" md="6" class="d-flex justify-center">
            <InputImagePreview :imageInputLabel="imageInputLabel" :value="product.photo"
              @remove="product.isExternal = false" @errorLoad="urlExternal = ''" :url="urlExternal" :reset="reset"
              @change="changePhoto" />
          </v-col>
        </v-row>

        <!-- <v-row no-margin>
          <v-col>
            <v-autocomplete
              outlined
              dense
              chips
              v-model="product.variations"
              :items="variations"
              item-text="internalName"
              item-value="id"
              label="Variações"
              deletable-chips
              clearable
              hide-detail
              return-object
              multiple
              small-chips
              flat
              no-data-text="Não existem variações cadastradas"
            >
              <v-list-item
                slot="prepend-item"
                ripple
                @click="showDialogVariation = true"
              >
                <v-list-item-action>
                  <v-icon>la-plus</v-icon>
                </v-list-item-action>
                <v-list-item-content>Adicionar</v-list-item-content>
              </v-list-item>
            </v-autocomplete>
          </v-col>
        </v-row> -->
        <v-row no-gutters class="d-flex tw-justify-between">
          <v-col md="5" cols="12">
            <div class="fill-height">
              <div :class="product.price == 0 ? 'py-2' : ''"
                class=" d-flex flex-grow-1 tw-justify-between tw-mx-6 tw-items-center">
                <p class="subtitle-1">Preço</p>
                <v-btn plain v-show="product.price > 0" large depressed @click="handleClickPromotionButton">
                  <div class="subtitle-2 link-button-text">
                    {{
                        buttonPromotionText
                    }} promoção
                  </div>
                </v-btn>
                <!-- <p class="subtitle-1">Preço</p> -->
              </div>

              <div class="d-flex tw-flex-row promotion-mini-card">
                <span class="money-sign mr-2 d-flex align-center">R$</span>
                <div class="align-center">
                  <input pattern="^\$\d{1,3}(,\d{3})*(\.\d+)?$" type="number"
                    :class="hasPromotion ? 'line-through' : ''" class="
                    input-quantity-button-text-number
                    tw-text-center
                    md:tw-text-left
                  " :disabled="hasPromotion" v-model="product.price" @keyup="verifyPriceMasks" />
                </div>

                <div class="mx-auto promotion-details" v-if="hasPromotion">
                  <p class="promotion-mini-card_text">
                    {{ isMobile ? 'Promocional:' : 'Promocional' }}
                  </p>
                  <p class="promotion-mini-card_title">
                    R$
                    {{ product.promotion && product.promotion.promotionalPrice }}
                  </p>
                </div>
                <div class="promotion-details" v-if="product.promotion && product.promotion.durationInDays">
                  <p class="promotion-mini-card_text">
                    {{ isMobile ? 'Duração:' : 'Duração' }}
                  </p>
                  <p class="promotion-mini-card_title">
                    {{ product.promotion.durationInDays }} dia(s)
                  </p>
                </div>
              </div>

            </div>
          </v-col>

          <v-col v-show="product.price > 0" md="5" cols="12">
            <div fill-height d-flex flex-column>
              <div class=" d-flex flex-grow-1 tw-justify-between tw-mx-6 tw-items-center py-2">
                <p class="subtitle-1">Cashback</p>
                <p v-show="product.cashback > 100 || product.cashback < 0" class="subtitle-3 red--text">*Deve ser entre
                  0-100</p>
              </div>

              <div class="d-flex tw-flex-row promotion-mini-card">
                <span class="money-sign mr-2 d-flex align-center">%</span>
                <div class="align-center">
                  <input pattern="^\$\d{1,3}(,\d{3})*(\.\d+)?$" type="number" class="
                    input-quantity-button-text-number
                    tw-text-center
                    md:tw-text-left
                  " v-model="product.cashback" @keyup="verifyCashbackMasks" />
                </div>
                <div class="mx-auto promotion-details" v-show="product.cashback > 0 && product.cashback <= 100">
                  <p class="promotion-mini-card_text">
                    Total
                  </p>
                  <p class="promotion-mini-card_title">
                    R$
                    {{ cashbackCurrency }}
                  </p>
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
        <v-row no-margin class="tw-pt-6">
          <v-col cols="12" md="4">
            <v-checkbox v-model="isControllingStock" @change="product.stock = isControllingStock ? stockProduct : null"
              :label="`Controlar estoque`"></v-checkbox>
          </v-col>
          <v-col cols="12" md="7" v-show="isControllingStock">
            <InputCustom number v-model="stockProduct" class="tw-w-19 tw-mb-4 md:tw-w-40 md:tw-mb-0" color="red"
              :textFieldOptions="{ 'hide-details': true, dense: true }" />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <span class="subtitle-1 font-weight-bold tw-pr-8">Ficha técnica</span>
            <v-col class="tw-px-0">
              <v-row>
                <v-col cols="12" md="4">
                  <InputTextField label="Título" v-model="dataSheet.title" />
                </v-col>
                <v-col cols="12" md="6">
                  <InputTextField label="Descrição" v-model="dataSheet.description" />
                </v-col>
              
                <v-col cols="12" md="2">
                  <div class="tw-flex">
                    <ButtonPrimary :disabled="
                      dataSheet.description.length <= 0 ||
                      dataSheet.title.length <= 0
                    " @click="addDataSheet">Adicionar</ButtonPrimary>
                    <v-btn class="tw-ml-2" icon color="gray" v-show="dataSheetItemArray.length > 0"
                      @click="removeDataSheet">
                      <v-icon>la-trash-alt</v-icon>
                    </v-btn>
                  </div>
                </v-col>
              </v-row>
            </v-col>
            <p v-if="dataSheetItemArray && dataSheetItemArray.length > 0">
              Ordene as fichas técnicas conforme será exibido no app
            </p>
            <v-data-table refresh v-if="dataSheetItemArray && dataSheetItemArray.length > 0" show-select
              :items="dataSheetItemArray" :headers="dataSheetsTable.headers" fixed-header height="100%"
              hide-default-footer id="mytable" class="striped tw-pt-4 tw-pb-16" no-data-text="Sem items cadastrados"
              no-results-text="Nenhum resultado encontrado" :mobile-breakpoint="0" v-model="selectedDataSheet"
              item-key="title" disable-pagination>
              <template v-slot:item.arrows="{ item, index }">
                <v-row v-if="dataSheetItemArray.length > 0">
                  <v-col cols="6" class="tw-px-0">
                    <v-btn :disabled="item.sequence + 1 >= dataSheetItemArray.length"
                      @click="sortProductsDataSheets('down', index, item)" icon block color="normal">
                      <v-icon>la-angle-down</v-icon>
                    </v-btn>
                  </v-col>
                  <v-col cols="6" class="tw-px-0">
                    <v-btn :disabled="item.sequence <= 0" @click="sortProductsDataSheets('up', index, item)" icon block
                      color="normal">
                      <v-icon>la-angle-up</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
              </template>
            </v-data-table>
          </v-col>
        </v-row>

        <v-row no-margin class="mt-6">
          <v-col cols="6">
            <v-btn depressed block @click="$emit('close', $event)" color="normal">Voltar</v-btn>
          </v-col>
          <v-col cols="6">
            <ButtonPrimary :loading="isSaving" :disabled="isDisabledButtonSave" block @click="onSubmit">Pronto!
            </ButtonPrimary>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <CategoryFormDialog @close="handleCategoryDialogClose" :showDialog="showDialog" />

    <VariationForm @close="handleCategoryDialogClose" :showDialog="showDialogVariation" />

    <PromotionFormModal :promotionProp="{ ...product.promotion }" :product="product"
      @close="isPromotionFormModalVisible = false" @deletePromotion="handleDeletePromotion"
      @submit="handlePromotionFormSubmit" :disabled="hasPromotion" :isVisible="isPromotionFormModalVisible" />
  </div>
</template>

<script>
import awsUrls from '@/utils/aws-urls';
import { createNamespacedHelpers } from 'vuex';

import CategoryFormDialog from './CategoryFormDialog';
import { mapProduct } from './../utils/helpers/products';

import differenceInDaysBetweenDates from '../submodules/promotions/utils/helpers/dates-difference-in-days';

const { mapState, mapGetters } = createNamespacedHelpers('products');

import PromotionFormModal from '../submodules/promotions/modals/PromotionFormModal';

import VariationForm from './VariationForm.vue';

export default {
  components: {
    CategoryFormDialog,
    PromotionFormModal,
    VariationForm,
  },
  props: {
    dialogTitle: {
      type: String,
      default: 'Cadastro de produto',
    },
    productToEdit: {},
    isSaving: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    console: () => console,
    ...mapState(['categories']),
    ...mapGetters(['getProductWithoutMasks', 'variations']),
    idProductToEdit() {
      return this.productToEdit ? this.productToEdit.id : null;
    },
    imageInputLabel() {
      if (+this.idProductToEdit > 0) return 'imageInputEdit';

      return 'imageInputRegister';
    },
    buttonPromotionText() {
      return this.hasPromotion ? 'Visualizar' : 'Criar';
    },
    hasPromotion() {
      return this.product.promotion && this.product.promotion.promotionalPrice;
    },
    cashbackCurrency: {
      get() {
        return this.setCashbackCurrency()
      },
      set() {
        this.cashbackCurrency = this.setCashbackCurrency()
      }
    }
  },
  data() {
    return {
      dataSheetsTable: {
        headers: [
          { text: 'Título', value: 'title', width: '35%', sortable: true },
          { text: 'Descrição', value: 'description', width: '50%' },
          { text: '', value: 'arrows', width: '15%' },
          // { text: 'Ativo', value: 'isActive', width: '15%' },
        ],
      },
      selectedDataSheet: [],
      //cashbackCurrency: 0,
      labelsSwitch: [{ name: 'Inativo' }, { name: 'Ativo' }],
      status: 'Ativo',
      isDisableBarCode: false,
      stockProduct: 0,
      // productsDataSheet: [],
      dataSheet: { title: '', description: '' },
      descriptionRules: [
        (v) =>
          (v != undefined && v.length <= 400) ||
          'A descrição deve ter no máximo 400 caracteres',
      ],
      reset: null,
      showDialogVariation: false,
      product: {
        id: this.idProductToEdit,
        status: 'Ativo',
        stock: null,
        photo: null,
      },
      isControllingStock: null,
      isDisabledButtonSave: false,
      urlExternal: '',
      showDialog: false,
      isPromotionFormModalVisible: false,
      dataSheetItemArray: [],
    };
  },
  mounted() {
    this.setProduct();
  },
  watch: {
    selectedDataSheet(val) {
      
    },
    /* 'product.cashback'(val) {
      if (this.product.cashback = 0) {
        this.product.cashback = val
      }
      if (this.product.cashback == '') {
        this.product.cashback = 0
      }

    }, */
    productToEdit(value) {
      this.setProduct();
    },
  },
  methods: {
    removeDataSheet() {
      this.selectedDataSheet.map((data) => {
        const index = this.dataSheetItemArray.findIndex(
          (p) => p.id === data.id
        );
        this.dataSheetItemArray.splice(index, 1);
      });
      this.selectedDataSheet = [];
    },
    sortProductsDataSheets(type, index, item) {
      if (type == 'down') {
        if (this.dataSheetItemArray[item.sequence + 1]) {
          this.dataSheetItemArray[item.sequence + 1].sequence -= 1;
        }
        item.sequence += 1;
        this.dataSheetItemArray.splice(
          index + 1,
          0,
          this.dataSheetItemArray.splice(index, 1)[0]
        );
      } else if (type == 'up') {
        if (this.dataSheetItemArray[item.sequence - 1]) {
          this.dataSheetItemArray[item.sequence - 1].sequence += 1;
        }
        item.sequence -= 1;
        this.dataSheetItemArray.splice(
          index - 1,
          0,
          this.dataSheetItemArray.splice(index, 1)[0]
        );
      }
    },
    addDataSheet() {
      /* if (!this.product.dataSheets) {
        this.dataSheetItemArray = { dataSheetsItem: [] };
      } */
      // this.dataSheet.id = this.productsDataSheet.length
      this.dataSheet.isActive = true;
      this.dataSheet.sequence = this.product.dataSheets
        ? this.dataSheetItemArray.length
        : 0;
      //console.log(this.dataSheetItemArray);
      this.dataSheetItemArray.push(this.dataSheet);
      //console.log(this.product.dataSheets.dataSheetsItem);
      this.dataSheet = { title: '', description: '' };
    },
    handlePromotionFormSubmit(promotion) {
      this.product = {
        ...this.product,
        promotion: { ...promotion },
      };

      this.isPromotionFormModalVisible = false;
    },
    getPromotionDurationInDays() {
      if (!this.product.promotion.endsAt) return null;

      return differenceInDaysBetweenDates(
        this.product.promotion.endsAt,
        this.product.promotion.createdAt
      );
    },
    setCashbackCurrency() {
      if (this.hasPromotion) {
        return this.getFixedNumber((this.product.promotion.promotionalPrice * (this.product.cashback / 100)))
      } else {
        return this.getFixedNumber((this.product.price * (this.product.cashback / 100)))
      }
    },
    verifyPriceMasks() {
      if (
        ('' + this.product.price).includes(',') ||
        ('' + this.product.price).includes('.')
      ) {
        this.product.price = this.getFixedNumber(
          this.product.price.replace(',', '.'),
          2
        );
      }
    },
    verifyCashbackMasks() {
      if (
        ('' + this.product.cashback).includes(',') ||
        ('' + this.product.cashback).includes('.')
      ) {
        this.product.cashback = this.getFixedNumber(
          this.product.cashback.replace(',', '.'),
          2
        );
      }
    },
    getFixedNumber(number, decimalsQuantity = 2) {
      if (`${number}`.includes('.') && `${number}`.split('.')[1].length > 2) {
        return parseFloat(number).toFixed(decimalsQuantity);
      } else {
        return parseFloat(number);
      }
    },
    handleDeletePromotion(promotion) {
      if (promotion && promotion.id) {
        if (Array.isArray(this.product.promotionsToDelete)) {
          this.product.promotionsToDelete.push(promotion.id);
        } else {
          this.product.promotionsToDelete = [promotion.id];
        }
      }

      this.product.promotion = null;

      this.isPromotionFormModalVisible = false;
    },
    handleClickPromotionButton() {
      this.isPromotionFormModalVisible = true;
    },
    handleCategoryDialogClose(event) {
      if (event && event.loadLatestCategory && this.categories.length) {
        const lastId = this.categories[this.categories.length - 1].id;

        this.product.categoryId = lastId;
      }
      this.showDialog = false;
      this.showDialogVariation = false;
    },
    changePhoto(photo) {
      this.product.photo = photo;
    },
    onSubmit() {
      if (!this.product.dataSheets) {
        this.product.dataSheets = {};
      }
      if (this.product.cashback == '' || this.product.cashback == null || this.product.cashback < 0 || this.product.cashback > 100) {
        this.product.cashback = 0
      }
      this.product.dataSheets.dataSheetsItem = this.dataSheetItemArray;
      if (!this.product.variations) this.product.variations = [];
      this.isDisabledButtonSave = true;
      this.$emit('onSubmit', {
        enabledButtonSave: () => {
          this.isDisabledButtonSave = false;
        },
        product: {
          ...this.product,
          stock: this.isControllingStock ? this.stockProduct : '',
        },
        dataSheets: this.product.dataSheets,
        clear: () => {
          this.urlExternal = null;
          this.product = {
            id: null,
            status: 'Ativo',
            photo: null,
          };
          this.stockProduct = 0;
          this.reset = !this.reset;
          (this.dataSheetItemArray = []),
            (this.dataSheet = { title: '', description: '' }),
            (this.selectedDataSheet = {});
        },
      });
    },
    setProduct() {
      if (+this.idProductToEdit > 0) {
        const product = this.getProductWithoutMasks(+this.idProductToEdit);
        this.product = { ...product };

        if (this.product.promotion)
          this.product.promotion.durationInDays = this.getPromotionDurationInDays();
        else this.product.promotion = {};


        if (this.product.dataSheets) {
          if (this.product.dataSheets.dataSheetsItem) {
            this.dataSheetItemArray = this.product.dataSheets.dataSheetsItem;
          }
        }

        if (this.product.cashback) {
          /*  this.cashbackCurrency = this.setCashbackCurrency() */
        } else {
          this.product.cashback = 0
        }

        if (this.product.photo) {
          this.urlExternal = `${awsUrls.AWS_URL}${awsUrls.FOLDER_PRODUCTS}${this.product.photo}`;
        } else {
          this.urlExternal = '';
        }

        this.isDisableBarCode = true;
      } else {
        this.isDisableBarCode = false;
      }

      this.isControllingStock = this.product.stock != null;
      this.stockProduct = this.product.stock || 0;
    },
  },
};
</script>

<style>
.input-quantity-button-text-number {
  font-size: 2rem;
  color: black;
  outline: none;
}

.link-button-text {
  color: var(--v-primary-base)
}

.money-sign {
  color: black;
}

.promotion-mini-card {
  background-color: #f8f8f8;
  padding: 0.2rem 0.6rem;
  text-align: center;
  border-radius: 10px;
}

.promotion-details {
  background-color: #f8f8f8;
  text-align: center;
  border-radius: 10px;
}


.promotion-mini-card_title {
  color: black;
}

.promotion-mini-card_text {
  font-size: 0.8rem;
}

.line-through {
  text-decoration: line-through;
}

#mytable table thead tr th {
  background: #ebeef7;
}

#mytable table tbody {
  background: #ebeef7;
}
</style>
