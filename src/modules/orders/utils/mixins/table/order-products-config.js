export default {
  data: () => ({
    tableOrderProducts: {
      headers: [
        { text: 'Código', value: 'barCode', width: '14%' },
        { text: 'Nome', value: 'name', width: '35%', sortable: false },
        { text: 'Quant.', value: 'quantity', width: '5%', sortable: false },
        {
          text: 'Vlr. do produto',
          value: 'productPrice',
          width: '10%',
          sortable: false
        },
        {
          text: 'Adicionais',
          value: 'additionalValues',
          width: '10%',
          sortable: false
        },
        {
          text: 'Cashback total',
          value: 'totalCashback',
          width: '10%',
          sortable: false
        },
        { text: 'Vlr. total', value: 'amount', width: '10%', sortable: false },
        { text: '', value: 'data-table-expand', width: '6%', sortable: false }
      ],
      Mobile: [
        { text: 'Código', value: 'barCode', width: '7rem' },
        { text: 'Nome', value: 'name', width: '10rem', sortable: false },
        { text: 'Obs.', value: 'notes', width: '13rem', sortable: false },
        { text: 'Quant.', value: 'quantity', width: '7rem', sortable: false },
        {
          text: 'Vlr. do produto',
          value: 'productPrice',
          width: '8rem',
          sortable: false
        },
        {
          text: 'Adicionais',
          value: 'additionalValues',
          width: '7rem',
          sortable: false
        },
        { text: 'Vlr. total', value: 'amount', width: '7rem', sortable: false },
        { text: '', value: 'data-table-expand', width: '2rem', sortable: false }
      ]
    }
  })
};
