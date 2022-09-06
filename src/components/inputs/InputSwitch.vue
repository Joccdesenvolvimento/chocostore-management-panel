<template>
  <toggle-switch
    :options="options"
    :class="type"
    @change="$emit('change', $event)"
    :value="value"
  />
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'together' // options: Together, separate
    },
    labels: {
      type: Array
    },
    default: {
      type: String
    }
  },
  methods: {
    together () {
      return {
        layout: {
          backgroundColor: 'var(--v-backgroundSecondary-base)',
          selectedBackgroundColor: 'var(--v-backgroundSecondary-base)'
        },
        size: {
          height: 2,
          padding: 0.25,
          width: 15
        }
      };
    },
    separate () {
      return {
        layout: {
          backgroundColor: 'var(--v-backgroundPanel-base)',
          selectedBackgroundColor: 'var(--v-backgroundPanel-base)'
        },
        size: {
          height: 2.5,
          padding: 0.5,
          width: 15
        }
      };
    }
  },
  data () {
    const { layout, size } = this[this.type]();

    return {
      options: {
        layout: {
          color: '#575962',
          fontFamily: 'poppins',
          selectedColor: 'var(--v-primary-base)',
          borderColor: 'var(--v-backgroundSecondary-base)',
          fontWeightSelected: 'normal',
          ...layout
        },
        size: {
          fontSize: 0.8,
          ...size
        },
        items: {
          preSelected: this.default,
          labels: this.labels
        }
      }
    };
  }
};
</script>
<style>
.toggle-switch .selected.active {
  border: 1px solid var(--v-primary-base) !important;
}

.toggle-switch.separate label {
  border-radius: 8px !important;
  margin: 0px 5px !important;
}

.toggle-switch.together li:first-child label {
  border-top-left-radius: 8px !important;
  border-bottom-left-radius: 8px !important;
}
.toggle-switch.together li:last-child label {
  border-top-right-radius: 8px !important;
  border-bottom-right-radius: 8px !important;
}
</style>
