import axios from "axios";
import StringHost from "../Functions/ConnectionString";

export const GetCustomerList = async (props) => {
    try {
        const response = await axios.get(`${StringHost()}/API/Web/GetCustomer/details?strURICNCode=${props}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}
export const GetConditionList = async (props) =>{
    try {
        const response = await axios.get(`${StringHost()}/API/Web/GetCondition/details?strURICNCode=${props}`);
        
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const GetColorList = async (props) =>{
    try {
        const response = await axios.get(`${StringHost()}/API/Web/GetColor/details?strURICNCode=${props}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const GetItemsList = async (props) =>{
    try {
        const response = await axios.get(`${StringHost()}/WEB/API/GetListItem/Data?strCNCode=${props}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const GetListCategory = async () =>{
    try {
        const response = await axios.get(`${StringHost()}/WEB/API/GetCategory`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const GetListDiamond = async (CNCode)=>{
    try {
        const response = await axios.get(`${StringHost()}/WEB/API/GetDiamondShape?strURICNCode=${CNCode}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const GetBirthStone = async (CNCode)=>{
    try {
        const response = await axios.get(`${StringHost()}/WEB/API/BirthStone2024?strURICNCode=${CNCode}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const GetBirthStoneColor =async (cnCode)=>{
    try {
        const response = await axios.get(`${StringHost()}/WEB/API/BirthStoneColor2024?strURICNCode=${cnCode}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const GetMadeList = async (cnCode)=>{
    try {
        const response = await axios.get(`${StringHost()}/WEB/API/Calling/MadeAPI2024?strURICNCode=${cnCode}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}
export const GetListKarat = async (cnCode)=>{
    try {
        const response = await axios.get(`${StringHost()}/WEB/API/Calling/KaratAPI2024?strURICNCode=${cnCode}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}
export const GetListBrand = async (cnCode)=>{
    try {
        const response = await axios.get(`${StringHost()}/WEB/API/Calling/BrandAPI2024?strURICNCode=${cnCode}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}
export const GetListModel = async (cnCode)=>{
    try {
        const response = await axios.get(`${StringHost()}/WEB/API/Calling/ModelAPI2024?strURICNCode=${cnCode}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}
export const GetListTitus = async (cnCode)=>{
    try {
        const response = await axios.get(`${StringHost()}/WEB/API/Calling/TitusAPI2024?strURICNCode=${cnCode}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}


// -----------------------------------------RODRIGO LIST-----------------------------------------
export const fetchCustomersName = async (cncode) => {
    const response = await axios.get(`${StringHost()}/API/SCPWEBAPI/Renewal/GetCustomersName?strURICNCode=${cncode}`);
    return response.data;
};

export const fetchPawnTickets = async (cncode) => {
    const response = await axios.get(`${StringHost()}/API/SCPWEBAPI/Renewal/GetPawnTickets?strURICNCode=${cncode}`);
    return response.data;
};


export const GetUsers = async () => {
    try {
        const response = await axios.get(`${StringHost()}/API/SCPWEBAPI/Security/GetUsers`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const GetObjects = async () => {
    try {
        const response = await axios.get(`${StringHost()}/API/SCPWEBAPI/Security/GetObjects`);
        return response.data;
    } catch (error) {
        throw error;
    }
}


export const GetGroups = async () => {
    try {
        const response = await axios.get(`${StringHost()}/API/SCPWEBAPI/Security/GetGroups`);
        return response.data;
    } catch (error) {
        throw error;
    }
}



export const GetCompanyBranches = async () => {
    try {
        const response = await axios.get(`${StringHost()}/API/SCPWEBAPI/GetCompanyName`);
        return response.data;
    } catch (error) {
        throw error;
    }
}


export const getGroupPermissions = async (group) => {
    try {
        const response = await axios.get(`${StringHost()}/API/SCPWEBAPI/Security/GetGroupPermission?groupCode=${group}`);
        return response.data;
    } catch (error) {
        throw error;
        
    }
};



export const getSearchReadyForAuction = async (cnCode) => {
    try {
        const response = await axios.get(`${StringHost()}/API/SCPWEBAPI/Search/SearchReadyForAuction?cnCode=${cnCode}`);
        return response.data;
    } catch (error) {
        throw error;
        
    }
};


export const getSearchPawntickeVoucher = async (cnCode, voucher) => {
    try {
        const response = await axios.get(`${StringHost()}/API/SCPWEBAPI/Search/SearchPawnTicketVoucher?cnCode=${cnCode}&strVoucher=${voucher}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};


export const getLoanItemSetup = async (catCode) => {
    try {
        const response = await axios.get(`${StringHost()}/API/SCPWEBAPI/ClsGetLoanItemSetup/${catCode}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};


export const updateSearchTransaction = async (payload) => {
    const response = await axios.post(`${StringHost()}/API/SCPWEBAPI/Search/UpdateTransaction`, payload);
    return response.data;
};






