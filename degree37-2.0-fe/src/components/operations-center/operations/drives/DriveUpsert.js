import React, { useEffect, useState } from 'react';
import TopBar from '../../../common/topbar/index';
import styles from './index.module.scss';
import { useForm } from 'react-hook-form';
import 'react-datepicker/dist/react-datepicker.css';
import createDynamicSchema from './driveSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import { API } from '../../../../api/api-routes';
import { makeAuthorizedApiRequest } from '../../../../helpers/Api';
import { toast } from 'react-toastify';
import 'rc-time-picker/assets/index.css';
import AddContactsModal from './create/add-contacts-modal';
import AddContactsSection from './create/add-contacts-section';
import CustomFieldsForm from '../../../common/customeFileds/customeFieldsForm';
import CreateDriveForm from './create/create-drive-form';
import SelectDriveForm from './create/select-drive-form';
import DonorCommunicationForm from './create/donor-communication-form';
import MarketingEquipmentForm from './create/marketing-eqipment-form';
import DetailsForm from './create/details-form';
import {
  OPERATIONS_CENTER,
  OPERATIONS_CENTER_DRIVES_PATH,
} from '../../../../routes/path';
import ShiftForm from './create/ShiftForm';
import moment from 'moment';
import AddAccountsModal from './create/add-accounts-modal';
import CancelModalPopUp from '../../../common/cancelModal';
import SuccessPopUpModal from '../../../common/successModal';
import WarningModalPopUp from '../../../common/warningModal';
import ConfirmArchiveIcon from '../../../../assets/images/ConfirmArchiveIcon.png';
import { isEmpty } from 'lodash';
import * as _ from 'lodash';
import { useNavigate, useParams } from 'react-router';
import { useSearchParams } from 'react-router-dom';

