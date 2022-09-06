<template>
  <AppFloatingButton @click="$emit('clickFloating')" class="top-left-speed-dial floating-button-footer">
    <v-list
      class="list-floating"
      dense
    >
      <v-list-item
        v-for="(option, key) in items"
        :key="key"
        @click.stop="$emit('click', option)"
      >
        <v-list-item-icon>
          <component
            :is="option.icon"
            width="20"
            height="25"
            class="primary--text"
          />
        </v-list-item-icon>
        <v-list-item-content>
          <span>{{ option.text }}</span>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </AppFloatingButton>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true
    }
  }
};
</script>
