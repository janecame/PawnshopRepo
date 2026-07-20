import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import MessageModal from "../Modals/MessageModal";
import {
  GetCompName,
  GetSetupEarlyRenewal,
  UpdateSetupEarlyRenewal,
} from "../../Functions/AxiosFunction";

export default function EarlyRenewalSetup() {
  const { user } = useAuth();
  const [cnCode, setCNCode] = useState("");
  const [compName, setCompName] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [setupEarlyRenewal, setSetupEarlyRenewal] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messageModalShow, setMessageModalShow] = useState(false);
  const [messageText, setMessageText] = useState("Saved Successfully");
  const [icon, setIcon] = useState(null);

  useEffect(() => {
    if (user?.cnCode) {
      setCNCode(user.cnCode);
    }
  }, [user]);

  useEffect(() => {
    if (cnCode) {
      fetchCompName();
    }
  }, [cnCode]);

  useEffect(() => {
    if (selectedCompany) {
      fetchEarlyRenewalData();
    }
  }, [selectedCompany]);

  // useEffect(() => {
  //   console.log("HEHEHE", setupEarlyRenewal);
  // }, [setupEarlyRenewal]);

  useEffect(() => {
    if (compName.length > 0) {
      setSelectedCompany(cnCode || "");
    }
  }, [compName, cnCode]);

  const fetchCompName = async () => {
    try {
      const response = await GetCompName();
      if (response) {
        setCompName(response);
      }
    } catch (error) {
      console.error("Error fetching company names:", error);
    }
  };

  const fetchEarlyRenewalData = async () => {
    try {
      const response = await GetSetupEarlyRenewal(selectedCompany);
      if (response) {
        setSetupEarlyRenewal(response);
      }
    } catch (error) {
      console.error("Error fetching early renewal setup:", error);
    }
  };

  const handleAddRow = () => {
    const newRow = {
      id: Date.now(),
      num: "",
      numDays: "",
      interestRate: "",
      cnCode: cnCode || "",
    };

    setSetupEarlyRenewal((prev) => [...prev, newRow]);
  };

  const handleDeleteRow = (list) => {

     // console.log(list);
     if (list.id !== "" && list.num === "") {
      setSetupEarlyRenewal((prev) =>
        prev
          .filter(
            (item) => item.id !== list.id || (item.numDays && item.interestRate)
          )
          .map((item) =>
            item.id === list.id
              ? {
                  ...item,
                  mark: item.numDays && item.interestRate ? "delete" : item.mark,
                }
              : item
          )
      );
      return;
    }
    
    if (list.num !== "") {
      setSetupEarlyRenewal((prev) =>
        prev
          .filter(
            (item) => item.num !== list.id || (item.numDays && item.interestRate)
          )
          .map((item) =>
            item.num === list.num
              ? {
                  ...item,
                  mark: item.numDays && item.interestRate ? "delete" : item.mark,
                }
              : item
          )
      );
      return;
    }
    
  };

  const handleNoOfDaysChange = (list, value) => {
    // console.log(list);
    if (list.id !== "" && list.num === "") {
      // console.log("New");
      setSetupEarlyRenewal((prev) =>
        prev.map((item) =>
          item.id === list.id ? { ...item, numDays: value, mark: "new" } : item
        )
      );
      return;
    }
    
    if (list.num !== "") {
      // console.log("Update");
      // console.log("Updating based on num:", list.num);
      setSetupEarlyRenewal((prev) =>
        prev.map((item) =>
          item.num === list.num
            ? { ...item, numDays: value, mark: "update" }
            : item
        )
      );
      return;
    }
  };

  const handleInterestChange = (list, value) => {
    // console.log(list);
    if (list.id !== "" && list.num === "") {
      // console.log("New");
      setSetupEarlyRenewal((prev) =>
        prev.map((item) =>
          item.id === list.id ? { ...item, interestRate: value, mark: "new" } : item
        )
      );
      return;
    }
    
    if (list.num !== "") {
      // console.log("Update");
      // console.log("Updating based on num:", list.num);
      setSetupEarlyRenewal((prev) =>
        prev.map((item) =>
          item.num === list.num
            ? { ...item, interestRate: value, mark: "update" }
            : item
        )
      );
      return;
    }
  };

  const handleSet = async () => {
    const updateData = [];
    const newEntries = [];
    const deleteList = [];

    setupEarlyRenewal.forEach((item) => {
      const { num, numDays, interestRate, mark } = item;

      console.log(num)

      // if (numDays === "" || interestRate === "") {
      //   setMessageModalShow(true);
      //   setMessageText("Please remove empty fields");
      //   setIcon(<i className="text-danger fa-regular fa-circle-xmark"></i>);
      //   return;
      // }

      if (mark === "update") {
        updateData.push({
          num,
          numDays: parseInt(numDays, 10),
          interestRate: parseFloat(interestRate),
          cnCode,
        });
      } else if (mark === "new") {
        newEntries.push({
          numDays: parseInt(numDays, 10),
          interestRate: parseFloat(interestRate),
          cnCode,
        });
      } else if (mark === "delete") {
        deleteList.push({ num: parseInt(num, 10) });
      }
    });

    const PayLoad = {
      NewEntries: newEntries,
      UpdateData: updateData,
      DeleteEntries: deleteList,
    };

    // console.log("Payload", PayLoad);
    setLoading(true);
    try {
      const response = await UpdateSetupEarlyRenewal(PayLoad);
      // console.log("API Response", response);
      if (response !== "OK") {
        throw new Error("Update failed");
      }
      setMessageModalShow(true);
      setMessageText("Update Successful");
      setIcon( <i className="text-success fa-solid fa-check-to-slot fa-bounce"></i> );
    } catch (error) {
      // console.error("Update failed:", error);
      setMessageModalShow(true);
      setMessageText("Update Failed");
      setIcon(<i className="text-danger fa-regular fa-circle-xmark"></i>);
    } finally {
      setLoading(false);
      fetchEarlyRenewalData();
      setSetupEarlyRenewal([]);
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
        <h6 className="p-2">Early Renewal Setup</h6>
      </div>

      <div className="w-100 p-2">
        <div className="mx-auto w-75 p-2 shadow border-top-sec rounded bg-light">
          <div className="input-group mb-3 w-75">
            <span className="input-group-text" id="basic-addon1">
              Branch:
            </span>
            <select
              className="form-select form-select-sm"
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
            >
              {compName.map((list, index) => (
                <option key={index} value={list.cnCode}>
                  {list.cName}
                </option>
              ))}
            </select>
          </div>

          <div className="table-responsive text-center">
            <table className="table table-sm table-hover table-striped table-light">
              <thead>
                <tr>
                  <th>No. of Days</th>
                  <th className="text-center">Interest</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {setupEarlyRenewal
                  .filter((item) => item.mark !== "delete")
                  .map((item, index) => (
                    <tr key={index}>
                      <td>
                        <input
                          type="number"
                          disabled={selectedCompany !== cnCode}
                          className="mx-auto form-control form-control-sm w-50 text-center p-2"
                          value={item.numDays || ""}
                          onChange={(e) =>
                            handleNoOfDaysChange(item, e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <div className="input-group w-50 mx-auto">
                          <input
                            type="number"
                            disabled={selectedCompany !== cnCode}
                            className="mx-auto form-control form-control-sm text-center"
                            value={item.interestRate || ""}
                            onChange={(e) =>
                              handleInterestChange(item, e.target.value)
                            }
                          />
                          <span className="input-group-text">%</span>
                        </div>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-danger"
                          disabled={selectedCompany !== cnCode}
                          onClick={() => handleDeleteRow(item)}
                        >
                          <i className="fa-solid fa-times"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="d-flex gap-2 justify-content-end">
            <button className="btn btn-sm bg-sec" onClick={handleAddRow} disabled={selectedCompany !== cnCode}> 
              <i className="fa-solid fa-diagram-next"></i> Add row
            </button>
            <button className="btn btn-sm bg-prim" onClick={handleSet} disabled={selectedCompany !== cnCode}>
              {loading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin-pulse"></i>{" "}
                  Setting...
                </>
              ) : (
                <>
                  <i className="fa-regular fa-floppy-disk"></i> Set
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
