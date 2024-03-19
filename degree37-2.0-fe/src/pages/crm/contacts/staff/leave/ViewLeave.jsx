import React, { useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { formatDate } from '../../../../../helpers/formatDate';
import { formatUser } from '../../../../../helpers/formatUser';
import { fetchData } from '../../../../../helpers/Api';
import { StaffBreadCrumbsData } from '../../../../../components/crm/contacts/staff/StaffBreadCrumbsData';

export default function ViewStaffLeave() {
  const params = useParams();
  const navigate = useNavigate();
  const [leave, setLeave] = React.useState({});
  const context = useOutletContext();
  useEffect(() => {
    context.setBreadCrumbsState([
      ...StaffBreadCrumbsData,
      {
        label: 'View Staff',
        class: 'disable-label',
        link: `/crm/contacts/staff/${params?.staffId}/view`,
      },
      {
        label: 'Leave',
        class: 'disable-label',
        link: `/crm/contacts/staff/${params?.staffId}/view/leave`,
      },
      {
        label: 'View Leave',
        class: 'active-label',
        link: `/crm/contacts/staff/${params?.staffId}/view/leave/${params?.id}/view`,
      },
    ]);
  }, []);

  const leaveType = {
    SICK: 'Sick',
    CASUAL: 'Casual',
  };

  React.useEffect(() => {
    fetchData(`/staff-leave/${params?.id}/find`, 'GET')
      .then((res) => setLeave(res?.data))
      .catch((err) => {
        console.error(err);
        if (err?.status_code === 404) navigate('/not-found');
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.id]);

  return (
    <div className="mainContentInner">
      <div className="tablesContainer">
        <div className="leftTables">
          <table className="viewTables">
            <thead>
              <tr>
                <th colSpan="2">Leave Details</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="col1"> Begin Date</td>
                <td className="col2"> {leave?.begin_date} </td>
              </tr>
              <tr>
                <td className="col1"> End Date</td>
                <td className="col2"> {leave?.end_date} </td>
              </tr>
              <tr>
                <td className="col1">Type</td>
                <td className="col2"> {leaveType[leave?.type]} </td>
              </tr>
              <tr>
                <td className="col1">Hours</td>
                <td className="col2"> {leave?.hours} </td>
              </tr>
              <tr>
                <td className="col1">Note</td>
                <td className="col2"> {leave?.note} </td>
              </tr>
            </tbody>
          </table>

          <table className="viewTables">
            <thead>
              <tr>
                <th colSpan="2">Insights </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="col1">Created</td>
                <td className="col2">
                  {formatUser(leave?.created_by) ?? ''}
                  {formatDate(leave?.created_at) ?? ''}{' '}
                </td>
              </tr>
              <tr>
                <td className="col1">Modified</td>
                <td className="col2">
                  {formatUser(leave?.modified_by) ?? leave?.created_by}
                  {formatDate(leave?.modified_at) ?? leave?.created_at}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="rightTables"></div>
      </div>
    </div>
  );
}
