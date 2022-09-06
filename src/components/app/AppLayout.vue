<template>
  <div class="fill-height">
    <AppMenu />
    <v-container
      grid-list-md
      class="main-painel"
    >
      <v-layout class="fill-height">
        <v-flex
          xs12
          id="content-page"
        >
          <slot></slot>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<style>
.main-painel {
  width: 100% !important;
  max-width: 100% !important;
  height: 100% !important;
  display: inline-block;
  padding: 10px 0px;
  background: var(--v-backgroundPanel-base);
}
.v-icon.v-icon {
    font-weight: 900 !important;
}
.main-painel::-webkit-scrollbar-thumb {
  background-color: var(--v-primary);
  border-radius: 3px;
}

.main-painel::-webkit-scrollbar {
  width: 0.5rem;
  height: 0.5rem;
}

.main-painel:hover::-webkit-scrollbar-thumb {
  -webkit-transition: 1s;
  transition: 1s;
}

.theme--light .main-painel:hover::-webkit-scrollbar-thumb {
  background-color: #bbbbbb !important;
}

.theme--dark .main-painel:hover::-webkit-scrollbar-thumb {
  background-color: #424242 !important;
}

.container.grid-list-md .layout .flex{
  padding: 4px;
}

@media (max-width: 960px){
  .container.grid-list-md .layout .flex{
    padding: 0px;
}
}
</style>
