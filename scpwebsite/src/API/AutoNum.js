import axios from "axios";
import StringHost from "../Functions/ConnectionString";

export const AutoNumCustCode = async (props) => {
  try {
    const response = await axios.get(
      `${StringHost()}/API/WebAPI/AutoNumCustCode?strURICNCode=${props}`
    );
    // console.log(response.data)
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const AutonCondition = async (props) => {
  try {
    const response = await axios.get(
      `${StringHost()}/API/WebApi/AutonNumCondition/Code?strURICNCode=${props}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const AutoNumAll = async (cnCode, getStrCode, getstrtblName) => {
  try {
    // Validate parameters
    if (!cnCode || !getStrCode || !getstrtblName) {
      throw new Error("One of the parameters is empty, null, or undefined");
    }

    const response = await axios.get(
      `${StringHost()}/API/WebApi/GetAutonNumAll/Code?strCNCode=${cnCode}&strCode=${getStrCode}&strtblName=${getstrtblName}`
    );
    
    return response.data;
  } catch (error) {
    throw error;
  }
};
