export default {
  data: () => ({
    tableProductsHighlight: {
      config: {
        headers: [
          { text: 'Código', value: 'barCode', width: '25%'},
          { text: 'Nome', value: 'name', width: '50%' },
          { text: 'Valor unitário', value: 'price',  width: '25%' }
        ],
        headersMobile: [
          { text: 'Código', value: 'barCode', width: '270px' },
          { text: 'Nome', value: 'name', width: '270px' },
          { text: 'Valor unitário', value: 'price',width: '100px'}
        ]
      }
    }
  })
};
