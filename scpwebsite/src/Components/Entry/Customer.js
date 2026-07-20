import { useState } from "react";
import CustModal from "../../filipModal/CustModal";
import { UserSession } from "../../Functions/UtilityFunctions";
import { useCustomers } from "../../Hooks/useEntriesQueries";
import DataTable from "react-data-table-component";


const customStyles = {
  rows: {
    style: {
      cursor: "pointer",  // 👈 makes rows show pointer on hover
    },
  },
};


const Customer = () => {
  const [show, setShow] = useState(false);
  const [getTitle, setTile] = useState(null);
  
  const [getUpdate, setUpdate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { CNCode } =  UserSession();

  const { data: customers = [], isLoading, isError, isFetching } = useCustomers(CNCode);


  const filteredData = customers.filter(
    (item) =>
      item.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.middleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.contactNo.includes(searchTerm) ||
      item.zipCode.includes(searchTerm)
  );
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleClose = () => {
    setShow(false);
  };
  const HandleAdd = () => {
    setShow(true);
    setTile("Customer Add");
  };
  const HandleUpdate = (item) => {
    if(item.birthdate === null){
      item.birthdate = "";
    }
    setUpdate(item);
    setShow(true);
    setTile("Customer Update");
  };

  

  const columns = [
        {
          name: "Lastname",
          selector: (row) => row.lastName,
          width: "100px",
        },
        {
          name: "MiddleName",
          selector: (row) => row.middleName,
        },
        {
          name: "Firstname",
          selector: (row) => row.firstName,
        },
        {
          name: "Contact No.",
          selector: (row) => row.contactNo,
        },
        {
          name: "Zip Code",
          selector: (row) => row.zipCode,
        },
        {
          name: "Status",
          // instead of selector, use cell to render JSX
          cell: (row) => (
            <span
              className={`badge ${
                row.active === "True" ? "bg-success" : "bg-danger"
              }`}
            >
              {row.active === "True" ? "Active" : "Inactive"}
            </span>
          ),
          center: true, // optional: aligns content center
          width: "120px",
        },

        
    ];










  // first load
  if (isLoading && customers.length === 0) {
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
  if (isError && customers.length === 0) {
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
      <CustModal
        update={getUpdate}
        show={show}
        handleClose={handleClose}
        title={getTitle}
        cnCode={CNCode}
      />

      <div className="bg-prim d-flex justify-content-between">
        <h6 className="p-2">Customer</h6>
        <h6 className="p-2">NO: {customers.length}</h6>
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
                Add Customer
              </button>
            </div>

            <div className="form-group col-md-12 col-lg-6 mb-3 d-flex align-items-center">
              <span className="d-flex fw-bold me-2">Search:</span>
              <input
                type="text"
                className="form-control"
                placeholder="Search . . . . . . . ."
                value={searchTerm}
                onChange={handleSearchChange} 
              />
            </div>
          </div>

          {isFetching && customers.length > 0 && (
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
            onRowClicked={row => HandleUpdate(row)}
            customStyles={customStyles}
          />

        </div>
      </div>
    </>
  );
}



export default Customer;