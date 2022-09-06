<template>
  <div>
    <ProductPageHeader>
      <v-col>
        <v-col cols="12" class="tw-pt-0">
          <v-slide-group multiple>
            <v-tabs v-model="activeTab" class="pt-1" color="black">
              <v-tab
                :ripple="false"
                v-for="(tab, index) in tabs"
                :key="index"
                >{{ tab.name }}</v-tab
              >
            </v-tabs>
          </v-slide-group>
        </v-col>

        <v-spacer></v-spacer>

        <v-row>
          <v-col cols="4" class="d-flex tw-pl-4 tw--pt-2">
            <InputSearch
              :placeholder="`Pesquisar em ${activeTabName}`"
              v-model="search"
            />
          </v-col>

          <v-col
            cols="8"
            class="
              d-flex
              justify-start
              md:tw-justify-end
              align-center
              tw--mt-5
              md:tw--mt-0
            "
          >
            <v-menu
              ref="menuFilter"
              :close-on-content-click="false"
              cal:nudge-width="200"
              offset-x
            >
              <template v-slot:activator="{ on }">
                <v-btn
                  v-show="activeTab == 0 || activeTab == 3"
                  depressed
                  :ripple="false"
                  v-on="on"
                  class="mr-2"
                >
                  Filtros
                  <v-icon right dense>mdi-filter-variant</v-icon>
                </v-btn>
              </template>

              <v-list v-show="activeTab == 3">
                <v-list-item class="tw-flex tw-justify-between">
                  <span>Tipo:</span>
                </v-list-item>
                <v-list-item>
                  <v-radio-group v-model="filterBanner.selectedGoal" row>
                    <v-radio label="Todos" value="-1"></v-radio>
                    <v-radio label="App" value="App"></v-radio>
                    <v-radio label="E-Commerce" value="Ecommerce"></v-radio>
                  </v-radio-group>
                </v-list-item>
                <v-list-item>
                  <span>Status:</span>
                </v-list-item>
                <v-list-item>
                  <v-radio-group v-model="filterBanner.status" row>
                    <v-radio label="Todos" value="-1"></v-radio>
                    <v-radio label="Ativos" :value="'Ativo'"></v-radio>
                    <v-radio label="Inativos" :value="'Inativo'"></v-radio>
                  </v-radio-group>
                </v-list-item>
              </v-list>

              <v-list v-show="activeTab == 0">
                <v-list-item class="tw-flex tw-justify-between">
                  <span>Imagem:</span>
                  <!-- <v-btn
                    class="hidden-md-and-up tw-ml-20"
                    color="normal"
                    depressed
                    @click="closeMenuFilter"
                    ><v-icon>la-times</v-icon>
                  </v-btn> -->
                </v-list-item>
                <v-list-item>
                  <v-radio-group v-model="filter.photo" row>
                    <v-radio label="Todos" value="-1"></v-radio>
                    <v-radio label="Com imagem" :value="'withImage'"></v-radio>
                    <v-radio
                      label="Sem imagem"
                      :value="'withoutImage'"
                    ></v-radio>
                  </v-radio-group>
                </v-list-item>
                <v-list-item>
                  <span>Status:</span>
                </v-list-item>
                <v-list-item>
                  <v-radio-group v-model="filter.status" row>
                    <v-radio label="Todos" value="-1"></v-radio>
                    <v-radio label="Ativos" :value="'Ativo'"></v-radio>
                    <v-radio label="Inativos" :value="'Inativo'"></v-radio>
                  </v-radio-group>
                </v-list-item>
              </v-list>
            </v-menu>

            <v-btn
              @click="showImportCsvDialog = true"
              v-show="activeTab == 0"
              depressed
              >Importar CSV</v-btn
            >
            <v-btn
              icon
              color="gray"
              @click="dialogs.trash = true"
              v-show="isDeleteButtonVisible"
              class="tw-ml-2"
            >
              <v-icon>la-trash-alt</v-icon>
            </v-btn>
            <v-btn
              v-show="activeTab != 1"
              depressed
              small
              class="hidden-md-and-up"
              @click="showSelectMobile = !showSelectMobile"
              >Selecionar {{ activeTabName }}</v-btn
            >
          </v-col>
        </v-row>
        <!--  <v-row v-show="activeTab == 3">
          <v-col cols="12" class="tw-pt-0">
            <v-slide-group multiple>
              <v-tabs v-model="activeBannerTab" color="black">
                <v-tab
                  :ripple="false"
                  v-for="(tab, index) in tabsBanner"
                  :key="index"
                  >{{ tab.name }}</v-tab
                >
              </v-tabs>
            </v-slide-group>
          </v-col>
        </v-row> -->
      </v-col>
    </ProductPageHeader>

    <ProductList
      v-show="activeTab == 0"
      :search="search"
      :filter="filter"
      :showSelectMobile="showSelectMobile"
      :isMobile="isMobile"
      @itemsSelected="(items) => handleSelectItem(items, 0)"
    />

    <PromotionPageList
      :isMobile="isMobile"
      v-show="activeTab == 1"
      :search="search"
    />

    <CategoriesList
      :showSelectMobile="showSelectMobile"
      :isMobile="isMobile"
      v-show="activeTab == 2"
      :search="search"
      @itemsSelected="(items) => handleSelectItem(items, 2)"
    />

    <!-- <VariationsList
      :showSelectMobile="showSelectMobile"
      :isMobile="isMobile"
      v-show="activeTab == 3"
      :search="search"
      @itemsSelected="(items) => handleSelectItem(items, 3)"
      @showDeleteDialog="handleSelectedVariation"
    /> -->

    <BannersForm
      :showDialog="dialogs.banners"
      @close="dialogs.banners = false"
    />

    <BannersList
      :showSelectMobile="showSelectMobile"
      :isMobile="isMobile"
      :filter="filterBanner"
      v-show="activeTab == 3"
      :search="search"
      @itemsSelected="(items) => handleSelectItem(items, 3)"
      @showDeleteDialog="handleSelectedVariation"
    />

    <HighlightsForm
      :showDialog="dialogs.highlights"
      @close="dialogs.highlights = false"
    />

    <HighlightsList
      :showSelectMobile="showSelectMobile"
      :isMobile="isMobile"
      v-show="activeTab == 4"
      :search="search"
      @itemsSelected="(items) => handleSelectItem(items, 4)"
    />

    <AppFloatingButton
      v-show="activeTab != 1"
      @clickFloating="onClickFloatingButton"
      class="top-left-speed-dial floating-button-footer"
    >
    <span></span>
    </AppFloatingButton>

    <ConfirmDeleteDialog
      :ids="idsToDelete"
      :showDialog="dialogs.trash"
      :description="deleteDialogText"
      :typeToDelete="typeToDelete"
      @close="dialogs.trash = false"
    />
    <ImportCSVDialog
      :showDialog="showImportCsvDialog"
      @close="showImportCsvDialog = false"
    />

    <ProductForm :dialog="dialogs.product" @close="dialogs.product = false" />

    <CategoryFormDialog
      :showDialog="dialogs.category"
      @close="dialogs.category = false"
    />
  </div>
