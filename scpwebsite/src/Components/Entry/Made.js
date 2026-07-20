import React, { useEffect, useState } from "react";
import CentralizeModal from "../../filipModal/CentralizeModal";
import { UserSession } from "../../Functions/UtilityFunctions";
import { GetMadeList } from "../../API/GetListData";

import CustomModal from "../../filipModal/CustomModal";
import { useMade } from "../../Hooks/useEntriesQueries";
import DataTable from "react-data-table-component";

const customStyles = {
  rows: {
    style: {
      cursor: "pointer",  // 👈 makes rows show pointer on hover
    },
  },
};



const Made = () => {

    const { CNCode } = UserSession();

    const { data: mades = [], isLoading, isError, isFetching } = useMade(CNCode);

    const [title, setTitle] = useState("");
    const [show, setShow] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [getUpdate, setUpdate] = useState([]);
    const [isUpdate, setIsUpdate] = useState(false);

    const filteredData = mades.filter(
      (item) =>
        item.madeCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.madeDesc?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.madeDescSub?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const HandleAdd = () => {
      setTitle("made");
      setShow(true);
    };
    const handleClose = () => {
      setShow(false);

      setIsUpdate(false)
      setUpdate({});
    };
    const handleUpdate = (item) => {
      
      setIsUpdate(true)

      setTitle("made");
      setUpdate(item)
      setShow(true);

    };



    const columns = [
        {
          name: "Made Code",
          selector: (row) => row.madeCode,
          width: "100px",
        },
        {
          name: "Made Description",
          selector: (row) => row.madeDesc,
        }
        
    ];



    // first load
    if (isLoading && mades.length === 0) {
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
    if (isError && mades.length === 0) {
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
      <h6 className="p-2">Made</h6>
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
              Add Made
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

        
        {isFetching && mades.length > 0 && (
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

export default Made;
