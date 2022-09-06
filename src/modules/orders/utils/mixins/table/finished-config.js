import { tableConstants } from '@/utils/helpers/table';

export default {
    data() {
        return {
            tableConstants,
            tableFinished: {
                headers: [
                    { text: 'Nº do pedido', value: 'id', width: '150px' },
                    { text: 'Cliente', value: 'client', width: '300px' },
                    { text: 'Contato', value: 'contact', width: '300px' },
                    { text: 'Status', value: 'status' },
                    { text: 'Valor total', value: 'amount' }
                ]
            }
        };
    }
};