<template>
  <div>
    <DataTable
      :headers="
        isMobile
          ? tableHighlights.config.Mobile
          : tableHighlights.config.headers
      "
      fixed-header
      :height="isMobile ? '60vh' : '600px'"
      :showSelect="showSelectMobile"
      mobile-breakpoint="0"
      :page.sync="tableConstants.page"
      :items-per-page="tableConstants.itemsPerPage"
      @page-count="tableConstants.pageCount = $event"
      @click:row="handleClickRow"
      @itemsSelected="emitSelected"
      :items="highlights"
      :search="search"
      :sort-by="['id']"
      :sort-desc="[true]"
    ></DataTable>

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

    <HighlightsForm
      v-if="showDialog"
      @close="showDialog = false"
      title="Editar Destaque"
      :highlight="highlight"
      :showDialog="showDialog"
    />
  </div>
</template>
<script>
import tableConstants from '@/utils/mixins/table-constants';
import tableHighlights from '../utils/mixins/table-highlights';
import { createNamespacedHelpers } from 'vuex';
import HighlightsForm from '../forms/HighlightsForm.vue';
const { mapGetters } = createNamespacedHelpers('products');

export default {
  mixins: [tableConstants, tableHighlights],
  components: {
    HighlightsForm,
  },
  computed: {
    ...mapGetters(['highlights']),
  },
  mounted() {},
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
    filter: {},
  },
  watch: {
    highlights() {
      console.log('watcher', this.highlights);
    },
  },
  data() {
    return {
      showDialog: false,
      highlight: {},
    };
  },
  methods: {
    handleClickRow(highlight) {
      this.highlight = { ...highlight };
      this.showDialog = true;
    },
    emitSelected(event) {
      this.$emit('itemsSelected', event);
    },
  },
};
</script>
