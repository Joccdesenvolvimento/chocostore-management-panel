<template>
  <div class="content-scroll">
    <v-row justify="center" class="tw-pb-36 md:tw-pb-1">
      <v-col cols="10" md="8">
        <v-row class="mt-10" justify="center">
          <v-col cols="12" md="9" class="pb-0 tw-flex tw-flex-col md:tw-flex-row justify-space-between">
            <p class="mb-0">Dados bancários</p>
            <v-btn
              @click="isAccountDialogVisible = true"
              color="primary"
              depressed
              >Adicionar conta</v-btn
            >
          </v-col>
          <v-col cols="12" md="9" class="mt-6">
            <div v-if="companyData.accounts.length > 0">
              <v-card
                outlined
                v-for="account in companyData.accounts"
                class="mb-5"
                :key="account.id"
              >
                <v-card-text class="d-flex justify-space-between align-center">
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
                  <v-btn
                    :loading="isDeletingAccount == account.id"
                    @click="(e) => deleteAccount(account.id)"
                    icon
                  >
                    <v-icon :color="'grey'"> la-trash </v-icon>
                  </v-btn>
                </v-card-text>
              </v-card>
            </div>
            <div v-else>
              <v-card outlined>
                <v-card-text class="d-flex justify-center py-10 my-10">
                  <span>Nenhuma conta foi adicionada</span>
                </v-card-text>
              </v-card>
            </div>
          </v-col>
        </v-row>

        <AccountFormDialog
          @onSubmit="addAccountOnList"
          @close="isAccountDialogVisible = false"
          :isVisible="isAccountDialogVisible"
        />
      </v-col>
    </v-row>
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
import { PAYMENT_METHODS } from '../../orders/utils/enums';

import AccountFormDialog from '../dialogs/AccountFormDialog';
import AccountsService from '../services/account-service';

export default {
  components: {
    AccountFormDialog,
  },
  props: {
    company: Object,
  },
  data() {
    return {
      paymentMethods: PAYMENT_METHODS,
      companyData: {
        accounts: [],
      },
      isButtonSubmitDisabled: false,
      isDeletingAccount: false,
      isButtonSubmitLoading: false,
      isAccountDialogVisible: false,
      hasChange: false,
      showNotify: false,
      colorMessage: '',
      message: '',
    };
  },
  watch: {
    company(newCompanyValue) {
      this.companyData = { ...newCompanyValue };
    },
  },
  methods: {
    onCompanyChange(data) {
      // this.$emit('saveCompany', data);
      this.hasChange = true;
    },
    addAccountOnList(account) {
      this.isAccountDialogVisible = false;
      this.companyData.accounts.push(account);
    },
    async deleteAccount(accountId) {
      this.isDeletingAccount = accountId;

      try {
        const index = this.companyData.accounts.findIndex(
          (account) => account.id == accountId
        );

        if (index >= 0) {
          await AccountsService.destroy(accountId);
          this.companyData.accounts.splice(index, 1);
        }

        this.showMessage('Conta excluída com sucesso!', 'primary');
      } catch (err) {
        console.log(err);
      }

      this.isDeletingAccount = false;
    },
    showMessage(message, color = '') {
      this.message = message;
      this.colorMessage = color;
      this.showNotify = true;
    },
  },
};
</script>
