import ListNotes from '../../../../common/DocumentComponent/Notes/ListNotes';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { API } from '../../../../../api/api-routes';

export default function NotesList({ search }) {
  const { account_id } = useParams();

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  useEffect(() => {
    getCategory();
    getsubCategory();
  }, []);
  const getCategory = async () => {
    try {
      const response =
        await API.systemConfiguration.crmAdministration.account.noteCategories.getAll();
      if (response?.data?.data?.data) {
        const category = response?.data?.data?.data;
        setCategories(category);
      }
    } catch (error) {
      toast.error(error);
    }
  };
  const getsubCategory = async () => {
    try {
      const response =
        await API.systemConfiguration.crmAdministration.account.noteSubcategories.getAll();
      if (response?.data?.data?.data) {
        const category = response?.data?.data?.data;
        setSubCategories(category);
      }
    } catch (error) {
      toast.error(error);
    }
  };
  return (
    <div className="mainContent">
      <ListNotes
        noteable_type={'accounts'}
        categories={categories}
        search={search}
        subCategories={subCategories}
        notesListPath={`/crm/accounts/${account_id}/view/documents/notes`}
        attachmentsListPath={`/crm/accounts/${account_id}/view/documents/attachments`}
        addNotesLink={`/crm/accounts/${account_id}/view/documents/notes/create`}
      />
    </div>
  );
}
