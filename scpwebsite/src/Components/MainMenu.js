// MainMenu.js
import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useNavigate, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ExpireComponentToken, userSessionCredentials, UserSession } from "../Functions/UtilityFunctions";
import axios from "axios";

import Sidebar from "./SideBar";
import Menu from "./Menu";

// Import all your components
import Dashboard from "./Dashboard";
import Company from "./File/Company";
import SecurityDate from "./File/SecurityDate";
import Reset from "./File/Reset";
import EarlyRenewalSetup from "./Setup/EarlyRenewalSetup";
import InterestRate from "./Setup/InterestRate";
import InterestRateGold from "./Setup/InterestRateGold";
import PTNoSetup from "./Setup/PTNoSetup";
import Customer from "./Entry/Customer";
import Condition from "./Entry/Condition";
import Items from "./Entry/Items";
import Color from "./Entry/Color";
import DiamondShape from "./Entry/DiamondShape";
import BirthStone from "./Entry/BirthStone";
import EarlyRedemptionSetup from "./Setup/EarlyRedemptionSetup"; // Corrected typo
import SetupBoxNo from "./Setup/SetupBoxNo";
import BirthStoneColor from "./Entry/BirthStoneColor";
import Made from "./Entry/Made";
import Karat from "./Entry/Karat";
import Brand from "./Entry/Brand";
import Model from "./Entry/Model";
import Titus from "./Entry/Titus";
import NewLoan from "./Transaction/NewLoan";
import Renewal from "./Transaction/Renewal";
import NewRenewal from "./Transaction/Renewal/NewRenewal";
import RedemptionAll from "./Transaction/Redemption-All";
import PartialPayment from "./Transaction/PartialPayment";
import PullOut from "./Transaction/PullOut";
import PullOutPawnTicket from "./Transaction/PullOut/PullOutPawnTicket";


import ReadyForAuction from "./Search/ReadyForAuction";
import SearchTransaction from "./Search/SearchTransaction";



import TransactionReport from "./Reports/TransactionReport";
import IndividualLedger from "./Reports/IndividualLedgerReport";

import Unauthorized from "../ErrorPages/Unauthorized";

import Group from "./Security/Group";
import Users from "./Security/Users";
import UsersForm from "./Security/UsersForm";
import Permission from "./Security/Permission";

import { useGroupPermissions } from '../Hooks/useSecurityQueries';


