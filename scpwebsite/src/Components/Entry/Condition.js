import { useState } from "react";
import DataTable from "react-data-table-component";

import { UserSession } from "../../Functions/UtilityFunctions";
import CustomModal from "../../filipModal/CustomModal";
import { useConditions } from "../../Hooks/useEntriesQueries";




const customStyles = {
  rows: {
    style: {
      cursor: "pointer",  // 👈 makes rows show pointer on hover
    },
  },
};


const Condition = () => {
  const { CNCode } = UserSession();
  const { data: conditions = [], isLoading, isError, isFetching } = useConditions(CNCode);

  //const [cnCode, setCNCode] = useState(UserSession().CNCode);
  
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState("");
  const [getUpdate, setUpdate] = useState(null);
  const [isUpdate, setIsUpdate] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");


  const filteredData = conditions.filter(
    (item) =>
      item.conditionCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.conditionDesc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.conditionDescSub.toLowerCase().includes(searchTerm.toLowerCase())
    // item.contactNo.includes(searchTerm) ||
    // item.zipCode.includes(searchTerm)
  );

  //All Handle Fucntion
  const handleClose = () => {
    setShow(false);
    setIsUpdate(false)
    setUpdate({});
  };
  const HandleAdd = () => {
    setShow(true);
    setTitle("condition");
  };
  const handleUpdate = (item) => {
    
    setIsUpdate(true)
    setTitle("condition");
    setUpdate(item);
    setShow(true)
  };



  const columns = [
        {
          name: "Condition Code",
          selector: (row) => row.conditionCode,
          width: "100px",
        },
        {
          name: "Condition Description",
          selector: (row) => row.conditionDesc,
        }      
  ];



  // first load
  if (isLoading && conditions.length === 0) {
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
  if (isError && conditions.length === 0) {
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
        <h6 className="p-2">Condition</h6>
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
                Add Condition
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

          {isFetching && conditions.length > 0 && (
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

        <div className="d-flex gap-2 justify-content-end"></div>
      </div>
    </>
  );
}

export default Condition;