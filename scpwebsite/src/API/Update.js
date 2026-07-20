import axios from "axios";
import StringHost from "../Functions/ConnectionString";

export const UpdateColor = async (props)=>{
    try {
        const response = await axios.put(`${StringHost()}/Web/API/UpdateData/Color2024`,props)
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const UpdateItem =async(props)=>{
    try {
        const response = await axios.put(`${StringHost()}/Web/API/UpdateData/Items2024`,props)
        return response.data;
    } catch (error) {
        throw error;
    }
}
export const UpdateDiamond =async(props)=>{
    try {
        const response = await axios.put(`${StringHost()}/Web/API/UpdateData/Diamond2024`,props)
        return response.data;
    } catch (error) {
        throw error;
    }
}
export const UpdateBirthStone =async(props)=>{
    try {
        const response = await axios.put(`${StringHost()}/Web/API/UpdateData/BirthStone2024`,props)
        return response.data;
    } catch (error) {
        throw error;
    }
}
export const UpdateBirthStoneColor =async(props)=>{
    try {
        const response = await axios.put(`${StringHost()}/Web/API/UpdateData/BirthStoneColor2024`,props)
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const UpdateMade =async(props)=>{
    try {
        const response = await axios.put(`${StringHost()}/Web/API/UpdateData/Made2024`,props)
        return response.data;
    } catch (error) {
        throw error;
    }
}
export const UpdateKarat =async(props)=>{
    try {
        const response = await axios.put(`${StringHost()}/Web/API/UpdateData/Karat2024`,props)
        return response.data;
    } catch (error) {
        throw error;
    }
}
export const UpdateBrand =async(props)=>{
    try {
        const response = await axios.put(`${StringHost()}/Web/API/UpdateData/Brand2024`,props)
        return response.data;
    } catch (error) {
        throw error;
    }
}
export const UpdateModel =async(props)=>{
    try {
        const response = await axios.put(`${StringHost()}/Web/API/UpdateData/Model2024`,props)
        return response.data;
    } catch (error) {
        throw error;
    }
}
export const UpdateTitus =async(props)=>{
    try {
        const response = await axios.put(`${StringHost()}/Web/API/UpdateData/Titus2024`,props)
        return response.data;
    } catch (error) {
        throw error;
    }
}
export const UpdateCondition =async(props)=>{
    try {
        const response = await axios.put(`${StringHost()}/Web/API/UpdateData/Condiotion2024`,props)
        return response.data;
    } catch (error) {
        throw error;
    }
}
export const UpdateCustomer =async(props)=>{
    try {
        const response = await axios.put(`${StringHost()}/Web/API/UpdateData/CustomerData2024`,props)
        return response.data;
    } catch (error) {
        throw error;
    }
}