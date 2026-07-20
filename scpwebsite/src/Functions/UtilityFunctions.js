import { CheckDuplicate } from "./AxiosFunction";

export function userSessionCredentials(data) {
  localStorage.setItem("UserSession", JSON.stringify(data));
}

export function clearLocalStorageItem(key) {
  localStorage.removeItem(key);
}

export function UserSession() {
  const varUser = JSON.parse(localStorage.getItem("UserSession"));
  return varUser;
}

export const ExpireComponentToken = () => {
  const varuserSession = JSON.parse(localStorage.getItem("UserSession"));
  if (varuserSession !== null) {
    varuserSession.expiryTimeStamp = new Date(
      new Date().getTime() + varuserSession.expiresIn * 1000
    );
    if (
      varuserSession !== null &&
      new Date() < varuserSession.expiryTimeStamp
    ) {
      return varuserSession.token;
    } else if (new Date() > varuserSession.expiryTimeStamp) {
      clearLocalStorageItem("UserSession");
    }
  } else {
    return null;
  }
};

export const DuplicateChecker = async (tableName, rowName, data) => {
  try {
    const response = await CheckDuplicate(tableName, rowName, data);
    return response.duplicate; // Return only the boolean value
  } catch (error) {
    console.error("Error in DuplicateChecker:", error);
    return false; // Handle errors gracefully and return false
  }
};

export const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export const addMonthToDateString = (dateString, monthToAdd) => {
  const date = new Date(dateString);

  date.setMonth(date.getMonth() + monthToAdd);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export const formatNumber = (number) => {
  return number.toFixed(2);
};

export const formatStringNumber = (number) => {
  // if (typeof number === 'string' && (number.includes(',') || number.includes('.'))) {
  //   return number;
  // }
  const parsedNumber = parseFloat(number);

  if (isNaN(parsedNumber)) {
    return "Invalid Number";
  }

  return parsedNumber.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const calculateTotalPAmount = (principalAmount, interest) => {
  const numericPrincipalAmount = parseFloat(principalAmount.replace(/,/g, '')) || 0;
  const numericInterest = parseFloat(interest.replace(/,/g, '')) || 0;

  return numericPrincipalAmount * (numericInterest / 100);
};


export const convertToYYYYMMDD = (dateString) => {
  // Check for invalid inputs
  if (!dateString || typeof dateString !== "string" || dateString.trim() === "") {
    return null; // or throw an Error if you prefer
  }

  const date = new Date(dateString);

  // Check if date is valid
  if (isNaN(date.getTime())) {
    return null; // or throw an Error
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};



