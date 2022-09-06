export default {
  data: () => ({
    tableVariationOptions: {
      config: {
        headers: [
          { text: 'Nome da opção', value: 'name' },
          { text: 'Descrição', value: 'description' },
          { text: 'Valor adicional', value: 'value' },
          { text: 'Status', value: 'isActive' }
        ],
        /*Mobile: [
          { text: 'Nome da opção', value: 'name', width: "6000px" },
          { text: 'Descrição', value: 'description' },
          { text: 'Valor adicional', value: 'value' },
          { text: 'Status', value: 'isActive' }
        ]*/
      }
    }
  })
};
