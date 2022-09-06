<template>
  <div class="text-center">
    <v-dialog
      persistent
      v-model="showDialog"
      fullscreen
      scrollable
      hide-overlay
      width="500"
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
          <v-row no-gutters justify="center">
            <v-col cols="12" md="8">
              <v-row no-gutters>
                <v-col
                  class="mb-6 tw-text-center md:tw-text-left"
                  cols="12"
                  md="6"
                >
                  <span class="title">{{ title }}</span>
                </v-col>
                <v-col
                  cols="6"
                  md="6"
                  class="d-flex md:tw-justify-end tw-justify-center"
                >
                  <InputSwitch
                    :labels="labelsSwitch"
                    :value="highlight.status"
                    @change="highlight.status = $event.value"
                    :default="highlight.status"
                  />
                </v-col>
              </v-row>
              <v-row no-margin>
                <v-col cols="12">
                  <InputTextField
                    label="Título"
                    v-model="highlight.title"
                    required
                  />
                </v-col>
              </v-row>
              <v-row no-margin>
                <v-col cols="12">
                  <v-autocomplete
                    v-if="isInputVisible"
                    item-value="id"
                    flat
                    item-text="name"
                    @change="changeSelected"
                    :items="getProducts"
                    :search-input.sync="search"
                    label="Selecione o Produto"
                    return-object
                    outlined
                    solo
                    clearable
                    hide-details
                    no-data-text="Sem produtos com esse nome!"
                  >
                  </v-autocomplete>
                </v-col>
              </v-row>
              <v-row no-margin>
                <v-col cols="12">
                  <DataTable
                    fixed-header
                    mobile-breakpoint="0"
                    hide-default-footer
                    no-data-text="Sem dados"
                    no-results-text="Nenhum resultado encontrado"
                    @itemsSelected="(items) => handleSelected(items)"
                    :items="selected"
                    :headers="
                      isMobile
                        ? tableProductsHighlight.config.headersMobile
                        : tableProductsHighlight.config.headers
                    "
                    :sort-by="['id']"
                    :sort-desc="[true]"
                    :page.sync="tableConstants.page"
                    :items-per-page="tableConstants.itemsPerPage"
                    @page-count="tableConstants.pageCount = $event"
                  >
                  </DataTable>
                  <v-col cols="12 tw-flex">
                    <v-pagination
                      v-model="tableConstants.page"
                      :total-visible="tableConstants.totalVisible"
                      :length="tableConstants.pageCount"
                      color="primary"
                    ></v-pagination>
                    <v-btn
                      icon
                      color="gray"
                      @click="deleteSelected"
                      v-show="isDeleteButtonVisible"
                      class="tw-ml-2"
                    >
                      <v-icon>la-trash-alt</v-icon>
                    </v-btn>
                  </v-col>
                  <InputCustom
                    class="mt-12"
                    list
                    :listItems="orderList"
                    :allowNegativeNumbers="false"
                    :value="highlight.order"
                    label="Ordem"
                    color="red"
                    :reset="reset"
                    @change="changeOrder"
                    @changeString="changeOrderString"
                    :textFieldOptions="{ 'hide-details': true, dense: true }"
                  />
                  <v-tooltip top>
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
                        <p style="font-size: 14px">Guia de Destaques</p>
                        <p style="font-size: 12px; padding-left: 2px">(?)</p>
                      </span>
                    </template>
                    <span
                      ><p class="tw-text-center">
                        • É recomendado que no mínimo 4 destaques sejam
                        cadastrados para que as páginas do App e Ecommerce
                        fiquem preenchidas.
                      </p>
                    </span>
                  </v-tooltip>
                </v-col>
              </v-row>
              <v-row no-margin class="mt-12">
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
                    :loading="isSaving"
                    :disabled="disabledButtonSave"
                    block
                    @click="onSubmit"
                    >Pronto!</ButtonPrimary
                  >
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
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
    </v-dialog>
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
import { createNamespacedHelpers } from 'vuex';
import tableConstants from '@/utils/mixins/table-constants';
import DataTable from '../../../components/table/DataTable.vue';
import tableProductsHighlight from '../utils/mixins/table-products-highlight-form';

