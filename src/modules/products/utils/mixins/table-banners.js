export default {
    data() {
        return {
            tableBanners: {
                config: {
                    headers: [
                        { text: "Código", value: 'id', width: '10%' },
                        { text: 'Título', value: 'title', width: '20%' },
                        { text: 'Descrição', value: 'description', width: '25%' },
                        { text: 'Finalidade', value: 'selectedGoal', width: '15%' },
                        { text: 'Ação', value: 'actionType', width: '10%' },
                        { text: 'Ordem', value: 'orderString', width: '10%' },
                        { text: 'Status', value: 'status', width: '10%' },
                    ],
                    Mobile: [
                        { text: "Código", value: 'id', width: '10%' },
                        { text: 'Título', value: 'title', width: '20%' },
                        { text: 'Descrição', value: 'description', width: '25%' },
                        { text: 'Finalidade', value: 'selectedGoal', width: '15%' },
                        { text: 'Ação', value: 'actionType', width: '10%' },
                        { text: 'Ordem', value: 'orderString', width: '10%' },
                        { text: 'Status', value: 'status', width: '10%' },
                    ]
                }
            }
        };
    }
};