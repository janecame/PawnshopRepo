import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import MessageModal from "../Modals/MessageModal";
import {
    GetGetInterestRateGold,
    UpdateInterestRateGold,
} from "../../Functions/AxiosFunction";

export default function InterestRateGold() {
    const { user } = useAuth();
    const [cnCode, setCNCode] = useState("");
    const [setupInterestRateGold, setSetupInterestRateGold] = useState([]);
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
            fetchInterestRateGold();
        }
    }, [cnCode]);

    const fetchInterestRateGold = async () => {
        try {
            const response = await GetGetInterestRateGold();
            if (response) {
                // console.log(response);
                setSetupInterestRateGold(response);
            }
        } catch (error) {
            console.error("Error fetching early renewal setup:", error);
        }
    };

    const handleRateChange = (list, value) => {
        if (list) {
            setSetupInterestRateGold((prev) =>
                prev.map((item) =>
                    item.intRateCode === list.intRateCode
                        ? { ...item, perc: value, mark: "update" }
                        : item
                )
            );
        }
    };

    const handleSet = async () => {
        const updateData = [];
        setupInterestRateGold.forEach((item) => {
            const { intRateCode, perc, mark } = item;

            if (perc === "") {
                setMessageModalShow(true);
                setMessageText("Please Add Rate");
                setIcon(<i className="text-danger fa-regular fa-circle-xmark"></i>);
                return;
            }

            if (mark === "update") {
                updateData.push({
                    intRateCode,
                    perc: parseFloat(perc),
                });
            }
        });

        if (updateData.length === 0) {
            return;
        }
        // console.log("Update List", updateData);

        setLoading(true);
        try {
          const response = await UpdateInterestRateGold(updateData);
          //   console.log(response);
          if (response !== "OK") {
            throw new Error("Update failed");
          }
          setMessageModalShow(true);
          setMessageText("Update Successful");
          setIcon(
            <i className="text-success fa-solid fa-check-to-slot fa-bounce"></i>
          );
        } catch (error) {
          setMessageModalShow(true);
          setMessageText("Update Failed");
          setIcon(<i className="text-danger fa-regular fa-circle-xmark"></i>);
        } finally {
          setLoading(false);
          fetchInterestRateGold();
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
                <h6 className="p-2">Interest Rate Gold</h6>
            </div>

            <div className="w-100 p-2">
                <div className="mx-auto w-75 p-2 shadow border-top-sec rounded bg-light">
                    <div className="table-responsive text-center">
                        <table className="table table-sm table-hover table-striped table-light">
                            <thead>
                                <tr>
                                    <th>Begin Days</th>
                                    <th>Ending Days</th>
                                    <th className="text-center">Percentage</th>
                                </tr>
                            </thead>
                            <tbody>
                                {setupInterestRateGold?.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.bDays || ""}</td>
                                        <td>{item.eDays || ""}</td>
                                        <td>
                                            <div className="input-group w-50 mx-auto">
                                                <input
                                                    type="number"
                                                    className="mx-auto form-control form-control-sm text-center"
                                                    value={item.perc || ""}
                                                    onChange={(e) =>
                                                        handleRateChange(item, e.target.value)
                                                    }
                                                />
                                                <span className="input-group-text">%</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="d-flex gap-2 justify-content-end">
                        <button className="btn btn-sm bg-prim" onClick={handleSet}>
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
