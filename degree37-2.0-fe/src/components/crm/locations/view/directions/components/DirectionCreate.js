import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';
import { API } from '../../../../../../api/api-routes';
import SuccessIcon from '../../../../../../assets/success.svg';
import FormInput from '../../../../../common/form/FormInput';
import SelectDropdown from '../../../../../common/selectDropdown';
import './index.scss';
import ConfirmationIcon from '../../../../../../assets/images/confirmation-image.png';
import FormText from '../../../../../common/form/FormText';
import ConfirmModal from '../../../../../common/confirmModal';
import CancelModalPopUp from '../../../../../common/cancelModal';
// import ToolTip from './tooltip/index';
import handleInputChange from '../../../../../../helpers/handleInputChange';
import validateForm from '../../../../../../helpers/formValidation';

const initialErrors = {
  id: '',
  location: '',
  collection_operation: '',
  direction: '',
};
const BASE_URL = process.env.REACT_APP_BASE_URL;
const bearerToken = localStorage.getItem('token');
export default function DirectionCreate({ directionsListPath }) {
  const { locationId } = useParams();

  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [createdDirection, setCreateDirection] = useState(false); //mod
  const [closeModal, setCloseModal] = useState(false);
  const [collectionOperationData, setCollectionOperationData] = useState([]);
  const [errors, setErrors] = useState(initialErrors);
  const [createButton, setCreateButton] = useState(false);
  const [cordinatesA, setCordinatesA] = useState(null);
  const [cordinatesB, setCordinatesB] = useState(null);
  const [isActive, setIsActive] = useState(true);
  const [changed, setChanged] = useState(false);
  // const [distance, setDistance] = useState({
  //   miles: '',
  //   minutes: '',
  // });
  const [addDirectionData, setAddDirectionData] = useState({
    id: '',
    location: '',
    collection_operation: null,
    direction: '',
    miles: null,
    minutes: null,
    is_archived: true,
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchCollectionOperations();
    fetchLocation();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const isValid = validateForm(addDirectionData, fieldNames, setErrors);
    if (isValid) {
      setCreateButton(true);
      const body = {
        location_id: Number(locationId),
        collection_operation_id: Number(
          addDirectionData?.collection_operation?.value
        ),
        direction: addDirectionData.direction,
        miles: Number(addDirectionData.miles),
        minutes: Number(addDirectionData.minutes),
        is_active: isActive,
      };
      try {
        const res = await API.crm.location.directions.createDirection(body);
        if (res?.data?.status === 'success') {
          setCreateDirection(true);
        } else if (res?.data?.status !== 'success') {
          const showMessage = Array.isArray(res?.data?.message)
            ? res?.data?.response[0]
            : res?.data?.response;
          toast.error(`${showMessage}`, { autoClose: 3000 });
        }
      } catch (error) {
        toast.error(`${error?.message}`, { autoClose: 3000 });
      }
      setCreateButton(false);
      console.log('Form data submitted:', addDirectionData);
    }
  };

  const fieldNames = [
    {
      label: 'Collection Operation',
      name: 'collection_operation',
      required: true,
    },
    {
      label: 'Directions',
      name: 'direction',
      required: true,
      maxLength: 500,
    },
    {
      label: 'Miles',
      name: 'miles',
      required: true,
      shouldBeAPositiveInteger: true,
    },
    {
      label: 'Minutes',
      name: 'minutes',
      required: true,
      shouldBeAPositiveInteger: true,
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    handleInputChange(name, value, setAddDirectionData, fieldNames, setErrors);
    setChanged(true);
  };

  const fetchCollectionOperations = async () => {
    const result = await fetch(
      `${BASE_URL}/location/direction/collection_operations/list?location_id=${locationId}`,
      {
        headers: {
          method: 'GET',
          authorization: `Bearer ${bearerToken}`,
        },
      }
    );
    let { data } = await result.json();
    if (result.ok || result.status === 200) {
      let formatCollectionOperations = data?.map((operation) => ({
        label: operation?.name,
        value: operation?.id,
      }));
      setCollectionOperationData([...formatCollectionOperations]);
    } else {
      toast.error('Error Fetching Collection Operations', { autoClose: 3000 });
    }
  };
  useEffect(() => {
    console.log(
      'addDirectionData?.collection_operation?.value',
      addDirectionData?.collection_operation
    );
    if (addDirectionData?.collection_operation?.value) {
      fetch_collection_operation_facility(
        addDirectionData?.collection_operation?.value
      );
    }
  }, [addDirectionData?.collection_operation]);

  useEffect(() => {
    if (cordinatesA?.coordinates) {
      milesApi(cordinatesA.coordinates);
    }
  }, [cordinatesA]);

  useEffect(() => {
    const apiKey = process.env.REACT_APP_GOOGLE_MAP_API_KEY;
    if (!window.google || !window.google.maps) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.defer = true;
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  const fetch_collection_operation_facility = async (id) => {
    const result = await fetch(
      `${BASE_URL}/system-configuration/facilities/collection_operation/${id}`,
      {
        headers: {
          method: 'GET',
          authorization: `Bearer ${bearerToken}`,
        },
      }
    );
    let data = await result.json();
    console.log('hello');
    if (result.ok || result.status === 200) {
      console.log({ data });
      setCordinatesA(data[0]?.address);
    } else {
      toast.error('Error Fetching Collection Operations', {
        autoClose: 3000,
      });
    }
  };

  console.log({ cordinatesA });

  const convertIntoMiles = (metersValue) => {
    const metersInMile = 1609.34;
    const miles = metersValue / metersInMile;
    return miles;
  };

  const convertIntoMinutes = (secondsValue) => {
    const time = Math.ceil(secondsValue / 60);
    return time;
  };

  const milesApi = async (direction) => {
    const geocoder = new window.google.maps.DirectionsService();

    const request = {
      origin: {
        lat: cordinatesB.coordinates.x,
        lng: cordinatesB.coordinates.y,
      },
      destination: { lat: direction.x, lng: direction.y },
      travelMode: 'DRIVING',
    };
    console.log('coordinatesA', request.destination);
    console.log('coordinatesB', request?.origin);
    await new Promise((resolve, reject) => {
      window.google.maps.event.addListener(geocoder, 'ready', resolve);
      geocoder.route(request, function (result, status) {
        console.log('hello3', result);
        if (status === window.google.maps.DirectionsStatus.OK) {
          console.log('hello3.1');
          const distance = result?.routes?.map((item) => {
            return item?.legs?.map((legs) => {
              return {
                distance: legs?.distance?.value,
                time: legs?.duration?.value,
              };
            });
          });
          // console.log('hello4');
          const dist = convertIntoMiles(distance[0][0]?.distance);
          const mint = convertIntoMinutes(distance[0][0]?.time);
          // console.log('hello6');
          setAddDirectionData((prevValue) => ({
            ...prevValue,
            miles: dist,
            minutes: mint,
          }));
          // setDistance((prevValue) => ({
          //   ...prevValue,
          //   miles: dist,
          //   minutes: mint,
          // }));
          // You can extract information from the 'result' object as needed
        } else {
          // Handle the error
          console.error(status);
        }
      });
    });
  };

  const handleConfirmationResult = (confirmed) => {
    setShowConfirmationDialog(false);
    // if (confirmed) {
    //   navigate(
    //     '/system-configuration/tenant-admin/crm-admin/accounts/industry-categories'
    //   );
    // }
  };

  // const handleDropDownChange = async (name, val) => {
  //   setAddDirectionData({
  //     ...addDirectionData,
  //     [name]: val === null ? val : { label: val?.label, value: val?.value },
  //   });
  //   setErrors({ ...errors, [name]: '' });
  // };

  const handleCancelClick = () => {
    if (changed) setCloseModal(true);
    else navigate(-1);
  };
  const fetchLocation = async () => {
    API.crm.location
      .getLocation(locationId)
      .then(({ data }) => {
        setAddDirectionData({ ...addDirectionData, location: data.data });
        setCordinatesB(data.data.address);
      })
      .catch((er) => toast.error('Failed to fetch location'));
  };

  console.log({ cordinatesB });
  return (
    <>
      <section
        className={`popup full-section ${createdDirection ? 'active' : ''}`}
      >
        <div className="popup-inner">
          <div className="icon">
            <img className="bg-light" src={SuccessIcon} alt="SuccessIcon" />
          </div>
          <div className="content">
            <h3>Success!</h3>
            <p>Direction created.</p>
            <div className="buttons  ">
              <button
                className="btn btn-primary w-100"
                onClick={() => {
                  setCreateDirection(true);
                  navigate(`/crm/locations/${locationId}/directions`);
                }}
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      </section>
      <ConfirmModal
        showConfirmation={showConfirmationDialog}
        onCancel={() => handleConfirmationResult(false)}
        onConfirm={() => handleConfirmationResult(true)}
        icon={ConfirmationIcon}
        heading={'Confirmation'}
        description={
          'Are you sure you want to overwrite directions, miles and minutes for the location ?'
        }
      />
      <form className="mt-5" onSubmit={handleSubmit}>
        <div className="formGroup">
          <h5>Create Direction</h5>
          <div
            style={{
              width: '100%',
            }}
          >
            <FormInput
              label="Location"
              name="location"
              displayName="Location"
              value={addDirectionData.location?.name || ''}
              onChange={handleChange}
              required
              disabled={true}
              error={errors.location}
              onBlur={handleChange}
            />
          </div>
          <SelectDropdown
            placeholder={'Collection Operation*'}
            name="collection_operation"
            showLabel={true}
            selectedValue={addDirectionData?.collection_operation}
            onChange={(selectedOption) => {
              if (selectedOption === null) {
                console.log('hello');
                setAddDirectionData({
                  ...addDirectionData,
                  miles: '',
                  minutes: '',
                });
              }

              setAddDirectionData({
                ...addDirectionData,
                collection_operation: selectedOption,
              });
              setChanged(true);
            }}
            removeDivider
            options={collectionOperationData}
            error={errors.collection_operation}
          />

          <div style={{ marginBottom: '0px' }} className="w-100 form-field">
            <FormText
              name="direction"
              displayName="Directions*"
              value={addDirectionData.direction}
              error={errors.direction}
              classes={{ root: 'w-100' }}
              onChange={handleChange}
              onBlur={handleChange}
              required={false}
            />
            {errors.details && (
              <div className="error">
                <div className="error">
                  <p>{errors.details}</p>
                </div>
              </div>
            )}
          </div>

          <FormInput
            label="Miles"
            name="miles"
            displayName="Miles"
            value={addDirectionData?.miles?.toFixed(2)}
            onChange={handleChange}
            disabled={true}
            required
            type="number"
            error={errors.miles}
            onBlur={handleChange}
          />
          <FormInput
            label="Minutes"
            name="minutes"
            type="number"
            disabled={true}
            displayName="Minutes"
            value={addDirectionData.minutes}
            onChange={handleChange}
            error={errors.minutes}
            onBlur={handleChange}
            required={true}
          />
          <div className="form-field checkbox w-100">
            <span className="toggle-text">
              {isActive ? 'Active' : 'Inactive'}
            </span>
            <label htmlFor="toggle" className="switch">
              <input
                type="checkbox"
                id="toggle"
                className="toggle-input"
                name="is_active"
                checked={isActive}
                onChange={(event) => {
                  setIsActive(event.target.checked);
                }}
              />
              <span className="slider round"></span>
            </label>
          </div>
          {/* <div className="form-field mb-0 w-100 d-flex justify-content-end">
            <div
              className="field"
              onClick={() => {
                setShowConfirmationDialog(true);
              }}
            >
              <ToolTip
                text={
                  'Expiration Internal determines the number of months from start date that certification expires'
                }
              />
            </div>
          </div> */}
        </div>

        <div className={`form_footer`}>
          <div></div>
          <div>
            <CancelModalPopUp
              title="Confirmation"
              message="Unsaved changes will be lost, do you wish to proceed?"
              modalPopUp={closeModal}
              isNavigate={true}
              setModalPopUp={setCloseModal}
              redirectPath={-1}
            />
            <span
              className={`text-primary border-0 cursor-pointer cancel`}
              onClick={handleCancelClick}
            >
              Cancel
            </span>
            <button
              type="submit"
              className={`rounded  btn btn-primary py-0`}
              disabled={createButton}
            >
              Create
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
