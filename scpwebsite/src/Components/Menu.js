import React, { useState } from "react";
import { Collapse } from "react-bootstrap";

export default function Menu({ handleMenuClick, activeMenu, handleLogout }) {
  const [DDopenStates, setDDOpenStates] = useState({
    category: false,
    otherCategory: false,
  });

  const toggleDropdown = (key) => {
    setDDOpenStates((prevState) => ({ ...prevState, [key]: !prevState[key] }));
  };

  return (
    <>
      <div className="d-grid p-0 h-100">
        <div className="list-group list-group-flush" id="menu">

            <a className="navbar-brand text-center" href="#!">
              <img
                src="../../Imgs/diamond.png"
                alt="logo"
                height="120"
                className="mt-3"
              />
            </a>
            <hr></hr>
            {/*<button  className={`list-group-item list-group-item-action ${activeMenu === "Dashboard" ? "selected" : ""}`} onClick={() => handleMenuClick("Dashboard")}><i className="fa-solid fa-chart-bar"></i> Dashboard</button>*/}
            <button  className={`list-group-item list-group-item-action ${activeMenu === "File" ? "selected" : ""}`} onClick={() => {toggleDropdown("File"); handleMenuClick("File")}}>
            <span className="d-flex align-items-center justify-content-between"><span><i className="fa-regular fa-folder-open"></i> File</span><i className={`fa-solid fa-chevron-right ${DDopenStates.File ? "rotate" : ""}`}></i></span>
            </button>
            <Collapse in={DDopenStates.File}>
            <div>
                <button  className={`list-group-item list-group-item-action ${activeMenu === "Company" ? "selected" : ""}`} onClick={() => handleMenuClick("Company")}>&nbsp;&nbsp;<i className="fa-solid fa-building"></i> Company</button>
                {/* <button  className={`list-group-item list-group-item-action ${activeMenu === "NoofCopies" ? "selected" : ""}`} onClick={() => handleMenuClick("NoofCopies")}>&nbsp;<i className="fa-regular fa-copy"></i> No. of Copies to Print</button> */}
                <button  className={`list-group-item list-group-item-action ${activeMenu === "SecDate" ? "selected" : ""}`} onClick={() => handleMenuClick("SecDate")}>&nbsp;&nbsp;<i className="fa-solid fa-calendar-check"></i> Security Date</button>
                <button  className={`list-group-item list-group-item-action fs-6 ${activeMenu === "Reset" ? "selected" : ""}`} onClick={() => handleMenuClick("Reset")}>&nbsp;&nbsp;<i className="fa-solid fa-power-off"></i> Reset</button>
            </div>
            </Collapse>

            <button  className={`list-group-item list-group-item-action ${activeMenu === "Setup" ? "selected" : ""}`} onClick={() => {toggleDropdown("Setup"); handleMenuClick("Setup")}}>
            <span className="d-flex align-items-center justify-content-between"><span><i className="fa-solid fa-gears"></i> Setup</span><i className={`fa-solid fa-chevron-right ${DDopenStates.Setup ? "rotate" : ""}`}></i></span>
            </button>
            <Collapse in={DDopenStates.Setup}>
            <div>
                <button  className={`list-group-item list-group-item-action ${activeMenu === "ERS" ? "selected" : ""}`} onClick={() => handleMenuClick("ERS")}>&nbsp;&nbsp;<i className="fa-solid fa-arrow-rotate-right fa-flip-horizontal"></i> Early Renewal</button>
                <button  className={`list-group-item list-group-item-action ${activeMenu === "IR" ? "selected" : ""}`} onClick={() => handleMenuClick("IR")}>&nbsp;&nbsp;<i className="fa-solid fa-percent"></i> Interest Rate</button>
                <button  className={`list-group-item list-group-item-action ${activeMenu === "IRT" ? "selected" : ""}`} onClick={() => handleMenuClick("IRT")}>&nbsp;&nbsp;<i className="fa-solid fa-cubes"></i> Interest Rate Gold</button>
                <button  className={`list-group-item list-group-item-action fs-6 ${activeMenu === "PTNoSetup" ? "selected" : ""}`} onClick={() => handleMenuClick("PTNoSetup")}>&nbsp;&nbsp;<i className="fa-solid fa-note-sticky"></i> P.T. Number</button>
                <button  className={`list-group-item list-group-item-action fs-6 ${activeMenu === "ER" ? "selected" : ""}`} onClick={() => handleMenuClick("ER")}>&nbsp;&nbsp;<i className="fa-solid fa-hand-holding"></i> Early Redemption</button>
                <button  className={`list-group-item list-group-item-action ${activeMenu === "SB" ? "selected" : ""}`} onClick={() => handleMenuClick("SB")}>&nbsp;&nbsp;<i className="fa-solid fa-box-archive"></i> Setup Box</button>
            </div>
            </Collapse>

            <button  className={`list-group-item list-group-item-action ${activeMenu === "Entry" ? "selected" : ""}`} onClick={() => {toggleDropdown("Entry"); handleMenuClick("Entry")}}>
            <span className="d-flex align-items-center justify-content-between"><span><i className="fa-regular fa-square-plus"></i> Entry</span><i className={`fa-solid fa-chevron-right ${DDopenStates.Entry ? "rotate" : ""}`}></i></span>
            </button>
            <Collapse in={DDopenStates.Entry}>
            <div>
                <button  className={`list-group-item list-group-item-action ${activeMenu === "EntryCustomer" ? "selected" : ""}`} onClick={() => handleMenuClick("EntryCustomer")}>&nbsp;&nbsp;<i className="fa-solid fa-users"></i> Customer</button>
                <button  className={`list-group-item list-group-item-action ${activeMenu === "EntryCondition" ? "selected" : ""}`} onClick={() => handleMenuClick("EntryCondition")}>&nbsp;&nbsp;<i className="fa-solid fa-clipboard-check"></i> Condition</button>
                <button  className={`list-group-item list-group-item-action ${activeMenu === "EntryColor" ? "selected" : ""}`} onClick={() => handleMenuClick("EntryColor")}>&nbsp;&nbsp;<i className="fa-solid fa-paintbrush"></i> Color</button>
                <button  className={`list-group-item list-group-item-action fs-6 ${activeMenu === "EntryItem" ? "selected" : ""}`} onClick={() => handleMenuClick("EntryItem")}>&nbsp;&nbsp;<i className="fa-solid fa-ring"></i> Item</button>
                <button  className={`list-group-item list-group-item-action ${activeMenu === "EntryDiamondShape" ? "selected" : ""}`} onClick={() => handleMenuClick("EntryDiamondShape")}>&nbsp;&nbsp;<i className="fa-solid fa-diamond"></i> Diamond Shape</button>

                <button  className={`list-group-item list-group-item-action ${activeMenu === "EntryBirthstone" ? "selected" : ""}`} onClick={() => handleMenuClick("EntryBirthstone")}>&nbsp;&nbsp;<i className="fa-solid fa-gem"></i> Birthstone</button>
                <button  className={`list-group-item list-group-item-action ${activeMenu === "EntryBirthstoneColor" ? "selected" : ""}`} onClick={() => handleMenuClick("EntryBirthstoneColor")}>&nbsp;&nbsp;<i className="fa-solid fa-palette"></i> Birthstone Color</button>
                {/*<button  className={`list-group-item list-group-item-action ${activeMenu === "LimitBoxNoSetup" ? "selected" : ""}`} onClick={() => handleMenuClick("LimitBoxNoSetup")}>&nbsp;&nbsp;<i className="fa-solid fa-circle-stop"></i> Limit Box No. Setup</button>*/}
                <button  className={`list-group-item list-group-item-action fs-6 ${activeMenu === "EntryMade" ? "selected" : ""}`} onClick={() => handleMenuClick("EntryMade")}>&nbsp;&nbsp;<i className="fa-solid fa-map-location-dot"></i> Made</button>
                <button  className={`list-group-item list-group-item-action ${activeMenu === "EntryKarat" ? "selected" : ""}`} onClick={() => handleMenuClick("EntryKarat")}>&nbsp;&nbsp;<i className="fa-solid fa-weight-scale"></i> Karat</button>
                <button  className={`list-group-item list-group-item-action ${activeMenu === "EntryBrand" ? "selected" : ""}`} onClick={() => handleMenuClick("EntryBrand")}>&nbsp;&nbsp;<i className="fa-solid fa-store"></i> Brand</button>
                <button  className={`list-group-item list-group-item-action ${activeMenu === "EntryModel" ? "selected" : ""}`} onClick={() => handleMenuClick("EntryModel")}>&nbsp;&nbsp;<i className="fa-solid fa-pen-to-square"></i> Model</button>
                <button  className={`list-group-item list-group-item-action ${activeMenu === "EntryTitus" ? "selected" : ""}`} onClick={() => handleMenuClick("EntryTitus")}>&nbsp;&nbsp;<i className="fa-regular fa-star"></i> Titus</button>
            </div>
            </Collapse>

            <button  className={`list-group-item list-group-item-action ${activeMenu === "Transaction" ? "selected" : ""}`} onClick={() => {toggleDropdown("Transaction"); handleMenuClick("Transaction")}}>
            <span className="d-flex align-items-center justify-content-between"><span><i className="fa-solid fa-file-circle-plus"></i> Transaction</span><i className={`fa-solid fa-chevron-right ${DDopenStates.Transaction ? "rotate" : ""}`}></i></span>
            </button>
            <Collapse in={DDopenStates.Transaction}>
            <div>
                <button  className={`list-group-item list-group-item-action ${activeMenu === "NL" ? "selected" : ""}`} onClick={() => handleMenuClick("NewLoan")}>&nbsp;&nbsp;<i className="fa-solid fa-file-circle-plus"></i> New Loan</button>
                <button  className={`list-group-item list-group-item-action ${activeMenu === "Renewal" ? "selected" : ""}`} onClick={() => handleMenuClick("Renewal")}>&nbsp;&nbsp;<i className="fa-solid fa-rotate"></i> Renewal</button>
                <button  className={`list-group-item list-group-item-action ${activeMenu === "RD" ? "selected" : ""}`} onClick={() => handleMenuClick("Redemption")}>&nbsp;&nbsp;<i className="fa-regular fa-handshake"></i> Redemption </button>
                <button  className={`list-group-item list-group-item-action fs-6 ${activeMenu === "PullOut" ? "selected" : ""}`} onClick={() => handleMenuClick("PullOut")}>&nbsp;&nbsp;<i className="fa-solid fa-outdent"></i> Pull Out</button>
                <button  className={`list-group-item list-group-item-action ${activeMenu === "PartialPayment" ? "selected" : ""}`} onClick={() => handleMenuClick("PartialPayment")}>&nbsp;&nbsp;<i className="fa-solid fa-hand-holding-dollar"></i> Partial Payment</button>
                
        
            </div>
            </Collapse>

            <button  className={`list-group-item list-group-item-action ${activeMenu === "Search" ? "selected" : ""}`} onClick={() => {toggleDropdown("Search"); handleMenuClick("Search")}}>
            <span className="d-flex align-items-center justify-content-between"><span><i className="fa-solid fa-magnifying-glass-arrow-right"></i> Search</span><i className={`fa-solid fa-chevron-right ${DDopenStates.Search ? "rotate" : ""}`}></i></span>
            </button>
            <Collapse in={DDopenStates.Search}>
            <div>
                <button  className={`list-group-item list-group-item-action ${activeMenu === "ST" ? "selected" : ""}`} onClick={() => handleMenuClick("ST")}>&nbsp;&nbsp;<i className="fa-solid fa-magnifying-glass"></i> Search Transaction</button>
                <button  className={`list-group-item list-group-item-action ${activeMenu === "RA" ? "selected" : ""}`} onClick={() => handleMenuClick("RA")}>&nbsp;&nbsp;<i className="fa-solid fa-magnifying-glass-plus"></i> Ready for Auction</button>
            </div>
            </Collapse>

            <button  className={`list-group-item list-group-item-action ${activeMenu === "Security" ? "selected" : ""}`} onClick={() => {toggleDropdown("Security"); handleMenuClick("Security")}}>
            <span className="d-flex align-items-center justify-content-between"><span><i className="fa-solid fa-shield-halved"></i> Security</span><i className={`fa-solid fa-chevron-right ${DDopenStates.Security ? "rotate" : ""}`}></i></span>
            </button>
            <Collapse in={DDopenStates.Security}>
            <div>
                <button  className={`list-group-item list-group-item-action ${activeMenu === "Users" ? "selected" : ""}`} onClick={() => handleMenuClick("Users")}>&nbsp;&nbsp;<i className="fa-solid fa-user"></i> Users</button>
                <button  className={`list-group-item list-group-item-action ${activeMenu === "Group" ? "selected" : ""}`} onClick={() => handleMenuClick("Group")}>&nbsp;&nbsp;<i className="fa-solid fa-user-group"></i> Group</button>
                {/*<button  className={`list-group-item list-group-item-action ${activeMenu === "Membership" ? "selected" : ""}`} onClick={() => handleMenuClick("Membership")}>&nbsp;&nbsp;<i className="fa-solid fa-users-between-lines"></i> Membership</button>*/}
                <button  className={`list-group-item list-group-item-action ${activeMenu === "Permission" ? "selected" : ""}`} onClick={() => handleMenuClick("Permission")}>&nbsp;&nbsp;<i className="fa-regular fa-circle-check"></i> Permission</button>
            </div>
            </Collapse>

            <button  className={`list-group-item list-group-item-action ${activeMenu === "Reports" ? "selected" : ""}`} onClick={() => {toggleDropdown("Reports"); handleMenuClick("Reports")}}>
            <span className="d-flex align-items-center justify-content-between"><span><i className="fa-regular fa-newspaper"></i> Reports</span><i className={`fa-solid fa-chevron-right ${DDopenStates.Reports ? "rotate" : ""}`}></i></span>
            </button>
            <Collapse in={DDopenStates.Reports}>
            <div>
                <button  className={`list-group-item list-group-item-action ${activeMenu === "Transactions" ? "selected" : ""}`} onClick={() => handleMenuClick("Transactions")}>&nbsp;&nbsp;<i className="fa-solid fa-file-circle-check"></i> Transactions</button>
                <button  className={`list-group-item list-group-item-action ${activeMenu === "IL" ? "selected" : ""}`} onClick={() => handleMenuClick("IL")}>&nbsp;&nbsp;<i className="fa-solid fa-user-check"></i> Individual Ledgers</button>
            </div>
            </Collapse>

            <button  className={`list-group-item list-group-item-action mt-auto ${activeMenu === "Logout" ? "selected" : ""}`} onClick={() => handleLogout()}><i className="fa-solid fa-right-from-bracket"></i> Logout</button>
          
        </div>
      </div>
    </>
  );
}
