import React, { useState, useEffect } from 'react';
import TopBar from '../../../../../common/topbar/index';
import { useNavigate, useParams } from 'react-router-dom';
import SvgComponent from '../../../../../common/SvgComponent';
import { toast } from 'react-toastify';
import styles from './index.module.scss';
import CancelIconImage from '../../../../../../assets/images/ConfirmCancelIcon.png';
import jwtDecode from 'jwt-decode';
import SuccessPopUpModal from '../../../../../common/successModal';
import { makeAuthorizedApiRequestAxios } from '../../../../../../helpers/Api';
import GlobalMultiSelect from '../../../../../common/GlobalMultiSelect';
import { ProductsProceduresBreadCrumbsData } from '../ProductsProceduresBreadCrumbsData';
import axios from 'axios';

const ProceduresEdit = () => {
  const navigate = useNavigate();
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [productQuantities, setProductQuantities] = useState({});
  const [name, setName] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [isGoalType, setIsGoalType] = useState(false);
  const [isGenerateOnlineAppointment, setIsGenerateOnlineAppointment] =
    useState(false);
  const [procedureDuration, setProcedureDuration] = useState(false);
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const { id } = useParams();
  const [modalPopUp, setModalPopUp] = useState(false);
  const [productsData, setProductsData] = useState([]);
  const [archiveSuccess, setArchiveSuccess] = useState(false);
  const [editSuccess, setEditSuccess] = useState(false);
  const [redirectToMainScreen, setRedirectToMainScreen] = useState(false);
  const [archivePopup, setArchivePopup] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    short_description: '',
    description: '',
    procedure_duration: '',
  });
  const bearerToken = localStorage.getItem('token');

  const handleCancelClick = () => {
    if (unsavedChanges) {
      setShowConfirmationDialog(true);
    } else {
      navigate(
        '/system-configuration/tenant-admin/organization-admin/procedures-types'
      );
    }
  };

  const handleConfirmationResult = (confirmed) => {
    setShowConfirmationDialog(false);
    if (confirmed) {
      navigate(
        '/system-configuration/tenant-admin/organization-admin/procedures-types'
      );
    }
  };

  const handleInputBlur = (e) => {
    setUnsavedChanges(true);
    const { name, value } = e.target;
    let errorMessage = '';

    if (value.trim() === '') {
      errorMessage = 'required.';
    }
    const setError = (fieldName, errorMsg) => {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [fieldName]: errorMsg,
      }));
    };

    switch (name) {
      case 'name':
        if (!value) {
          setError('name', 'Procedure name is required.');
        } else {
          setError('name', '');
        }
        break;

      case 'short_description':
        if (!value) {
          setError('short_description', 'Short description is required.');
        } else {
          setError('short_description', '');
        }
        break;

      case 'description':
        if (!value) {
          setError('description', 'Description is required.');
        } else {
          setError('description', '');
        }
        break;

      case 'procedure_duration':
        if (!value) {
          setError('procedure_duration', 'Procedure duration is required.');
        } else if (value > 50000) {
          setError(
            'procedure_duration',
            'Procedure Duration should be less than 50000.'
          );
        } else if (value <= 0) {
          setError(
            'procedure_duration',
            'Procedure Duration should not be less than 0.'
          );
        } else {
          setError('procedure_duration', '');
        }
        break;

      default:
        setError(name, errorMessage);
        break;
    }
  };

  useEffect(() => {
    const fetchProductsData = async () => {
      try {
        // Replace "YOUR_API_ENDPOINT" with the actual API endpoint to fetch products data
        const response = await makeAuthorizedApiRequestAxios(
          'GET',
          `${BASE_URL}/products?status=true`
        );
        const data = response.data;
        setProductsData(data?.data); // Update the state with the fetched product data
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProductsData();

    const fetchFormData = async (id) => {
      if (id) {
        const response = await axios.get(`${BASE_URL}/procedure_types/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${bearerToken}`,
          },
        });

        const { data, status } = response.data;
        if (status === 200 && data) {
          const procedureTypesProducts = data.procedure_types_products.map(
            (product) => {
              setProductQuantities((prevQuantities) => ({
                ...prevQuantities,
                [product.product_id]:
                  prevQuantities[product.product_id] || product.quantity, // Set initial quantity to 1 when selected
              }));
              return {
                ...product.products,
                quantity: product.quantity,
              };
            }
          );

          setName(data.name);
          setShortDescription(data.short_description);
          setDescription(data.description);
          setIsActive(data.is_active);
          setIsGoalType(data.is_goal_type);
          setIsGenerateOnlineAppointment(data.is_generate_online_appointments);
          setProcedureDuration(data.procedure_duration);
          setSelectedProducts(procedureTypesProducts);
          // toast.success(message, { autoClose: 3000 });
        } else {
          toast.error('Error Fetching Procedure Details', { autoClose: 3000 });
        }
      } else {
        toast.error('Error getting Procedure Details', { autoClose: 3000 });
      }
    };

    if (id) {
      fetchFormData(id);
    }

    // Add a cleanup function to remove the event listener when the component is unmounted
    const handleBeforeUnload = (e) => {
      if (unsavedChanges) {
        // Show a generic message to prevent the user from accidentally leaving the page
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const saveChanges = async (e) => {
    await handleSubmit(e);
  };

  const saveAndClose = async (e) => {
    await handleSubmit(e);
    setRedirectToMainScreen(true);
  };

  // Function to handle form submission
  const handleSubmit = async (e, redirect = false) => {
    if (Object.values(errors).every((value) => value == '')) {
      e.preventDefault();
      // Assuming you have the base URL in an environment variable named "BASE_URL"
      try {
        const procedure_types_products = selectedProducts.map(
          ({ id, quantity }) => {
            if (!quantity && id) {
              return { product_id: parseInt(id), quantity: 1 }; // Add default quantity of 1 if it's not present and there is an id
            }
            return { product_id: parseInt(id), quantity: parseFloat(quantity) };
          }
        );
        const token = jwtDecode(localStorage.getItem('token'));
        const body = {
          name: name,
          short_description: shortDescription,
          description: description,
          is_goal_type: isGoalType,
          is_generate_online_appointments: isGenerateOnlineAppointment,
          is_active: isActive,
          procedure_duration: procedureDuration,
          procedure_types_products: procedure_types_products,
          updated_by: +token.id,
        };
        const response = await fetch(`${BASE_URL}/procedure_types/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            method: 'PUT',
            authorization: `Bearer ${bearerToken}`,
          },
          body: JSON.stringify(body),
        });
        let data = await response.json();
        if (data?.status === 'Success' && data?.status_code === 204) {
          // Handle successful response
          setEditSuccess(true);
          // navigate("/system-configuration/tenant-admin/organization-admin/procedures");
        } else if (data?.status_code === 400) {
          toast.error(`${data?.message?.[0] ?? data?.response}`, {
            autoClose: 3000,
          });
        } else {
          toast.error(`${data?.message?.[0] ?? data?.response}`, {
            autoClose: 3000,
          });
        }
      } catch (error) {
        toast.error(`${error?.message}`, { autoClose: 3000 });
      }
    }
  };

  // Function to handle Form changes
  const handleNameChange = (event) => {
    setUnsavedChanges(true);
    setName(event.target.value);
  };

  const handleShortDescriptionChange = (event) => {
    setUnsavedChanges(true);
    setShortDescription(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setUnsavedChanges(true);
    setDescription(event.target.value);
  };

  const handleIsActiveChange = (event) => {
    setUnsavedChanges(true);
    setIsActive(event.target.checked);
  };

  const handleIsGoalTypeChange = (event) => {
    setUnsavedChanges(true);
    setIsGoalType(event.target.checked);
  };

  const handleIsOnlineAppointmentChange = (event) => {
    setUnsavedChanges(true);
    setIsGenerateOnlineAppointment(event.target.checked);
  };

  const handleProcedureDuration = (event) => {
    setUnsavedChanges(true);
    setProcedureDuration(event.target.value);
  };
  // Function to handle Form changes

  const handleProductToggle = (product) => {
    setUnsavedChanges(true);
    const productId = parseInt(product.id);
    setSelectedProducts((prevSelected) => {
      const isSelected = prevSelected.some(
        (item) => parseInt(item.id) === productId
      );
      if (isSelected) {
        // Remove the product and its quantity
        const updatedSelected = prevSelected.filter(
          (item) => parseInt(item.id) !== productId
        );
        setProductQuantities((prevQuantities) => {
          const { [productId]: _, ...updatedQuantities } = prevQuantities;
          return updatedQuantities;
        });
        return updatedSelected;
      } else {
        // Add the product and set initial quantity to 1 when selected
        setProductQuantities((prevQuantities) => ({
          ...prevQuantities,
          [productId]: 1,
        }));
        return [...prevSelected, product];
      }
    });
  };

  const handleProductChangeAll = (data) => {
    setSelectedProducts(data);
    data.map((product) => {
      setProductQuantities((prevQuantities) => ({
        ...prevQuantities,
        [product.id]: 1, // Set initial quantity to 1 when selected
      }));
    });
  };

  const handleQuantityChange = (product, newQuantity) => {
    setUnsavedChanges(true);
    if (newQuantity <= 0) {
      setProductQuantities((prevQuantities) => {
        const updatedQuantities = { ...prevQuantities };
        delete updatedQuantities[product.id];
        return updatedQuantities;
      });

      setSelectedProducts((prevSelected) =>
        prevSelected.map((item) =>
          item.id === product.id ? { ...item, quantity: 1 } : item
        )
      );
    } else {
      setSelectedProducts((prevSelected) =>
        prevSelected.map((item) =>
          item.id === product.id ? { ...item, quantity: newQuantity } : item
        )
      );

      setProductQuantities((prevQuantities) => ({
        ...prevQuantities,
        [product.id]: newQuantity,
      }));
    }
  };

  console.log('Product Qty', JSON.stringify(productQuantities));

  const removeProduct = (product) => {
    setUnsavedChanges(true);
    const productId = parseInt(product.id);
    setSelectedProducts((prevSelected) =>
      prevSelected.some((item) => parseInt(item.id) === productId)
        ? prevSelected.filter((item) => parseInt(item.id) !== productId)
        : [...prevSelected, product]
    );

    setProductQuantities((prevQuantities) => {
      const updatedQuantities = { ...prevQuantities };
      delete updatedQuantities[parseInt(product.id)];
      return updatedQuantities;
    });
  };

  const calculateTotalQuantity = () => {
    let totalQuantity = 0;
    selectedProducts.forEach((product) => {
      const quantity = parseFloat(productQuantities[parseInt(product.id)]) || 0;
      totalQuantity += quantity;
    });
    return totalQuantity;
  };

  const BreadcrumbsData = [
    ...ProductsProceduresBreadCrumbsData,
    {
      label: 'Edit Procedures',
      class: 'disable-label',
      link: `/system-configuration/tenant-admin/organization-admin/procedures-types/${id}/edit`,
    },
  ];
  const confirmArchive = async () => {
    try {
      const response = await fetch(`${BASE_URL}/procedure_types/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${bearerToken}`,
        },
      });
      const { status_code, status } = await response.json();
      if (status_code === 204 && status === 'Success') {
        setArchivePopup(false);
        setTimeout(() => {
          setArchiveSuccess(true);
        }, 600);
      } else {
        setArchivePopup(false);
        toast.error('Error Archiving Procedure Types', { autoClose: 3000 });
      }
    } catch (error) {
      setArchivePopup(false);
      console.error('Error archiving data:', error);
    }
  };
  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Procedure Types'}
        SearchPlaceholder={null}
        SearchValue={null}
        SearchOnChange={null}
      />
      <div className={`mainContentInner form-container ${styles.height}`}>
        <form className={styles.procedureTypesForm}>
          <div className="formGroup">
            <h5>Edit Procedure Types</h5>
            <div className="form-field">
              <div className="field">
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  placeholder=" "
                  value={name}
                  required
                  onChange={(e) => {
                    handleNameChange(e);
                    handleInputBlur(e);
                  }}
                  onBlur={handleInputBlur}
                />
                <label>Name*</label>
              </div>
              {errors.name && (
                <div className="error">
                  <p>{errors.name}</p>
                </div>
              )}
            </div>
            <div className="form-field">
              <div className="field">
                <input
                  type="text"
                  className="form-control"
                  name="short_description"
                  placeholder=" "
                  value={shortDescription}
                  required
                  onChange={(e) => {
                    handleShortDescriptionChange(e);
                    handleInputBlur(e);
                  }}
                  onBlur={handleInputBlur}
                />

                <label>Short Description*</label>
              </div>
              {errors.short_description && (
                <div className="error">
                  <p>{errors.short_description}</p>
                </div>
              )}
            </div>
            <div className="form-field w-100 textarea">
              <div className="field">
                <textarea
                  type="text"
                  className="form-control textarea"
                  placeholder=" "
                  name="description"
                  required
                  value={description}
                  onChange={(e) => {
                    handleDescriptionChange(e);
                    handleInputBlur(e);
                  }}
                  onBlur={handleInputBlur}
                />
                <label>Description*</label>
              </div>
              {errors.description && (
                <div className="error">
                  <p>{errors.description}</p>
                </div>
              )}
            </div>
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
                  onChange={handleIsActiveChange}
                  checked={isActive}
                />
                <span className="slider round"></span>
              </label>
            </div>
            <div className={`${styles.group} w-100`}>
              <div className="form-field checkbox">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="is_goal_type"
                  name="is_goal_type"
                  checked={isGoalType}
                  onChange={handleIsGoalTypeChange}
                />
                <label className="form-check-label" htmlFor="is_goal_type">
                  Goal Type
                </label>
              </div>
              <div className="form-field checkbox">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="is_generate_online_appointments"
                  id="is_generate_online_appointments"
                  checked={isGenerateOnlineAppointment}
                  onChange={handleIsOnlineAppointmentChange}
                />
                <label
                  className="form-check-label"
                  htmlFor="is_generate_online_appointments"
                >
                  Generate Online Appointments.
                </label>
              </div>
            </div>
            <div className={`form-field w-100 ${styles.smallHeading}`}>
              <p>Yield</p>
            </div>
            <div className="w-50">
              <GlobalMultiSelect
                label="Products"
                data={productsData}
                selectedOptions={selectedProducts}
                onChange={handleProductToggle}
                onSelectAll={handleProductChangeAll}
                quantity={calculateTotalQuantity()}
              />
            </div>
            <div className="form-field">
              <div className="field">
                <input
                  type="number"
                  className="form-control"
                  name="procedure_duration"
                  placeholder=" "
                  min={0}
                  required
                  value={procedureDuration}
                  onChange={(e) => {
                    handleProcedureDuration(e);
                    handleInputBlur(e);
                  }}
                  onBlur={handleInputBlur}
                />

                <label>Procedure Duration (Minutes)*</label>
              </div>
              {errors.procedure_duration && (
                <div className="error">
                  <p>{errors.procedure_duration}</p>
                </div>
              )}
            </div>
            <div className="form-field selectTags">
              <div className="selectTagsData">
                <ul>
                  {selectedProducts.map((product) => (
                    <li key={product.id}>
                      <div className="tag">
                        {product.name}
                        <span
                          onClick={() => removeProduct(product)}
                          style={{ cursor: 'pointer' }}
                        >
                          <SvgComponent name={'TagsCrossIcon'} />
                        </span>
                      </div>
                      <div className="buttons" style={{ marginBottom: '10px' }}>
                        <input
                          type="text"
                          pattern="^$|^\d*\.?\d{0,1}$"
                          className="custom-input"
                          value={productQuantities[product.id] || ''}
                          onChange={(e) => {
                            const newValue = e.target.value;
                            const inputPattern = /^$|^\d*\.?\d{0,1}$/;

                            if (inputPattern.test(newValue)) {
                              if (
                                newValue === '' ||
                                parseFloat(newValue) >= 0
                              ) {
                                handleQuantityChange(product, newValue);
                              }
                            }
                          }}
                          style={{
                            width: '50px',
                            textAlign: 'center',
                            height: '50px',
                            minHeight: '40px',
                            padding: '5px',
                          }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </form>
        <SuccessPopUpModal
          title="Confirmation"
          message={'Are you sure you want to archive?'}
          modalPopUp={archivePopup}
          setModalPopUp={setArchivePopup}
          showActionBtns={false}
          isArchived={true}
          archived={confirmArchive}
        />
        <SuccessPopUpModal
          title="Success!"
          message={'Procedure Type updated.'}
          modalPopUp={editSuccess}
          setModalPopUp={setEditSuccess}
          isNavigate={true}
          showActionBtns={true}
          redirectPath={
            redirectToMainScreen
              ? '/system-configuration/tenant-admin/organization-admin/procedures-types'
              : null
          }
        />
        <SuccessPopUpModal
          title="Success!"
          message="Procedure Type is archived."
          modalPopUp={archiveSuccess}
          isNavigate={true}
          setModalPopUp={setArchiveSuccess}
          showActionBtns={true}
          redirectPath={
            '/system-configuration/tenant-admin/organization-admin/procedures-types'
          }
        />
        {/* Confirmation Dialog */}
        <section
          className={`popup full-section ${
            showConfirmationDialog ? 'active' : ''
          }`}
        >
          <div className="popup-inner">
            <div className="icon">
              <img src={CancelIconImage} alt="CancelIcon" />
            </div>
            <div className="content">
              <h3>Confirmation</h3>
              <p>Unsaved changes will be lost. Do you want to continue?</p>
              <div className="buttons">
                <button
                  className="btn btn-secondary"
                  onClick={() => handleConfirmationResult(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => handleConfirmationResult(true)}
                >
                  Ok
                </button>
              </div>
            </div>
          </div>
        </section>
        <SuccessPopUpModal
          title="Confirmation"
          message={'Are you sure want to Archive?'}
          modalPopUp={modalPopUp}
          setModalPopUp={setModalPopUp}
          showActionBtns={false}
          isArchived={true}
          archived={confirmArchive}
        />
        <div className="form-footer">
          <div
            onClick={() => {
              setModalPopUp(true);
            }}
            className="archived"
          >
            <span>Archive</span>
          </div>
          <button
            className="btn btn-secondary btn-md border-0"
            onClick={handleCancelClick}
          >
            Cancel
          </button>

          <button
            type="button"
            className={`btn btn-md btn-primary`}
            onClick={saveAndClose}
          >
            Save & Close
          </button>

          <button
            type="button"
            className={`btn btn-md btn-secondary`}
            onClick={saveChanges}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProceduresEdit;
