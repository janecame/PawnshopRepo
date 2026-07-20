import { useState } from "react";

import { 
  Box, 
  Paper, 
  Typography, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  List, 
  ListItem, 
  ListItemText,
  Checkbox,
  Alert,
  FormHelperText 
} from '@mui/material';

import toast from 'react-hot-toast';


import axios from "axios";
import StringHost from "../../Functions/ConnectionString";


import { useObjectsQuery, useGroupsQuery, useGroupPermissions } from '../../Hooks/useSecurityQueries';



const Permission = () => {
  
  const[group, setGroup] = useState('01');
  const[isGroupError, setIsGroupError] = useState({});
  

  const objects = useObjectsQuery();
  const groups = useGroupsQuery();
  const groupPermission = useGroupPermissions(group);


  const handleToggleChecked = async (value) => {
    const currentIndex = groupPermission.data?.indexOf(value);
    const newRestricted = [...groupPermission.data];
    let currentStatus = false;
    
    let apiCallPromise;


    if(group === ""){
      console.log("error")
      setIsGroupError({
        group: "Please select user group first!"
      })
      return false
    }

    if (currentIndex === -1) {
      newRestricted.push(value);
      currentStatus = true;
    } else {
      newRestricted.splice(currentIndex, 1);
      currentStatus = false;
    }

    //setRestrictedItems(newRestricted);
    
    if (currentStatus) {
      apiCallPromise = axios.post(
        `${StringHost()}/API/SCPWEBAPI/Security/GroupPermissionAdd/${group}`, 
        JSON.stringify(value),
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    } 

    if (!currentStatus) {
      apiCallPromise = axios.delete(
        `${StringHost()}/API/SCPWEBAPI/Security/GroupPermissionRemove/${group}`, 
        {
          headers: {
            'Content-Type': 'application/json'
          },
          // Move the data inside the config object
          data: JSON.stringify(value) 
        }
      );
    }


    toast.promise(apiCallPromise, {
      loading: 'Saving user data...',
      success: (response) => {
        return response?.data?.message || `Data saved successfully! ✅`;
      },
      error: (err) => {
        // const serverMessage = err.response?.data?.message || err.message;
        // return `Save Failed: ${serverMessage}`;
        return `Save Failed`;
      },
    }, {
      position: 'bottom-right',
      style: { minWidth: '250px', padding: '20px' },
    });

    try {
      await apiCallPromise;
    } finally {
      groupPermission.refetch();

    }


  };


  if (groupPermission.isLoading) {
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

  if (groupPermission.isError) {
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
      
            
      <Box 
        sx={{ 
          height: '100vh', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          bgcolor: '#f5f5f5' // Optional: light grey background common for dashboard cards
        }}
      >
        <Paper 
          elevation={3} 
          sx={{ 
            width: '400px', 
            p: 3, // Internal padding (replaces card-body)
            textAlign: 'center' 
          }}
        >
          <Typography variant="h5" component="h2" sx={{ mt: 2, mb: 3 }}>
            Group Permission
          </Typography>

          {/* Group Select */}
          <FormControl fullWidth size="small" sx={{ mb: 2 }} error={isGroupError.group} >
            <InputLabel id="group-select-label">Group</InputLabel>
            {groups.data && groups.data.length > 0 ? (
            <Select
              labelId="group-select-label"
              id="group-select"
              name="groupCode"
              label="Group"
              value={group}
              defaultValue={group}
              onChange={(e) => setGroup(e.target.value)}
              sx={{ fontWeight: 'bold', '.MuiSelect-select': { textAlign: 'center' } }}
              
              
            >
              <MenuItem value=""><em>Select an option</em></MenuItem>
              {groups.data?.map((item, index) => (
                <MenuItem key={index} value={item.groupCode}>
                  {item.groupName}
                </MenuItem>
              ))}
            </Select>
            ) : (
              <Select label="Group" value="" disabled>
                <MenuItem value="">Loading groups...</MenuItem>
              </Select>
            )}

            {isGroupError &&
              <FormHelperText>{isGroupError.group}</FormHelperText>
            }
            
          </FormControl>


          <Alert severity="info" square>
            <strong>Note:</strong> Checked = No Access | Unchecked = Access Allowed
          </Alert>

          <List sx={{ maxHeight: 300, overflow: 'auto', py: 0 }}>
            {objects.data?.map((objName) => {
              const isChecked = groupPermission.data?.includes(objName);

              return (
                <ListItem 
                  key={objName} 
                  divider
                  secondaryAction={
                    <Checkbox
                      edge="end"
                      onChange={() => handleToggleChecked(objName)}
                      checked={isChecked}
                      color="error"
                    />
                  }
                >
                  <ListItemText 
                    primary={objName} 
                    secondary={isChecked ? "Access Restricted" : "Access Allowed"}
                    primaryTypographyProps={{
                      color: isChecked ? 'error' : 'inherit',
                      fontWeight: isChecked ? 'bold' : 'normal'
                    }}
                  />
                </ListItem>
              );
            })}
          </List>

        </Paper>
      </Box>


  );
};

export default Permission;
