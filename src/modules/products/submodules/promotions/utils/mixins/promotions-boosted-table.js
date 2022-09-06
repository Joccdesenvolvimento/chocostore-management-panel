export default {
  data: () => ({
    boostedPromotionsTable: {
      config: {
        headers: [
          { text: 'Produto da promoção', value: 'productName', width: '45%' },
          { text: 'Valor gasto', value: 'amountSpent', width: '40%' },
          { text: 'Duração', value: 'endsAt' }
        ]
      }
    }
  })
};
