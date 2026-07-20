import React, { useState, useEffect } from "react";
import axios from "axios";
import StringHost from "../../Functions/ConnectionString";
import { PrintableContainer } from "../Printing/PrintableContainer"
import Notification from "../../Alert/Notification";

const today = new Date().toISOString().split('T')[0];


const defaultBranch = {
    CNCode: "",
    CName: "",
    CAddress: ""
}

function formatNumber(num) {
  return Number(num).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}


const TransactionNewLoanReport = ({ formData, render }) => {

    const[list, setList] = useState([]);
    const[grandTotal, setGrandTotal] = useState({ amount: 0, principalAmount: 0 });
    const[branch, setBranch] = useState(defaultBranch);

    const[isLoading, setiSLoading] = useState(false);

   


    useEffect(() => {
        
        if(render){
            setiSLoading(true)
            getNewLoanReport(formData)
            getBranchDetails(formData.branch)
        }

    }, [render]);


    const getNewLoanReport = async (data) => {
        try {
            const response = await axios.get(`${StringHost()}/API/SCPWEBAPI/Voucher/NewLoan?cnCode=${data.branch}&beginDate=${data.fromDate}&endDate=${data.toDate}`);
            
            setList(response.data.list)
            setGrandTotal(response.data.grandTotal)
            setiSLoading(false)
            //console.log(response.data.list)
        } catch (error) {
            console.error("Error:", error);
            setiSLoading(false)
            if (error.response && error.response.status === 400) {
                Notification({ type: "error", message: error.response.data.message });
                return false
            } 

            Notification({ type: "error", message: "An unexpected error occurred." });
            

        
        }
    };


    const getBranchDetails = async (branch) => {
        try {
            const response = await axios.get(`${StringHost()}/API/SCPWEBAPU/GetBranchName?strURICNCode=${branch}`);
            setBranch(response.data)
        } catch (error) {
            console.error("Error:", error);
            throw error;
        }
    };

    if (isLoading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh' // Adjust height as needed
            }}>
                <p>Loading data...</p>
            </div>
        );
    }else if (list.length === 0) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh' // Adjust height as needed
            }}>
                <p>No data found.</p>
            </div>
        );
    }

    return (
        <>
            
            
           
                <PrintableContainer Orientation="Portrait">
                    <div>
                    <div class="">
                      <p class="m-0 p-0 fw-bold">{branch.CName}</p>
                      <p class="m-0 p-0">{branch.CAddress}</p>
                      <p class="m-0 p-0 fw-bold">DAILY NEW LOAN REPORT</p>
                      <p class="m-0 p-0">From: {formData.fromDate} To: {formData.toDate}</p>
                    </div>

                    <table className="table table-sm table-hover table-stripe" style={{ width: "100%" }}>

                        <thead>
                            <tr className="small">
                                <th>#</th>
                                <th>Box No</th>
                                <th>Pt No</th>
                                <th>DLG Date</th>
                                <th>Pawner</th>
                                <th>Unit</th>
                                <th>Description</th>
                                <th className="text-end">Principal</th>
                                <th>K</th>
                                <th>G</th>
                                <th className="text-end">Amount</th>
                                <th>Remarks</th>
                            </tr>
                        </thead>
                        <tbody>
                            {list.map((item, index) => (
                                <tr key={index} className="small">
                                    <td>{item.no}</td>
                                    <td>{item.boxNo}</td>
                                    <td>{item.pawnTicket}</td>
                                    <td>{new Date(item.dlgDate).toLocaleDateString()}</td>
                                    <td>{item.custName}</td>
                                    <td>{item.pIn}</td>
                                    <td>{item.item}</td>
                                    <td className="text-end">{formatNumber(item.principalAmount)}</td>
                                    <td>{item.karatDesc}</td>
                                    <td>{item.weight}</td>
                                    <td className="text-end">{formatNumber(item.amount)}</td>
                                    <td>{item.remarks}</td>
                                </tr>
                            ))}

                            <tr className="small">
                                    <th>Grand Total</th>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <th className="text-end">{formatNumber(grandTotal.principalAmount)}</th>
                                    <td></td>
                                    <td></td>
                                    <th className="text-end">{formatNumber(grandTotal.amount)}</th>
                                    <td></td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="">
                      <p class="m-0 p-0">Printed Date: {today}</p>
                      <p class="m-0 p-0 fw-bold">Printed by: {formData.user}</p>
                    </div>


                    </div>
                </PrintableContainer>


            
        </>

    )

}

export default TransactionNewLoanReport;