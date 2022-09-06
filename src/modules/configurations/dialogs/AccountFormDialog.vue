<template>
  <div class="text-center">
    <v-dialog persistent v-model="isVisible" width="500">
      <v-card>
        <v-card-title class="headline lighten-1" primary-title
          >Nova conta</v-card-title
        >
        <v-card-text class="mt-6">
          <v-form ref="form" v-model="valid">
            <v-row no-gutters>
              <v-col>
                <v-text-field
                  outlined
                  dense
                  label="Nome completo *"
                  :rules="rules"
                  :hide-details="false"
                  v-model="account.fullname"
                />
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col>
                <v-text-field
                  outlined
                  dense
                  label="Cpf/Cnpj *"
                  :rules="rules"
                  v-model="account.cpfCnpj"
                />
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col>
                <v-text-field
                  outlined
                  dense
                  label="Banco *"
                  v-model="account.bank"
                  :rules="rules"
                />
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col>
                <v-text-field
                  outlined
                  dense
                  label="Agência *"
                  v-model="account.agency"
                  :rules="rules"
                />
              </v-col>
            </v-row>
            <v-row no-gutters>
              <v-col>
                <v-text-field
                  outlined
                  dense
                  label="Conta *"
                  v-model="account.account"
                  :rules="rules"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-btn color="primary" class="mr-4" text @click="$emit('close', true)"
            >Cancelar</v-btn
          >
           <v-spacer></v-spacer>
          <ButtonPrimary
            :disabled="disabledButtonSave"
            @click="onSubmitAccountForm"
            >Pronto!</ButtonPrimary
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="showNotify" :color="colorMessage">
      {{ message }}
      <v-btn
        :color="colorMessage == 'primary' ? 'white' : 'red'"
        icon
        @click="showNotify = false"
      >
        <v-icon>la la-close</v-icon>
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import AccountsService from '../services/account-service';

export default {
  props: {
    isVisible: {
      type: Boolean,
    },
  },
  data() {
    return {
      disabledButtonSave: false,
      valid: true,
      showNotify: false,
      colorMessage: '',
      account: {},
      rules: [(v) => !!v || 'Preencha este campo'],
      message: '',
    };
  },
  methods: {
    async onSubmitAccountForm() {
      this.disabledButtonSave = true;
      this.$refs.form.validate();

      if (this.valid) {
        try {
          // if (this.account.id) {
          //     const account = { fullname: this.account.fullname, id: this.account.id};
          //     const response = await this.editCategory({ account });
          // } else {
          const response = await AccountsService.create(
            Object.assign(this.account)
          );
          // }

          this.showMessage('Conta salva com sucesso!', 'primary');

          this.$refs.form.reset();
          this.$emit('onSubmit', response.data);
        } catch (err) {
          console.log(err);
          this.showMessage(err.response.data.errors[0].message);
        }
      }
      this.disabledButtonSave = false;
    },
    showMessage(message, color = '') {
      this.message = message;
      this.colorMessage = color;
      this.showNotify = true;
    },
  },
};
</script>
