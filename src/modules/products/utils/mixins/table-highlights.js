export default {
    data() {
        return {
            tableHighlights: {
                config: {
                    headers: [
                        { text: "Código", value: 'id', width: '15%' },
                        { text: 'Título', value: 'title', width: '35%' },
                        { text: 'Ordem', value: 'orderString', width: '25%' },
                        { text: 'Status', value: 'status', width: '25%' },
                    ],
                    Mobile: [
                        { text: "Código", value: 'id', width: '15%' },
                        { text: 'Título', value: 'title', width: '35%' },
                        { text: 'Ordem', value: 'orderString', width: '25%' },
                        { text: 'Status', value: 'status', width: '25%' },
                    ]
                }
            }
        };
    }
};