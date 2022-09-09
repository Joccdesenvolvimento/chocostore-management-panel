export default {
  data: () => ({
    tableCustomers: {
      config: {
        headers: [
          { text: 'Código', value: 'id', width: '10%' },
          { text: 'Nome', value: 'name', width: '20%' },
          { text: 'Email', value: 'email', width: '20%' },
          { text: 'CPF', value: 'cpf', width: '20%' },
          { text: 'Fone', value: 'phone', width: '30%' },
        ],
        headersMobile: [
          { text: 'Código', value: 'id', width: '15%' },
          { text: 'Nome', value: 'name', width: '25%' },
          { text: 'Email', value: 'email', width: '15%' },
          { text: 'CPF', value: 'cpf', width: '10%' },
          { text: 'Fone', value: 'phone', width: '10%' },
        ]
      }
    }
  })
};
