import React, { useState, useEffect } from 'react';
import TopBar from '../../../../../common/topbar/index';
import { useNavigate } from 'react-router-dom';
import styles from './procedures.module.scss';
import SvgComponent from '../../../../../common/SvgComponent';
import { toast } from 'react-toastify';
import jwt from 'jwt-decode';
import CancelIconImage from '../../../../../../assets/images/ConfirmCancelIcon.png';
import SuccessPopUpModal from '../../../../../common/successModal';
import { makeAuthorizedApiRequest } from '../../../../../../helpers/Api';
import GlobalMultiSelect from '../../../../../common/GlobalMultiSelect';
import SelectDropdown from '../../../../../common/selectDropdown';
import { ProductsProceduresBreadCrumbsData } from '../ProductsProceduresBreadCrumbsData';

const AddProcedures = () => {
  const navigate = useNavigate();
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [productQuantities, setProductQuantities] = useState({});
  const [procedureName, setProcedureName] = useState('');
  const [procedureType, setProcedureType] = useState(null);
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [createdSuccess, setCreatedSuccess] = useState(false);

  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [id, setId] = useState('');

  const [productsData, setProductsData] = useState([]);
  const [procedureTypeData, setProcedureTypeData] = useState([]);
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

  useEffect(() => {
    const jwtToken = localStorage.getItem('token');
    if (jwtToken) {
      const decodeToken = jwt(jwtToken);
      if (decodeToken?.id) {
        setId(decodeToken?.id);
      }
    }

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
  }, [BASE_URL]);
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
  const handleSubmit = async (e) => {
    const errObject = validateForm();
    if (Object.values(errObject).every((value) => value == '')) {
      e.preventDefault();
      // Assuming you have the base URL in an environment variable named "BASE_URL"
      try {
        const procedure_products = selectedProducts.map(({ id, quantity }) => {
          const qty = parseFloat(quantity);
          if (!quantity && id) {
            return { product_id: parseInt(id), quantity: +1 }; // Add default quantity of 1 if it's not present and there is an id
          }
          return { product_id: parseInt(id), quantity: qty };
        });
        const body = {
          name: procedureName,
          procedure_type_id: parseInt(procedureType.value),
          description: description,
          is_active: isActive,
          procedure_products: procedure_products,
          created_by: +id,
          credits: +credits,
        };
        const response = await makeAuthorizedApiRequest(
          'POST',
          `${BASE_URL}/procedures`,
          JSON.stringify(body)
        );
        let data = await response.json();
        if (data?.status === 'success') {
          // Handle successful response
          setCreatedSuccess(true);
        } else if (response?.status === 400) {
          // setModalPopUp(false);
          // const error = await response.json();
          toast.error(`${data?.message?.[0] ?? data?.response}`, {
            autoClose: 3000,
          });
          // Handle bad request
        } else {
          // const error = await response.json();
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

  const handleCreditsChange = (event) => {
    setUnsavedChanges(true);
    setCredits(event.target.value);
  };

  // Function to handle changes in the "Procedure Type" select field
  const handleProcedureTypeChange = (val) => {
    setUnsavedChanges(true);
    setProcedureType(val);
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
    setUnsavedChanges(true);
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

  const handleInputBlur = (e, config_name = null, state_name = null) => {
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

  const BreadcrumbsData = [
    ...ProductsProceduresBreadCrumbsData,
    {
      label: 'Create Procedure',
      class: 'disable-label',
      link: '/system-configuration/tenant-admin/organization-admin/procedures/create',
    },
  ];

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Procedures'}
        SearchPlaceholder={null}
        SearchValue={null}
        SearchOnChange={null}
      />
      <div className="mainContentInner form-container">
        <form className={styles.addAdminRoles}>
          <div className="formGroup">
            <h5>Create Procedure</h5>
            <div className="form-field">
              <div className="field">
                <input
                  type="text"
                  className="form-control"
                  name="procedure_name"
                  placeholder=" "
                  onChange={(e) => {
                    handleNameChange(e);
                    handleInputBlur(e);
                  }}
                  onBlur={handleInputBlur}
                  required
                />

                <label>Name*</label>
              </div>
              {errors.procedure_name && (
                <div className="error">
                  <p>{errors.procedure_name}</p>
                </div>
              )}
            </div>
            <SelectDropdown
              label="Procedure Type"
              options={procedureTypeData}
              selectedValue={procedureType}
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
                  onBlur={handleInputBlur}
                  onChange={(e) => {
                    handleDescriptionChange(e);
                    handleInputBlur(e);
                  }}
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
                  checked={isActive}
                  className="toggle-input"
                  name="is_active"
                  onChange={handleIsActiveChange}
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
                isquantity={false}
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
          title="Success!"
          message="Procedure created."
          modalPopUp={createdSuccess}
          isNavigate={true}
          setModalPopUp={setCreatedSuccess}
          showActionBtns={true}
          redirectPath={
            '/system-configuration/tenant-admin/organization-admin/procedures'
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

        <div className="form-footer">
          <button className="btn btn-secondary" onClick={handleCancelClick}>
            Cancel
          </button>

          <button
            type="button"
            className={`btn btn-primary`}
            onClick={handleSubmit}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProcedures;
