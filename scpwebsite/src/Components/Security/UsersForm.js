import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

//import { UserSession } from "../../Functions/UtilityFunctions";
import Notification from "../../Alert/Notification";
import axios from "axios";
import StringHost from "../../Functions/ConnectionString";

import CustomInput from "../Transaction/CustomComponents/CustomInput";
import CustomButton from "../Transaction/CustomComponents/CustomButton";
import CustomSelect from "../Transaction/CustomComponents/CustomSelect";


import { useUsersQuery, useGroupsQuery, useCompanyBranches } from '../../Hooks/useSecurityQueries';


const defaultFormData = {

   userName: "",
   fullName: "",
   verifyPassword: "",
   password: "",
   groupCode: "",
   cnCode: ""
}




const UsersForm = () => {
  const { data: users, isLoading: usersLoading, error: usersError, refetch } = useUsersQuery();
  const { data: branches, isLoading: branchesLoading, error: branchesError } = useCompanyBranches();
  const { data: groups, isLoading: groupsLoading, error: groupsError } = useGroupsQuery();

  const[formData, setFormData] = useState(defaultFormData);
  
  const[isUserAdd, setIsUserAdd] = useState(false);
  const[userNotFound, setUserNotFound] = useState(false);
  
  const isLoading = usersLoading || branchesLoading || groupsLoading;
  const isError = usersError || branchesError || groupsError;

  const params = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    if (params && users) {
      if (params.id === "add") {
        setIsUserAdd(true);
        setUserNotFound(false)
      } else {

        setIsUserAdd(false);
        const foundUser = users.find(user => user.userCode === params.id);
          
        if (foundUser) {
            setFormData(foundUser);
            setUserNotFound(false)
        } else {
            console.warn("no user found");
            setUserNotFound(true)
        }

      }
    }
  }, [params, users]);



  const handleChange = (e) => {
        const { name, type, value } = e.target;
        //let inputValue = type === 'checkbox' ? checked : value;

        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
  };
 


  const handleSubmit = async (e)  => {
        e.preventDefault();
        let response = null;
        
        if(isUserAdd){
          if(formData.password !== formData.verifyPassword) return Notification({ type: "error", message: "Password does not match." });
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

                if(isUserAdd){
                  response = await axios.post(`${StringHost()}/API/SCPWEBAPI/Security/AddUser`, formData);
                }else{
                  response = await axios.put(`${StringHost()}/API/SCPWEBAPI/Security/UpdateUser`, formData);

                }
                
                if (response.status === 200) {
                    Notification({ type: "success", message: response.data });
                    navigate(-1);
                    refetch(); 
                } else {
                    Notification({ type: "error", message: "Failed to save data." });
                }

            } catch (error) {
                console.error("Error saving redemption:", error);
                if(error.response.status === 400){
                  Notification({ type: "error", message: error.response.data });
                }else{
                  Notification({ type: "error", message: "Sorry, Something went wrong!" });
                }

                
                // No need to throw unless you want the parent to catch it
            }
        }

        
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


  if (userNotFound) {
      return (
          <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100vh'
          }}>
              <p>Sorry this user does not exist. Please contact the administrator.</p>
          </div>
      );
  }




  return (
    <div className="container-fluid h-100 d-flex justify-content-center align-items-center">
      <div className="card shadow" style={{ width: '400px' }}>
        <div className="card-body">
          <h5 className="card-title text-center">{isUserAdd ? "User Add" : "User Edit"}</h5>
          <form onSubmit={handleSubmit}>
            
            <h6>{isUserAdd ? "" : `USER ID: ${formData.userCode}`}</h6>
            
            <div className="mb-3">
              <CustomInput
                label="Full Name"
                name="fullName"
                onChange={handleChange}
                value={formData.fullName}
                required
             
              />
            </div>
            
            <div className="mb-3">
              <CustomInput
                label="Username"
                name="userName"
                onChange={handleChange}
                value={formData.userName}
                required
            
              />
            </div>

            {isUserAdd ?

              <>
                <div className="mb-3">
                  <CustomInput
                    label="Password"
                    name="password"
                    onChange={handleChange}
                    value={formData.password}
                    type="password"
                    required
                  />
                </div>

                <div className="mb-3">
                  <CustomInput
                    label="Confirm Password"
                    name="verifyPassword"
                    onChange={handleChange}
                    value={formData.verifyPassword}
                    type="password"
                    required
                  
                  />
                </div>
              </>


            :

              <>
              
              <CustomSelect 
                label="Group"
                options={groups}
                name="groupCode"
                value={formData.groupCode}
                onChange={handleChange}
                valueKey="groupCode"  // Use `controlNo` as the option value
                labelKey="groupName"   // Use `custName` as the option label
                
              />            

              <CustomSelect 
                label="Branches"
                options={branches}
                name="cnCode"
                value={formData.cnCode}
                onChange={handleChange}
                valueKey="cnCode"  // Use `controlNo` as the option value
                labelKey="cName"   // Use `custName` as the option label
                

              />

              </>



            }
            


          
            


            <div className="d-grid">
              <CustomButton
                type="submit"
                label={isUserAdd ? "Save" : "Update"}
                size="md"
              />
            </div>
          </form>
        </div>
      </div>
    </div>

  );
};

export default UsersForm;
