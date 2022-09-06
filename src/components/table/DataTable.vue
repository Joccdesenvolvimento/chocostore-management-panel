<template>
  <v-data-table
    :headers="headers"
    :items="items"
    :search="search"
    :show-select="this.showSelect"
    hide-default-footer
    class="table-hover-pointer striped"
    no-data-text="Sem dados"
    no-results-text="Nenhum resultado encontrado"
    @page-count="$emit('page-count', $event)"
    @click:row="$emit('click:row', $event)"
    @input="$emit('itemsSelected', $event)"
    @item-selected="$emit('item-selected', $event)"
    @toggle-select-all="$emit('toggle-select-all', $event)"
    v-bind="$attrs"
  >
    <template v-slot:item.data-table-select="{ isSelected, select }">
      <v-simple-checkbox
        color="primary"
        @click.stop
        :value="isSelected"
        @input="select($event)"
      ></v-simple-checkbox>
    </template>
    <template v-slot:[slotName]="{ item }" v-if="slotName">
      <slot name="item" :item="item">
        <div style="width: 100%" v-html="slotRender(item)"></div>
      </slot>
    </template>
    <template v-slot:item.price="{ item }">{{
      toCurrency(item.price)
    }}</template>
  </v-data-table>
</template>

<script>
import { currency } from '@/utils/helpers/currency';
export default {
  name: 'DataTable',
  props: {
    headers: Array,
    items: Array,
    search: {
      type: String,
      default: '',
    },
    slotName: String,
    slotRender: Function,
    showSelect: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    toCurrency(value) {
      return currency(value);
    },
  },
};
</script>

<style>
.v-data-table .v-simple-checkbox .v-icon.mdi-checkbox-blank-outline {
  opacity: 0;
}
.v-data-table tr:hover .v-simple-checkbox .v-icon {
  opacity: 1;
}

@media (max-width: 960px) {
  .v-data-table .v-simple-checkbox .v-icon.mdi-checkbox-blank-outline {
    opacity: 1;
  }
}

.v-data-table
  tbody
  tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper) {
  cursor: pointer;
}
</style>
