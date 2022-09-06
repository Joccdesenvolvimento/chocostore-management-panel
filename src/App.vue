<template>
  <v-app>
    <v-main>
      <keep-alive ref="keep" include="page" v-if="isLoggedIn">
        <router-view />
      </keep-alive>
      <router-view v-else></router-view>
    </v-main>

    <!-- <iframe
      src="./modules/orders/store/sound-notification.mp3"
      allow="autoplay"
      id="notificationAudio"
      style="display: none"
    ></iframe> -->
    <audio id="player" muted loop>
      <source
        src="./modules/orders/store/sound-notification.mp3"
        type="audio/mp3"
      />
    </audio>
  </v-app>
</template>

<script>
import registerOrderStore from './modules/orders/store/register';
import { createNamespacedHelpers } from 'vuex';

const { mapActions, mapGetters } = createNamespacedHelpers('orders');

export default {
  name: 'App',
  data() {
    return {
      isLoggedIn: false // determines if dashboard is kept alive or not
    };
  },
  computed: {
    ...mapGetters(['orders'])
  },
  methods: {
    ...mapActions(['getOrders', 'getOrdersMessages'])
  },
  created() {
    registerOrderStore(this.$store);
    this.getOrders();
    this.getOrdersMessages();
  },
  watch: {
    $route(to, from) {
      const companyId = window.localStorage.getItem('companyId');

      if (companyId === null) {
        this.isLoggedIn = false;
        // this.$refs.keep.
      } else {
        this.isLoggedIn = true;
        registerOrderStore(this.$store);
      }
    }
  }
};
</script>

<style>
.content-scroll {
  height: calc(100vh - 73px);
  overflow-y: auto;
  overflow-x: hidden;
}

.content-scroll.fill-height {
  height: 100%;
}

::-webkit-scrollbar-track {
  background: #f9f9f9;
}

::-webkit-scrollbar-thumb {
  border-radius: 30px;
  background-color: #c9c9c9;
}

*::-webkit-scrollbar {
  border-radius: 30px;
  width: 8px;
}
*::-webkit-scrollbar-track {
  background-color: white;
  border-radius: 30px;
}

*::-webkit-scrollbar-thumb {
  /* background-color: #f0f0f0; */
  /* background-color: #c9c9c9; */
  background-color: #e9e9e9;
  border-radius: 30px;
}

.content-scroll::-webkit-scrollbar {
  border-radius: 30px;
  width: 8px;
}
.content-scroll::-webkit-scrollbar-track {
  background-color: white;
  border-radius: 30px;
}

.content-scroll::-webkit-scrollbar-thumb {
  background-color: #c9c9c9;
  border-radius: 30px;
}

.custom-scroll {
  overflow-y: auto;
  overflow-x: hidden;
}
.v-data-table>.v-data-table__wrapper>table>tbody>tr>td, .v-data-table>.v-data-table__wrapper>table>tfoot>tr>td, .v-data-table>.v-data-table__wrapper>table>thead>tr>td {
    height: 40px;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: 1px;
    overflow: hidden;
}

.content-scroll {
  height: calc(100vh - 73px);
  overflow-y: auto;
  overflow-x: hidden;
}

::-webkit-scrollbar-track {
  background: #f9f9f9;
}

::-webkit-scrollbar-thumb {
  border-radius: 30px;
  background-color: #c9c9c9;
}

.content-scroll::-webkit-scrollbar {
  border-radius: 30px;
  width: 8px;
}
.content-scroll::-webkit-scrollbar-track {
  background-color: white;
  border-radius: 30px;
}

.content-scroll::-webkit-scrollbar-thumb {
  background-color: #c9c9c9;
  border-radius: 30px;
}


.custom-scroll::-webkit-scrollbar {
  border-radius: 30px;
  width: 8px;
}
.custom-scroll::-webkit-scrollbar-track {
  background-color: white;
  border-radius: 30px;
}

.custom-scroll::-webkit-scrollbar-thumb {
  background-color: #f0f0f0;
  border-radius: 30px;
}

::-webkit-scrollbar-track-piece {
  background: transparent;
}

html {
  overflow: hidden !important;
}
.bb {
  border-bottom: 1px solid var(--v-border-base);
}
.no-spacing {
  padding-top: 0px !important;
  margin-top: 0px !important;
}
.v-icon.v-icon.no-focus::after {
  display: none;
}

.hover-pointer:hover {
  cursor: pointer !important;
}

.no-border{
  border: none!important;
}

.no-border-and-box-shadow {
  box-shadow: none!;
  border: none !important;
}
.v-application {
  font-family: 'poppins', sans-serif !important;
}
/* :not(i)  {
  font-family: 'poppins', sans-serif !important;
} */
.v-simple-checkbox .v-icon,
.check-mini .v-icon,
table .v-icon {
  font-size: 20px !important;
}
.v-data-table .mdi-checkbox-marked {
  color: var(--v-primary-base) !important;
}

.mdi-minus-box:before {
  content: '\F0131' !important;
}

.v-btn {
  letter-spacing: 0 !important;
  text-transform: inherit !important;
}
.v-application .title {
  font-weight: 700;
}

.v-application a {
  color: inherit !important;
  text-decoration: inherit !important;
}

[relative] {
  position: relative;
}

[borderless] {
  border: none;
}
</style>
