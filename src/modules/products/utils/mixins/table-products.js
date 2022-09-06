export default {
  data: () => ({
    tableProducts: {
      config: {
        headers: [
          { text: 'Código', value: 'barCode', width: '10%' },
          { text: 'Nome', value: 'name', width: '20%' },
          { text: 'Categoria', value: 'category', width: '15%' },
          { text: 'Estoque', value: 'stock', width: '20%' },
          { text: 'Cashback', value: 'cashback',  width: '10%' },
          { text: 'Status', value: 'status', width: '10%' },
          { text: 'Valor unitário', value: 'price',  width: '15%' }
        ],
        headersMobile: [
          { text: 'Código', value: 'barCode', width: '270px' },
          { text: 'Nome', value: 'name', width: '270px' },
          { text: 'Categoria', value: 'category', width: '170px' },
          { text: 'Estoque', value: 'stock', width: '200px' },
          { text: 'Status', value: 'status', width: '120px' },
          { text: 'Valor unitário', value: 'price',width: '100px'}
        ]
      }
    }
  })
};
