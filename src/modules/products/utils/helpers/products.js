import { maskBr } from 'js-brasil';

import { currency } from '@/utils/helpers/currency';

const mapProduct = (product, category) => {
  return {
    ...product,
    category: category ? category.description : '',
    price: product.price
  };
};
const mapProducts = (products, categories) => {
  return products.map(product => {
    const category = categories.filter(cat => +cat.id === +product.categoryId);
    return mapProduct(product, category.length > 0 ? category[0] : null);
  });
};

const mapCategory = category => {
  return {
    ...category,
    statusText: category.isActive ? 'Ativa' : 'Inativa'
  };
};
const mapCategories = categories => {
  return categories.map(category => {
    return mapCategory(category);
  });
};

const mapVariation = variation => {
  return {
    ...variation,
    labelRequired: variation.isRequired ? 'Obrigatório' : 'Opcional'
  };
};

const mapVariations = variations => {
  return variations.map(variation => {
    return mapVariation(variation);
  });
};

const mapBanner = banner => {
  return {
    ...banner
  };
};

const mapBanners = banners => {
  return banners.map(banner => {
    return mapBanner(banner);
  })
};

const mapHighlight = highlight => {
  return {
    ...highlight
  }
}

const mapHighlights = highlights => {
  return highlights.map(highlight => {
    return mapHighlight(highlight)
  })
}

export { mapCategory, mapCategories, mapProducts, mapProduct, mapVariations, mapBanners, mapHighlight, mapHighlights };
