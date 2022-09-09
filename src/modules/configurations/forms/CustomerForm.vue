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
                        <span class="title">{{ dialogTitle + ' cliente' }}</span>
                    </v-col>
                </v-row>
                <v-col cols="10" class="tw-self-center">
                    <v-row no-margin>
                        <v-col cols="12" md="6">
                            <InputTextField label="Nome" v-model="customer.name" />
                        </v-col>
                        <v-col cols="12" md="2">
                            <InputTextField label="CPF" v-model="customer.cpf" disabled />
                        </v-col>
                        <v-col cols="12" md="4">
                            <InputTextField label="Telefone" v-model="customer.phone" />
                        </v-col>
                    </v-row>
                    <v-row no-margin v-if="customer.Addresses.length > 0">
                        <v-col cols="12" md="6">
                            <InputTextField label="Rua" :value="customer.Addresses[0].street" disabled />
                        </v-col>
                        <v-col cols="12" md="2">
                            <InputTextField label="Número" :value="customer.Addresses[0].number" disabled />
                        </v-col>
                        <v-col cols="12" md="2">
                            <InputTextField label="Bairro" :value="customer.Addresses[0].neighborhood" disabled />
                        </v-col>
                        <v-col cols="12" md="2">
                            <InputTextField label="CEP" :value="customer.Addresses[0].zipCode" disabled />
                        </v-col>
                        <v-col cols="12" md="3">
                            <InputTextField label="Cidade" :value="customer.Addresses[0].city" disabled />
                        </v-col>
                        <v-col cols="12" md="3">
                            <InputTextField label="Estado" :value="customer.Addresses[0].state" disabled />
                        </v-col>
                        <v-col v-if="customer.Addresses[0].reference != null" cols="12" md="3">
                            <InputTextField label="Referencia" :value="customer.Addresses[0].reference" disabled />
                        </v-col>
                        <v-col v-if="customer.Addresses[0].complement != null" cols="12" md="3">
                            <InputTextField label="Complemento" :value="customer.Addresses[0].complement" disabled />
                        </v-col>
                    </v-row>
                    <v-row no-margin>
                        <v-col cols="12" :md="isEdit && !showPassword ? '9' : '6'">
                            <InputTextField label="Email" v-model="customer.email" />
                        </v-col>
                        <v-spacer v-if="isEdit && !showPassword"></v-spacer>
                        <v-col v-if="isEdit && !showPassword" cols="12" md="2">
                            <ButtonPrimary block @click="showPassword = true">Alterar Senha!</ButtonPrimary>
                        </v-col>
                        <v-col v-if="!isEdit || showPassword" cols="12" md="6">
                            <v-text-field :label="showPassword ? 'Nova senha' : 'Senha'" dense persistent-hint
                                :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                                :type="showPass ? 'text' : 'password'" v-model="password" outlined
                                @click:append="showPass = !showPass"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row no-gutters>
                        <v-col cols="12" md="12" class="mt-6 tw-text-center">
                            <p class="subtitle-1 font-weight-medium">Observações</p>
                        </v-col>
                        <v-col cols="12" md="6">
                            <p>Registrado em: {{formatDate(customer.createdAt)}}</p>
                            <p>Atualizado em: {{formatDate(customer.updatedAt)}}</p>
                            <p>Entrou pela última vez em: {{formatDate(customer.lastOpened)}}</p>
                        </v-col>
                        <v-col cols="12" md="6">
                            <p>Carteira Virtual : {{customer.UserVirtualWallet != null ? 'Sim' : 'Não'}}</p>
                            <div v-if="customer.UserVirtualWallet != null">
                                <p>Valor atual : {{parseFloat(customer.UserVirtualWallet.totalAmount).toFixed(2)}}</p>
                                <p>ID da carteira : {{customer.UserVirtualWallet.id}}</p>
                                <p>Criada em : {{formatDate(customer.UserVirtualWallet.createdAt)}}</p>
                                <p>Atualizada em : {{formatDate(customer.UserVirtualWallet.updatedAt)}}</p>
                            </div>
                        </v-col>
                    </v-row>
                    <v-row no-margin class="mt-3">
                        <v-col cols="6">
                            <v-btn depressed block @click="$emit('close')" color="normal">Voltar</v-btn>
                        </v-col>
                        <v-col cols="6">
                            <ButtonPrimary :loading="isSaving" :disabled="isDisabledButtonSave" block
                                @click="onSubmit()">Pronto!</ButtonPrimary>
                        </v-col>
                    </v-row>
                </v-col>
            </v-card-text>
            <v-card-actions>
                <v-snackbar app v-model="showNotify" :color="colorMessage">
                    {{ message }}
                    <v-btn :color="colorMessage == 'primary' ? 'white' : 'red'" icon @click="showNotify = false">
                        <v-icon>la la-close</v-icon>
                    </v-btn>
                </v-snackbar>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
  
<script>
import moment from 'moment';
moment.locale('pt-br');
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
        customerEdit: {
            default: {},
        },
    },
    data() {
        return {
            showPassword: false,
            customer: this.customerEdit,
            isSaving: false,
            password: null,
            // isDisabledButtonSave: false,
            dialogTitle: this.isEdit ? 'Alterar' : 'Criar',
            showPass: false,
            showNotify: false,
            colorMessage: '',
            message: '',
        };
    },
    watch: {
        customerEdit(val) {
            console.log(val)
        }
    },
    computed: {
        isDisabledButtonSave() {
            if (this.customer) {
                if (
                    this.customer.name &&
                    this.customer.email &&
                    (this.password || (this.isEdit && !this.showPassword))
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
        ...mapActions(['createCustomer', 'editCustomer']),
        formatDate(date) {
            return moment(date).format('DD/MM/YYYY HH:mm');
        },
        async onSubmit() {
            console.log(this.customer);
            /* this.isSaving = true;
            try {
                if ((this.showPassword && this.isEdit) || !this.isEdit) {
                    this.customer.password = this.password;
                }
                if (!this.isEdit) {
                    await this.createCustomer({ customer: this.customer });
                } else {
                    await this.editCustomer({
                        customer: this.customer,
                        editPassword: this.showPassword,
                    });
                }
                this.$emit('submit');
            } catch (err) {
                console.log(err);
                this.showMessage(err.response.data.errors[0].message);
            }
            this.isSaving = false; */
        },
        showMessage(message, color = '') {
            this.message = message;
            this.colorMessage = color;
            this.showNotify = true;
        },
    },
};
</script>