export function extractModuleCodes(obj) {
  const moduleCodes = [];

  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key].MODULE_CODE) {
      moduleCodes.push(obj[key].MODULE_CODE);
    }

    if (typeof obj[key] === 'object') {
      moduleCodes.push(...extractModuleCodes(obj[key]));
    }
  }

  return moduleCodes;
}

export function removeCountyWord(county) {
  if (county?.includes('County')) {
    county = county.replace('County', '').trim();
  }
  return county;
}

export function viewPhysicalAddress(address) {
  return (
    address?.address1 +
    ' ' +
    address?.address2 +
    ', ' +
    removeCountyWord(address?.city) +
    ', ' +
    address?.state +
    ' ' +
    address?.zip_code
  );
}
