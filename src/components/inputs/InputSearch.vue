<template>
  <v-text-field
    :placeholder="placeholder"
    solo
    dense
    flat
    clearable
    clear-icon="la-close"
    class="search"
    hide-details
    :value="value"
    @input="$emit('input', $event)"
  >
    <v-icon
      slot="append"
      color="gray"
      size="14px"
    >la-search</v-icon>
  </v-text-field>
</template>
<script>
export default {
  props: {
    placeholder: {
      default: 'Pesquisar'
    },
    value: {
      type: String,
      default: ''
    }
  }
};
</script>
<style scoped>
.search {
  border: 1px solid var(--v-border-base) !important;
  font-size: 0.8rem !important;
  margin: 5px ;
}

@media (max-width: 960px){
  .search {
    margin-right: 50px !important;
    margin-left: 50px !important;
  }
}
@media (max-width: 375px){
.search {
    margin-right: 15px !important;
    margin-left: 15px !important;
  }

}
</style>
