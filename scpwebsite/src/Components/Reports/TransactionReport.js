import React, { useState, useEffect } from "react";
import axios from "axios";
import StringHost from "../../Functions/ConnectionString";
import { UserSession } from "../../Functions/UtilityFunctions";

import TransactionNewLoanReport from "./TransactionNewLoanReport"
import TransactionRenewalReport from "./TransactionRenewalReport"
import TransactionRedemptionReport from "./TransactionRedemptionReport"
import TransactionReadyForAuctionReport from "./TransactionReadyForAuctionReport"
import TransactionPulloutReport from "./TransactionPulloutReport"




const today = new Date().toISOString().split('T')[0];

/*const defaultFormData = {
    reportType: "", 
    fromDate: "2024-06-10",
    toDate: "2024-06-10",
    asOfToday: "2024-06-10",
    branch: "",
    data: false
}*/

const defaultFormData = {
    reportType: "", 
    fromDate: today,
    toDate: today,
    asOfToday: today,
    branch: "",
    data: false
}




const TransactionReport = () => {

    const[list, setList] = useState([]);
    const[formData, setFormData] = useState(defaultFormData);

    const[renderAsOfToday, setRenderAsOfToday] = useState(false);
    const[isPullOutRender, setIsPullOutRender] = useState(false);


    const[shouldRenderComponent, setShouldRenderComponent] = useState(true);
    const[branches, setBranches] = useState([]);

    const[render, setRender] = useState(false);

    const { CNCode, FullName } = UserSession();


    useEffect(() => {

        const initialize = async () => {
            try {
                const response = await axios.get(`${StringHost()}/API/SCPWEBAPI/GetCompanyName`);
                const fetchedBranches = Array.isArray(response.data) ? response.data : [];
                setBranches(fetchedBranches);

                const userHasBranch = fetchedBranches.some(branch => branch.cnCode === CNCode);

                setFormData(prevState => ({
                    ...prevState,
                    branch: CNCode,
                    data: userHasBranch,
                    user: FullName
                }));
            } catch (error) {
                console.error("Error fetching branches:", error);
                setBranches([]); // optional fallback
                setFormData(prevState => ({
                    ...prevState,
                    data: false
                }));
            }
        };

        initialize();
    }, [CNCode]);



    /*const fetchBranches = async () => {
        try {
            const response = await axios.get(`${StringHost()}/API/SCPWEBAPI/GetCompanyName`);
            console.log(response.data)
            setBranches(response.data)

        } catch (error) {
            console.error("Error in VerifyUserLogin:", error);
            throw error;
        }

    };*/

    

    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        
        if (name === 'reportType') {
            setRenderAsOfToday(value === '05');
            setIsPullOutRender(value === '04');
            setShouldRenderComponent(false);
        }



        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));

        
    };


    const handlePreview = (e) => {
        e.preventDefault();

        setShouldRenderComponent(false);

        // Give React a tick to unmount, then remount
        setTimeout(() => {
            setFormData(prev => ({
                ...prev,
                data: !prev.data  // Toggle or update to trigger new key
            }));
            setShouldRenderComponent(true);
            setRender(true)
        }, 0);
    };




   const renderComponent = () => {
        const key = `${formData.reportType}-${formData.data}`; // Changing key forces remount

        switch (formData.reportType) {
            case '01':
                return <TransactionNewLoanReport key={key} formData={formData} render={render} />;
            case '02':
                return <TransactionRenewalReport key={key} formData={formData} render={render} />;
            case '03':
                return <TransactionRedemptionReport key={key} formData={formData} render={render} />;
            case '04':
                return <TransactionPulloutReport key={key} formData={formData} render={render} />;
            case '05':
                return <TransactionReadyForAuctionReport key={key} formData={formData} render={render} />;
            default:
                return null;
        }
    };

    


    return (

        <>
        <form onSubmit={handlePreview}>
        <div className="p-2 fw-bold sticky-top d-flex gap-3 shadow align-items-end">

            <div className="w-100">
                <small className="">Report to Print:</small>
                <select
                    className="form-select form-select-sm fw-bold"
                    name="reportType"
                    onChange={handleChange}
                >   
                    <option value="">Choose Report Type</option>
                    <option value="01">New Loan</option>
                    <option value="02">Renewal Slip</option>
                    <option value="03">Redemption Slip</option>
                    <option value="04">Pull Out</option>
                    <option value="05">Ready for Auction</option>
                </select>
            </div>

            <div className="w-100 d-flex gap-1 align-items-center">
                {renderAsOfToday &&
                    <div className="w-100">
                        <small className="">As of Today:</small>
                        <input name="asOfToday" type="date" onChange={handleChange} value={formData.asOfToday} className="form-control form-control-sm" required/>
                    </div>
                }
                
                {!isPullOutRender &&
                    <>
                    <div className="w-100">
                        <small className="">From:</small>
                        <input name="fromDate" type="date" onChange={handleChange} value={formData.fromDate} className="form-control form-control-sm" required/>
                    </div>

                    <div className="w-100">
                        <small className="">To:</small>
                        <input name="toDate" type="date" onChange={handleChange} value={formData.toDate} className="form-control form-control-sm" required/>
                    </div>
                    </>
                }
                
            </div>

            <div className="w-100">
                <small className="">Branch:</small>
                <select
                    className="form-select form-select-sm fw-bold"
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                >
                    {branches.map(branch => (
                        <option key={branch.cnCode} value={branch.cnCode}>
                            {branch.cName}
                        </option>
                    ))}
                </select>
            </div>


            <div className="w-25">
                <button type="submit" className="btn btn-sm bg-prim ">Preview</button>
            </div>

           
        </div>

        </form>

        <div className="table-responsive mt-4 p-1 border-top border-2">
           {shouldRenderComponent && renderComponent()}
        </div>
    </>
    )

}

export default TransactionReport;