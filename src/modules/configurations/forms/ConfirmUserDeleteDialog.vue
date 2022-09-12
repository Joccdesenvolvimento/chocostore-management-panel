<template>
    <div class="text-center">
        <v-dialog persistent v-model="showDialog" width="500">
            <v-card>
                <v-card-title class="headline lighten-1" primary-title>Excluir</v-card-title>
                <v-card-text>Tem certeza que deseja excluir os seguintes usuários?</v-card-text>
                <v-card-text v-if="selectedCustomers.length > 0"><strong>- Clientes:</strong></v-card-text>
                <v-card-text v-if="selectedCustomers.length > 0" v-for="(name) in selectedCustomersResolution">
                    {{name}}
                </v-card-text>
                <v-card-text v-if="selectedUsers.length > 0"><strong>- Sistema:</strong></v-card-text>
                <v-card-text v-if="selectedUsers.length > 0" v-for="(name) in selectedUsersResolution">
                    {{name}}
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" class="mr-4" text @click="$emit('close')">Cancelar</v-btn>
                    <ButtonPrimary :disabled="disableButton" @click="onConfirm">Confirmar!</ButtonPrimary>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-snackbar v-model="showNotify" :color="colorMessage">
            {{ message }}
            <v-btn :color="colorMessage == 'primary' ? 'white' : 'red'" icon @click="showNotify = false">
                <v-icon>la la-close</v-icon>
            </v-btn>
        </v-snackbar>
    </div>
</template>
  
<script>
import { createNamespacedHelpers } from 'vuex';

const { mapActions } = createNamespacedHelpers('users');
export default {
    props: {
        showDialog: {
            type: Boolean,
        },
        selectedUsersArray: {
            type: Array,
            default() {
                return []
            }
        },
        selectedCustomersArray: {
            type: Array,
            default() {
                return []
            }
        }
    },
    data() {
        return {
            selectedUsers: [],
            selectedCustomers: [],
            showNotify: false,
            disableButton: false,
            colorMessage: '',
            message: ''
        }
    },
    watch: {
        selectedCustomersArray: {
            immediate: true,
            handler(newVal) {
                this.selectedCustomers = newVal
            }
        },
        selectedUsersArray: {
            immediate: true,
            handler(newVal) {
                this.selectedUsers = newVal
            }
        },
    },
    computed: {
        selectedCustomersResolution() {
            let names = [];
            this.selectedCustomers.forEach((customer, index) => {

                if (index <= 5) names.push(customer.name)
            });
            return names
        },
        selectedUsersResolution() {
            let names = [];
            this.selectedUsers.forEach((users, index) => {

                if (index <= 5) names.push(users.name)
            });
            return names
        }
    },
    methods: {
        ...mapActions(['deleteUser', 'deleteCustomer']),
        async onConfirm() {
            this.disableButton = true
            try {
                if (this.selectedCustomers.length > 0)
                    await Promise.all(
                        this.selectedCustomers.map(async (customer) => {
                            await this.deleteCustomer({ customer: customer });
                        }),
                    )
                if (this.selectedUsers.length > 0)
                    await Promise.all(
                        this.selectedUsers.map(async (user) => {
                            await this.deleteUser({ user: user });
                        })
                    )
                this.selectedUsers = []
                this.selectedCustomers = []
            } catch (err) {
                this.showMessage('Erro ao deletar! Esse(s) usuário(s) possuem alguma dependencia no sistema.', 'normal');
            } finally {
                this.$emit('close')
                this.disableButton = false
            }

        },
        showMessage(message, color = 'primary') {
            this.message = message;
            this.colorMessage = color;
            this.showNotify = true;
        },
    },
};
</script>
  