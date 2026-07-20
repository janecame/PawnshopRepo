import React, { useEffect, useState } from "react";

import { UserSession } from "../../Functions/UtilityFunctions";
import CustomModal from "../../filipModal/CustomModal";
import { useItems, useListCategory } from "../../Hooks/useEntriesQueries";
import DataTable from "react-data-table-component";

const customStyles = {
  rows: {
    style: {
      cursor: "pointer",  // 👈 makes rows show pointer on hover
    },
  },
};



const Items = () => {

  const { CNCode } = UserSession();
  const { data: items = [], isLoading: itemsLoading, isError: itemsError, isFetching } = useItems(CNCode);
  const { data: categories, isLoading: categoriesLoading, error: categoriesError } = useListCategory();


  const [title, setTitle] = useState("");
  const [show, setShow] = useState(false);
  
  const [getUpdate, setUpdate] = useState([]);
  const [getCateg, setCateg] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);

  const PageName = "items";

  const isLoading = categoriesLoading || itemsLoading;
  const isError = categoriesError || itemsError;

  const itemsWithCategory = items.map(item => {
    const matchedCategory = categories.find(cat => cat.catCode === item.catCode)
    return {
      ...item,
      category: matchedCategory ? matchedCategory.catDesc : "NA"
    }
  })

  
  const filteredData = itemsWithCategory.filter(
    (item) =>
      item.itemCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.itemDesc?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const HandleAdd = () => {
    setTitle("item");
    setShow(true);
  };
  const handleClose = () => {
    setShow(false);
    setIsUpdate(false)
    setUpdate({});
  };
  const handleUpdate = (item) => {
    setIsUpdate(true)
    setTitle("item");
    setUpdate(item);
    setShow(true)
    
  };

  const columns = [
        {
          name: "Item Code",
          selector: (row) => row.itemCode,
          width: "100px",
        },
        {
          name: "Item Description",
          selector: (row) => row.itemDesc,
        },
        {
          name: "Item Category",
          selector: (row) => row.category,
        }
        
    ];



  // first load
  if (isLoading && items.length === 0) {
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
  if (isError && items.length === 0) {
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
        success={GetList}
      />*/}

      <CustomModal show={show} handleClose={handleClose} entry={title} update={getUpdate} isUpdate={isUpdate} />


      <div className="bg-prim d-flex justify-content-between">
        <h6 className="p-2">Items</h6>
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
                Add Items
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

          {isFetching && items.length > 0 && (
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

export default Items;
