<template>
  <div>
    <v-dialog
      v-model="showDialog"
      persistent
      fullscreen
      hide-overlay
      no-click-animation
      transition="dialog-bottom-transition"
    >
      <template v-slot:activator="{ on }">
        <slot name="activator" :on="on"></slot>
      </template>
      <v-card>
        <v-card-title>
          <v-btn icon @click="$emit('close', $event)">
            <v-icon>la-angle-left</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-row no-gutters justify="center">
            <v-col
              class="mb-6 tw-text-center md:tw-text-left"
              cols="12"
              md="10"
            >
              <v-row>
                <v-col cols="12" md="6">
                  <h1 class="title">{{ title }}</h1>
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                  class="tw-flex tw-flex-col md:tw-flex-row align-center"
                >
                  <h4 class="md:tw-mr-5">Tipo de variação*</h4>
                  <InputSwitch
                    v-if="showInputSwitch"
                    :labels="labelsSwitch"
                    :value="variation.labelRequired"
                    @change="variation.labelRequired = $event.value"
                    :default="null"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="6">
                  <InputTextField
                    label="Nome interno da variação*"
                    v-model="variation.internalName"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <InputTextField
                    label="Nome de exibição no aplicativo*"
                    v-model="variation.exhibitionName"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col
                  cols="12"
                  md="10"
                  class="d-flex tw-flex-col md:tw-flex-row align-center"
                >
                  <h4>Tipo de seleção</h4>
                  <div class="d-flex align-center mx-6">
                    <p class="mb-0">Único</p>
                    <v-switch
                      class="mx-2"
                      v-model="variation.isMultiple"
                      :ripple="false"
                      flat
                    ></v-switch>
                    <p class="mb-0">Múltiplo</p>
                  </div>
                  <div
                    class="
                      d-flex d-flex
                      tw-flex-col
                      md:tw-flex-row
                      align-center
                    "
                    v-if="variation.isMultiple"
                  >
                    <p class="mb-0 mx-8">
                      Quantidade de
                      <br />
                      opções {{ multipleOptionsMessage }}
                    </p>
                    <InputCustom
                      number
                      v-model="variation.minQuantity"
                      style="width: 10rem"
                      color="red"
                      :textFieldOptions="{ 'hide-details': true, dense: true }"
                    />
                  </div>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="3">
                  <v-text-field
                    hide-details
                    dense
                    outlined
                    label="Nome da opção*"
                    v-model="newOption.name"
                    ref="optionNameRef"
                    @keyup.enter="handleAddOption"
                  />
                </v-col>
                <v-col cols="12" md="5">
                  <InputTextField
                    label="Descrição"
                    v-model="newOption.description"
                    @keyup.enter="handleAddOption"
                  />
                </v-col>
                <v-col cols="12" md="2">
                  <InputTextField
                    type="number"
                    label="Valor adicional (em R$)"
                    v-model="newOption.value"
                    @keyup.enter="handleAddOption"
                  />
                </v-col>
                <v-col cols="12" md="2" class="d-flex justify-end align-end">
                  <v-btn
                    block
                    depressed
                    color="primary"
                    @click="handleAddOption"
                    >Adicionar</v-btn
                  >
                </v-col>
              </v-row>
              <v-row
                class="variations-options"
                :style="{
                  opacity:
                    variation.options && variation.options.length > 0 ? 1 : 0,
                }"
              >
                <v-col cols="12">
                  <v-btn
                    xs-small
                    icon
                    color="gray"
                    @click="handleDeleteOptions"
                    v-show="optionsToDelete.length > 0"
                  >
                    <v-icon>la-trash-alt</v-icon>
                  </v-btn>
                  <v-data-table
                    :headers="tableVariationOptions.config.headers"
                    fixed-header
                    :height="isMobile ? '300px' : '600px'"
                    :items="variation.options"
                    show-select
                    hide-default-footer
                    mobile-breakpoint="0"
                    :page.sync="tableConstants.page"
                    class="table-hover-pointer striped variation-options-table"
                    no-data-text="Sem dados"
                    no-results-text="Nenhum resultado encontrado"
                    :items-per-page="-1"
                    sort-by="name"
                    :sort-desc="false"
                    item-key="name"
                    @click:row="handleClickTableRow"
                    @page-count="tableConstants.pageCount = $event"
                    @input="handleSelectedItem"
                    v-bind="tableVariationOptions.config"
                  >
                    <template v-slot:item.value="{ item }">
                      <span>{{
                        item.value ? toCurrency(item.value) : ''
                      }}</span>
                    </template>
                    <template v-slot:item.isActive="{ item }">
                      <span>{{
                        item.isActive === false ? 'Inativa' : 'Ativa'
                      }}</span>
                    </template>
                  </v-data-table>
                </v-col>
              </v-row>
              <v-row no-margin class="mt-3">
                <v-col cols="6">
                  <v-btn
                    depressed
                    block
                    @click="$emit('close', $event)"
                    color="normal"
                    >Voltar</v-btn
                  >
                </v-col>
                <v-col cols="6">
                  <ButtonPrimary
                    block
                    @click="onSubmitForm"
                    :loading="isSaving"
                    :disabled="isSaving"
                    >Pronto</ButtonPrimary
                  >
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <VariationOptionFormDialogEdit
        :isVisible="isEditOptionDialogVisible"
        :option="optionToEdit"
        @close="isEditOptionDialogVisible = false"
        @save="saveVariationOption"
      />
    </v-dialog>
    <v-snackbar app v-model="showNotify" :color="colorMessage">
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
import tableConstants from '@/utils/mixins/table-constants';
import tableVariationOptions from '../utils/mixins/table-variation-options';

