import React, { useEffect, useState } from "react";
//import { UserSession } from "../../Functions/UtilityFunctions";
import Notification from "../../Alert/Notification";
import axios from "axios";
import StringHost from "../../Functions/ConnectionString";

import CustomInput from "../Transaction/CustomComponents/CustomInput";
import CustomButton from "../Transaction/CustomComponents/CustomButton";


const Group = () => {

  const[groupName, setGroupName] = useState("");


  const handleSubmit = async (e)  => {
        e.preventDefault();
        

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
                const response = await axios.post(`${StringHost()}/API/SCPWEBAPI/Security/GroupAdd?groupName=${groupName}`);

                //Check response here
                if (response.status === 200) {
                    Notification({ type: "success", message: response.data });
                    // setEnableMonths(true);
                    setGroupName("");

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

  return (
    <div className="container-fluid h-100 d-flex justify-content-center align-items-center">
      <div className="card shadow" style={{ width: '400px' }}>
        <div className="card-body">
          <h5 className="card-title text-center">Group Add</h5>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <CustomInput
                label="Group Name"
                name="groupName"
                onChange={(e) => setGroupName(e.target.value)}
                value={groupName}
                size="lg"
              />
            </div>

            <div className="d-grid">
              <CustomButton
                type="submit"
                label="Add"
                size="md"
              />
            </div>
          </form>
        </div>
      </div>
    </div>

  );
};

export default Group;
