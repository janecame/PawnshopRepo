import React, { useEffect, useState } from 'react'
import { UserSession } from "../../Functions/UtilityFunctions";
import CustomModal from "../../filipModal/CustomModal";
import { useDiamondShape } from "../../Hooks/useEntriesQueries";
import DataTable from "react-data-table-component";


const customStyles = {
  rows: {
    style: {
      cursor: "pointer",  // 👈 makes rows show pointer on hover
    },
  },
};



const DiamondShape = () => {

    const { CNCode } = UserSession();
    const { data: diamonds = [], isLoading, isError, isFetching } = useDiamondShape(CNCode);

    const [searchTerm, setSearchTerm] = useState("");
    const [title, setTitle] = useState('')
    const [show, setShow] = useState(false)
    const [getUpdate,setUpdate] = useState([])
    const [isUpdate, setIsUpdate] = useState(false);


    const filteredData = diamonds.filter(
      (item) =>
        item.diamondShapeCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.diamondShapeDesc?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.diaShapeDescSub?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    

    const HandleAdd = ()=>{
        setTitle('diamond')
        setShow(true)
    }
    const handleClose =()=>{
        setShow(false);
        setIsUpdate(false)
        setUpdate({});
    }
    const handleUpdate =(item)=>{

        setIsUpdate(true)
        setTitle("diamond");
        setUpdate(item);
        setShow(true)

    }


      const columns = [
        {
          name: "Diamond Code",
          selector: (row) => row.diamondShapeCode,
          width: "100px",
        },
        {
          name: "Diamond Description",
          selector: (row) => row.diamondShapeDesc,
        }
        
    ];



    // first load
    if (isLoading && diamonds.length === 0) {
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
    if (isError && diamonds.length === 0) {
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
   {/*<CentralizeModal
        show={show}
        handleClose={handleClose}
        title={getTitle}
        cnCode={cnCode}
        update={getUpdate}
        PageName={PageName}
        success={ListofData}

      />*/}

      <CustomModal show={show} handleClose={handleClose} entry={title} update={getUpdate} isUpdate={isUpdate} />


      <div className="bg-prim d-flex justify-content-between">
        <h6 className="p-2">Diamond Shape</h6>
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
                Add Diamond Shape
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

           {isFetching && diamonds.length > 0 && (
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

export default DiamondShape
