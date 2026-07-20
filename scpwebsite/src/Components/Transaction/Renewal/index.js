import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Select from 'react-select'
import { FormControl, Table } from "react-bootstrap";

import CustomInput from "../CustomComponents/CustomInput";
import CustomButton from "../CustomComponents/CustomButton";
import CustomSelect from "../CustomComponents/CustomSelect";
import CustomCheckbox from "../CustomComponents/CustomCheckbox";

import CustomModal from "../CustomComponents/CustomModal";

import { exactDatetime } from "../../../utils/Constants"
import { GetCustomerList } from "../../../Functions/AxiosFunction"
 
import { UserSession } from "../../../Functions/UtilityFunctions";

import axios from "axios";
import StringHost from "../../../Functions/ConnectionString";

import Notification from '../../../Alert/Notification';


import { useCustomersQuery, usePawnTicketsQuery } from '../../../Hooks/useTransactionQueries';


const defaultFormRenewalData = {
    pawTicketNo: "", //select
    pawner: "", //select
    txtRenewCAmount: "",  
    txtOldPawnTicket: "",  
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
    txtInterestDue: 0, 
    txtServiceFee: 0, 
    txtPenalty: 0, 
    txtDiscount: 0, 
    txtAmountDue: 0,
    exactAmountDue: 0, 
    txtCashRecieved: 0, 
    txtPaidBy: "", 
    txtRSDiscount: 0, 
    txtChange: 0, 
    saveAndPrint: true,
    rows: []
}


export const noOfMonthsOptions = Array.from({ length: 12 }, (_, i) => ({
    number: i + 1,
    label: (i + 1).toString()
}));

