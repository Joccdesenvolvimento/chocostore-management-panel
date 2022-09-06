<template>
  <AppPageHeader :title="title">
    <slot ></slot>
  </AppPageHeader>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: 'Produtos',
    },
  },
};
</script>
