<template>
  <v-dialog fullscreen hide-overlay :value="open">
    <v-card>
      <v-card-title>
        <v-btn icon @click="$emit('close')">
          <v-icon>la-angle-left</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="tw-flex tw-flex-col">
        <v-row no-gutters>
          <v-col class="mb-6 tw-text-center" cols="12">
            <span class="title">{{ dialogTitle + ' usuário' }}</span>
          </v-col>
        </v-row>
        <v-col cols="10" class="tw-self-center">
          <v-row no-margin>
            <v-col cols="12" md="6">
              <InputTextField label="Nome" v-model="user.name" />
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                outlined
                dense
                hide-details
                :items="types"
                v-model="user.type"
                item-text="text"
                item-value="value"
                label="Tipo"
              ></v-select>
            </v-col>
          </v-row>
          <v-row no-margin>
            <v-col cols="12" :md="isEdit && !showPassword ? '9' : '6'">
              <InputTextField label="Email" v-model="user.email" />
            </v-col>
            <v-spacer v-if="isEdit && !showPassword"></v-spacer>
            <v-col v-if="isEdit && !showPassword" cols="12" md="2">
              <ButtonPrimary block @click="showPassword = true"
                >Alterar Senha!</ButtonPrimary
              >
            </v-col>
            <v-col v-if="!isEdit || showPassword" cols="12" md="6">
              <v-text-field
                :label="showPassword ? 'Nova senha' : 'Senha'"
                dense
                persistent-hint
                :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPass ? 'text' : 'password'"
                v-model="password"
                outlined
                @click:append="showPass = !showPass"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row no-margin class="mt-3">
            <v-col cols="6">
              <v-btn depressed block @click="$emit('close')" color="normal"
                >Voltar</v-btn
              >
            </v-col>
            <v-col cols="6">
              <ButtonPrimary
                :loading="isSaving"
                :disabled="isDisabledButtonSave"
                block
                @click="onSubmit()"
                >Pronto!</ButtonPrimary
              >
            </v-col>
          </v-row>
        </v-col>
      </v-card-text>
      <v-card-actions>
        <v-snackbar app v-model="showNotify" :color="colorMessage">
          {{ message }}
          <v-btn
            :color="colorMessage == 'primary' ? 'white' : 'red'"
            icon
            @click="showNotify = false"
          >
            <v-icon>la la-close</v-icon>
          </v-btn>
        </v-snackbar>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';

const { mapActions } = createNamespacedHelpers('users');
export default {
  props: {
    open: {
      default: false,
      type: Boolean,
    },
    isEdit: {
      default: false,
    },
    userEdit: {
      default: {},
    },
  },
  data() {
    return {
      showPassword: false,
      user: this.userEdit,
      types: [
        { id: 0, text: 'Adiministrador', value: 'admin' },
        { id: 1, text: 'Atendente', value: 'clerk' },
      ],
      isSaving: false,
      password: null,
      // isDisabledButtonSave: false,
      dialogTitle: this.isEdit ? 'Editar' : 'Criar',
      showPass: false,
      showNotify: false,
      colorMessage: '',
      message: '',
    };
  },
  computed: {
    isDisabledButtonSave() {
      if (this.user) {
        if (
          this.user.name &&
          this.user.email &&
          (this.password || (this.isEdit && !this.showPassword)) &&
          this.user.type
        ) {
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    },
  },
  methods: {
    ...mapActions(['createUser', 'editUser']),
    async onSubmit() {
      this.isSaving = true;
      try {
        if ((this.showPassword && this.isEdit) || !this.isEdit) {
          this.user.password = this.password;
        }
        if (!this.isEdit) {
          await this.createUser({ user: this.user });
        } else {
          await this.editUser({
            user: this.user,
            editPassword: this.showPassword,
          });
        }
        this.$emit('submit');
      } catch (err) {
        console.log(err);
        this.showMessage(err.response.data.errors[0].message);
      }
      this.isSaving = false;
    },
    showMessage(message, color = '') {
      this.message = message;
      this.colorMessage = color;
      this.showNotify = true;
    },
  },
};
</script>