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
  const parsed = Number(num);
  if (isNaN(parsed)) return '0.00';
  return parsed.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}



const TransactionRenewalReport = ({ formData, render }) => {

    const[list, setList] = useState([]);
    const[grandTotal, setGrandTotal] = useState({ amtPercentage: 0, discount: 0, principalAmount: 0, serviceFee: 0, totalAmtPaid: 0 });
    const[branch, setBranch] = useState(defaultBranch);

    const[isLoading, setiSLoading] = useState(false);

    useEffect(() => {
        if(render){
            setiSLoading(true)
            getRenewalReport(formData)
            getBranchDetails(formData.branch)
        }

    }, [render]);


    const getRenewalReport = async (data) => {
        try {
            const response = await axios.get(`${StringHost()}/API/SCPWEBAPI/Voucher/Renewal?cnCode=${data.branch}&beginDate=${data.fromDate}&endDate=${data.toDate}`);
         
            setList(response.data.list)
            setGrandTotal(response.data.grandTotal)
            setiSLoading(false)
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
                      <p class="m-0 p-0 fw-bold">RENEWAL REPORT</p>
                      <p class="m-0 p-0">From: {formData.fromDate} To: {formData.toDate}</p>
                    </div>

                    

                    <table className="table table-sm table-bordered">
                      <thead>
                        <tr className="small">
                          <th>No</th>
                          <th>Box No</th>
                          <th>Old PT No</th>
                          <th>Old DLG</th>
                          <th>New PT</th>
                          <th>New DLG</th>
                          <th>Principal Amount</th>
                          <th>Interest</th>
                          <th>Amount Paid</th>
                          
                          <th>Service Fee</th>
                          <th>Discount</th>
                          <th>Total Amount Paid</th>
                          <th>Customer Name</th>
                          <th>Remarks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.isArray(list) && list.map((item, index) => (
                          <tr key={index} className="small">
                            <td>{item.no}</td>
                            <td>{item.boxNo}</td>
                            <td>{item.oldPtNo}</td>
                            <td>{new Date(item.oldDLG).toLocaleDateString()}</td>
                            <td>{item.newPT}</td>
                            <td>{new Date(item.newDLG).toLocaleDateString()}</td>

                            <td className="text-end">{formatNumber(item.principalAmt)}</td>
                            <td className="text-end">{formatNumber(item.interest)}</td>
                            <td className="text-end">{formatNumber(item.amtPaid)}</td>
                            
                            <td className="text-end">{formatNumber(item.serviceFee)}</td>
                            <td className="text-end">{formatNumber(item.discount)}</td>
                            <td className="text-end">{formatNumber(item.totalAmtPaid)}</td>
                            <td>{item.custName}</td>
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
                                    <th className="text-end">{formatNumber(grandTotal.principalAmount)}</th>
                                    <td></td>
                                    <th className="text-end">{formatNumber(grandTotal.amtPercentage)}</th>
                                    <th className="text-end">{formatNumber(grandTotal.serviceFee)}</th>
                                    <th className="text-end">{formatNumber(grandTotal.discount)}</th>
                                    
                                    <th className="text-end">{formatNumber(grandTotal.totalAmtPaid)}</th>
                                    <td></td>
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

export default TransactionRenewalReport;






                                    {/*<td>{new Date(item.dlgDate).toLocaleDateString()}</td>
                                    <td>{item.custName}</td>
                                    <td>{item.pIn}</td>
                                    <td>{item.item}</td>
                                    <td className="text-end">{formatNumber(item.principalAmount)}</td>
                                    <td>{item.karatDesc}</td>
                                    <td>{item.weight}</td>
                                    <td className="text-end">{formatNumber(item.amount)}</td>
                                    <td>{item.remarks}</td>*/}