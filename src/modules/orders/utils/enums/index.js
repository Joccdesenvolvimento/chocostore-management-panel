const STATUS = {
  RECEIVED: 1,
  IN_PREPARATION: 2,
  IN_PROGRESS: 3
};

const STATUS_NAME = {
  1: 'Pendente',
  2: 'Em preparação',
  3: 'A caminho',
  6: 'Aguardando retirada',
  4: 'Entregue',
  5: 'Cancelado',
};

const STATUS_ARRAY = [
  { id: 1, text: 'Pendente', backgroundColor: '#ee8791' },
  { id: 2, text: 'Em preparação', backgroundColor: '#5ACEE4' },
  { id: 3, text: 'A caminho', backgroundColor: '#E45ACD' },
  { id: 6, text: 'Aguardando retirada', backgroundColor: '#A345D9' },
  { id: 4, text: 'Entregue', backgroundColor: '#5AE47E' },
  { id: 5, text: 'Cancelado', backgroundColor: '#A9A9A9' },
];

const PAYMENT_METHODS = [
  'Cartão no aplicativo',
  'Cartão na entrega',
  'Dinheiro',
];

export { STATUS, STATUS_NAME, STATUS_ARRAY, PAYMENT_METHODS };
