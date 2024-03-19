import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import BreadCrumbs from '../../../../../common/breadcrumbs';
import SvgComponent from '../../../../../common/SvgComponent';
import { makeRequest } from '../../../../../../utils';
// Custom function to format the date
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const month = date.toLocaleString('default', { month: 'short' });
  const day = date.getDate();
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${month} ${ordinalSuffix(day)}, ${year} ${hours}:${minutes
    .toString()
    .padStart(2, '0')}`;
};

// Function to get the ordinal suffix (e.g., 1st, 2nd, 3rd, etc.)
const ordinalSuffix = (day) => {
  if (day === 1 || day === 21 || day === 31) {
    return `${day}st`;
  } else if (day === 2 || day === 22) {
    return `${day}nd`;
  } else if (day === 3 || day === 23) {
    return `${day}rd`;
  } else {
    return `${day}th`;
  }
};

const ViewCategory = ({ categoryId }) => {
  const [categoryData, setCategoryData] = useState({});
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const BreadcrumbsData = [
    { label: 'System Configuration', class: 'disable-label', link: '/' },
    {
      label: 'CRM Adminstration',
      class: 'disable-label',
      link: '/',
    },
    {
      label: 'Location',
      class: 'disable-label',
      link: '#',
    },
    {
      label: 'View Attachment Category',
      class: 'active-label',
      link: `#`,
    },
  ];

  useEffect(() => {
    const getData = async (categoryId) => {
      const response = await makeRequest(
        `${BASE_URL}/location/attachment-category/${categoryId}`,
        'GET'
      );
      console.log(response, 'this is response');
      console.log(response.status);
      if (response.ok || response.status_code === 200) {
        setCategoryData(response.data);
      } else {
        toast.error('Error Fetching Categories Details', { autoClose: 3000 });
      }
    };
    if (categoryId) {
      getData(categoryId);
      console.log(categoryData, 'cat data');
    }
  }, [categoryId]);

  return (
    <div className="mainContent">
      <BreadCrumbs data={BreadcrumbsData} title={'Atttachment Categories'} />
      <div className="filterBar">
        <div className="tabs vehicle-tab">
          <div className="text-end h6 fw-normal cursor-pointer edit-icon">
            <Link
              to={`/system-configuration/tenant-admin/crm-admin/location/attachment-categories/${categoryId}/edit`}
            >
              <SvgComponent name={'EditIcon'} /> Edit
            </Link>
          </div>
        </div>
      </div>

      <div className="mainContentInner">
        <div className="col-md-6">
          <table className="viewTables">
            <thead>
              <tr>
                <th colSpan="2">Attachment Subcategory Details</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="col1">Name</td>
                <td className="col2"> {categoryData?.name} </td>
              </tr>

              <tr>
                <td className="col1">Description</td>
                <td className="col2"> {categoryData?.description} </td>
              </tr>
            </tbody>
          </table>

          <table className="viewTables">
            <thead>
              <tr>
                <th colSpan="2">Insights</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="col1">Status</td>
                <td className="col2">
                  {categoryData?.is_active ? (
                    <span className="badge active"> Active </span>
                  ) : (
                    <span className="badge inactive"> Inactive </span>
                  )}{' '}
                </td>
              </tr>
              <tr>
                <td className="col1">Created by</td>
                <td className="col2">{`${categoryData?.id} `}</td>
              </tr>
              <tr>
                <td className="col1">Modified</td>
                <td className="col2">
                  {formatDate(categoryData?.created_at)}{' '}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewCategory;
