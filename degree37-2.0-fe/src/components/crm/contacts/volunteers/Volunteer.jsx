import React from 'react';
import { fetchData } from '../../../../helpers/Api';
import { useParams } from 'react-router-dom';
import viewimage from '../../../../assets/images/contact-about.png';

const Volunteer = () => {
  const params = useParams();
  const [volunteer, setVolunteer] = React.useState(null);

  React.useEffect(() => {
    const fetchVolunteer = async () => {
      try {
        const { data } = await fetchData(
          `/contact-volunteer/${params?.volunteerId}`
        );
        setVolunteer(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchVolunteer();
  }, [params?.volunteerId]);

  return (
    <div>
      <div className="d-flex align-items-center gap-3 pb-4 ">
        <div>
          <img
            src={viewimage}
            className="bg-white heroIconImg"
            alt="CancelIcon"
          />
        </div>
        <div className="d-flex flex-column">
          <h4
            className="mb-0"
            style={{
              fontWeight: '500',
            }}
          >
            {`${volunteer?.first_name ? volunteer.first_name : ''} 
            ${volunteer?.last_name ? volunteer.last_name : ''}`}
          </h4>
          <span
            style={{
              fontSize: '16px',
              fontWeight: '500',
            }}
          >
            {volunteer?.title || ''}
          </span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Volunteer);
