import {
  CREATE_PRODUCT,
  EDIT_PRODUCT,
  DELETE_PRODUCT,
  LIST_PRODUCTS,
  CREATE_CATEGORY,
  EDIT_CATEGORY,
  LIST_CATEGORIES,
  SET_LOADING,
  DELETE_CATEGORY,
  CREATE_VARIATION,
  EDIT_VARIATION,
  DELETE_VARIATION,
  LIST_VARIATIONS,
  CREATE_OPTION,
  EDIT_OPTION,
  DELETE_OPTION,
  CREATE_BANNER,
  EDIT_BANNER,
  DELETE_BANNER,
  LIST_BANNERS,
  LIST_HIGHLIGHTS,
  EDIT_STOCK,
  CREATE_HIGHLIGHT,
  DELETE_HIGHLIGHT,
  EDIT_HIGHLIGHT
} from './mutation-types';

export default {
  // products
  [CREATE_PRODUCT]: (state, { product }) => {
    state.products.push(product);
  },
  [EDIT_PRODUCT]: (state, { product }) => {
    const index = state.products.findIndex(t => t.id === product.id);
    state.products.splice(index, 1, product);
  },
  [DELETE_PRODUCT]: (state, { id }) => {
    const index = state.products.findIndex(t => t.id === id);
    state.products.splice(index, 1);
  },
  [LIST_PRODUCTS]: (state, { products }) => {
    state.products = products;
  },

  //HIGHLIGHTS
  [CREATE_HIGHLIGHT]: (state, { highlight }) => {
    state.highlights.push(highlight);
  },
  [EDIT_HIGHLIGHT]: (state, { highlight }) => {
    const index = state.highlights.findIndex(t => t.id === highlight.id);
    state.highlights.splice(index, 1, highlight);
  },
  [DELETE_HIGHLIGHT]: (state, { id }) => {
    const index = state.highlights.findIndex(t => t.id === id);
    state.highlights.splice(index, 1);
  },
  [LIST_HIGHLIGHTS]: (state, { highlights }) => {
    state.highlights = highlights;
  },

  //STOCK FROM LIST
  [EDIT_STOCK]: (state, { product }) => {
    const index = state.products.findIndex(t => t.id === product.id);
    state.products.splice(index, 1, product);
  },
  //BANNERS
  [CREATE_BANNER]: (state, { banner }) => {
    state.banners.push(banner);
  },
  [EDIT_BANNER]: (state, { banner }) => {
    const index = state.banners.findIndex(t => t.id === banner.id);
    state.banners.splice(index, 1, banner);
  },
  [DELETE_BANNER]: (state, { id }) => {
    const index = state.banners.findIndex(t => t.id === id);
    state.banners.splice(index, 1);
  },
  [LIST_BANNERS]: (state, { banners }) => {
    state.banners = banners;
  },

  // categories
  [CREATE_CATEGORY]: (state, { category }) => {
    state.categories.push(category);
  },
  [EDIT_CATEGORY]: (state, { category }) => {
    const index = state.categories.findIndex(t => t.id === category[0].id);
    state.categories.splice(index, 1, category[0]);
  },
  [DELETE_CATEGORY]: (state, { id }) => {
    const index = state.categories.findIndex(t => t.id === id);
    state.categories.splice(index, 1);
  },
  [LIST_CATEGORIES]: (state, { categories }) => {
    state.categories = categories;
  },
  [SET_LOADING]: (state, { loading }) => {
    state.loading = loading;
  },

  // variations
  [CREATE_VARIATION]: (state, { variation }) => {
    state.variations.push(variation);
  },
  [EDIT_VARIATION]: (state, { variation }) => {
    const index = state.variations.findIndex(t => t.id === variation.id);
    state.variations.splice(index, 1, variation);
  },
  [DELETE_VARIATION]: (state, { id }) => {
    const index = state.variations.findIndex(t => t.id === id);
    state.variations.splice(index, 1);
  },
  [LIST_VARIATIONS]: (state, { variations }) => {
    state.variations = variations;
  },
  [CREATE_OPTION]: (state, { option, variationId }) => {
    const variationIndex = state.variations.findIndex(v => v.id == variationId);
    const variation = state.variations[variationIndex];

    variation.options.push(option);
    state.variations.splice(variationIndex, 1, variation);
  },
  [EDIT_OPTION]: (state, { option }) => {
    const variationIndex = state.variations.findIndex(
      t => t.id === option.variationId
    );
    const variation = { ...state.variations[variationIndex] };

    const optionIndex = variation.options.findIndex(opt => opt.id == option.id);
    variation.options.splice(optionIndex, 1, option);

    state.variations.splice(variationIndex, 1, variation);
  },
  [DELETE_OPTION]: (state, { option }) => {
    const variationIndex = state.variations.findIndex(
      v => v.id === option.variationId
    );
    const variation = { ...state.variations[variationIndex] };
    const optionIndex = variation.options.findIndex(o => o.id === option.id);

    variation.options.splice(optionIndex, 1);

    state.variations.splice(variationIndex, 1, variation);
  }
};
