import Layout from '@/components/Layouts'
import ContentLayout from '@/components/Layouts/Content'
import useStaffAPI from '@/pages/api/master/staff';
import React, { useState } from 'react'

export default function index() {

  const [staff, setStaff] = useState({});
  const { GetAllStaffByUserNik } = useStaffAPI();

  const HandleFetchStaffByNik = async (nik) => {
    try {
      const response = await GetAllStaffByUserNik(nik);
      if (response === undefined || response === null) return;
      setStaff(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout>
        <ContentLayout type='child' title="Staf">
            Halaman Staff
        </ContentLayout>
    </Layout>
  )
}
