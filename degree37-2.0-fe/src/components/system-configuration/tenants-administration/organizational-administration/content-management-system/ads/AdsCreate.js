import React, { useEffect, useState } from 'react';
import TopBar from '../../../../../common/topbar/index';
import styles from './index.module.scss';
import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import SuccessPopUpModal from '../../../../../common/successModal';
import CancelModalPopUp from '../../../../../common/cancelModal';
import { toast } from 'react-toastify';
import PreviewModal from '../../../../../common/previewModal';
import jwt from 'jwt-decode';
import { ContentManagementSystemBreadCrumbsData } from '../ContentManagementSystemBreadCrumbsData';
import SelectDropdown from '../../../../../common/selectDropdown';
import { urlRegex } from '../../../../../../helpers/Validation';
const MEDIUM_ADD_SIZE = '(650px)*(520px)';
const LARGE_ADD_SIZE = '(830px)*(440px)';
const SMALL_ADD_SIZE = '(270px)*(420px)';

const AWS = require('aws-sdk');
const AdsCreate = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [modalPopUp, setModalPopUp] = useState(false);
  const [previewPopUp, setPreviewPopUp] = useState(false);
  const [closeModal, setCloseModal] = useState(false);
  const [loader, setLoader] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [privewImg, setPreviewImg] = useState({
    path: '',
    index: null,
  });
  const [id, setId] = useState('');
  const bearerToken = localStorage.getItem('token');
  const [adsCreateData, setAdsCreateData] = useState({
    ad_type: null,
    display_order: '',
    image_name: '',
    redirect_url: '',
    title: '',
    details: '',
    image_url: '',
    is_active: true,
  });
  const [errors, setErrors] = useState({
    ad_type: '',
    display_order: null,
    image_name: '',
    redirect_url: '',
    image_url: '',
    title: '',
  });

  useEffect(() => {
    const jwtToken = localStorage.getItem('token');
    if (jwtToken) {
      const decodeToken = jwt(jwtToken);
      if (decodeToken?.id) {
        setId(decodeToken?.id);
      }
    }

    // eslint-disable-next-line
  }, []);
  const BreadcrumbsData = [
    ...ContentManagementSystemBreadCrumbsData,
    {
      label: 'Create Ad',
      class: 'disable-label',
      link: '/system-configuration/tenant-admin/organizational-admin/content-management-system/ads/list',
    },
  ];

  AWS.config.update({
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    region: process.env.REACT_APP_AWS_REGION,
  });

  const s3 = new AWS.S3();

  const handleFileInputClick = (e) => {
    e.preventDefault();
    const fileInput = document.getElementById('fileInput');
    fileInput.click();
  };

  const acceptUserFile = async (event) => {
    const file = event?.target?.files[0] ? event?.target?.files[0] : event;
    if (!file) return '';
    if (!file) return '';
    const fileSizeInBytes = file.size;
    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
    if (fileSizeInBytes > maxSizeInBytes) {
      document.getElementById('fileInput').value = '';
      return toast.error('File size exceeds the maximum limit (5MB)', {
        autoClose: 3000,
      });
    }
    const reader = new FileReader();
    const fileName = file?.name;
    const fileExtension = fileName?.split('.').pop().toLowerCase();

    if (
      fileExtension &&
      !(fileExtension === 'png' || fileExtension === 'jpg')
    ) {
      setAdsCreateData((prevData) => ({
        ...prevData,
        image_url: null,
      }));
      document.getElementById('fileInput').value = '';
      return toast.error('File format should be in jpg or png', {
        autoClose: 3000,
      });
    }
    const bufferPromise = new Promise((resolve, reject) => {
      reader.onload = () => {
        const buffer = reader.result;
        resolve(buffer);
      };

      reader.onerror = (error) => {
        reject(error);
      };
    });
    reader.readAsArrayBuffer(file);

    try {
      const buffer = await bufferPromise;

      const fileName = file.name;
      const fileType = file.type;

      const params = {
        Bucket: process.env.REACT_APP_AWS_BUCKET_NAME,
        Key: fileName,
        Body: buffer,
        ACL: 'public-read',
        ContentType: fileType,
      };

      const response = await s3
        .upload(params)
        .on('httpUploadProgress', () => {
          setLoader(true);
        })
        .promise();
      const uploadedFileUrl = response?.Location;
      if (uploadedFileUrl) {
        setLoader(false);
        setAdsCreateData((prevData) => ({
          ...prevData,
          image_url: uploadedFileUrl,
        }));
        setErrors((prevData) => ({
          ...prevData,
          image_url: '',
        }));
        document.getElementById('fileInput').value = '';
        return toast.success(`Image uploaded.`, {
          autoClose: 3000,
        });
      } else {
        return toast.error(`Image is required.`, { autoClose: 3000 });
      }
    } catch (error) {
      console.log('Error Uploading file', error);
      setLoader(false);
    }
  };
  const allowDrop = (ev) => {
    ev.preventDefault();
  };

  function titleCase(string) {
    return string[0].toUpperCase() + string.slice(1).toLowerCase();
  }

  const handleDrop = (ev) => {
    ev.preventDefault();
    const file = ev.dataTransfer.files[0];
    acceptUserFile(file);
  };
  const handleInputBlur = (e, config_name = null, state_name = null) => {
    // setUnsavedChanges(true);
    const { name, value } = e.target;
    let errorMessage = '';
    if (value === null || (typeof value === 'string' && value?.trim() === '')) {
      const errName = {
        ad_type: 'Add Type',
        display_order: 'Display Order',
        image_name: 'Image Name',
        redirect_url: 'URL',
      };
      errorMessage = `${errName[name]} is required.`;
    }
    const setError = (fieldName, errorMsg) => {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [fieldName]: errorMsg,
      }));
    };
    switch (name) {
      case 'ad_type':
        if (!value) {
          setError('ad_type', errorMessage);
        } else {
          setError('ad_type', '');
        }
        break;
      case 'redirect_url':
        if (value && !urlRegex.test(adsCreateData.redirect_url)) {
          setError(
            'redirect_url',
            'Please provide a correct URL e.g: www.example.com'
          );
        } else {
          setError('redirect_url', errorMessage);
        }
        break;
      case 'display_order':
        if (!value) {
          setError('display_order', errorMessage);
        } else if (value && +value < 0) {
          setError('display_order', 'Only positive value is allowed');
        } else {
          setError('display_order', '');
        }
        break;
      case 'image_name':
        if (!value) {
          setError('image_name', errorMessage);
        } else {
          setError('image_name', '');
        }
        break;
      default:
        if (config_name) {
          if (name === 'end_point_url') {
            if (!value || !urlRegex.test(value)) {
              errorMessage =
                'Please provide a correct endpoint URL, e.g: www.example.com';
            } else {
              errorMessage = '';
            }
          }

          setError(config_name, {
            ...errors[config_name],
            [name]: errorMessage,
          });
        } else if (state_name) {
          setError(state_name, errorMessage);
        } else {
          setError(name, errorMessage);
        }
        break;
    }
  };

  const handleFormInput = (event) => {
    const { value, name, checked } = event.target;
    const parsedValue = name === 'display_order' ? +value : value;
    if (parsedValue > 2147483647) {
      return;
    }
    if (name === 'is_active') {
      // const statusValue = checked ? "Active" : "Inactive";
      setAdsCreateData({ ...adsCreateData, [name]: checked });
    } else {
      setAdsCreateData({ ...adsCreateData, [name]: parsedValue });
      if (name === 'ad_type' && value?.value === 'Medium Ad') {
        setSelectedSize(MEDIUM_ADD_SIZE);
      } else if (name === 'ad_type' && value?.value === 'Large Ad') {
        setSelectedSize(LARGE_ADD_SIZE);
      } else {
        setSelectedSize(SMALL_ADD_SIZE);
      }
    }
  };

  const checkErrors = (name, value) => {
    // setUnsavedChanges(true);
    let errorMessage = '';
    if (
      value === null ||
      (typeof value === 'string' && value?.toString()?.trim() === '')
    ) {
      const errName = {
        ad_type: 'Add Type',
        display_order: 'Display Order',
        image_name: 'Image Name',
        image_url: 'Image',
        redirect_url: 'URL',
      };
      errorMessage = `${titleCase(errName[name])} is required.`;
    }

    switch (name) {
      case 'ad_type':
        if (!value) {
          return errorMessage;
        } else {
          return '';
        }
      case 'redirect_url':
        if (value && !urlRegex.test(adsCreateData.redirect_url)) {
          return 'Please provide a correct URL e.g: https://www.example.com';
        } else {
          return errorMessage;
        }
      case 'display_order':
        if (!value) {
          return errorMessage;
        } else if (value && +value < 0) {
          return 'Only positive value is allowed';
        } else {
          return '';
        }
      case 'image_name':
        if (!value) {
          return errorMessage;
        } else {
          return '';
        }
      default:
        return errorMessage;
    }
  };

  const validateForm = () => {
    const copy = {
      ...errors,
      ad_type: checkErrors('ad_type', adsCreateData.ad_type),
      display_order: checkErrors('display_order', adsCreateData.display_order),
      redirect_url: checkErrors('redirect_url', adsCreateData.redirect_url),
      image_name: checkErrors('image_name', adsCreateData.image_name),
      image_url: checkErrors('image_url', adsCreateData.image_url),
    };
    setErrors({ ...copy });
    return copy;
  };
  const handleSubmit = async (e) => {
    const errObject = validateForm();
    if (Object.values(errObject).every((value) => value == '' || !value)) {
      let body = {
        ...adsCreateData,
        ad_type: adsCreateData?.ad_type?.value,
        created_by: +id,
      };
      try {
        setIsSubmitting(true);
        const response = await fetch(`${BASE_URL}/ad`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${bearerToken}`,
          },
          body: JSON.stringify(body),
        });
        let data = await response.json();
        if (data.status === 'success') {
          setModalPopUp(true);
        } else if (response?.status === 400) {
          toast.error(`${data?.message ?? data?.response}`, {
            autoClose: 3000,
          });
        } else {
          toast.error(`${data?.message ?? data?.response}`, {
            autoClose: 3000,
          });
        }
        setIsSubmitting(false);
      } catch (error) {
        setIsSubmitting(false);
        toast.error(`${error?.message}`, { autoClose: 3000 });
      }
    }
  };
  return (
    <div className="mainContent">
      <TopBar BreadCrumbsData={BreadcrumbsData} BreadCrumbsTitle={'Ads'} />
      <div className="mainContentInner mt-2">
        <form>
          <div
            className={`formGroup ${styles.inputfieldgap} ${styles.formcontainer}`}
          >
            <h5>Create Ad</h5>
            <Row>
              <Col lg={6}>
                <Row>
                  <Col className={styles.inputfieldgap} lg={12}>
                    <div className="form-field w-100">
                      <div className="field w-100">
                        <SelectDropdown
                          styles={{ root: 'w-100 m-0' }}
                          placeholder={'Select Ads Type*'}
                          defaultValue={adsCreateData.ad_type}
                          selectedValue={adsCreateData.ad_type}
                          removeDivider
                          onBlur={(val) => {
                            let e = {
                              target: {
                                name: 'ad_type',
                                value: val,
                              },
                            };
                            handleInputBlur(e);
                          }}
                          showLabel
                          onChange={(val) => {
                            let e = {
                              target: {
                                name: 'ad_type',
                                value: val,
                              },
                            };
                            handleFormInput(e);
                          }}
                          options={[
                            { label: 'Large Ad', value: 'Large Ad' },
                            { label: 'Medium Ad', value: 'Medium Ad' },
                            { label: 'Small Ad', value: 'Small Ad' },
                          ]}
                        />
                      </div>
                      {errors.ad_type && (
                        <div className={`error ${styles.errorcolor}`}>
                          <p>{errors.ad_type}</p>
                        </div>
                      )}
                    </div>
                  </Col>
                  <Col className={styles.inputfieldgap} lg={12}>
                    <div className="form-field  w-100">
                      <div className={`field`}>
                        <input
                          type="number"
                          className={`form-control ${styles.devicetypeinputfields}`}
                          value={adsCreateData.display_order}
                          name="display_order"
                          onBlur={handleInputBlur}
                          placeholder=""
                          onChange={(e) => {
                            handleFormInput(e);
                            handleInputBlur(e);
                          }}
                          required
                          maxLength="9"
                        />
                        <label className="text-secondary">Display Order*</label>
                      </div>
                      {errors.display_order && (
                        <div className={`error ${styles.errorcolor}`}>
                          <p>{errors.display_order}</p>
                        </div>
                      )}
                    </div>
                  </Col>
                  <Col className={styles.inputfieldgap} lg={12}>
                    <div className="form-field  w-100">
                      <div className={`field`}>
                        <input
                          type="text"
                          className={`form-control ${styles.devicetypeinputfields}`}
                          value={adsCreateData.image_name}
                          name="image_name"
                          onBlur={handleInputBlur}
                          placeholder=""
                          onChange={(e) => {
                            handleFormInput(e);
                            handleInputBlur(e);
                          }}
                          required
                        />
                        <label className="text-secondary">Image Name*</label>
                      </div>
                      {errors.image_name && (
                        <div className={`error ${styles.errorcolor}`}>
                          <p>{errors.image_name}</p>
                        </div>
                      )}
                    </div>
                  </Col>
                  <Col className={styles.inputfieldgap} lg={12}>
                    <div className="form-field  w-100">
                      <div className={`field`}>
                        <input
                          type="text"
                          className={`form-control ${styles.devicetypeinputfields}`}
                          value={adsCreateData.redirect_url}
                          name="redirect_url"
                          onBlur={handleInputBlur}
                          placeholder=""
                          onChange={(e) => {
                            handleFormInput(e);
                            handleInputBlur(e);
                          }}
                          required
                        />
                        <label className="text-secondary">Redirect URL*</label>
                      </div>
                      {errors.redirect_url && (
                        <div className={`error ${styles.errorcolor}`}>
                          <p>{errors.redirect_url}</p>
                        </div>
                      )}
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col className={styles.inputfieldgap} lg={6}>
                <form className="h-100">
                  <div
                    className={`dashed-border-box rounded ${
                      styles.dashedborder
                    } ${
                      !adsCreateData?.image_url || loader
                        ? 'justify-content-center'
                        : 'justify-content-between'
                    }`}
                    onDrop={handleDrop}
                    onDragOver={allowDrop}
                  >
                    {loader ? (
                      <div
                        className="spinner-border text-primary"
                        role="status"
                      >
                        <span className="sr-only">Loading...</span>
                      </div>
                    ) : (
                      <>
                        {!adsCreateData?.image_url ? (
                          <>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="61"
                              height="61"
                              viewBox="0 0 61 61"
                              fill="none"
                            >
                              <g clipPath="url(#clip0_5623_207146)">
                                <path
                                  d="M32.9121 27.3672C32.3559 26.8214 31.608 26.5156 30.829 26.5156C30.0501 26.5156 29.3022 26.8214 28.7459 27.3672L19.8182 36.0062C19.5024 36.2671 19.2438 36.5903 19.0585 36.9558C18.8733 37.3212 18.7653 37.721 18.7414 38.1301C18.7175 38.5392 18.7782 38.9489 18.9197 39.3335C19.0612 39.718 19.2804 40.0692 19.5637 40.3651C19.8469 40.661 20.1881 40.8952 20.5659 41.0531C20.9437 41.2109 21.35 41.2891 21.7594 41.2826C22.1687 41.2761 22.5723 41.1851 22.9449 41.0153C23.3176 40.8456 23.6512 40.6007 23.9249 40.296L27.8234 36.5127V53.3141C27.8234 54.1042 28.1369 54.8619 28.695 55.4206C29.2531 55.9792 30.01 56.2931 30.7993 56.2931C31.5885 56.2931 32.3454 55.9792 32.9035 55.4206C33.4616 54.8619 33.7752 54.1042 33.7752 53.3141V36.6616L37.6141 40.5343C37.8907 40.8135 38.2199 41.0351 38.5825 41.1864C38.9451 41.3376 39.3341 41.4155 39.727 41.4155C40.1198 41.4155 40.5088 41.3376 40.8714 41.1864C41.2341 41.0351 41.5632 40.8135 41.8398 40.5343C42.1188 40.2573 42.3402 39.9279 42.4912 39.5648C42.6423 39.2018 42.7201 38.8125 42.7201 38.4192C42.7201 38.0259 42.6423 37.6366 42.4912 37.2736C42.3402 36.9105 42.1188 36.5811 41.8398 36.3041L32.9121 27.3672Z"
                                  fill="#D9D9D9"
                                />
                                <path
                                  d="M47.6724 14.5904C46.4581 11.0783 44.1804 8.03249 41.1562 5.87673C38.132 3.72098 34.5117 2.5625 30.799 2.5625C27.0864 2.5625 23.4661 3.72098 20.4419 5.87673C17.4177 8.03249 15.14 11.0783 13.9257 14.5904C11.252 14.9488 8.72597 16.0282 6.61779 17.7129C4.50961 19.3976 2.89861 21.6244 1.95713 24.1549C1.01565 26.6855 0.779106 29.4247 1.2728 32.0794C1.76649 34.7342 2.97185 37.2046 4.75994 39.2265C4.97592 39.6074 5.27314 39.9358 5.63041 40.1886C5.98768 40.4413 6.39623 40.6121 6.82696 40.6888C7.25769 40.7654 7.7 40.7461 8.12241 40.6321C8.54481 40.5181 8.93692 40.3123 9.2708 40.0293C9.60468 39.7463 9.87213 39.3931 10.0541 38.9949C10.2361 38.5966 10.3281 38.1631 10.3236 37.7252C10.3191 37.2873 10.2182 36.8558 10.0281 36.4613C9.83803 36.0669 9.5634 35.7193 9.22378 35.4432C8.07245 34.1547 7.31916 32.5595 7.05521 30.8511C6.79125 29.1427 7.02796 27.3942 7.73665 25.8178C8.44534 24.2413 9.59558 22.9044 11.048 21.9691C12.5004 21.0338 14.1926 20.5403 15.9196 20.5483H16.2171C16.9133 20.5624 17.5924 20.3316 18.1362 19.8961C18.6799 19.4607 19.0539 18.8481 19.193 18.1651C19.7395 15.4715 21.1993 13.0497 23.3254 11.3102C25.4514 9.57071 28.1127 8.62046 30.8586 8.62046C33.6044 8.62046 36.2658 9.57071 38.3918 11.3102C40.5178 13.0497 41.9777 15.4715 42.5241 18.1651C42.6632 18.8481 43.0372 19.4607 43.5809 19.8961C44.1247 20.3316 44.8038 20.5624 45.5 20.5483H45.6785C47.4055 20.5403 49.0977 21.0338 50.5501 21.9691C52.0025 22.9044 53.1527 24.2413 53.8614 25.8178C54.5701 27.3942 54.8068 29.1427 54.5429 30.8511C54.2789 32.5595 53.5256 34.1547 52.3743 35.4432C52.1122 35.7375 51.911 36.0809 51.7824 36.4536C51.6539 36.8263 51.6005 37.2208 51.6254 37.6143C51.6504 38.0078 51.753 38.3924 51.9276 38.7459C52.1021 39.0993 52.345 39.4146 52.6421 39.6734C53.1847 40.1523 53.8829 40.4171 54.6062 40.4181C55.0288 40.4176 55.4463 40.327 55.8312 40.1523C56.216 39.9777 56.5593 39.723 56.8381 39.4053C58.6758 37.3868 59.9238 34.9015 60.4456 32.221C60.9674 29.5404 60.743 26.7679 59.7969 24.2064C58.8508 21.645 57.2194 19.3932 55.081 17.6972C52.9427 16.0013 50.3798 14.9265 47.6724 14.5904Z"
                                  fill="#D9D9D9"
                                />
                              </g>
                              <defs>
                                <clipPath id="clip0_5623_207146">
                                  <rect
                                    width="60"
                                    height="61"
                                    fill="white"
                                    transform="translate(0.984375)"
                                  />
                                </clipPath>
                              </defs>
                            </svg>
                            <p className="text-black fw-semibold mt-4">
                              Select a file or drag and drop here
                            </p>
                            <p
                              className="text-secondary mb-4"
                              style={{ fontSize: '13px' }}
                            >
                              File format should be in jpg or png
                            </p>
                          </>
                        ) : (
                          <div>
                            <img
                              alt=""
                              className={styles.imagepreview}
                              src={adsCreateData?.image_url}
                            />
                          </div>
                        )}
                        <input
                          type="file"
                          id="fileInput"
                          accept=".png, .jpg,"
                          onChange={acceptUserFile}
                          style={{ display: 'none' }}
                        />
                        <p
                          className="text-secondary"
                          style={{ fontSize: '13px', marginTop: '-13px' }}
                        >
                          {selectedSize}
                        </p>
                        <button
                          className={styles.selectfilebtn}
                          onClick={(e) => handleFileInputClick(e)}
                        >
                          Select File
                        </button>
                      </>
                    )}
                  </div>
                  {errors.image_url && (
                    <div className={`error ${styles.errorcolor}`}>
                      <p>{errors.image_url}</p>
                    </div>
                  )}
                </form>
              </Col>
            </Row>
            <Row>
              <Col lg={12} className={styles.inputfieldgap}>
                <div className="form-field w-100 mb-4 textarea">
                  <div
                    className={`field ${styles.contactroledescriptionfield}`}
                  >
                    <textarea
                      type="text"
                      className={`form-control textarea  ${styles.textaeraPadding}  ${styles.contactrolename}`}
                      placeholder=""
                      name="details"
                      required
                      value={adsCreateData.details}
                      onChange={(e) => {
                        handleFormInput(e);
                      }}
                      // onBlur={handleInputBlur}
                    />
                    <label
                      className="text-secondary mb-2"
                      style={{ paddingTop: '0px' }}
                    >
                      Details (Optional)
                    </label>
                  </div>
                </div>
              </Col>
              <Col className={styles.inputfieldgap}>
                <div
                  className={`form-field checkbox mb-0 ${styles.fieldcontact}`}
                >
                  <span className="toggle-text">
                    {adsCreateData?.is_active ? 'Active' : 'Inactive'}
                  </span>
                  <label htmlFor="toggle" className="switch">
                    <input
                      type="checkbox"
                      id="toggle"
                      className="toggle-input"
                      checked={adsCreateData.status}
                      name="is_active"
                      defaultChecked
                      onChange={(e) => {
                        handleFormInput(e);
                      }}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>
              </Col>
            </Row>
          </div>
        </form>
        <form>
          <div className={`formGroup ${styles.formcontainer}`}>
            <h5>Ads Legend</h5>
            <Row className="w-100 px-0 text-black">
              <Col className={styles.legendadstext} lg={4}>
                <div>
                  <img
                    width={208}
                    alt=""
                    height={84}
                    src="/images/2-image.png"
                  />
                </div>
                <h4 className="mt-4 mb-1 ">Large Ads</h4>
                <p>Recommended upload file size : {LARGE_ADD_SIZE}</p>
              </Col>
              <Col className={styles.legendadstext} lg={4}>
                <div>
                  <img
                    className={styles.largeimgborder}
                    width={181}
                    height={103}
                    alt=""
                    src="/images/3-image.png"
                  />
                </div>
                <h4 className="mt-4 mb-1 ">Medium Ads</h4>
                <p>Recommended upload file size : {MEDIUM_ADD_SIZE}</p>
              </Col>
              <Col className={styles.legendadstext} lg={4}>
                <div>
                  <img
                    className={styles.largeimgborder}
                    width={110}
                    height={124}
                    alt=""
                    src="/images/4-image.png"
                  />
                </div>
                <h4 className="mt-4 mb-1 ">Small Ads</h4>
                <p>Recommended upload file size : {SMALL_ADD_SIZE}</p>
              </Col>
            </Row>
            <h5 className="mt-4">Ads Placement Legend</h5>
            <Row className="w-100 px-0 text-black">
              <Col className={styles.legendadstext} lg={3}>
                <div>
                  <img
                    width={140}
                    height={110}
                    alt=""
                    src="/images/ad-large.png"
                  />
                </div>
                <h4 className="mt-4 mb-1 ">Web</h4>
                <p>
                  Click here to{' '}
                  <Link
                    onClick={() => {
                      setPreviewPopUp(true);
                      setPreviewImg({
                        path: '/images/image-11.png',
                        index: 1,
                      });
                    }}
                  >
                    preview
                  </Link>
                </p>
              </Col>
              <Col className={styles.legendadstext} lg={3}>
                <div>
                  <img
                    width={140}
                    height={110}
                    alt=""
                    src="/images/ad-small.png"
                  />
                </div>
                <h4 className="mt-4 mb-1 ">Mobile</h4>
                <p>
                  Click here to{' '}
                  <Link
                    onClick={() => {
                      setPreviewPopUp(true);
                      setPreviewImg({
                        path: '/images/image-13.png',
                        index: 2,
                      });
                    }}
                  >
                    preview
                  </Link>
                </p>
              </Col>
            </Row>
          </div>
        </form>
        <div className="form-footer">
          <p
            className={`mb-0 ${styles.cancelbutton}`}
            onClick={(e) => {
              e.preventDefault();
              setCloseModal(true);
            }}
          >
            Cancel
          </p>

          <button
            type="button"
            disabled={isSubmitting}
            className={` btn btn-md mb-0 btn-primary ${styles.createbtn}`}
            onClick={handleSubmit}
          >
            Create
          </button>
        </div>
      </div>
      <SuccessPopUpModal
        title={'Success!'}
        message={'Ad created.'}
        modalPopUp={modalPopUp}
        setModalPopUp={setModalPopUp}
        showActionBtns={true}
        isNavigate={true}
        redirectPath={
          '/system-configuration/tenant-admin/organizational-admin/content-management-system/ads/list'
        }
      />
      <CancelModalPopUp
        title="Confirmation"
        message="Unsaved changes will be lost, do you wish to proceed?"
        modalPopUp={closeModal}
        isNavigate={true}
        setModalPopUp={setCloseModal}
        redirectPath={
          '/system-configuration/tenant-admin/organizational-admin/content-management-system/ads/list'
        }
      />
      <PreviewModal
        modalPopUp={previewPopUp}
        imgPath={privewImg}
        setModalPopUp={setPreviewPopUp}
      />
    </div>
  );
};

export default AdsCreate;
