import ProductsService from './../services/products-service';
import CategoriesService from './../services/categories-service';
import VariationsService from './../services/variations-service';
import OptionsService from './../services/options-service';
import BannersService from './../services/banner-service';
import HighlightsService from './../services/highlights-service'

import * as types from './mutation-types';

import {
  UPSERT_PROMOTION,
  CREATE_PROMOTION
} from '../submodules/promotions/store/mutation-types';

export default {
  // products
  createProduct: ({ commit }, { product }) => {
    return new Promise((resolve, reject) => {
      ProductsService.create(product)
        .then(response => {
          const { data } = response;
          commit(types.CREATE_PRODUCT, { product: data });

          const { promotion } = data;

          if (promotion) {
            commit(CREATE_PROMOTION, {
              promotion: { ...promotion, product: data }
            });
          }
          resolve(response);
        })
        .catch(error => reject(error));
    });
  },
  createProductArray: ({ commit }, { products }) => {
    return new Promise((resolve, reject) => {
      ProductsService.createArrayProducts(products)
        .then(response => {
          const {
            productsSuccess,
            updatedProducts,
            productsError
          } = response.data;
          for (const product of productsSuccess) {
            commit(types.CREATE_PRODUCT, { product });
          }
          for (const product of updatedProducts) {
            commit(types.EDIT_PRODUCT, { product });
          }
          console.log(updatedProducts);
          resolve(response);
        })
        .catch(error => reject(error));
    });
  },
  editProduct: async ({ commit }, { product }) => {
    const { data } = await ProductsService.edit(product);
    commit(types.EDIT_PRODUCT, { product: data });

    const { promotion } = data;
    if (promotion) {
      commit(UPSERT_PROMOTION, { promotion: { ...promotion, product: data } });
    }
  },
  updateProductStock: async ({ commit }, { product }) => {
    const { data } = await ProductsService.updateStock(product);
    commit(types.EDIT_STOCK, { product: data });
  },
  deleteProduct: async ({ commit }, { id }) => {
    return new Promise((resolve, reject) => {
      ProductsService.delete(id)
        .then(response => {
          commit(types.DELETE_PRODUCT, { id });
          resolve(response);
        })
        .catch(error => reject(error));
    });
  },
  // deleteArrayProducts: async ({ commit }, { ids }) => {
  //   await ProductsService.delete(product.id);
  //   commit(types.DELETE_PRODUCT, { product });
  // },
  getProduct: async ({ commit }, id) => {
    try {
      const response = await ProductsService.get(id);
      commit(types.LOAD_PRODUCT, { product: response.data });
    } catch (erro) {
      alert(erro);
      // commit(types.SETAR_ERRO, { erro });
    }
  },
  getProducts: async ({ commit }) => {
    try {
      const response = await ProductsService.getAll();
      // console.log(response.data.filter(product => product.promotion));
      commit(types.LIST_PRODUCTS, { products: response.data });
      commit(types.SET_LOADING, { loading: false });
    } catch (erro) {
      alert(erro);
      // commit(types.SETAR_ERRO, { erro });
    }
  },

  // categories
  createCategory: ({ commit }, { category }) => {
    return new Promise((resolve, reject) => {
      CategoriesService.create(category)
        .then(response => {
          commit(types.CREATE_CATEGORY, { category: response.data });
          resolve(response);
        })
        .catch(error => reject(error));
    });
  },
  editCategory: ({ commit }, { category }) => {
    return new Promise((resolve, reject) => {
      CategoriesService.edit(category)
        .then(response => {
          commit(types.EDIT_CATEGORY, { category: response.data });
          resolve(response);
        })
        .catch(error => reject(error));
    });
  },
  deleteCategory: async ({ commit }, { id }) => {
    return new Promise((resolve, reject) => {
      CategoriesService.delete(id)
        .then(response => {
          console.log(response.data);
          commit(types.DELETE_CATEGORY, { id });
          resolve(response);
        })
        .catch(error => reject(error));
    });
  },
  getCategories: async ({ commit }) => {
    try {
      commit(types.SET_LOADING, { loading: true });
      const response = await CategoriesService.getAll();
      commit(types.LIST_CATEGORIES, { categories: response.data });
      commit(types.SET_LOADING, { loading: false });
    } catch (erro) {
      alert(erro);
    }
  },
  // variations
  createVariation: ({ commit }, { variation }) => {
    return new Promise((resolve, reject) => {
      VariationsService.create(variation)
        .then(response => {
          commit(types.CREATE_VARIATION, { variation: response.data });
          resolve(response);
        })
        .catch(error => reject(error));
    });
  },
  editVariation: ({ commit }, { variation }) => {
    return new Promise((resolve, reject) => {
      VariationsService.edit(variation)
        .then(response => {
          commit(types.EDIT_VARIATION, { variation: response.data });
          resolve(response);
        })
        .catch(error => reject(error));
    });
  },
  deleteVariation: async ({ commit }, { id }) => {
    return new Promise((resolve, reject) => {
      VariationsService.delete(id)
        .then(response => {
          commit(types.DELETE_VARIATION, { id });
          resolve(response);
        })
        .catch(error => reject(error));
    });
  },
  getVariations: async ({ commit }) => {
    try {
      commit(types.SET_LOADING, { loading: true });
      const response = await VariationsService.getAll();
      commit(types.LIST_VARIATIONS, { variations: response.data });
      commit(types.SET_LOADING, { loading: false });
    } catch (error) { alert(error) }
  },

  // options
  createOption: ({ commit }, { option, variationId }) => {
    return new Promise((resolve, reject) => {
      OptionsService.create(option, variationId)
        .then(response => {
          commit(types.CREATE_OPTION, { option: response.data, variationId });
          resolve(response);
        })
        .catch(error => reject(error));
    });
  },
  deleteOption: async ({ commit }, { option }) => {
    return new Promise((resolve, reject) => {
      OptionsService.delete(option)
        .then(response => {
          commit(types.DELETE_OPTION, { option });
          resolve(response);
        })
        .catch(error => reject(error));
    });
  },

  editOption: ({ commit }, { option }) => {
    return new Promise((resolve, reject) => {
      OptionsService.edit(option)
        .then(response => {
          commit(types.EDIT_OPTION, { option: response.data });
          resolve(response);
        })
        .catch(error => reject(error));
    });
  },

  //BANNERS
  createBanner: ({ commit }, { banner }) => {
    return new Promise((resolve, reject) => {
      BannersService.createBanner(banner)
        .then(response => {
          console.log(response.data)
          commit(types.CREATE_BANNER, { banner: response.data });
          resolve(response);
        })
        .catch(error => {
          reject(error)
        });
    })
  },
  getBanners: async ({ commit }) => {
    try {
      const response = await BannersService.getAll();
      commit(types.LIST_BANNERS, { banners: response.data });
      commit(types.SET_LOADING, { loading: false });
    } catch (erro) {
      alert(erro)
    }
  },
  deleteBanner: async ({ commit }, { id }) => {
    return new Promise((resolve, reject) => {
      BannersService.delete(id)
        .then(response => {
          commit(types.DELETE_BANNER, { id });
          resolve(response);
        })
        .catch(error => reject(error));
    });
  },
  editBanner: ({ commit }, { banner } ) => {
    return new Promise((resolve, reject) => {
      BannersService.edit(banner)
        .then(response => {
          commit(types.EDIT_BANNER, { banner: response.data });
          resolve(response);
        })
        .catch(error => reject(error));
    });
  },

  //HIGHLIGHTS
  createHighlight: ({ commit }, { highlight }) => {
    return new Promise((resolve, reject) => {
      HighlightsService.createHighlight(highlight)
        .then(response => {
          console.log(response.data)
          commit(types.CREATE_HIGHLIGHT, { highlight: response.data });
          resolve(response);
        })
        .catch(error => {
          reject(error)
        });
    })
  },
  getHighlights: async ({ commit }) => {
    try {
      const response = await HighlightsService.getAll();
      commit(types.LIST_HIGHLIGHTS, { highlights: response.data });
      commit(types.SET_LOADING, { loading: false });
    } catch (error) {
      alert(error)
    }
  },
  deleteHighlight: async ({ commit }, { id }) => {
    return new Promise((resolve, reject) => {
      HighlightsService.delete(id)
        .then(response => {
          commit(types.DELETE_HIGHLIGHT, { id });
          resolve(response);
        })
        .catch(error => reject(error));
    });
  },
  editHighlight: ({ commit }, { highlight } ) => {
    return new Promise((resolve, reject) => {
      HighlightsService.edit(highlight)
        .then(response => {
          commit(types.EDIT_HIGHLIGHT, { highlight : response.data });
          resolve(response);
        })
        .catch(error => reject(error));
    });
  },
};
