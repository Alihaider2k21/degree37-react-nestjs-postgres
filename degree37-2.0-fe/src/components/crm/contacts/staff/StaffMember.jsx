import React from 'react';
import styles from './StaffNavigation.module.scss';
import { fetchData } from '../../../../helpers/Api';
import { useParams } from 'react-router-dom';

const StaffMember = ({ refreshData }) => {
  const params = useParams();
  const [staff, setStaff] = React.useState(null);

  React.useEffect(() => {
    const fetchStaff = async () => {
      try {
        const [staff, staffRoles] = await Promise.all([
          fetchData(
            `/contact-staff/${
              params?.staff_id ?? params?.staffId ?? params?.id
            }`
          ),
          fetchData(
            `/contact-staff/${
              params?.staff_id ?? params?.staffId ?? params?.id
            }/roles`
          ),
        ]);
        const staffRole = staffRoles?.data.find(
          (staffRole) => staffRole.is_primary
        );
        setStaff({ ...staff?.data, role: staffRole?.role_id });
      } catch (err) {
        console.error(err);
      }
    };

    fetchStaff();
  }, [params?.staffId, params?.staff_id, params?.id, refreshData]);

  return (
    <div className="d-flex gap-3 mb-4 align-items-center">
      <div className={`px-3 py-2 rounded ${styles.memberIcon}`}>
        <svg
          width="26"
          height="32"
          viewBox="0 0 26 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.07591 0C6.10772 0 5.27856 0.693499 5.10741 1.64643L3.9 8.36875V13C4.10313 13 4.46012 16.9117 7.92188 19.2563C3.57673 21.1219 0.418019 25.2801 0.0383987 30.2009C-0.00408121 30.7516 0.447715 31.2 1 31.2H1.6C2.15228 31.2 2.59496 30.7511 2.64719 30.2013C2.92091 27.3201 4.36677 24.7843 6.5 23.075V23.9281L6.86562 24.3344L12.2952 29.728C12.6852 30.1154 13.3148 30.1154 13.7048 29.728L19.1344 24.3344L19.5 23.9281V23.075C21.6332 24.7843 23.0791 27.3201 23.3528 30.2013C23.405 30.7511 23.8477 31.2 24.4 31.2H25C25.5523 31.2 26.0041 30.7516 25.9616 30.2009C25.582 25.2801 22.4233 21.1219 18.0781 19.2563C20.1551 17.8496 21.6023 15.5898 21.9781 13L22.1 8.36875L20.8926 1.64643C20.7214 0.6935 19.8923 0 18.9241 0H7.07591ZM7.45107 3.42622C7.5354 2.94836 7.95061 2.6 8.43586 2.6H17.5641C18.0494 2.6 18.4646 2.94836 18.5489 3.42621L19.5 8.81563V10.4H6.5V8.81563L7.45107 3.42622ZM12.2 3.9C11.9239 3.9 11.7 4.12386 11.7 4.4V5.2H10.9C10.6239 5.2 10.4 5.42386 10.4 5.7V7.3C10.4 7.57614 10.6239 7.8 10.9 7.8H11.7V8.6C11.7 8.87614 11.9239 9.1 12.2 9.1H13.8C14.0761 9.1 14.3 8.87614 14.3 8.6V7.8H15.1C15.3761 7.8 15.6 7.57614 15.6 7.3V5.7C15.6 5.42386 15.3761 5.2 15.1 5.2H14.3V4.4C14.3 4.12386 14.0761 3.9 13.8 3.9H12.2ZM6.62187 13H19.3781C18.7738 15.9707 16.1535 18.2 13 18.2C9.84648 18.2 7.22617 15.9707 6.62187 13ZM13 20.8C14.3762 20.8 15.6965 21.0488 16.9 21.5313V22.8313L13.7071 26.0241C13.3166 26.4147 12.6834 26.4147 12.2929 26.0241L9.1 22.8313V21.5313C10.3035 21.0488 11.6238 20.8 13 20.8Z"
            fill="white"
          />
        </svg>
      </div>
      <div>
        <h2 className={styles.memberName}>
          {staff?.first_name} {staff?.last_name}
        </h2>
        <h2 className={styles.memberRole}>
          {staff && !staff?.role?.name ? 'No Role Assigned' : staff?.role?.name}
        </h2>
      </div>
    </div>
  );
};

export default React.memo(StaffMember);
