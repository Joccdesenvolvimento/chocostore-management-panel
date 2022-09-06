<template>
  <div class="hidden-sm-and-down">
    <div class="itens-position">
      <div
        class="d-flex align-center mx-8 flex-wrap"
        :class="index % 2 == 0 ? 'flex-row' : 'flex-row-reverse'"
        v-for="(hint, index) in hints"
        :key="index"
      >
        <div class="align-center" :class="index % 2 == 0 ? 'pr-3' : 'pl-3'">
          <v-icon x-large color="primary">{{
            index % 2 == 0
              ? 'mdi-hand-pointing-right'
              : 'mdi-hand-pointing-left'
          }}</v-icon>
        </div>
        <div
          class="card-1 d-flex align-center justify-space-around"
          :class="
            index % 2 == 0 ? 'flex-row align-self-end' : 'flex-row-reverse'
          "
        >
          <div>
            <h3 class="color-text-main">
              <strong>{{ hint.title }}</strong>
            </h3>
            {{ hint.text }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import appHints from '../../utils/mixins/tips-app';
export default {
  data() {
    return {
      hints: appHints,
    };
  },
};
</script>

<style scoped>
.itens-position {
  display: flex;
  flex-direction: column;
}
.card-1 {
  margin: 10px;
  max-width: 60%;
  background-color: var(--v-backgroundSecondary-base);
  border-radius: 25px;
  padding: 15px;
}
</style>
