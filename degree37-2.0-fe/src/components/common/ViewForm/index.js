import React, { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import SvgComponent from '../SvgComponent';
import TopBar from '../topbar/index';
import { formatDate } from '../../../helpers/formatDate';
import { formatUser } from '../../../helpers/formatUser';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faClose } from '@fortawesome/free-solid-svg-icons';
import FormCheckbox from '../form/FormCheckBox';
import SelectDropdown from '../selectDropdown';
import { toLower } from 'lodash';
import { STAFF_TASKS_PATH } from '../../../routes/path';

const getNestedValue = (obj, field) => {
  const keys = field?.split('.');
  let output = keys
    ?.reduce((result, key) => (result ? result[key] : ''), obj)
    ?.toString();
  if (!field) {
    return 'N/A';
  }
  if (
    field === obj?.primary_phone_field ||
    field === obj?.primary_email_field
  ) {
    return (
      <>
        {output} <span className="is-primary">(Primary)</span>
      </>
    );
  }
  if (!(output?.length > 0)) output = 'N/A';
  return output;
};
const ViewForm = ({
  breadcrumbsData,
  breadcrumbsTitle,
  editLink,
  data,
  config,
  className,
  additional,
  additionalMessage,
  additionalWithoutIcon,
  additionalWithGroupData,
  crmview = false,
  viewImage = '',
  fromView,
  profileName = '',
  headingName = '',
  nameWithLabel = '',
  isLoading,
  additionalGroupTabularData,
  customTopBar,
  selectOptions = [],
  isSelect = false,
  setIsStatus,
  isStatus,
  additionalConfig,
  show = true,
  onDeleteCode,
  DonorScheduleView,
}) => {
  const [navbar, setNavbar] = useState(false);
  const location = useLocation();
  const { id, staff_id } = useParams();
  useEffect(() => {
    if (
      location?.pathname ===
      STAFF_TASKS_PATH.VIEW.replace(':staff_id', staff_id).replace(':id', id)
    ) {
      setNavbar(true);
    }
  }, []);
  const handleChangeSelectStatus = (val) => {
    setIsStatus(val);
  };
  return (
    <div
      className={`mainContent ${
        className && className.length ? className : ''
      }`}
    >
      {show && (
        <TopBar
          BreadCrumbsData={breadcrumbsData}
          BreadCrumbsTitle={breadcrumbsTitle}
        />
      )}
      {show && customTopBar && customTopBar}
      {navbar && customTopBar && customTopBar}
      <div className="mainContentInner">
        <div className="tableView">
          {DonorScheduleView && editLink && (
            <div className="buttons">
              <Link
                to={editLink}
                state={{ fromView }}
                style={{ marginTop: '-69px' }}
              >
                <span className="icon">
                  <SvgComponent name="EditIcon" />
                </span>
                <span className="text">Edit Appointment</span>
              </Link>
            </div>
          )}
          {!crmview && editLink && !DonorScheduleView && (
            <div className="buttons">
              <Link to={editLink} state={{ fromView }}>
                <span className="icon">
                  <SvgComponent name="EditIcon" />
                </span>
                <span className="text">Edit</span>
              </Link>
            </div>
          )}
          <div className="tableViewInner">
            {config.map((section) => (
              <div className="group" key={section.section}>
                <div className="group-head">
                  <h2>{section.section}</h2>
                  {section.hasAction ? (
                    <Link
                      className="header-action"
                      to={section.actionUrl}
                      onClick={() => {
                        if (!section.actionUrl || section.actionUrl == '#')
                          section.onClick();
                      }}
                    >
                      {section.actionText}
                    </Link>
                  ) : (
                    <></>
                  )}
                </div>
                <div className="group-body">
                  <ul>
                    {isLoading ? (
                      <li>
                        <span className="right-data d-flex justify-content-center align-items-center">
                          Data Loading
                        </span>
                      </li>
                    ) : (
                      section.fields.map((item) => {
                        return item?.fullRow ? (
                          <li>
                            <span className="right-data">{item.label}</span>
                          </li>
                        ) : (
                          <li key={item.field}>
                            <span
                              className={`left-heading ${
                                item?.label === 'Pick List Items'
                                  ? 'bg-white fw-semibold'
                                  : ''
                              }`}
                            >
                              {item.label}
                            </span>
                            {item?.href && item?.value?.length > 0 ? (
                              <span
                                className={`right-data ${item.className || ''}`}
                              >
                                <Link
                                  to={item.href}
                                  target={
                                    item?.openInNewTab ? '_blank' : '_self'
                                  }
                                >
                                  {item.value}
                                </Link>
                              </span>
                            ) : item.exist ? (
                              <span
                                className={`right-data ${item.className || ''}`}
                              >
                                {item.exist}
                              </span>
                            ) : (
                              <span
                                className={`right-data ${
                                  item?.field === 'type_value' ? 'border-0' : ''
                                } ${item.className || ''}`}
                              >
                                {item.field === 'start_date' ||
                                item.field === 'is_active' ? (
                                  data?.className ? (
                                    isSelect ? (
                                      <form className="w-50">
                                        halo
                                        <div>
                                          <SelectDropdown
                                            placeholder="Select Status"
                                            options={selectOptions.map(
                                              (item) => ({
                                                value: item?.id,
                                                label: `${item?.status}`,
                                              })
                                            )}
                                            name="status"
                                            searchable={false}
                                            showLabel={true}
                                            removeTheClearCross={true}
                                            removeDivider={true}
                                            defaultValue={isStatus}
                                            classes={{ root: 'w-100' }}
                                            selectedValue={isStatus}
                                            onChange={handleChangeSelectStatus}
                                          />
                                        </div>
                                      </form>
                                    ) : (
                                      <span className={data?.className}>
                                        {data?.status}
                                      </span>
                                    )
                                  ) : data[item.field] == 1 ? (
                                    <span className="badge Grey">
                                      Scheduled
                                    </span>
                                  ) : data[item.field] == 2 ? (
                                    <span className="badge active">
                                      Complete
                                    </span>
                                  ) : data[item.field] == 3 ? (
                                    <span className="badge Yellow">
                                      Incomplete
                                    </span>
                                  ) : data[item.field] == 4 ? (
                                    <span className="badge inactive">
                                      Cancelled
                                    </span>
                                  ) : data?.is_active || data[item.field] ? (
                                    <span className="badge active">Active</span>
                                  ) : (
                                    <>
                                      {data?.is_active === false && (
                                        <span className="badge inactive">
                                          Inactive
                                        </span>
                                      )}
                                    </>
                                  )
                                ) : item.field === 'date' ? (
                                  <span>
                                    {formatDate(data?.date ?? data?.date)}
                                  </span>
                                ) : item.field === 'created_by' ? (
                                  <span>
                                    {formatUser(
                                      data?.created_by ?? data?.created_by
                                    )}{' '}
                                    {formatDate(
                                      data?.created_at ?? data?.created_at
                                    )}
                                  </span>
                                ) : item.field === 'modified_by' ||
                                  item.field === 'updated_by' ? (
                                  <span>
                                    {formatUser(
                                      data?.modified_by
                                        ? data?.modified_by
                                        : data?.created_by
                                    )}{' '}
                                    {formatDate(
                                      data?.modified_at
                                        ? data?.modified_at
                                        : data?.created_at
                                    )}
                                  </span>
                                ) : item.field === 'collection_operation' ? (
                                  <span>
                                    {Array.isArray(data?.collection_operation)
                                      ? data?.collection_operation?.length >
                                          0 &&
                                        data?.collection_operation
                                          ?.map((ele) => ele?.name)
                                          .join(',')
                                      : data?.collection_operation}{' '}
                                  </span>
                                ) : item.value && item.value.length ? (
                                  <span>
                                    {item.show_check ? (
                                      item.approved ? (
                                        <FontAwesomeIcon
                                          width={15}
                                          height={15}
                                          icon={faCheck}
                                          color="#5CA044"
                                        />
                                      ) : (
                                        <FontAwesomeIcon
                                          width={15}
                                          height={15}
                                          icon={faClose}
                                          color="#FF1E1E"
                                        />
                                      )
                                    ) : (
                                      item.value
                                    )}{' '}
                                  </span>
                                ) : item.field === 'modified_by' ? (
                                  <span>
                                    {data?.modified_by
                                      ? formatUser(data?.modified_by, '1')
                                      : formatUser(data?.created_by, '1')}
                                    {data?.modified_at
                                      ? formatDate(data?.modified_at)
                                      : formatDate(data?.created_at)}
                                  </span>
                                ) : item.field === 'communications_status' ? (
                                  data?.communications_status === 'sent' ? (
                                    <span className="badge active">Sent</span>
                                  ) : (
                                    <span className="badge inactive">
                                      Already Sent
                                    </span>
                                  )
                                ) : (
                                  getNestedValue(data, item.field)
                                )}
                                {item?.is_primary ? (
                                  <span className="is-primary">(Primary)</span>
                                ) : (
                                  <></>
                                )}
                              </span>
                            )}
                          </li>
                        );
                      })
                    )}
                  </ul>
                </div>
              </div>
            ))}
          </div>
          {(additional && additional.length) ||
          (additionalWithoutIcon && additionalWithoutIcon.length) ||
          additionalMessage ||
          (additionalWithGroupData && additionalWithGroupData.length) ? (
            <div className="tableViewInner tableViewInner-right">
              {additional && additional.length ? (
                additional.map((section) => (
                  <div className="group" key={section.section}>
                    <div className="group-head">
                      <h2>{section.section}</h2>
                    </div>
                    <div className="group-body">
                      <ul>
                        {section.fields && section.fields.length ? (
                          section.fields.map((item) => {
                            return (
                              <li key={item.field}>
                                <span className={`right-data full-width`}>
                                  {item.label}{' '}
                                  <span className="icon-cross">
                                    <FontAwesomeIcon
                                      size="lg"
                                      icon={faClose}
                                      color="#a3a3a3"
                                    />
                                  </span>
                                </span>
                              </li>
                            );
                          })
                        ) : (
                          <li>
                            <span className={`right-data full-width`}>
                              {`No ${toLower(section.section)} found`}
                            </span>
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                ))
              ) : (
                <></>
              )}
              {additionalWithoutIcon && additionalWithoutIcon.length ? (
                additionalWithoutIcon.map((section) => (
                  <div className="group" key={section.section}>
                    <div className="group-head">
                      <h2>{section.section}</h2>
                    </div>
                    <div className="group-body">
                      <ul>
                        {section.fields.map((item) => {
                          return (
                            <li key={item.field}>
                              <span className={`right-data full-width`}>
                                {item.label}{' '}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                ))
              ) : (
                <></>
              )}

              {additionalWithGroupData && additionalWithGroupData.length ? (
                additionalWithGroupData.map((section) => (
                  <div className="group group-data" key={section.section}>
                    <div className="group-head">
                      <h2>{section.section}</h2>
                      {section.hasAction ? (
                        <Link
                          className="header-action"
                          to={section.actionUrl}
                          onClick={(event) => {
                            event.preventDefault();
                            if (!section.actionUrl || section.actionUrl == '#')
                              section.onClick();
                          }}
                        >
                          {section.actionText}
                        </Link>
                      ) : (
                        <></>
                      )}
                    </div>
                    <div
                      className="group-body"
                      style={{ backgroundColor: 'white' }}
                    >
                      <ul>
                        {section.fields.map((item) => {
                          return (
                            <li
                              key={item.field}
                              style={{ display: 'flex', flexWrap: 'nowrap' }}
                            >
                              <span
                                className={`left-data`}
                                style={{ width: '100px' }}
                              >
                                {item.code}{' '}
                              </span>
                              <span className={``}>{item.name} </span>
                              <span className={``}>{item.sDate} </span>
                              <span className={``}>{item.applied} </span>
                              <span className={``}>{item.last} </span>
                              <span className={`right-data`}>
                                {item.icon ? (
                                  <FontAwesomeIcon
                                    size="lg"
                                    icon={faClose}
                                    color="#a3a3a3"
                                    onClick={() => {
                                      onDeleteCode(item);
                                    }}
                                  />
                                ) : (
                                  <></>
                                )}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                ))
              ) : (
                <></>
              )}

              {additionalGroupTabularData &&
              additionalGroupTabularData.length ? (
                additionalGroupTabularData.map((section) => (
                  <div className="group group-data" key={section.section}>
                    <div className="group-head">
                      <h2>{section.section}</h2>
                      {section.hasAction ? (
                        <Link
                          className="header-action"
                          to={section.actionUrl}
                          onClick={() => {
                            if (!section.actionUrl || section.actionUrl == '#')
                              section.onClick();
                          }}
                        >
                          {section.actionText}
                        </Link>
                      ) : (
                        <></>
                      )}
                    </div>
                    <div className="tabular-body">
                      <table>
                        <thead>
                          <tr>
                            {section?.headings?.map((heading) => {
                              return (
                                <th key={heading?.label} width={heading?.width}>
                                  {heading?.label}
                                </th>
                              );
                            })}
                          </tr>
                        </thead>
                        <tbody>
                          {section?.rowsData?.length ? (
                            <>
                              {section?.rowsData?.map((row, index) => (
                                <tr key={index}>
                                  {section?.headings?.map((heading, index) => (
                                    <>
                                      {heading?.action ? (
                                        <td>
                                          <span className="icon">
                                            <FontAwesomeIcon
                                              size="lg"
                                              icon={faClose}
                                              color="#a3a3a3"
                                              onClick={() => row?.onClick()}
                                            />
                                          </span>
                                        </td>
                                      ) : (
                                        <>
                                          {heading?.isCheckbox ? (
                                            <td className="check">
                                              <FormCheckbox
                                                checked={row[heading?.name]}
                                                handleChange={(e) => {
                                                  row?.onClickCheckBox(
                                                    e.target.checked
                                                  );
                                                }}
                                              />
                                            </td>
                                          ) : (
                                            <td
                                              key={index}
                                              className={
                                                heading?.main
                                                  ? 'main-content'
                                                  : ''
                                              }
                                            >
                                              {row[heading?.name]}
                                            </td>
                                          )}
                                        </>
                                      )}
                                    </>
                                  ))}
                                </tr>
                              ))}
                            </>
                          ) : (
                            <tr>
                              <td colSpan={section?.headings?.length + 1}>
                                No Data Found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))
              ) : (
                <></>
              )}

              {additionalMessage ? (
                <div className="group group-data message">
                  <div className="group-head">
                    <h2>{additionalMessage?.section}</h2>
                  </div>
                  <div
                    className="group-body"
                    dangerouslySetInnerHTML={{
                      __html: additionalMessage?.message,
                    }}
                  ></div>
                </div>
              ) : (
                <></>
              )}

              {additionalConfig ? (
                <>
                  {additionalConfig.map((section) => (
                    <div className="group" key={section.section}>
                      <div className="group-head">
                        <h2>{section.section}</h2>
                        {section.hasAction ? (
                          <Link
                            className="header-action"
                            to={section.actionUrl}
                            onClick={() => {
                              if (
                                !section.actionUrl ||
                                section.actionUrl == '#'
                              )
                                section.onClick();
                            }}
                          >
                            {section.actionText}
                          </Link>
                        ) : (
                          <></>
                        )}
                      </div>
                      <div className="group-body">
                        <ul>
                          {section.haveValues > 0 ? (
                            <>
                              <li>
                                <span
                                  className="left-heading"
                                  style={{ fontWeight: 600 }}
                                >
                                  {section?.subHeading}
                                </span>
                              </li>
                              {section.fields.map((item) => {
                                return (
                                  <li key={item.field}>
                                    <span
                                      className="left-heading"
                                      style={{
                                        fontWeight: item?.title ? 600 : 400,
                                      }}
                                    >
                                      {item.label}
                                    </span>
                                    <span className={`right-data no-border`}>
                                      {item.field}
                                    </span>
                                  </li>
                                );
                              })}
                            </>
                          ) : (
                            <>
                              <li>
                                <span
                                  className="left-heading"
                                  style={{ fontWeight: 600 }}
                                >
                                  {section?.subHeading}
                                </span>
                              </li>
                              <li>
                                <span className="left-heading">
                                  Classification Settings Not Found
                                </span>
                              </li>
                            </>
                          )}
                        </ul>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <></>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ViewForm;
