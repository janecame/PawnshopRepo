import React, { useState, useEffect } from "react";
import { FormControl } from "react-bootstrap";
import CustomInput from "../CustomComponents/CustomInput";
import CustomButton from "../CustomComponents/CustomButton";
import CustomSelect from "../CustomComponents/CustomSelect";
import CustomCheckbox from "../CustomComponents/CustomCheckbox";
import CustomTable from "../CustomComponents/CustomTable";

import axios from "axios";
import StringHost from "../../../Functions/ConnectionString";
import Select from 'react-select'
import { exactDatetime } from "../../../utils/Constants"

import { UserSession } from "../../../Functions/UtilityFunctions";

import CustomModal from "../CustomComponents/CustomModal";

import Notification from "../../../Alert/Notification";
import { useCustomersQuery, usePawnTicketsQuery } from '../../../Hooks/useTransactionQueries';



const defaultFormData = {
    rnPtNo: "",
    txtDocNumRenew: "",
    pawTicketNo: "", //select
    pawner: "", //select
    txtRenewCAmount: "",  
    txtOldPawnTicket: "",
    txtPawnticket: "", 
    txtBox: "", 
    txtStatus: "", 
    txtPawnDate: "",
    txtLatestPawnDate: "",  
    txtRNPTNum: "", 
    txtDueDate: "", 
    txtAuctionDate: "", 
    txtRemarksRenew: "N/A", 
    txtTDate: "",
    txtReference: "", 
    txtNewPawnDate: "", 
    noOfMonths: "", //select
    txtStaticAmountDue: 0,
    txtInterestDue: 0, 
    txtServiceFee: 0, 
    txtPenalty: 0, 
    txtDiscount: 0, 
    txtAmountDue: 0,
    exactAmountDue: 0, 
    txtCashRecieved: 0, 
    txtPaidBy: "", 
    txtPartialPayment: 0, 
    txtChange: 0, 
    saveAndPrint: true,
    rows: []
}




export const noOfMonthsOptions = Array.from({ length: 12 }, (_, i) => ({
    number: i + 1,
    label: (i + 1).toString()
}));


const getTotalPayment = (data, txtInterestDue) => {
    const toNumber = (val) => parseFloat(String(val).replace(/,/g, '')) || 0;

    return (
        toNumber(txtInterestDue) +
        toNumber(data.txtServiceFee) +
        toNumber(data.txtPenalty) -
        toNumber(data.txtDiscount) -
        toNumber(data.txtRSDiscount)
    );
};