</template>

<script>
import CategoryFormDialog from './../forms/CategoryFormDialog';
import CategoriesList from './../components/CategoriesList';

import ProductPageHeader from './../components/ProductPageHeader';
import ProductForm from './../forms/ProductForm';
import ProductList from './../components/ProductList';

import VariationForm from './../forms/VariationForm';
import VariationsList from './../components/VariationsList';

import BannersForm from './../forms/BannersForm';
import BannersList from './../components/BannersList';

import HighlightsForm from './../forms/HighlightsForm';
import HighlightsList from './../components/HighlightsList';

import ConfirmDeleteDialog from './../forms/ConfirmDeleteDialog';
import ImportCSVDialog from './../forms/ImportCSVDialog';

import PromotionPageList from '../submodules/promotions/views/PromotionPageList';


export default {
  components: {
    ProductList,
    ProductPageHeader,
    ProductForm,
    VariationForm,
    CategoriesList,
    CategoryFormDialog,
    VariationsList,
    BannersList,
    BannersForm,
    ConfirmDeleteDialog,
    ImportCSVDialog,
    PromotionPageList,
    HighlightsForm,
    HighlightsList
},
  computed: {
    activeTabName() {
      const activeTab = this.tabs.find((tab) => tab.index == this.activeTab);
      return activeTab ? activeTab.name.toLowerCase() : '';
    },
  },
  watch: {
    activeTab() {
      console.log(this.activeTab)
      this.search = '';
    },
    closeFilter() {
      // console.log(this.closeFilter);
    },
  },
  data() {
    return {
      search: '',
      filter: {
        photo: '-1',
        status: '-1',
      },
      filterBanner: {
        selectedGoal: '-1',
        status:'-1'
      },
      windowWidth: window.innerWidth,
      isMobile: false,

      showSelectMobile: true,

      showImportCsvDialog: false,

      activeTab: 0,
      idsToDelete: [],
      typeToDelete: '',
      deleteDialogText: '',

      dialogs: {
        trash: false,
        product: false,
        category: false,
        // variation: false,
        banners: false,
        highlights: false,
      },
      closeFilter: false,
      isDeleteButtonVisible: false,

      tabs: [
        { index: 0, name: 'Produtos' },
        { index: 1, name: 'Promoções' },
        { index: 2, name: 'Categorias' },
        // { index: 3, name: 'Variações' },
        { index: 3, name: 'Banners' },
        { index: 4, name: 'Destaques' },
      ],
    };
  },
  methods: {
    onClickFloatingButton() {
      const dialogs = {
        0: () => (this.dialogs.product = true),
        1: () => (this.dialogs.promotion = true),
        2: () => (this.dialogs.category = true),
        3: () => (this.dialogs.banners = true),
        4: () => (this.dialogs.highlights = true),
      };

      const showDialog = dialogs[this.activeTab];
      showDialog();
    },
    closeMenuFilter() {
      this.$refs.menuFilter.save();
    },
    handleDeleteButtonVisibility(items) {
      if (items.length) {
        this.isDeleteButtonVisible = true;
      } else {
        this.isDeleteButtonVisible = false;
      }
    },

    handleSelectItem(items, index) {
      this.handleDeleteButtonVisibility(items);
      const types = {
        0: {
          type: 'product',
          text: 'Tem certeza que deseja excluir?',
        },
        1: {
          type: 'promotion',
          text: '',
        },
        2: {
          type: 'category',
          text: 'Os produtos vinculados a esta categoria também serão excluídos',
        },
        3: {
          type: 'banner',
          text: 'Tem certeza que deseja excluir?',
        },
        4: {
          type: 'highlight',
          text: 'Tem certeza que deseja excluir?',
        },
      };

      const type = types[index];
      this.typeToDelete = type.type;
      this.deleteDialogText = type.text;
      this.idsToDelete = items;
    },

    handleSelectedVariation(item) {
      this.isDeleteButtonVisible = false;
      this.dialogs.trash = true;

      this.typeToDelete = 'variation';
      this.deleteDialogText = 'Tem certeza que deseja excluir?';
      this.idsToDelete = [item.id];
    },
    isMobileTest() {
      this.isMobile = this.windowWidth > 960 ? false : true;
    },
    ShowSelectMobileStartTest() {
      if (this.isMobile === true) {
        this.showSelectMobile = false;
      } else {
        this.showSelectMobile = true;
      }
    },
  },
  created: function () {
    this.isMobileTest();
    this.ShowSelectMobileStartTest();
  },
};
</script>

<style >
/*.v-tabs:not(.v-tabs--vertical):not(.v-tabs--right)
  > .v-slide-group--is-overflowing.v-tabs-bar--is-mobile:not(.v-slide-group--has-affixes)
  .v-slide-group__prev {
  display: none;
}*/
</style>