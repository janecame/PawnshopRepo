import axios from "axios";
import StringHost from "../Functions/ConnectionString";

export const InsertCustomer = async (props) =>{
try {
    const response = await axios.post(`${StringHost()}/API/WEBAPI/Customer/InsertData`, props)
    
    return response.data;
} catch (error) {
    throw error;
}
}

export const InsertTitus = async (props) =>{
   try {
     const response = await axios.post(`${StringHost()}/API/WEBAPI/Customer/InsertDataTitus2024`,props)
     return response.data
   } catch (error) {
    throw error;
   }
}
export const InsertModel =async(props)=>{
    try {
        const response = await axios.post(`${StringHost()}/API/WEBAPI/Customer/InsertDataModel2024`,props)
        return response.data
    } catch (error) {
        throw error;
    }
}

export const InsertBrand =async(props)=>{
    try {
        const response = await axios.post(`${StringHost()}/API/WEBAPI/Customer/InsertDataBrand2024`,props)
        return response.data
    } catch (error) {
        throw error;
    }
}
export const InsertKarat =async(props)=>{
    try {
        const response = await axios.post(`${StringHost()}/API/WEBAPI/Customer/InsertDataKarat2024`,props)
        return response.data
    } catch (error) {
        throw error;
    }
}
export const InsertMade =async(props)=>{
    try {
        const response = await axios.post(`${StringHost()}/API/WEBAPI/Customer/InsertDataMade2024`,props)
        return response.data
    } catch (error) {
        throw error;
    }
}
export const InsertBirthStoneColor =async(props)=>{
    try {
        const response = await axios.post(`${StringHost()}/API/WEBAPI/Customer/InsertDataBrithStoneColor2024`,props)
        return response.data
    } catch (error) {
        throw error;
    }
}

export const InsertBirthStone =async(props)=>{
    try {
        const response = await axios.post(`${StringHost()}/API/WEBAPI/Customer/InsertDataBrithStone2024`,props)
        console.log(props)
        return response.data
    } catch (error) {
        throw error;
    }
}

export const InsertDiamondShape =async(props)=>{
    try {
        const response = await axios.post(`${StringHost()}/API/WEBAPI/Customer/InsertData/DiamondInsert2024`,props)
        return response.data
    } catch (error) {
        throw error;
    }
}
export const InsertItems =async(props)=>{
    try {
        const response = await axios.post(`${StringHost()}/API/WEBAPI/Customer/InsertData/Items2024`,props)
        return response.data
    } catch (error) {
        throw error;
    }
}
export const InsertColors =async(props)=>{
    try {
        const response = await axios.post(`${StringHost()}/API/WEBAPI/Customer/InsertData/Colors2024`,props)
        return response.data
    } catch (error) {
        throw error;
    }
}

export const InsertCondition =async(props)=>{
    try {
       // console.error(props)
        const response = await axios.post(`${StringHost()}/API/WEBAPI/Customer/InsertData/Condition2024`,props)
        return response.data
    } catch (error) {
        throw error;
    }
}