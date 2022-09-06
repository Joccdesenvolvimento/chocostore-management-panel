<template>
  <div>
    <div
      class="line"
      :color="color"
      :style="styleObject"
      v-bind="$attrs"
    ></div>
    <slot>
    </slot>
  </div>
</template>

<script>
export default {
  props: {
    size: {
      type: String,
      default: '6px'
    },
    height: {
      type: String,
      default: '40px'
    },
    color: {
      type: String,
      default: 'primary'
    }
  },
  computed: {
    styleObject () {
      return {
        ...{
          width: this.size,
          height: this.height
        },
        ...(typeof this.$attrs.top === 'string' ? { top: this.$attrs.top } : {})
      };
    }
  }
};
</script>

<style scoped>
.line {
  position: absolute;
  border-radius: 3px;
}

.line[top] {
  top: 10px;
}

.line[bottom] {
  bottom: 10px;
}

.line[right] {
  right: 0px;
}

.line[left] {
  left: 0px;
}

.line[negative-left] {
  left: -3px;
}

.line[negative-right] {
  right: -7px;
}

.line[color='normal'] {
  background: var(--v-backgroundSecondary-base);
}
.line[color='primary'] {
  background: var(--v-primary-base);
}
.line[color='secondary'] {
  background: var(--v-secondary-base);
}
.line[color='accent'] {
  background: var(--v-accent-base);
}
.line[color='pink'] {
  background: var(--v-pink-base);
}
.line[color='error'] {
  background: var(--v-error-base);
}
.line[color='info'] {
  background: var(--v-info-base);
}
.line[color='red'] {
  background: var(--v-red-base);
}
.line[color='success'] {
  background: var(--v-success-base);
}
.line[color='warning'] {
  background: var(--v-warning-base);
}
</style>
