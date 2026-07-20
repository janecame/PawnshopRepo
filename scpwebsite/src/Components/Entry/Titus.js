import React, { useEffect, useState } from "react";
import { UserSession } from "../../Functions/UtilityFunctions";
import CustomModal from "../../filipModal/CustomModal";
import { useTitus } from "../../Hooks/useEntriesQueries";
import DataTable from "react-data-table-component";




const customStyles = {
  rows: {
    style: {
      cursor: "pointer",  // 👈 makes rows show pointer on hover
    },
  },
};


const Titus = () => {

    const { CNCode } = UserSession();
    const { data: titus = [], isLoading, isError, isFetching } = useTitus(CNCode);

    const [title, setTitle] = useState("");
    const [show, setShow] = useState(false);

    const [isUpdate, setIsUpdate] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const [getData, setData] = useState([]);
    const [getUpdate, setUpdate] = useState([]);


    const filteredData = titus.filter(
      (item) =>
        item.titusCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.titusDesc?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.titusDescSub?.toLowerCase().includes(searchTerm.toLowerCase())
    );


  
    const HandleAdd = () => {
      setTitle("titus");
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
      setTitle("titus");
      setShow(true);
    };
  
    
      const columns = [
        {
          name: "Titus Code",
          selector: (row) => row.titusCode,
          width: "100px",
        },
        {
          name: "Titus Description",
          selector: (row) => row.titusDesc,
        }
        
    ];


    if (isLoading && titus.length === 0) {
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
    if (isError && titus.length === 0) {
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
      <h6 className="p-2">Titus</h6>
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
              Add Titus
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


         {isFetching && titus.length > 0 && (
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


export default Titus