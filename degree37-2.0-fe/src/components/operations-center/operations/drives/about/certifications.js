import React, { useState, useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import { API } from '../../../../../api/api-routes';
import GlobalMultiSelect from '../../../../common/GlobalMultiSelect';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { makeAuthorizedApiRequest } from '../../../../../helpers/Api';
import SuccessPopUpModal from '../../../../common/successModal';

function CertificationsSection({ driveData, getDriveData }) {
  const { id } = useParams();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [addCertificationModal, setAddCertificationModal] = useState(false);
  const [certificationOptions, setCertificationOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [showModel, setShowModel] = useState(false);

  useEffect(() => {
    fetchCertifications();
  }, []);
  useEffect(() => {
    if (driveData !== null) {
      setSelectedOptions(
        driveData?.drives_certifications?.map(
          (item) => item.certificate_id[0]
        ) || []
      );
    }
  }, [driveData, addCertificationModal]);

  const fetchCertifications = async () => {
    const { data } =
      await API.systemConfiguration.staffAdmininstration.certifications.getCertificationsByType(
        'STAFF',
        true
      );
    const options = data?.data?.map((item) => {
      return { name: item.name, id: +item.id };
    });
    setCertificationOptions(options);
  };

  const handleChangeCertifications = (e) => {
    let dupArr = [...selectedOptions];
    if (dupArr.find((item) => +item.id === +e.id) === undefined) {
      dupArr.push(e);
    } else {
      dupArr = dupArr.filter((item) => +item.id !== +e.id);
    }
    setSelectedOptions(dupArr);
  };

  const submitCertifications = async () => {
    setButtonDisabled(true);
    if (selectedOptions.length === 0) {
      setButtonDisabled(false);
      return toast.error('Atleast one item should be selected.');
    }

    const existingCertifications =
      driveData?.drives_certifications?.map((item) => item.certificate_id[0]) ||
      [];
    let newArr = selectedOptions.map((item) => item.id);
    let dupArrDelete = existingCertifications.map((item) => item.id);
    existingCertifications.forEach((i) => {
      selectedOptions.forEach((c) => {
        if (+i.id === +c.id) {
          const findIndex = dupArrDelete.findIndex((item) => +item === +i.id);
          dupArrDelete.splice(findIndex, 1);
          const findIndex2 = newArr.findIndex((item) => +item === +c.id);
          newArr.splice(findIndex2, 1);
        }
      });
    });
    const body = {
      deleteCertifications: dupArrDelete,
      certifications: newArr.map((item) => {
        return {
          certification: item,
        };
      }),
    };
    try {
      const response = await makeAuthorizedApiRequest(
        'POST',
        `${BASE_URL}/drives/${id}/certifications`,
        JSON.stringify(body)
      );
      let data = await response.json();
      if (data?.status === 'success') {
        setAddCertificationModal(false);
        setShowModel(true);
      } else if (data?.status_code === 400) {
        const showMessage = Array.isArray(data?.message)
          ? data?.message[0]
          : data?.message;

        toast.error(`${showMessage}`, { autoClose: 3000 });
      } else {
        const showMessage = Array.isArray(data?.message)
          ? data?.message[0]
          : data?.message;
        toast.error(`${showMessage}`, { autoClose: 3000 });
      }
    } catch (error) {
      toast.error(`${error?.message}`, { autoClose: 3000 });
    }

    setButtonDisabled(false);
  };
  return (
    <>
      <table className="viewTables w-100 mt-5">
        <thead>
          <tr>
            <th colSpan="5">
              <div className="d-flex align-items-center justify-between w-100">
                <span>Certifications</span>
                <button
                  className="btn btn-link btn-md bg-transparent"
                  onClick={() => setAddCertificationModal(true)}
                >
                  Update Certifications
                </button>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <Row>
            <Col md={4} style={{ padding: '20px 15px 15px 15px' }}>
              <p style={{ paddingLeft: '15px' }}>Certificates</p>
            </Col>
            <Col style={{ backgroundColor: 'white' }} md={8}>
              <div
                className="w-100 d-flex align-items-center flex-wrap gap-3"
                style={{ padding: '15px 15px 15px 15px' }}
              >
                {(driveData?.drives_certifications?.length > 0 &&
                  driveData.drives_certifications.map((dc, index2) => {
                    if (dc.certificate_id?.length > 0) {
                      return dc.certificate_id.map((ci, index3) => {
                        return (
                          <>
                            <p
                              key={index3}
                              style={{
                                backgroundColor: '#dedede',
                                borderRadius: '5px',
                                padding: '5px 8px',
                                marginBottom: '0px',
                                color: '#005375',
                              }}
                            >
                              {ci.name}
                            </p>
                          </>
                        );
                      });
                    } else {
                      return 'No certifications';
                    }
                  })) || (
                  <p style={{ padding: '15px 15px 15px 15px', margin: 0 }}>
                    N/A
                  </p>
                )}
              </div>
            </Col>
          </Row>
        </tbody>
      </table>

      <section
        className={`popup full-section ${
          addCertificationModal ? 'active' : ''
        }`}
      >
        <div
          className="popup-inner"
          style={{ maxWidth: '800px', padding: '30px', paddingTop: '25px' }}
        >
          <div className="content">
            <div className="d-flex align-items-center justify-between">
              <h3>Add Certification</h3>
            </div>
            <div className="mt-4 w-100" style={{ height: '30vh' }}>
              <form style={{ width: '60%' }}>
                <GlobalMultiSelect
                  label="Certifications"
                  data={certificationOptions || []}
                  selectedOptions={selectedOptions || []}
                  onChange={handleChangeCertifications}
                  onSelectAll={(data) => setSelectedOptions(data)}
                />
              </form>
              <div
                style={{ width: '60%' }}
                className="d-flex align-items-center flex-wrap gap-3 mt-4 "
              >
                {selectedOptions.length > 0 &&
                  selectedOptions.map((item, index) => (
                    <div
                      key={item.id}
                      className="d-flex align-items-center gap-2"
                      style={{
                        padding: '5px 8px',
                        backgroundColor: '#dedede',
                        borderRadius: '4px',
                      }}
                    >
                      <p
                        style={{
                          marginBottom: '0px',
                          color: '#005375',
                        }}
                      >
                        {item.name}
                      </p>
                      <div
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                          const dupArr = [...selectedOptions];
                          dupArr.splice(index, 1);
                          setSelectedOptions(dupArr);
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="17"
                          height="17"
                          viewBox="0 0 17 17"
                          fill="none"
                        >
                          <path
                            d="M12.2487 4.11133L4.08203 12.3347"
                            stroke="#A3A3A3"
                            strokeWidth="1.6125"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M4.08203 4.11133L12.2487 12.3347"
                            stroke="#A3A3A3"
                            strokeWidth="1.6125"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            <div className="buttons d-flex align-items-center justify-content-end mt-4">
              <button
                className="btn btn-link"
                // onClick={() => {
                //   if (
                //     selectedStaffs.length > 0 ||
                //     Object.keys(selectedPreferenceDropdown).length > 0
                //   ) {
                //     setCloseModal(true);
                //   } else {
                //     setAddPreferenceModal(false);
                //   }
                // }}
                onClick={() => setAddCertificationModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-md btn-primary"
                onClick={submitCertifications}
                disabled={buttonDisabled}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </section>
      {showModel === true ? (
        <SuccessPopUpModal
          title="Success!"
          message="Drive Certifications added."
          modalPopUp={showModel}
          isNavigate={true}
          setModalPopUp={setShowModel}
          showActionBtns={true}
          onConfirm={() => {
            getDriveData(id);
            setShowModel(false);
          }}
        />
      ) : null}
    </>
  );
}

export default CertificationsSection;
