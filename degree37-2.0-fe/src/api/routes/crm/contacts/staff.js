import axios from 'axios';
const BASE_URL = process.env.REACT_APP_BASE_URL;

export const staffApis = {
  getStaffByID: async (staffId) => {
    return await axios.get(`${BASE_URL}/contact-staff/${staffId}`);
  },
  addStaffRoles: async (staffId, body) => {
    return await axios.post(`${BASE_URL}/contact-staff/${staffId}/roles`, {
      ...body,
    });
  },
  getStaffRoleByID: async (staffId) => {
    return await axios.get(`${BASE_URL}/contact-staff/${staffId}/roles`);
  },
  updateStaffPrimaryRole: async (staffId, roleId, is_primary) => {
    return await axios.patch(
      `${BASE_URL}/contact-staff/${staffId}/roles/${roleId}/primary-status`,
      {
        staff_id: parseInt(staffId),
        role_id: parseInt(roleId),
        is_primary,
      }
    );
  },
  removeStaffRole: async (staffId, roleId) => {
    return await axios.patch(
      `${BASE_URL}/contact-staff/${staffId}/roles/${roleId}`,
      {
        staff_id: parseInt(staffId),
        role_id: parseInt(roleId),
      }
    );
  },

  updateStaffPrimaryDonorCenter: async (staffId, donorCenterId, is_primary) => {
    return await axios.patch(
      `${BASE_URL}/contact-staff/${staffId}/donor-centers/${donorCenterId}/primary-status`,
      {
        staff_id: parseInt(staffId),
        donor_center_id: parseInt(donorCenterId),
        is_primary,
      }
    );
  },
  removeStaffDonorCenter: async (staffId, donorCenterId) => {
    return await axios.patch(
      `${BASE_URL}/contact-staff/${staffId}/donor-centers/${donorCenterId}`,
      {
        staff_id: parseInt(staffId),
        donor_center_id: parseInt(donorCenterId),
      }
    );
  },
  getStaffDonorCenterByID: async (staffId) => {
    return await axios.get(
      `${BASE_URL}/contact-staff/${staffId}/donor-centers`
    );
  },
  addStaffDonorCenter: async (staffId, body) => {
    return await axios.post(
      `${BASE_URL}/contact-staff/${staffId}/donor-centers`,
      {
        ...body,
      }
    );
  },

  addStaffCertificate: async (body) => {
    return await axios.post(
      `${BASE_URL}/staffing-admin/certification/staff-certification/assign`,
      {
        ...body,
      }
    );
  },

  removeStaffCertificate: async (staff_id) => {
    return await axios.delete(
      `${BASE_URL}/staffing-admin/certification/staff-certification/${staff_id}/delete`
    );
  },

  getStaffCertificates: async (staff_id) => {
    return await axios.get(
      `${BASE_URL}/staffing-admin/certification/staff-certification/list?staff_id=${staff_id}`
    );
  },

  getStaffClassification: async (classification_id) => {
    return await axios.get(
      `${BASE_URL}/staffing-admin/setting/${classification_id}`
    );
  },

  getStaffClassificationSettings: async (classification_id) => {
    return await axios.get(`${BASE_URL}/staffing-admin/setting/?limit=1000`);
  },

  addStaffTeams: async (staffId, body) => {
    return await axios.post(
      `${BASE_URL}/contact-staff/staffs/${staffId}/teams`,
      {
        ...body,
      }
    );
  },

  getStaffTeams: async (staff_id) => {
    return await axios.get(
      `${BASE_URL}/contact-staff/staffs/${staff_id}/teams`
    );
  },

  updateStaffPrimaryTeam: async (staffId, teamId, is_primary) => {
    return await axios.patch(
      `${BASE_URL}/contact-staff/staffs/${staffId}/teams/primary`,
      {
        team_id: parseInt(teamId),
        staff_id: parseInt(staffId),
      }
    );
  },

  removeStaffTeams: async (staffId, teamId) => {
    return await axios.patch(
      `${BASE_URL}/contact-staff/staffs/${staffId}/teams/remove`,
      {
        team_id: parseInt(teamId),
        staff_id: parseInt(staffId),
      }
    );
  },

  getUserByEmail: async (work_email) => {
    return await axios.get(`${BASE_URL}/tenant-users/email/${work_email}`);
  },

  getClassificationData: async (staff_id, token) => {
    return await axios.get(`${BASE_URL}/staffs/classification/${staff_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  getClassificationDataById: async (classificationId, token) => {
    return await axios.get(
      `${BASE_URL}/staffing-admin/setting/classification/${classificationId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  getShiftScheduleData: async (staff_id, token) => {
    return await axios.get(`${BASE_URL}/staffs/shift-schedule/${staff_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  createClassification: async (staff_id, token, body) => {
    return await axios.patch(
      BASE_URL + `/staffs/classification/${staff_id}`,
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  createShiftSchedule: async (staff_id, token, body) => {
    return await axios.post(
      BASE_URL + `/staffs/shift-schedule/${staff_id}`,
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },
};
