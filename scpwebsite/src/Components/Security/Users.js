import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
//import { UserSession } from "../../Functions/UtilityFunctions";
import Notification from "../../Alert/Notification";
import axios from "axios";
import StringHost from "../../Functions/ConnectionString";

import CustomInput from "../Transaction/CustomComponents/CustomInput";
import CustomButton from "../Transaction/CustomComponents/CustomButton";

import { useUsersQuery, useObjectsQuery, useGroupsQuery, useCompanyBranches } from '../../Hooks/useSecurityQueries';

// useUsersQuery
// useObjectsQuery
// useGroupsQuery


const Users = () => {
  
  const { data: users, isLoading: usersLoading, error: usersError } = useUsersQuery();
  const { data: branches, isLoading: branchesLoading, error: branchesError } = useCompanyBranches();
  const { data: groups, isLoading: groupsLoading, error: groupsError } = useGroupsQuery();

  const isLoading = usersLoading || branchesLoading || groupsLoading;
  const isError = usersError || branchesError || groupsError;

  const navigate = useNavigate();


  const groupLookup = {};
  (groups || []).forEach(group => {
    groupLookup[group.groupCode] = group.groupName;
  });

  const branchLookup = {};
  (branches || []).forEach(branch => {
    branchLookup[branch.cnCode] = branch.cName;
  });


  const handleRowClick = (value) => {
    navigate(value)
  }


  


 

  
  if (isLoading) {
      return (
          <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100vh'
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
              height: '100vh'
          }}>
              <p>Sorry, data couldn't load. Contact your administrator.</p>
          </div>
      );
  }



  return (
    <div className="container-fluid h-100">
     
          <h5 className="mt-3">Users</h5>
          
          <CustomButton
            type="button"
            onClick={() => navigate("add")}
            label="Add User"
            className="mb-3"
          />
          <div style={{ maxHeight: "500px", overflowY: "auto", border: "1px solid black" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f2f2f2", borderBottom: "1px solid black" }}>
                    
                    <th style={{ border: "1px solid black", padding: "5px" }}>Username</th>
                    <th style={{ border: "1px solid black", padding: "5px" }}>Fullname</th>
                    <th style={{ border: "1px solid black", padding: "5px" }}>Group Code</th>
                    <th style={{ border: "1px solid black", padding: "5px" }}>CNCode</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr 
                      key={index} 
                      style={{ borderBottom: "1px solid black" }} 
                      onDoubleClick={() => handleRowClick(user.userCode)}
                      className="pullout-table-row"
                    >
                     
                      <td style={{ border: "1px solid black", padding: "5px" }}>{user.userName}</td>
                      <td style={{ border: "1px solid black", padding: "5px" }}>{user.fullName}</td>
                      
                      <td style={{ border: "1px solid black", padding: "5px" }}>
                        {groupLookup[user.groupCode] || user.groupCode}
                      </td>
                      <td style={{ border: "1px solid black", padding: "5px" }}>
                        {branchLookup[user.cnCode] || user.cnCode}
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>



    </div>

  );
};

export default Users;
