import React, { useState, useMemo, useCallback  } from "react";
import { debounce } from 'lodash';

import { useNavigate } from "react-router-dom";

import CustomInput from "../CustomComponents/CustomInput";
import CustomButton from "../CustomComponents/CustomButton";
 
import { UserSession } from "../../../Functions/UtilityFunctions";

import axios from "axios";
import StringHost from "../../../Functions/ConnectionString";

import Notification from '../../../Alert/Notification';
import '../../../Assets/css/PullOutTable.css';

import { useQuery } from '@tanstack/react-query';


function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
}


const loadItems = async (cncode) => {
  try {
    const response = await axios.get(`${StringHost()}/API/SCPWEBAPI/PullOut/ListForPullOut/${cncode}`);
    const data = response.data;

    if (Array.isArray(data) && data.length === 0) {
      return []; // return empty array instead of throwing error
    }

    return data;
  } catch (error) {
    console.error('Initial load failed:', error);
    throw error;
  }
};



const PullOut = () => {

    //const [items, setItems] = useState([]);
    const [debouncedSearch, setDebouncedSearch] = useState('');

    const [selectedItems, setSelectedItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const [selectedRow, setSelectedRow] = useState(null);

    const { CNCode } = UserSession();
    const navigate = useNavigate();


    const { data: items, isLoading, isError, refetch } = useQuery({
        queryKey: ['pulloutItems', CNCode],
            queryFn: () => loadItems(CNCode),
            staleTime: 1000 * 60 * 5, // 5 minutes (prevents refetch for 5 minutes)
            cacheTime: 1000 * 60 * 10, // Optional: Keep cache for 10 minutes
    });



    // useEffect(() => {
    //     loadItems(CNCode);
        
    // }, []);


    
    /*const loadItems = async (cncode) => {
        const start = performance.now();

        try {
            //const response = await axios.get(`${StringHost()}/API/SCPWEBAPI/PullOut/PullOutItems/${cncode}`);
            const response = await axios.get(`${StringHost()}/API/SCPWEBAPI/PullOut/ListForPullOut/${cncode}`);
            const end = performance.now();

            console.log('API Load Time:', (end - start).toFixed(2), 'ms');
            console.log(response.data);
            
            //setItems(response.data)
        } catch (error) {
            console.error('Initial load failed:', error);
        }
    };*/







    const debounceSearch = useCallback(
      debounce((value) => {
        setDebouncedSearch(value);
      }, 300), // Adjust delay as needed
      []
    );


    const handleSelect = (ticket) => {
        setSelectedItems(prevSelected =>
            prevSelected.includes(ticket)
              ? prevSelected.filter(t => t !== ticket)
              : [...prevSelected, ticket]
        );
    };


    const handleRemoveItem = (itemToRemove) => {
        setSelectedItems(prevItems =>
          prevItems.filter(item => item !== itemToRemove)
        )
     };



    const handleChange = (e) => {
        setSearchTerm(e.target.value);
        debounceSearch(e.target.value);
    };

    const handleRowClick = (pawnticket) => {
        navigate(pawnticket)
    }

    const handleSave = async ()  => {
        
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
                const response = await axios.post(`${StringHost()}/API/SCPWEBAPI/PullOut/Items`, selectedItems);

                console.log(response.data);

                if (response.status === 200) {
                    Notification({ type: "success", message: response.data });
                    refetch(); // new implemented tanstack react-query
                    //loadItems(CNCode)
                    setSelectedItems([]);
                    // setEnableMonths(true);
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


    const filteredItems = useMemo(() => {
      if (!debouncedSearch) return items;
      const lower = debouncedSearch.toLowerCase();
      return items?.filter(item =>
        item.pawnTicketNew?.toString().toLowerCase().includes(lower) ||
        item.box?.toString().toLowerCase().includes(lower) ||
        item.custName?.toString().toLowerCase().includes(lower)
      );
    }, [items, debouncedSearch]);


    //if (isLoading) return <p>Loading...</p>;
    //if (isError) return <p>Error: {error.message}</p>;

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

    }


    if (isError) {
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
            <div className="bg-prim p-2 fw-bold sticky-top">Pull Out</div>

            <div className="container h-100" >
                <div className="border border-primary h-100 mt-3">

                    


                    <div style={{ width: "100%", padding: "10px" }}>
                        <CustomInput
                            type="text"
                            label="Search"
                            name="txtSearch"
                            onChange={handleChange}
                            value={searchTerm}
                        />

                        {selectedItems.length > 0 &&
                             <div className="d-inline-block my-2">


                                {selectedItems.map((item, index) => (
                                  <button
                                    key={index}
                                    className="btn btn-outline-primary rounded-pill m-1 w-auto text-capitalize"
                                    onClick={() => handleRemoveItem(item)}
                                  >
                                    {item} <i className="fa-solid fa-xmark"></i>
                                  </button>
                                ))}

                            </div>
                        }
                       

                        <div className="mt-3" style={{ maxHeight: "400px", overflowY: "auto", border: "1px solid black" }}>
                                

                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                          <thead>
                            <tr style={{ backgroundColor: "#f2f2f2", borderBottom: "1px solid black" }}>
                              <th style={{ border: "1px solid black", padding: "5px" }}>No.</th>
                              <th style={{ border: "1px solid black", padding: "5px" }}>Customers Name</th>
                              <th style={{ border: "1px solid black", padding: "5px" }}>Pawn Ticket</th>
                              <th style={{ border: "1px solid black", padding: "5px" }}>Box No</th>
                              <th style={{ border: "1px solid black", padding: "5px" }}>Date</th>
                              <th style={{ border: "1px solid black", padding: "5px" }}>Post</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredItems.length === 0 ? (
                                <tr>
                                  <td
                                    colSpan="6"
                                    style={{ textAlign: "center", padding: "10px", border: "1px solid black" }}
                                  >
                                    No Items Found
                                  </td>
                                </tr>
                              ) : (

                                filteredItems.map((item, index) => (
                                  <tr
                                    key={index}
                                    className={`pullout-table-row ${selectedRow === item.pawnTicketNew ? 'selected' : ''}`}
                                    //onClick={() => handleRowClick(item.pawnTicketNew)}
                                    onDoubleClick={() => handleRowClick(item.pawnTicketNew)}
                                    style={{ borderBottom: "1px solid black" }}
                                  >
                                    <td style={{ border: "1px solid black", padding: "5px" }}>{index + 1}</td>
                                    <td style={{ border: "1px solid black", padding: "5px" }}>{item.custName}</td>
                                    <td style={{ border: "1px solid black", padding: "5px" }}>{item.pawnTicketNew}</td>
                                    <td style={{ border: "1px solid black", padding: "5px" }}>{item.box}</td>
                                    <td style={{ border: "1px solid black", padding: "5px" }}>{formatDate(item.tDate)}</td>
                                    <td style={{ border: "1px solid black", padding: "5px", textAlign: "center" }}>
                                      <input
                                        type="checkbox"
                                        checked={selectedItems.includes(item.pawnTicket)}
                                        onChange={(e) => {
                                          e.stopPropagation(); // prevent row click
                                          handleSelect(item.pawnTicket);
                                        }}
                                      />
                                    </td>
                                  </tr>
                                ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>


                </div>

                <div className="d-flex flex-column h-100 justify-content-end align-items-end">    
     
                    <CustomButton
                        type="button"
                        label="SAVE"
                        size="md"
                        onClick={handleSave}
                    />
                </div>
            </div> 
        </div>
        )
}

export default PullOut