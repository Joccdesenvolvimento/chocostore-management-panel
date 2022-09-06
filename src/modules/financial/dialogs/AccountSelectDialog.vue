<template>
  <div class="text-center">
    <v-dialog persistent v-model="isVisible" width="800">
      <v-card :loading="isLoadingAccounts">
        <v-card-title class="headline lighten-1" primary-title
          >Selecione a conta para o depósito</v-card-title
        >
        <v-card-text class="mt-6">
          <v-row justify="center">
            <v-col cols="12" class="pb-0 d-flex justify-space-between">
              <p class="mb-0">Dados bancários</p>
              <v-btn
                @click="isAccountDialogVisible = true"
                color="primary"
                depressed
                >Adicionar conta</v-btn
              >
            </v-col>
            <v-col cols="12" class="mt-6">
              <div
                class="content-scroll"
                style="max-height: 250px; padding-right: 15px"
              >
                <div v-if="company.accounts.length > 0">
                  <v-radio-group v-model="selectedAccount">
                    <v-card
                      outlined
                      v-for="account in company.accounts"
                      class="mb-5"
                      :ripple="false"
                      :key="account.id"
                      @click="selectedAccount = account.id"
                    >
                      <v-card-text
                        class="d-flex justify-space-between align-center"
                      >
                        <div class="d-flex flex-column">
                          <div class="mb-2">
                            <span class="subtitle-3 black--text"
                              >{{ account.fullname }} ({{ account.cpfCnpj }})
                            </span>
                          </div>
                          <div>
                            Banco {{ account.bank }}, Agência
                            {{ account.agency }} Conta {{ account.account }}
                          </div>
                        </div>
                        <v-radio :value="account.id"></v-radio>
                      </v-card-text>
                    </v-card>
                  </v-radio-group>
                </div>
                <div v-else>
                  <v-card outlined>
                    <v-card-text class="d-flex justify-center py-10 my-10">
                      <span>Nenhuma conta foi adicionada</span>
                    </v-card-text>
                  </v-card>
                </div>
              </div>
            </v-col>
          </v-row>

          <AccountFormDialog
            @onSubmit="addAccountOnList"
            @close="isAccountDialogVisible = false"
            :isVisible="isAccountDialogVisible"
          />
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" class="mr-4" text @click="$emit('close', true)"
            >Cancelar</v-btn
          >
          <ButtonPrimary :disabled="disabledButtonSave" @click="onSubmit"
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
import AccountsService from '../../configurations/services/account-service';
import AccountFormDialog from '../../configurations/dialogs/AccountFormDialog';
import FinancialService from '../services/financial-service';

export default {
  components: {
    AccountFormDialog,
  },
  props: {
    isVisible: {
      type: Boolean,
    },
  },
  data() {
    return {
      selectedAccount: 0,
      company: {
        accounts: [],
      },
      isAccountDialogVisible: false,
      showNotify: false,
      isLoadingAccounts: false,
      colorMessage: '',
      message: '',
      disabledButtonSave: false,
    };
  },
  watch: {
    isVisible(newValue) {
      if (newValue) {
        this.isLoadingAccounts = true;

        AccountsService.get()
          .then((response) => {
            this.company.accounts = response.data;
            this.isLoadingAccounts = false;
          })
          .catch((err) => {
            this.isLoadingAccounts = false;
          });
      }
    },
  },
  methods: {
    addAccountOnList(account) {
      this.isAccountDialogVisible = false;
      this.company.accounts.push(account);
    },
    async onSubmit() {
      this.disabledButtonSave = true;
      try {
        const selectedAccountObject = {
          ...this.company.accounts.find(
            (account) => account.id == this.selectedAccount
          ),
        };

        const response = await FinancialService.createRequest(
          selectedAccountObject
        );

        this.showMessage('Saque solicitado com sucesso!', 'primary');
        this.$emit('onSubmit', response.data);
      } catch (err) {
        console.log(err);
        this.showMessage('Não foi possível solicitar o saque');
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
