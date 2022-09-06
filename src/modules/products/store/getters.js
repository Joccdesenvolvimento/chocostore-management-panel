import {
  mapProducts,
  mapProduct,
  mapCategories,
  mapVariations,
  mapBanners,
  mapHighlights,
} from './../utils/helpers/products';

/* eslint eqeqeq: "off" */

export default {
  products: state => mapProducts(state.products, state.categories),
  productsWithoutImage: state => {
    const products = mapProducts(state.products, state.categories);

    return products.filter(p => !p.photo && p.isExternal == false);
  },
  getProduct: state => id =>
    mapProduct(state.products.find(product => product.id == id)),

  getProductWithoutMasks: state => id =>
    state.products.find(product => product.id == id),

  categories: state => mapCategories(state.categories),

  banners: state => {
    mapBanners(state.banners)
    return state.banners
  },

  highlights: state => {
    mapHighlights(state.highlights)
    return state.highlights
  },

  variations: state => mapVariations(state.variations),
  getVariation: state => (variationId) => {
    return state.variations.find(variation => variation.id == variationId);
  }
};
