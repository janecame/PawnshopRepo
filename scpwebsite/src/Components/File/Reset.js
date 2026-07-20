import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { GetVoucherTDoor } from "../../Functions/AxiosFunction";
import { ResetVoucherTDoor } from "../../Functions/AxiosFunction";
import MessageModal from "../Modals/MessageModal";

export default function Reset() {
  const { user } = useAuth();
  const [cnCode, setCNCode] = useState("");
  const [voucher, setVoucher] = useState([]);

  const [tableVoucher, setTableVoucher] = useState("AD");

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
      fetchVoucherTDoor();
    }
  }, [cnCode]);

  //   useEffect(() => {
  //     if (securityDate.BeginDate && securityDate.EndDate) {
  //       setBeginDate(securityDate.BeginDate.split("T")[0]);
  //       setEndDate(securityDate.EndDate.split("T")[0]);
  //     }
  //   }, [securityDate]);

  const fetchVoucherTDoor = async () => {
    const response = await GetVoucherTDoor();
    // console.log(response);

    if (response) {
      setVoucher(response);
    }
  };

  const handleReset = async () => {
    setLoading(true);
    const response = await ResetVoucherTDoor(tableVoucher);
    if (response) {
      if (response === "updated") {
        setMessageModalShow(true);
        setMessageText("Reset Successfull");
        setIcon(
          <i className=" text-success fa-solid fa-check-to-slot fa-bounce"></i>
        );
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
            <div className="form-floating mb-2">
              <select
                className="form-select form-select-sm"
                value={tableVoucher}
                onChange={(e) => setTableVoucher(e.target.value)}
              >
                {voucher?.map((list, index) => (
                  <option key={index} value={list.voucher}>
                    {list.voucher}
                  </option>
                ))}
              </select>
              <label htmlFor="companyName">Select Voucher: </label>
            </div>
            <div className="d-flex gap-2 justify-content-end">
              <button className="btn btn-sm bg-prim" onClick={handleReset}>
                {loading ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin-pulse"></i> Please
                    wait...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-power-off"></i> Reset
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
