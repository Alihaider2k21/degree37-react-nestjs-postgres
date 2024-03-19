import React, { useEffect } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import ViewForm from '../../../common/ViewForm';
import styles from './staff.module.scss';
import { DashDateFormat } from '../../../../helpers/formatDate';
import { API } from '../../../../api/api-routes';
import SelectDataModal from '../../../common/SelectDataModal';
import AddCertificateModal from './AddCertificateModal';
import { format } from 'date-fns';
import CommunicationModal from '../../../common/CommunicationModal';
import { StaffBreadCrumbsData } from '../staff/StaffBreadCrumbsData';
import ModifyClassificationModal from './ModifyClassificationModal';
import SuccessPopUpModal from '../../../common/successModal';
import { toast } from 'react-toastify';
import { removeCountyWord } from '../../../../helpers/utils';
import StaffNavigation from '../staff/StaffNavigation';
const StaffView = () => {
  const params = useParams();
  const context = useOutletContext();
  useEffect(() => {
    context.setBreadCrumbsState([
      ...StaffBreadCrumbsData,
      {
        label: 'View Staff',
        class: 'active-label',
        link: `/crm/contacts/staff/${params?.staffId}/view`,
      },
      {
        label: 'About',
        class: 'active-label',
        link: `/crm/contacts/staff/${params?.staffId}/view`,
      },
    ]);
  }, []);
  const [staff, setStaff] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  const [roles, setRoles] = React.useState([]);
  const [teams, setTeams] = React.useState([]);
  const [staffTeams, setStaffTeams] = React.useState([]);
  const [donorCenters, setDonorCenters] = React.useState([]);
  const [staffRoles, setStaffRoles] = React.useState([]);
  const [selectedRoles, setSelectedRows] = React.useState([]);
  const [openRoleModal, setOpenRoleModal] = React.useState(false);
  const [openTeamModal, setOpenTeamModal] = React.useState(false);
  const [openDonorCenterModal, setOpenDonorCenterModal] = React.useState(false);
  const [openClassificationModal, setOpenClassificationModal] =
    React.useState(false);
  const [selectedDonorCenters, setSelectedDonorCenters] = React.useState([]);
  const [staffDonorCenters, setStaffDonorCenters] = React.useState([]);
  const [selectedTeams, setSelectedTeams] = React.useState([]);
  const [selectedCertificate, setSelectedCertificate] = React.useState(null);
  const [showCertificationModal, setShowCertificationModal] =
    React.useState(false);
  const [certificates, setCertificates] = React.useState([]);
  const [certificateError, setCertificateError] = React.useState('');
  const [staffCertificate, setStaffCertificate] = React.useState([]);
  const [staffClassification, setStaffClassification] = React.useState([]);
  const [userData, setUserData] = React.useState(null);
  const [addingRoles, setAddingRole] = React.useState(false);
  const [addingDonors, setAddingDonors] = React.useState(false);
  const [addingTeams, setAddingTeams] = React.useState(false);
  const [addingCerti, setAddingCerti] = React.useState(false);
  const [openCommunication, setOpenCommunication] = React.useState(false);
  const [messageType, setMessageType] = React.useState('sms');
  const [refreshData, setRefreshData] = React.useState(false);
  const [refreshRoleData, setRefreshRoleData] = React.useState(false);

  const [modalPopUp, setModalPopUp] = React.useState(false);
  const [archiveObject, setArchiveObject] = React.useState(null);
  const [archiveSuccess, setArchiveSuccess] = React.useState(false);
  const [sucessMessage, setSucessMessage] = React.useState(null);
  const [classificationSettings, setClassificationSettings] = React.useState(
    {}
  );
  const communicationable_type = 'staff';
  const communicationable_id = params?.staffId;
  React.useEffect(() => {
    getStaffTeams();
    getStaffCertificates();
  }, []);

  React.useEffect(() => {
    getStaffData();
    getStaffRoles();
    getStaffDonorCenters();
  }, [params?.staffId, refreshData]);

  const getStaffData = async () => {
    try {
      setLoading(true);
      const response = await API.crm.contacts.staff.getStaffByID(
        params?.staffId
      );
      const staffData = response?.data?.data;
      if (staffData) {
        setStaff(staffData);
        const contactData = staffData?.contact?.find(
          (ct) => ct?.contact_type === 4
        );
        const workEmail = contactData?.data;

        if (workEmail) {
          const user = await API.crm.contacts.staff.getUserByEmail(workEmail);
          const userDetails = user?.data?.data;
          if (userDetails) {
            setUserData(userDetails);
          }
        }

        if (staffData?.classification_id?.id) {
          getStaffClassification(staffData?.classification_id?.id);
        }

        setLoading(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const postRoles = async () => {
    try {
      if (selectedRoles?.length === 0) {
        return;
      }
      setAddingRole(true);
      await API.crm.contacts.staff.addStaffRoles(params?.staffId, {
        staff_id: parseInt(params?.staffId),
        role_id: [...selectedRoles.map((id) => parseInt(id))],
      });
      await getStaffRoles();
      setSelectedRows([]);
      setOpenRoleModal(false);
      setAddingRole(false);
    } catch (error) {
      console.log(error);
    }
  };

  const postDonorCenters = async () => {
    try {
      if (selectedDonorCenters?.length === 0) {
        return;
      }
      setAddingDonors(true);
      await API.crm.contacts.staff.addStaffDonorCenter(params?.staffId, {
        staff_id: parseInt(params?.staffId),
        donor_center_id: [...selectedDonorCenters.map((id) => parseInt(id))],
      });
      await getStaffDonorCenters();
      setSelectedDonorCenters([]);
      setOpenDonorCenterModal(false);
      setAddingDonors(false);
    } catch (error) {
      console.log(error);
    }
  };

  const postTeams = async () => {
    try {
      if (selectedTeams?.length === 0) {
        return;
      }
      setAddingTeams(true);
      await API.crm.contacts.staff.addStaffTeams(params?.staffId, {
        staff_id: parseInt(params?.staffId),
        teams: [...selectedTeams.map((id) => parseInt(id))],
      });
      await getStaffTeams();
      setSelectedTeams([]);
      setOpenTeamModal(false);
      setAddingTeams(false);
    } catch (error) {
      console.log(error);
    }
  };

  const getStaffRoles = async (name) => {
    try {
      const staffRoles = await API.crm.contacts.staff.getStaffRoleByID(
        params?.staffId
      );
      const staffRolesData = staffRoles?.data?.data || [];

      const contactRoles =
        await API.systemConfiguration.crmAdministration.contact.getContactRoles(
          name,
          1
        );
      const contactRolesData = contactRoles?.data?.data || [];
      const newArray = contactRolesData.filter(
        ({ id }) => !staffRolesData.some((e) => e?.role_id?.id === id)
      );

      setStaffRoles(staffRolesData);
      setRoles(newArray);
    } catch (error) {
      console.log(error);
    }
  };

  const getStaffDonorCenters = async (name) => {
    try {
      const staffDonorCenters =
        await API.crm.contacts.staff.getStaffDonorCenterByID(params?.staffId);
      const staffDonorCentersData = staffDonorCenters?.data?.data || [];
      const donorCenters =
        await API.systemConfiguration.crmAdministration.contact.getContactDonorCenters(
          name
        );
      const donorCentersData =
        donorCenters?.data?.data?.filter((center) => center.donor_center) || [];
      const newArray = donorCentersData.filter(
        ({ id }) =>
          !staffDonorCentersData.some((e) => e?.donor_center_id?.id === id)
      );

      setStaffDonorCenters(staffDonorCentersData);
      setDonorCenters(newArray);
    } catch (error) {
      console.log(error);
    }
  };

  const updateStaffPrimaryRole = async (staffId, roleId, isPrimary) => {
    try {
      await API.crm.contacts.staff.updateStaffPrimaryRole(
        staffId,
        roleId,
        isPrimary
      );
      // if (updatedData?.data?.status == 201) {
      //   const updatedRoles = staffRoles?.map((role) => ({
      //     ...role,
      //     is_primary: role?.role_id?.id === roleId,
      //   }));
      //   setStaffRoles(updatedRoles);
      // }
      await getStaffRoles();
      setRefreshRoleData((prevState) => !prevState);
    } catch (error) {
      console.log(error);
    }
  };

  const archivedObject = async () => {
    const apiEndpoints = {
      role: async (id) =>
        await API.crm.contacts.staff.removeStaffRole(params?.staffId, id),
      donor_center: async (id) =>
        await API.crm.contacts.staff.removeStaffDonorCenter(
          params?.staffId,
          id
        ),
      team: async (id) =>
        await API.crm.contacts.staff.removeStaffTeams(params?.staffId, id),
      certificate: async (id) =>
        await API.crm.contacts.staff.removeStaffCertificate(id),
    };
    try {
      setModalPopUp(false);
      if (archiveObject.name === 'certificate') {
        const response = await apiEndpoints[archiveObject.name](
          archiveObject.id
        );
        if (response?.status === 200) {
          setSucessMessage('Certificate removed.');
          setTimeout(() => {
            setArchiveSuccess(true);
          }, 600);
          await getStaffCertificates();
        }
        return;
      } else if (archiveObject.name === 'role') {
        const response = await apiEndpoints[archiveObject.name](
          archiveObject.id
        );
        if (response?.status === 200) {
          setSucessMessage('Role removed.');
          setTimeout(() => {
            setArchiveSuccess(true);
          }, 600);
          await getStaffRoles();
        }
        return;
      } else if (archiveObject.name === 'donor_center') {
        const response = await apiEndpoints[archiveObject.name](
          archiveObject.id
        );
        if (response?.status === 200) {
          setSucessMessage('Donor center removed.');
          setTimeout(() => {
            setArchiveSuccess(true);
          }, 600);
          await getStaffDonorCenters();
        }
        return;
      } else if (archiveObject.name === 'team') {
        const response = await apiEndpoints[archiveObject.name](
          archiveObject.id
        );
        if (response?.status === 201) {
          setSucessMessage('Team removed.');
          setTimeout(() => {
            setArchiveSuccess(true);
          }, 600);
          await getStaffTeams();
        }
        return;
      } else {
        return;
      }
    } catch (error) {
      console.log(error);
      toast.error(`${error?.message}`, { autoClose: 3000 });
    } finally {
      setArchiveObject(null);
      setModalPopUp(false);
    }
  };

  const updateStaffPrimaryDonorCenter = async (staffId, roleId, isPrimary) => {
    try {
      const response =
        await API.crm.contacts.staff.updateStaffPrimaryDonorCenter(
          staffId,
          roleId,
          isPrimary
        );
      const { data, status } = response;
      console.log(status);
      if (status === 200) {
        setStaffDonorCenters(data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addStaffCertificate = async (startDate) => {
    if (selectedCertificate) {
      try {
        if (!selectedCertificate?.id) {
          return;
        }
        setAddingCerti(true);
        await API.crm.contacts.staff.addStaffCertificate({
          staff_ids: [params?.staffId],
          certification_id: selectedCertificate.id,
          start_date: startDate,
        });
        setShowCertificationModal(false);
        await getStaffCertificates();
        setAddingCerti(false);
      } catch (error) {
        console.log(error);
      }
    } else {
      setCertificateError('Certificate is required.');
    }
  };

  const getStaffCertificates = async () => {
    try {
      const staffCertificates =
        await API.crm.contacts.staff.getStaffCertificates(params?.staffId);
      const staffCertificatesData =
        staffCertificates?.data?.data?.records || [];
      const certificates =
        await API.systemConfiguration.crmAdministration.contact.getCertificates();
      const certificatesData = certificates?.data?.data?.records || [];
      const newArray = certificatesData.filter(
        ({ id }) =>
          !staffCertificatesData.some((e) => e?.staff_certification_id === id)
      );
      setCertificates(newArray);
      setStaffCertificate(staffCertificatesData);
    } catch (error) {
      console.log(error);
    }
  };

  const getStaffClassification = async (classification_id) => {
    try {
      const staffClassificationSettings =
        await API.crm.contacts.staff.getStaffClassificationSettings(
          classification_id
        );
      const staffClassificationSettingsData =
        staffClassificationSettings?.data?.data || [];
      const settings = staffClassificationSettingsData?.find(
        (item) => item?.classification?.id === classification_id
      );

      if (settings !== undefined && Object.keys(settings)?.length > 0) {
        const classificationDataToRender = [
          {
            label: 'Maximum Consecutive Days per Week',
            field: settings?.max_consec_days_per_week,
          },
          {
            label: 'Maximum Consecutive Weekends',
            field: settings?.max_consec_weekends,
          },
          {
            label: 'Minimum Days per Week',
            field: settings?.min_days_per_week,
          },
          {
            label: 'Maximum Days per Week',
            field: settings?.max_days_per_week,
          },
          {
            label: 'Maximum Hours per Week',
            field: settings?.max_hours_per_week,
          },
          {
            label: 'Maximum OT per Week',
            field: settings?.max_ot_per_week,
          },
          {
            label: 'Maximum Weekend Hours',
            field: settings?.max_weekend_hours,
          },
          {
            label: 'Maximum Weekends per Month',
            field: settings?.max_weekends_per_months,
          },
          {
            label: 'Minimum Recovery Time',
            field: settings?.min_recovery_time,
          },
          {
            label: 'Overtime Threshold',
            field: settings?.overtime_threshold,
          },
        ];
        setClassificationSettings(settings);
        setStaffClassification(classificationDataToRender);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getStaffTeams = async (name) => {
    try {
      const staffTeams = await API.crm.contacts.staff.getStaffTeams(
        params?.staffId
      );
      const staffTeamsData = staffTeams?.data?.response || [];

      const teams =
        await API.systemConfiguration.crmAdministration.contact.getTeams({
          name: name,
          status: true,
        });
      const teamsData = teams?.data?.data?.teams || [];
      const newArray = teamsData.filter(
        ({ id }) => !staffTeamsData.some((e) => e?.team_id?.id === id)
      );

      setTeams(newArray);
      setStaffTeams(staffTeamsData);
    } catch (error) {
      console.log(error);
    }
  };

  const updateStaffPrimaryTeam = async (staffId, teamId) => {
    try {
      const staffTeams = await API.crm.contacts.staff.updateStaffPrimaryTeam(
        staffId,
        teamId
      );
      console.log(staffTeams?.data?.response);
      setStaffTeams(staffTeams?.data?.response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCommunicationButtons = (confirmed) => {
    setOpenCommunication(confirmed);
  };

  const config = [
    {
      section: 'Staff Details',
      fields: [
        { label: 'Staff ID', field: 'id' },
        { label: 'Staff Name', field: 'full_name' },
        { label: 'Nick Name', field: 'nick_name' },
        { label: 'Primary Role', field: 'primary_role' },
        { label: 'Mailing Address', field: 'mailing_address' },
        { label: 'County', field: 'address.county' },
        { label: 'Date of Birth', field: 'birth_date' },
      ],
    },
    {
      section: 'Contact Info',
      hasAction: true,
      actionUrl: '#',
      actionText: 'Communicate',
      onClick: () => setOpenCommunication(true),
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
        {
          label: 'Collection Operation',
          field: 'collection_operation_id.name',
        },
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
          label: 'User Account',
          field: 'create_user',
          value: !userData
            ? 'Create User'
            : `${userData?.first_name} ${userData?.last_name}`,
          href: !userData
            ? `/system-configuration/tenant-admin/user-admin/users/create?staff_id=${params?.staffId}`
            : `/system-configuration/tenant-admin/user-admin/users/${userData.id}/edit`,
          openInNewTab: true,
        },
        {
          label: 'Created By',
          field: 'created_by',
        },
        {
          label: 'Updated By',
          field: 'updated_by',
        },
      ],
    },
  ];

  const additionalItems = [
    {
      section: 'Tags',
      fields: [],
    },
  ];

  const additionalGroupTabularData = [
    {
      section: 'Roles',
      hasAction: true,
      actionUrl: '#',
      actionText: 'Add Roles',
      onClick: () => setOpenRoleModal(true),
      headings: [
        {
          label: 'Roles',
          name: 'role',
          width: '40%',
          main: true,
        },
        {
          label: 'Primary Role',
          name: 'primaryRole',
          width: '65%',
          isCheckbox: true,
        },
        { label: '', width: '15%', action: true },
      ],
      rowsData: [
        ...staffRoles.map((role) => ({
          role: role.role_id.description,
          primaryRole: role.is_primary,
          onClickCheckBox: (is_primary) => {
            updateStaffPrimaryRole(
              params?.staffId,
              role.role_id.id,
              is_primary
            );
          },
          onClick: () => {
            setModalPopUp(true);
            setArchiveObject({ name: 'role', id: role.role_id.id });
          },
        })),
      ],
    },
    {
      section: 'Donor Centers',
      hasAction: true,
      actionUrl: '#',
      actionText: 'Add Centers',
      onClick: () => setOpenDonorCenterModal(true),
      headings: [
        {
          label: 'Donor Center',
          name: 'center',
          width: '40%',
          main: true,
        },
        {
          label: 'Primary Center',
          name: 'primaryCenter',
          width: '65%',
          isCheckbox: true,
        },
        { label: '', width: '15%', action: true },
      ],
      rowsData: [
        ...staffDonorCenters.map((center) => ({
          center: center.donor_center_id.name,
          id: center.donor_center_id.id,
          primaryCenter: center.is_primary,
          onClickCheckBox: (is_primary) => {
            updateStaffPrimaryDonorCenter(
              params?.staffId,
              center.donor_center_id.id,
              is_primary
            );
          },
          onClick: () => {
            setModalPopUp(true);
            setArchiveObject({
              name: 'donor_center',
              id: center.donor_center_id.id,
            });
          },
        })),
      ],
    },
    {
      section: 'Teams',
      hasAction: true,
      actionUrl: '#',
      actionText: 'Assign Team',
      onClick: () => setOpenTeamModal(true),
      headings: [
        {
          label: 'Teams',
          name: 'team',
          width: '40%',
          main: true,
        },
        {
          label: 'Primary Team',
          name: 'primaryTeam',
          width: '65%',
          isCheckbox: true,
        },
        { label: '', width: '15%', action: true },
      ],
      rowsData: [
        ...staffTeams.map((team) => ({
          team: team.team_id.name,
          primaryTeam: team.is_primary,
          onClickCheckBox: () => {
            updateStaffPrimaryTeam(params?.staffId, team.team_id.id);
          },
          onClick: () => {
            setModalPopUp(true);
            setArchiveObject({
              name: 'team',
              id: team.team_id.id,
            });
          },
        })),
      ],
    },
    {
      section: 'Certifications',
      hasAction: true,
      actionUrl: '#',
      actionText: 'Add Certifications',
      onClick: () => setShowCertificationModal(true),
      headings: [
        {
          label: 'Certificate Name',
          name: 'certificate',
          width: '40%',
          main: true,
        },
        { label: 'Start Date', name: 'sDate', width: '25%' },
        { label: 'Expiration Date', name: 'eDate', width: '25%' },
        { label: '', width: '15%', action: true },
      ],
      rowsData: [
        ...staffCertificate.map((certificate) => ({
          certificate: certificate.certificate_name,
          sDate: format(
            new Date(certificate.certificate_start_date),
            'MM-dd-yyyy'
          ),
          eDate: certificate?.expires
            ? format(new Date(certificate.expiration_date), 'MM-dd-yyyy')
            : 'N/A',
          onClick: () => {
            setModalPopUp(true);
            setArchiveObject({
              name: 'certificate',
              id: certificate?.staff_certification_id,
            });
          },
        })),
      ],
    },
  ];

  const additionalConfig = [
    {
      section: 'Classification',
      subHeading: staff?.classification_id?.name,
      hasAction: true,
      actionUrl: '#',
      actionText: 'Modify Settings',
      haveValues: Object.keys(staffClassification).length,
      onClick: () => setOpenClassificationModal(true),
      fields: staffClassification,
    },
  ];

  const transformData = (data) => {
    let full_name = data.first_name + ' ' + data.last_name;
    let mailing_address =
      data?.address?.address1 +
      ' ' +
      data?.address?.address2 +
      ', ' +
      data?.address?.city +
      ', ' +
      data?.address?.state +
      ' ' +
      data?.address?.zip_code;
    let birth_date = DashDateFormat(data.birth_date);
    let work_phone = '';
    let mobile_phone = '';
    let other_phone = '';
    let work_email = '';
    let home_email = '';
    let other_email = '';
    let primary_email_field = '';
    let primary_phone_field = '';

    if (data.contact && Array.isArray(data.contact)) {
      // Find the contact with contact_type 1 and assign its data to work_phone
      const contactWithType1 = data.contact.find(
        (contact) => contact.contact_type === 1
      );
      if (contactWithType1) {
        work_phone = contactWithType1.data;
        if (contactWithType1.is_primary) {
          primary_phone_field = 'work_phone';
        }
      }
      const contactWithType2 = data.contact.find(
        (contact) => contact.contact_type === 2
      );
      if (contactWithType2) {
        mobile_phone = contactWithType2.data;
        if (contactWithType2.is_primary) {
          primary_phone_field = 'mobile_phone';
        }
      }
      const contactWithType3 = data.contact.find(
        (contact) => contact.contact_type === 3
      );
      if (contactWithType3) {
        other_phone = contactWithType3.data;
        if (contactWithType3.is_primary) {
          primary_phone_field = 'other_phone';
        }
      }
      const contactWithType4 = data.contact.find(
        (contact) => contact.contact_type === 4
      );
      if (contactWithType4) {
        work_email = contactWithType4.data;
        if (contactWithType4.is_primary) {
          primary_email_field = 'work_email';
        }
      }
      const contactWithType5 = data.contact.find(
        (contact) => contact.contact_type === 5
      );
      if (contactWithType5) {
        home_email = contactWithType5.data;
        if (contactWithType5.is_primary) {
          primary_email_field = 'home_email';
        }
      }
      const contactWithType6 = data.contact.find(
        (contact) => contact.contact_type === 6
      );
      if (contactWithType6) {
        other_email = contactWithType6.data;
        if (contactWithType6.is_primary) {
          primary_email_field = 'other_email';
        }
      }
    }

    const primary_role = staffRoles?.find((role) => role?.is_primary);
    const primary_role_name = primary_role?.role_id?.name;
    return {
      ...data,
      full_name: full_name,
      birth_date: birth_date,
      work_phone: work_phone,
      mobile_phone: mobile_phone,
      other_phone: other_phone,
      address: {
        ...data.address,
        county: removeCountyWord(data.address.county),
      },
      work_email: work_email,
      home_email: home_email,
      other_email: other_email,
      mailing_address: mailing_address,
      primary_role: primary_role_name,
      primary_phone_field: primary_phone_field,
      primary_email_field: primary_email_field,
    };
  };

  const refetchData = () => {
    setStaffClassification([]);
    getStaffData();
  };

  return (
    <div className={styles.accountViewMain}>
      <StaffNavigation
        editUrl={`/crm/contacts/staff/${params?.staffId}/edit`}
        editLabel={'Staff'}
        refreshData={refreshRoleData}
      />
      {!loading && (
        <ViewForm
          className="contact-view"
          data={transformData(staff)}
          config={config}
          additional={additionalItems}
          additionalGroupTabularData={additionalGroupTabularData}
          additionalConfig={additionalConfig}
        />
      )}
      <SelectDataModal
        openModal={openRoleModal}
        setModalPopup={setOpenRoleModal}
        headingTitle={'Add Roles'}
        showSearchBar={true}
        actionButton={true}
        heading="Roles"
        data={roles}
        onSubmit={postRoles}
        onSelect={(e) => {
          const copy = [...selectedRoles];
          if (!copy.includes(e.target.value)) {
            copy.push(e.target.value);
          } else {
            copy.splice(copy.indexOf(e.target.value), 1);
          }
          setSelectedRows(copy);
        }}
        selectedValues={selectedRoles}
        setSelectedValues={setSelectedRows}
        getData={(name) => getStaffRoles(name)}
        savingData={addingRoles}
      />
      <SelectDataModal
        openModal={openDonorCenterModal}
        setModalPopup={setOpenDonorCenterModal}
        headingTitle={'Donor Centers'}
        showSearchBar={true}
        actionButton={true}
        heading="Donor Centers"
        data={donorCenters}
        onSubmit={postDonorCenters}
        onSelect={(e) => {
          const copy = [...selectedDonorCenters];
          if (!copy.includes(e.target.value)) {
            copy.push(e.target.value);
          } else {
            copy.splice(copy.indexOf(e.target.value), 1);
          }
          setSelectedDonorCenters(copy);
        }}
        selectedValues={selectedDonorCenters}
        setSelectedValues={setSelectedDonorCenters}
        getData={(name) => getStaffDonorCenters(name)}
        savingData={addingDonors}
      />
      <SelectDataModal
        openModal={openTeamModal}
        setModalPopup={setOpenTeamModal}
        headingTitle={'Teams'}
        showSearchBar={true}
        actionButton={true}
        heading="Teams"
        data={teams}
        onSubmit={postTeams}
        onSelect={(e) => {
          const copy = [...selectedTeams];
          if (!copy.includes(e.target.value)) {
            copy.push(e.target.value);
          } else {
            copy.splice(copy.indexOf(e.target.value), 1);
          }
          setSelectedTeams(copy);
        }}
        selectedValues={selectedTeams}
        setSelectedValues={setSelectedTeams}
        getData={(name) => getStaffTeams(name)}
        savingData={addingTeams}
      />
      <AddCertificateModal
        openModal={showCertificationModal}
        setModalPopup={setShowCertificationModal}
        headingTitle={'Add Certification'}
        showSearchBar={false}
        actionButton={true}
        data={certificates}
        selectedCertificate={selectedCertificate}
        setSelectedCertificate={setSelectedCertificate}
        onSubmit={addStaffCertificate}
        certificateError={certificateError}
        setCertificateError={setCertificateError}
        staffCertificate={staffCertificate}
        savingData={addingCerti}
      />
      <CommunicationModal
        openModal={openCommunication}
        setOpenModal={setOpenCommunication}
        defaultMessageType={messageType}
        setDefaultMessageType={setMessageType}
        communicationable_id={communicationable_id}
        communicationable_type={communicationable_type}
        handleModalButtons={handleCommunicationButtons}
        refreshData={refreshData} // Pass the state as a prop
        setRefreshData={setRefreshData}
      />
      {staff?.classification_id?.id && (
        <ModifyClassificationModal
          openModal={openClassificationModal}
          setModalPopup={setOpenClassificationModal}
          id={staff?.classification_id?.id}
          refetchData={refetchData}
          staff={staff}
          classificationSettings={classificationSettings}
        />
      )}
      <SuccessPopUpModal
        title="Confirmation"
        message={'Are you sure want to archive?'}
        modalPopUp={modalPopUp}
        setModalPopUp={setModalPopUp}
        showActionBtns={false}
        isArchived={true}
        archived={archivedObject}
      />
      <SuccessPopUpModal
        title="Success!"
        message={sucessMessage}
        modalPopUp={archiveSuccess}
        isNavigate={false}
        setModalPopUp={setArchiveSuccess}
        showActionBtns={true}
      />
    </div>
  );
};

export default StaffView;
