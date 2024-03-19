export async function getModifiedDataDetails(
  historyRepository: any,
  id: number,
  userRepository: any
): Promise<any[]> {
  let userData: any;
  const results = await historyRepository.findOne({
    where: { id },
    select: ['id', 'created_at', 'created_by'],
    order: {
      rowkey: 'DESC',
    },
  });
  if (results) {
    userData = await userRepository.findOneBy({
      id: results?.created_by,
      is_archived: false,
    });
  }

  const data: any = {
    modified_by: userData ? userData : null,
    modified_at: results?.created_at ? results?.created_at : null,
  };
  //   return results;
  return data;
}
