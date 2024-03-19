import React, { useState, useEffect } from 'react';
import TopBar from '../../../../../common/topbar/index';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './procedures.module.scss';
import SvgComponent from '../../../../../common/SvgComponent';
import { toast } from 'react-toastify';
import CancelIconImage from '../../../../../../assets/images/ConfirmCancelIcon.png';
import jwtDecode from 'jwt-decode';
import SuccessPopUpModal from '../../../../../common/successModal';
import { makeAuthorizedApiRequest } from '../../../../../../helpers/Api';
import GlobalMultiSelect from '../../../../../common/GlobalMultiSelect';
import SelectDropdown from '../../../../../common/selectDropdown';
import { ProductsProceduresBreadCrumbsData } from '../ProductsProceduresBreadCrumbsData';

const ProceduresEdit = () => {
  const navigate = useNavigate();
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [productQuantities, setProductQuantities] = useState({});
  const [procedureName, setProcedureName] = useState('');
  const [procedureTypeChecked, setProcedureTypeChecked] = useState(null);
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(false);
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const { id } = useParams();
  const [archivePopup, setArchivePopup] = useState(false);
  const [productsData, setProductsData] = useState([]);
  const [procedureTypeData, setProcedureTypeData] = useState([]);
  const [archiveSuccess, setArchiveSuccess] = useState(false);
  const bearerToken = localStorage.getItem('token');

  const [errors, setErrors] = useState({
    description: '',
    procedure_name: '',
  });

  const [credits, setCredits] = useState('');

  const handleCancelClick = () => {
    if (unsavedChanges) {
      setShowConfirmationDialog(true);
    } else {
      navigate(
        '/system-configuration/tenant-admin/organization-admin/procedures'
      );
    }
  };

  const handleConfirmationResult = (confirmed) => {
    setShowConfirmationDialog(false);
    if (confirmed) {
      navigate(
        '/system-configuration/tenant-admin/organization-admin/procedures'
      );
    }
  };

  const handleInputBlur = (e, config_name = null, state_name = null) => {
    setUnsavedChanges(true);
    const { name, value } = e.target;
    let errorMessage = '';

    if (value.trim() === '') {
      errorMessage = 'required';
    }
    const setError = (fieldName, errorMsg) => {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [fieldName]: errorMsg,
      }));
    };

    switch (name) {
      case 'description':
        if (!value) {
          setError('description', 'Description is required.');
        } else if (value.length > 500) {
          setError('description', 'Maximum 500 characters are allowed');
        } else {
          setError('description', '');
        }
        break;

      case 'procedure_name':
        if (!value) {
          setError('procedure_name', 'Name is required.');
        } else if (value.length > 50) {
          setError('procedure_name', 'Maximum 50 characters are allowed');
        } else {
          setError('procedure_name', '');
        }
        break;

      case 'credits':
        if (!value) {
          setError('credits', 'Credits is required.');
        } else if (+value < 0 || +value > 999) {
          setError('credits', 'Credits value should be between 0 and 999');
        } else {
          setError('credits', '');
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
        const response = await makeAuthorizedApiRequest(
          'GET',
          `${BASE_URL}/products?status=true`
        );
        const data = await response.json();
        setProductsData(data?.data); // Update the state with the fetched product data
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    const fetchProcedureData = async () => {
      try {
        // Replace "YOUR_API_ENDPOINT" with the actual API endpoint to fetch products data
        const response = await makeAuthorizedApiRequest(
          'GET',
          `${BASE_URL}/procedure_types?status=true`
        );
        const data = await response.json();
        if (data?.status === 200) {
          let procedures = data?.data?.map((procedure) => ({
            label: procedure?.name,
            value: procedure?.id,
          }));
          setProcedureTypeData(procedures);
        }
      } catch (error) {
        console.error('Error procedures:', error);
      }
    };

    fetchProductsData();
    fetchProcedureData();

    const fetchFormData = async (id) => {
      if (id) {
        const result = await makeAuthorizedApiRequest(
          'GET',
          `${BASE_URL}/procedures/${id}`
        );
        let { data, status } = await result.json();
        if (status === 200 && data) {
          const procedureProducts = data.procedure_products.map((product) => {
            setProductQuantities((prevQuantities) => ({
              ...prevQuantities,
              [product.product_id]:
                prevQuantities[product.product_id] || product.quantity, // Set initial quantity to 1 when selected
            }));
            return {
              ...product.products,
              quantity: product.quantity,
            };
          });

          if (data?.procedure_type_id?.id) {
            setProcedureTypeChecked({
              label: data?.procedure_type_id?.name,
              value: data?.procedure_type_id?.id,
            });
          }

          setIsActive(data.is_active);
          setDescription(data.description);
          setProcedureName(data.name);
          setSelectedProducts(procedureProducts);
          setCredits(data.credits);
          // toast.success(message, { autoClose: 3000 });
        } else {
          toast.error('Error Fetching Procedure Details', { autoClose: 3000 });
        }
      } else {
        toast.error('Error Fetching Procedure Details', { autoClose: 3000 });
      }
    };

    if (id) {
      fetchFormData(id);
    }

    const handleBeforeUnload = (e) => {
      if (unsavedChanges) {
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
    await handleSubmit(e, false);
  };

  const saveAndClose = async (e) => {
    await handleSubmit(e, true);
  };
  const validateForm = () => {
    const copy = {
      ...errors,
      description: description
        ? description.length > 500
          ? 'Maximum 500 characters are allowed.'
          : ''
        : 'Description is required.',
      procedure_name: procedureName
        ? procedureName.length > 50
          ? 'Maximum 50 characters are allowed.'
          : ''
        : 'Name is required.',
      credits: credits
        ? +credits < 0 || +credits > 999
          ? 'Credits value should be between 0 and 999.'
          : ''
        : 'Credits is required.',
    };

    setErrors({ ...copy });
    return copy;
  };
  // Function to handle form submission
  const handleSubmit = async (e, redirect) => {
    const errObject = validateForm();
    if (Object.values(errObject).every((value) => value == '')) {
      e.preventDefault();
      // Assuming you have the base URL in an environment variable named "BASE_URL"
      try {
        const procedure_products = selectedProducts.map(({ id, quantity }) => {
          if (!quantity && id) {
            return { product_id: parseInt(id), quantity: 1 }; // Add default quantity of 1 if it's not present and there is an id
          }
          return { product_id: parseInt(id), quantity: parseFloat(quantity) };
        });
        const token = jwtDecode(localStorage.getItem('token'));
        const body = {
          name: procedureName,
          procedure_type_id: parseInt(procedureTypeChecked?.value),
          description: description,
          is_active: isActive,
          procedure_products: procedure_products,
          updated_by: +token?.id,
          credits: +credits,
        };
        const response = await fetch(`${BASE_URL}/procedures/${id}`, {
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
          if (redirect) {
            setShowSuccessDialog(true);
          } else {
            setShowSuccessMessage(true);
          }
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

  const handleNameChange = (event) => {
    setUnsavedChanges(true);
    setProcedureName(event.target.value);
  };

  // Function to handle changes in the "Procedure Type" select field
  const handleProcedureTypeChange = (value) => {
    setUnsavedChanges(true);
    setProcedureTypeChecked(value);
  };

  // Function to handle changes in the "Description" textarea field
  const handleDescriptionChange = (event) => {
    setUnsavedChanges(true);
    setDescription(event.target.value);
  };

  // Function to handle changes in the "Active/Inactive" checkbox
  const handleIsActiveChange = (event) => {
    setUnsavedChanges(true);
    setIsActive(event.target.checked);
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

  const handleCreditsChange = (event) => {
    setUnsavedChanges(true);
    setCredits(event.target.value);
  };

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
      label: 'Edit Procedure',
      class: 'disable-label',
      link: `/system-configuration/tenant-admin/organization-admin/procedures/${id}/edit`,
    },
  ];
  const handleConfirmArchive = async () => {
    try {
      const response = await makeAuthorizedApiRequest(
        'PATCH',
        `${BASE_URL}/procedures/${id}`
      );
      const { status_code, status } = await response.json();

      if (status_code === 204 && status === 'Success') {
        setArchivePopup(false);
        setTimeout(() => {
          setArchiveSuccess(true);
        }, 1000);
      } else {
        toast.error('Error Archiving Procedure Types', { autoClose: 3000 });
      }
    } catch (error) {
      console.error('Error archiving data:', error);
    }

    setArchivePopup(false);
  };
  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Procedures'}
        SearchPlaceholder={null}
        SearchValue={null}
        SearchOnChange={null}
      />
      <div className="mainContentInner">
        <form className={styles.addAdminRoles}>
          <div className="formGroup">
            <h5>Edit Procedure</h5>

            <div className="form-field">
              <div className="field">
                <input
                  type="text"
                  className="form-control"
                  name="procedure_name"
                  placeholder=" "
                  disabled={true}
                  onChange={(e) => {
                    handleNameChange(e);
                    handleInputBlur(e);
                  }}
                  value={procedureName}
                  onBlur={handleInputBlur}
                  required
                />

                <label>Name*</label>
                {errors.procedure_name && (
                  <div className="error">
                    <p>{errors.procedure_name}</p>
                  </div>
                )}
              </div>
            </div>
            <SelectDropdown
              label="Procedure Type"
              options={procedureTypeData}
              selectedValue={procedureTypeChecked}
              onChange={(val) => {
                handleProcedureTypeChange(val);
              }}
              removeDivider
              showLabel
              placeholder="Procedure Type"
            />
            <div className="form-field textarea w-100">
              <div className="field">
                <textarea
                  type="text"
                  className="form-control textarea"
                  placeholder=" "
                  name="description"
                  disabled={true}
                  value={description}
                  onChange={(e) => {
                    handleDescriptionChange(e);
                    handleInputBlur(e);
                  }}
                  onBlur={handleInputBlur}
                  required
                />
                <label>Description*</label>
              </div>
              {errors.description && (
                <div className="error">
                  <p>{errors.description}</p>
                </div>
              )}
            </div>

            <div className="form-field">
              <div className="field">
                <input
                  type="number"
                  min={0}
                  max={999}
                  className="form-control"
                  value={credits}
                  name="credits"
                  placeholder=" "
                  onChange={(e) => {
                    handleCreditsChange(e);
                    handleInputBlur(e);
                  }}
                  onBlur={handleInputBlur}
                />

                <label>Credit</label>
              </div>
              {errors.credits && (
                <div className="error">
                  <p>{errors.credits}</p>
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

            <p className="w-100">Yield</p>
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
            <div className="w-50"></div>
            <div className="form-field selectTags">
              <div className="selectTagsData">
                <ul>
                  {selectedProducts.map((product) => (
                    <li key={product.id}>
                      <div className={`tag ${styles.checkBoxTags}`}>
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
                          pattern="^\d*$"
                          className="custom-input"
                          value={productQuantities[product.id] || ''}
                          onChange={(e) => {
                            const newValue = e.target.value;
                            const inputPattern = /^\d*$/;

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

        {/* Confirmation Dialog */}
        <SuccessPopUpModal
          title="Confirmation"
          message={'Are you sure you want to archive?'}
          modalPopUp={archivePopup}
          setModalPopUp={setArchivePopup}
          showActionBtns={false}
          isArchived={true}
          archived={handleConfirmArchive}
        />
        <SuccessPopUpModal
          title="Success!"
          message="Procedure is archived."
          modalPopUp={archiveSuccess}
          isNavigate={true}
          setModalPopUp={setArchiveSuccess}
          showActionBtns={true}
          redirectPath={
            '/system-configuration/tenant-admin/organization-admin/procedures'
          }
        />
        <SuccessPopUpModal
          title="Success!"
          message="Procedure updated."
          modalPopUp={showSuccessDialog}
          isNavigate={true}
          setModalPopUp={setShowSuccessDialog}
          showActionBtns={true}
          redirectPath={
            '/system-configuration/tenant-admin/organization-admin/procedures'
          }
        />
        <SuccessPopUpModal
          title="Success!"
          message="Procedure updated."
          modalPopUp={showSuccessMessage}
          isNavigate={true}
          setModalPopUp={setShowSuccessMessage}
          showActionBtns={true}
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

        <div className="form-footer">
          <div
            onClick={() => {
              setArchivePopup(true);
            }}
            className="archived"
          >
            <span>Archive</span>
          </div>
          <button
            className="btn btn-secondary border-0"
            onClick={handleCancelClick}
          >
            Cancel
          </button>

          <button
            className={`btn btn-md me-4 ${styles.saveandclose} ${styles.createbtn}  btn-secondary`}
            onClick={saveAndClose}
          >
            Save & Close
          </button>
          <button
            type="button"
            className={` ${`btn btn-primary btn btn-md me-4 ${styles.createbtn}`}`}
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
