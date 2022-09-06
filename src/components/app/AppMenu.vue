<template>
  <div>
    <v-navigation-drawer
      permanent
      mini-variant
      :mini-variant-width="sizeBar"
      class="menu py-6"
      style="height: 100%"
      position="absolute"
      app
    >
      <div class="style-menu">
        <v-btn icon v-bind="attrs" v-on="on" @click.stop="dialog = true">
          <div class="tw-flex tw-flex-col tw-mt-2 tw-items-center">
            <v-icon class="logout-button">mdi-logout</v-icon>
            <span class="titlesMenuButtons hidden-sm-and-down">Sair</span>
          </div>
        </v-btn>

        <v-dialog v-model="dialog" max-width="350">
          <v-card>
            <v-card-title class="headline">Sair mesmo da conta?</v-card-title>
            <v-card-actions>
              <v-btn color="black darken-1" text @click="dialog = false"
                >Cancelar</v-btn
              >
              <v-spacer></v-spacer>
              <v-btn color="primary" depressed @click="logout">Sair</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <a href="https://wa.me/555430110010" target="_blank">
          <v-btn v-bind="attrs" class="mt-7" v-on="on" icon>
            <div class="tw-flex tw-flex-col tw-items-center">
              <v-icon>la-headset </v-icon>
              <span class="titlesMenuButtons hidden-sm-and-down">Suporte</span>
            </div>
          </v-btn>
        </a>
      </div>

      <div class="menu-content">
        <v-list class="style-menu">
          <v-list-item
            v-for="item in items"
            v-bind:key="item.id"
            class="tw-w-full py-3"
          >
            <router-link v-if="userTypeTest(item.access)" :to="item.routeName">
              <v-list-item-action
                class="justify-center align-center tw-pt-3"
                v-bind="attrs"
                v-on="on"
              >
                <v-badge
                  class="tw-ml-6"
                  v-if="item.routeName == '/pedidos' && registered.length > 0"
                  color="green"
                  :content="registered.length"
                >
                  <!-- <component
                    :is="item.icon"
                    :class="{ 'icon-selected': item.routeName === $route.path }"
                    :width="22"
                    :height="22"
                  ></component> -->
                </v-badge>
                <component
                  :class="{ 'icon-selected': item.routeName === $route.path }"
                  :is="item.icon"
                  :width="22"
                  :height="22"
                ></component>
                <LineBorder
                  left
                  size="3px"
                  height="65px"
                  top="5px"
                  v-show="item.routeName === $route.path"
                ></LineBorder>
                <span
                  :class="{
                    titlesMenuButtonsSelected: item.routeName == $route.path,
                  }"
                  class="titlesMenuButtons hidden-sm-and-down"
                  >{{ item.title }}</span
                >
              </v-list-item-action>
            </router-link>
          </v-list-item>
        </v-list>
      </div>
      <div class="menu-footer text-center">
        <!-- <v-img
          width="33"
          src="../../assets/img/favicon.png"
          alt="chegou"
        /> -->
      </div>
    </v-navigation-drawer>
    <v-snackbar
      v-model="snackbar"
      absolute
      center
      bottom
      style="top: -25px"
      color="primary"
      :timeout="-1"
    >
      Você tem um novo pedido agendado

      <template v-slot:action="{ attrs }">
        <v-btn color="primary" icon v-bind="attrs" @click="snackbar = false">
          <v-icon color="white">la la-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
    <!-- <v-snackbar
      class="hidden-md-and-up"
      v-model="snackbar"
      center
      bottom
      color="primary tw-pa-0"
      :timeout="-1"
    >
      Você tem um novo pedido agendado

      <template v-slot:action="{ attrs }">
        <v-btn color="primary" icon v-bind="attrs" @click="snackbar = false">
          <v-icon color="white">la la-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar> -->
  </div>
</template>

<script>
import CompanyService from '../../modules/configurations/services/configuration-service';

import { createNamespacedHelpers } from 'vuex';

const { mapGetters, mapActions } = createNamespacedHelpers('orders');

export default {
  methods: {
    ...mapActions(['playNotification', 'stopNotification', 'setCompany']),
    logout() {
      window.localStorage.removeItem('companyId');
      this.$router.push('/login');
    },
    isMobileTest() {
      this.isMobile = this.windowWidth > 960 ? false : true;
    },
    userTypeTest(allowedTypes) {
      return this.checkPermissions(allowedTypes);
    },
  },
  computed: {
    ...mapGetters(['registered', 'scheduled']),
    sizeBar: function () {
      return (this.barSize = this.isMobile ? 56 : 88);
    },
  },
  watch: {
    registered(newValue) {
      const filteredNewRegistered = newValue.filter((o) => {
        if (this.scheduled.findIndex((order) => order.id == o.id) >= 0)
          return false;
        return true;
      });

      if (filteredNewRegistered.length > 0) {
        this.playNotification();
      } else {
        this.stopNotification();
      }
    },
    scheduled(newValue, oldValue) {
      if (newValue.length > oldValue.length) {
        this.snackbar = true;
      }
    },
  },
  data() {
    return {
      windowWidth: window.innerWidth,
      isMobile: false,
      barSize: 88,
      dialog: false,
      snackbar: false,
      isLoadingCompany: false,
      items: [
        {
          id: 4,
          title: 'Pedidos',
          icon: 'cart-icon',
          routeName: '/pedidos',
          exact: true,
          access: ['clerk', 'default', 'admin'],
        },
        {
          id: 5,
          title: 'Cadastros',
          icon: 'product-icon',
          routeName: '/produtos',
          exact: true,
          access: ['default', 'admin'],
        },
        {
          id: 6,
          title: 'Configurações',
          icon: 'cog-icon',
          routeName: '/configuracoes',
          exact: true,
          access: ['default', 'admin'],
        },
        {
          id: 7,
          title: 'Financeiro',
          icon: 'financial-icon',
          routeName: '/financeiro',
          exact: true,
          access: ['default', 'admin'],
        },
      ],
      company: {},
    };
  },
  async created() {
    this.isLoadingCompany = true;
    this.isMobileTest();
    try {
      const companyId = window.localStorage.getItem('companyId');
      const response = await CompanyService.get(companyId);
      this.company = response.data;

      this.setCompany({ company: response.data });
    } catch (err) {
      console.log(err.response);
    }

    this.isLoadingCompany = false;
  },
};
</script>

<style>
.logout-button {
  transform: rotate(180deg);
}

.v-navigation-drawer {
  background: var(--v-backgroundPanel-base) !important;
}
.v-navigation-drawer .v-navigation-drawer__border {
  background-color: var(--v-border-base) !important;
}

.v-navigation-drawer .v-list-item__action {
  margin: 0px !important;
}

.menu-icons.v-icon {
  font-size: 20px !important;
  color: #ffffff !important;
}

.v-navigation-drawer.menu .v-navigation-drawer__content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.menu-footer {
  display: grid;
  justify-items: center;
  padding-bottom: 13px;
}
.finances-icon {
  width: 18px;
  height: 20px;
}
.style-menu {
  display: flex !important;
  flex-direction: column;
  align-items: center;
}

.v-application .headline {
  font-size: 1.3rem !important;
}
.titlesMenuButtons {
  font-size: 11px;
  color: #302d2d;
  margin-top: 0.1rem;
}

.titlesMenuButtonsSelected {
  color: #007aff;
}

.icon-selected .a,
.icon-selected .d,
.icon-selected #Caminho_1908,
.icon-selected #Linha_400 {
  stroke: #007aff !important;
}
</style>
