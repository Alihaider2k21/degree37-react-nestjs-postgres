import React, { useState } from 'react';
import TopBar from '../../common/topbar/index';
import { OPERATIONS_CENTER } from '../../../routes/path';
import SvgComponent from '../../common/SvgComponent';
import { Link } from 'react-router-dom';
import moment from 'moment';

// import { toast } from 'react-toastify';

export default function BeginApprovals() {
  // const { id } = useParams();
  const [expandedRow, setExpandedRow] = useState(-1);
  const BreadcrumbsData = [
    {
      label: 'Operations Center',
      class: 'disable-label',
      link: OPERATIONS_CENTER.DASHBOARD,
    },
    {
      label: 'Approvals',
      class: 'disable-label',
      link: '/',
    },
    {
      label: 'View Approval',
      class: 'disable-label',
      link: '/',
    },
  ];

  const tempData = [
    {
      id: 1,
      name: 'Shift 01',
      time: {
        start: {
          original: 'Friday, November 17, 2023 2:54:37 PM',
          requested: 'Friday, November 17, 2023 2:54:37 PM',
          changeLog: 'Friday, November 17, 2023 2:54:37 PM',
          changeLogUser: 'John',
        },
        end: {
          original: 'Friday, November 17, 2023 2:54:37 PM',
          requested: 'Friday, November 17, 2023 2:54:37 PM',
          changeLog: 'Friday, November 17, 2023 2:54:37 PM',
          changeLogUser: 'John',
        },
      },
    },
    {
      id: 2,
      name: 'Shift 02',
      time: {
        start: {
          original: 'Friday, November 17, 2023 2:54:37 PM',
          requested: 'Friday, November 17, 2023 2:54:37 PM',
          changeLog: 'Friday, November 17, 2023 2:54:37 PM',
          changeLogUser: 'John',
        },
        end: {
          original: 'Friday, November 17, 2023 2:54:37 PM',
          requested: 'Friday, November 17, 2023 2:54:37 PM',
          changeLog: 'Friday, November 17, 2023 2:54:37 PM',
          changeLogUser: 'John',
        },
      },
    },
    {
      id: 3,
      name: 'Shift 03',
      time: {
        start: {
          original: 'Friday, November 17, 2023 2:54:37 PM',
          requested: 'Friday, November 17, 2023 2:54:37 PM',
          changeLog: 'Friday, November 17, 2023 2:54:37 PM',
          changeLogUser: 'John',
        },
        end: {
          original: 'Friday, November 17, 2023 2:54:37 PM',
          requested: 'Friday, November 17, 2023 2:54:37 PM',
          changeLog: 'Friday, November 17, 2023 2:54:37 PM',
          changeLogUser: 'John',
        },
      },
    },
  ];

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Approvals'}
      />
      <div className="imageMainContent">
        <div className="d-flex gap-3 pb-4 ">
          <div className="about-data d-flex w-100">
            <div style={{ width: '62px', height: '62px' }}>
              <figure className="iconBG">
                <SvgComponent name={'ApprovalViewIcon'} />
              </figure>
            </div>
            <div className="d-flex flex-column">
              <h4 className="">Metro High School</h4>
              <span>Metro, TX</span>
              <p>
                Tue, Aug 28, 2023 <br />
                10:00 AM - 08:00 PM <br /> Projection: 50 / 75{' '}
              </p>
            </div>
          </div>
          <div className="right-sec">
            <Link className="view-link clearfix">View Details</Link>
            <div className="pagination">
              <button className="left-arrow">
                <SvgComponent name={'ArrowLeft'} />
              </button>
              <span>1/10</span>
              <button className="right-arrow">
                <SvgComponent name={'ArrowRight'} />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="mainContentInner">
        <div className="table-listing-main approve-table">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th width="15%" align="center">
                    <div className="inliner">
                      <span className="title">Change What</span>
                      <div className="sort-icon">
                        <SvgComponent name={'SortIcon'} />
                      </div>
                    </div>
                  </th>
                  <th width="22%" align="center">
                    <div className="inliner">
                      <span className="title">Original</span>
                      <div className="sort-icon">
                        <SvgComponent name={'SortIcon'} />
                      </div>
                    </div>
                  </th>
                  <th width="20%" align="center">
                    <div className="inliner">
                      <span className="title">Requested</span>
                      <div className="sort-icon">
                        <SvgComponent name={'SortIcon'} />
                      </div>
                    </div>
                  </th>
                  <th width="20%" align="center">
                    <div className="inliner">
                      <span className="title">Change Log</span>
                      <div className="sort-icon">
                        <SvgComponent name={'SortIcon'} />
                      </div>
                    </div>
                  </th>
                  <th width="23%" align="center">
                    <div className="inliner justify-content-center">
                      <span className="title">Actions</span>
                      <div className="sort-icon">
                        <SvgComponent name={'SortIcon'} />
                      </div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="heading-td bold" colSpan={4}>
                    Perform Action
                  </td>
                  <td className="heading-td">
                    <SvgComponent name={'UnreadMark'} />
                    <button className="approve-btn">Approve All</button>
                    <button className="reject-btn">Reject All</button>
                  </td>
                </tr>
                {tempData.map((shift, index) => {
                  return (
                    <React.Fragment key={index}>
                      <tr>
                        <td className="heading-td bold" colSpan={4}>
                          {shift.name}
                        </td>
                        <td className="heading-td">
                          <button className="accept-btn">
                            <SvgComponent name={'CheckIcon'} />
                          </button>
                          <button className="cancel-btn">
                            <SvgComponent name={'CrossRed'} />
                          </button>
                          <button
                            className="positionIcon"
                            onClick={() => {
                              setExpandedRow(
                                index === expandedRow ? -1 : index
                              );
                            }}
                          >
                            <SvgComponent
                              name={
                                expandedRow === index ? 'DownArrow' : 'UpArrow'
                              }
                            />
                          </button>
                        </td>
                      </tr>
                      <tr className={expandedRow === index ? '' : 'd-none'}>
                        <td className="heading-td">Start Time</td>
                        <td>
                          {moment(shift.time.start.original).format('hh:mm A')}
                        </td>
                        <td>
                          {moment(shift.time.start.requested).format('hh:mm A')}
                        </td>
                        <td>
                          {moment(shift.time.start.changeLog).format(
                            'DD-MM-YYYY | hh:mm A |'
                          )}{' '}
                          {shift.time.start.changeLogUser}
                        </td>
                        <td>
                          <button className="accept-btn">
                            <SvgComponent name={'CheckIcon'} />
                          </button>
                          <button className="cancel-btn">
                            <SvgComponent name={'CrossRed'} />
                          </button>
                        </td>
                      </tr>
                      <tr className={expandedRow === index ? '' : 'd-none'}>
                        <td className="heading-td">End Time</td>
                        <td>
                          {moment(shift.time.end.original).format('hh:mm A')}
                        </td>
                        <td>
                          {moment(shift.time.end.requested).format('hh:mm A')}
                        </td>
                        <td>
                          {moment(shift.time.end.changeLog).format(
                            'DD-MM-YYYY | hh:mm A |'
                          )}{' '}
                          {shift.time.start.changeLogUser}
                        </td>
                        <td>
                          <button className="accept-btn">
                            <SvgComponent name={'CheckIcon'} />
                          </button>
                          <button className="cancel-btn">
                            <SvgComponent name={'CrossRed'} />
                          </button>
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