const { mapActions, mapState } = createNamespacedHelpers('products');

export default {
  mixins: [tableProductsHighlight, tableConstants],
  props: {
    showDialog: {
      type: Boolean,
    },
    title: {
      default: 'Cadastrar Destaque',
    },
    highlight: {
      type: Object,
      default: () => ({
        companyId: window.localStorage.getItem('companyId'),
        title: null,
        products: [],
        status: 'Ativo',
        order: 0,
        orderString: 'Primeiro',
      }),
    },
    isMobile: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      reset: null,
      isDeleteButtonVisible: false,
      isInputVisible: true,
      selected: [],
      itemsToDelete: [],
      disabledButtonSave: false,
      isSaving: false,
      showNotify: false,
      colorMessage: null,
      message: null,
      notifyType: null,
      search: '',
      orderList: [
        { id: 0, name: 'Primeiro' },
        { id: 1, name: 'Segundo' },
        { id: 2, name: 'Terceiro' },
        { id: 3, name: 'Quarto' },
        { id: 4, name: 'Quinto' },
      ],
      labelsSwitch: [{ name: 'Inativo' }, { name: 'Ativo' }],
      headers: [
        { text: 'Código', value: 'id', width: '15%', align: 'center' },
        { text: 'Nome', value: 'name', width: '50%' },
        { text: 'Estoque', value: 'stock', width: '15%', align: 'center' },
      ],
    };
  },
  computed: {
    ...mapState(['products']),
    getProducts() {
      return this.products.filter((p) => p.status == 'Ativo');
    },
  },
  mounted() {
    if (this.highlight.products) {
      let retorno = [];
      this.highlight.products.forEach((hl) => {
        retorno.push(this.products.filter((pd) => pd.id == hl)[0]);
      });
      console.log(retorno);
      this.selected = retorno;
    } else {
      this.selected = [];
    }
  },
  methods: {
    ...mapActions([
      'getProducts',
      'createHighlight',
      'getHighlights',
      'editHighlight',
    ]),
    showMessage(message, type, color = '') {
      this.message = message;
      this.colorMessage = color;
      this.showNotify = true;
      this.notifyType = type;
    },
    changeOrder(order) {
      this.highlight.order = order;
    },
    changeOrderString(orderString) {
      this.highlight.orderString = orderString;
    },
    changeSelected(val) {
      this.selected.push(val);

      //gambi das brabas, problema no vuetify que o autocomplete não reseta.
      this.isInputVisible = false;
      this.$nextTick(() => {
        this.isInputVisible = true;
      });
    },
    handleSelected(event) {
      this.itemsToDelete = event;
      this.handleDeleteButtonVisibility(event);
    },
    deleteSelected() {
      this.selected = this.selected.filter(
        (val) => !this.itemsToDelete.includes(val)
      );
      this.itemsToDelete = [];
      this.handleDeleteButtonVisibility(this.itemsToDelete);
    },
    handleDeleteButtonVisibility(items) {
      if (items.length) {
        this.isDeleteButtonVisible = true;
      } else {
        this.isDeleteButtonVisible = false;
      }
    },

    async onSubmit() {
      try {
        this.disabledButtonSave = true;
        this.isSaving = true;
        let tempIds = [];
        this.selected.forEach((select) => {
          tempIds.push(select.id);
        });
        this.highlight.products = tempIds;
        tempIds = [];
        if (this.highlight.id) {
          await this.editHighlight({ highlight: this.highlight });
        } else {
          this.highlight.companyId = window.localStorage.getItem('companyId');
          await this.createHighlight({ highlight: this.highlight });
        }

        this.showMessage('Salvo com sucesso!', 'success', 'primary');
        this.highlight = {
          title: null,
          products: [],
          status: 'Ativo',
          order: null,
          orderString: null,
        };
        this.reset = !this.reset;
        this.selected = [];
        this.disabledButtonSave = false;
        this.isSaving = false;
        this.$emit('close');
      } catch (error) {
        this.disabledButtonSave = false;
        this.isSaving = false;
        this.showMessage(error.response.data.errors[0].message, 'error');
      }
    },
  },
  watch: {
    selected() {
      //console.log(this.selected);
    },
  },
  components: { DataTable },
};
</script>