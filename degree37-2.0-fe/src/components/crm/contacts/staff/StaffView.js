import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchData } from '../../../../helpers/Api';
import ViewForm from '../../../common/ViewForm';
import styles from './donor.module.scss';
import TopBar from '../../../common/topbar/index.js';
import viewimage from '../../../../assets/images/contact-about.png';
import ContactsViewNavigationTabs from './DonorViewTabs';
import SvgComponent from '../../../common/SvgComponent';
import CheckPermission from '../../../../helpers/CheckPermissions';
import CrmPermissions from '../../../../enums/CrmPermissionsEnum';
import { StaffBreadCrumbsData } from './StaffBreadCrumbsData';

const VolunteerView = () => {
  const params = useParams();
  const [category, setCategory] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(true);

  const BreadcrumbsData = [
    ...StaffBreadCrumbsData,
    {
      label: 'View Staff',
      class: 'disable-label',
      link: `/crm/contacts/staff/${params?.id}/view`,
    },
    {
      label: 'About',
      class: 'active-label',
      link: `/crm/contacts/staff/${params?.id}/view`,
    },
  ];

  React.useEffect(() => {
    setIsLoading(true);
    fetchData(`/locations/attachment-category/${params?.id}`, 'GET')
      .then((res) => {
        setCategory(res.data);
        console.log(category);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, [params]);
  const config = [
    {
      section: 'Donor Details',
      fields: [
        { label: 'Donor ID', field: 'id' },
        { label: 'Donor Name', field: 'name' },
        { label: 'Nick Name', field: 'nick_name' },
        { label: 'Mailing Address', field: '' },
        { label: 'Zip Code', field: 'nick_name' },
        { label: 'City', field: '' },
        { label: 'State', field: '' },
        { label: 'County', field: '' },
        { label: 'Date of Birth', field: '' },
      ],
    },
    {
      section: 'Contact Info',
      hasAction: true,
      actionUrl: '/',
      actionText: 'Communicate',
      fields: [
        { label: 'Work Phone', field: 'work_phone' },
        { label: 'Mobile Phone', field: 'mobile_phone' },
        { label: 'Other Phone', field: 'other_phone' },
        { label: 'Work Email', field: 'work_email' },
        { label: 'Home Email', field: 'home_email' },
        { label: 'Other Email', field: 'other_email' },
      ],
    },
    {
      section: 'Attributes',
      fields: [
        { label: 'Blood Type', field: 'blood_type', value: 'O-nagative' },
        { label: 'CMV', field: 'cmv', value: 'Negative' },
        { label: 'Gender', field: 'gender', value: 'Male' },
        { label: 'Race', field: 'race', value: 'Asian' },
        {
          label: 'Lifetime Dontaions',
          field: 'lifetime_donations',
          value: '24/7',
        },
        {
          label: 'Last Donation Date',
          field: 'last_donation_date',
          value: '18 June 2023',
        },
        { label: 'Loyalty Points', field: 'loyalty_points', value: '123' },
        { label: 'Eligilibity', field: 'eligilibity' },
        {
          label: 'Whole Blood',
          field: 'whole_blood',
          value: '11-29-2023',
          approved: true,
          show_check: true,
        },
        {
          label: 'Double Red Blood Cells',
          field: 'double_red_blood_cells',
          value: '12-29-2023',
          approved: false,
          show_check: true,
        },
        {
          label: 'Platelets',
          field: 'platelets',
          value: '12-29-2023',
          approved: false,
          show_check: true,
        },
        {
          label: 'Plasma',
          field: 'plasma',
          value: '11-29-2023',
          approved: true,
          show_check: true,
        },
      ],
    },
    {
      section: 'Contact Preferences',
      hasAction: true,
      actionUrl: '/',
      actionText: 'Update Preferences',
      fields: [
        { label: 'Next Call Date', field: 'work_phone', value: '12-29-2023' },
        { label: 'Opt Out Email', field: 'work_phone', value: 'Yes' },
        { label: 'Opt Out SMS', field: 'mobile_phone', value: 'Yes' },
        { label: 'Opt Out Push', field: 'other_phone', value: 'Yes' },
        { label: 'Opt Out Call', field: 'work_email', value: 'No' },
      ],
    },
    {
      section: 'Insights',
      fields: [
        {
          label: 'Status',
          field: 'status',
          format: (value) => (value ? 'Active' : 'Inactive'),
        },
        {
          label: 'Created By',
          field: 'created_by',
        },
        {
          label: 'Modified',
          field: 'modified_by',
        },
      ],
    },
  ];

  const additionalItems = [
    {
      section: 'Tags',
      fields: [
        {
          label: 'Call in Evening',
          field: 'call_in_evening',
        },
        {
          label: 'Sent Email',
          field: 'sent_email',
        },
        {
          label: 'Will Call Us',
          field: 'will_call_us',
        },
      ],
    },
  ];
  const additionalItemsWithoutIcon = [
    {
      section: 'Campaigns',
      fields: [
        {
          label: 'Lorem Ipsum Campaigns',
          field: 'call_in_evening',
        },
        {
          label: 'Lorem Ipsum Campaigns',
          field: 'sent_email',
        },
      ],
    },
    {
      section: 'Sagment',
      fields: [
        {
          label: 'Thank you Donors',
          field: 'call_in_evening',
        },
        {
          label: 'Workflow - Thank you Donors',
          field: 'sent_email',
        },
      ],
    },
    {
      section: 'Automations',
      fields: [
        {
          label: 'No record found',
          field: 'call_in_evening',
        },
      ],
    },
  ];
  const additionalItemsWithGroupData = [
    {
      section: 'Group Codes',
      hasAction: true,
      actionUrl: '/',
      actionText: 'Add Group Code',
      fields: [
        {
          code: 'Code',
          name: 'Name',
          sDate: 'Start Date',
          applied: 'Applied by',
          last: 'Last Donation',
          icon: false,
        },
        {
          code: 'B103',
          name: 'Metro High School',
          sDate: '12-29-2023',
          applied: 'John Deo',
          last: '12-29-2023',
          icon: true,
        },
        {
          code: 'B103',
          name: 'Metro High School',
          sDate: '12-29-2023',
          applied: 'John Deo',
          last: '12-29-2023',
          icon: true,
        },
        {
          code: 'B103',
          name: 'Metro High School',
          sDate: '12-29-2023',
          applied: 'John Deo',
          last: '12-29-2023',
          icon: true,
        },
      ],
    },
    {
      section: 'Center Codes',
      hasAction: true,
      actionUrl: '/',
      actionText: 'Add Center Code',
      fields: [
        {
          code: 'Code',
          name: 'Name',
          sDate: 'Start Date',
          applied: 'Applied by',
          last: 'Last Donation',
          icon: false,
        },
        {
          code: '1234',
          name: 'Dallas Donor Center',
          sDate: '12-29-2023',
          applied: 'John Deo',
          last: '12-29-2023',
          icon: true,
        },
        {
          code: '1234',
          name: 'Dallas Donor Center',
          sDate: '12-29-2023',
          applied: 'John Deo',
          last: '12-29-2023',
          icon: true,
        },
        {
          code: '1234',
          name: 'Dallas Donor Center',
          sDate: '12-29-2023',
          applied: 'John Deo',
          last: '12-29-2023',
          icon: true,
        },
      ],
    },
    {
      section: 'Assertions',
      hasAction: true,
      actionUrl: '/',
      actionText: 'Add Assertion',
      fields: [
        {
          code: 'Code',
          name: 'Name',
          sDate: 'Start Date',
          applied: 'Applied by',
          last: 'End Date',
          icon: false,
        },
        {
          code: '4LIFE',
          name: 'Friend 4 Life',
          sDate: '12-29-2023',
          applied: 'John Deo',
          last: '12-29-2023',
          icon: true,
        },
        {
          code: '4LIFE',
          name: 'Friend 4 Life',
          sDate: '12-29-2023',
          applied: 'John Deo',
          last: '12-29-2023',
          icon: true,
        },
        {
          code: '4LIFE',
          name: 'Friend 4 Life',
          sDate: '12-29-2023',
          applied: 'John Deo',
          last: '12-29-2023',
          icon: true,
        },
      ],
    },
  ];

  return (
    <div className={styles.accountViewMain}>
      <div className="mainContent">
        <TopBar
          BreadCrumbsData={BreadcrumbsData}
          BreadCrumbsTitle={'About'}
          SearchValue={null}
          SearchOnChange={null}
          SearchPlaceholder={null}
        />
        <div className="imageMainContent">
          <div className="d-flex align-items-center gap-3 pb-4 ">
            <img
              src={viewimage}
              className="bg-white heroIconImg"
              alt="CancelIcon"
            />
            <div className="d-flex flex-column">
              <h4 className="">John Deo</h4>
              <span>730216854</span>
            </div>
          </div>
          <ContactsViewNavigationTabs />
          {CheckPermission([CrmPermissions.CRM.CONTACTS.STAFF.WRITE]) && (
            <Link className="contacts-edit-icon">
              <span className="icon">
                <SvgComponent name="EditIcon" />
              </span>
              <span className="text">Edit Donor</span>
            </Link>
          )}
        </div>

        <ViewForm
          className="contact-view"
          data={category}
          config={config}
          isLoading={isLoading}
          additional={additionalItems}
          additionalWithoutIcon={additionalItemsWithoutIcon}
          additionalWithGroupData={additionalItemsWithGroupData}
        />
      </div>
    </div>
  );
};

export default VolunteerView;
