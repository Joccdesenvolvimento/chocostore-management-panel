<template>
  <div class="content-scroll">
    <ProductPageHeader title="Nome do produto" />
    <ProductDetails :id="ProductID" />
    <AppFooter>
      <v-row>
        <v-col cols="6">
          <v-btn
            text
            @click="$router.back()"
          >
            <v-icon>la-angle-left</v-icon> Voltar para produtos
          </v-btn>
        </v-col>
        <v-col
          cols="6"
          class="text-right"
        >
          <!-- <ButtonSecondary
            icon
            color="normal"
            class="inline"
          >
            <v-icon>la-angle-left</v-icon>
          </ButtonSecondary> -->
          <ButtonPrimary class="inline">Pronto!</ButtonPrimary>
        </v-col>
      </v-row>
    </AppFooter>
  </div>
</template>

<script>

import ProductDetails from './../components/ProductDetails';
import ProductPageHeader from './../components/ProductPageHeader';

export default {
  name: 'ProductPageDetails',
  components: {
    ProductDetails,
    ProductPageHeader
  },
  data () {
    return {
      ProductID: +this.$route.params.id
    };
  }
};
</script>
