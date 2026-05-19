const formatter = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
  maximumFractionDigits: 0,
});

const formatterDecimals = new Intl.NumberFormat('tr-TR', {
  style: 'currency',
  currency: 'TRY',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatTRY(amount: number, withDecimals = false): string {
  return (withDecimals ? formatterDecimals : formatter).format(amount);
}

export function formatIyzicoAmount(amount: number): string {
  return amount.toFixed(2);
}
