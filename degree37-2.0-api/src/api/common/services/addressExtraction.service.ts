export async function addressExtractionFilter(
  type: string,
  id: any,
  response: any,
  userId: any,
  city: any,
  state: any,
  country: any,
  repo: any,
  county: any = null
): Promise<any[]> {
  if (id.length > 0) {
    if (city || state || country || county) {
      const modifiedData = [];
      const abcFIlter = `${city !== null ? `city ILIKE '%${city}%' AND ` : ''}${
        state !== null ? `state ILIKE '%${state}%' AND ` : ''
      } ${country !== null ? `country ILIKE '%${country}%' AND ` : ''}
      ${county !== null ? `county ILIKE '%${county}%' AND ` : ''}`;
      const query = `
       SELECT *
        FROM address
        WHERE
          ${abcFIlter}
          addressable_id IN (${id})
          AND addressable_type = '${type}'
          ORDER BY address.id DESC;`;
      const insert = await repo.query(query);
      for (const res of response) {
        const matchingAddress = insert.find(
          (instance: any) => res?.id === instance?.addressable_id
        );
        if (matchingAddress) {
          modifiedData.push({
            ...res,
            address: matchingAddress,
          });
        }
      }
      return modifiedData;
    } else {
      const modifiedData = [];
      const query = `
       SELECT *
        FROM address
        Where addressable_id IN (${id}) 
        AND addressable_type =  '${type}'
        ORDER BY address.id DESC`;
      const insert = await repo.query(query);
      for (const res of response) {
        const matchingAddress = insert.find(
          (instance: any) => res?.id === instance?.addressable_id
        );
        if (matchingAddress) {
          modifiedData.push({
            ...res,
            address: matchingAddress,
          });
        }
      }
      return modifiedData;
    }
  }
}
