import axios from "axios";
import StringHost from "./ConnectionString";

export const VerifyUserLogin = async (username, password) => {
  try {
    const response = await axios.get(
      `${StringHost()}/API/SCPWEBAPI/UserAuthentication`,
      {
        params: { strURILogInName: username, strURIPWordLog: password },
        headers: { "Content-Type": "application/json" },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error in VerifyUserLogin:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const GetCompanyName = async (CNCode) => {
  try {
    const response = await axios.get(
      `${StringHost()}/API/SCPWEBAPU/GetBranchName`,
      {
        params: { strURICNCode: CNCode },
        headers: { "Content-Type": "application/json" },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error in GetCompanyName:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const GetDashboardSummary = async (cnCode) => {
  try {
    const response = await axios.get(
      `${StringHost()}/API/SCPWEBAPI/GetDashboardSummary`,
      {
        params: { cnCode },
        headers: { "Content-Type": "application/json" },
      }
    );
    //console.log(response.data)
    return response.data;
  } catch (error) {
    console.error(
      "Error in GetDashboardSummary:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const GetCompany = async () => {
  try {
    const response = await axios.get(
      `${StringHost()}/API/MRMS/GetCompany`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error in GetCompany:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const UpdateCompany = async (MdlCompany) => {
  try {
    const response = await axios.put(
      `${StringHost()}/API/SCPWEBAPI/UpdateCompany`,
      MdlCompany,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error in UpdateCompany:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const GetSecurityDate = async () => {
  try {
    const response = await axios.get(
      `${StringHost()}/API/MRMS/GetSecurityDate`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error in GetSecurityDate:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const UpdateSecurityDate = async (MdlCompany) => {
  try {
    const response = await axios.put(
      `${StringHost()}/API/SCPWEBAPI/UpdateSecurityDate`,
      MdlCompany,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error in UpdateSecurityDate:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const GetVoucherTDoor = async () => {
  try {
    const response = await axios.get(
      `${StringHost()}/API/SCPWEBAPI/GetTDoorVoucher`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error in GetVoucherTDoor:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const ResetVoucherTDoor = async (tableVoucher) => {
  try {
    const response = await axios.put(
      `${StringHost()}/API/SCPWEBAPI/ResetVoucherTDoor`,
      {}, // No body needed
      {
        params: {
          strURIVoucher: tableVoucher
        },
        headers: { "Content-Type": "application/json" },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error in ResetVoucherTDoor:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const GetCompName = async () => {
  try {
    const response = await axios.get(
      `${StringHost()}/API/SCPWEBAPI/GetCompanyName`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error in GetCompName:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const GetSetupEarlyRenewal = async (cnCode) => {
  try {
    const response = await axios.get(
      `${StringHost()}/API/SCPWEBAPI/GetSetupEarlyRenewal`,
      {
        params: { strURICNCode: cnCode },
        headers: { "Content-Type": "application/json" },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error in GetSetupEarlyRenewal:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const UpdateSetupEarlyRenewal = async (PayLoad) => {
  try {
    const response = await axios.put(
      `${StringHost()}/API/SCPWEBAPI/UpdateSetupEarlyRenewal`,
      PayLoad,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error in UpdateSetupEarlyRenewal:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const GetGetInterestRate = async () => {
  try {
    const response = await axios.get(
      `${StringHost()}/API/SCPWEBAPI/GetInterestRate`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error in GetInterestRate:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const UpdateInterestRate = async (updateData) => {
  try {
    const response = await axios.put(
      `${StringHost()}/API/SCPWEBAPI/UpdateSetupInterestRate`,
      updateData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error in UpdateInterestRate:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const GetGetInterestRateGold = async () => {
  try {
    const response = await axios.get(
      `${StringHost()}/API/SCPWEBAPI/GetInterestRateGold`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error in GetGetInterestRateGold:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const UpdateInterestRateGold = async (updateData) => {
  try {
    const response = await axios.put(
      `${StringHost()}/API/SCPWEBAPI/UpdateSetupInterestRateGold`,
      updateData,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error in UpdateInterestRateGold:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const GetSetupPTNumber = async () => {
  try {
    const response = await axios.get(
      `${StringHost()}/API/SCPWEBAPI/GetSetupPTNumber`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error in GetSetupPTNumber:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const GetSetupRSNumber = async () => {
  try {
    const response = await axios.get(
      `${StringHost()}/API/SCPWEBAPI/GetSetupRSNumber`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error in GetSetupRSNumber:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const UpdatePTNoSetup = async (PayLoad) => {
  try {
    const response = await axios.put(
      `${StringHost()}/API/SCPWEBAPI/UpdatePTNoSetup`,
      PayLoad,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error in UpdatePTNoSetup:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const UpdateRSPTNoSetup = async (PayLoad) => {
  try {
    const response = await axios.put(
      `${StringHost()}/API/SCPWEBAPI/UpdateRSPTNoSetup`,
      PayLoad,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error in UpdateRSPTNoSetup:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const GetSetupEarlyRedemption = async (cnCode) => {
  try {
    const response = await axios.get(
      `${StringHost()}/API/SCPWEBAPI/GetSetupEarlyRedemption`,
      {
        params: { strURICNCode: cnCode },
        headers: { "Content-Type": "application/json" },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error in GetSetupEarlyRedemption:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const UpdateSetupEarlyRedemption = async (PayLoad) => {
  try {
    const response = await axios.put(
      `${StringHost()}/API/SCPWEBAPI/UpdateSetupEarlyRedemption`,
      PayLoad,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error in UpdateSetupEarlyRedemption:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const InsertBoxnumber = async (BoxNumbers) => {
  try {
    // console.log("API CALL", BoxNumbers);
    const response = await axios.post(
      `${StringHost()}/API/SCPWEBAPI/InsertBoxNumber`,
      BoxNumbers,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error in InsertBoxnumber:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const CheckDuplicate = async (table, row, data) => {
  try {
    const response = await axios.post(
      `${StringHost()}/API/SCPWEBAPI/CheckDuplicate`,
      {
        strURITable: table,
        strURIRow: row,
        request: [data],  // Send data as a list
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error in CheckDuplicate:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const GetBoxNumber = async (cnCode) => {
  try {
    const response = await axios.get(
      `${StringHost()}/API/SCPWEBAPU/GetBoxNo`,
      {
        params: { strURICNCode: cnCode },
        headers: { "Content-Type": "application/json" },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error in GetBoxNumber:",
      error.response?.data || error.message
    );
    throw error;
  }
};


export const GetDisplayBoxNo = async (CNCode) => {
  try {
    const response = await axios.get(
      `${StringHost()}/API/SCPWEBAPU/GetDisplayBoxNo`,
      {
        params: { strURICNCode: CNCode },
        headers: { "Content-Type": "application/json" },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error in GetDisplayBoxNo:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const GetCustomerList = async (CNCode) => {
  try {
    const response = await axios.get(
      `${StringHost()}/API/Web/GetCustomer/details`,
      {
        params: { strURICNCode: CNCode },
        headers: { "Content-Type": "application/json" },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error in GetCustomerList:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const GetLoanCategory = async () => {
  try {
    const response = await axios.get(
      `${StringHost()}/API/SCPWEBAPU/GetLoanCategory`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error in GetLoanCategory:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const GetDiamondShape = async (CNCode) => {
  try {
    const response = await axios.get(
      `${StringHost()}/WEB/API/GetDiamondShape`,
      {
        params: { strURICNCode: CNCode },
        headers: { "Content-Type": "application/json" },
      }
    );

    return response.data; // maybe response.data.data
  } catch (error) {
    console.error(
      "Error in GetDiamondShape:",
      error.response?.data || error.message
    );
    throw error;
  }
};



export const GetItemList = async (CNCode) => {
  try {
    const response = await axios.get(
      `${StringHost()}/WEB/API/GetListItem/Data`,
      {
        params: { strCNCode: CNCode },
        headers: { "Content-Type": "application/json" },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error in GetItemList:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const GetColorList = async (CNCode) => {
  try {
    const response = await axios.get(
      `${StringHost()}/API/Web/GetColor/details`,
      {
        params: { strURICNCode: CNCode },
        headers: { "Content-Type": "application/json" },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error in GetColorList:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const GetConditionList = async (CNCode) => {
  try {
    const response = await axios.get(
      `${StringHost()}/API/Web/GetCondition/details`,
      {
        params: { strURICNCode: CNCode },
        headers: { "Content-Type": "application/json" },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error in GetConditionList:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const GetKaratList = async (CNCode) => {
  try {
    const response = await axios.get(
      `${StringHost()}/WEB/API/Calling/KaratAPI2024`,
      {
        params: { strURICNCode: CNCode },
        headers: { "Content-Type": "application/json" },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error in GetKaratList:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const GetBirthstoneList = async (CNCode) => {
  try {
    const response = await axios.get(
      `${StringHost()}/WEB/API/BirthStone2024`,
      {
        params: { strURICNCode: CNCode },
        headers: { "Content-Type": "application/json" },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error in GetBirthstoneList:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const GetMadeList = async (CNCode) => {
  try {
    const response = await axios.get(
      `${StringHost()}/WEB/API/Calling/MadeAPI2024`,
      {
        params: { strURICNCode: CNCode },
        headers: { "Content-Type": "application/json" },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error in GetBirthstoneList:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const GetRate = async (CatCode) => {
  try {
    const response = await axios.get(
      `${StringHost()}/API/MRMS/GetRate`,
      {
        params: { strURICatCode: CatCode },
        headers: { "Content-Type": "application/json" },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error in GetCompanyName:",
      error.response?.data || error.message
    );
    throw error;
  }
};




//TRANSACTIONS

export const GetPTAutoNum = async (cnCode) => {
  try {
    const response = await axios.get(
      `${StringHost()}/API/SCPWEBAPI/GetPTAutoNum`,
      {
        params: { strURICNCode: cnCode },
        headers: { "Content-Type": "application/json" },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error in GetPTAutoNum:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const CheckDuplicatePT = async (table, row, value, cnCode, voucher) => {
  try {
    const response = await axios.get(
      `${StringHost()}/API/SCPWEBAPI/CheckDuplicatePT`, {
      params: {
        strTableName: table,
        strFieldName: row,
        strValueName: value,
        CNCode: cnCode,
        strVoucher: voucher
      },
      headers: { "Content-Type": "application/json" },
    }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error in CheckDuplicatePT:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const ProductSave = async (data) => {
  try {
    console.log("Axios: ", data);
    const response = await axios.post(
      `${StringHost()}/API/SCPWEBAPI/ProductSave`,
      data,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error in ProductSave:",
      error.response?.data || error.message
    );
    throw error;
  }
};


export const SaveTransaction = async (data) => {
  try {
    // console.log("Axios: ",data);
    const response = await axios.post(
      `${StringHost()}/API/SCPWEBAPI/SaveTransaction`,
      data,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return response;
  } catch (error) {
    console.error(
      "Error in SaveTransaction:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const GetPartialPaymentBoxNo = async (pawner) => {
  try {
    const response = await axios.get(
      `${StringHost()}/API/SCPWEBAPU/GetPartialPaymenbt`, {
      params: {
        strURIPawner: pawner
      },
      headers: { "Content-Type": "application/json" },
    }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error in GetPartialPaymentBoxNo:",
      error.response?.data || error.message
    );
    throw error;
  }
};


export const GetTermSetup = async () => {
  try {
    const response = await axios.get(`${StringHost()}/API/SCPWEBAPI/ClsGetTermSetup`);
    return response.data;
  } catch (error) {
    console.error(
      "Error in GetTermSetup:",
      error.response?.data || error.message
    );
    throw error;
  }
};






