<template>
    <div>
        <v-col class="md:tw-pl-10 tw-px-0 md:tw-px-12px">
            <v-row>
                <v-col cols="12" md="4" class="d-flex tw-pl-4">
                    <InputSearch :placeholder="`Pesquisar em ${activeTabName}`" v-model="search" />
                </v-col>
                <v-col cols="12" md="8" class="
                        d-flex
                        tw-justify-center
                        md:tw-justify-start
                        align-center
                        tw--mt-5
                        md:tw--mt-0
                        ">
                    <v-btn icon color="gray" v-show="isDeleteButtonVisible" @click="openDeleteDialog = true">
                        <v-icon>la-trash-alt</v-icon>
                    </v-btn>
                </v-col>
            </v-row>
            <v-col cols="12">
                <v-slide-group multiple>
                    <v-tabs v-model="activeTab" color="black">
                        <v-tab :ripple="false" v-for="(tab, index) in tabs" :key="index">{{
                        tab.name
                        }}</v-tab>
                    </v-tabs>
                </v-slide-group>
            </v-col>
        </v-col>
        <ConfirmUserDeleteDialog :selectedUsersArray="selectedUsers" :selectedCustomersArray="selectedCustomers"
            :showDialog="openDeleteDialog" @close="openDeleteDialog = false" />

        <CustomerList :search="search" v-if="company" @close="openCustomersForm = false"
            @selectedRow="(customers) => handleSelectedCustomer(customers)" @edit="openCustomersForm = true"
            :openCustomersForm="openCustomersForm" v-show="activeTab == 0" />

        <UsersList :search="search" v-if="company" @close="openUsersForm = false"
            @selectedRow="(users) => handleSelectedUser(users)" @edit="openUsersForm = true"
            :openUsersForm="openUsersForm" v-show="activeTab == 1" />

        <AppFloatingButton v-show="activeTab == 1" @clickFloating="openUsersForm = true"
            class="top-left-speed-dial floating-button-footer">
            <span></span>
        </AppFloatingButton>
        <AppFloatingButton v-show="activeTab == 0" @clickFloating="openCustomersForm = true"
            class="top-left-speed-dial floating-button-footer">
            <span></span>
        </AppFloatingButton>
    </div>

</template>
<script>
import UsersList from '../components/UsersList';
import CustomerList from '../components/CustomersList';
import ConfirmUserDeleteDialog from '../forms/ConfirmUserDeleteDialog'

export default {
    components: {
        UsersList,
        CustomerList,
        ConfirmUserDeleteDialog
    },
    computed: {
        activeTabName() {
            const activeTab = this.tabs.find((tab) => tab.index == this.activeTab);
            return activeTab ? activeTab.name.toLowerCase() : '';
        },
    },
    props: {
        company: { default: {} }
    },

    data() {
        return {
            openUsersForm: false,
            openCustomersForm: false,
            openDeleteDialog: false,
            selectedCustomers: [],
            selectedUsers: [],
            isDeleteButtonVisible: false,
            search: '',
            tabs: [
                { index: 0, name: 'Clientes' },
                { index: 1, name: 'Sistema' },
            ],
            activeTab: { index: 0 },
        };
    },
    methods: {
        handleSelectedCustomer(customers) {
            this.selectedCustomers = customers
        },
        handleSelectedUser(users) {
            this.selectedUsers = users
        }
    },
    watch: {
        selectedCustomers() {
            if (this.selectedCustomers.length > 0) this.isDeleteButtonVisible = true
            else if (this.selectedUsers.length > 0) this.isDeleteButtonVisible = true
            else this.isDeleteButtonVisible = false
        },
        selectedUsers() {
            if (this.selectedUsers.length > 0) this.isDeleteButtonVisible = true
            else if (this.selectedCustomers.length > 0) this.isDeleteButtonVisible = true
            else this.isDeleteButtonVisible = false
        }
    }
}
</script>
