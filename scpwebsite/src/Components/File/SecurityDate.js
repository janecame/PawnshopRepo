import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { GetSecurityDate } from "../../Functions/AxiosFunction";
import { UpdateSecurityDate } from "../../Functions/AxiosFunction";
import MessageModal from "../Modals/MessageModal";

export default function SecurityDate() {
  const { user } = useAuth();
  const [cnCode, setCNCode] = useState("");
  const [securityDate, setSecurityDate] = useState({});

  const [beginDate, setBeginDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [loading, setLoading] = useState(false);
  const [messageModalShow, setMessageModalShow] = useState(false);
  const [messageText, setMessageText] = useState("Saved Successfully");
  const [icon, setIcon] = useState();

  useEffect(() => {
    if (user?.cnCode) {
      setCNCode(user.cnCode);
    }
  }, [user]);

  useEffect(() => {
    if (cnCode !== "") {
      fetchSecurityDate();
    }
  }, [cnCode]);

  useEffect(() => {
    if (securityDate.BeginDate && securityDate.EndDate) {
      setBeginDate(securityDate.BeginDate.split("T")[0]);
      setEndDate(securityDate.EndDate.split("T")[0]);
    }
  }, [securityDate]);

  const fetchSecurityDate = async () => {
    const response = await GetSecurityDate();
    // console.log(response);

    if (response) {
      setSecurityDate(response);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    const MdlSecurityDate = {
      BeginDate: beginDate,
      EndDate: endDate,
    };
    // console.log(MdlSecurityDate);
    const response = await UpdateSecurityDate(MdlSecurityDate);
    if (response) {
      //   console.log(response);
      if (response === "updated") {
        setMessageModalShow(true);
        setMessageText("Information Updated");
        setIcon(
          <i className=" text-success fa-solid fa-check-to-slot fa-bounce"></i>
        );
        fetchSecurityDate();
        setLoading(false);
        return;
      }
    }
  };

  const handleClose = () => {
    setLoading(false);
    setMessageModalShow(false);
  };

  return (
    <>
      <MessageModal
        show={messageModalShow}
        handleClose={handleClose}
        text={messageText}
        icon={icon}
      />
      <div className="bg-prim d-flex justify-content-between">
        <h6 className="p-2">Security Date</h6>
      </div>

      <div className="">
        <div className="w-50 h-100 mx-auto">
          <div className="m-3 shadow rounded p-2 container border-top-sec">
            <div className="p-1">
              <div className="form-floating mb-2">
                <input
                  type="date"
                  className="form-control"
                  id="companyName"
                  placeholder="Company Name"
                  value={beginDate}
                  onChange={(e) => setBeginDate(e.target.value)}
                />
                <label htmlFor="companyName">Beginning Date: </label>
              </div>

              <div className="form-floating mb-2">
                <input
                  type="date"
                  className="form-control"
                  id="companyName"
                  placeholder="Company Name"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
                <label htmlFor="companyName">Ending Date: </label>
              </div>

              <div className="d-flex gap-2 justify-content-end">
                <button className="btn btn-sm bg-prim" onClick={handleSave}>
                  {loading ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin-pulse"></i>{" "}
                      Saving...
                    </>
                  ) : (
                    <>
                      <i className="fa-regular fa-floppy-disk"></i> Save
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
