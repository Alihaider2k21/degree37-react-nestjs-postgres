import React from 'react';
import { Link } from 'react-router-dom';
import SvgComponent from '../../../../../common/SvgComponent';
import TopBar from '../../../../../common/topbar/index';
import Styles from './index.module.scss';
import ClassificationModal from './ClassificationModal';
import { useState } from 'react';
import ShiftScheduleModal from './ShiftScheduleModal';

const getNestedValue = (obj, field) => {
  const keys = field?.split('.');
  let output = keys?.reduce((result, key) => (result ? result[key] : ''), obj);
  return output;
};
const ViewForm = ({
  breadcrumbsData,
  breadcrumbsTitle,
  editLink,
  data,
  shiftData,
  config,
  className,
  crmview = false,
  fromView,
  isLoading,
  classificationName,
  customTopBar,
  submitButton,
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showConfirmationShift, setShowConfirmationShift] = useState(false);

  const submitModal = () => {
    submitButton();
  };

  const cancelModal = () => {
    setShowConfirmation(false);
  };
  const cancelShiftModal = () => {
    setShowConfirmationShift(false);
  };
  return (
    <div
      className={`mainContent ${
        className && className.length ? className : ''
      }`}
    >
      <TopBar
        BreadCrumbsData={breadcrumbsData}
        BreadCrumbsTitle={breadcrumbsTitle}
      />
      {customTopBar && customTopBar}

      <div className="mainContentInner">
        <div className="tableView">
          {!crmview && editLink && (
            <div className="buttons">
              <Link to={editLink} state={{ fromView }}>
                <span className="icon">
                  <SvgComponent name="EditIcon" />
                </span>
                <span className="text">Edit</span>
              </Link>
            </div>
          )}
          <div className={`${Styles.tableViewInner} tableViewInner`}>
            {config?.map((section) => (
              <div className={`${Styles.group} group`} key={section.section}>
                <div className={`group-head ${Styles.groupHead}`}>
                  <h2>{section.section}</h2>
                  <div
                    onClick={
                      section?.section === 'Classification'
                        ? () => setShowConfirmation(true)
                        : () => setShowConfirmationShift(true)
                    }
                    className={Styles.headActionText}
                  >
                    {section?.headActionText}
                  </div>
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
                      section?.fields?.map((item) => {
                        return item?.fullRow ? (
                          item?.label2 ? (
                            <li className={`right-data ${Styles.rightData}`}>
                              <span className={`right-data`}>{item.label}</span>
                              <span
                                className={`right-data ${Styles.rightData}`}
                              >
                                {item?.label2}
                              </span>
                              <span
                                className={`right-data ${Styles.rightData}`}
                              >
                                {item?.label3}
                              </span>
                            </li>
                          ) : (
                            <li>
                              <span
                                className={`right-data ${Styles.rightData}`}
                              >
                                {classificationName}
                              </span>
                            </li>
                          )
                        ) : (
                          <li key={item.field}>
                            {section?.section === 'Shift Schedule' ? (
                              <span
                                className={`left-heading ${
                                  Styles.leftHeading
                                } ${
                                  item?.label === 'Pick List Items'
                                    ? 'bg-white fw-semibold'
                                    : ''
                                }`}
                              >
                                {item.label}
                              </span>
                            ) : (
                              <span
                                className={`left-heading ${
                                  item?.label === 'Pick List Items'
                                    ? 'bg-white fw-semibold'
                                    : ''
                                }`}
                              >
                                {item.label}
                              </span>
                            )}

                            {
                              <>
                                {' '}
                                {section?.section === 'Shift Schedule' ? (
                                  <>
                                    {' '}
                                    <span
                                      className={`right-data ${Styles.rightData}`}
                                    >
                                      {getNestedValue(shiftData, item.field)}
                                    </span>
                                    <span
                                      className={`right-data ${Styles.rightData}`}
                                    >
                                      {getNestedValue(shiftData, item.field2)}
                                    </span>
                                  </>
                                ) : (
                                  <span
                                    className={`right-data ${
                                      item?.field === 'type_value'
                                        ? 'border-0'
                                        : ''
                                    } ${item.className || ''}`}
                                  >
                                    {getNestedValue(data, item.field)}
                                  </span>
                                )}
                              </>
                            }
                          </li>
                        );
                      })
                    )}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ClassificationModal
        showConfirmation={showConfirmation}
        onCancel={cancelModal}
        onSubmits={submitModal}
        heading={'Edit Classification'}
      />

      <ShiftScheduleModal
        showConfirmation={showConfirmationShift}
        onCancel={cancelShiftModal}
        onSubmits={submitModal}
        heading={'Shift Schedule'}
      />
    </div>
  );
};

export default ViewForm;
