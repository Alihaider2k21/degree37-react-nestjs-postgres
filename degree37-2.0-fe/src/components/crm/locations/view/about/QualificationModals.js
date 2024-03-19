import React, { useEffect, useState } from 'react';
import '../../index.scss';
import { useParams } from 'react-router-dom';
import { makeAuthorizedApiRequest } from '../../../../../helpers/Api';
import SvgComponent from '../../../../common/SvgComponent';
import AWS from 'aws-sdk';
import jwt from 'jwt-decode';
import DatePicker from 'react-datepicker';
import SelectDropdown from '../../../../common/selectDropdown';
import CrossImg from '../../../../../assets/images/crosssm.svg';
import PDF from '../../../../../assets/images/pdf.svg';
import DOC from '../../../../../assets/images/doc.svg';
import { Controller, useForm } from 'react-hook-form';
import CancelModalPopUp from '../../../../common/cancelModal';
import SuccessPopUpModal from '../../../../common/successModal';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import FormText from '../../../../common/form/FormText';
import { toast } from 'react-toastify';
import moment from 'moment/moment';
import './qualModal.scss';
const schema = yup
  .object({
    qualification_date: yup.date().required('Qualification date is required.'),
    qualification_expires: yup.string(),
    // .required('Please set qualification expire rules first.'),
    qualified_by: yup.number().required('Qualification by is required.'),
    description: yup
      .string()
      .max(500, 'Description must at most 500 characters.')
      .required('Description is required.'),
  })
  .required();