function DrivesUpsert() {
  // const [checkRedirection, setCheckRedirection] = useState(false);
  const [redirection, setRedirection] = useState();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [closeModal, setCloseModal] = useState(false);
  const [contactsCloseModal, setContactsCloseModal] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [primaryChairPersonModal, setPrimaryChairPersonModal] = useState(false);
  const [primaryChairPersonModalContent, setPrimaryChairPersonModalContent] =
    useState('');
  const [accounts, setAccounts] = useState([]);
  const [collectionOperation, setCollectionOperation] = useState([]);
  const [equipmentOptions, setEquipmentOptions] = useState([]);
  const [marketingOptions, setMarketingOptions] = useState([]);
  const [promotionalOptions, setPromotionalOptions] = useState([]);
  const [certificationOptions, setCertificationOptions] = useState([]);
  const [collectionOperationId, setCollectionOperationId] = useState();
  const [territory, setTerritory] = useState([]);
  const [industryCategories, setIndustryCategories] = useState([]);
  const [accountId, setAccountId] = useState(null);
  const [locationsData, setLocationsData] = useState([]);
  const [operationStatus, setOperationStatus] = useState([]);
  const [recruiters, setRecruiters] = useState(null);
  const [recruiterOptions, setRecruiterOption] = useState(null);
  const [promotions, setPromotions] = useState([]);
  const [promotiomsOption, setPromotionsOption] = useState([]);
  const [contactRows, setContactRows] = useState([]);
  const [accountRows, setAccountRows] = useState([]);
  const [accountContactsList, setAccountContactsList] = useState([]);
  const [RSMO, setRSMO] = useState();
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [selectedAccounts, setSelectedAccounts] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState({});
  const [contactRoles, setContactRoles] = useState([]);

  const [contactsSearchText, setContactsSearchText] = useState('');
  const [accountsSearchText, setAccountsSearchText] = useState('');
  const [locationType, setLocationType] = useState({});
  const [miles, setMiles] = useState({});
  const [minutes, setMinutes] = useState({});
  const [customFileds, setcustomFields] = useState();
  const [travelMinutes, setTravelMinutes] = useState(0);

  const [procedureTypesList, setProcedureTypesList] = useState([]);
  const [procedureProducts, setProcedureProducts] = useState({});
  const [equipment, setEquipment] = useState([
    { equipment: null, quantity: 0 },
  ]);
  const [marketing, setMarketing] = useState([{ item: null, mquantity: '' }]);
  const [promotional, setPromotional] = useState([
    { item: null, pquantity: '' },
  ]);
  const [addContactsModal, setAddContactsModal] = useState(false);
  const [addAccountsModal, setAddAccountsModal] = useState(false);
  const [isOverrideUser, setIsOverrideUser] = useState(false);
  const [zipCodes, setZipCodes] = useState([]);
  const [approvals, setApprovals] = useState({});
  const [customErrors, setcustomErrors] = useState({});
  const [contacts, setContacts] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [loader, setLoader] = useState(true);
  const [shiftSlots, setShiftSlots] = useState([]);
  const [staffSetupShiftOptions, setStaffSetupShiftOptions] = useState([]);
  const [devicesOptions, setDevicesOptions] = useState([]);
  const [bookingRules, setBookingRules] = useState({});
  const [disableButton, setDisableButton] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null); // For Blue print
  const [selectedBlueprint, setSelectedBlueprint] = useState(null); // For Blue print
  const [selectedLinkDrive, setSelectedLinkDrive] = useState(null);
  const [editable, setEditable] = useState(false);
  const [editData, setEditData] = useState(false);
  const { id } = useParams();
  const [archiveSuccess, setArchiveSuccess] = useState(false);
  const [blueprintAccounts, setBlueprintAccounts] = useState([]);
  const [archivePopup, setArchivePopup] = useState(false);
  const [blueprintList, setBlueprintList] = useState([]);
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  };
  useEffect(() => {
    // console.log('window', window.location.href);
    if (window.location.href.includes('edit')) {
      setEditable(true);
    } else {
      setEditable(false);
    }
  }, [window.location.href]);

  useEffect(() => {
    const id = searchParams.get('accountId');
    const bluerintId = searchParams.get('blueprintId');
    if (
      typeof bluerintId !== 'object' &&
      typeof id !== 'object' &&
      Object.entries(miles).length
    ) {
      setValue('form', 'blueprint');
      const account = blueprintAccounts?.filter((item) => item.id === id)?.[0];
      setSelectedAccount(account);
      const blueprint = blueprintList?.filter(
        (item) => item.value === bluerintId
      )?.[0];
      setValue('blueprint_select', blueprint);
    }
  }, [searchParams, blueprintAccounts, blueprintList, miles, minutes]);

  const fetchApprovals = async () => {
    const { data } =
      await API.systemConfiguration.operationAdministrations.marketingEquipment.approvals.getApprovals();
    setApprovals(data?.data || {});
  };
  // console.log({ collectionOperation, collectionOperationId });
  const fetchBookingRules = async () => {
    const { data } =
      await API.systemConfiguration.operationAdministrations.bookingDrives.bookingRules.getBookingRules();
    setBookingRules(data?.data || {});
  };

  const fetchCurrentUser = async () => {
    const { data } =
      await API.systemConfiguration.userAdministration.users.getCurrent();
    setIsOverrideUser(data?.data?.override || false);
  };

  useEffect(() => {
    fetchApprovals();
    fetchCurrentUser();
    fetchBookingRules();
  }, []);

  const validationSchema = createDynamicSchema(customFileds);

  const {
    handleSubmit: onSubmit,
    control,
    formState: { errors: formErrors /*isDirty*/ },
    setValue,
    getValues,
    watch,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      form: 'clean_slate',
      account: { label: 'Account', value: null },
      promotion: '',
      start_date: '',
      collection_operation: '',
      territory: '',
      recruiter: '',
      location: '',
      certifications: [],
      multi_day: false,
      marketing_order_status: 'Approved',
      promotioanal_order_status: 'Approved',
      tele_recruitment_status: 'Approved',
      email_status: 'Approved',
      sms_status: 'Approved',
    },
    mode: 'onChange',
  });

  const start_date = watch('start_date');
  const collection_operation = watch('collection_operation');
  const recruiter = watch('recruiter');
  const driveDate = watch('start_date');
  const location_type = watch('location_type');
  const blueprint_selected = watch('blueprint_select');
  const existing_drive_date = watch('existing_drive_date');
  const type = watch('form');

  useEffect(() => {
    if (type !== 'clean_slate') {
      getAccountHavingBlueprint();
    }
  }, [type]);

  const getAccountHavingBlueprint = async () => {
    const accounts = await API.crm.crmAccounts.getAllRecruiterAccounts();
    const { data } = accounts;
    setBlueprintAccounts([
      ...(data?.data?.map((item) => {
        return {
          value: item.id,
          id: item.id,
          label: item.name,
          alternate_name: item.alternate_name,
          street_address: item.address.address1,
          city: item.address.city,
          state: item.address.state,
        };
      }) || []),
    ]);
  };

  // console.log({ selectedContacts, selectedRoles });
  const fetchProcedureTypes = async () => {
    try {
      const response = await makeAuthorizedApiRequest(
        'GET',
        `${BASE_URL}/procedure_types?goal_type=true&fetchAll=true`
      );
      const { data } = await response.json();

      const procedureOptions = data?.map((item) => {
        return {
          label: item.name,
          value: item.id,
          procedure_duration: item.procedure_duration,
        };
      });
      const productsMap = {};
      data?.map((item) => {
        productsMap[item.id] = {
          name: item?.procedure_types_products?.[0]?.products?.name,
          id: item?.procedure_types_products?.[0]?.products?.id,
          quantity: item?.procedure_types_products?.[0]?.quantity,
          yield: item?.procedure_types_products?.[0]?.quantity,
        };
      });
      setProcedureTypesList(procedureOptions);
      setProcedureProducts(productsMap);
    } catch (error) {
      console.error(`Failed to fetch Locations data ${error}`, {
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    const collection_operation_id = Object.values(collectionOperation)?.filter(
      (item) => item.name === collection_operation
    )?.[0]?.id;
    setCollectionOperationId(collection_operation_id);
  }, [collection_operation]);

  // Fetch Supplemental accounts Start
  const fetchAllSupplementalAccounts = async () => {
    if (recruiter?.value) {
      try {
        const { data } =
          await API.crm.crmAccounts.getAllRecruiterAccountsByRecruiterId(
            recruiter?.value,
            accountsSearchText
          );
        setAccountRows(data?.data);
      } catch (error) {
        toast.error(`Failed to fetch table data ${error}`, { autoClose: 3000 });
      }
    }
  };

  useEffect(() => {
    if (accountsSearchText.length >= 3 || accountsSearchText.length == 0)
      fetchAllSupplementalAccounts();
  }, [accountsSearchText]);

  useEffect(() => {
    fetchAllSupplementalAccounts();
  }, [recruiter]);
  // Fetch Supplemental accounts End

  const initialShift = [
    {
      startTime: '',
      endTime: '',
      projections: [
        { projection: 0, procedure: '25', product: '25', staffSetup: [] },
      ],
      staffSetupOptions: [],
      additionalStaffOptions: [],
      vehicleOptions: [],
      resources: [],
      devices: [],
      staffBreak: false,
      breakStartTime: '',
      breakEndTime: '',
      reduceSlot: false,
      reduction: 0,
      minOEF: 0,
      maxOEF: 0,
      minStaff: [0],
      maxStaff: [0],
    },
  ];
  const [shifts, setShifts] = useState(initialShift);

  // Fetch Devices Start
  const fetchDevices = async (index) => {
    const collectionOperationId = Object.values(collectionOperation)?.filter(
      (item) => item.name === collection_operation
    )?.[0]?.id;
    if (collectionOperationId) {
      try {
        const response = await makeAuthorizedApiRequest(
          'GET',
          `${BASE_URL}/devices/drives?collection_operation=${collectionOperationId}`
        );
        const data = await response.json();
        const deviceOptions = data?.data?.map((item) => {
          return { name: item.name, id: item.id };
        });
        setDevicesOptions(deviceOptions);
      } catch (error) {
        console.error(`Error fetching data ${error}`, {
          autoClose: 3000,
        });
      }
    }
  };

  useEffect(() => {
    fetchDevices();
  }, [collection_operation]);
  // Fetch Devices End

  const fetchEquipments = async () => {
    const { data } =
      await API.systemConfiguration.operationAdministrations.marketingEquipment.promotions.getMarketingEquipmentByCollectionOperationAndType(
        {
          collection_operations: collectionOperationId,
          type: 'COLLECTIONS',
        }
      );
    const options = data?.data?.map((item) => {
      return { label: item.name, id: item.id };
    });
    setEquipmentOptions(options);
  };

  const fetchMarketingMaterials = async () => {
    const { data } =
      await API.systemConfiguration.operationAdministrations.marketingEquipment.marketingMaterials.getMarketingEquipmentMarketingMaterialsByCollectionOperation(
        {
          collection_operations: collectionOperationId,
        }
      );
    const options = data?.data?.map((item) => {
      return { label: item.name, id: item.id };
    });
    setMarketingOptions(options);
  };

  const fetchPromotionalItems = async () => {
    const { data } =
      await API.systemConfiguration.operationAdministrations.marketingEquipment.promotionalItems.getPromotionalItemsByCollectionOperation(
        {
          collection_operations: collectionOperationId,
        }
      );
    const options = data?.data?.map((item) => {
      return { label: item.name, id: item.id };
    });
    setPromotionalOptions(options);
  };

  const fetchCertifications = async () => {
    const { data } =
      await API.systemConfiguration.staffAdmininstration.certifications.getCertificationsByType(
        'STAFF',
        true
      );
    const options = data?.data?.map((item) => {
      return { name: item.name, id: item.id };
    });
    setCertificationOptions(options);
  };

  useEffect(() => {
    if (collectionOperationId) {
      fetchEquipments();
      fetchMarketingMaterials();
      fetchPromotionalItems();
    }
  }, [collectionOperationId]);

  useEffect(() => {
    getAccounts();
    fetchRecruiters();
    fetchLocations();
    fetchData(pageNumber);
    fetchOperationStatus();
    getContactRoles();
    fetchProcedureTypes();
    fetchCertifications();
  }, []);
  useEffect(() => {
    if (accountId) fetchData(pageNumber);
  }, [accountId]);

  useEffect(() => {
    fetchPromotions();
  }, [start_date, collection_operation]);

  const BreadcrumbsData = [
    {
      label: 'Operations Center',
      class: 'disable-label',
      link: OPERATIONS_CENTER.DASHBOARD,
    },
    {
      label: 'Operations',
      class: 'disable-label',
      link: OPERATIONS_CENTER_DRIVES_PATH.LIST,
    },
    {
      label: 'Drive',
      class: 'disable-label',
      link: OPERATIONS_CENTER_DRIVES_PATH.LIST,
    },
    {
      label: editable ? 'Edit Drive' : 'Create Drive',
      class: 'active-label',
      link: editable
        ? OPERATIONS_CENTER_DRIVES_PATH.EDIT
        : OPERATIONS_CENTER_DRIVES_PATH.CREATE,
    },
  ];

  useEffect(() => {
    const contacts = selectedContacts?.map((item) => {
      return {
        accounts_contacts_id: item,
        role_id: selectedRoles?.[item]?.value,
      };
    });
    setContacts(contacts);
  }, [selectedContacts, selectedRoles]);

  const handleSubmit = async (formData) => {
    console.log({ formData });
    //  ====== Custom Fields Form Data =======
    setDisableButton(true);
    const fieldsData = [];
    // const customFieldDatableId = 0; // You can change this as needed
    const customFieldDatableType = 'drives'; // You can change this as needed
    let resulting;
    for (const key in formData) {
      if (key > 0) {
        const value = formData[key]?.value ?? formData[key];
        fieldsData.push({
          field_id: key,
          field_data:
            typeof value === 'object' && !Array.isArray(value)
              ? JSON.stringify(value)
              : value?.toString(),
        });
      }
    }
    resulting = {
      fields_data: fieldsData,
      // custom_field_datable_id: customFieldDatableId,
      custom_field_datable_type: customFieldDatableType,
    };
    // Do not remove this until development completed.
    // console.log({
    //   start_time0: moment(formData.start_time0).format('HH:mm:ss'),
    //   start_time1: moment(formData.start_time1).format('HH:mm:ss'),
    //   end_time0: moment(formData.end_time0).format('HH:mm:ss'),
    //   end_time1: moment(formData.end_time1).format('HH:mm:ss'),
    // });
    try {
      let hasErrors = false;
      if (contacts.length === 0) {
        setcustomErrors((prev) => {
          return {
            ...prev,
            contacts:
              'At least one contact with Primary Chairperson is required.',
          };
        });
        hasErrors = true;
      }

      const checkEquipment = equipment.filter((item) => {
        return item.equipment === null;
      });
      if (checkEquipment.length >= 1) {
        setcustomErrors((prev) => {
          return {
            ...prev,
            equipment: 'Equipment is required.',
          };
        });
        hasErrors = true;
      }
      const checkQuantity = equipment.filter((item) => {
        return item.quantity === '';
      });

      if (checkQuantity.length >= 1) {
        setcustomErrors((prev) => {
          return {
            ...prev,
            quantity: 'Quantity is required.',
          };
        });
        hasErrors = true;
      }

      const checkMarketingMaterialItem = marketing.filter((item) => {
        return !item.item;
      });
      if (checkMarketingMaterialItem.length >= 1) {
        setcustomErrors((prev) => {
          return {
            ...prev,
            marketingItem: 'Marketing material item is required.',
          };
        });
        hasErrors = true;
      }

      const checkMarketingMaterialquantity = marketing.filter((item) => {
        return item.mquantity === '';
      });
      if (checkMarketingMaterialquantity.length >= 1) {
        setcustomErrors((prev) => {
          return {
            ...prev,
            mquantity: 'Marketing material quantity is required.',
          };
        });
        hasErrors = true;
      }

      const checkMarketingPrmotionsItem = promotional.filter((item) => {
        return !item.item;
      });
      if (checkMarketingPrmotionsItem.length >= 1) {
        setcustomErrors((prev) => {
          return {
            ...prev,
            promotionalItem: 'Promotional Item is required.',
          };
        });
        hasErrors = true;
      }

      const checkMarketingPrmotionsQuantity = promotional.filter((item) => {
        return item.pquantity === '';
      });
      if (checkMarketingPrmotionsQuantity.length >= 1) {
        setcustomErrors((prev) => {
          return {
            ...prev,
            promotionalQuantity: 'Promotional item quantity is required.',
          };
        });
        hasErrors = true;
      }

      let shiftErrors = [];

      const ShiftsBody = shifts?.map((item, index) => {
        let projection = [];
        let shiftItemErrors = {};
        console.log('---------', { item });
        if (isEmpty(item?.startTime))
          shiftItemErrors['startTime'] = 'Start time is required.';
        if (isEmpty(item?.endTime))
          shiftItemErrors['endTime'] = 'End time is required.';

        if (item?.devices.length == 0)
          shiftItemErrors['devices'] = 'At least one device is required.';
        let projectionErrors = [];
        item?.projections?.forEach((element) => {
          let projItemErrors = {};
          if (element.projection == 0) {
            projItemErrors['projection'] = 'Projection is required.';
          }
          if (element.staffSetup.length == 0) {
            projItemErrors['staff_setup'] =
              'At least one Staff setup is required.';
          }
          if (Object.entries(projItemErrors)?.length)
            projectionErrors.push(projItemErrors);
        });
        console.log(
          '{Object.entries(projectionErrors)?.length}',
          Object.entries(projectionErrors)?.length
        );
        // console.log({ shifts });
        if (Object.entries(projectionErrors)?.length) {
          let errorArrays = [];
          for (let sh of shifts) {
            if (sh.projections.length) {
              errorArrays = sh?.projections?.map((projections) => {
                if (projections.projection) {
                  return {};
                } else
                  return {
                    projection: 'Projection is required.',
                    staff_setup: 'At least one Staff setup is required.',
                  };
              });
            }
          }
          shiftItemErrors['projections'] = errorArrays;
          console.log('errorArrays=====>', errorArrays);
          shiftErrors.push(shiftItemErrors);
        }

        for (let pro of item.projections) {
          let projection_id = pro.id;
          let procedure_type_id = +pro?.procedure?.value;
          let procedure_type_qty = +pro?.procedure?.quantity;
          let product_yield = +pro?.product?.quantity;
          let staff_setups = [];
          pro?.staffSetup?.map((staff) => {
            staff_setups.push(staff.id);
          });

          projection.push({
            id: projection_id,
            procedure_type_id,
            procedure_type_qty,
            product_yield,
            staff_setups,
          });
        }
        let count_products = 0;
        let count_procedures = 0;
        const duration =
          item?.endTime && item?.startTime
            ? moment.duration(item?.endTime.diff(item?.startTime))
            : 0;
        const hour = duration != 0 ? duration?.hours() : 0;
        let sumofProducts = 0;
        let sumofProcedures = 0;
        let sumofStaff_Setups = 0;
        item?.projections?.map((pro, indexing) => {
          sumofProducts += pro?.product?.yield;
          sumofProcedures += +pro?.procedure?.quantity;
        });
        item?.projections?.map((pro, indexing) => {
          let sumStaff = 0;
          pro?.staffSetup?.map((staff) => {
            sumStaff += +staff?.qty;
          });
          sumofStaff_Setups += sumStaff;
        });
        console.log({ hour }, { sumofProducts }, { sumofStaff_Setups });
        count_products = (sumofProducts / hour / sumofStaff_Setups).toFixed(2);
        count_procedures = (sumofProcedures / hour / sumofStaff_Setups).toFixed(
          2
        );

        const devices = item?.devices?.map((item) => item.id);
        const vehicles = item?.resources?.map((item) => item.id);
        const startTimeOfShift = moment(item?.startTime.valueOf()).utc();
        const endTimeOfShift = moment(item?.endTime.valueOf()).utc();

        const breakStartTimeOfShift = moment(
          item?.breakStartTime.valueOf()
        ).utc();
        const breakEndTimeOfShift = moment(item?.breakEndTime.valueOf()).utc();
        return {
          projections: projection,
          start_time: startTimeOfShift,
          end_time: endTimeOfShift,
          break_start_time: breakStartTimeOfShift,
          break_end_time: breakEndTimeOfShift,
          reduce_slots: item?.reduction !== 0 ? true : false,
          reduction_percentage: item?.reduction,
          oef_products: +count_products,
          oef_procedures: +count_procedures,
          devices,
          vehicles,
          // slots: Object.values(shiftSlots[index]),
        };
      });

      console.log({ ShiftsBody });
      console.log({ shiftErrors });
      if (shiftErrors.length) {
        console.log({ shiftErrors });
        setcustomErrors((prev) => ({
          ...prev,
          shifts: shiftErrors,
        }));
        hasErrors = true;
      }

      console.log({ hasErrors });

      if (hasErrors) {
        setDisableButton(false);
        return;
      }
      const body = {
        // ====== Create Drive Form ======
        date: moment(formData?.start_date).format('YYYY-MM-DD'),
        account_id: +formData?.account?.value,
        promotion_id: +formData?.promotion?.value,
        recruiter_id: +formData?.recruiter?.value,
        operations_status_id: +formData?.status?.value,
        is_multi_day_drive: formData?.multi_day,
        location_id: +formData?.location?.value,

        // ======  Custom Fields Form ======
        custom_fields: resulting,

        //  ======  Add Contacts Form ======
        contacts,
        slots: shiftSlots,

        // ====== Details Form ======
        open_to_public: formData?.open_public,
        certifications: formData?.certifications?.map((item) =>
          parseInt(item.id)
        ),
        equipment: equipment?.map((item) => {
          return { equipment_id: item.equipment.id, quantity: item.quantity };
        }),

        online_scheduling_allowed: formData?.online_scheduling_allowed,
        // ======  Marketing and Equipment Form ======
        marketing: {
          marketing_materials: marketing?.map((item) => {
            return {
              marketing_material_id: item.item.id,
              quantity: item.mquantity,
            };
          }),
          promotional_items: promotional?.map((item) => {
            return {
              promotional_item_id: item.item.id,
              quantity: item.pquantity,
            };
          }),
          marketing_start_date: formData?.marketing_start_date,
          marketing_start_time: moment(
            new Date(formData?.marketing_start_time).toLocaleString(
              'en-US',
              options
            )
          ),
          marketing_end_date: formData?.marketing_end_date,
          marketing_end_time: moment(
            new Date(formData?.marketing_end_time).toLocaleString(
              'en-US',
              options
            )
          ),
          instructional_info: formData?.instructional_information,
          donor_info: formData?.donor_information,
          order_due_date: formData?.order_due_date,
        },

        // ====== Donor Communication Form ======
        zip_codes: zipCodes,
        is_linkable: shifts?.length === 1 ? true : false,
        is_linked: selectedLinkDrive ? true : false,
        tele_recruitment_enabled: formData?.tele_recruitment,
        email_enabled: formData?.email,
        sms_enabled: formData?.sms,
        tele_recruitment_status: formData?.tele_recruitment_status,
        email_status: formData?.email_status,
        sms_status: formData?.sms_status,
        donor_communication: {
          account_ids: selectedAccounts,
        },
        shifts: ShiftsBody,
      };
      console.log({ body });
      const result = await makeAuthorizedApiRequest(
        'POST',
        `${BASE_URL}/drives`,
        JSON.stringify(body)
      );

      const { status, response } = await result.json();
      if (status === 'success') {
        setDisableButton(false);
        setSuccessModal(true);
      }
      if (status === 'error') {
        setDisableButton(false);
        toast.error(response, { autoClose: 3000 });
      }
    } catch (err) {
      setDisableButton(false);
      console.log('err', err);
      toast.error(err);
    }
  };

  const EditHandle = async (formData) => {
    console.log({ formData }, 'ediot handle');
    //  ====== Custom Fields Form Data =======
    setDisableButton(true);
    // setCheckRedirection(status);
    const fieldsData = [];
    // const customFieldDatableId = 0; // You can change this as needed
    const customFieldDatableType = 'drives'; // You can change this as needed
    let resulting;
    for (const key in formData) {
      if (key > 0) {
        const value = formData[key]?.value ?? formData[key];
        fieldsData.push({
          field_id: key,
          field_data:
            typeof value === 'object' && !Array.isArray(value)
              ? JSON.stringify(value)
              : value?.toString(),
        });
      }
    }
    resulting = {
      fields_data: fieldsData,
      // custom_field_datable_id: customFieldDatableId,
      custom_field_datable_type: customFieldDatableType,
    };
    // Do not remove this until development completed.
    // console.log({
    //   start_time0: moment(formData.start_time0).format('HH:mm:ss'),
    //   start_time1: moment(formData.start_time1).format('HH:mm:ss'),
    //   end_time0: moment(formData.end_time0).format('HH:mm:ss'),
    //   end_time1: moment(formData.end_time1).format('HH:mm:ss'),
    // });
    try {
      let hasErrors = false;
      if (contacts.length === 0) {
        setcustomErrors((prev) => {
          return {
            ...prev,
            contacts:
              'At least one contact with Primary Chairperson is required.',
          };
        });
        hasErrors = true;
      }

      const checkEquipment = equipment.filter((item) => {
        return item.equipment === null;
      });
      if (checkEquipment.length >= 1) {
        setcustomErrors((prev) => {
          return {
            ...prev,
            equipment: 'Equipment is required.',
          };
        });
        hasErrors = true;
      }
      const checkQuantity = equipment.filter((item) => {
        return item.quantity === '';
      });

      if (checkQuantity.length >= 1) {
        setcustomErrors((prev) => {
          return {
            ...prev,
            quantity: 'Quantity is required.',
          };
        });
        hasErrors = true;
      }

      const checkMarketingMaterialItem = marketing.filter((item) => {
        return !item.item;
      });
      if (checkMarketingMaterialItem.length >= 1) {
        setcustomErrors((prev) => {
          return {
            ...prev,
            marketingItem: 'Marketing material item is required.',
          };
        });
        hasErrors = true;
      }

      const checkMarketingMaterialquantity = marketing.filter((item) => {
        return item.mquantity === '';
      });
      if (checkMarketingMaterialquantity.length >= 1) {
        setcustomErrors((prev) => {
          return {
            ...prev,
            mquantity: 'Marketing material quantity is required.',
          };
        });
        hasErrors = true;
      }

      const checkMarketingPrmotionsItem = promotional.filter((item) => {
        return !item.item;
      });
      console.log({ checkMarketingPrmotionsItem }, { promotional });
      if (checkMarketingPrmotionsItem.length >= 1) {
        setcustomErrors((prev) => {
          return {
            ...prev,
            promotionalItem: 'Promotional Item is required.',
          };
        });
        hasErrors = true;
      }

      const checkMarketingPrmotionsQuantity = promotional.filter((item) => {
        return item.pquantity === '';
      });
      if (checkMarketingPrmotionsQuantity.length >= 1) {
        setcustomErrors((prev) => {
          return {
            ...prev,
            promotionalQuantity: 'Promotional item quantity is required.',
          };
        });
        hasErrors = true;
      }

      let shiftErrors = [];

      const ShiftsBody = shifts?.map((item, index) => {
        let shiftItemErrors = {};
        let projection = [];

        console.log('---------', { item });
        if (isEmpty(item?.startTime))
          shiftItemErrors['startTime'] = 'Start time is required.';
        if (isEmpty(item?.endTime))
          shiftItemErrors['endTime'] = 'End time is required.';

        if (item?.devices.length == 0)
          shiftItemErrors['devices'] = 'At least one device is required.';
        let projectionErrors = [];
        item?.projections?.forEach((element) => {
          let projItemErrors = {};
          if (element.projection == 0) {
            projItemErrors['projection'] = 'Projection is required.';
          }
          if (element.staffSetup.length == 0) {
            projItemErrors['staff_setup'] =
              'At least one Staff setup is required.';
          }
          if (Object.entries(projItemErrors)?.length)
            projectionErrors.push(projItemErrors);
        });
        console.log({ shifts });
        if (Object.entries(projectionErrors)?.length) {
          let errorArrays = [];
          for (let sh of shifts) {
            if (sh.projections.length) {
              errorArrays = sh.projections?.map((projections) => {
                if (projections.projection) {
                  return {};
                } else
                  return {
                    projection: 'Projection is required.',
                    staff_setup: 'At least one Staff setup is required.',
                  };
              });
            }
          }
          shiftItemErrors['projections'] = errorArrays;
          console.log('errorArrays=====>', errorArrays);
          shiftErrors.push(shiftItemErrors);
        }

        for (let pro of item.projections) {
          let projection_id = pro.id;
          let procedure_type_id = +pro?.procedure?.value;
          let procedure_type_qty = +pro?.procedure?.quantity;
          let product_yield = +pro?.product?.yield;
          let staff_setups = [];
          pro?.staffSetup?.map((staff) => {
            staff_setups.push(staff.id);
          });

          projection.push({
            id: projection_id,
            procedure_type_id,
            procedure_type_qty,
            product_yield,
            staff_setups,
          });
        }
        const momentStart = new Date(item?.startTime).toLocaleString(
          'en-US',
          options
        );
        const momentEnd = new Date(item?.endTime).toLocaleString(
          'en-US',
          options
        );
        let count_products = 0;
        let count_procedures = 0;
        const duration =
          item?.endTime && item?.startTime
            ? moment.duration(item?.endTime.diff(item?.startTime))
            : 0;
        const hour = duration != 0 ? duration?.hours() : 0;
        let sumofProducts = 0;
        let sumofProcedures = 0;
        let sumofStaff_Setups = 0;
        item?.projections?.map((pro, indexing) => {
          sumofProducts += pro?.product?.yield;
          sumofProcedures += +pro?.procedure?.quantity;
        });
        item?.projections?.map((pro, indexing) => {
          let sumStaff = 0;
          pro?.staffSetup?.map((staff) => {
            sumStaff += +staff?.qty;
          });
          sumofStaff_Setups += sumStaff;
        });
        console.log({ hour }, { sumofProducts }, { sumofStaff_Setups });
        count_products = (sumofProducts / hour / sumofStaff_Setups).toFixed(2);
        count_procedures = (sumofProcedures / hour / sumofStaff_Setups).toFixed(
          2
        );

        const devices = item?.devices?.map((item) => item.id);
        const vehicles = item?.resources?.map((item) => item.id);

        return {
          projections: projection,
          start_time: moment(momentStart),
          end_time: moment(momentEnd),
          break_start_time: moment(
            new Date(item?.breakStartTime).toLocaleString('en-US', options)
          ),
          break_end_time: moment(
            new Date(item?.breakEndTime).toLocaleString('en-US', options)
          ),
          reduce_slots: item?.reduction !== 0 ? true : false,
          reduction_percentage: item?.reduction,
          oef_products: +count_products,
          oef_procedures: +count_procedures,
          devices,
          vehicles,
          shift_id: item?.shift_id,
          // slots: Object.values(shiftSlots[index]),
        };
      });

      console.log({ ShiftsBody });
      console.log({ shiftErrors });
      if (shiftErrors.length) {
        console.log({ shiftErrors });
        setcustomErrors((prev) => ({
          ...prev,
          shifts: shiftErrors,
        }));
        hasErrors = true;
      }

      console.log({ hasErrors });

      if (hasErrors) {
        setDisableButton(false);
        return;
      }
      const body = {
        // ====== Create Drive Form ======
        date: moment(formData?.start_date).format('YYYY-MM-DD'),
        account_id: +formData?.account?.value,
        promotion_id: +formData?.promotion?.value,
        recruiter_id: +formData?.recruiter?.value,
        operations_status_id: +formData?.status?.value,
        is_multi_day_drive: formData?.multi_day,
        location_id: +formData?.location?.value,

        // ======  Custom Fields Form ======
        custom_fields: resulting,

        //  ======  Add Contacts Form ======
        contacts,
        slots: shiftSlots,

        // ====== Details Form ======
        open_to_public: formData?.open_public,
        certifications: formData?.certifications?.map((item) =>
          parseInt(item.id)
        ),
        equipment: equipment?.map((item) => {
          return { equipment_id: item.equipment.id, quantity: item.quantity };
        }),

        // ======  Marketing and Equipment Form ======
        marketing: {
          marketing_materials: marketing?.map((item) => {
            return {
              marketing_material_id: item.item.id,
              quantity: item.mquantity,
            };
          }),
          promotional_items: promotional?.map((item) => {
            return {
              promotional_item_id: item.item.id,
              quantity: item.pquantity,
            };
          }),
          marketing_start_date: formData?.marketing_start_date,
          marketing_start_time: moment(
            new Date(formData?.marketing_start_time).toLocaleString(
              'en-US',
              options
            )
          ),
          marketing_end_date: formData?.marketing_end_date,
          marketing_end_time: moment(
            new Date(formData?.marketing_end_time).toLocaleString(
              'en-US',
              options
            )
          ),
          instructional_info: formData?.instructional_information,
          donor_info: formData?.donor_information,
          order_due_date: formData?.order_due_date,
        },

        // ====== Donor Communication Form ======
        zip_codes: zipCodes,
        is_linkable: shifts?.length === 1 ? true : false,
        is_linked: selectedLinkDrive ? true : false,
        tele_recruitment_enabled: formData?.tele_recruitment,
        email_enabled: formData?.email,
        sms_enabled: formData?.sms,
        tele_recruitment_status: formData?.tele_recruitment_status,
        email_status: formData?.email_status,
        sms_status: formData?.sms_status,
        donor_communication: {
          account_ids: selectedAccounts,
        },
        shifts: ShiftsBody,
      };
      console.log({ body });
      const result = await makeAuthorizedApiRequest(
        'PUT',
        `${BASE_URL}/drives/${id}`,
        JSON.stringify(body)
      );
      setDisableButton(false);
      const { status, response } = await result.json();
      if (status === 'success') {
        setDisableButton(false);
        setSuccessModal(true);
      } else if (status === 'error') {
        setDisableButton(false);
        toast.error(response, { autoClose: 3000 });
      }
    } catch (err) {
      setDisableButton(false);
      console.log('err', err);
      toast.error(err);
    }
  };

  const fetchPromotions = async () => {
    if (start_date !== '' && collection_operation !== '') {
      const collectionOperationId = Object.values(collectionOperation)?.filter(
        (item) => item.name === collection_operation
      )?.[0]?.id;
      try {
        const response = await makeAuthorizedApiRequest(
          'GET',
          `${BASE_URL}/marketing-equipment/promotions/drives?collection_operation_id=${collectionOperationId}&date=${start_date}&status=${true}`
        );
        const data = await response.json();
        setPromotionsOption([
          ...((data?.data?.length > 0 &&
            data?.data?.map((item) => {
              return {
                value: item.id,
                label: item.name || '' + item.short_name || '',
              };
            })) ||
            []),
        ]);
        setPromotions([...data.data]);
      } catch (error) {
        console.error(`Error fetching data ${error}`, {
          autoClose: 3000,
        });
      }
    }
  };

  const fetchRecruiters = async () => {
    try {
      const response = await makeAuthorizedApiRequest(
        'GET',
        `${BASE_URL}/tenant-users/recruiters`
      );
      const data = await response.json();

      if (data?.data) {
        const RecruiterOptionData = data?.data?.map((item) => {
          return {
            label: item?.first_name,
            value: item?.id,
          };
        });
        setRecruiterOption(RecruiterOptionData);
      }
    } catch (error) {
      toast.error('Error fetching data:', error);
    }
  };

  const fetchOperationStatus = async () => {
    try {
      const result = await makeAuthorizedApiRequest(
        'GET',
        `${BASE_URL}/booking-drive/operation-status?appliesTo=Drives&status=true`
      );
      const data = await result.json();
      setOperationStatus([]);
      setOperationStatus([
        ...(data?.data?.map((item) => {
          return {
            value: item.id,
            label: item.name,
          };
        }) || []),
      ]);
    } catch (error) {
      toast.error('Error fetching data:', error);
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await makeAuthorizedApiRequest(
        'GET',
        `${BASE_URL}/crm/locations/withDirections`
      );
      const data = await response.json();
      setLocationsData([
        ...(data?.data?.map((item) => {
          return {
            value: item.id,
            label: item.name,
          };
        }) || []),
      ]);
      let locationTypeMap = {};
      let milesMap = {};
      let minutesMap = {};
      for (const location of data?.data || []) {
        locationTypeMap[location.id] = location.site_type;
        milesMap[location.id] =
          location?.directions?.[0]?.miles?.toFixed(2) || 0;
        minutesMap[location.id] =
          location?.directions?.[0]?.minutes?.toFixed(2) || 0;
      }
      setLocationType(locationTypeMap);
      setMiles(milesMap);
      setMinutes(minutesMap);
    } catch (error) {
      console.error(`Failed to fetch Locations data ${error}`, {
        autoClose: 3000,
      });
    }
  };
  const getAccounts = async () => {
    const accounts = await API.crm.crmAccounts.getAllRecruiterAccounts();
    const { data } = accounts;
    setAccounts([
      ...(data?.data?.map((item) => {
        return { value: item.id, label: item.name };
      }) || []),
    ]);
    let collectionOpertionMap = {};
    let territoryMap = {};
    let recruiterMap = {};
    let industryCategoryMap = {};
    let RSMOMap = {};
    for (const account of data.data) {
      collectionOpertionMap[account.id] = account.collection_operation;
      territoryMap[account.id] = account.territory;
      recruiterMap[account.id] = account.recruiter;
      RSMOMap[account.id] = account.RSMO;
      industryCategoryMap[account.id] = account.industry_category;
    }
    setCollectionOperation(collectionOpertionMap);
    setTerritory(territoryMap);
    setRecruiters(recruiterMap);
    setRSMO(RSMOMap);
    setIndustryCategories(industryCategoryMap);
  };

  const getContactRoles = async () => {
    const deviceTypeUrl = `${BASE_URL}/contact-roles?fetchAll=true&status=${true}`;
    const result = await makeAuthorizedApiRequest('GET', deviceTypeUrl);
    const data = await result.json();
    setContactRoles(
      data?.data?.map((item) => {
        return { value: item.id, label: item.name };
      })
    );
  };

  useEffect(() => {
    fetchData(1);
  }, [contactsSearchText]);

  useEffect(() => {
    getCustomFields();
  }, []);

  const getCustomFields = async () => {
    try {
      const response = await makeAuthorizedApiRequest(
        'GET',
        `${BASE_URL}/system-configuration/organization-administration/custom-fields/modules/4`
      );
      const data = await response.json();
      if (data?.status === 200) {
        setcustomFields(data.data);
      }
    } catch (error) {
      console.error(`Failed to fetch Locations data ${error}`, {
        autoClose: 3000,
      });
    }
  };
  const fetchAllVolunteerContacts = async (page, accountId) => {
    try {
      const response = await makeAuthorizedApiRequest(
        'GET',
        `${BASE_URL}/contact-volunteer/?sortOrder='asc'&account_id=${+accountId}&page=${page}&limit=3${
          contactsSearchText && contactsSearchText.length
            ? '&name=' + contactsSearchText
            : ''
        }`
      );
      const data = await response.json();
      if (data.status !== 500) {
        if (data.data.length >= 0) {
          setContactRows([]);
          const contactData = data.data;
          let outputDataArray = [];
          for (const inputData of contactData) {
            const outputData = {
              ...inputData,
              id: inputData?.ac_id,
              name: inputData?.name,
              email: inputData?.primary_email,
              phone: inputData?.primary_phone,
              city: inputData?.address_city,
            };

            outputDataArray.push(outputData);
          }
          contactsSearchText == ''
            ? setContactRows({
                ...contactRows,
                ..._.keyBy(outputDataArray, 'id'),
              })
            : setContactRows({
                ..._.keyBy(outputDataArray, 'id'),
              });
        } else {
          setLoader(false);
        }
      }
    } catch (error) {
      toast.error(`Failed to fetch table data ${error}`, {
        autoClose: 3000,
      });
    }
  };
  const fetchData = (page) => {
    setPageNumber(page);
    if (accountId) {
      fetchAllVolunteerContacts(page, accountId);
    }
  };

  useEffect(() => {
    if (blueprint_selected?.value) getBlueprintData(blueprint_selected?.value);
  }, [blueprint_selected]);

  useEffect(() => {
    if (existing_drive_date?.value)
      getBlueprintData(existing_drive_date?.value);
  }, [existing_drive_date]);

  useEffect(() => {
    if (editable) {
      getEditData(id);
    }
  }, [editable]);

  const getBlueprintData = async (id) => {
    const {
      data: { data },
    } = await API.operationCenter.drives.getSingle(id);

    const fetchedData = data?.[0];

    if (type == 'existing_drive') {
      setValue('promotion', {
        value: fetchedData?.drive?.promotion?.id,
        label: fetchedData?.drive?.promotion?.name,
      });

      setValue('status', {
        value: fetchedData?.drive?.status?.id,
        label: fetchedData?.drive?.status?.name,
      });
    }
    setAccountId(fetchedData?.account?.id);
    setValue('account', {
      value: fetchedData?.account.id.toString(),
      label: fetchedData?.account.name,
    });
    setValue(
      'collection_operation',
      fetchedData?.account?.collection_operation?.name
    );
    setValue(
      'territory',
      territory[parseInt(fetchedData?.account.id)]?.territory_name
    );
    const recruiter = recruiters[parseInt(fetchedData?.account.id)];
    recruiter &&
      setValue('recruiter', {
        value: recruiter.id,
        label: recruiter.first_name || '' + recruiter.last_name || '',
      });

    setValue('location', {
      value: fetchedData?.crm_locations.id,
      label: fetchedData?.crm_locations.name,
    });
    console.log({ locationType, miles, minutes });
    setValue(
      'location_type',
      locationType[fetchedData?.crm_locations.id.toString()] || ''
    );
    setValue('miles', miles[fetchedData?.crm_locations.id.toString()] || '');
    setValue(
      'minutes',
      minutes[fetchedData?.crm_locations.id.toString()] || ''
    );
    setTravelMinutes(minutes[fetchedData?.crm_locations.id] || 0);

    let drive_contacts_list = [];
    let roles_list = [];
    fetchedData?.drive_contacts?.map((item) => {
      drive_contacts_list.push(item.accounts_contacts_id.toString());
      roles_list[item.accounts_contacts_id.toString()] = {
        label: item.role.name,
        value: item.role.id.toString(),
      };
    });

    setSelectedRoles(roles_list);
    setSelectedContacts(drive_contacts_list);
    console.log('Fetched Blueprint', data);

    let shiftsData = [];
    for (const shiftItem of fetchedData?.shifts || []) {
      let shiftItemData = {};
      shiftItemData.shift_id = shiftItem.id;
      shiftItemData.startTime = moment(shiftItem.start_time);
      shiftItemData.endTime = moment(shiftItem.end_time);
      let projectionData = [];
      for (const shiftProjectionsStaffItem of shiftItem.shifts_projections_staff) {
        const procedureItem = {
          label: shiftProjectionsStaffItem.procedure_type.name,
          procedure_duration:
            shiftProjectionsStaffItem.procedure_type.procedure_duration.toString(),
          quantity: shiftProjectionsStaffItem.procedure_type_qty,
          value: shiftProjectionsStaffItem.procedure_id.toString(),
        };
        const productItem = {
          id: shiftProjectionsStaffItem.procedure_type.procedure_type_products[0].product_id.toString(),
          name: shiftProjectionsStaffItem.procedure_type
            .procedure_type_products[0].name,
          quantity: shiftProjectionsStaffItem.product_yield,
          yield:
            shiftProjectionsStaffItem.procedure_type.procedure_type_products[0]
              .quantity,
        };

        const projectionItem = {
          label: shiftProjectionsStaffItem.procedure_type.name,
          procedure_duration:
            shiftProjectionsStaffItem.procedure_type.procedure_duration.toString(),
          value: shiftProjectionsStaffItem.procedure_id.toString(),
        };

        const staffSetupItem = shiftProjectionsStaffItem?.staff_setup?.map(
          (item) => {
            return {
              beds: item.beds,
              concurrent_beds: item.concurrent_beds,
              id: item.id.toString(),
              name: item.name,
              qty: item.qty,
              stagger: item.stagger_slots,
            };
          }
        );
        projectionData.push({
          id: shiftProjectionsStaffItem.id,
          procedure: procedureItem,
          product: productItem,
          projection: projectionItem,
          staffSetup: staffSetupItem,
        });
      }
      shiftItemData.projections = projectionData;
      shiftItemData.devices =
        shiftItem.shifts_devices?.map((item) => {
          return { id: item.id.toString(), name: item.name };
        }) || [];
      shiftItemData.resources =
        shiftItem.shifts_vehicles?.map((item) => {
          return { id: item.id.toString(), name: item.name };
        }) || [];
      shiftItemData.staffBreak =
        typeof shiftItem.break_start_time == 'string' ||
        typeof shiftItem.break_end_time == 'string'
          ? true
          : false;
      if (shiftItemData.staffBreak) {
        shiftItemData.breakStartTime = moment(shiftItem.break_start_time);
        shiftItemData.breakEndTime = moment(shiftItem.break_end_time);
        shiftItemData.reduceSlot = shiftItem.reduce_slots;
        shiftItemData.reduction = shiftItem.reduction_percentage;
      }

      shiftsData.push(shiftItemData);
    }
    setShifts(shiftsData);
    setValue('open_public', fetchedData?.drive?.open_to_public);

    const equipmentsList = fetchedData?.drives_equipments?.map((item) => {
      return {
        equipment: {
          id: item.id,
          label: item.equipment_id[0].name,
        },
        quantity: item.quantity,
      };
    });
    setEquipment(equipmentsList);
    setValue(
      'certifications',
      fetchedData?.drives_certifications?.map((item) => {
        return {
          id: item.certificate_id?.[0]?.id,
          name: item.certificate_id?.[0]?.name,
        };
      }) || []
    );
    setValue(
      'marketing_start_date',
      new Date(fetchedData?.drive?.marketing_start_date)
    );
    setValue(
      'marketing_end_date',
      new Date(fetchedData?.drive?.marketing_end_date)
    );
    setValue(
      'marketing_start_time',
      moment(fetchedData?.drive?.marketing_start_time)
    );
    setValue(
      'marketing_end_time',
      moment(fetchedData?.drive?.marketing_start_time)
    );
    setValue(
      'instructional_information',
      fetchedData?.drive?.instructional_information
    );
    setValue('donor_information', fetchedData?.drive?.donor_information);
    const marketingList = fetchedData?.drives_marketing_materials?.map(
      (item) => {
        return {
          item: {
            id: item.id,
            label: item.marketing_materials[0].name,
          },
          mquantity: item.quantity,
        };
      }
    );
    setMarketing(marketingList);
    setValue('order_due_date', new Date(fetchedData?.drive?.order_due_date));
    const promotionalList = fetchedData?.drives_promotional_items?.map(
      (item) => {
        return {
          item: {
            id: item.id,
            label: item.promotional_items[0].name,
          },
          pquantity: item.quantity,
        };
      }
    );
    setPromotional(promotionalList);
    setValue('tele_recruitment', fetchedData?.drive?.tele_recruitment);
    setValue('email', fetchedData?.drive?.email);
    setValue('sms', fetchedData?.drive?.sms);
    setSelectedAccounts(
      fetchedData?.drives_supp_accounts?.map((item) => item.id) || []
    );
    setZipCodes(fetchedData?.zip_codes?.map((item) => item.zip_code) || []);
  };
  useEffect(() => {
    if (editData && miles) {
      setValue('location_type', editData?.crm_locations?.site_type || '');
      setValue('miles', miles[editData?.crm_locations.id] || 0);
      setValue('minutes', minutes[editData?.crm_locations.id] || 0);
      setTravelMinutes(minutes[editData?.crm_locations.id] || 0);
    }
  }, [miles, editData]);

  const getEditData = async (id) => {
    const data = await API.operationCenter.drives.getSingle(id);
    console.log({ data });
    const fetchedData = data?.data?.data?.[0];
    setEditData(data?.data?.data?.[0]);
    console.log(fetchedData, 'fetchedData');
    setValue('account', {
      value: fetchedData?.account.id.toString(),
      label: fetchedData?.account.name,
    });
    setAccountId(fetchedData?.account.id);
    console.log({ fetchedData });
    // collectionOperation[parseInt(fetchedData?.account.id)]?.name ??
    setValue(
      'collection_operation',
      fetchedData?.account?.collection_operation?.name
    );
    // setCollectionOperation();
    // territory[parseInt(fetchedData?.account.id)]?.territory_name ??
    setValue('territory', fetchedData?.account?.territory?.territory_name);

    setValue('promotion', {
      value: fetchedData?.drive?.promotion?.id,
      label: fetchedData?.drive?.promotion?.name,
    });

    setValue('status', {
      value: fetchedData?.drive?.status?.id,
      label: fetchedData?.drive?.status?.name,
    });

    setValue('recruiter', {
      value: fetchedData?.account?.recruiter?.id,
      label:
        fetchedData?.account?.recruiter?.first_name ||
        '' + fetchedData?.account?.recruiter?.last_name ||
        '',
    });

    const date = moment(fetchedData?.drive?.date).format('MM-DD-YYYY');
    setValue('start_date', new Date(date));
    setValue('location', {
      value: fetchedData?.crm_locations?.id,
      label: fetchedData?.crm_locations?.name,
    });

    let drive_contacts_list = [];
    let roles_list = [];
    fetchedData?.drive_contacts?.map((item) => {
      drive_contacts_list.push(item.accounts_contacts_id.toString());
      roles_list[item.accounts_contacts_id.toString()] = {
        label: item.role.name,
        value: item.role.id.toString(),
      };
    });

    setSelectedRoles(roles_list);
    setSelectedContacts(drive_contacts_list);
    console.log('Fetched Blueprint', data);

    const modified = data?.data?.customFieldsData?.map((item) => {
      return item.field_id;
    });
    console.log({ modified });
    setcustomFields(modified);
    const fieldsToUpdate = data?.data?.customFieldsData;
    fieldsToUpdate?.forEach(({ field_id: { id, pick_list }, field_data }) => {
      let updatedValue;

      if (pick_list.length > 0) {
        const matchingPickItem = pick_list.find((pickItem) => {
          if (typeof field_data === 'boolean') {
            return pickItem.type_value === field_data;
          } else {
            return pickItem.type_value === field_data.toString();
          }
        });

        if (matchingPickItem) {
          updatedValue = {
            label: matchingPickItem.type_name,
            value: matchingPickItem.type_value,
          };
        } else {
          // If no match is found, use the first pick list item as a fallback
          updatedValue = {
            label: '',
            value: '',
          };
        }
      } else {
        updatedValue = field_data;
      }
      setValue(id, updatedValue);
    });

    let shiftsData = [];
    for (const shiftItem of fetchedData?.shifts || []) {
      let shiftItemData = {};
      shiftItemData.shift_id = shiftItem.id;
      shiftItemData.startTime = moment(shiftItem.start_time);
      shiftItemData.endTime = moment(shiftItem.end_time);
      let projectionData = [];
      for (const shiftProjectionsStaffItem of shiftItem.shifts_projections_staff) {
        const procedureItem = {
          label: shiftProjectionsStaffItem.procedure_type.name,
          procedure_duration:
            shiftProjectionsStaffItem.procedure_type.procedure_duration.toString(),
          quantity: shiftProjectionsStaffItem.procedure_type_qty,
          value: shiftProjectionsStaffItem.procedure_id.toString(),
        };
        const productItem = {
          id: shiftProjectionsStaffItem.procedure_type.procedure_type_products[0].product_id.toString(),
          name: shiftProjectionsStaffItem.procedure_type
            .procedure_type_products[0].name,
          quantity: shiftProjectionsStaffItem.product_yield,
          yield:
            shiftProjectionsStaffItem.procedure_type.procedure_type_products[0]
              .quantity,
        };

        const projectionItem = {
          label: shiftProjectionsStaffItem.procedure_type.name,
          procedure_duration:
            shiftProjectionsStaffItem.procedure_type.procedure_duration.toString(),
          value: shiftProjectionsStaffItem.procedure_id.toString(),
        };

        const staffSetupItem = shiftProjectionsStaffItem?.staff_setup?.map(
          (item) => {
            return {
              beds: item.beds,
              concurrent_beds: item.concurrent_beds,
              id: item.id.toString(),
              name: item.name,
              qty: item.qty,
              stagger: item.stagger_slots,
            };
          }
        );
        projectionData.push({
          id: shiftProjectionsStaffItem.id,
          procedure: procedureItem,
          product: productItem,
          projection: projectionItem,
          staffSetup: staffSetupItem,
        });
      }
      shiftItemData.projections = projectionData;
      shiftItemData.devices =
        shiftItem.shifts_devices?.map((item) => {
          return { id: item.id.toString(), name: item.name };
        }) || [];
      shiftItemData.resources =
        shiftItem.shifts_vehicles?.map((item) => {
          return { id: item.id.toString(), name: item.name };
        }) || [];
      shiftItemData.staffBreak =
        typeof shiftItem.break_start_time == 'string' ||
        typeof shiftItem.break_end_time == 'string'
          ? true
          : false;
      if (shiftItemData.staffBreak) {
        shiftItemData.breakStartTime = moment(shiftItem.break_start_time);
        shiftItemData.breakEndTime = moment(shiftItem.break_end_time);
        shiftItemData.reduceSlot = shiftItem.reduce_slots;
        shiftItemData.reduction = shiftItem.reduction_percentage;
      }

      shiftsData.push(shiftItemData);
    }
    setShifts(shiftsData);
    setValue('open_public', fetchedData?.drive?.open_to_public);

    const equipmentsList = fetchedData?.drives_equipments?.map((item) => {
      return {
        equipment: {
          id: item.id,
          label: item.equipment_id[0].name,
        },
        quantity: item.quantity,
      };
    });
    setEquipment(equipmentsList);
    setValue(
      'certifications',
      fetchedData?.drives_certifications?.map((item) => {
        return {
          id: item.certificate_id?.[0]?.id,
          name: item.certificate_id?.[0]?.name,
        };
      }) || []
    );
    setValue(
      'marketing_start_date',
      new Date(fetchedData?.drive?.marketing_start_date)
    );
    setValue(
      'marketing_end_date',
      new Date(fetchedData?.drive?.marketing_end_date)
    );
    setValue(
      'marketing_start_time',
      moment(fetchedData?.drive?.marketing_start_time)
    );
    setValue(
      'marketing_end_time',
      moment(fetchedData?.drive?.marketing_start_time)
    );
    setValue(
      'instructional_information',
      fetchedData?.drive?.instructional_information
    );
    setValue('donor_information', fetchedData?.drive?.donor_information);
    const marketingList = fetchedData?.drives_marketing_materials?.map(
      (item) => {
        return {
          item: {
            id: item.id,
            label: item.marketing_materials[0].name,
          },
          mquantity: item.quantity,
        };
      }
    );
    setMarketing(marketingList);
    setValue('order_due_date', new Date(fetchedData?.drive?.order_due_date));
    const promotionalList = fetchedData?.drives_promotional_items?.map(
      (item) => {
        return {
          item: {
            id: item.id,
            label: item.promotional_items[0].name,
          },
          pquantity: item.quantity,
        };
      }
    );
    setPromotional(promotionalList);
    setValue('tele_recruitment', fetchedData?.drive?.tele_recruitment);
    setValue('email', fetchedData?.drive?.email);
    setValue('sms', fetchedData?.drive?.sms);
    setSelectedAccounts(
      fetchedData?.drives_supp_accounts?.map((item) => item.id) || []
    );
    setZipCodes(fetchedData?.zip_codes?.map((item) => item.zip_code) || []);
    console.log('Fetched Blueprint', equipmentsList);
  };

  const handleArchive = async () => {
    try {
      const response = await API.operationCenter.drives.archive(id);
      const { data } = response;
      const { status_code: status } = data;
      if (status === 204) {
        setArchiveSuccess(true);
        setArchivePopup(false);
        navigate(OPERATIONS_CENTER_DRIVES_PATH.LIST);
      } else if (response?.status === 400) {
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
  };

  return (
    <div className="mainContent">
      <TopBar
        BreadCrumbsData={BreadcrumbsData}
        BreadCrumbsTitle={'Drive'}
        SearchValue={null}
        SearchOnChange={null}
        SearchPlaceholder={null}
      />

      <div
        className="mainContentInner p-0 mt-4"
        style={{ border: '1px solid #F5F5F5' }}
      >
        <form className={styles.account} style={{ marginBottom: '150px' }}>
          {!editable && (
            <SelectDriveForm
              control={control}
              watch={watch}
              selectedAccount={selectedAccount}
              selectedBlueprint={selectedBlueprint}
              setSelectedBlueprint={setSelectedBlueprint}
              setSelectedAccount={setSelectedAccount}
              setShifts={setShifts}
              initialShift={initialShift}
              setValue={setValue}
              setTravelMinutes={setTravelMinutes}
              setSelectedAccounts={setSelectedAccounts}
              setZipCodes={setZipCodes}
              setEquipment={setEquipment}
              setPromotional={setPromotional}
              setMarketing={setMarketing}
              setSelectedContacts={setSelectedContacts}
              blueprintAccounts={blueprintAccounts}
              setBlueprintAccounts={setBlueprintAccounts}
              blueprintList={blueprintList}
              setBlueprintList={setBlueprintList}
            />
          )}
          <CreateDriveForm
            editable={editable}
            control={control}
            formErrors={formErrors}
            setValue={setValue}
            accounts={accounts}
            collectionOperation={collectionOperation}
            territory={territory}
            operationStatus={operationStatus}
            recruiters={recruiters}
            recruiterOptions={recruiterOptions}
            promotions={promotions}
            promotiomsOption={promotiomsOption}
            locationsData={locationsData}
            setAccountId={setAccountId}
            accountId={accountId}
            RSMO={RSMO}
            getValues={getValues}
            watch={watch}
            miles={miles}
            minutes={minutes}
            locationType={locationType}
            setTravelMinutes={setTravelMinutes}
            initialShift={initialShift}
            setShifts={setShifts}
            setSelectedContacts={setSelectedContacts}
            setSelectedRoles={setSelectedRoles}
          />

          <CustomFieldsForm
            control={control}
            locationsData={locationsData}
            formErrors={formErrors}
            customFileds={customFileds}
          />

          <AddContactsSection
            customErrors={customErrors}
            setAddContactsModal={setAddContactsModal}
            selectedContacts={selectedContacts}
            setSelectedContacts={setSelectedContacts}
            selectedRoles={selectedRoles}
            setSelectedRoles={setSelectedRoles}
            contactRoles={contactRoles}
            contactRows={contactRows}
          />
          {shifts?.map((shift, index) => {
            return (
              <ShiftForm
                key={index}
                shift={shift}
                index={index}
                control={control}
                getValues={getValues}
                setShifts={setShifts}
                shifts={shifts}
                errors={customErrors?.shifts?.[index]}
                formErrors={formErrors}
                shiftDevicesOptions={devicesOptions}
                collectionOperationId={collectionOperationId}
                driveDate={driveDate}
                travelMinutes={travelMinutes}
                procedureProducts={procedureProducts}
                procedureTypesList={procedureTypesList}
                location_type={location_type}
                industryCategories={industryCategories}
                watch={watch}
                isOverrideUser={isOverrideUser}
                allowAppointmentAtShiftEndTime={
                  bookingRules?.maximum_draw_hours_allow_appt || false
                }
                shiftSlots={shiftSlots}
                setShiftSlots={setShiftSlots}
                staffSetupShiftOptions={staffSetupShiftOptions}
                setStaffSetupShiftOptions={setStaffSetupShiftOptions}
                selectedLinkDrive={selectedLinkDrive}
                setSelectedLinkDrive={setSelectedLinkDrive}
              />
            );
          })}

          <DetailsForm
            customErrors={customErrors}
            setcustomErrors={setcustomErrors}
            control={control}
            formErrors={formErrors}
            equipment={equipment}
            setEquipment={setEquipment}
            singleEquipmentOption={equipmentOptions}
            certificationOptions={certificationOptions}
            getValues={getValues}
          />

          <MarketingEquipmentForm
            setValue={setValue}
            customErrors={customErrors}
            setCustomErrors={setcustomErrors}
            approvals={approvals}
            control={control}
            formErrors={formErrors}
            marketing={marketing}
            setMarketing={setMarketing}
            promotional={promotional}
            setPromotional={setPromotional}
            singleItemOption={marketingOptions}
            promotionalOptions={promotionalOptions}
            getValues={getValues}
            watch={watch}
          />
          <DonorCommunicationForm
            setValue={setValue}
            approvals={approvals}
            control={control}
            setAddAccountsModal={setAddAccountsModal}
            selectedAccounts={selectedAccounts}
            setSelectedAccounts={setSelectedAccounts}
            accountRows={accountRows}
            zipCodes={zipCodes}
            setZipCodes={setZipCodes}
          />
          <AddContactsModal
            setcustomErrors={setcustomErrors}
            setAddContactsModal={setAddContactsModal}
            addContactsModal={addContactsModal}
            contactRows={contactRows}
            contactsSearchText={contactsSearchText}
            setContactsSearchText={setContactsSearchText}
            accountContactsList={accountContactsList}
            setAccountContactsList={setAccountContactsList}
            selectedContacts={selectedContacts}
            setSelectedContacts={setSelectedContacts}
            selectedRoles={selectedRoles}
            setSelectedRoles={setSelectedRoles}
            contactRoles={contactRoles}
            fetchData={fetchData}
            loader={loader}
            setPrimaryChairPersonModal={setPrimaryChairPersonModal}
            setPrimaryChairPersonModalContent={
              setPrimaryChairPersonModalContent
            }
            setContactsCloseModal={setContactsCloseModal}
            setPageNumber={setPageNumber}
            pageNumber={pageNumber}
          />
          <AddAccountsModal
            setAddAccountsModal={setAddAccountsModal}
            addAccountsModal={addAccountsModal}
            selectedAccounts={selectedAccounts}
            setSelectedAccounts={setSelectedAccounts}
            accountRows={accountRows}
            accountsSearchText={accountsSearchText}
            setAccountsSearchText={setAccountsSearchText}
          />
        </form>
        <div className="form-footer">
          {editable ? (
            <>
              <div
                onClick={() => {
                  setArchivePopup(true);
                }}
                className="archived"
              >
                <span>Archive</span>
              </div>
            </>
          ) : null}
          <button
            className="btn btn-secondary border-0"
            onClick={(e) => {
              e.preventDefault();
              setCloseModal(true);
            }}
            disabled={disableButton}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={!editable ? onSubmit(handleSubmit) : onSubmit(EditHandle)}
            disabled={disableButton}
            className={`btn ${editable ? 'btn-secondary' : 'btn-primary'}`}
          >
            {editable ? `Save & Close` : `Create`}
          </button>

          {editable ? (
            <button
              type="button"
              onClick={
                !editable ? onSubmit(handleSubmit) : onSubmit(EditHandle)
              }
              disabled={disableButton}
              className={`btn btn-primary`}
            >
              Save Changes
            </button>
          ) : null}
        </div>
      </div>
      {editable ? (
        <>
          <div
            onClick={() => {
              setArchivePopup(true);
            }}
            className="archived"
          >
            <span>Archive</span>
          </div>
          <section
            className={`popup full-section ${archivePopup ? 'active' : ''}`}
          >
            <div className="popup-inner">
              <div className="icon">
                <img src={ConfirmArchiveIcon} alt="CancelIcon" />
              </div>
              <div className="content">
                <h3>Confirmation</h3>
                <p>Are you sure you want to archive?</p>
                <div className="buttons">
                  <button
                    className="btn btn-secondary"
                    onClick={() => {
                      setArchivePopup(false);
                    }}
                  >
                    No
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleArchive()}
                  >
                    Yes
                  </button>
                </div>
              </div>
            </div>
          </section>
        </>
      ) : null}
      <CancelModalPopUp
        title="Confirmation"
        message="Unsaved changes will be lost, do you wish to proceed?"
        modalPopUp={closeModal}
        isNavigate={true}
        setModalPopUp={setCloseModal}
        redirectPath={-1}
      />
      <CancelModalPopUp
        title="Confirmation"
        message="Unsaved changes will be lost, do you wish to proceed?"
        modalPopUp={contactsCloseModal}
        setModalPopUp={setContactsCloseModal}
        methods={() => {
          // setSelectedContacts([]);
          // setSelectedRoles([]);
          setAddContactsModal(false);
          setContactsSearchText('');
          setContactsCloseModal(false);
        }}
        methodsToCall={true}
      />
      <SuccessPopUpModal
        title="Success!"
        message="Drive created."
        modalPopUp={redirection}
        isNavigate={true}
        setModalPopUp={setRedirection}
        showActionBtns={true}
        redirectPath={-1}
      />
      <SuccessPopUpModal
        title="Success!"
        message="Drive created."
        modalPopUp={successModal}
        isNavigate={true}
        setModalPopUp={setSuccessModal}
        showActionBtns={true}
        redirectPath={`#`}
      />
      <WarningModalPopUp
        title="Warning!"
        message={primaryChairPersonModalContent}
        modalPopUp={primaryChairPersonModal}
        isNavigate={false}
        setModalPopUp={setPrimaryChairPersonModal}
        showActionBtns={true}
        confirmAction={() => {
          setPrimaryChairPersonModal(false);
        }}
      />
      <SuccessPopUpModal
        title="Success!"
        message="Drive archived."
        modalPopUp={archiveSuccess}
        setModalPopUp={setArchiveSuccess}
        showActionBtns={true}
        onConfirm={() => {
          setArchiveSuccess(false);
        }}
      />
    </div>
  );
}

export default DrivesUpsert;
