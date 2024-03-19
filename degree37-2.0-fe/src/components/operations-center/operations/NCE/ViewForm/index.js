import React from 'react';
import { Link } from 'react-router-dom';
import SvgComponent from '../../../../common/SvgComponent';
import TopBar from '../../../../common/topbar/index';
// import { formatCustomDate } from '../../../helpers/formatDate';
// import { formatUser } from '../../../helpers/formatUser';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCheck, faClose } from '@fortawesome/free-solid-svg-icons';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import FormCheckbox from '../../../../common/form/FormCheckBox';
import SelectDropdown from '../../../../common/selectDropdown';

const getNestedValue = (obj, field) => {
  const keys = field.split('.');
  const output = keys.reduce((result, key) => (result ? result[key] : ''), obj);
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
  profileName = '',
  headingName = '',
  nameWithLabel = '',
  additionalGroupTabularData,
  customTopBar,
  selectOptions = [],
  isSelect = false,
  setIsStatus,
  isStatus,
  SearchValue,
  SearchOnChange,
  SearchPlaceholder,
}) => {
  const handleChangeSelectStatus = (val) => {
    setIsStatus(val);
  };
  function _renderListItem(section, item) {
    return (
      <li key={item.field}>
        <span className="left-heading">{item.label}</span>
        {item?.href ? (
          <span className={`right-data ${item.className || ''}`}>
            <Link
              to={item.href}
              target={item?.openInNewTab ? '_blank' : '_self'}
            >
              {item.value}
            </Link>
          </span>
        ) : item.exist ? (
          <span className={`right-data ${item.className || ''}`}>
            {item.exist}
          </span>
        ) : (
          <span className={`right-data ${item.className || ''}`}>
            {item.field === 'status' || item.field === 'is_active' ? (
              data?.className ? (
                isSelect ? (
                  <form className="w-50">
                    <div>
                      <SelectDropdown
                        placeholder="Select Status"
                        options={selectOptions.map((item) => ({
                          value: item?.id,
                          label: `${item?.status}`,
                        }))}
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
                  <span className={`badge ${data?.className}`}>
                    {data?.status}
                  </span>
                )
              ) : data.is_active || data[item.field] ? (
                <span className={`badge active`}>Confirmed</span>
              ) : (
                <span className="badge inactive">Not Confirmed</span>
              )
            ) : section === 'Custom Fields' ? (
              item.field
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
  }
  return (
    <div
      className={`mainContent ${
        className && className.length ? className : ''
      }`}
    >
      <TopBar
        BreadCrumbsData={breadcrumbsData}
        BreadCrumbsTitle={breadcrumbsTitle}
        SearchValue={SearchValue ? SearchValue : null}
        SearchOnChange={SearchOnChange ? SearchOnChange : null}
        SearchPlaceholder={SearchPlaceholder ? SearchPlaceholder : null}
      />
      {customTopBar && customTopBar}
      {config && (
        <div className="mainContentInner">
          <div className="tableView">
            {!crmview && editLink && (
              <div className="buttons">
                <Link to={editLink}>
                  <span className="icon">
                    <SvgComponent name="EditIcon" />
                  </span>
                  <span className="text">Edit</span>
                </Link>
              </div>
            )}
            <div className="tableViewInner">
              {config?.map((section) => (
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
                      {section?.section == 'Custom Fields'
                        ? data?.custom_fields?.map((item) =>
                            _renderListItem(section?.section, item)
                          )
                        : section.fields.map((item) =>
                            _renderListItem(section?.section, item)
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
                          {section.fields.map((item) => {
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
                          })}
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
                          >
                            {section.actionText}
                          </Link>
                        ) : (
                          <></>
                        )}
                      </div>
                      <div className="group-body">
                        <ul>
                          {section.fields.map((item) => {
                            return (
                              <li key={item.field}>
                                <span className={`left-data`}>
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
                      <div className="tabular-body">
                        <table>
                          <thead>
                            <tr>
                              {section?.headings?.map((heading) => {
                                return (
                                  <th
                                    key={heading?.label}
                                    width={heading?.width}
                                  >
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
                                    {section?.headings?.map(
                                      (heading, index) => (
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
                                                      row?.onClick(
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
                                      )
                                    )}
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
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewForm;
