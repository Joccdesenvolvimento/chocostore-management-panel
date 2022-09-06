<template>
  <div>
    <!-- <DataTable
      v-bind="tableVariations.config"
      :page.sync="tableConstants.page"
      :items-per-page="tableConstants.itemsPerPage"
      @page-count="tableConstants.pageCount = $event"
      @click:row="handleClickRow"
      @itemsSelected="emitSelected"
      :items="variations"
      :search="search"
      slotName="duplicate"
      :slotRender="renderDuplicateButton"
      :sort-by="['id']"
      :sort-desc="[true]"
    ></DataTable>-->

    <v-data-table
      :headers="isMobile ? tableVariations.config.headersMobile : tableVariations.config.headers "
      fixed-header
      :height="isMobile ? '60vh' : '600px'"
      :items="variations"
      :search="search"
      :show-select="showSelectMobile"
      hide-default-footer
      mobile-breakpoint = 0 
      :page.sync="tableConstants.page"
      class="table-hover-pointer striped"
      no-data-text="Sem dados"
      no-results-text="Nenhum resultado encontrado"
      :items-per-page="tableConstants.itemsPerPage"
      sort-by="id"
      :sort-desc="true"
      @page-count="tableConstants.pageCount = $event"
      @click:row="handleClickRow"
      @input="emitSelected"
      v-bind="$attrs"
    >
      <template v-slot:item.data-table-select="{ isSelected, select }">
        <v-simple-checkbox color="primary" @click.stop :value="isSelected" @input="select($event)"></v-simple-checkbox>
      </template>
      <template v-slot:item.duplicate="{ item }">
        <v-btn
          class="duplicate-button"
          color="primary"
          @click.stop="openDuplicateDialog(item)"
          depressed
          text
        >{{IsMobile ? 'Duplicar' : 'Duplicar variação' }}</v-btn>

      </template>
    </v-data-table>
    <AppFooter class="footer-paginate">
      <v-col cols="6">
        <v-pagination
          v-model="tableConstants.page"
          :total-visible="tableConstants.totalVisible"
          :length="tableConstants.pageCount"
          color="primary"
        ></v-pagination>
      </v-col>
    </AppFooter>

    <VariationForm
      @close="isFormVisible = false"
      title="Editar variação"
      :variationId="variation.id"
      :showDialog="isFormVisible"
      :isMobile="isMobile"
    />

    <DuplicateVariationFormDialog
      :isDuplicateDialogVisible="isDuplicateDialogVisible"
      :variation="variation"
      @close="isDuplicateDialogVisible = false"
      @wasDuplicated="handleVariationWasDuplicated"
    />

    <v-snackbar v-model="isNotifyVisible" :color="colorMessage">
      {{ message }}
      <v-btn :color="colorMessage == 'primary' ? 'white' : 'red'" icon @click="hideNotification">
        <v-icon>la la-close</v-icon>
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import tableConstants from '@/utils/mixins/table-constants';
import tableVariations from '../utils/mixins/table-variations';

import VariationForm from '../forms/VariationForm';
import DuplicateVariationFormDialog from '../forms/DuplicateVariationFormDialog';

import { createNamespacedHelpers } from 'vuex';

const { mapGetters, mapActions } = createNamespacedHelpers('products');

export default {
  mixins: [tableConstants, tableVariations],
  components: {
    VariationForm,
    DuplicateVariationFormDialog,
  },
  computed: {
    ...mapGetters(['variations']),
  },
  props: {
    search: {
      type: String,
      default: '',
    },
    showSelectMobile: {
      type: Boolean,
      default: false,
    },
    isMobile: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isFormVisible: false,
      variation: {},
      isDuplicateDialogVisible: false,

      message: '',
      colorMessage: '',
      isNotifyVisible: false,
    };
  },
  methods: {
    handleVariationWasDuplicated(duplicatedVariation) {
      this.isDuplicateDialogVisible = false;
      this.openForm({
        ...duplicatedVariation,
        labelRequired: duplicatedVariation.isRequired
          ? 'Obrigatório'
          : 'Opcional',
      });
    },
    openForm(variation) {
      this.variation = { ...variation };
      this.isFormVisible = true;
    },
    openDuplicateDialog(variation) {
      this.variation = { ...variation };
      this.isDuplicateDialogVisible = true;
    },
    handleClickRow(variation) {
      this.variation = { ...variation, options: [...variation.options] };
      this.isFormVisible = true;
    },
    emitSelected(event) {
      this.$emit('itemsSelected', event);
    },
    hideNotification() {
      this.isNotifyVisible = false;
    },
    showMessage(message, color = 'primary') {
      this.message = message;
      this.colorMessage = color;
      this.isNotifyVisible = true;
    },
  },
};
</script>

<style>
.v-data-table .duplicate-button,
.v-data-table .delete-button {
  opacity: 0;
}
.v-data-table tr:hover .duplicate-button,
.v-data-table tr:hover .delete-button {
  opacity: 1;
}
</style>
