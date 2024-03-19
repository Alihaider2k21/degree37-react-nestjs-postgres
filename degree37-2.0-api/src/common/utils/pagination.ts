interface Pagination {
  skip: number;
  take: number;
}

/**
 * Calculate limit and skip of a page
 * @param {number} page
 * @param {number} limit
 * @returns {number, number} - it returns a skip and take which passes to typeORM
 */
export const pagination = (page: number, limit: number): Pagination => {
  const defaultPageSize = parseInt(process.env.PAGE_SIZE || '10');
  limit = typeof limit === 'string' ? parseInt(limit) : limit;
  page = typeof page === 'string' ? parseInt(page) : page;
  page = page <= 0 ? 1 : page;
  return {
    skip: (page - 1) * limit,
    take: limit < 5 ? defaultPageSize : limit,
  };
};
