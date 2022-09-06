<template>
  <div>
    <DataTable
      :headers="
        isMobile ? tableBanners.config.Mobile : tableBanners.config.headers
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
      :items="productsFiltered"
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

    <BannersForm
      v-if="showDialog"
      @close="showDialog = false"
      title="Editar Banner"
      :banner="banner"
      :showDialog="showDialog"
    />
  </div>
</template>
<script>
import tableConstants from '@/utils/mixins/table-constants';
import tableBanners from '../utils/mixins/table-banners';
import BannersForm from '../forms/BannersForm';
import { createNamespacedHelpers } from 'vuex';
const { mapGetters } = createNamespacedHelpers('products');

export default {
  mixins: [tableConstants, tableBanners],
  components: {
    BannersForm,
  },
  computed: {
    ...mapGetters(['banners']),
    productsFiltered() {
      if (!this.filter) return this.banners;
      const filters = Object.entries(this.filter);

      return this.banners.filter((banner) => {
        let retorno = true;
        filters.forEach((filter) => {
          if (filter[1] != '-1') {
            if (filter[1] == 'App') retorno = banner.selectedGoal == 'App';
            else if (filter[1] == 'Ecommerce')
              retorno = banner.selectedGoal == 'Ecommerce';
            else if (banner[filter[0]] != filter[1]) {
              retorno = false;
            }
          }
        });
        return retorno;
      });
    },
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
    banner(val) {
      //console.log(val);
    },
  },
  data() {
    return {
      showDialog: false,
      banner: {},
    };
  },
  methods: {
    handleClickRow(banner) {
      this.banner = { ...banner };
      this.showDialog = true;
    },
    emitSelected(event) {
      console.log('banner', event)
      this.$emit('itemsSelected', event);
    },
  },
};
</script>
