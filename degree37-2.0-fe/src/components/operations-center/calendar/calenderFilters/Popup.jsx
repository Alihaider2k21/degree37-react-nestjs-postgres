import React, { useState } from 'react';
import styles from './Popup.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { API } from '../../../../api/api-routes';
import Styles from '../index.module.scss';
const RecursiveComponent = ({
  items,
  parentChecked = false,
  onItemChecked,
}) => {
  const [expand, setExpand] = useState([]);
  const [checked, setChecked] = useState([]);
  React.useEffect(() => {
    setChecked(parentChecked ? items.map((item) => getItemId(item)) : []);
  }, [items, parentChecked]);

  React.useEffect(() => {
    setExpand([]);
  }, [items]);

  const getItemId = (item) => item?.id;
  // item.bu_id
  //   ? item.bu_id
  //   : item?.donor_center
  //   ? `${item.id}-donor_center`
  //   : `${item.user_id}-recruiter`
  const getItemName = (item) => item?.name;
  // item?.bu_name
  //   ? item.bu_name.trim()
  //   : item?.donor_center
  //   ? item?.name.trim()
  //   : `${item?.user_first_name} ${item?.user_last_name}`.trim();

  const handleExpand = (item, isExpanded) => {
    const item_id = getItemId(item);
    setExpand(
      isExpanded
        ? expand.filter((val) => val !== item_id)
        : [...expand, item_id]
    );
  };

  const handleChecked = (item, isChecked) => {
    const item_id = getItemId(item);
    setChecked(
      isChecked
        ? checked.filter((val) => val !== item_id)
        : [...checked, item_id]
    );

    onItemCheckedRecursively(item, !isChecked);
  };

  const onItemCheckedRecursively = (item, isChecked) => {
    const item_id = getItemId(item);
    if (!item?.ignore) {
      const is_collection_operation = !!item.ol_is_collection_operation;
      const is_donor_center = !!item.donor_center;
      const is_recruiter = !!item.role_is_recruiter;
      onItemChecked(
        {
          id: item_id,
          name: getItemName(item),
          is_collection_operation,
          is_donor_center,
          is_recruiter,
          parent_id: is_donor_center
            ? `${item?.collection_operation}`
            : is_recruiter
            ? `${item?.user_business_unit}`
            : null,
        },
        isChecked
      );
    }
    if (Array.isArray(item.children) && item.children) {
      item.children.forEach((child) => {
        onItemCheckedRecursively(child, isChecked);
      });
    }
  };

  return (
    <ul>
      {items?.map((item, index) => {
        const isExpanded = expand.includes(getItemId(item));
        const isChecked = checked.includes(getItemId(item));
        return (
          <li key={index}>
            {item.children?.length ? (
              <span onClick={() => handleExpand(item, isExpanded)}>
                {isExpanded ? (
                  <FontAwesomeIcon
                    width={15}
                    height={15}
                    icon={faMinus}
                    color="#005375"
                  />
                ) : (
                  <FontAwesomeIcon
                    width={15}
                    height={15}
                    icon={faPlus}
                    color="#005375"
                  />
                )}
              </span>
            ) : null}
            <input
              type="checkbox"
              checked={isChecked}
              onClick={() => handleChecked(item, isChecked)}
            />
            {getItemName(item)}
            {isExpanded && Array.isArray(item.children) ? (
              <RecursiveComponent
                items={item.children}
                parentChecked={isChecked}
                onItemChecked={onItemChecked}
              />
            ) : null}
          </li>
        );
      })}
    </ul>
  );
};

const OrganizationalPopup = ({
  value,
  showConfirmation,
  onCancel,
  onConfirm,
  heading,
  description,
  classes,
  cancelBtnText = 'Cancel',
  confirmBtnText = 'Apply',
  disabled = false,
  showDonorCenters = false,
  showRecruiters = false,
}) => {
  const [hierarchy, setHierarchy] = React.useState([]);
  const [checkedItems, setCheckedItems] = React.useState([]);
  const bearerToken = localStorage.getItem('token');

  React.useEffect(() => {
    const fetchOrganizationalLevels = async () => {
      const {
        data: { data },
      } =
        await API.operationCenter.calender.filters.getOrganization(bearerToken);
      setHierarchy(convertToHierarchy(data));
    };

    if (!value || !hierarchy.length) fetchOrganizationalLevels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, showDonorCenters, showRecruiters]);
  const convertToHierarchy = (flatRecords) => {
    const map = new Map();
    const items = [];

    // Create a map for quick access to each record by its ID
    flatRecords.forEach((record) => {
      map.set(record.id, {
        ...record,
        children: [],
      });
    });

    // Build the hierarchy
    flatRecords.forEach((record) => {
      const parentLevel = map.get(record.parent_level?.id);
      const item = map.get(record.id);

      if (parentLevel) {
        parentLevel.children.push(item);
      } else {
        items.push(item);
      }
    });
    return items;
    // return items.filter((record) => {
    //   console.log('record', record);
    //   return record.children.length || record.parent_level;
    // });
  };

  const handleItemChecked = (item, isChecked) => {
    setCheckedItems((prev) =>
      isChecked
        ? [...prev, item]
        : prev.filter((record) => record.id !== item.id)
    );
  };

  const handleConfirm = () => {
    if (checkedItems?.length) {
      const co = checkedItems.map((item) => {
        return item?.id;
      });
      onConfirm(co?.length ? co : '');
    }
  };

  return (
    <section
      className={`${styles.popup} ${showConfirmation && styles.active} ${
        classes?.root ?? ''
      }`}
    >
      <div className={`${styles.popupInner} ${classes?.inner ?? ''}`}>
        <div className={styles.content}>
          {heading ? <h3>{heading}</h3> : ''}
          {description ? <p>{description}</p> : ''}
          <div className={styles.hierarchy}>
            <RecursiveComponent
              items={hierarchy}
              onItemChecked={handleItemChecked}
            />
          </div>
        </div>
        <div
          className="d-flex justify-content-end"
          // style={{ position: 'absolute', bottom: '30px', right: '30px' }}
          style={{ marginTop: '5px' }}
        >
          <div
            className={Styles.cancelBtn}
            onClick={() => {
              setCheckedItems([]);
              onCancel();
            }}
            // onClick={() => {
            // handleOrganizationalPopUpChange(false);
            // setCheckedIds([]);
            // setOrganizationalPopUp(false);
            // }}
          >
            {cancelBtnText}
          </div>
          <div onClick={handleConfirm} className={Styles.applyBtn}>
            {confirmBtnText}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrganizationalPopup;
