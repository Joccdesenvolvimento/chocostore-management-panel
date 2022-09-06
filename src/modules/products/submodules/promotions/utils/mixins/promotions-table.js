export default {
  data: () => ({
    promotionsTable: {
      config: {
        headers: [
          { text: 'Produto', value: 'productName', width: '25%' },
          { text: 'Preço normal', value: 'productPrice', width: '15%' },
          {
            text: 'Preço promocional',
            value: 'promotionalPrice',
            width: '15%'
          },
          { text: 'Duração', value: 'duration', width: '10%' },
          { text: 'Data final', value: 'endsAt', width: '15%' },
          { text: '', value: 'turbine', sortable: false, width: '25%' }
        ],
        Mobile: [
          { text: 'Produto', value: 'productName', width: '300px' },
          { text: 'Preço normal', value: 'productPrice', width: '180px' },
          {
            text: 'Preço promocional',
            value: 'promotionalPrice',
            width: '180px'
          },
          { text: 'Duração', value: 'duration', width: '180px' },
          { text: 'Data final', value: 'endsAt', width: '180px' },
          { text: '', value: 'turbine', sortable: false }
        ],
      }
    }
  })
};
