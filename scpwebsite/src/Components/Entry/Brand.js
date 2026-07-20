import React, { useEffect, useState } from "react";


import { UserSession } from "../../Functions/UtilityFunctions";
import CustomModal from "../../filipModal/CustomModal";
import { useBrands } from "../../Hooks/useEntriesQueries";
import DataTable from "react-data-table-component";


const customStyles = {
  rows: {
    style: {
      cursor: "pointer",  // 👈 makes rows show pointer on hover
    },
  },
};



const Brand = () => {
    
    const { CNCode } = UserSession();
    const { data: brands = [], isLoading, isError, isFetching } = useBrands(CNCode);

    const [title, setTitle] = useState("");
    const [show, setShow] = useState(false);

    const [getData, setData] = useState([]);
    const [getUpdate, setUpdate] = useState([]);

    const [isUpdate, setIsUpdate] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    
    const filteredData = brands.filter(
      (item) =>
        item.brandCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.brandDesc?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.brandDescSub?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const HandleAdd = () => {
      setTitle("brand");
      setShow(true);
    };
    const handleClose = () => {
      setIsUpdate(false)
      setUpdate({});

      setShow(false);
    };
    const handleUpdate = (item) => {
      setIsUpdate(true)
      setUpdate(item)
      setTitle("brand");
      setShow(true);
    };
  
  const columns = [
        {
          name: "Brand Code",
          selector: (row) => row.brandCode,
          width: "100px",
        },
        {
          name: "Brand Description",
          selector: (row) => row.brandDesc,
        }
        
    ];



  // first load
    if (isLoading && brands.length === 0) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <p>Loading data...</p>
        </div>
      );
    }

    // first load error
    if (isError && brands.length === 0) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <p>Sorry, data couldn't load. Contact your administrator.</p>
        </div>
      );
    }
  return (
    <>
    <CustomModal show={show} handleClose={handleClose} entry={title} update={getUpdate} isUpdate={isUpdate} />

    <div className="bg-prim d-flex justify-content-between">
      <h6 className="p-2">Brand</h6>
    </div>
    <div className="w-100 p-2">
      {/* <div className="mx-auto w-75 p-2 shadow border-top-sec rounded"> */}
      <div className="table-responsive text-center">
        <div className="d-flex justify-content-between">
          <div>
            <button
              className="btn btn-sm bg-prim d-flex align-content-start"
              onClick={HandleAdd}
            >
              Add Brand
            </button>
          </div>

          <div className="form-group col-md-12 col-lg-6 mb-3 d-flex align-items-center">
            <span className="d-flex fw-bold me-2">Search:</span>
            <input
              type="text"
              className="form-control"
              placeholder="Search . . . . . . . ."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {isFetching && brands.length > 0 && (
            <p style={{ textAlign: "center" }}>Refreshing...</p>
          )}


          <DataTable
            columns={columns}
            data={filteredData}
            striped
            highlightOnHover
            dense
            pagination
            responsive
            onRowClicked={row => handleUpdate(row)}
            customStyles={customStyles}
          />
      </div>

    </div>
  </>
  )
}


export default Brand;