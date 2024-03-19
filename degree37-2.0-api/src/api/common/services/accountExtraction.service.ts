export async function accountExtractionFilter(
  type: string,
  id: any,
  response: any,
  repo: any
): Promise<any[]> {
  if (id.length > 0) {
    const modifiedData = [];
    let i = 0;
    const query = `
       SELECT *
        FROM account_contacts
        Where contactable_id IN (${id}) 
        AND contact_able_type =  '${type}'
        ORDER BY address.id DESC`;
    const insert = await repo.query(query);
    for (const res of response) {
      if (res?.id === insert[i]?.contactable_id) {
        modifiedData.push({
          ...res,
          drive_contacts: res?.drive_contacts?.map((item) => {
            return {
              ...item,
              accounts_contacts: {
                ...item.accounts_contacts,
                account: insert[i],
              },
            };
          }),
        });
        i++;
      }
    }
    return modifiedData;
  }
}
