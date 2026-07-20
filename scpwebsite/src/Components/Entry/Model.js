import React, { useState } from "react";
import { UserSession } from "../../Functions/UtilityFunctions";
import CustomModal from "../../filipModal/CustomModal";
import { useModels } from "../../Hooks/useEntriesQueries";
import DataTable from "react-data-table-component";



const customStyles = {
  rows: {
    style: {
      cursor: "pointer",  // 👈 makes rows show pointer on hover
    },
  },
};


export default function Model() {
    const { CNCode } = UserSession();
    const { data: models = [], isLoading, isError, isFetching } = useModels(CNCode);

    const [title, setTitle] = useState("");
    const [show, setShow] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [getUpdate, setUpdate] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    
    
    const filteredData = models.filter(
      (item) =>
        item.modelCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.modelDesc?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.modelDescSub?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const HandleAdd = () => {
      setTitle("model");
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
      setTitle("model");
      setShow(true);
    };
  
  

    const columns = [
          {
            name: "Model Code",
            selector: (row) => row.modelCode,
            width: "100px",
          },
          {
            name: "Model Description",
            selector: (row) => row.modelDesc,
          }
          
      ];



    // first load
    if (isLoading && models.length === 0) {
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
    if (isError && models.length === 0) {
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
      <h6 className="p-2">Model</h6>
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
              Add Model
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

        
          {isFetching && models.length > 0 && (
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
        {/* <Pagination
          currentPage={currentPageSub}
          totalPages={totalPagesSub}
          onPageChange={handlePageChangeSub}
        /> */}
      </div>

      <div className="d-flex gap-2 justify-content-end"></div>
    </div>
  </>
  )
}
