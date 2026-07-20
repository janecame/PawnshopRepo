import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { GetCompany } from "../../Functions/AxiosFunction";
import CompanyEditModal from "../Modals/CompanyEditModal";

export default function Company() {
  const { user } = useAuth();
  const [cnCode, setCNCode] = useState("");
  const [company, setCompany] = useState({});

  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    if (user?.cnCode) {
      setCNCode(user.cnCode);
    }
  }, [user]);

  useEffect(() => {
    if (cnCode !== "") {
      fetchCompany();
    }
  }, [cnCode]);

  const fetchCompany = async () => {
    const response = await GetCompany();
    // console.log(response);

    if (response) {
      setCompany(response);
    }
  };

  const handleClose = () => {
    setShowEditModal(false);
  };

  const handleShow = () => {
    setShowEditModal(true);
  };

  const reload = () => {
    fetchCompany();
  };

  return (
    <>
      <CompanyEditModal
        show={showEditModal}
        handleClose={handleClose}
        data={company}
        reload={reload}
      />

      <div className="bg-prim d-flex justify-content-between">
        <h6 className="p-2">Company</h6>
      </div>
      <div className="table-responsive p-2">
        <table className="table table-sm table-hover table-striped border border-2">
          <thead>
            <tr>
              <th>Company Name</th>
              <th>Address</th>
              <th>TIN</th>
            </tr>
          </thead>
          <tbody>
            <tr onClick={handleShow}>
              <td>{company.Company}</td>
              <td>{company.Address}</td>
              <td>{company.TIN}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
