export default {
  data: () => ({
    tableFinancial: {
      headers: [
        { text: 'Data', value: 'date', width: '9%' },
        {
          text: 'Recebido via loja',
          value: 'directPaymentAmount',
          width: '14%'
        },
        {
          text: 'Recebido via Chegou',
          value: 'appPaymentAmount',
          width: '14%'
        },
        { text: 'Total', value: 'amount', width: '8%' },
        { text: 'Taxa Loja', value: 'moneyTax', width: '10%' },
        { text: 'Taxa Chegou', value: 'cardTax', width: '11%' },
        { text: 'Taxa total', value: 'amountTax', width: '11%' },
        { text: 'Saldo', value: 'balance', width: '8%'},
        { text: 'Status', value: 'status' }
      ],
      Mobile: [
        { text: 'Data', value: 'date', width: '100px' },
        {
          text: 'Recebido via loja',
          value: 'directPaymentAmount',
          width: '130px'
        },
        {
          text: 'Recebido via Chegou',
          value: 'appPaymentAmount',
          width: '130px'
        },
        { text: 'Total', value: 'amount', width: '130px' },
        { text: 'Taxa Loja', value: 'moneyTax', width: '130px' },
        { text: 'Taxa Chegou', value: 'cardTax', width: '160px' },
        { text: 'Taxa total', value: 'amountTax', width: '130px' },
        { text: 'Saldo', value: 'balance', width: '130px'},
        { text: 'Status', value: 'status' , width: '130px'}
      ]
    }
  })
};
