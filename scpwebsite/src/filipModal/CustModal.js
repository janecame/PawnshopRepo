import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { AutoNumCustCode } from "../API/AutoNum";
import { InsertCustomer } from "../API/Insert";
import { UserSession } from "../Functions/UtilityFunctions";
import { useSnackbar } from '../contexts/SnackbarContext';
import { UpdateCustomer } from "../API/Update";
import { useCustomers } from "../Hooks/useEntriesQueries";

function CustModal(props) {
  const { CNCode } = UserSession();
  const snackbar = useSnackbar();

  const [loading, setLoading] = useState(false);
  const [getNum, setNum] = useState("");
  const { refetch: refetchCustomers } = useCustomers(CNCode);

  const InitialState = {
    CNCode: UserSession().CNCode,
    ControlNo: "",
    LastName: "",
    FirstName: "",
    MiddleName: "",
    BuildingNo: "",
    Street: "",
    Brgy: "",
    City: "",
    Province: "",
    ZipCode: "",
    Birthdate: "",
    ContactNo: "",
    ValidIDNumber: "",
    EmailAddress: "",
    Address: '',
    Active: ''
  };

  const [getCustData, setCustData] = useState(InitialState);

  const handleCustData = (e) => {
    const { name, type, checked, value } = e.target;
    setCustData({
      ...getCustData,
      [name]: type === "checkbox" ? (checked ? "True" : "False") : value
    });
  };

  const handleSubmit = async () => {
    if (getCustData.FirstName === "") return snackbar.error("Firstname is required.");
    if (getCustData.LastName === "") return snackbar.error("Lastname is required.");
    if (getCustData.MiddleName === "") return snackbar.error("Middlename is required.");
    if (getCustData.ContactNo === "") return snackbar.error("Contact No is required.");

    if (getCustData.Birthdate === "") {
      getCustData.Birthdate = null;
    }

    try {
      const data = await InsertCustomer(getCustData);

      if (data === "Inserted") {
        setCustData(InitialState);
        CustCodeNum();
        snackbar.success("Successfully saved!");
        setLoading(false);
        refetchCustomers();
      } else {
        snackbar.warning("Failed to save!");
      }
    } catch (error) {
      snackbar.error("Failed to save! Something went wrong.");
    }
  };

  const handleUpdate = async () => {
    try {
      const data = await UpdateCustomer(getCustData);
      if (data === "Updated") {
        setCustData(InitialState);
        CustCodeNum();
        snackbar.success("Successfully saved!");
        setLoading(false);
        refetchCustomers();
        props.handleClose();
      } else {
        snackbar.warning("Failed to save!");
      }
    } catch (error) {
      // handled by snackbar above
    }
  };

  const CustCodeNum = async () => {
    try {
      if (props.cnCode !== "") {
        const res = await AutoNumCustCode(props.cnCode);
        setNum(res);
      }
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    setLoading(false);
    if (props.title === null) {
    } else if (props.title === "Customer Add") {
      setCustData(InitialState);
      CustCodeNum();
    } else if (props.title === "Customer Update") {
      console.log(props.update);
      setCustData({
        ...InitialState,
        ControlNo: props.update.controlNo || "",
        LastName: props.update.lastName || "",
        FirstName: props.update.firstName || "",
        MiddleName: props.update.middleName || "",
        BuildingNo: props.update.buildingNo || "",
        Street: props.update.street || "",
        City: props.update.city || "",
        Province: props.update.province || "",
        ZipCode: props.update.zipCode || "",
        Birthdate: props.update.birthdate.split("T")[0] || "",
        ContactNo: props.update.contactNo || "",
        ValidIDNumber: props.update.validIDNumber || "",
        EmailAddress: props.update.emailAddress || "",
        Address: props.update.address || "",
        Active: props.update.active || ""
      });
    }
  }, [props]);

  return (
    <Dialog
      open={props.show}
      onClose={props.handleClose}
      disableEscapeKeyDown
      maxWidth="md"
      fullWidth
      scroll="paper"
    >
      <DialogTitle sx={{ p: 2, fontSize: "1.1rem" }}>
        {props.title}
      </DialogTitle>
      <DialogContent dividers>
        <div className="d-flex justify-content-end mb-3">
          <input
            required
            type="text"
            className="form-control w-25 text-end"
            disabled
            value={props.title === 'Customer Update' ? getCustData.ControlNo : getNum}
            onChange={() => { handleCustData(); }}
          />
        </div>

        {/* Name Details */}
        <div className="border border-1 d-flex justify-content-center form-control mb-3 position-relative">
          <span className="details">Name Details</span>
          <div className="d-flex gap-3 mt-4">
            <div className="form-floating mb-2">
              <input
                required
                type="text"
                className="form-control"
                id="lastname"
                placeholder="Company Name"
                name="LastName"
                value={getCustData.LastName}
                onChange={handleCustData}
              />
              <label htmlFor="lastname">Lastname</label>
            </div>
            <div className="form-floating mb-3">
              <input
                required
                type="text"
                className="form-control"
                id="firstname"
                placeholder="Company Name"
                name="FirstName"
                value={getCustData.FirstName}
                onChange={handleCustData}
              />
              <label htmlFor="firstname">Firstname</label>
            </div>
            <div className="form-floating mb-2">
              <input
                required
                type="text"
                className="form-control"
                id="middlename"
                placeholder="Company Name"
                name="MiddleName"
                value={getCustData.MiddleName}
                onChange={handleCustData}
              />
              <label htmlFor="middlename">Middlename</label>
            </div>
          </div>
        </div>

        {/* Address Details */}
        <div className="border border-1 d-md-grid justify-content-center form-control p-4 position-relative">
          <span className="details">Address Details</span>
          <div className="d-flex gap-3 justify-content-center">
            <div className="form-floating mb-2">
              <input
                required
                type="text"
                className="form-control"
                id="BuildingNo"
                placeholder="Company Name"
                name="BuildingNo"
                value={getCustData.BuildingNo}
                onChange={handleCustData}
              />
              <label htmlFor="BuildingNo">Building No.</label>
            </div>
            <div className="form-floating mb-3">
              <input
                required
                type="text"
                className="form-control"
                id="street"
                placeholder="Company Name"
                name="Street"
                value={getCustData.Street}
                onChange={handleCustData}
              />
              <label htmlFor="street">Street/Street</label>
            </div>
            <div className="form-floating mb-2">
              <input
                required
                type="text"
                className="form-control"
                id="Brgy"
                placeholder="Company Name"
                name="Brgy"
                value={getCustData.Brgy}
                onChange={handleCustData}
              />
              <label htmlFor="Brgy">Barangay</label>
            </div>
          </div>
          <div className="d-flex gap-3 justify-content-center">
            <div className="form-floating mb-2">
              <input
                required
                type="text"
                className="form-control"
                id="City"
                placeholder="Company Name"
                name="City"
                value={getCustData.City}
                onChange={handleCustData}
              />
              <label htmlFor="City">City/Municipality</label>
            </div>
            <div className="form-floating mb-3">
              <input
                required
                type="text"
                className="form-control"
                id="province"
                placeholder="Company Name"
                name="Province"
                value={getCustData.Province}
                onChange={handleCustData}
              />
              <label htmlFor="province">Province</label>
            </div>
            <div className="form-floating mb-2">
              <input
                required
                type="text"
                className="form-control"
                id="ZipCode"
                placeholder="Company Name"
                name="ZipCode"
                value={getCustData.ZipCode}
                onChange={handleCustData}
              />
              <label htmlFor="ZipCode">Zip Code</label>
            </div>
          </div>
        </div>

        {/* Personal Details */}
        <div className="border border-1 d-md-grid justify-content-center form-control p-4 position-relative mt-3">
          <span className="details">Details</span>
          <div className="d-flex gap-3 justify-content-center">
            <div className="form-floating mb-2">
              <input
                required
                type="date"
                className="form-control"
                id="Birthdate"
                placeholder="Company Name"
                name="Birthdate"
                value={getCustData.Birthdate}
                onChange={handleCustData}
              />
              <label htmlFor="Birthdate">BirthDate</label>
            </div>
            <div className="form-floating mb-3">
              <input
                required
                type="text"
                className="form-control"
                id="contactNo"
                placeholder="Company Name"
                name="ContactNo"
                value={getCustData.ContactNo}
                onChange={handleCustData}
              />
              <label htmlFor="contactNo">Contact No.</label>
            </div>
            <div className="form-floating mb-2">
              <input
                required
                type="text"
                className="form-control"
                id="validId"
                placeholder="Company Name"
                name="ValidIDNumber"
                value={getCustData.ValidIDNumber}
                onChange={handleCustData}
              />
              <label htmlFor="validId">Valid ID Number</label>
            </div>
          </div>
          <div className="d-flex gap-3 justify-content-center">
            <div className="form-floating mb-2">
              <input
                required
                type="EmailAddress"
                className="form-control"
                id="EmailAddress"
                placeholder="Company Name"
                name="EmailAddress"
                value={getCustData.EmailAddress}
                onChange={handleCustData}
              />
              <label htmlFor="EmailAddress">EmailAddress</label>
            </div>
          </div>
          <div className="d-md-grid mt-2 justify-content-center">
            <input
              type="checkbox"
              name="Active"
              checked={getCustData.Active === 'True'}
              onChange={handleCustData}
            />
            <span>Active?</span>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button size="small" variant="outlined" className="bg-sec" onClick={props.handleClose}>
          <i className="fa-regular fa-circle-xmark"></i>&nbsp;Close
        </Button>
        <Button
          size="small"
          variant="contained"
          className="bg-prim"
          disabled={loading}
          onClick={() => { props.title === 'Customer Add' ? handleSubmit() : handleUpdate(); }}
        >
          {loading ? (
            <>
              <i className="fa-solid fa-spinner fa-spin-pulse"></i>&nbsp;Updating...
            </>
          ) : (
            <>
              <i className="fa-regular fa-floppy-disk"></i>&nbsp;Save
            </>
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CustModal;
