export default {
  data: () => ({
    tableUsers: {
      config: {
        headers: [
          { text: 'Código', value: 'id', width: '20%' },
          { text: 'Nome', value: 'name', width: '25%' },
          { text: 'Email', value: 'email', width: '35%' },
          { text: 'Tipo', value: 'type', width: '20%' },
        ],
        headersMobile: [
          { text: 'Código', value: 'id', width: '15%' },
          { text: 'Nome', value: 'name', width: '25%' },
          { text: 'Email', value: 'email', width: '15%' },
          { text: 'Tipo', value: 'type', width: '20%' },
        ]
      }
    }
  })
};
