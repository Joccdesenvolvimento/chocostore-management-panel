export const mapAddress = (address) => {
  const { street, number, complement, neighborhood, city, state, zipCode } = address;

  let addressMapped = street ? `${street}, ` : '';
  addressMapped += number ? `nº ' ${number} - ` : '';
  addressMapped += complement ? `${complement}, ` : '';
  addressMapped += neighborhood ? `${neighborhood}, ` : '';
  addressMapped += city ? `${city} - ` : '';
  addressMapped += state ? `${state} - ` : '';
  addressMapped += zipCode || '';

  return addressMapped;
};

export const mapAddressToFindAtGoogleMaps = (address) => {
  const { street, number, complement, neighborhood, city, state, zipCode } = address;

  let newStreet = (street && !street.toLowerCase().includes("rua")) ? 'Rua ' + street : street;

  let addressMapped = street ? `${newStreet.replace(/ /g, "+")},` : '';
  addressMapped += number ? `${number.replace(/ /g, "+")}` : '';
  addressMapped += complement ? `,${complement.replace(/ /g, "+")}` : '';
  addressMapped += neighborhood ? `,${neighborhood.replace(/ /g, "+")}` : '';
  addressMapped += city ? `,${city.replace(/ /g, "+")}` : ',Farroupilha';

  return addressMapped;
};
