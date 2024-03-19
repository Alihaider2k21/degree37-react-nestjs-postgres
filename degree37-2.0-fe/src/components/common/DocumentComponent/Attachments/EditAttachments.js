import React, { useEffect, useState } from 'react';
import FormInput from '../../form/FormInput';
import SelectDropdown from '../../selectDropdown';
import FormText from '../../form/FormText';
import { useParams } from 'react-router';
import './index.scss';

import SuccessPopUpModal from '../../successModal';
import { toast } from 'react-toastify';
import AWS from 'aws-sdk';
import SvgComponent from '../../SvgComponent';
import { API } from '../../../../api/api-routes';
import CancelModalPopUp from '../../cancelModal';

const initialErrors = {
  name: '',
  category_id: '',
  sub_category_id: '',
  description: '',
};

export default function EditAttachments({
  type,
  categoryApi,
  subCategoryApi,
  listLink,
  editApi,
  archiveApi,
  attachId,
}) {
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [attachmentsAddData, setAttachmentsAddData] = useState({});
  const [errors, setErrors] = useState(initialErrors);
  const [attachmentsCategoryList, setAttachmentsCategoryList] = useState([]);
  const [attachmentsSubCategoryList, setAttachmentsSubCategoryList] = useState(
    []
  );
  const [closeModal, setCloseModal] = useState(false);

  const [loader, setLoader] = useState(false);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [showModel, setShowModel] = useState(false);
  const [isArchived, setIsArchived] = useState(false);
  const [isNavigate, setIsNavigate] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  let isDisabled =
    attachmentsAddData.name &&
    attachmentsAddData.name.length <= 60 &&
    attachmentsAddData.category_id &&
    attachmentsAddData.sub_category_id &&
    !errors.name &&
    !errors.category_id &&
    !errors.sub_category_id &&
    !errors.description;
  isDisabled = Boolean(isDisabled);

  const handleChange = (event) => {
    const { name, value } = event.target;
    // Update the state based on the type of input element
    setAttachmentsAddData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    handleInputBlur(event);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!attachmentsAddData?.name) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        name: 'Name is required.',
      }));
    } else if (attachmentsAddData?.name.length > 60) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        name: 'Name must not be greater than 60 characters.',
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        name: '',
      }));
    }
    if (!attachmentsAddData?.category_id?.value) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        category_id: 'Please select a category.',
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        category_id: '',
      }));
    }
    if (!attachmentsAddData?.sub_category_id?.value) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        sub_category_id: 'Please select a subcategory.',
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        sub_category_id: '',
      }));
    }
    if (
      attachmentsAddData?.sub_category_id?.value &&
      attachmentsAddData?.category_id?.value &&
      attachmentsAddData?.name
    ) {
      setLoading(true);
      try {
        const body = {
          ...attachmentsAddData,
          name: attachmentsAddData?.name,
          category_id: +attachmentsAddData?.category_id?.value,
          sub_category_id: +attachmentsAddData?.sub_category_id?.value,
          attachment_files: uploadFiles,
        };

        const res = await editApi(attachId, body);
        setLoading(false);

        if (res?.data?.status === 'error') {
          toast.error(res?.data?.response);
          return;
        }
        if (event.target.name === 'Save & Close') {
          setIsArchived(false);
          setIsNavigate(true);
          setShowModel(true);
        } else {
          setIsArchived(false);
          setIsNavigate(false);
          setShowModel(true);
        }
      } catch (error) {
        console.error('Error occurred while submitting the form:', error);
        toast.error('Error occurred while submitting the form.');
        setLoading(false);
      }
      setLoading(false);
    }
  };

  const archieveHandle = async () => {
    try {
      const res = await archiveApi(attachId);
      if (res?.data?.status === 'success') {
        setShowSuccessMessage(true);
        // toast.success('Attachment is archived.');
      } else {
        // toast.error('Attachment is archived.');
      }
      console.log(res);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        // Fetch category data
        const categoryResponse = await categoryApi;
        const categoryData = categoryResponse?.data?.data?.data;
        setAttachmentsCategoryList(categoryData);

        // Fetch sub-category data
        const subCategoryResponse = await subCategoryApi;
        const subCategoryData = subCategoryResponse?.data?.data?.data;
        setAttachmentsSubCategoryList(subCategoryData);

        // Fetch edit data
        const editResponse =
          await API.crm.documents.attachments.getAttachmentByID(attachId);
        const edit = editResponse?.data?.data;

        if (edit) {
          const update = {
            name: edit.name,
            category_id: {
              value: +edit.category_id?.id,
              label: edit.category_id?.name,
            },
            sub_category_id: {
              value: +edit.sub_category_id?.id,
              label: edit.sub_category_id?.name,
            },
            description: edit.description,
          };
          setUploadFiles(
            edit.attachment_files?.map(
              (attachment) => attachment.attachment_path
            ) || []
          );
          setAttachmentsAddData(update);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetch();
  }, [params]);

  const handleCategoryChange = (val) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      category_id: '',
    }));
    setAttachmentsAddData({
      ...attachmentsAddData,
      category_id: val,
      sub_category_id: null,
    });
  };

  const handleSubCategoryChange = (val) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      sub_category_id: '',
    }));
    setAttachmentsAddData({
      ...attachmentsAddData,
      sub_category_id: val,
    });
  };

  const handleInputBlur = (e, nameSelect) => {
    const { name, value } = e.target;

    // Handle specific field validations based on the field name.
    switch (name || nameSelect) {
      case 'name':
        if (!value || !value.trim()) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: 'Name is required.',
          }));
        } else if (value.length > 60) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            name: 'Name must not be greater than 60 characters.',
          }));
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: '',
          }));
        }
        break;
      case 'category_id':
        if (!attachmentsAddData.category_id) {
          // console.log('caeg');
          setErrors((prevErrors) => ({
            ...prevErrors,
            [nameSelect]: 'Please select a category.',
          }));
          setAttachmentsAddData({
            ...attachmentsAddData,
            sub_category_id: null,
          });
          // setErrors((prev)=>{})
        } else {
          // console.log('caeg');
          setErrors((prevErrors) => ({
            ...prevErrors,
            [nameSelect]: '',
          }));
          // setErrors((prev)=>{})
        }
        // Perform validation for 'category_id' field.
        // Update 'errorMessage' if validation fails.
        break;
      case 'sub_category_id':
        if (!attachmentsAddData.sub_category_id) {
          // console.log('caeg');
          setErrors((prevErrors) => ({
            ...prevErrors,
            [nameSelect]: 'Please select a subcategory.',
          }));
          // setErrors((prev)=>{})
        } else {
          // console.log('caeg');
          setErrors((prevErrors) => ({
            ...prevErrors,
            [nameSelect]: '',
          }));
          // setErrors((prev)=>{})
        }
        break;
      case 'description':
        if (value.length > 500) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: 'Description must not be greater than 500 characters.',
          }));
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: '',
          }));
        }
        break;

      default:
    }
  };

  const handleCategoryChangeFocus = (e) => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      category_id: '',
    }));
  };

  const handleSubcategoryChangeFocus = () => {
    setErrors((prevErrors) => ({
      ...prevErrors,
      sub_category_id: '',
    }));
  };

  AWS.config.update({
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    region: process.env.REACT_APP_AWS_REGION,
  });

  const handleFileUpload = async (event) => {
    event.preventDefault();
    setErrors((prevErrors) => ({
      ...prevErrors,
      attachment_files: null,
    }));
    const files = event.target.files;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (
        file.type === 'image/jpeg' ||
        file.type === 'image/png' ||
        file.type === 'application/pdf'
      ) {
        //ok
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          attachment_files: 'Only images and pdfs are allowed.',
        }));
        console.log(file.type, 'error');
        return;
      }
    }
    setLoader(true);

    if (files.length === 0) {
      return;
    }

    const s3 = new AWS.S3();

    try {
      const uploadedFileUrls = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const buffer = await readFileAsync(file);
        const fileName = `${Date.now()}-${file.name}`;
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

  return (
    <>
      <SuccessPopUpModal
        title="Success!"
        message={'Attachment is archived.'}
        modalPopUp={showSuccessMessage}
        showActionBtns={true}
        isArchived={false}
        setModalPopUp={setShowSuccessMessage}
        isNavigate={true}
        redirectPath={listLink}
      />
      <CancelModalPopUp
        title="Confirmation"
        message="Unsaved changes will be lost, do you wish to proceed?"
        modalPopUp={closeModal}
        isNavigate={true}
        setModalPopUp={setCloseModal}
        redirectPath={-1}
      />
      <SuccessPopUpModal
        title={isArchived ? 'Confirmation' : 'Success!'}
        message={
          isArchived ? 'Are you sure want to archive?' : 'Attachments updated.'
        }
        modalPopUp={showModel}
        setModalPopUp={setShowModel}
        showActionBtns={isArchived ? false : true}
        isArchived={isArchived}
        archived={archieveHandle}
        isNavigate={isNavigate}
        redirectPath={isArchived ? listLink : -1}
      />
      <form className="mt-5 pt-5" onSubmit={handleSubmit}>
        <div className="formGroup">
          <h5>Edit Attachment</h5>
          <div className="p-0 m-0 w-100">
            <FormInput
              label="Name"
              name="name"
              displayName="Name"
              value={attachmentsAddData.name}
              onChange={(e) => {
                if (/^[A-Za-z\s]+$/.test(e.target.value) || !e.target.value) {
                  handleChange(e);
                }
              }}
              required
              error={errors.name}
              onBlur={handleInputBlur}
            />
          </div>

          <SelectDropdown
            placeholder="Category*"
            name="category_id"
            selectedValue={attachmentsAddData.category_id}
            defaultValue={attachmentsAddData.category_id}
            required
            removeDivider
            // removeTheClearCross
            showLabel
            onChange={handleCategoryChange}
            onFocus={handleCategoryChangeFocus}
            onBlur={(e) => handleInputBlur(e, 'category_id')}
            options={attachmentsCategoryList?.map((categoryOption) => {
              return {
                value: categoryOption.id,
                label: categoryOption.name,
              };
            })}
            error={errors.category_id}
          />

          <SelectDropdown
            placeholder={'Subcategory*'}
            name="sub_category_id"
            showLabel
            required
            selectedValue={attachmentsAddData.sub_category_id}
            defaultValue={attachmentsAddData.sub_category_id}
            onBlur={(e) => handleInputBlur(e, 'sub_category_id')}
            removeDivider
            // removeTheClearCross
            onChange={handleSubCategoryChange}
            options={attachmentsSubCategoryList
              ?.filter(
                (el) =>
                  el.parent_id?.id == attachmentsAddData.category_id?.value
              )
              .map((subcategoryOption) => {
                return {
                  value: subcategoryOption.id,
                  label: subcategoryOption.name,
                };
              })}
            disabled={
              attachmentsSubCategoryList?.filter(
                (el) =>
                  el.parent_id?.id == attachmentsAddData.category_id?.value
              ).legth === 0
            }
            error={
              !attachmentsAddData.category_id ? '' : errors.sub_category_id
            }
            onFocus={handleSubcategoryChangeFocus}
          />
          <FormText
            label="description"
            name="description"
            classes={{ root: 'w-100' }}
            displayName="Description"
            value={attachmentsAddData.description}
            onChange={handleChange}
            required={false}
            error={errors.description}
            onBlur={handleInputBlur}
          />

          {loader ? (
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          ) : (
            <>
              <div className="w-100">
                <div className="upload-btn-wrapper">
                  <button className="" disabled={loader}>
                    Upload File
                  </button>
                  <input
                    type="file"
                    name="myfile"
                    // onBlur={handleInputBlur}
                    accept=".pdf, .doc, .png, .docx"
                    multiple
                    required
                    onChange={handleFileUpload}
                  />
                </div>
              </div>
              <div className="form-field w-100">
                <div className="field">
                  <p className="mb-3 mt-2">
                    You can upload multiple files at once.
                  </p>
                  {errors.attachment_files && (
                    <div className="error">
                      <p>{errors.attachment_files}</p>
                    </div>
                  )}
                  <div
                    style={{
                      wordBreak: 'break-word',
                    }}
                    className="d-flex flex-wrap "
                  >
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
                            ) : file.includes('.jpg') ||
                              file.includes('.jpeg') ||
                              file.includes('.png') ? (
                              <SvgComponent name="image" />
                            ) : null}
                          </span>
                          <span className="ms-1">{file?.split('/').pop()}</span>
                          <span
                            className="ms-1"
                            onClick={() => {
                              const tempArr = [...uploadFiles];
                              tempArr.splice(index, 1);
                              setUploadFiles([...tempArr]);
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
        </div>
        <div className={`form_footer`}>
          <div>
            <div
              className="archived"
              onClick={() => {
                setIsArchived(true);
                setShowModel(true);
              }}
              type="button"
              style={{
                bottom: '20px',
              }}
            >
              Archive
            </div>
          </div>
          <div>
            <span
              className={`text-primary border-0 cursor-pointer cancel`}
              onClick={() => setCloseModal(true)}
            >
              Cancel
            </span>
            <button
              name="Save & Close"
              className={`rounded saveButton btn btn-primary bg-white text-primary py-0 `}
              onClick={handleSubmit}
              disabled={loading || loader}
            >
              Save & Close
            </button>
            <button
              name="Save Changes"
              type="button"
              className={`rounded saveButton ${
                !isDisabled ? `btn btn-primary py-0` : `btn btn-primary py-0 `
              }`}
              onClick={handleSubmit}
              disabled={loading || loader}
            >
              Save Changes
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