export default function MainMenu() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { GroupCode, FullName } = UserSession();
  const user = FullName || "Developer";

  const [showsidebar, setShowSidebar] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("");


  const { data: permission, isLoading: loadingPermissions } = useGroupPermissions(GroupCode);

  
  useEffect(() => {
    const varToken = ExpireComponentToken();
    if (varToken === null) {
      navigate("/");
    } else {
      axios.defaults.headers.common["Authorization"] = `Bearer ${varToken}`;
    }
  }, [navigate]);

  const handleLogout = async () => {
    userSessionCredentials(null);
    if ((await ExpireComponentToken()) === null) {
      navigate("/");
    }
  };

  const menuPathMap = {
    "Dashboard": "dashboard",
    "Company": "file/company",
    "SecDate": "file/security-date",
    "Reset": "file/reset",
    "ERS": "setup/early-renewal",
    "IR": "setup/interest-rate",
    "IRT": "setup/interest-rate-gold",
    "PTNoSetup": "setup/pt-no-setup",
    "ER": "setup/early-redemption",
    "SB": "setup/setup-box-no",
    "EntryCustomer": "entry/customer",
    "EntryCondition": "entry/condition",
    "EntryColor": "entry/color",
    "EntryItem": "entry/item",
    "EntryDiamondShape": "entry/diamond-shape",
    "EntryBirthstoneColor": "entry/birthstone-color",
    "EntryBirthstone": "entry/birthstone",
    "EntryMade": "entry/made",
    "EntryKarat": "entry/karat",
    "EntryBrand": "entry/brand",
    "EntryModel": "entry/model",
    "EntryTitus": "entry/titus",
    "NewLoan": "transaction/new-loan",
    "Renewal": "transaction/renewal",
    "NewRenewal": "transaction/renewal/new",
    "Redemption": "transaction/redemption-all",
    "PullOut": "transaction/pull-out",
    "PartialPayment": "transaction/partial-payment",
    "RA": "search/ready-for-auction",
    "ST": "search/search-transaction",
    "Transactions": "reports/transactions",
    "IL": "reports/individual-ledger",
    "Group": "security/group",
    "Users": "security/users",
    "Permission": "security/permission",
    "Logout": "/",
  };

  const handleMenuClick = (menu) => {
  // Check if menu is included in permission
    // console.log(menu)
    // console.log(permission)
    if (permission.includes(menu)) {
      navigate('unauthorized');
      return; // Exit early if unauthorized
    }

    setSelectedMenu(menu);
    const path = menuPathMap[menu];

    if (path) {
      if (menu === "Logout") {
        handleLogout();
      } else {
        navigate(path);
        setShowSidebar(false);
      }
    }
  };



  const handleClose = () => setShowSidebar(false);
  const handleShow = () => setShowSidebar(true);

  const getKeyByValue = (obj, value) => {
    return Object.entries(obj).find(([key, val]) => val === value)?.[0] || null;
  };

  useEffect(() => {
    const path = location.pathname.startsWith("/") ? location.pathname.slice(1) : location.pathname;
    const cleanPath = path.startsWith("Main/") ? path.replace("Main/", "") : path;
    // console.log(cleanPath);

    const key = getKeyByValue(menuPathMap, cleanPath);
    setSelectedMenu(key);
  }, [location.pathname]);



   if (loadingPermissions) {
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


  return (
    <div className="user-select-none" style={{ height: "100vh" }}>
      <Sidebar
        handleClose={handleClose}
        status={showsidebar}
        handleMenuClick={handleMenuClick}
        handleLogout={handleLogout}
      />

      <div className="container-fluid h-100">
        <div className="row justify-content-center h-100">
          <div className="d-none d-md-block d-lg-block col-md-3 col-lg-2 p-0 h-100 border-end shadow-lg">
            <div className="overflow-auto h-100">
              <Menu
                handleMenuClick={handleMenuClick}
                handleLogout={handleLogout}
                activeMenu={selectedMenu}
              />
            </div>
          </div>

          <div className="p-0 col-sm-12 col-md-9 col-lg-10 h-100 bg-white">
            <div className="overflow-auto h-100">
              <nav
                className="navbar navbar-light"
                style={{
                  backgroundColor: "#0C3D67",
                }}
              >
                <div className="d-flex align-items-center justify-content-between w-100">
                  <Button
                    variant=""
                    onClick={handleShow}
                    className="text-light ms-3 d-sm-block d-md-none bg-prim"
                  >
                    <i className="fa-solid fa-bars"></i>
                  </Button>
                  <h6 className="mx-4 text-light">
                    Pawnshop Management System
                  </h6>
                  <h6 className="me-3 text-light">{user}</h6>
                </div>
              </nav>

              {/* Define Routes Here */}
              <div className="h-100">
                <Routes>
                  {/* Default Route redirects to Dashboard */}
                  <Route path="/" element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />

                  {/* File Routes */}
                  <Route path="file/company" element={<Company />} />
                  <Route path="file/security-date" element={<SecurityDate />} />
                  <Route path="file/reset" element={<Reset />} />

                  {/* Setup Routes */}
                  <Route path="setup/early-renewal" element={<EarlyRenewalSetup />} />
                  <Route path="setup/interest-rate" element={<InterestRate />} />
                  <Route path="setup/interest-rate-gold" element={<InterestRateGold />} />
                  <Route path="setup/pt-no-setup" element={<PTNoSetup />} />
                  <Route path="setup/early-redemption" element={<EarlyRedemptionSetup />} />
                  <Route path="setup/setup-box-no" element={<SetupBoxNo />} />

                  {/* Entry Routes */}
                  <Route path="entry/customer" element={<Customer />} />
                  <Route path="entry/condition" element={<Condition />} />
                  <Route path="entry/color" element={<Color />} />
                  <Route path="entry/item" element={<Items />} />
                  <Route path="entry/diamond-shape" element={<DiamondShape />} />
                  <Route path="entry/birthstone" element={<BirthStone />} />
                  <Route path="entry/birthstone-color" element={<BirthStoneColor />} />
                  <Route path="entry/made" element={<Made />} />
                  <Route path="entry/karat" element={<Karat />} />
                  <Route path="entry/brand" element={<Brand />} />
                  <Route path="entry/model" element={<Model />} />
                  <Route path="entry/titus" element={<Titus />} />

                  {/* Transaction Routes */}
                  <Route path="transaction/new-loan" element={<NewLoan />} />
                  <Route path="transaction/renewal" element={<Renewal />} />
                  <Route path="transaction/renewal/new" element={<NewRenewal />} />
                  <Route path="transaction/pull-out" element={<PullOut />} />
                  <Route path="transaction/redemption-all" element={<RedemptionAll />} />
                  <Route path="transaction/partial-payment" element={<PartialPayment />} />
                  <Route path="transaction/pull-out/:id" element={<PullOutPawnTicket />} />


                  {/* Reports Routes */}
                  <Route path="search/ready-for-auction" element={<ReadyForAuction />} />
                  <Route path="search/search-transaction" element={<SearchTransaction />} />


                  <Route path="reports/transactions" element={<TransactionReport />} />
                  <Route path="reports/individual-ledger" element={<IndividualLedger />} />


                  {/* Reports Routes */}
                  <Route path="security/group" element={<Group />} />
                  <Route path="security/users" element={<Users />} />
                  <Route path="security/users/:id" element={<UsersForm />} />
                  <Route path="security/permission" element={<Permission />} />



                  {/*<Route path="security/individual-ledger" element={<IndividualLedger />} />*/}

                   <Route path="unauthorized" element={<Unauthorized />} />

                  {/* Catch-all Route */}
                  <Route path="*" element={<h2>Page Not Found</h2>} />
                </Routes>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
