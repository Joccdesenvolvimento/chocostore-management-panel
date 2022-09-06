<template>
  <v-app>
    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card :loading="showLoading" border-light outlined>
              <v-card-title class="d-flex justify-center pa-8">
                <img src="../../../assets/img/logo.png" width="150px" />
              </v-card-title>
              <v-card-text>
                <v-text-field label="Email"
                  @keyup.enter="authUser()" v-model="login" outlined></v-text-field>
                <v-text-field
                  label="Senha"
                  hide-details
                  :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showPass ? 'text' : 'password'"
                  v-model="password"
                  @keyup.enter="authUser()"
                  outlined
                  @click:append="showPass = !showPass"
                ></v-text-field>
              </v-card-text>
              <v-card-actions class="d-flex justify-center">
                <v-btn color="primary" depressed @click="authUser()">Entrar</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>
<script>
import AuthService from './../services/auth-service';

export default {
  data() {
    return {
      showLoading: false,
      showPass: false,
      login: '',
      password: ''
    };
  },
  methods: {
    async authUser() {
      this.showLoading = true;

      try {
        const { data } = await AuthService.login(this.login, this.password);
        // this.setUser(data.loggedUser)
        window.localStorage.setItem('companyId', data.id);
        window.localStorage.setItem('auth-token', data.token);
        if(data.loggedUser){
          window.localStorage.setItem('user-type', data.loggedUser.type);
        }

        // this.$router.push({ name: 'order-list' });
        window.location.href = '/pedidos';
        this.showLoading = false;
      } catch (err) {
        
        if (err.response && err.response.data) {
          alert(err.response.data.message);
        } else {
          alert(err);
        }

        this.showLoading = false;
      }
    }
  }
};
</script>

<style>
.v-stepper__header {
  height: 100px;
  box-shadow: none !important;
}
.v-text-field--outlined fieldset,
.v-text-field--outlined:hover ~ fieldset {
  border-color: #dadce0;
}

.v-card__title,
.v-card__actions,
.v-card__text {
  padding: 16px !important;
}

.padding-tb-card-text {
  padding-top: 32px !important;
  padding-bottom: 32px !important;
}
</style>
