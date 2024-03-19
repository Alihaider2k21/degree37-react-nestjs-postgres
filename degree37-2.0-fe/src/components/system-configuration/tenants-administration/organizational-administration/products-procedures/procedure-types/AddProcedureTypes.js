import React, { useEffect, useState } from 'react';
import TopBar from '../../../../../common/topbar/index';
import jwt from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import SvgComponent from '../../../../../common/SvgComponent';
import styles from './index.module.scss';
import { toast } from 'react-toastify';
import CancelIconImage from '../../../../../../assets/images/ConfirmCancelIcon.png';
import SuccessPopUpModal from '../../../../../common/successModal';
import { makeAuthorizedApiRequestAxios } from '../../../../../../helpers/Api';
import GlobalMultiSelect from '../../../../../common/GlobalMultiSelect';
import { ProductsProceduresBreadCrumbsData } from '../ProductsProceduresBreadCrumbsData';

const AddProcedureTypes = () => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [productQuantities, setProductQuantities] = useState({});
  const [id, setId] = useState('');
  const [products, setProducts] = useState([]);
  const [procedureTypesProducts, setProcedureTypesProducts] = useState([]);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [archiveSuccess, setArchiveSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    short_description: '',
    description: '',
    is_active: true,
    is_goal_type: false,
    is_generate_online_appointments: false,
    procedure_duration: null,
    procedure_types_products: [],
    created_by: +id,
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const jwtToken = localStorage.getItem('token');
    if (jwtToken) {
      const decodeToken = jwt(jwtToken);
      if (decodeToken?.id) {
        setId(decodeToken?.id);

        // Update formData with the correct user ID
        setFormData((prevFormData) => ({
          ...prevFormData,
          created_by: +decodeToken.id,
        }));
      }
    }

    const updatedProcedureTypesProducts = selectedProducts.map((product) => ({
      product_id: parseInt(product.id),
      quantity: parseFloat(productQuantities[product.id]) || 1,
    }));

    setProcedureTypesProducts(updatedProcedureTypesProducts);
    fetchProducts(); // Fetch products after setting the user ID
  }, [selectedProducts, productQuantities]);

  const fetchProducts = async () => {
    const response = await makeAuthorizedApiRequestAxios(
      'GET',
      `${BASE_URL}/products?status=true`
    );
    const data = response.data;
    setProducts(data?.data); // Update the state with the fetched product data
  };

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

  const removeProduct = (product) => {
    setSelectedProducts((prevSelected) =>
      prevSelected.filter((item) => item.id !== product.id)
    );

    setProductQuantities((prevQuantities) => {
      const updatedQuantities = { ...prevQuantities };
      delete updatedQuantities[product.id];
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

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    if (name === 'procedure_duration') {
      const fieldValue = value;

      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: fieldValue,
      }));
      setUnsavedChanges(true);
    } else {
      const fieldValue = type === 'checkbox' ? checked : value;

      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: fieldValue,
      }));
      setUnsavedChanges(true);
    }
  };

  const validateField = (name, value) => {
    if (name === 'procedure_duration' && value > 50000) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [name]: `Procedure Duration should be less than 50000.`,
      }));
    } else if (name === 'procedure_duration' && value <= 0) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [name]: `Procedure Duration should be greater than 0.`,
      }));
    } else if (!value) {
      const errorMessage =
        name == 'name'
          ? 'Name is required.'
          : name == 'short_description'
          ? 'Short description is required.'
          : name == 'description'
          ? 'Description is required.'
          : 'Procedure duration is required.';
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [name]: errorMessage,
      }));
    } else {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [name]: '',
      }));
    }
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};
    setFormErrors(errors);

    // Validate required fields
    if (!formData.name) {
      errors.name = 'Name is required.';
    }
    if (!formData.short_description) {
      errors.short_description = 'Short description is required.';
    }
    if (!formData.description) {
      errors.description = 'Description is required.';
    }
    if (!formData.procedure_duration) {
      errors.procedure_duration = 'Procedure duration is required.';
    }
    // if(formData.procedure_duration > 50000)
    // {
    //   errors.procedure_duration = "minutes should be less than 50000";
    // }

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return; // Exit the function if there are errors
    }

    const body = {
      name: formData.name,
      short_description: formData.short_description,
      description: formData.description,
      is_active: formData.is_active,
      is_goal_type: formData.is_goal_type,
      is_generate_online_appointments: formData.is_generate_online_appointments,
      procedure_duration: formData.procedure_duration,
      procedure_types_products: procedureTypesProducts, // Use procedureTypesProducts directly here
      created_by: +id,
    };
    try {
      setIsSubmitting(true);
      const response = await makeAuthorizedApiRequestAxios(
        'POST',
        `${BASE_URL}/procedure_types`,
        JSON.stringify(body)
      );
      let data = response.data;
      if (data?.status === 'success') {
        setArchiveSuccess(true);
        setIsSubmitting(false);
      } else if (response?.status === 400) {
        toast.error(`${data?.message?.[0] ?? data?.response}`, {
          autoClose: 3000,
        });
        setIsSubmitting(false);
      } else {
        toast.error(`${data?.message?.[0] ?? data?.response}`, {
          autoClose: 3000,
        });
        setIsSubmitting(false);
      }
    } catch (error) {
      toast.error(`${error?.message}`, { autoClose: 3000 });
      setIsSubmitting(false);
    }
  };

  const BreadcrumbsData = [
    ...ProductsProceduresBreadCrumbsData,
    {
      label: 'Create Procedure Type',
      class: 'disable-label',
      link: '/system-configuration/tenant-admin/organization-admin/procedures-types/create',
    },
  ];

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

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Procedure Type'}
        SearchPlaceholder={null}
        SearchValue={null}
        SearchOnChange={null}
      />
      <div className={`mainContentInner form-container ${styles.height}`}>
        <form className={styles.procedureTypesForm}>
          <div className="formGroup">
            <h5>Create Procedure Type</h5>
            <div className="form-field">
              <div className="field">
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  placeholder=" "
                  required
                  value={formData.name}
                  onChange={(e) => {
                    handleInputChange(e);
                    handleBlur(e);
                  }}
                  onBlur={handleBlur}
                />

                <label>Name*</label>
              </div>
              {formErrors.name && (
                <div className="error">
                  <p>{formErrors.name}</p>
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
                  required
                  value={formData.short_description}
                  onChange={(e) => {
                    handleInputChange(e);
                    handleBlur(e);
                  }}
                  onBlur={handleBlur}
                />

                <label>Short Description*</label>
              </div>
              {formErrors.short_description && (
                <div className="error">
                  <p>{formErrors.short_description}</p>
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
                  value={formData.description}
                  onChange={(e) => {
                    handleInputChange(e);
                    handleBlur(e);
                  }}
                  onBlur={handleBlur}
                />
                <label>Description*</label>
              </div>
              {formErrors.description && (
                <div className="error">
                  <p>{formErrors.description}</p>
                </div>
              )}
            </div>
            <div className="form-field checkbox">
              <span className="toggle-text">
                {formData?.is_active ? 'Active' : 'Inactive'}
              </span>
              <label htmlFor="toggle" className="switch">
                <input
                  type="checkbox"
                  id="toggle"
                  className="toggle-input"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
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
                  checked={formData.is_goal_type}
                  onChange={handleInputChange}
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
                  checked={formData.is_generate_online_appointments}
                  onChange={handleInputChange}
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
                data={products}
                selectedOptions={selectedProducts}
                onChange={handleProductToggle}
                onSelectAll={handleProductChangeAll}
                isquantity={false}
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
                  onBlur={handleBlur}
                  value={formData.procedure_duration}
                  onChange={(e) => {
                    handleInputChange(e);
                    handleBlur(e);
                  }}
                />
                <label>Procedure Duration (Minutes)*</label>
              </div>
              {formErrors.procedure_duration && (
                <div className="error">
                  <p>{formErrors.procedure_duration}</p>
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
        <div className="form-footer">
          <button className="btn btn-secondary" onClick={handleCancelClick}>
            Cancel
          </button>

          <button
            type="button"
            className={` ${`btn btn-primary`}`}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            Create
          </button>
        </div>
        <SuccessPopUpModal
          title="Success!"
          message="Procedure Type created."
          modalPopUp={archiveSuccess}
          isNavigate={true}
          setModalPopUp={setArchiveSuccess}
          showActionBtns={true}
          redirectPath={
            '/system-configuration/tenant-admin/organization-admin/procedures-types'
          }
        />
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
      </div>
    </div>
  );
};

export default AddProcedureTypes;
