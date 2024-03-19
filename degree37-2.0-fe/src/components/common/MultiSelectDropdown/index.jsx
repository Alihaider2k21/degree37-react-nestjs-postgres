/* 
  ## DEPRECATION WARNING ##
  ## To be replaced with GlobalMultiSelect in /src/components/common/GlobalMultiSelect ##
*/

/* eslint-disable react/react-in-jsx-scope */
import styles from './index.module.scss';
export default function MultiSelectDropDown(props) {
  const { data, selectedOptions, error, onChange } = props;
  return (
    <>
      <div className="row w-100">
        <div className="form-field  w-100">
          <div className="filterBar p-0">
            <div className="filterInner ps-0 align-items-start w-100 ">
              <div className={`filter d-flex w-100 ${styles.filterbutton}`}>
                <div className={` ${styles.operationfilter} dropdown w-100`}>
                  <button
                    className={`btn btn-success form-floating dropdown-toggle overflow-hidden form-floating ${
                      styles.devicetypeinputfields
                    } ${
                      data ? `${styles.select}` : `${styles.disabledcolor} `
                    }`}
                    style={{ flexFlow: 'unset' }}
                    type="button"
                    id="floatingSelect"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    name="collection_operation"
                  >
                    {selectedOptions.length === 0 ? (
                      <span
                        className={`${styles.selected}`}
                        style={{ marginTop: '-10px' }}
                      >
                        Collection Operation
                      </span>
                    ) : (
                      <>
                        <div
                          className="text-black"
                          style={{ overflow: 'hidden', width: '83%' }}
                        >
                          {selectedOptions?.slice(0, 2)?.map((names, key) => (
                            <span key={key} className={`${styles.selected}`}>
                              {key === 0 ? '' : ', '}
                              {names.name}{' '}
                            </span>
                          ))}
                        </div>

                        <span
                          className={`${styles.selecteditemcount} bg-primary rounded-circle`}
                        >
                          {selectedOptions.length}
                        </span>
                      </>
                    )}
                  </button>
                  <ul
                    className="dropdown-menu w-100 p-3 overflow-y-scroll mt-2"
                    aria-labelledby="multiSelectDropdown"
                    style={{ maxHeight: '150px' }}
                  >
                    {data && data.length ? (
                      data.map((item, index) => {
                        return (
                          <div
                            key={item.id}
                            className="form-field checkbox  w-100"
                          >
                            <li
                              key={item.id}
                              className={`d-flex align-items-center ${
                                data.length - 1 === index ? '' : 'mb-2'
                              }`}
                              style={{ cursor: 'pointer' }}
                              onClick={(e) => {
                                e.stopPropagation();
                                onChange(item);
                              }}
                            >
                              <input
                                type="checkbox"
                                value={item?.id}
                                className={`${styles.checkbox} form-check-input mt-0`}
                                checked={selectedOptions.some(
                                  (items) => items.id === item.id
                                )}
                                onClick={() => onChange(item)}
                                onChange={() => onChange(item)}
                              />
                              <span className="ms-3">{item.name}</span>
                            </li>
                          </div>
                        );
                      })
                    ) : (
                      <li>No option found</li>
                    )}
                  </ul>
                  {selectedOptions.length !== 0 ? (
                    <label
                      htmlFor="floatingSelect"
                      style={{ fontSize: '12px', top: '25%' }}
                    >
                      Collection Operation*
                    </label>
                  ) : (
                    ''
                  )}
                </div>
              </div>
            </div>
          </div>
          {error && (
            <div
              style={{ marginTop: '-17px', marginLeft: '7px' }}
              className={`error ${styles.errorcolor}`}
            >
              <p>{error}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
