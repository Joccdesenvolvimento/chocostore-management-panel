<template>
  <div>
    <DataTable
      :headers="
        isMobile
          ? tableCategories.config.Mobile
          : tableCategories.config.headers
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
      :items="categories"
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

    <CategoryFormDialogEdit
      v-if="showDialog"
      @close="showDialog = false"
      title="Editar categoria"
      :category="category"
      :showDialog="showDialog"
    />
  </div>
</template>

<script>
import tableConstants from '@/utils/mixins/table-constants';
import tableCategories from '../utils/mixins/table-categories';

import CategoryFormDialogEdit from '../forms/CategoryFormDialogEdit';

import { createNamespacedHelpers } from 'vuex';

const { mapGetters } = createNamespacedHelpers('products');

export default {
  mixins: [tableConstants, tableCategories],
  components: {
    CategoryFormDialogEdit,
  },
  computed: {
    ...mapGetters(['categories']),
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
      showDialog: false,
      category: {},
    };
  },
  // watch:{
  //   categories(val){
  //     console.log(val)
  //   }
  // },
  methods: {
    handleClickRow(category) {
      this.category = { ...category };
      this.showDialog = true;
    },
    emitSelected(event) {
      this.$emit('itemsSelected', event);
    },
  },
  /*watch:{
    showSelectMobile(newValue, oldValeu){
    console.log('recebendo', this.showSelectMobile);
    }
  },*/
};
</script>
