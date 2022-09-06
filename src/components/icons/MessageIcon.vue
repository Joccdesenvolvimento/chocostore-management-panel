<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 39.504 39.504"
    class="svg-message"
  >
    <defs>
      <clipPath id="a">
        <rect class="c" width="39.504" height="39.504" />
      </clipPath>
    </defs>
    <g class="bb" transform="translate(39.504) rotate(90)">
      <path
        class="cc"
        :style="{ fill: color, stroke: borderColor }"
        d="M30.916,14.6a14.393,14.393,0,0,1-1.546,6.527A14.6,14.6,0,0,1,16.317,29.2,14.393,14.393,0,0,1,9.79,27.653L0,30.916l3.263-9.79A14.393,14.393,0,0,1,1.718,14.6,14.6,14.6,0,0,1,9.79,1.546,14.393,14.393,0,0,1,16.317,0h.859A14.565,14.565,0,0,1,30.916,13.741Z"
        transform="translate(4.294 4.294)"
      />
    </g>
  </svg>
</template>
<script>
export default {
  props: {
    color: {
      default: 'white'
    },
    size: {
      default: 32.504,
      type: Number
    },
    borderColor: {
      default: 'white'
    }
  }
};
</script>
<style>
.svg-message {
  transform: rotate(270deg);
}
.aa {
  fill: #fff;
  stroke: #887b7b;
}
.cc {
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.316px;
}
</style>
