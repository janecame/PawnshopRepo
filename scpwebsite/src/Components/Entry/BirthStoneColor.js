import React, { useEffect, useState } from "react";

import { UserSession } from "../../Functions/UtilityFunctions";
import CustomModal from "../../filipModal/CustomModal";
import { useBirthStoneColor } from "../../Hooks/useEntriesQueries";
import DataTable from "react-data-table-component";


const customStyles = {
  rows: {
    style: {
      cursor: "pointer",  // 👈 makes rows show pointer on hover
    },
  },
};



const BirthStoneColor = () => {

    const { CNCode } = UserSession();
    const { data: bsColors = [], isLoading, isError, isFetching } = useBirthStoneColor(CNCode);

    const [title, setTitle] = useState("");
    const [show, setShow] = useState(false);
    const [getUpdate, setUpdate] = useState([]);
    
    const [isUpdate, setIsUpdate] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredData = bsColors.filter(
      (item) =>
        item.bsColorCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.bsColorDesc?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.bsColorDescSub?.toLowerCase().includes(searchTerm.toLowerCase())
    );


    const HandleAdd = () => {
      setTitle("bsColor");
      setShow(true);
    };
    const handleClose = () => {
      setShow(false);
      setIsUpdate(false)
      setUpdate({});

    };
    const handleUpdate = (item) => {
      setIsUpdate(true)
      setUpdate(item)
      setTitle("bsColor");
      setShow(true);
    };
    

    const columns = [
        {
          name: "Birthstone Code",
          selector: (row) => row.bsColorCode,
          width: "100px",
        },
        {
          name: "Birthstone Description",
          selector: (row) => row.bsColorDesc,
        }
        
    ];



    // first load
    if (isLoading && bsColors.length === 0) {
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
    if (isError && bsColors.length === 0) {
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
          <h6 className="p-2">Birth Stone Color</h6>
        </div>
        <div className="w-100 p-2">
          {/* <div className="mx-auto w-75 p-2 shadow border-top-sec rounded"> */}
          <div className="table-responsive text-center">
            <div className="d-flex justify-content-between">
              <div>
                <button
                  className="btn btn-sm bg-prim d-flex align-content-start"
                  onClick={() => {
                    HandleAdd();
                  }}
                >
                  Add Birth Stone Color
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
            
            {isFetching && bsColors.length > 0 && (
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
    );
}

export default BirthStoneColor;

