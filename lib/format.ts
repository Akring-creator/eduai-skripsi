export const formatPrice = (price: number) => {
  if (price === 0) {
    return 'Gratis';
  }
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(price);
};
