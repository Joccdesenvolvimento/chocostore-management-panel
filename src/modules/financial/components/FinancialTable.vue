<template>
  <div >
    <AppPageHeader title="Financeiro">
      <v-col class="tw-flex tw-flex-col md:tw-flex-row  justify-end align-center">
        Saldo a liberar:
        <span class="gray--text text--accent-3 md:tw-mr-10 md:tw-ml-2">{{
          toCurrency(balanceToRelease)
        }}</span>
        <div class="md:tw-ml-5 d-flex tw-flex-col md:tw-flex-row align-center">
          Saldo liberado:
          <span class="red--text text--accent-3 md:tw-ml-2 md:tw-mx-4">{{
            toCurrency(balanceReleased)
          }}</span>
          <v-btn
            v-if="balanceReleased > 0 && balanceRequested == 0"
            color="primary"
            @click="isAccountSelectDialogVisible = true"
            depressed
          >
            Solicitar saque
          </v-btn>
        </div>

        <div class="ml-5 d-flex align-center" v-if="balanceRequested != 0">
          Saldo solicitado:
          <span class="red--text text--accent-3 ml-2 mx-4">{{
            toCurrency(balanceRequested)
          }}</span>
        </div>
        <!-- <span class="ml-10">
          Saldo recebido:
          <span class="red--text text--accent-3 ml-2">{{
            toCurrency(balanceReceived)
          }}</span>
        </span> -->
      </v-col>
    </AppPageHeader>

    <v-card outlined class="month-picker mb-2 no-border" max-width="500">
      <v-card-text class="d-flex tw-flex-col md:tw-flex-row align-center">
        Valores de
        <v-btn
          :ripple="false"
          class="picker-btn"
          @click="isDatePickerVisible = true"
          text
          color="primary"
          >{{ selectedMonth }}
          <v-icon small class="ml-2">las la-angle-down</v-icon></v-btn
        >

        <InputDate
          :inputHide="true"
          @openMenu="isDatePickerVisible = true"
          @closeMenu="isDatePickerVisible = false"
          :isDatePickerVisible="isDatePickerVisible"
          v-model="monthPicker"
          :datePickerOptions="{ type: 'month' }"
        />
      </v-card-text>
    </v-card>

    <v-data-table
      :headers="
        isMobile
          ? tableFinancial.Mobile
          : tableFinancial.headers
      "
      :items="financialReportData"
      hide-default-footer
      mobile-breakpoint = 0
      :page.sync="tableConstants.page"
      @page-count="tableConstants.pageCount = $event"
      item-key="id"
      :loading="isLoadingFinancialReport"
      :items-per-page=" isMobile ? 5 : (tableConstants.itemsPerPage - 1)"
      fixed-header
      :height="isMobile ? '60vh' : '600px'"
      loading-text="Carregando relatório financeiro"
      :no-data-text="noDataText"
      class="table-hover-pointer striped"
    >
      <template v-slot:item.status="{ item }">
        <div>
          <span v-if="item.isReleased == true"> Liberado </span>
          <span v-if="item.isRequested == true"> Solicitado </span>
          <span v-if="item.isReceived == true"> Pago </span>
          <span
            v-if="
              item.isReleased == false &&
              item.isReceived == false &&
              item.isRequested == false
            "
          >
            A liberar
          </span>
        </div>
      </template>
    </v-data-table>

    <AccountSelectDialog
      @onSubmit="onSubmitAccountSelect"
      @close="isAccountSelectDialogVisible = false"
      :isVisible="isAccountSelectDialogVisible"
    />

    <AppFooter class="footer-paginate">
      <v-col cols="6">
        <v-pagination
          v-model="tableConstants.page"
          :total-visible="tableConstants.totalVisible"
          :length="tableConstants.pageCount"
          color="primary"
        ></v-pagination>
      </v-col>
    </AppFooter>
  </div>
</template>

<script>
import tableConstants from '@/utils/mixins/table-constants';
import tableFinancial from '../utils/mixins/table/financial-config';

import { currency } from '@/utils/helpers/currency';

import FinancialService from '../services/financial-service';

import AccountSelectDialog from '../dialogs/AccountSelectDialog';

import moment from 'moment';

moment.locale('pt-br');

export default {
  components: {
    AccountSelectDialog,
  },
  mixins: [tableConstants, tableFinancial],
  data() {
    return {
      windowWidth: window.innerWidth,
      isMobile: false,
      financialData: [],
      isAccountSelectDialogVisible: false,
      isDatePickerVisible: false,
      monthPicker: moment().format('YYYY-MM'),
      isLoadingFinancialReport: false,
      variablesToNoMapCurrency: [
        'date',
        'status',
        'isReleased',
        'isReceived',
        'isRequested',
      ],
    };
  },
  computed: {
    noDataText() {
      return `Nenhum pedido foi realizado em ${moment(this.monthPicker).format(
        'MMMM'
      )}`;
    },
    selectedMonth() {
      return moment(this.monthPicker).format('MMMM [de] YYYY');
    },
    balanceToRelease() {
      // console.log(this.financialData);
      return this.financialData.reduce((accumulate, current) => {
        return (
          accumulate +
          (!current.isReleased && !current.isReceived && !current.isRequested
            ? this.getBalance(current)
            : 0)
        );
      }, 0);
    },
    balanceReleased() {
      return this.financialData.reduce((accumulate, current) => {
        return accumulate + (current.isReleased ? this.getBalance(current) : 0);
      }, 0);
    },
    balanceReceived() {
      return this.financialData.reduce((accumulate, current) => {
        return accumulate + (current.isReceived ? this.getBalance(current) : 0);
      }, 0);
    },
    balanceRequested() {
      return this.financialData.reduce((accumulate, current) => {
        return (
          accumulate + (current.isRequested ? this.getBalance(current) : 0)
        );
      }, 0);
    },
    financialReportData() {
      return this.financialData
        .filter((data) => {
          return (
            moment(data.date).format('MM/YYYY') ==
            moment(this.monthPicker).format('MM/YYYY')
          );
        })
        .map((data) => {
          const newData = {
            ...data,
            date: moment(data.date).format('DD/MM/YYYY'),
            balance: this.getBalance(data),
          };

          for (const key in newData) {
            if (this.variablesToNoMapCurrency.indexOf(key) == -1) {
              newData[key] = currency(newData[key]);
            }
          }

          return newData;
        });
    },
  },
  created() {
    this.loadFinancialReport();
    this.isMobileTest();
  },
  methods: {
    getBalance(register) {
      return register.appPaymentAmount - register.amountTax;
    },
    onSubmitAccountSelect(request) {
      this.isAccountSelectDialogVisible = false;
      this.loadFinancialReport();
    },
    toCurrency(value) {
      return currency(value);
    },
    isMobileTest() {
      this.isMobile = this.windowWidth > 960 ? false : true;
    },
    async loadFinancialReport() {
      this.isLoadingFinancialReport = true;

      try {
        const response = await FinancialService.generateFinancialReport();

        this.financialData = response.data;
      } catch (err) {
        console.log(err.response);
      }

      this.isLoadingFinancialReport = false;
    },
  },
};
</script>

<style scoped>
.month-picker {
  margin: 0px 40px;
}
.month-picker * {
  font-size: 18px;
}
.picker-btn {
  margin-top: -2px;
}
</style>