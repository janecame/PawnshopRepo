import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { UpdateCompany } from "../../Functions/AxiosFunction";
import MessageModal from "./MessageModal";

function CompanyEditModal(props) {
  const [companyName, setCompanyName] = useState("");
  const [address, setAddress] = useState("");
  const [tin, setTin] = useState("");

  const [loading, setLoading] = useState(false);
  const [messageModalShow, setMessageModalShow] = useState(false);
  const [messageText, setMessageText] = useState("Saved Successfully");
  const [icon, setIcon] = useState();

  useEffect(() => {
    setCompanyName(props.data.Company);
    setAddress(props.data.Address);
    setTin(props.data.TIN);
  }, [props.data]);

  const handleClose = () => {
    setLoading(false);
    setMessageModalShow(false);
    props.reload();
  };

  const handleUpdate = async () => {
    setLoading(true);
    const MdlCompany = {
      Company: companyName,
      Address: address,
      TIN: tin,
    };

    const response = await UpdateCompany(MdlCompany);

    if (response) {
      if (response === "updated") {
        setMessageModalShow(true);
        setMessageText("Information Updated");
        setIcon(
          <i className=" text-success fa-solid fa-check-to-slot fa-bounce"></i>
        );
        props.handleClose();
        setLoading(false);
        return;
      }
    }
  };

  return (
    <>
      <MessageModal
        show={messageModalShow}
        handleClose={handleClose}
        text={messageText}
        icon={icon}
      />

      <Dialog
        open={props.show}
        onClose={props.handleClose}
        disableEscapeKeyDown
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ p: 2, fontSize: "1.1rem" }}>
          Edit Company Details
        </DialogTitle>
        <DialogContent>
          <div className="pt-1">
            <div className="form-floating mb-2">
              <input
                type="text"
                className="form-control"
                id="companyName"
                placeholder="Company Name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
              <label htmlFor="companyName">Company Name</label>
            </div>

            <div className="form-floating mb-2">
              <input
                type="text"
                className="form-control"
                id="address"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <label htmlFor="address">Address</label>
            </div>

            <div className="form-floating mb-2">
              <input
                type="text"
                className="form-control"
                id="tin"
                placeholder="TIN"
                value={tin}
                onChange={(e) => setTin(e.target.value)}
              />
              <label htmlFor="tin">TIN</label>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button size="small" variant="outlined" className="bg-sec" onClick={props.handleClose}>
            <i className="fa-regular fa-circle-xmark"></i>&nbsp;Close
          </Button>
          <Button size="small" variant="contained" className="bg-prim" onClick={handleUpdate}>
            {loading ? (
              <>
                <i className="fa-solid fa-spinner fa-spin-pulse"></i>&nbsp;Updating...
              </>
            ) : (
              <>
                <i className="fa-regular fa-floppy-disk"></i>&nbsp;Update
              </>
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default CompanyEditModal;
