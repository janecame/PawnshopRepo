import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";


import CustomInput from "../CustomComponents/CustomInput";
import CustomSelect from "../CustomComponents/CustomSelect";

import axios from "axios";
import StringHost from "../../../Functions/ConnectionString";
import Select from 'react-select'

import { UserSession } from "../../../Functions/UtilityFunctions";


import Notification from "../../../Alert/Notification";


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


const PullOutPawnTicket = () => {

    const [formData, setFormData] = useState(defaultFormData);
    const [customers, setCustomers] = useState([]);
    //const [enableMonths, setEnableMonths] = useState(true);
    //const [pawnerPawnTickets, setPawnerPawtickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState("");
    const [pawnTicketList, setPawnTicketList] = useState([]);

    const [errorFetch, setErrorFetch] = useState(false);
    const [loadingFetch, setLoadingFetch] = useState(false);


    const { id } = useParams();
    const userSession = UserSession();
    const cncode = userSession.CNCode;


    useEffect(() => {

    	setLoadingFetch(true)

        if (id) {
        	const validatePawnTicket = async () => {
                try {
                    const data = await isPawnTicketExist(id);
                   	if(data.success){
                   		pullOutPawnTicketDetails(id)
                   	}else{
                        setLoadingFetch(false)
                        setErrorFetch(true)
                    }

                } catch (err) {
                    console.error(err.response.data.message);
                    Notification({ type: "error", message: err.response.data.message })
                    setLoadingFetch(false)
                    setErrorFetch(true)
                }

            }

            validatePawnTicket();
	        fetchCustomersName();
			fetchPawnTickets();
        }

      

    }, [id]);



    const isPawnTicketExist = async (pt) => {
        try {
            const response = await axios.get(`${StringHost()}/API/SCPWEBAPI/PullOut/PullOutPawnTickets/${cncode}/${pt}`);
            return response.data;
        } catch (error) {
            throw error; // throw so it can be caught by the caller
        }
    };





    const fetchCustomersName = async () => {
      try {
        const response = await axios.get(`${StringHost()}/API/SCPWEBAPI/PartialPayment/GetCustomersName/${cncode}`);
        setCustomers(response.data)

      } catch (error) {
        console.error("Error:", error);
        
      }
    }

    const fetchPawnTickets = async () => {
        try {
            const response = await axios.get(`${StringHost()}/API/SCPWEBAPI/PartialPayment/GetPawnTickets/${cncode}`);
            setPawnTicketList(response.data);
        } catch (error) {
            console.error("Error:", error);
         
        }
    }


    /*const getPawnerPawnTickets = async (customer) => {
        
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
            throw error;
        }
        
    }*/

    /*const renewalOnLoad = async () => {
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
    }*/

    const pullOutPawnTicketDetails = async (pawnTicket) => {
        try {

            const response = await axios.get(
                `${StringHost()}/API/SCPWEBAPI/PullOut/PullOutDetailsMainFetch`, 
                //`${StringHost()}/API/SCPWEBAPI/PullOut/PullOutDetailsMainFetch`, 
                
                { params: { pawnTicket, cncode } }
            );
            

            setSelectedTicket(pawnTicket)
            const data = response.data;
            //console.log(data)
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

            setLoadingFetch(false)
            setErrorFetch(false)
        
        } catch (error) {
            console.error("Error fetching pawn tickets:", error);
            setLoadingFetch(false)
            setErrorFetch(true)
           
        }
    };



    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        let inputValue = type === 'checkbox' ? checked : value;

        setFormData(prevState => ({
            ...prevState,
            [name]: inputValue
        }));
    };
 


    /*const handlePost = () => {

        if(selectedTicket != ""){
            console.log(selectedTicket)
            
            setPawnTicketList(prevState => ([
                ...prevState,
                { display: selectedTicket, value: "" }
            ]));

            setFormData(defaultFormData);
            //renewalOnLoad();
        }

        //setPawnerPawtickets([]);
    }*/


    /*const handleBtnCustomer = () => {
        setPawnerPawtickets([]);
        
    }*/


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
        console.log(formData)

        const payload = {
            ppAmount: parseFloat(formData.txtPartialPayment),
            pawnTicket: formData.txtOldPawnTicket,
            remarks: formData.txtRemarksRenew,
            cnCode: cncode

        }

        console.log(payload);


        /*const confirm = await new Promise((resolve) => {
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

                console.log(response.data);

                // Check response here
                // if (response.status === 200 && response.data === "Data successfully inserted.") {
                //     Notification({ type: "success", message: "Data successfully saved." });
                //     // setEnableMonths(true);
                // } else {
                //     Notification({ type: "error", message: "Failed to save data." });
                // }

            } catch (error) {
                console.error("Error saving redemption:", error);
                Notification({ type: "error", message: "Error saving redemption." });
                // No need to throw unless you want the parent to catch it
            }
        }*/

        
    }


    if (loadingFetch) {
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


    if (errorFetch) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh' // Adjust height as needed
            }}>
                <p>Sorry data couldn't load. Contact your adminstrator.</p>
            </div>
        );
    }


    return(
        <div>
           


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
                                isDisabled={true}

                            />

                            {/*<CustomButton 
                                label="CUSTOMER"
                                size="sm"
                                variant="primary"
                                style={{ marginLeft: '5px' }}
                                onClick={handleBtnCustomer} 
                            />*/}

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
                                <div className="col-6">
                                    <CustomInput
                                        label="Pawn Ticket"
                                        name="txtOldPawnTicket"
                                        onChange={handleChange}
                                        value={formData.txtOldPawnTicket}
                                        disabled
                                    />
                                </div>
                                <div className="col-6">
                                    <CustomInput
                                        label="Box"
                                        name="txtBox"
                                        onChange={handleChange}
                                        value={formData.txtBox}
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
                                    disabled
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
                            disabled
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
                            disabled
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
                        
                    </div>
                    
                </div>


            </form>    
            </div> 
        </div>
     )
}

export default PullOutPawnTicket;