import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import MessageModal from "../Modals/MessageModal";
import {
    GetCompName,
    GetSetupPTNumber,
    GetSetupRSNumber,
    UpdatePTNoSetup,
    UpdateRSPTNoSetup
} from "../../Functions/AxiosFunction";

export default function PTNoSetup() {
    const { user } = useAuth();
    const [cnCode, setCNCode] = useState("");
    const [selectedVoucher, setSelectedVoucher] = useState("PS");
    const [compName, setCompName] = useState([]);
    const [setupPTNumber, setSetupPTNumber] = useState([]);
    const [setupRSNumber, setSetupRSNumber] = useState([]);

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
            fetchSetupPTNumber();
            fetchSetupRSNumber();
        }
    }, [cnCode]);


    useEffect(() => {
        //console.log(selectedVoucher);
    }, [selectedVoucher]);

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

    const fetchSetupPTNumber = async () => {
        try {
            const response = await GetSetupPTNumber();
            if (response) {
                //console.log(response);
                setSetupPTNumber(response);
            }
        } catch (error) {
            console.error("Error fetching PT numbers:", error);
        }
    };

    const fetchSetupRSNumber = async () => {
        try {
            const response = await GetSetupRSNumber();
            if (response) {
                // console.log(response);
                setSetupRSNumber(response);
            }
        } catch (error) {
            console.error("Error fetching RS numbers:", error);
        }
    };

    const handleAddRow = () => {
        const newRow = {
            id: Date.now(),
            rowNum: "",
            cnCode: cnCode,
            [selectedVoucher === "PS" ? "ptNoFrom" : "rsptNoFrom"]: "",
            [selectedVoucher === "PS" ? "ptNoTo" : "rsptNoTo"]: "",
            mark: "new",
        };

        if (selectedVoucher === "PS") {
            setSetupPTNumber((prev) => [...prev, newRow]);
        } else {
            setSetupRSNumber((prev) => [...prev, newRow]);
        }
    };

    const handleCompChange = (list, value) => {
        //console.log("list", list);
        if (selectedVoucher === "PS") {
            if (list.id !== "" && list.rowNum === "") {
                setSetupPTNumber((prev) =>
                    prev.map((item) =>
                        item.rowNum === list.rowNum
                            ? { ...item, cnCode: value }
                            : item
                    )
                );
            }

            if (list.rowNum !== "") {
                setSetupPTNumber((prev) =>
                    prev.map((item) =>
                        item.rowNum === list.rowNum
                            ? { ...item, cnCode: value, mark: "update" }
                            : item
                    )
                );
            }
        } else if (selectedVoucher === "RS") {

            if (list.id !== "" && list.rowNum === "") {
                setSetupRSNumber((prev) =>
                    prev.map((item) =>
                        item.id === list.id
                            ? { ...item, cnCode: value }
                            : item
                    )
                );
            }

            if (list.rowNum !== "") {
                setSetupRSNumber((prev) =>
                    prev.map((item) =>
                        item.rowNum === list.rowNum
                            ? { ...item, cnCode: value, mark: "update" }
                            : item
                    )
                );
            }
        }
    };

    const handleDeleteRow = (list) => {
        if (selectedVoucher === "PS") {
            setSetupPTNumber((prev) =>
                prev.filter((item) => item.id !== list.id)
            );
        } else if (selectedVoucher === "RS") {
            setSetupRSNumber((prev) =>
                prev.filter((item) => item.id !== list.id)
            );
        }
    };

    const handleFromChange = (list, value) => {
        //console.log("list", list);
        if (selectedVoucher === "PS") {
            if (list.id !== "" && list.rowNum === "") {
                setSetupPTNumber((prev) =>
                    prev.map((item) =>
                        item.id === list.id
                            ? { ...item, ptNoFrom: value }
                            : item
                    )
                );
            }

            if (list.rowNum !== "") {
                setSetupPTNumber((prev) =>
                    prev.map((item) =>
                        item.rowNum === list.rowNum
                            ? { ...item, ptNoFrom: value, mark: "update" }
                            : item
                    )
                );
            }
        } else if (selectedVoucher === "RS") {
            if (list.id !== "" && list.rowNum === "") {
                setSetupRSNumber((prev) =>
                    prev.map((item) =>
                        item.id === list.id
                            ? { ...item, rsptNoFrom: value }
                            : item
                    )
                );
            }

            if (list.rowNum !== "") {
                setSetupRSNumber((prev) =>
                    prev.map((item) =>
                        item.rowNum === list.rowNum
                            ? { ...item, rsptNoFrom: value, mark: "update" }
                            : item
                    )
                );
            }
        }
    };

    const handleToChange = (list, value) => {
        if (selectedVoucher === "PS") {
            if (list.id !== "" && list.rowNum === "") {
                setSetupPTNumber((prev) =>
                    prev.map((item) =>
                        item.rowNum === list.rowNum
                            ? { ...item, ptNoTo: value }
                            : item
                    )
                );
            }

            if (list.rowNum !== "") {
                setSetupPTNumber((prev) =>
                    prev.map((item) =>
                        item.rowNum === list.rowNum
                            ? { ...item, ptNoTo: value, mark: "update" }
                            : item
                    )
                );
            }
        } else if (selectedVoucher === "RS") {
            if (list.id !== "" && list.rowNum === "") {
                setSetupRSNumber((prev) =>
                    prev.map((item) =>
                        item.id === list.id
                            ? { ...item, rsptNoTo: value }
                            : item
                    )
                );
            }

            if (list.rowNum !== "") {
                setSetupRSNumber((prev) =>
                    prev.map((item) =>
                        item.rowNum === list.rowNum
                            ? { ...item, rsptNoTo: value, mark: "update" }
                            : item
                    )
                );
            }
        }
    };

    const handleSet = async () => {

        const updateData = [];
        const newEntries = [];

        const currentSetup = selectedVoucher === "PS" ? setupPTNumber : setupRSNumber;

        currentSetup.forEach((item) => {
            const { rowNum, cnCode, ptNoFrom, ptNoTo, rsptNoFrom, rsptNoTo, mark } = item;

            const entry = {
                rowNum: parseInt(rowNum, 10),
                cnCode,
                ...(selectedVoucher === "PS" ? { ptNoFrom, ptNoTo } : { rsptNoFrom, rsptNoTo }),
            };

            if (mark === "update") {
                updateData.push(entry);
            } else if (mark === "new") {
                newEntries.push({
                    cnCode,
                    ...(selectedVoucher === "PS" ? { ptNoFrom, ptNoTo } : { rsptNoFrom, rsptNoTo }),
                });
            }
        });
        // Adjust payload structure based on selectedVoucher
        const PayLoad = selectedVoucher === "RS" ? {
            NewRSPTEntries: newEntries,
            UpdateRSPTData: updateData,
        } : {
            NewPTEntries: newEntries,
            UpdatePTData: updateData,
        };

        // console.log("Payload", PayLoad);
        setLoading(true);
        try {
            if (selectedVoucher === "PS") {
                const response = await UpdatePTNoSetup(PayLoad);
                //console.log("API Response", response);
                if (response !== "OK") {
                    throw new Error("Update failed");
                }
            } else if (selectedVoucher === "RS") {
                const response = await UpdateRSPTNoSetup(PayLoad);
                //console.log("API Response", response);
                if (response !== "OK") {
                    throw new Error("Update failed");
                }
            }

            setMessageModalShow(true);
            setMessageText("Update Successful");
            setIcon(<i className="text-success fa-solid fa-check-to-slot fa-bounce"></i>);

        } catch (error) {
            console.error("Update failed:", error);
            setMessageModalShow(true);
            setMessageText("Update Failed");
            setIcon(<i className="text-danger fa-regular fa-circle-xmark"></i>);
        } finally {
            setLoading(false);
            if (selectedVoucher === "PS") {
                fetchSetupPTNumber();
            } else if (selectedVoucher === "RS") {
                fetchSetupRSNumber();
            }
        }
    };


    const handleClose = () => {
        setLoading(false);
        setMessageModalShow(false);
    };

    const sortedItemsToRender = [...(selectedVoucher === "RS" ? setupRSNumber : setupPTNumber)];



    return (
        <>
            <MessageModal
                show={messageModalShow}
                handleClose={handleClose}
                text={messageText}
                icon={icon}
            />
            <div className="bg-prim d-flex justify-content-between">
                <h6 className="p-2">Pawn Ticket Number Setup</h6>
            </div>

            <div className="w-100 p-2">
                <div className="mx-auto p-2 shadow border-top-sec rounded bg-light">

                    <select className="form-select form-select-sm p-2 my-3 w-50" value={selectedVoucher} onChange={(e) => setSelectedVoucher(e.target.value)}>
                        <option value="PS">Pawn Slip</option>
                        <option value="RS">Renewal Slip</option>
                    </select>

                    <div className="table-responsive text-center">
                        <table className="table table-sm table-hover table-striped table-light">
                            <thead>
                                <tr>
                                    <th>Branch</th>
                                    <th className="text-center">Pawn Ticket Number From</th>
                                    <th className="text-center">Pawn Ticket Number To</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedItemsToRender.map((item, index) => (
                                    <tr key={index}>
                                        <td>
                                            <select className="form-select form-select-sm" value={item.cnCode} onChange={(e) => handleCompChange(item, e.target.value)}>
                                                {compName?.map((list, index) => (
                                                    <option key={index} value={list.cnCode}>{list.cName}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td>
                                            <div className="w-50 mx-auto">
                                                <input
                                                    type="number"
                                                    className="mx-auto form-control form-control-sm text-center"
                                                    value={selectedVoucher === "PS" ? item.ptNoFrom : item.rsptNoFrom || ""}
                                                    onChange={(e) => handleFromChange(item, e.target.value)}
                                                />
                                            </div>
                                        </td>
                                        <td>
                                            <div className="w- mx-auto d-flex gap-3">
                                                <input
                                                    type="number"
                                                    className="mx-auto form-control form-control-sm text-center"
                                                    value={selectedVoucher === "PS" ? item.ptNoTo : item.rsptNoTo || ""}
                                                    onChange={(e) => handleToChange(item, e.target.value)}
                                                />
                                                <button
                                                    className={`btn btn-sm btn-danger ${item.rowNum !== "" ? "d-none" : ""}`}
                                                    onClick={() => handleDeleteRow(item)}
                                                >
                                                    <i className="fa-solid fa-times"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="d-flex gap-2 justify-content-end">
                        <button className="btn btn-sm bg-sec" onClick={handleAddRow}>
                            <i className="fa-solid fa-diagram-next"></i> Add row
                        </button>
                        <button className="btn btn-sm bg-prim" onClick={handleSet}>
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

        </>
    );
}
