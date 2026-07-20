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


const defaultFormRedemptionData = {
    pawTicketNo: "",
    pawner: "",
    txtBox: "",
    txtOldPawnTicket: "",
    txtNoMonth: 0,
    txtRenewCAmount: "0.00",
    txtStatus: "",
    txtPawnDate: "",
    txtLatestPawnDate: "",
    txtDueDate: "",
    txtAuctionDate: "",
    txtRemarksRenew: "N/A",
    txtTDate: "",
    txtServiceFee: 5,
    txtPenalty: "0.00",
    txtDiscount: "0.00",
    txtAmountDue: "0.00",
    txtStaticAmountDue: "0.00",
    txtCashRecieved: "0.00",
    txtRedempDiscount: "0.00",
    txtChange: "0.00",
    txtTotalPaid: "0.00",
    saveAndPrint: true,
    txtReference: "",
    rows: []


}

const parseFormattedNumber = (str) => {
  if (!str) return 0;

  // Convert to string first to ensure replace works
  const sanitizedStr = String(str).replace(/,/g, '');

  const number = parseFloat(sanitizedStr);
  return isNaN(number) ? 0 : number;
};





const RedemptionAll = () => {

    const [formData, setFormData] = useState(defaultFormRedemptionData);
    const [formDataTables, setDataTables] = useState([]);

   
    const [pawnerPawnTickets, setPawnerPawtickets] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState("");
    const [selectedTicket, setSelectedTicket] = useState("");

    
    const [messageModalShow, setMessageModalShow] = useState(false);
    const [isInitiallyLoaded, setIsInitiallyLoaded] = useState(false);
    
    const [pawnTicketList, setPawnTicketList] = useState([]);

    
    const userSession = UserSession();
    const cncode = userSession.CNCode;

    const { data: customers, isLoading: loadingCustomers } = useCustomersQuery(cncode);
    const { data: queryPawnTickets, isLoading: loadingTickets } = usePawnTicketsQuery(cncode);
   

    useEffect(() => {
       initialLoad()
    }, []);


    useEffect(() => {
       if(isInitiallyLoaded){
            redemptionOnLoad()
       }
    }, [isInitiallyLoaded]);

    
    useEffect(() => {
          if (queryPawnTickets) {
            setPawnTicketList(queryPawnTickets); // set only once on load or refresh
          }
    }, [queryPawnTickets]);

    useEffect(() => {
        if(selectedCustomer != ""){
            getPawnerPawnTickets();
        }

    }, [selectedCustomer]);
    
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

    
    const initialLoad = async () => {

        try {
            const response = await axios.get(`${StringHost()}/API/SCPWEBAPI/Redemption/InitialLoad?cnCode=${cncode}`);
    
            if(response.status === 200){
                setIsInitiallyLoaded(true)
            }
            console.log(response.data)
               
        } catch (error) {
            console.error(error);
            throw error;
        }
    }





    const getPawnerPawnTickets = async () => {
        try {
            const response = await axios.get(
                `${StringHost()}/API/SCPWEBAPI/Renewal/GetPawnerPawnTickets?cnCode=${cncode}&controlNo=${selectedCustomer}`);
            //console.log(response.data)
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


    const redemptionOnLoad = async () => {
        try {
        const response = await axios.get(`${StringHost()}/API/SCPWEBAPI/Redemption/redemptionOnLoad?strURICNCode=${cncode}`);
        //console.log(response.data)
        
        setFormData(prevState => ({
            ...prevState,
            ...response.data
        }));

        

        //Pawn Ticket is ready for Auction

            /*setFormData({
                ...formData, 
                rnPtNo: response.data.txtRNPTNum,
                txtTDate: new Date().toISOString().slice(0, 10),
                txtReference: response.data.txtRNPTNum,
                txtRNPTNum: response.data.txtRNPTNum,
                txtDocNumRenew: response.data.txtDocNumRenew

            })*/
            //setPawnTicketList(response.data.pawnTickets);
        } catch (error) {
            console.error("Error in VerifyUserLogin:", error);
            throw error;
        }
    }


    const txtTDateValidating = async (tdate) => {
            

        const payload = {
            txtTDate: tdate,
            txtRenewCAmount: formData.txtRenewCAmount,
            txtLatestPawnDate: formData.txtLatestPawnDate,
            strPawnTicket: formData.dblPawnTicket,
            strCNCode: cncode,
            lblMonthIntAmt: formData.lblMonthIntAmt,
            txtPawnDate: formData.txtPawnDate,
            items: formData.rows
        }


        //console.log(payload)

        try {
            const response = await axios.post(`${StringHost()}/API/SCPWEBAPI/Renewal/TDateValidation`, payload);
           
            setFormData(prevState => ({
                ...prevState,
                txtAmountDue: response.data.txtAmountDue,
                txtForDiscount: response.data.txtForDiscount,
                txtRedempDiscount: response.data.txtRedempDiscount,
                rows: response.data.items
            }));

            Notification({ type: "success", message: "Pawn Ticket is ready for Auction!" });

            //setEnableMonths(true)
           
        } catch (error) {
            console.error("Error fetching pawn tickets:", error);
            Notification({ type: "error", message: "Error validating transaction date" });

            //throw error;
        }
    }

    
    const handleSelectedPawnTicket = async (pt) => {
        //const TodayDate = new Date(); 
        //console.log(pt)
         try {
            const data = await RedemptionSearchTicketDetails(pt);
            console.log(data)
            // Check if data is valid
            if (!data || !data.detailsInfo) {
                Notification({ type: "error", message: "Error fetching data" });
                return; // Stop execution if data is invalid
            }

            const rawAmountDue = (data.detailsInfo.txtAmountDue || "0").replace(/[^\d.-]/g, '');
            const amountDue = parseFloat(rawAmountDue);

            setFormData(prevState => ({
                ...prevState,
                ...data.ticketDetails, // You had a typo here (.ticketDetails) — missing 'data'
                ...data.detailsInfo,
                ...data.vDate,
                txtStaticAmountDue: amountDue,
                txtTotalPaid: amountDue + prevState.txtServiceFee // also fixed formData => prevState
            }));

            //console.log(data)
            //Notification({ type: "success", message: "Pawn Ticket is ready for Auction!" });

        } catch (error) {
            console.error(error);
            Notification({ type: "error", message: "Error fetching data" });
        }

    }


    const RedemptionSearchTicketDetails = async (pawnTicket) => {
        try {
            const response = await axios.get(
                `${StringHost()}/API/SCPWEBAPI/Redemption/RedemptionSearchTicketDetails`, 
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
            } else if(error.response?.status === 400){
                Notification({ type: "error", message: error.response.data });
            } else {
                Notification({ type: "error", message: "Unexpected error occurred." });
            }

            return null;
        }
    };


    

    const handleBlur = (e) => {
        const { name, value, pattern } = e.target;

        const NUMBER_WITH_OPTIONAL_COMMAS = /^(?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d{2})?$/;

        if (!NUMBER_WITH_OPTIONAL_COMMAS.test(value)) {
            console.warn(`Invalid input for ${name}: "${value}" does not match 1,000.00‐style format.`);
            return;
        }

        if (name === "txtServiceFee") {
           

            setFormData(prevState => {

   

                const amountDue = prevState.txtStaticAmountDue;
                const serviceFee = parseFormattedNumber(value) || 0;
                const penalty = parseFormattedNumber(prevState.txtPenalty) || 0;
                const discount = parseFormattedNumber(prevState.txtDiscount) || 0;
                const rdDiscount = parseFormattedNumber(prevState.txtRedempDiscount) || 0;

                const totalPaid = amountDue + serviceFee + penalty - (discount + rdDiscount);

                return {
                    ...prevState,
                    txtTotalPaid: totalPaid
                };
            });


        }




      if (name === "txtPenalty") {

            
            setFormData(prevState => {

   

                const amountDue = prevState.txtStaticAmountDue;
                const penalty = parseFormattedNumber(value) || 0;
                const serviceFee = parseFormattedNumber(prevState.txtServiceFee) || 0;
                
                const discount = parseFormattedNumber(prevState.txtDiscount) || 0;
                const rdDiscount = parseFormattedNumber(prevState.txtRedempDiscount) || 0;

                const totalPaid = amountDue + serviceFee + penalty - (discount + rdDiscount);
                    
                
                return {
                    ...prevState,
                    txtTotalPaid: totalPaid
                };
            });


      }


      if (name === "txtDiscount") {
            setFormData(prevState => {
                const amountDue = prevState.txtStaticAmountDue;
                const discount = parseFormattedNumber(value) || 0;
                const serviceFee = parseFormattedNumber(prevState.txtServiceFee) || 0;
                const penalty = parseFormattedNumber(prevState.txtPenalty) || 0;
                const rdDiscount = parseFormattedNumber(prevState.txtRedempDiscount) || 0;

                const totalPaid = amountDue + serviceFee + penalty - (discount + rdDiscount);
                
                return {
                    ...prevState,
                    txtTotalPaid: totalPaid
                };
            });


      } 

      if (name === "txtCashRecieved") {
        let change = 0;

        setFormData(prevState => {
                const amountDue = prevState.txtStaticAmountDue;
                const discount = parseFormattedNumber(prevState.txtDiscount) || 0;
                const serviceFee = parseFormattedNumber(prevState.txtServiceFee) || 0;
                const penalty = parseFormattedNumber(prevState.txtPenalty) || 0;
                const rdDiscount = parseFormattedNumber(prevState.txtRedempDiscount) || 0;
                const txtCashRecieved = parseFormattedNumber(value) || 0;
                const totalPaid = amountDue + serviceFee + penalty - (discount + rdDiscount);
        

                if(txtCashRecieved < totalPaid){
                    Notification({ type: "error", message: "Cash Received is less than to Total Paid Amount." });    
                }else{
                    change = txtCashRecieved - totalPaid;
                }


            

                return {
                    ...prevState,
                    txtChange: change
                };
            });
      }

      console.log(`Blur event on ${name}:`, value);
    };


    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        const inputValue = type === 'checkbox' ? checked : value;

        if(name === "txtTDate"){
            txtTDateValidating(value);
        }
        
        setFormData(prevState => ({
            ...prevState,
            [name]: inputValue
        }));


    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        //console.log(formData)

        const payload = {
            main1: {
                IC: "RD" + formData.txtDocNumRenew + cncode,
                DocNum: formData.txtDocNumRenew,
                UserCode: userSession.UserCode,
                TDate: formData.txtTDate,
                Reference: formData.txtReference,
                ControlNo: formData.pawner,
                Remarks: formData.txtRemarksRenew,
                CAmount: formData.txtTotalPaid,
                CNCode: cncode,
                PawnTicket: formData.dblPawnTicket,
                BoxNo: formData.txtBox
            },
            main2:{
                IC: "RD" + formData.txtDocNumRenew + cncode,
                items: formData.rows,
            },
            main3:{
                IC: "RD" + formData.txtDocNumRenew + cncode,
                PaymentAmt: formData.txtTotalPaid.toString(),
                PenaltyFee: formData.txtPenalty,
                ServiceFee: formData.txtServiceFee.toString(),
                Discount: formData.txtDiscount,
                Discount1: formData.txtRedempDiscount
            }



            
        }



        if (selectedTicket === "") {
            return Notification({ type: "error", message: "Please, select pawn ticket." });
        }

        const cashReceived = parseFloat(formData.txtCashRecieved);

        if (cashReceived < formData.txtTotalPaid) {
            return Notification({ type: "error", message: "Cash Received is less than to Total Paid Amount." });       
        }

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
                const response = await axios.post(`${StringHost()}/API/SCPWEBAPI/Redemption/SaveRedemption`, payload);

                //console.log(response.data);

                // Check response here
                if (response.status === 200) {
                    Notification({ type: "success", message: "Data successfully saved." });
                    // setEnableMonths(true);
                    setFormData(defaultFormRedemptionData);
                } else {
                    Notification({ type: "error", message: "Failed to save data." });
                }

            } catch (error) {
                console.error("Error saving redemption:", error);
                Notification({ type: "error", message: "Error saving redemption." });
                // No need to throw unless you want the parent to catch it

                
            }

        }


    
       
        
            
        
        
    }; 


    const handleCustomer = () => {

        
    }

    const handlePost = () => {
        if(selectedTicket != ""){
            //console.log(selectedTicket)
            
            setPawnTicketList(prevState => ([
                ...prevState,
                { display: selectedTicket, value: "" }
            ]));

            setFormData(defaultFormRedemptionData);
            redemptionOnLoad();
        }
        

        //setPawnerPawtickets([]);
        setMessageModalShow(false)
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
                            onChange={(selectedOption) => setSelectedCustomer(selectedOption.controlNo)}

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

            <div className="bg-prim p-2 fw-bold sticky-top">Redemption</div>

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
                                onClick={() => setMessageModalShow(true)} 
                            />

                        </div>
                        <div className="w-100 p-1">
                            <CustomSelect 
                                label="Pawner."
                                options={customers}
                                name="pawner"
                                value={formData.pawner}
                                onChange={handleChange}
                                valueKey="controlNo"  // Use `controlNo` as the option value
                                labelKey="custName"   // Use `custName` as the option label
                                disabled={true}

                            />
                

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
                                    <CustomInput
                                        label="Term"
                                        name="txtNoMonth"
                                        onChange={handleChange}
                                        value={formData.txtNoMonth}
                                        disabled
                                        className="text-end"
                                    />

                                    <CustomInput
                                        label="Status"
                                        name="txtStatus"
                                        onChange={handleChange}
                                        value={formData.txtStatus}
                                        disabled
                                    />

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
                                        label="Amount"
                                        name="txtRenewCAmount"
                                        onChange={handleChange}
                                        value={formData.txtRenewCAmount}
                                        pattern="^\d+(\.\d{1,2})?$"
                                        disabled
                                        className="text-end"
                                        decimal={true}
                                    />

                                    <CustomInput
                                        type="date"
                                        label="Latest DLG"
                                        name="txtLatestPawnDate"
                                        onChange={handleChange}
                                        value={formData.txtLatestPawnDate}
                                        disabled
                                    />

                                    <CustomInput
                                        label="Box"
                                        name="txtBox"
                                        onChange={handleChange}
                                        value={formData.txtBox}
                                        disabled
                                    />

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
                        <div className="border border-primary h-100">

                            {/*<CustomTable
                                headers={headersRedemptionAllTable}
                                rows={formDataTables}
                            />*/}
                            <div style={{ width: "100%", padding: "10px" }}>
                              <div style={{ maxHeight: "400px", overflowY: "auto", border: "1px solid black" }}>
                                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                                  <thead>
                                    <tr style={{ backgroundColor: "#f2f2f2", borderBottom: "1px solid black" }}>
                                     
                                      <th style={{ border: "1px solid black", padding: "5px" }}>Description</th>
                                      <th style={{ border: "1px solid black", padding: "5px" }}>Karat</th>
                                      <th style={{ border: "1px solid black", padding: "5px" }}>Weight</th>
                                      <th style={{ border: "1px solid black", padding: "5px" }}>Int Rate(%)</th>
                                      <th style={{ border: "1px solid black", padding: "5px" }}>Amount</th>
                                      <th style={{ border: "1px solid black", padding: "5px" }}>Total Interest</th>

                                    </tr>
                                  </thead>
                                  <tbody>
                                    {formData.rows.map((item, index) => (
                                      <tr key={index} style={{ borderBottom: "1px solid black" }}>
                                        <td style={{ border: "1px solid black", padding: "5px" }}>{item.row1}</td>
                                        <td style={{ border: "1px solid black", padding: "5px" }}>{item.row2}</td>
                                        <td style={{ border: "1px solid black", padding: "5px" }}>{item.row3}</td>
                                        <td style={{ border: "1px solid black", padding: "5px" }}>{item.row4}</td>
                                        <td style={{ border: "1px solid black", padding: "5px" }}>{item.row5}</td>
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
                        <CustomInput
                            type="date"
                            label="Transaction Date"
                            name="txtTDate"
                            onChange={handleChange}
                            value={formData.txtTDate}
                        />
                        {/*<div className="d-flex flex-column h-100 justify-content-top align-items-center">
                            <CustomCheckbox
                                label="Save and Print"
                                checked={formData.saveAndPrint}
                                onChange={handleChange} 
                            />
                        </div>*/}
  
           
                    
                    </div>
                    <div className="col-2 p-1">

                        <CustomInput
                            label="Amount Due"
                            name="txtAmountDue"
                            onChange={handleChange}
                            value={formData.txtAmountDue}
                            disabled
                            pattern="^\d+(\.\d{1,2})?$"
                            className="text-end"
                            decimal={true}
                        />

                        <CustomInput
                            label="Redemption Discount"
                            name="txtRedempDiscount"
                            onChange={handleChange}
                            value={formData.txtRedempDiscount}
                            className="text-end"
                            decimal={true}
                            disabled
                            pattern="^\d+(\.\d{1,2})?$"
                        />
                
                    </div>
                  



                    <div className="col-2 p-1">

                        <CustomInput
                            label="Discount"
                            name="txtDiscount"
                            onChange={handleChange}
                            value={formData.txtDiscount}
                            onBlur={handleBlur}
                            className="text-end"
                            decimal={true}
                            pattern="^\d+(\.\d{1,2})?$"
                        />
                        <CustomInput
                            label="Penalty"
                            name="txtPenalty"
                            onChange={handleChange}
                            value={formData.txtPenalty}
                            onBlur={handleBlur}
                            className="text-end"
                            decimal={true}
                            pattern="^\d+(\.\d{1,2})?$"
                        />
                    </div>
                    <div className="col-2 p-1">
                        <CustomInput
                            label="Total Amt. Paid"
                            name="txtTotalPaid"
                            value={formData.txtTotalPaid}
                            className="text-end"
                            decimal={true}
                            disabled
                            pattern="^\d+(\.\d{1,2})?$"
                        />
                        <CustomInput
                            label="Service Fee"
                            name="txtServiceFee"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={formData.txtServiceFee}
                            className="text-end"
                            decimal={true}
                            pattern="^\d+(\.\d{1,2})?$"
                        />
                    </div>
                    <div className="col-2 p-1" >
                        
                        <CustomInput
                            label="Cash Receive"
                            name="txtCashRecieved"
                            onChange={handleChange}
                            value={formData.txtCashRecieved}
                            onBlur={handleBlur}
                            className="text-end"
                            decimal={false}
                            pattern="^\d+(\.\d{1,2})?$"
                        />

                         <CustomInput
                            label="Change"
                            name="txtChange"
                            onChange={handleChange}
                            value={formData.txtChange}
                            disabled
                            className="text-end"
                            decimal={true}
                            pattern="^\d+(\.\d{1,2})?$"
                        />
                    </div>
                    

                    <div className="col-2 p-1 ">
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

export default RedemptionAll