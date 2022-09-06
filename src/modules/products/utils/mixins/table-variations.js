export default {
  data: () => ({
    tableVariations: {
      config: {
        headers: [
          { text: '', value: 'delete', sortable: false, width: '5%' },
          { text: 'Nome da variação', value: 'internalName', width: '35%'  },
          { text: 'Nome de exibição', value: 'exhibitionName', width: '35%'  },
          { text: '', value: 'duplicate', sortable: false, width: '25%'  }
        ],
        headersMobile: [
          { text: 'Nome da variação', value: 'internalName', width: "230px" },
          { text: 'Nome de exibição', value: 'exhibitionName', width: "230px" },
          { text: '', value: 'duplicate', sortable: false }
        ]
      }
    }
  })
};
