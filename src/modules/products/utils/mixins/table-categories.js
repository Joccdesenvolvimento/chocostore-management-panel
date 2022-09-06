export default {
    data () {
        return {
            tableCategories: {
                config: {
                    headers: [
                        { text: "Código", value: 'id', width: '15%'},
                        { text: 'Nome', value: 'description', width: '40%' },
                        { text: 'Ordem', value: 'sortPosition', width: '20%' },
                        { text: 'Status', value: 'statusText', width: '20%' },
                    ],
                    Mobile: [
                        { text: "Código", value: 'id', width: '100px'},
                        { text: 'Nome', value: 'description', width: '170px' },
                        { text: 'Ordem', value: 'sortPosition', width: '170px' },
                        { text: 'Status', value: 'statusText', width: '100px' },
                    ]
                }
            }
        };
    }
};