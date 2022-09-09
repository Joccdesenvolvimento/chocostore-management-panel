<template>
    <div>
        <v-col class="md:tw-pl-10 tw-px-0 md:tw-px-12px">
            <v-row>
                <v-col cols="4" class="d-flex tw-pl-4">
                    <InputSearch :placeholder="`Pesquisar em ${activeTabName}`" v-model="search" />
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
            <v-spacer></v-spacer>
        </v-col>
        <CustomerList :search="search" v-if="company" @close="openCustomersForm = false"
            @edit="openCustomersForm = true" :openCustomersForm="openCustomersForm" v-show="activeTab == 0" />

        <UsersList :search="search" v-if="company" @close="openUsersForm = false" @edit="openUsersForm = true"
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
export default {
    components: {
        UsersList,
        CustomerList
    },
    computed: {
        activeTabName() {
            const activeTab = this.tabs.find((tab) => tab.index == this.activeTab);
            return activeTab ? activeTab.name.toLowerCase() : '';
        },
    },
    props: {
        openUsersForm: {
            default: false,
        },
        company: { default: {} }
    },

    data() {
        return {
            openUsersForm: false,
            openCustomersForm: false,
            search: '',
            tabs: [
                { index: 0, name: 'Clientes' },
                { index: 1, name: 'Sistema' },
            ],
            activeTab: { index: 0 },
        };
    },
}
</script>
