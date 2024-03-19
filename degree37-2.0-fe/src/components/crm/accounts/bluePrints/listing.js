import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  CRM_ACCOUNT_BLUEPRINT_PATH,
  OPERATIONS_CENTER_DRIVES_PATH,
} from '../../../../routes/path';
import './index.scss';
import TableList from '../../../common/tableListing';
import Pagination from '../../../common/pagination';
import SelectDropdown from '../../../common/selectDropdown';
import moment from 'moment';
import { API } from '../../../../api/api-routes';
import CancelModalPopUp from '../../../common/cancelModal';

export default function BluePrintListing({ search }) {
  const { account_id } = useParams();
  const [sortName, setSortName] = useState('');
  const [order, setOrder] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [limit, setLimit] = useState(process.env.REACT_APP_PAGE_LIMIT ?? 5);
  const [statusDataText, setStatusDataText] = useState({
    label: 'Active',
    value: true,
  });
  const [totalRecords, setTotalRecords] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [accountData, setAccountData] = useState(null);
  const [closeModal, setCloseModal] = useState(false);
  const [defaultRowData, setDefaultRowData] = useState(null);

  const optionsConfig = [
    {
      label: 'View',
      path: (rowData) =>
        `${CRM_ACCOUNT_BLUEPRINT_PATH.ABOUT.replace(
          ':account_id',
          account_id
        ).replace(':id', rowData?.bluePrintId)}`,
      action: (rowData) => {},
    },
    {
      label: 'Edit',
      path: (rowData) =>
        `${OPERATIONS_CENTER_DRIVES_PATH.EDIT.replace(
          ':id',
          rowData?.drive_id
        )}`,
      action: (rowData) => {},
    },
    {
      label: 'Schedule Drive',
      path: (rowData) =>
        `${OPERATIONS_CENTER_DRIVES_PATH.CREATE}?accountId=${account_id}&blueprintId=${rowData?.bluePrintId}`,
    },
    {
      label: 'Make Default',
      action: (rowData) => {
        setCloseModal(true);
        setDefaultRowData(rowData);
      },
    },
  ];

  const handleMakeDefault = async (data) => {
    await API.crm.crmAccounts.makeDefaultBlueprint(
      parseInt(account_id),
      parseInt(data.bluePrintId)
    );
    fetchAccountData();
    setDefaultRowData(null);
    setCloseModal(false);
  };
  const tableHeaders = [
    {
      name: 'blueprint_name',
      label: 'Blueprint Name',
      width: '14%',
      sortable: true,
    },
    {
      name: 'location',
      label: 'Location',
      width: '10%',
      sortable: true,
    },
    {
      name: 'hours',
      label: 'Hours',
      width: '16%',
    },
    {
      name: 'procedures',
      label: 'Procedures',
      width: '10%',
      sortable: true,
    },
    {
      name: 'products',
      label: 'Products',
      width: '16%',
      sortable: true,
    },
    {
      name: 'status',
      label: 'Status',
      width: '16%',
      sortable: true,
    },
  ];

  useEffect(() => {
    fetchAccountData();
  }, [order, sortName, limit, currentPage, search, statusDataText]);

  const fetchAccountData = async () => {
    setIsLoading(true);
    try {
      let currentpage = currentPage;
      if (search) {
        currentpage = 1;
        setCurrentPage(1);
      }
      let blueprint_name;
      let location;
      let drive_id;
      let hours = '';
      let procedures;
      let products;
      let status, bluePrintId;
      let data;
      let data2;
      const response = await fetch(
        `${
          process.env.REACT_APP_BASE_URL
        }/accounts/bluePrints/${account_id}/get?page=${currentpage}&limit=${limit}&${
          order ? `sortOrder=${order}` : ''
        }&${sortName ? `sortName=${sortName}` : 'sortName='}&${
          statusDataText ? `status=${statusDataText.value}` : 'status='
        }${search && `&keyword=${search}`}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      const response2 = await fetch(
        `${
          process.env.REACT_APP_BASE_URL
        }/accounts/bluePrintsDefault/${account_id}/get?page=${currentpage}&limit=${limit}&${
          order ? `sortOrder=${order}` : ''
        }&${sortName ? `sortName=${sortName}` : 'sortName='}&${
          statusDataText ? `status=${statusDataText.value}` : 'status='
        }${search && `&keyword=${search}`}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      const res = await response.json();
      const res2 = await response2.json();
      setTotalRecords(res?.data?.count ? res?.data?.count : 10);
      if (res.status == 'success') {
        data = res?.data?.data.map((item, index) => {
          blueprint_name =
            item?.account?.name + ' ' + item?.crm_locations?.name;
          location =
            item?.crm_locations?.address?.address1 +
            ' ' +
            item?.crm_locations?.address?.address2;
          const max = item?.shifts?.length;
          if (max) {
            const start = moment(item?.shifts[0]?.start_time).format('h:mm A');
            const end = moment(
              item?.shifts[max ? max - 1 : 0]?.end_time
            ).format('h:mm A');
            hours = start && end ? start + '-' + end : 'N/A';
          } else {
            hours = 'null';
          }
          // procedures = item?.Procedures?.procedure_count;
          if (item && item?.shifts) {
            let sum = 0;
            let sumProducts = 0;

            for (const shift of item?.shifts || []) {
              if (shift?.qty) {
                for (const qtyObject of shift.qty) {
                  sum += parseInt(qtyObject?.procedure_type_qty) || 0;
                  sumProducts += parseInt(qtyObject?.product_yield) || 0;
                }
              }
            }
            procedures = sum;
            products = sumProducts;
          }
          drive_id = item?.drives_id;
          // products = item?.Products?.product_count;
          status = item?.is_active;
          bluePrintId = item?.drives_id;
          return {
            default: item.drives_is_default_blueprint,
            blueprint_name,
            location,
            drive_id,
            hours,
            procedures,
            products,
            status,
            bluePrintId,
          };
        });
      }
      if (res2.status == 'success') {
        data2 = res2?.data?.data.map((item2, index2) => {
          blueprint_name =
            item2?.account?.name + ' ' + item2?.crm_locations?.name;
          location =
            item2?.crm_locations?.address?.address1 +
            ' ' +
            item2?.crm_locations?.address?.address2;
          const max = item2?.shifts?.length;
          if (max) {
            const start = moment(item2?.shifts[0]?.start_time).format('h:mm A');
            const end = moment(
              item2?.shifts[max ? max - 1 : 0]?.end_time
            ).format('h:mm A');
            hours = start && end ? start + '-' + end : 'N/A';
          } else {
            hours = 'null';
          }
          // procedures = item?.Procedures?.procedure_count;
          if (item2 && item2?.shifts) {
            item2?.shifts.map((shift, index) => {
              if (shift?.qty) {
                let sumProcedures = 0;
                let sumProducts = 0;

                shift.qty.forEach((qtyObject) => {
                  sumProcedures += parseInt(qtyObject?.procedure_type_qty) || 0;
                  sumProducts += parseInt(qtyObject?.product_yield) || 0;
                });

                return { procedures: sumProcedures, products: sumProducts };
              }
            });
          }
          drive_id = item2?.drives_id;
          // products = item2?.Products?.product_count;
          status = item2?.is_active;
          bluePrintId = item2?.drives_id;
          return {
            default: item2.drives_is_default_blueprint,
            blueprint_name,
            location,
            drive_id,
            hours,
            procedures,
            products,
            status,
            bluePrintId,
          };
        });
      }
      const tempData = data2 && data2[0] ? [data2[0], ...data] : data;
      setAccountData(tempData);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error('Error fetching account data:', error);
    }
    setIsLoading(false);
  };

  const handleSort = (name) => {
    setSortName(name);
    setOrder(order === 'ASC' ? 'DESC' : 'ASC');
  };
  return (
    <div className="mainContent">
      <div style={{ padding: '0px 24px' }}>
        <div className="mb-3 filterBar px-0 accountFilters">
          <div className="filterInner">
            <h2>Filters</h2>
            <div className="filter">
              <form className="d-flex align-items-center gap-4 ">
                <div className="" style={{ width: '255px' }}>
                  <div className="" style={{ width: '255px' }}>
                    <SelectDropdown
                      placeholder={'Status'}
                      selectedValue={statusDataText}
                      defaultValue={statusDataText}
                      showLabel={statusDataText ? true : false}
                      removeDivider
                      name="Status"
                      onChange={(val) => {
                        setStatusDataText(val);
                        setCurrentPage(1);
                      }}
                      options={[
                        {
                          label: 'Active',
                          value: true,
                        },
                        {
                          label: 'Inactive',
                          value: false,
                        },
                      ]}
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
        <TableList
          isLoading={isLoading}
          data={accountData}
          headers={tableHeaders}
          handleSort={handleSort}
          sortName={sortName}
          optionsConfig={optionsConfig}
          showActionsLabel={true}
        />
        <Pagination
          limit={limit}
          setLimit={setLimit}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalRecords={totalRecords}
        />
        {closeModal ? (
          <CancelModalPopUp
            title="Confirmation"
            message="Are you sure you want to make this the default?"
            modalPopUp={closeModal}
            isNavigate={false}
            setModalPopUp={setCloseModal}
            methods={() => handleMakeDefault(defaultRowData)}
            methodsToCall={true}
            isInfo={true}
          />
        ) : null}
      </div>
    </div>
  );
}
