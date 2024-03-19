import style from './index.module.scss';
import React, { useEffect, useState } from 'react';
import SvgComponent from '../SvgComponent';

const Pagination = ({
  currentPage,
  setCurrentPage,
  totalRecords,
  limit,
  setLimit,
  componentName,
}) => {
  limit = parseInt(limit);

  const [pageCount, setPageCount] = useState(1);
  useEffect(() => {
    setPageCount(Math.ceil(totalRecords / limit));
  }, [totalRecords, limit]);

  const getPageRange = (currentPage, pageCount) => {
    if (pageCount < 1) {
      return [];
    }

    let pageRange = [1, 2, 3];
    if (pageCount <= 4) {
      let pageRange = [];
      for (let i = 1; i <= pageCount; i++) {
        pageRange.push(i);
      }
      return pageRange;
    }

    if (currentPage > 2 && currentPage !== pageCount) {
      pageRange.length = 0;
      pageRange.push(currentPage - 1);
      pageRange.push(currentPage);
      pageRange.push(currentPage + 1);
      return pageRange;
    } else if (currentPage === pageCount) {
      pageRange.length = 0;
      pageRange.push(currentPage - 2);
      pageRange.push(currentPage - 1);
      pageRange.push(currentPage);
    }
    return pageRange;
  };

  const handleSelect = (event) => {
    setLimit(event.target.value);
    setCurrentPage(1);
  };
  return (
    <div className={style.paginationBody}>
      {totalRecords > limit ? (
        <div className={style.paginationContainer}>
          <button
            className={style.pageCard}
            onClick={() => {
              if (currentPage > 1) {
                setCurrentPage(currentPage - 1);
              }
            }}
            disabled={currentPage <= 1}
          >
            <SvgComponent name={'LeftChevron'} />
          </button>
          {currentPage === 3 && pageCount > 4 && (
            <button
              style={{ marginLeft: '0.5rem' }}
              className={
                currentPage === 1 ? style.pageCardactive : style.pageCard
              }
              onClick={() => setCurrentPage(1)}
            >
              1
            </button>
          )}
          {currentPage >= 4 && pageCount > 4 && (
            <>
              <button
                style={{ marginLeft: '0.5rem' }}
                className={
                  currentPage === 1 ? style.pageCardactive : style.pageCard
                }
                onClick={() => setCurrentPage(1)}
              >
                1
              </button>

              <div className={style.moreIcon}>...</div>
            </>
          )}
          {getPageRange(currentPage, pageCount).map((page) => (
            <button
              key={page}
              className={
                page === currentPage ? style.pageCardactive : style.pageCard
              }
              onClick={() => setCurrentPage(page)}
              disabled={page * limit - limit >= totalRecords}
            >
              {page}
            </button>
          ))}
          {currentPage === pageCount - 2 && pageCount > 4 && (
            <button
              style={{ marginLeft: '0.5rem' }}
              className={
                currentPage === pageCount
                  ? style.pageCardactive
                  : style.pageCard
              }
              onClick={() => setCurrentPage(pageCount)}
            >
              {pageCount}
            </button>
          )}
          {currentPage < pageCount - 2 && pageCount > 4 && (
            <>
              <div className={style.moreIcon}>...</div>
              <button
                className={
                  pageCount === currentPage
                    ? style.pageCardactive
                    : style.pageCard
                }
                onClick={() => setCurrentPage(pageCount)}
              >
                {pageCount}
              </button>
            </>
          )}

          <button
            className={style.pageCard}
            onClick={() => {
              if (currentPage < 4 || pageCount) setCurrentPage(currentPage + 1);
            }}
            disabled={currentPage * limit >= totalRecords}
          >
            <SvgComponent name={'PaginationRightChevron'} />
          </button>
        </div>
      ) : (
        <div></div>
      )}
      {totalRecords >= 5 ? (
        <div className={style.showNumberofItems}>
          <span style={{ padding: '1rem', paddingInlineEnd: '0.5rem' }}>
            Showing
          </span>
          <select
            id="dropdown"
            value={limit}
            onChange={handleSelect}
            className={style.dropdown}
          >
            <option value={25}> {25} </option>
            <option value={50}> {50} </option>
            <option value={100}> {100} </option>
          </select>
          <span style={{ padding: '1rem', paddingInlineStart: '0.5rem' }}>
            out of {totalRecords}
          </span>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default Pagination;
