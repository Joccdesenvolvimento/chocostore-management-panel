<template>
  <v-footer fixed>
    <v-row no-gutters>
      <v-col cols="12">
        <slot></slot>
      </v-col>
    </v-row>
  </v-footer>
</template>

<style>
.v-footer {
  background: var(--v-backgroundPanel-base) !important;
  border-top: 1px solid var(--v-border-base) !important;
  left: 56px !important;
  max-height: 73px !important;
}

.footer-paginate {
  padding: 0px 16px !important;
}

@media (max-width: 960px) {
  .footer-paginate {
    margin-left: -2rem;
  }
}

.footer-paginate .v-pagination {
  justify-content: start !important;
}
</style>
