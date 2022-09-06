

// export const currency = (value) => {
//     return new Intl.NumberFormat('pt-BR', {
//         minimumSignificantDigits: 2,
//         style: 'currency',
//         currency: 'BRL'
//     }).format(value);
// };


export const currency = (value) => {
    return numberToReal(parseFloat(value));
};

function numberToReal(numero) {
    var numero = numero.toFixed(2).split('.');
    numero[0] = "R$ " + numero[0].split(/(?=(?:...)*$)/).join('.');
    return numero.join(',');
}
