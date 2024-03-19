export const OperationStatus = {
  completed: 'active',
  complete: 'active',
  incomplete: 'inactive',
};

export const isFloat = (n) => {
  return Number(n) === n && n % 1 !== 0;
};

export const toFloat = (val1, val2, hidePercentage = true) => {
  let value = hidePercentage
    ? parseFloat(val1)
    : Math.min((parseFloat(val1) / parseFloat(val2)) * 100, 100);
  value = isFloat(value) ? value.toFixed(2) : value;
  return hidePercentage ? value : `${value}%`;
};
