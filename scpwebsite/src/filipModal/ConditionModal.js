import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Notification } from "../Alert/Notif";
import { UserSession } from "../Functions/UtilityFunctions";
import { AutonCondition } from "../API/AutoNum";
import { InsertCondition } from "../API/Insert";
import { UpdateCondition } from "../API/Update";

export default function ConditionModal(props) {
  const [loading, setLoading] = useState(false);
  const [getNum, setNum] = useState("");
  const [getValid, setValid] = useState(false);
  const [getValidSub, setValidSub] = useState(false);

  const success = { icon: "success", title: "Successfully Saved!" };

  const { CNCode } = UserSession();

  const Initialize = {
    CNCode: CNCode,
    ConditionCode: "",
    ConditionDesc: "",
    ConditionDescSub: "NA",
    CatCode: "000"
  };

  const [getConData, setConData] = useState(Initialize);

  const HandleCondata = (e) => {
    const { name, value } = e.target;
    setConData({ ...getConData, [name]: value });
    setValid(false);
    setValidSub(false);
  };

  const HandleAdd = async () => {
    setLoading(true);
    if (getConData.ConditionDesc === "") {
      setValid(true);
    } else if (getConData.ConditionDescSub === "") {
      setValidSub(true);
    } else {
      setLoading(true);
      const res = await InsertCondition(getConData);
      if (res === "Inserted") {
        setConData(Initialize);
        Clear();
      }
    }
  };

  const Clear = () => {
    Notification(success);
    props.success();
    AutoNum();
    props.handleClose();
    setValid(false);
    setValidSub(false);
    setLoading(false);
  };

  useEffect(() => {
    if (props.title === "Condition Add") {
      AutoNum(CNCode);
    } else if (props.title === "Condition Update") {
      setConData({
        ...Initialize,
        ConditionCode: props.update.conditionCode || '',
        ConditionDesc: props.update.conditionDesc || '',
        ConditionDescSub: props.update.conditionDescSub || '',
      });
    }
  }, [props]);

  const AutoNum = async (value) => {
    try {
      const result = await AutonCondition(value);
      setConData({ ...Initialize, ConditionCode: `${result}` });
      setNum(result);
    } catch (error) {
      Notification({ icon: 'error', title: 'Something went wrong! ' });
    }
  };

  const HandleUpdate = async () => {
    if (getConData.ConditionDesc === "") {
      setValid(true);
    } else if (getConData.ConditionDescSub === "") {
      setValidSub(true);
    } else {
      setLoading(true);
      const res = await UpdateCondition(getConData);
      if (res === "Updated") {
        setConData(Initialize);
        Clear();
      }
    }
  };

  return (
    <Dialog
      open={props.show}
      onClose={props.handleClose}
      disableEscapeKeyDown
      maxWidth="sm"
      fullWidth
      scroll="paper"
    >
      <DialogTitle sx={{ p: 2, fontSize: "1.1rem" }}>
        {props.title}
      </DialogTitle>
      <DialogContent dividers>
        <div className="d-grid">
          <div className="d-flex justify-content-end mb-3">
            <input
              type="text"
              className="form-control w-25 text-end"
              name="ConditionCode"
              value={getConData.ConditionCode}
              onChange={HandleCondata}
              disabled
            />
          </div>

          <div className="d-flex justify-content-center gap-4">
            <div className="d-grid justify-content-center align-content-center">
              <input
                type="text"
                className={`form-control border border-top-0 border-start-0 border-end-0 text-center ${getValid ? "is-invalid" : ""}`}
                name="ConditionDesc"
                value={getConData.ConditionDesc}
                onChange={HandleCondata}
              />
              <span className="text-center">Condition Description</span>
            </div>
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
          onClick={() => { props.title === "Condition Add" ? HandleAdd() : HandleUpdate(); }}
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