const CustomerTableList = ({ rows }) => {
  return (
    <div style={{ overflowY: "scroll", height: "500px" }}>
      <Table striped bordered hover style={{ margin: 0, padding: 0, color: "red", width: "100%" }}>
        <thead>
          <tr>
            <th style={{ width: "20%", margin: 0, padding: '0 5px' }}></th>
            <th style={{ width: "80%", margin: 0, padding: '0 5px' }}>Pawn Ticket</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td style={{ margin: 2, padding: 2 }}></td>
              <td style={{ margin: 2, padding: 2 }}>{row.CustName}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};


const parseFormattedNumber = (str) => {
  if (!str) return 0;

  // Ensure str is treated as a string
  const number = parseFloat(String(str).replace(/,/g, ''));

  return isNaN(number) ? 0 : number;
};


const defaultServiceFee = "5";


const Renewal = () => {
    const [formData, setFormData] = useState(defaultFormRenewalData);

    
    const [selectedCustomer, setSelectedCustomer] = useState("");
    const [selectedPawnTicket, setSelectedPawnTicket] = useState("");
    const [messageModalShow, setMessageModalShow] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [pawnerPawnTickets, setPawnerPawtickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState("");

    const [enableMonths, setEnableMonths] = useState(true);
    const [isInitiallyLoaded, setIsInitiallyLoaded] = useState(false);


    const [pawnTicketList, setPawnTicketList] = useState([]);
    

    const { CNCode, UserCode } = UserSession();
    const navigate = useNavigate();
    const cncode = CNCode;


    const { data: customers, isLoading: loadingCustomers } = useCustomersQuery(cncode);
    const { data: queryPawnTickets, isLoading: loadingTickets } = usePawnTicketsQuery(cncode);


    useEffect(() => {
        initialLoad();
    }, []);

    useEffect(() => {
        
       if(isInitiallyLoaded){
            renewalOnLoad()
    
            setIsInitiallyLoaded(!isInitiallyLoaded)
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

            // setFormData(prevState => ({
            // ...prevState,
            //     pawner: selectedCustomer
            // }));

            //console.log(selectedCustomer)    
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
            const response = await axios.get(`${StringHost()}/API/SCPWEBAPI/Renewal/InitialLoad?cnCode=${cncode}`);
   
            if(response.status === 200){
                setIsInitiallyLoaded(true)
            }
               
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    

    const renewalOnLoad = async () => {
        try {
        const response = await axios.get(`${StringHost()}/API/SCPWEBAPI/Renewal/RenewalOnload?strURICNCode=${cncode}`);
        
            /*setFormData({
                ...formData, 
                rnPtNo: response.data.txtRNPTNum,
                txtTDate: new Date().toISOString().slice(0, 10),
                txtReference: response.data.txtRNPTNum,
                txtRNPTNum: response.data.txtRNPTNum,
                txtDocNumRenew: response.data.txtDocNumRenew

            })*/

        setFormData(prevState => ({
            ...prevState,
            rnPtNo: response.data.txtRNPTNum,
            txtTDate: new Date().toISOString().slice(0, 10),
            txtReference: response.data.txtRNPTNum,
            txtRNPTNum: response.data.txtRNPTNum,
            txtDocNumRenew: response.data.txtDocNumRenew
        }));
            //setPawnTicketList(response.data.pawnTickets);
        } catch (error) {
            console.error("Error in VerifyUserLogin:", error);
            throw error;
        }
    }


    /*const renewalPawnticket = async (pawnTicketNo) => {
        try {
            const response = await axios.get(`${StringHost()}/API/SCPWEBAPI/Renewal/RenewalPawnticket`, {
                params: { pawnTicketNo: pawnTicketNo, cnCode: cncode },

            });
            console.log(response.data);
            setFormData(prevState => ({
                ...prevState,
                txtStatus: response.data.status
            }));
            //return response.data;
        } catch (error) {
            console.error("Error fetching pawn ticket details:", error);
            throw error;
        }
    };*/


    const renewalDetailsMainFetch = async (pawnTicket) => {
        try {
            const response = await axios.get(
                `${StringHost()}/API/SCPWEBAPI/Renewal/RenewalDetailsMainFetch`,
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

            return null; // Return null to indicate failure
        }
    };


    
    /*const fetchRnPtNo = async () => {
      try {
        const response = await axios.get(`${StringHost()}/API/SCPWEBAPI/Renewal/GetRnPtNo?strURICNCode=${cncode}`);
        setFormData({...formData, rnPtNo: response.data})
      } catch (error) {
        console.error("Error in VerifyUserLogin:", error);
        throw error;
      }
    };*/

    const handleSelectedPawnTicket = async (pt) => {
        
        const TodayDate = new Date(); 
      
        const data = await renewalDetailsMainFetch(pt)
        
        
        if (!data) {
            return; // Abort if fetch failed or returned no data
        }

        //console.log(data)

        const detailsInfo = data.detailsInfo;

        if(data.ticketDetails.pawner !== ""){
            setEnableMonths(false);
        }


        const amountDue = parseFormattedNumber(data.dateValidate.txtInterestDue) + parseFormattedNumber(detailsInfo.txtServiceFee);
    
        
        setFormData(prevState => ({
            ...prevState,
            ...data.ticketDetails,
            ...detailsInfo,
            ...data.vDate,
            txtForDiscount: data.dateValidate.txtForDiscount,
            txtInterestDue: data.dateValidate.txtInterestDue,
            txtRSDiscount: data.dateValidate.txtRSDiscount,
            txtAmountDue: amountDue,
            exactAmountDue: parseFormattedNumber(data.dateValidate.txtInterestDue)
        }));

        
        
        const AuctionDate = new Date(data.detailsInfo.txtAuctionDate); 

        if (TodayDate > AuctionDate) {
           //window.alert("Pawn Ticket is ready for Auction!");

           Notification({ type: "success", message: "Pawn Ticket is ready for Auction!" });
        }
        

        setFormData(prevState => ({
            ...prevState,
            rows: data.detailsInfo.rows
        }));

    }



    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        const inputValue = type === 'checkbox' ? checked : value;

        if(name === "noOfMonths"){
            txtNoMonth_Validating(inputValue);
        }
        
        setFormData(prevState => ({
            ...prevState,
            [name]: inputValue
        }));
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

                const interestDue = prevState.exactAmountDue;
                const serviceFee = parseFormattedNumber(value) || 0;
                const penalty = parseFormattedNumber(prevState.txtPenalty) || 0;
                const discount = parseFormattedNumber(prevState.txtDiscount) || 0;
                const rsDiscount = parseFormattedNumber(prevState.txtRSDiscount) || 0;

                const amountDue = getTotalPayment(interestDue, serviceFee, penalty, discount, rsDiscount) 
                
                return {
                    ...prevState,
                    txtAmountDue: amountDue
                };
            });

      }



      if (name === "txtPenalty") {

            setFormData(prevState => {

                const interestDue = prevState.exactAmountDue;
                const serviceFee = parseFormattedNumber(prevState.txtServiceFee) || 0;
                const penalty = parseFormattedNumber(value) || 0;
                const discount = parseFormattedNumber(prevState.txtDiscount) || 0;
                const rsDiscount = parseFormattedNumber(prevState.txtRSDiscount) || 0;

                const amountDue = getTotalPayment(interestDue, serviceFee, penalty, discount, rsDiscount) 
                
                return {
                    ...prevState,
                    txtAmountDue: amountDue
                };
            });

      }


      if (name === "txtDiscount") {
            setFormData(prevState => {

                const interestDue = prevState.exactAmountDue;
                const serviceFee = parseFormattedNumber(prevState.txtServiceFee) || 0;
                const penalty = parseFormattedNumber(prevState.txtPenalty) || 0;
                const discount = parseFormattedNumber(value) || 0;
                const rsDiscount = parseFormattedNumber(prevState.txtRSDiscount) || 0;

                const amountDue = getTotalPayment(interestDue, serviceFee, penalty, discount, rsDiscount) 
                
                return {
                    ...prevState,
                    txtAmountDue: amountDue
                };
            });

      } 

      if (name === "txtCashRecieved") {
        let change = 0;
        setFormData(prevState => {
            const interestDue = prevState.exactAmountDue;
            const serviceFee = parseFormattedNumber(prevState.txtServiceFee) || 0;
            const penalty = parseFormattedNumber(prevState.txtPenalty) || 0;
            const discount = parseFormattedNumber(prevState.txtDiscount) || 0;
            const rsDiscount = parseFormattedNumber(prevState.txtRSDiscount) || 0;

            const amountDue = getTotalPayment(interestDue, serviceFee, penalty, discount, rsDiscount) 
            const cashRecieved = parseFormattedNumber(value) || 0;

            if(cashRecieved < amountDue){
                Notification({ type: "error", message: "Cash Received is less than to the Amount Due." });    
            }else{
                change = cashRecieved - amountDue;
            }

            return {
                ...prevState,
                txtChange: change
            };
        });

        /*setFormData((prevState) => {
          const amountDue =
            (parseFloat(prevState.exactAmountDue) || 0) +
            (parseFloat(prevState.txtPenalty) || 0) +
            (parseFloat(prevState.txtServiceFee) || 0) ;

          const lessTheDiscount = amountDue - (parseFloat(prevState.txtDiscount) || 0);

          return {
            ...prevState,
            txtChange: (parseFloat(value) || 0) - lessTheDiscount,
          };
        });*/
      }

      
    };


    const getPawnerPawnTickets = async () => {
        try {
            const response = await axios.get(
                `${StringHost()}/API/SCPWEBAPI/Renewal/GetPawnerPawnTickets?cnCode=${cncode}&controlNo=${selectedCustomer}`);
         
            console.log(response)
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

    const getTotalPayment = (txtInterestDue, txtServiceFee, txtPenalty, txtDiscount, txtRSDiscount) => {
        const total = 
            (parseFloat(txtInterestDue) + 
             parseFloat(txtServiceFee) + 
             parseFloat(txtPenalty)) - 
            (parseFloat(txtDiscount) + 
             parseFloat(txtRSDiscount));


        return total;
    };


    const TestDatevalidating = async (data, pawndate) => {
        try {
            const response = await axios.post(`${StringHost()}/API/SCPWEBAPI/Renewal/validate/${pawndate}`, data.totalPaid);

            setFormData(prevState => ({
                ...prevState,
                ...response.data
                //...response.data.totalPaid
            }));


            //console.log(response.data)
        } catch (error) {
            console.error("Error in VerifyUserLogin:", error);
            //throw error;
        }
    };


    const txtNoMonth_Validating = async (month) => {

        const pawnTicket = selectedTicket;
        const params = {
            month,
            pawndate: formData.txtPawnDate,
            request: formData
           
        };

        try {
            const response = await axios.post(
              `${StringHost()}/API/SCPWEBAPI/Renewal/txtMonthValidating`,
              params.request, // Pass request body directly
              {
                params: { 
                  pawnTicket, 
                  cnCode: cncode, 
                  month: params.month, 
                  pawndate: params.pawndate 
                }
              }
            );
                 
            const interestDue = parseFloat(response.data.totalPaid.txtInterestDue.replace(/,/g, ''));

            const amountDue = getTotalPayment(interestDue, 
                                formData.txtServiceFee, 
                                formData.txtPenalty, 
                                formData.txtDiscount, 
                                formData.txtRSDiscount);
            
            //console.log(response.data)
            


            setFormData(prevState => ({
                ...prevState,
                txtAmountDue: amountDue,
                exactAmountDue: interestDue,  
                txtServiceFee: defaultServiceFee,
                txtPenalty: "0.00",
                txtDiscount: "0.00",
                txtRSDiscount: "0.00",
                txtChange: "0.00",
                txtCashRecieved: "0.00",
                txtNewPawnDate: response.data.txtNewPawnDate,
                //...response.data.totalPaid
            }));

            TestDatevalidating(response.data, params.pawndate)


            
        } catch (error) {
            Notification({ type: "error", message: "Sorry, Something went wrong. Contact the administrator." });
            console.error("Error fetching pawn tickets:", error);

            throw error;
        }
    };


    const handlePost = () => {

        if(selectedTicket != ""){
            //console.log(selectedTicket)
            
            setPawnTicketList(prevState => ([
                ...prevState,
                { display: selectedTicket, value: "" }
            ]));

            setFormData(defaultFormRenewalData);
            renewalOnLoad();
        }


    
        setPawnerPawtickets([]);
        setMessageModalShow(false)
    }


    const handleBtnCustomer = () => {
        setMessageModalShow(true);
        
    }

    const handleSubmit = async (e)  => {
        e.preventDefault();
        //console.log(formData)

        const payload = {
            tblMain1: {
                txtDocNumRenew: formData.txtDocNumRenew,
                txtTDate: formData.txtTDate,
                txtReference: formData.txtReference,
                txtControlNo: formData.pawner,
                txtRemarksRenew: formData.txtRemarksRenew,
                txtAmountDue: String(formData.txtAmountDue), 
                cnCode: cncode,
                dblPawnTicket: formData.dblPawnTicket,
                txtBox: formData.txtBox,
                txtNewPawnDate: formData.txtNewPawnDate,
                txtPawnDate: formData.txtPawnDate,
                txtRNPTNum: formData.txtRNPTNum,
                txtPaidBy: formData.txtPaidBy,
                userCode: UserCode
            },

            tblMain3: {
                cnCode: cncode,
                txtDocNumRenew: formData.txtDocNumRenew,
                txtCashRecieved: formData.txtCashRecieved,
                txtChange: String(formData.txtChange), 
                txtPenalty: formData.txtPenalty,
                txtDiscount: formData.txtDiscount,
                txtRSDiscount: formData.txtRSDiscount,
                txtServiceFee: formData.txtServiceFee

            }
        }   


         // Validation checks
        if (!formData.txtTDate) {
            return window.alert("Please complete your entry: Transaction Date is required");
        }

        if (formData.rows.length === 0) {
            return window.alert("Please complete your entry: At least one row is required");
        }

        if (!formData.txtReference) {
            return window.alert("Reference is empty");
        }

        if (!formData.pawner) {
            return window.alert("Name is empty");
        }

        if (!formData.txtPaidBy) {
            return window.alert("Paid By is empty");
        }

        if (formData.txtCashRecieved <= 0) {
            return window.alert("Invalid amount: Cash received must be greater than 0");
        }

        //console.log(payload)
        
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
                const response = await axios.post(`${StringHost()}/API/SCPWEBAPI/Renewal/InsertRenewal`, payload);
                //console.log(response)
                if(response.status === 200){
                    setFormData(defaultFormRenewalData);
                    setSelectedCustomer("");
                    setIsInitiallyLoaded(true);
                    Notification({ type: "success", message: "Data Save Successfully." });
                    setEnableMonths(true)

                    return false;
                }
                

                Notification({ type: "error", message: "Failed to saved, something went wrong. Please contact your administrator." })
                
            } catch (error) {
                console.error("Error fetching pawn tickets:", error);
                
            }
        }

       

        
        
    };

    
    
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


            <div className="bg-prim p-2 fw-bold sticky-top">Renewal</div>

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
                        <div className="border border-primary h-100">
                            <div className="w-100">
                                <div className="d-flex flex-row p-2 justify-content-end align-items-center">
                                    <small htmlFor="">RN PT No.</small>
                                    <FormControl
                                        type="text"
                                        name="rnPtNo"
                                        style={{ width: '15%', marginLeft: '10px' }}
                                        value={formData.rnPtNo}
                                        disabled
                                        className="form-control-sm"
                                    />
                                </div>
                            </div>

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
                        />

                        <CustomInput
                            label="Reference"
                            name="txtReference"
                            onChange={handleChange}
                            value={formData.txtReference}
                            required={true}

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
                            disabled={enableMonths}
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
                            decimal={true}
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
                            decimal={false}
                        />
                        <CustomInput
                            label="Discount"
                            name="txtDiscount"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={formData.txtDiscount}
                            pattern="^\d+(\.\d{1,2})?$"
                            className="text-end"
                            decimal={false}
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
                            decimal={false}
                        />
                        <CustomInput
                            label="Cash Received"
                            name="txtCashRecieved"
                            onChange={handleChange}
                            value={formData.txtCashRecieved}
                            pattern="^\d+(\.\d{1,2})?$"
                            className="text-end"
                            onBlur={handleBlur}
                            decimal={false}
                        />
                    </div>
                    <div className="col-2 p-1 ">
                        <div className="d-flex flex-column h-100 justify-content-end align-items-center">    
     
                            <CustomButton
                                type="button"
                                label="New Renewal"
                                variant="secondary"
                                style={{ width: '50%' }}
                                onClick={() => navigate('new')}
                            />
                        </div>
                    </div>
                </div>
                <div className="row p-2">
                     {/*-------------------------------- SECTION 4 AREA --------------------------------*/}
                    <div className="col-6 p-1">
                        <CustomInput
                            label="Paid By"
                            name="txtPaidBy"
                            onChange={handleChange}
                            value={formData.txtPaidBy}
                            required={true}
                        />
                    </div>
                    <div className="col-2 p-1">
                        <CustomInput
                            label="Renewal Discount"
                            name="txtRSDiscount"
                            onChange={handleChange}
                            value={formData.txtRSDiscount}
                            disabled
                            className="text-end"
                            decimal={false}
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
{/*                        <div className="d-flex flex-column h-100 justify-content-end align-items-center">    
                            <CustomCheckbox
                                label="Save and Print"
                                checked={formData.saveAndPrint}
                                onChange={handleChange} // Handle checkbox change
                            />
                        </div>    */}

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

export default Renewal