import { createNamespacedHelpers } from 'vuex';
const { mapActions, mapGetters } = createNamespacedHelpers('products');

import axios from 'axios';

import tableVariations from '../utils/mixins/table-variations';
import { currency } from '@/utils/helpers/currency';

import VariationOptionFormDialogEdit from './VariationOptionFormDialogEdit';

export default {
  mixins: [tableConstants, tableVariationOptions],
  components: {
    VariationOptionFormDialogEdit,
  },
  props: {
    title: {
      type: String,
      default: 'Cadastro de variação',
    },
    showDialog: {
      type: Boolean,
      default: false,
    },
    variationId: {
      type: Number,
      default: null,
    },
    isMobile: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      labelsSwitch: [{ name: 'Opcional' }, { name: 'Obrigatório' }],
      newOption: {
        isActive: true,
      },
      optionsToDelete: [],

      optionToEdit: {},
      isEditOptionDialogVisible: false,

      variation: {
        options: [],
        isMultiple: false,
        labelRequired: null,
      },

      isSaving: false,
      showNotify: false,
      colorMessage: '',
      message: '',
      showInputSwitch: false,
    };
  },
  computed: {
    ...mapGetters(['variations', 'getVariation']),
    multipleOptionsMessage() {
      return this.variation.labelRequired != 'Opcional'
        ? 'exigidas'
        : 'permitidas';
    },
  },
  created() {
    if (this.variationId) {
      this.variation = this.getVariation(this.variationId);
    } else {
      this.variation.options = this.variation.options.map((option) => ({
        ...option,
        fakeId: this.getRandomInt(),
      }));
    }
  },
  watch: {
    showDialog(newValue) {
      if (newValue) {
        if (this.variationId) {
          this.variation = this.getVariation(this.variationId);
        } else {
          this.variation.options = this.variation.options.map((option) => ({
            ...option,
            fakeId: this.getRandomInt(),
          }));
        }
      }

      this.variation.labelRequired = this.variation.isRequired
        ? 'Obrigatório'
        : 'Opcional';

      this.showInputSwitch = newValue;
    },
  },
  // beforeUpdate() {
  //   if (this.variationId) {
  //     this.variation = {
  //       ...this.variations.find((v) => v.id == this.variationId),
  //     };
  //   }
  // },
  methods: {
    ...mapActions([
      'createVariation',
      'editVariation',
      'createOption',
      'editOption',
      'deleteOption',
    ]),
    handleSelectedItem(data) {
      console.log(data);
      this.optionsToDelete = data;
    },
    handleClickTableRow(option) {
      this.optionToEdit = option;
      this.isEditOptionDialogVisible = true;
    },
    saveVariationOption(option) {
      if (option.id) this.updateVariationOption(option);
      else this.updateNoIdVariationOption(option);
    },
    getRandomInt(min = 1, max = 20000) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min;
    },
    isOptionValid(option) {
      option.name = option.name.trim();
      if (!option.name)
        return {
          isValid: false,
          message: 'Nome não pode ser vazio',
        };

      // const optionsCopy = [...this.variation.options];
      // const optionIndex = optionsCopy.findIndex(
      //   (opt) => opt.fakeId == option.fakeId
      // );

      // optionsCopy.splice(optionIndex, 1);

      // const nameIsAlreadyInOptions = optionsCopy.filter((opt) => {
      // if (opt.fakeId == option.fakeId) return false;
      // else
      //   return opt.name.toString().trim() == option.name.toString();
      // });

      // console.log(nameIsAlreadyInOptions);

      // if (nameIsAlreadyInOptions.length > 0)
      //   return {
      //     isValid: false,
      //     message: 'Nome não pode ser repetido',
      //   };

      return { isValid: true };
    },
    updateNoIdVariationOption(option) {
      const optionValidity = this.isOptionValid(option);
      if (!optionValidity.isValid) {
        this.showMessage(optionValidity.message, 'normal');
        return;
      }

      if (this.variation.id) {
        try {
          this.createOption({ option, variationId: this.variation.id });
        } catch (error) {
          console.log(error);
        }
      } else {
        const optionIndex = this.variation.options.findIndex(
          (opt) => +opt.fakeId === +option.fakeId
        );

        const optionsCopy = [...this.variation.options];
        optionsCopy.splice(optionIndex, 1, option);
        this.variation.options = [...optionsCopy];
        this.isEditOptionDialogVisible = false;
      }
    },
    async updateVariationOption(option) {
      const optionValidity = this.isOptionValid(option);
      if (!optionValidity.isValid) {
        this.showMessage(optionValidity.message, 'normal');
        return;
      }

      try {
        await this.editOption({ option });
        this.isEditOptionDialogVisible = false;
      } catch (error) {
        this.isEditOptionDialogVisible = false;
        const message = error.response
          ? error.response.data.errors[0].message
          : error;
        this.showMessage(message, 'normal');
      }
    },
    toCurrency(value) {
      return currency(value);
    },
    async handleDeleteOptions() {
      const optionsCopy = [...this.variation.options];

      for (const opt of this.optionsToDelete) {
        const index = optionsCopy.findIndex(
          (option) => option.name == opt.name
        );

        if (this.variationId && index >= 0) {
          await this.deleteOption({ option: opt });
          this.showMessage('Opção deletada com sucesso');
        }

        if (index >= 0) optionsCopy.splice(index, 1);
        // else {
        // }
      }

      this.optionsToDelete = [];
      this.variation.options = [...optionsCopy];

      // if (!this.variation.id) {
      // }
    },
    async onSubmitForm() {
      try {
        if (this.variation.options.length == 0)
          throw 'Adicione no mínimo 1 opção';

        if (this.variation.labelRequired === null)
          throw 'Selecione o tipo de variação';

        const isRequired = this.variation.labelRequired != 'Opcional';

        if (
          isRequired &&
          this.variation.isMultiple &&
          !this.variation.minQuantity
        )
          throw 'Quantidade de opções mínimas não pode ser vazia';

        if (this.variation.options.length == 0)
          throw 'Quantidade de opções não pode ser vazia';

        if (
          this.variation.minQuantity <= 1 &&
          this.variation.minQuantity != '' &&
          this.variation.minQuantity != null
        )
          throw 'Quantidade de opções exigidas deve ser maior que 1';

        if (this.variation.minQuantity == '') this.variation.minQuantity = null;

        this.isSaving = true;
        if (this.variationId) {
          await this.editVariation({
            variation: {
              ...this.variation,
              isRequired,
            },
          });
        } else {
          await this.createVariation({
            variation: {
              ...this.variation,
              isRequired,
            },
          });
        }

        this.showMessage('Variação salva');
        this.isSaving = false;
        this.clearForm();
        this.$emit('close', true);
      } catch (error) {
        this.isSaving = false;
        const message = error.response
          ? error.response.data.errors[0].message
          : error;
        this.showMessage(message, 'normal');
      }
    },
    async handleAddOption() {
      if (!this.newOption.name) {
        this.showMessage('Nome da opção é obrigatório', 'normal');
        return;
      }

      this.newOption.name = this.newOption.name.trim();

      const nameIsAlreadyInOptions = this.variation.options
        ? this.variation.options.filter(
            (opt) => opt.name.trim() == this.newOption.name
          ).length > 0
        : false;

      if (nameIsAlreadyInOptions) {
        this.showMessage('Nome da opção não pode ser repetido', 'normal');
        return;
      }

      if (this.variation.id) {
        try {
          await this.createOption({
            option: this.newOption,
            variationId: this.variation.id,
          });
        } catch (error) {
          this.showMessage('Erro ao criar nova opção');
        }
      } else {
        const optionsCopy = [...this.variation.options];
        optionsCopy.push({ ...this.newOption, fakeId: this.getRandomInt() });
        this.variation.options = optionsCopy;
      }

      this.newOption = { isActive: true };
      this.$refs.optionNameRef.$el.focus();
    },
    clearForm() {
      const variation = {
        options: [],
        isMultiple: false,
        labelRequired: null,
      };

      this.variation = { ...variation };
    },
    hideNotification() {
      this.showNotify = false;
    },
    showMessage(message, color = 'primary') {
      this.message = message;
      this.colorMessage = color;
      this.showNotify = true;
    },
  },
};
</script>

<style>
.variations-options {
  min-height: 18rem;
}

.variation-options-table {
  overflow-y: scroll;
  max-height: 18rem;
}

.theme--light.v-input--switch .v-input--switch__thumb {
  color: #efefef;
}
.theme--light.v-data-table
  tbody
  tr:not(:last-child)
  td:not(.v-data-table__mobile-row),
.theme--light.v-data-table
  tbody
  tr:not(:last-child)
  th:not(.v-data-table__mobile-row) {
  border-bottom: none;
}
</style>
