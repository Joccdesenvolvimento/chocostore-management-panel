<template>
    <div>
        <v-row no-gutters>
            <v-col cols="12">
                <v-data-table :headers="tableCustomers.config.headers" :items="customers" :search="search"
                    hide-default-footer show-select :page.sync="tableConstants.page" class="table-hover-pointer striped"
                    mobile-breakpoint="0" item-key="id" no-data-text="Sem usuários"
                    no-results-text="Nenhum resultado encontrado" :items-per-page="tableConstants.itemsPerPage"
                    sort-by="name" :sort-desc="false" fixed-header v-bind="$attrs"
                    @page-count="tableConstants.pageCount = $event" @click:row="handleClickRow"
                    v-model="selectedCustomers">
                    <template v-slot:item.data-table-select="{ isSelected, item, select }">
                        <template v-if="item.type != 'default'">
                            <v-simple-checkbox :value="isSelected" @input="select($event)">{{
                            item.name
                            }}</v-simple-checkbox>
                        </template>
                    </template>
                    <template v-slot:item.type="{ item }">{{
                    item.type == 'default'
                    ? 'JOCC'
                    : item.type == 'admin'
                    ? 'Administrador'
                    : 'Atendente'
                    }}</template>
                </v-data-table>
            </v-col>
        </v-row>
        <v-snackbar app v-model="showNotify" :color="colorMessage">
            {{ message }}
            <v-btn :color="colorMessage == 'primary' ? 'white' : 'red'" icon @click="showNotify = false">
                <v-icon>la la-close</v-icon>
            </v-btn>
        </v-snackbar>
        <CustomerForm :customerEdit="customer" :isEdit="isEdit" @submit="submit" :open="openCustomersForm"
            v-if="openCustomersForm" @close="$emit('close', false), (customer = {}), (isEdit = false)" />
        <AppFooter class="footer-paginate">
            <v-col cols="6">
                <v-pagination v-model="tableConstants.page" :total-visible="tableConstants.totalVisible"
                    :length="tableConstants.pageCount" color="primary"></v-pagination>
            </v-col>
        </AppFooter>
    </div>
</template>
  
<script>
import { createNamespacedHelpers } from 'vuex';

const { mapActions, mapGetters } = createNamespacedHelpers('users');

import tableConstants from '@/utils/mixins/table-constants';

import tableCustomers from '../utils/mixins/table-customers';
import CustomerForm from '../forms/CustomerForm';
export default {
    mixins: [tableConstants, tableCustomers],
    data() {
        return {
            isDeleting: false,
            selectedCustomers: [],
            showNotify: false,
            colorMessage: '',
            message: '',
            isEdit: false,
        };
    },
    props: {
        search: {
            default: ''
        },
        openCustomersForm: {
            default: false,
        },
    },
    methods: {
        ...mapActions(['deleteCustomer']),
        submit() {
            this.isEdit = false;
            this.customer = {};
            this.showMessage('Salvo com sucesso!', 'primary');
            this.$emit('close', false);
        },
        showMessage(message, color = '') {
            this.message = message;
            this.colorMessage = color;
            this.showNotify = true;
        },
        handleClickRow(customer) {
            this.isEdit = true;
            this.customer = customer;
            this.$emit('edit', true);
        },
        async deleteCustomers() {
            this.isDeleting = true;
            try {
                await Promise.all(
                    this.selectedCustomers.map(async (customer) => {
                        await this.deleteCustomer({ customer: customer });
                    })
                );
                this.selectedCustomers = []
                this.showMessage('Cliente excluido com sucesso!', 'primary');
            } catch (err) {
                this.showMessage(err.response.data.errors[0].message);
            }
            this.isDeleting = false;
        },
    },
    watch: {
        selectedCustomers(val) {
            this.$emit('selectedRow', this.selectedCustomers)
        }
    },
    components: {
        CustomerForm,
    },
    computed: {
        ...mapGetters(['customers']),
    },
};
</script>
  