const PartialPayment = () => {

    const [formData, setFormData] = useState(defaultFormData);
    const [selectedCustomer, setSelectedCustomer] = useState("");
    //const [customers, setCustomers] = useState([]);
    const [messageModalShow, setMessageModalShow] = useState(false);
    //const [enableMonths, setEnableMonths] = useState(true);
    const [pawnerPawnTickets, setPawnerPawtickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState("");
    
    const [pawnTicketList, setPawnTicketList] = useState([]);



    const userSession = UserSession();
    const cncode = userSession.CNCode;

    const { data: customers, isLoading: loadingCustomers } = useCustomersQuery(cncode);
    const { data: queryPawnTickets, isLoading: loadingTickets } = usePawnTicketsQuery(cncode);


    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await axios.get(`${StringHost()}/API/SCPWEBAPI/PartialPayment/InitialLoad/${cncode}`);
                
                if (response.status === 200) {
                    
                    renewalOnLoad();
                }
            } catch (error) {
                console.error('Initial load failed:', error);
            }
        };

        loadData();
    }, []);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Tab" && selectedTicket !== "") {
                event.preventDefault(); // Prevent default tab behavior (optional)
                handleSelectedPawnTicket(selectedTicket);


            }
        };

        window.addEventListener("keydown", handleKeyDown);
        
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [selectedTicket]);



    useEffect(() => {
          if (queryPawnTickets) {
            setPawnTicketList(queryPawnTickets); // set only once on load or refresh
          }
    }, [queryPawnTickets]);





    const getPawnerPawnTickets = async (customer) => {
        
        try {
            const response = await axios.get(
                `${StringHost()}/API/SCPWEBAPI/PartialPayment/GetPawnerPawnTickets/${cncode}/${customer}`);
         
            
            if (!Array.isArray(response.data)) {
                setPawnerPawtickets([]);
            } else {
                setPawnerPawtickets(response.data);
            }
           
        } catch (error) {
            console.error("Error fetching pawn tickets:", error);
            if(error.response.status === 404) return Notification({ type: "error", message: error.response.data });
            Notification({ type: "error", message: "Sorry, Something went wrong. Contact the administrator." });

        }
        
    }

    const renewalOnLoad = async () => {
        try {
            const response = await axios.get(`${StringHost()}/API/SCPWEBAPI/PartialPayment/PartialPaymentOnload/${cncode}`);
            const data = response.data;
            //console.log(data)
            setFormData({
                ...formData, 
                rnPtNo: data.txtRNPTNum,
                txtTDate: data.txtTDate,
                txtReference: data.txtRNPTNum,
                txtRNPTNum: data.txtRNPTNum,
                txtDocNumRenew: data.txtDocNumRenew,
                txtPawnticket: data.txtPawnticket
            })


            //setPawnTicketList(response.data.pawnTickets);
        } catch (error) {
            console.error("Error in VerifyUserLogin:", error);
            throw error;
        }
    }



    const renewalDetailsMainFetch = async (pawnTicket) => {
        try {
            const response = await axios.get(
                `${StringHost()}/API/SCPWEBAPI/PartialPayment/PartialPaymentDetailsMainFetch`,
                { params: { pawnTicket, cncode } }
            );

            const data = response.data;

            if (!data || (Array.isArray(data) && data.length === 0) || Object.keys(data).length === 0) {
                throw new Error("No data returned from server");
            }

            return data;
        } catch (error) {
            console.error("Error fetching pawn tickets:", error);

            if (error.response?.status === 404) {
                Notification({ type: "error", message: error.response.data.message });
            }  else if( error.response?.status === 400) {
                Notification({ type: "error", message: error.response.data });

            } else {
                Notification({ type: "error", message: "Unexpected error occurred." });

            }

            return null; // Return null to indicate failure
        }
    };

    const handleSelectedPawnTicket = async (pt) => {
        const TodayDate = new Date(); 
      
        const data = await renewalDetailsMainFetch(pt)
        //console.log(data)

        if (!data) {
            return; // Abort if fetch failed or returned no data
        }

        setFormData(prevState => ({
            ...prevState,
            ...data.detailsInfo,
            ...data.ticketDetails,
            ...data.vDate,
            txtStaticAmountDue: getTotalPayment(data.detailsInfo, data.dateValidate.txtInterestDue),
            txtAmountDue: getTotalPayment(data.detailsInfo, data.dateValidate.txtInterestDue),
            txtForDiscount: data.dateValidate.txtForDiscount,
            txtInterestDue: data.dateValidate.txtInterestDue
        }));

    }


    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        let inputValue = type === 'checkbox' ? checked : value;

        setFormData(prevState => ({
            ...prevState,
            [name]: inputValue
        }));
    };
 


    const handlePost = () => {

        if(selectedTicket != ""){
            //console.log(selectedTicket)
            
            setPawnTicketList(prevState => ([
                ...prevState,
                { display: selectedTicket, value: "" }
            ]));

            setFormData(defaultFormData);
            //renewalOnLoad();
        }

        setPawnerPawtickets([]);
        setMessageModalShow(false)
    }


    const handleBtnCustomer = () => {
        setPawnerPawtickets([]);
        setMessageModalShow(true);
        
    }


    const handleBlur = (e) => {
        const { name, value, pattern } = e.target;

        if (pattern && !new RegExp(pattern).test(value)) {
            console.warn(`Invalid input for ${name}`);
            return;
        }


          if (name === "txtPenalty") {

            setFormData(prevState => {

                const amountDue = prevState.txtStaticAmountDue;
                const discount = parseFloat(prevState.txtDiscount) || 0;
                const partialPayment = parseFloat(prevState.txtPartialPayment) || 0;
                const penalty = parseFloat(value) || 0;

                return {
                    ...prevState, 
                    txtAmountDue: amountDue + partialPayment + penalty - discount
                };
            });
          }


          if (name === "txtPartialPayment") {

            setFormData(prevState => {

                const amountDue = prevState.txtStaticAmountDue;
                const discount = parseFloat(prevState.txtDiscount) || 0;
                const penalty = parseFloat(prevState.txtPenalty) || 0;
                const partialPayment = parseFloat(value) || 0;

                return {
                    ...prevState, 
                    txtAmountDue: amountDue + partialPayment + penalty - discount

                };
            });

          }


          if (name === "txtDiscount") {

            setFormData(prevState => {

                const amountDue = prevState.txtStaticAmountDue;
                const penalty = parseFloat(prevState.txtPenalty) || 0;
                const partialPayment = parseFloat(prevState.txtPartialPayment) || 0;
                const discount = parseFloat(value) || 0;

                return {
                    ...prevState, 
                    txtAmountDue: amountDue + partialPayment + penalty - discount
                };
            });


          } 

            if (name === "txtCashRecieved") {

                setFormData((prevState) => {
                  //const amountDue = prevState.txtStaticAmountDue || 0;

                    const amountDue = prevState.txtStaticAmountDue;
                    const penalty = parseFloat(prevState.txtPenalty) || 0;
                    const partialPayment = parseFloat(prevState.txtPartialPayment) || 0;
                    const discount = parseFloat(prevState.txtDiscount) || 0;
                  
                    const cashRecieved = parseFloat(value) || 0;

                    const totalAmountDue = amountDue + partialPayment + penalty - discount;


                      return {
                        ...prevState,
                        txtChange: cashRecieved - totalAmountDue
                      };
                });
            }

    };



    const handleSubmit = async (e)  => {
        e.preventDefault();
        //console.log(formData)


        const partialPayment = parseFloat(formData.txtPartialPayment);

        if (partialPayment <= 0) {
            return Notification({ type: "error", message: "Partial payment cannot be 0.00" });       
        }

        const payload = {
            ppAmount: parseFloat(formData.txtPartialPayment),
            pawnTicket: formData.txtOldPawnTicket,
            remarks: formData.txtRemarksRenew,
            cnCode: cncode

        }

        //console.log(payload);


        const confirm = await new Promise((resolve) => {
            Notification({
                type: "confirm",
                message: "Do you want to save this?",
                onConfirm: () => resolve(true),
                onCancel: () => resolve(false)
            });
        });


        if (confirm) {
            try {
                const response = await axios.post(`${StringHost()}/API/SCPWEBAPI/PartialPayment/UpdatePartialPayment`, payload);

                //console.log(response);

                //Check response here
                if (response.status === 200) {
                    Notification({ type: "success", message: "Data successfully saved." });
                    // setEnableMonths(true);
                    setFormData(defaultFormData);

                } else {
                    Notification({ type: "error", message: "Failed to save data." });
                }

            } catch (error) {
                console.error("Error saving redemption:", error);
                Notification({ type: "error", message: "Error saving redemption." });
                // No need to throw unless you want the parent to catch it
            }
        }

        
    }

    if (loadingCustomers || loadingTickets) {
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

    }

    return(
        <div>
            <CustomModal
                show={messageModalShow}
                handleClose={() => setMessageModalShow(false)}
                title="choose pawn ticket"
                size="md"
                backdrop="static"
                keyboard={true}

            >
                <div className="d-flex flex-column justify-content-center align-items-start box-sizing" >

                    <div className="w-100 p-1">
                        <label htmlFor="pawn-ticket-select">Select Pawn Ticket</label>
                        <Select
                            id="pawn-ticket-select" 
                            options={customers} 
                            getOptionLabel={option => option.custName}
                            getOptionValue={option => option.controlNo}
                            onChange={(selectedOption) => getPawnerPawnTickets(selectedOption.controlNo)}

                        />

                    </div>
                    
                    <ul className="list-group w-100">
                        {pawnerPawnTickets.map((ticket, index) => (
                            <li 
                                key={index} 
                                className={`list-group-item list-group-item-action ${selectedTicket === ticket ? "active" : ""}`} 
                                onClick={() => setSelectedTicket(ticket)}
                                style={{ cursor: "pointer" }}
                            >
                                {ticket}
                            </li>
                        ))}
                    </ul>
                  
                    <CustomButton 
                        label="POST"
                        size="md"
                        variant="primary"
                        style={{ marginLeft: '5px', width: "100%" }}
                        onClick={handlePost} 
                    />

                    <CustomButton 
                        label="CANCEL"
                        size="md"
                        variant="danger"
                        style={{ marginLeft: '5px', width: "100%" }}
                        onClick={() => setMessageModalShow(false)} 
                    />
             
                    
                </div>
            </CustomModal>


            <div className="bg-prim p-2 fw-bold sticky-top">Partial Payment</div>

            <div className="container-fluid h-100 " >
            <form onSubmit={handleSubmit}>
                <div className="row p-2" >
                    {/*-------------------------------- SECTION 1 AREA --------------------------------*/}
                    <div className="col-4 p-1 border border-primary">
                        <div className="w-100 p-1">

                            <label htmlFor="pawn-ticket-select">Select Pawn Ticket</label>
                            <Select
                                id="pawn-ticket-select" 
                                options={pawnTicketList} 
                                getOptionLabel={option => option.display} // Use Display for the label
                                getOptionValue={option => option.value} // Use Value for the value
                                value={pawnTicketList.find((option) => option.display === selectedTicket) || null}
                                onChange={(selectedOption) => setSelectedTicket(selectedOption.display)}
                            />

                            <CustomButton 
                                label="CUSTOMER"
                                size="sm"
                                variant="primary"
                                style={{ marginLeft: '5px' }}
                                onClick={handleBtnCustomer} 
                            />

                        </div>
                        <div className="w-100 p-1">
                            <CustomSelect 
                              label="Pawner"
                              options={customers}
                              name="pawner"
                              value={formData.pawner}
                              onChange={handleChange}
                              valueKey="controlNo"  // Use `controlNo` as the option value
                              labelKey="custName"   // Use `custName` as the option label
                              disabled={true}
                            />

                            
                            <CustomInput
                                label="Principal Amount"
                                name="txtRenewCAmount"
                                onChange={handleChange}
                                value={formData.txtRenewCAmount}
                                disabled
                                className="text-end"
                                decimal={true}

                            />

                            <div className="row">
                                <div className="col-4">
                                    <CustomInput
                                        label="Pawn Ticket"
                                        name="txtOldPawnTicket"
                                        onChange={handleChange}
                                        value={formData.txtOldPawnTicket}
                                        disabled
                                    />
                                </div>
                                <div className="col-4">
                                    <CustomInput
                                        label="Box"
                                        name="txtBox"
                                        onChange={handleChange}
                                        value={formData.txtBox}
                                        disabled
                                    />
                                </div>
                                <div className="col-4">
                                    <CustomInput
                                        label="Status"
                                        name="txtStatus"
                                        onChange={handleChange}
                                        value={formData.txtStatus}
                                        disabled
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-6">
                                    <CustomInput
                                        type="date"
                                        label="DLG"
                                        name="txtPawnDate"
                                        onChange={handleChange}
                                        value={formData.txtPawnDate}
                                        disabled
                                    />
                                </div>

                                <div className="col-6">
                                    <CustomInput
                                        type="date"
                                        label="Transaction Date"
                                        name="txtLatestPawnDate"
                                        onChange={handleChange}
                                        value={formData.txtLatestPawnDate}
                                        disabled
                                    />
                                </div>
                              
                            </div>

                           <div className="row">
                                <div className="col-6">
                                    <CustomInput
                                        type="date"
                                        label="Maturity Date"
                                        name="txtDueDate"
                                        onChange={handleChange}
                                        value={formData.txtDueDate}
                                        disabled
                                    />
                                </div>
                                <div className="col-6">
                                    <CustomInput
                                        type="date"
                                        label="Expiry Date"
                                        name="txtAuctionDate"
                                        onChange={handleChange}
                                        value={formData.txtAuctionDate}
                                        disabled
                                    />
                                </div>
                            </div>

                            <div className="w-100">
                                <CustomInput
                                    label="Remarks"
                                    name="txtRemarksRenew"
                                    onChange={handleChange}
                                    value={formData.txtRemarksRenew}
                                />
                            </div>
                        </div>  
                    </div>
                    <div className="col-8">
                         {/*-------------------------------- SECTION 2 AREA --------------------------------*/}
                        <div className="border border-primary h-100 ">
                            

                            <div style={{ width: "100%", padding: "10px" }}>
                              <div style={{ maxHeight: "500px", overflowY: "auto", border: "1px solid black" }}>
                                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                                  <thead>
                                    <tr style={{ backgroundColor: "#f2f2f2", borderBottom: "1px solid black" }}>
                                      <th style={{ border: "1px solid black", padding: "5px" }}>Term</th>
                                      <th style={{ border: "1px solid black", padding: "5px" }}>Description</th>
                                      <th style={{ border: "1px solid black", padding: "5px" }}>Schedule</th>
                                      <th style={{ border: "1px solid black", padding: "5px" }}>Total</th>
                                      <th style={{ border: "1px solid black", padding: "5px" }}>Interest</th>
                                      <th style={{ border: "1px solid black", padding: "5px" }}>Loan Amount</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {formData.rows.map((item, index) => (
                                      <tr key={index} style={{ borderBottom: "1px solid black" }}>
                                        <td style={{ border: "1px solid black", padding: "5px" }}>{item.row1}</td>
                                        <td style={{ border: "1px solid black", padding: "5px" }}>{item.row2}</td>
                                        <td style={{ border: "1px solid black", padding: "5px" }}>{item.row3}</td>
                                        <td style={{ border: "1px solid black", padding: "5px" }}>{item.row7}</td>
                                        <td style={{ border: "1px solid black", padding: "5px" }}>{item.row6}</td>
                                        <td style={{ border: "1px solid black", padding: "5px" }}>{item.row8}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>


                        </div>
                    </div>

                </div>

                <div className="row p-2">
                    <div className="col-2 p-1">
       
                         {/*-------------------------------- SECTION 3 AREA --------------------------------*/}
                        <CustomInput
                            type="date"
                            label="Transaction Date"
                            name="txtTDate"
                            onChange={handleChange}
                            value={formData.txtTDate}
                            disabled
                        />

                        <CustomInput
                            label="Reference"
                            name="txtReference"
                            onChange={handleChange}
                            value={formData.txtReference}
                            required={true}
                            disabled

                        />
                    
                    </div>
                    <div className="col-2 p-1">
                        <CustomInput
                            type="date"
                            label="New DLG"
                            name="txtNewPawnDate"
                            onChange={handleChange}
                            value={formData.txtNewPawnDate}
                            disabled

                        />
                        <CustomSelect 
                            label="No of Months."
                            options={noOfMonthsOptions}
                            name="noOfMonths"
                            value={formData.noOfMonths}
                            onChange={handleChange}
                            valueKey="number"  // Use `controlNo` as the option value
                            labelKey="label"   //
                            
                            disabled
                        />
                    </div>
                  
                    <div className="col-2 p-1">
                        <CustomInput
                            label="Interest Due"
                            name="txtInterestDue"
                            onChange={handleChange}
                            value={formData.txtInterestDue}
                            disabled
                            className="text-end"
                            decimal={true}
                        />
                        <CustomInput
                            label="Service Fee"
                            name="txtServiceFee"
                            onChange={handleChange}
                            value={formData.txtServiceFee}
                            onBlur={handleBlur}
                            pattern="^\d+(\.\d{1,2})?$"
                            className="text-end"
                            decimal={false}
                            disabled
                        />
                    </div>
                    <div className="col-2 p-1">
                        <CustomInput
                            label="Penalty"
                            name="txtPenalty"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={formData.txtPenalty}
                            pattern="^\d+(\.\d{1,2})?$" 
                            className="text-end"
                            decimal={true}
                        />
                        <CustomInput
                            label="Discount"
                            name="txtDiscount"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={formData.txtDiscount}
                            pattern="^\d+(\.\d{1,2})?$"
                            className="text-end"
                            decimal={true}
                        />
                    </div>
                    <div className="col-2 p-1" >
                        <CustomInput
                            label="Amount Due"
                            name="txtAmountDue"
                            onChange={handleChange}
                            value={formData.txtAmountDue}
                            disabled
                            className="text-end"
                            decimal={true}
                        />
                        <CustomInput
                            label="Cash Received"
                            name="txtCashRecieved"
                            onChange={handleChange}
                            value={formData.txtCashRecieved}
                            pattern="^\d+(\.\d{1,2})?$"
                            className="text-end"
                            onBlur={handleBlur}
                            decimal={true}
                        />
                    </div>
                    {/*<div className="col-2 p-1 ">
                        <div className="d-flex flex-column h-100 justify-content-end align-items-center">    
     
                            <CustomButton
                                type="submit"
                                label="Pay"
                                size="md"
                                style={{ width: '50%' }}
                            />
                        </div>
                    </div>*/}
                </div>
                <div className="row p-2">
                     {/*-------------------------------- SECTION 4 AREA --------------------------------*/}
                    <div className="col-6 p-1">
                        <CustomInput
                            label="Paid By"
                            name="txtPaidBy"
                            onChange={handleChange}
                            
                            value={formData.txtPaidBy}
                            required={false}
                        />
                    </div>
                    <div className="col-2 p-1">
                        <CustomInput
                            label="Partial Payment"
                            name="txtPartialPayment"
                            onChange={handleChange}
                            value={formData.txtPartialPayment}
                            onBlur={handleBlur}
                            className="text-end"
                            decimal={true}
                            required
                        />
                    </div>
                    <div className="col-2 p-1">
                        <CustomInput
                            label="Change"
                            name="txtChange"
                            onChange={handleChange}
                            value={formData.txtChange}
                            disabled
                            className="text-end"
                            decimal={true}
                        />
                    </div>
                    <div className="col-2 p-1">
                       <div className="d-flex flex-column h-100 justify-content-end align-items-center">    
     
                            <CustomButton
                                type="submit"
                                label="Pay"
                                size="md"
                                style={{ width: '50%' }}
                            />
                        </div>
                    </div>     

                </div> 
            </form>    
            </div> 
        </div>
     )
}

export default PartialPayment