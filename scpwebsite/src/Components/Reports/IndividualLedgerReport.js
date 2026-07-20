import React, { useState, useEffect } from "react";
import { UserSession } from "../../Functions/UtilityFunctions";
import axios from "axios";
import StringHost from "../../Functions/ConnectionString";
import { PrintableContainer } from "../Printing/PrintableContainer"



const defaultBranch = {
    CNCode: "",
    CName: "",
    CAddress: ""
}

const defaultFormData = {
    branch: "",
    customer: ""
}


function formatNumber(num) {
  return Number(num).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

const IndividualLedger = () => {

    const[formData, setFormData] = useState(defaultFormData);

    const[list, setList] = useState([]);
    const[grandTotal, setGrandTotal] = useState({ amount: 0, principalAmount: 0 });
    const[branch, setBranch] = useState(defaultBranch);
    const[branches, setBranches] = useState([]);
    const[customers, setCustomers] = useState([]);

    const[customerName, setCustomerName] = useState("");




    

    const { CNCode, FullName } = UserSession();


    useEffect(() => {

        const initialize = async () => {
            try {
                const response = await axios.get(`${StringHost()}/API/SCPWEBAPI/GetCompanyName`);
                const fetchedBranches = Array.isArray(response.data) ? response.data : [];
                setBranches(fetchedBranches);

                const userHasBranch = fetchedBranches.some(branch => branch.cnCode === CNCode);
                
                if (!userHasBranch) {
                    // Abort execution if the user doesn't have the branch
                    return;
                }

                
                getBranchDetails(CNCode);
                fetchCustomersName(CNCode);

                setFormData(prevState => ({
                    ...prevState,
                    branch: CNCode
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


    
    const getBranchDetails = async (cnCode) => {
        try {
            const response = await axios.get(`${StringHost()}/API/SCPWEBAPU/GetBranchName?strURICNCode=${cnCode}`);
            setBranch(response.data)
        } catch (error) {
            console.error("Error in VerifyUserLogin:", error);
            throw error;
        }
    };


    const fetchCustomersName = async (cnCode) => {
      try {
        const response = await axios.get(`${StringHost()}/API/SCPWEBAPI/PartialPayment/GetCustomersName/${cnCode}`);
        //console.log(response.data)
        setCustomers(response.data)

      } catch (error) {
        console.error("Error:", error);
        
      }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'customer') {
            // Find the customer object by controlNo
            const selectedCustomer = customers.find(
                (customer) => customer.controlNo === value
            );

            if (selectedCustomer) {
                // Set the customer name
                setCustomerName(selectedCustomer.custName.trim());
            } else {
                // Clear name if no match is found
                setCustomerName('');
            }
        }



        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));

        

    };


    


    const handlePreview = async (e) => {
        e.preventDefault()
        
        try {
            const response = await axios.get(`${StringHost()}/API/SCPWEBAPI/Voucher/Individual?cnCode=${formData.branch}&controlNo=${formData.customer}`);
            
            //console.log(response.data);
            setList(response.data)
        } catch (error) {
            console.error("Error in VerifyUserLogin:", error);
            
        }
    };


    const groupedData = list.reduce((acc, item) => {
        if (!acc[item.pawnTicket]) {
            acc[item.pawnTicket] = [];
        }
        acc[item.pawnTicket].push(item);
        return acc;
    }, {});

    

    

    

    return (
        <>

        <form onSubmit={handlePreview}>


        <div className="p-2 fw-bold sticky-top d-flex gap-3 shadow align-items-end">


            <div className="w-100">
                <small className="">Report to Print:</small>
                <select
                    className="form-select form-select-sm fw-bold"
                    name="selectedBoxNo"
                // value={mdlNewLoan.selectedBoxNo}
                // onChange={(e) => handleChanges(e)}
                >
                    <option value="01">Individual Ledger</option>
                </select>
            </div>

            <div className="w-100 d-flex gap-1 align-items-center">
                <div className="w-100">
                <small className="">Customer:</small>
                <select
                    className="form-select form-select-sm fw-bold"
                    name="customer"
                    value={formData.customer}
                    onChange={handleChange}
                    required
                >   
                    <option value="">
                        SELECT CUSTOMER
                    </option>
                    {customers.map(branch => (
                        <option key={branch.controlNo} value={branch.controlNo}>
                            {branch.custName}
                        </option>
                    ))}
                </select>
                </div>
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


        {list.length === 0 ?

            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh' // Adjust height as needed
            }}>
                <p>No data found.</p>
            </div>

            :

            <PrintableContainer Orientation="Portrait">

                <div class="">
                  <p class="m-0 p-0 fw-bold">{branch.CName}</p>
                  <p class="m-0 p-0">{branch.CAddress}</p>
                  <p class="m-0 p-0 fw-bold">INDIVIDUAL LEDGER</p>
                  <p class="m-0 p-0">PAWNER NAME: {customerName}</p>
                </div>

                <div className="table-responsive mt-4 p-1 border-top border-2">
                    <table className="table table-sm table-hover table-stripe">
                        <thead>
                            <tr className="small">
                                <th>Date</th>
                                <th>Box No</th>
                                <th>Remarks</th>
                                <th className="text-end">Principal</th>
                                <th className="text-end">Interest</th>
                                <th className="text-end">Payment</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(groupedData).map(([ticket, records], index) => (
                                <React.Fragment key={index}>
                                    <tr className="small">
                                        <td colSpan="6"><strong>{ticket}</strong></td>
                                    </tr>
                                    {records.map((entry, idx) => (
                                        <tr className="small border-bottom border-dark" key={idx}>
                                            <td>{new Date(entry.dlgDate).toLocaleDateString()}</td>
                                            <td>{entry.boxNo}</td>
                                            <td>{entry.remarks}</td>
                                            <td className="text-end">{formatNumber(entry.principalAmount)}</td>
                                            <td className="text-end">{formatNumber(entry.interest)}</td>
                                            <td className="text-end">{formatNumber(entry.payment)}</td>
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
                </PrintableContainer>



        }
        

       
    </>)

}


export default IndividualLedger