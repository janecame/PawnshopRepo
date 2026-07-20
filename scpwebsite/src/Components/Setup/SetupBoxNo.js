import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import MessageModal from "../Modals/MessageModal";
import {
    GetCompName,
    InsertBoxnumber
} from "../../Functions/AxiosFunction";
import { DuplicateChecker } from "../../Functions/UtilityFunctions";

export default function SetupBoxNo() {

    const { user } = useAuth();
    const [cnCode, setCNCode] = useState("");
    const [compName, setCompName] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState("");
    const [number, setNumber] = useState("");
    const [boxNumber, setBoxNumber] = useState([]);


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

    // useEffect(() => {
    //     if (boxNumber) {
    //         console.log(boxNumber);
    //     }
    // }, [boxNumber]);

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

    const handleSet = async () => {
        const data = {
            CNCode: selectedCompany,
            BoxNo: number
        }

        if (number === "") {
            setMessageModalShow(true);
            setMessageText("Please input Box Number");
            setIcon(<i className="text-danger fa-shake fa-regular fa-circle-xmark"></i>);
            return;
        }

        setLoading(true);

        const isDuplicate = await DuplicateChecker("tblSetupBoxNo", "BoxNo", data);
        // console.log("Is duplicate:", isDuplicate);

        if (isDuplicate) {
            setMessageModalShow(true);
            setMessageText("Box Number Already Exist");
            setIcon(<i className="text-danger fa-shake fa-regular fa-circle-xmark"></i>);
            return;
        }

        //for generating box number
        const newNumbers = [];
        for (let x = 0; x < 75; x++) {
            const numberObject = {
                CNCode: selectedCompany,
                BoxNo: `${number}B-${x + 1}`,
                Available: true,
            };
            newNumbers.push(numberObject);
        }

        try {
            const response = await InsertBoxnumber(newNumbers);
            console.log("API Response", response);
            if (response !== "OK") {
                throw new Error("Update failed");
            }
            setMessageModalShow(true);
            setMessageText("Update Successful");
            setIcon(<i className="text-success fa-solid fa-check-to-slot fa-bounce"></i>);
        } catch (error) {
            setMessageModalShow(true);
            setMessageText("Update Failed");
            setIcon(<i className="text-danger fa-regular fa-circle-xmark"></i>);
        } finally {
            setLoading(false);
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
                <h6 className="p-2">Setup Box Number</h6>
            </div>

            <div className="w-100 p-2 h-50">
                <div className="d-grid align-items-center h-100 mx-auto w-50 p-3">
                    <div></div>
                    <div className="d-grid gap-2 justify-content-center w-100 p-3 mt-auto shadow border-top-sec rounded bg-light">

                        <div className="input-group">
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

                        <div className="input-group mb-3">
                            <span className="input-group-text" id="basic-addon1">
                                Box Number:
                            </span>
                            <input type="number" className="form-control form-control-sm" value={number} onChange={(e) => setNumber(e.target.value)} disabled={selectedCompany !== cnCode}></input>
                        </div>

                        <button className="btn btn-sm bg-prim" onClick={handleSet}
                            disabled={selectedCompany !== cnCode || loading}
                        >
                            {loading ? (
                                <>
                                    <i className="fa-solid fa-spinner fa-spin-pulse"></i>{" "}
                                    Please wait...
                                </>
                            ) : (
                                <>
                                    <i className="fa-regular fa-square-plus"></i> Add
                                </>
                            )}
                        </button>

                    </div>


                </div>
            </div>

        </>
    );
}