const QualificationModals = ({
  showAddModal,
  setAddQualificationModal,
  showPreview,
  setShowPreview,
  location_quali_expiration_period,
  previewData,
  setPreviewData,
  getQualification,
}) => {
  const [showCancelModal, setShowCancelModal] = React.useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = React.useState(false);
  const [qualification_expires, setQualification_expires] =
    React.useState(null);
  const [qualification_status, setQualification_status] = React.useState({
    label: 'Qualified',
    value: true,
  });
  const [qualified_by, setQualified_by] = React.useState();
  const [tenantUser, setTenantUsers] = useState();
  const [uploadFiles, setUploadFiles] = useState([]);
  const [loader, setLoader] = useState(false);
  const [Loading, setLoading] = useState(false);
  const jwtToken = localStorage.getItem('token');
  const decodeToken = jwt(jwtToken);
  const { id } = useParams();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const {
    setError,
    setValue,
    handleSubmit,
    control,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    mode: 'all',
    resolver: yupResolver(schema),
    defaultValues: {
      qualification_status: qualification_status.value,
      attachment_files: [],
      location_id: Number(id),
    },
  });
  console.log(errors);

  const qualificationStatusOptions = [
    { label: 'Qualified', value: true },
    { label: 'Expired', value: false },
  ];

  const currentDate = new Date();

  const onSubmit = (formData) => {
    createQualification(formData);
  };

  const handleChange = (field, e) => {
    const { name, value } = e.target;
    field.onChange({ target: { name, value } });
  };

  AWS.config.update({
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    region: process.env.REACT_APP_AWS_REGION,
  });
  const handleFileUpload = async (event) => {
    event.preventDefault();
    setLoader(true);
    const files = event.target.files;

    if (files.length === 0) {
      return;
    }

    const s3 = new AWS.S3();

    try {
      const uploadedFileUrls = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const buffer = await readFileAsync(file);
        const fileName = file.name;
        const fileType = file.type;

        const params = {
          Bucket: process.env.REACT_APP_AWS_BUCKET_NAME,
          Key: fileName,
          Body: buffer,
          ACL: 'public-read',
          ContentType: fileType,
        };

        const result = await s3.upload(params).promise();

        // Get the URL of the uploaded file
        const fileUrl = result.Location;
        uploadedFileUrls.push(fileUrl);
      }
      setUploadFiles((prev) => [...prev, ...uploadedFileUrls]);

      setLoader(false);
      // toast.success('Files uploaded on aws.');
      // alert('Files uploaded.');

      // Do something with the uploaded file URLs in your React component
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };
  const readFileAsync = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const handleCancel = () => {
    setQualification_expires(null);
    setAddQualificationModal(false);
    setUploadFiles([]);
    setQualified_by(null);
    reset();
  };

  useEffect(() => {
    fetchTenantUsers();
  }, []);
  const createQualification = async (body) => {
    try {
      setLoading(true);
      const response = await makeAuthorizedApiRequest(
        'POST',
        `${BASE_URL}/locations/${id}/qualification`,
        JSON.stringify({ ...body, attachment_files: uploadFiles })
      );

      let data = await response.json();
      if (data?.status === 'success') {
        setShowSuccessMessage('Qualification Added');
        setAddQualificationModal(false);
        setQualification_expires(null);
        reset();
        setQualified_by(null);
        getQualification();
        setUploadFiles([]);
      } else if (data?.status_code === 400) {
        const showMessage = Array.isArray(data?.message)
          ? data?.message[0]
          : data?.message;

        toast.error(`${showMessage}`, { autoClose: 3000 });
        // Handle bad request
      } else if (data?.status_code === 404) {
        const showMessage = data?.response;

        toast.error(`${showMessage}`, { autoClose: 3000 });
        // Handle bad request
      } else {
        const showMessage = Array.isArray(data?.message)
          ? data?.message[0]
          : data?.message;
        toast.error(`${showMessage}`, { autoClose: 3000 });
      }
    } catch (error) {
      console.error('Error Recruiters Data:', error);
    }
    setLoading(false);
  };
  const fetchTenantUsers = async () => {
    try {
      console.log('tenant User');
      const response = await makeAuthorizedApiRequest(
        'GET',
        `${BASE_URL}/tenant-users?fetchAll=true`
      );
      const data = await response.json();
      setTenantUsers([
        ...(data?.data.map((item) => {
          return {
            value: item.id,
            label: item?.first_name + ' ' + item?.last_name,
          };
        }) || []),
      ]);
      const loggedUser = data?.data.find((x) => x.id === decodeToken?.id);
      if (loggedUser) {
        setQualified_by({
          value: loggedUser?.id,
          label: loggedUser?.first_name + ' ' + loggedUser?.last_name,
        });
        setValue('qualified_by', +loggedUser?.id);
      }
    } catch (error) {
      console.error('Error Recruiters Data:', error);
    }
  };

  let attachment_files;
  if (previewData?.attachment_files) {
    attachment_files = JSON.parse(
      previewData?.attachment_files?.replaceAll('{', '[').replaceAll('}', ']')
    );
  }
  console.log(attachment_files);
  return (
    <>
      <section className={`popup full-section ${showAddModal ? 'active' : ''}`}>
        <div className="overflow-y-auto">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div
              style={{
                padding: '5rem',
              }}
              className={`container h-screen`}
            >
              <div className="formGroup">
                <h5>Add Qualification</h5>
                <div className="d-flex w-100 gap-3">
                  <SelectDropdown
                    placeholder="Qualification Status*"
                    disabled={true}
                    options={qualificationStatusOptions}
                    selectedValue={qualification_status}
                    onChange={(option) => {
                      setQualification_status(option);
                      setValue(
                        'qualification_status',
                        qualification_status.value ?? null
                      );
                    }}
                    onBlur={() => setError('qualification_status')}
                    showLabel={true}
                    removeDivider
                  />
                  <SelectDropdown
                    placeholder="Qualification By*"
                    options={tenantUser}
                    selectedValue={qualified_by}
                    onChange={(option) => {
                      setQualified_by(option);

                      const qualificationNum = Number(option?.value);

                      setValue('qualified_by', qualificationNum || null);
                    }}
                    showLabel={qualified_by ? true : false}
                    onBlur={() => setError('qualified_by')}
                    error={errors?.qualified_by?.message}
                    removeDivider
                  />
                </div>
                <div className="d-flex w-100 gap-3 qualification-date-picker">
                  <Controller
                    name="qualification_date"
                    control={control}
                    render={({ field }) => (
                      <div className="form-field w-50">
                        <div
                          className="fieldDate"
                          style={{ position: 'relative' }}
                        >
                          {getValues('qualification_date') && (
                            <label
                              style={{
                                position: 'absolute',
                                top: '10px',
                                zIndex: 1,
                                fontSize: '12px',
                              }}
                            >
                              Qualification Date*
                            </label>
                          )}
                          <DatePicker
                            autoComplete="off"
                            name={field.name}
                            dateFormat="MM-dd-yyyy"
                            className="custom-datepicker form-control"
                            placeholderText={
                              getValues('qualification_date')
                                ? ''
                                : 'Qualification Date*'
                            }
                            selected={field.value}
                            maxDate={currentDate}
                            onChange={(date) => {
                              field.onChange({
                                target: { value: new Date(date) },
                              });
                              if (location_quali_expiration_period) {
                                setValue(
                                  'qualification_expires',
                                  moment(date)
                                    .add(
                                      location_quali_expiration_period,
                                      'month'
                                    )
                                    .toISOString()
                                );
                                setQualification_expires(
                                  moment(date)
                                    .add(
                                      location_quali_expiration_period,
                                      'month'
                                    )
                                    .toISOString()
                                );
                              }
                            }}
                          />
                          {/* {field.value && <label>Qualification Date</label>} */}
                        </div>
                        {errors?.qualification_date?.message && (
                          <div className="error">
                            <p>{errors?.qualification_date?.message}</p>
                          </div>
                        )}
                      </div>
                    )}
                  />

                  <SelectDropdown
                    placeholder="Qualification Expires*"
                    disabled={true}
                    options={[]}
                    selectedValue={{
                      value: qualification_expires
                        ? moment(qualification_expires).format('MM-DD-YYYY')
                        : '-',
                      label: qualification_expires
                        ? moment(qualification_expires).format('MM-DD-YYYY')
                        : '-',
                    }}
                    showLabel
                    error={errors.qualification_expires?.message}
                    removeDivider
                  />
                </div>

                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <FormText
                      name={field.name}
                      placeholder={
                        getValues('description') ? '' : 'Description*'
                      }
                      displayName={
                        !getValues('description') ? '' : 'Description*'
                      }
                      showLabel
                      classes={{ root: `w-100 field` }}
                      onChange={(e) => handleChange(field, e)}
                      value={field.value}
                      required={false}
                      error={errors?.description?.message}
                    />
                  )}
                />
                <h5 style={{ margin: '10px 0 20px 0' }}>Upload File</h5>
                {loader ? (
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                ) : (
                  <>
                    <div className="w-100">
                      <div className="upload-btn-wrapper">
                        <button
                          className={`btn`}
                          style={{ cursor: 'pointer' }}
                          disabled={loader}
                        >
                          Upload File
                        </button>
                        <input
                          type="file"
                          name="myfile"
                          accept=".pdf, .doc, .docx"
                          multiple
                          required
                          onChange={handleFileUpload}
                        />
                      </div>
                    </div>
                    <div className="form-field w-100">
                      <div className="field">
                        <p className="mt-2">
                          You can upload multiple files at once.
                        </p>

                        <div className="d-flex flex-wrap ">
                          {uploadFiles?.length > 0 &&
                            uploadFiles.map((file, index) => (
                              <span
                                style={{
                                  color: '#2D2D2E',
                                  backgroundColor: '#f5f5f5',
                                  fontSize: '14px',
                                  padding: '18px 8px 18px 15px',
                                  borderLeft: '2px solid #72A3D0',
                                  borderRadius: '8px',
                                  gap: '20px',
                                }}
                                className=" mt-1 me-3 "
                                key={index}
                              >
                                <span>
                                  {file?.includes('.pdf') ? (
                                    <SvgComponent name="PdfIcon" />
                                  ) : file.includes('.doc') ||
                                    file.includes('.docx') ? (
                                    <SvgComponent name="WordIcon" />
                                  ) : null}
                                </span>
                                <span
                                  className="ms-1"
                                  style={{
                                    wordBreak: 'break-all',
                                  }}
                                >
                                  {file?.split('/').pop()}
                                </span>
                                <span
                                  className="ms-1"
                                  style={{
                                    wordBreak: 'break-all',
                                  }}
                                  onClick={() => {
                                    // Create a new array without the element at the specified index
                                    const newAttachments = [...uploadFiles];
                                    newAttachments.splice(index, 1);
                                    const attachmentFiles =
                                      getValues('attachment_files') || [];
                                    const updatedFiles = [
                                      ...attachmentFiles,
                                      ...newAttachments,
                                    ];
                                    setValue(
                                      'attachment_files',
                                      updatedFiles ?? null
                                    );

                                    // Update the state with the new array
                                    setUploadFiles(newAttachments);
                                  }}
                                >
                                  <SvgComponent name="AwsCrossIcon" />
                                </span>
                              </span>
                            ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}
                <div className="d-flex align-items-center justify-content-end w-100">
                  <>
                    <button
                      style={{
                        border: '1px solid #387DE5',
                        borderRadius: '8px',
                      }}
                      className="btn btn-link mx-3"
                      onClick={() => {
                        // handleCancel();
                        setShowCancelModal(true);
                        // setQualification_expires(null);
                      }}
                      disabled={Loading || loader}
                    >
                      Cancel
                    </button>
                  </>

                  <>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleSubmit(onSubmit)}
                      disabled={Loading || loader}
                    >
                      Save
                    </button>
                  </>
                </div>
              </div>
            </div>
          </form>
          <CancelModalPopUp
            title="Confirmation"
            message={'Unsaved changes will be lost. Do you want to continue?'}
            modalPopUp={showCancelModal}
            setModalPopUp={setShowCancelModal}
            showActionBtns={false}
            isNavigate={false}
            methodsToCall={true}
            methods={handleCancel}
          />

          <SuccessPopUpModal
            title="Success!"
            message={showSuccessMessage}
            modalPopUp={showSuccessMessage}
            isNavigate={true}
            // redirectPath={`/crm/contacts/staff/${params?.staffId}/view/leave`}
            showActionBtns={true}
            isArchived={false}
            setModalPopUp={setShowSuccessMessage}
          />
        </div>
      </section>
      <section className={`popup full-section ${showPreview ? 'active' : ''}`}>
        <div className="overflow-y-auto">
          <form>
            <div
              style={{
                padding: '5rem',
                height: '80vh',
              }}
              className={`container h-screen`}
            >
              <div className="formGroup">
                <div className="d-flex justify-content-between align-items-center w-100 mb-3">
                  <div
                    style={{
                      color: '#2D2D2E',
                      fontSize: '32px',
                      fontWeight: '500',
                      lineHeight: 'normal',
                      fontFamily: 'Inter',
                    }}
                  >
                    Qualification
                  </div>
                  <div
                    onClick={() => {
                      setShowPreview(false);
                      setPreviewData(null);
                    }}
                    style={{
                      cursor: 'pointer',
                    }}
                    className="icon mx-1"
                  >
                    <img src={CrossImg} alt="CrossIcon" />
                  </div>
                </div>
                <div
                  style={{
                    maxHeight: '380px',
                    overflow: 'auto',
                  }}
                  className="w-100"
                >
                  <table
                    style={{
                      borderRadius: '0',
                    }}
                    className="viewTables w-100 mt-0"
                  >
                    <tbody>
                      <tr>
                        <td className="tableTD col1">Qualification Status</td>
                        <td className="tableTD col2">
                          <div className="d-flex align-items-center">
                            <div className="greenCircle"></div>
                            <div className="mx-2">
                              {previewData?.qualification_status
                                ? 'Qualified'
                                : 'Expire'}
                            </div>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="tableTD col1">Qualification By</td>
                        <td className="tableTD col2">
                          {' '}
                          {
                            tenantUser?.find(
                              (x) =>
                                x.value ===
                                previewData?.qualified_by?.toString()
                            )?.label
                          }
                        </td>
                      </tr>
                      <tr>
                        <td className="tableTD col1">Qualification Date</td>
                        <td className="tableTD col2">
                          {moment(previewData?.qualification_date).format(
                            'MM-DD-YYYY'
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="tableTD col1">Qualification Expire</td>
                        <td className="tableTD col2">
                          {previewData?.qualification_expires
                            ? moment(previewData?.qualification_expires).format(
                                'MM-DD-YYYY'
                              )
                            : '-'}
                        </td>
                      </tr>
                      <tr>
                        <td className="tableTD col1">Description</td>

                        <td className="tableTD col2 ">
                          {previewData?.description}
                        </td>
                      </tr>
                      <tr>
                        <td className="tableTD col1">Attachments</td>
                        <td className="tableTD col2 ">
                          {attachment_files &&
                          Array.isArray(attachment_files) &&
                          attachment_files?.length > 0 ? (
                            attachment_files?.map((file, i) => {
                              return (
                                <>
                                  <div className="d-flex align-items-center">
                                    <div className="icon mx-1">
                                      {file?.includes('.pdf') ? (
                                        <img src={PDF} alt="PDF" />
                                      ) : file.includes('.doc') ||
                                        file.includes('.docx') ? (
                                        <img src={DOC} alt="Doc" />
                                      ) : null}
                                    </div>
                                    <div
                                      style={{
                                        color: '#2D2D2E',

                                        fontSize: '14px',
                                        fontStyle: 'normal',
                                        fontWeight: '400',
                                      }}
                                    >
                                      <a
                                        href={file}
                                        target="_blank"
                                        rel="noreferrer"
                                      >
                                        {file?.split('/').pop()}
                                      </a>
                                    </div>
                                  </div>
                                </>
                              );
                            })
                          ) : (
                            <i>No Record</i>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default QualificationModals;
