import React, { useState, useEffect, useRef } from "react";
import { Alert, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import CustModal from "../../filipModal/CustModal";
import CentralizeModal from "../../filipModal/CentralizeModal";

import CustomModal from "../../filipModal/CustomModal";

import MessageModal from "../Modals/MessageModal";
import LoadingModal from "../Modals/LoadingModal";
import PartialPaymentModal from "../Modals/PartialPaymentListModal";
import {
    UserSession,
    getCurrentDate,
    addMonthToDateString,
    formatNumber,
    formatStringNumber,
    calculateTotalPAmount,
} from "../../Functions/UtilityFunctions";
import {
    GetPTAutoNum,
    GetBoxNumber,
    GetDisplayBoxNo,
    GetCustomerList,
    GetLoanCategory,
    GetDiamondShape,
    GetItemList,
    GetColorList,
    GetConditionList,
    GetKaratList,
    GetBirthstoneList,
    GetMadeList,
    GetRate,
    CheckDuplicatePT,
    // ProductSave,
    SaveTransaction,
    GetPartialPaymentBoxNo
} from "../../Functions/AxiosFunction";


import { useDiamondShape, useColors } from '../../Hooks/useEntriesQueries';
import CustomInput from "./CustomComponents/CustomInput";
import CustomSelect from "./CustomComponents/CustomSelect";

  

const dateToday = getCurrentDate();


const defaultFormData = {
    ptNumber: "",
    selectedBoxNo: "",
    dlgDate: "",
    maturityDate: "",
    pawner: "",
    expDate: "",
    category: "",
    diamondShapeCode: "",
    diamondSize: "",
    karat: "",
    diamondPrice: 0,
    selectedItem: "",
    qty: 1,
    color: "",
    condition: "",
    birthstone: "",
    birthstoneweight: 0,
    birthstonepcs: 0,
    principalamount: 0,
    interest: 0,
    interestamount: 0,
    serialno: "N/A",
    made: "",
    remarks: "",
    diamonds: false,
    plateno: "N/A",
    weight: "",
    appraiser: "",
    userCode: "",
    tDate: ""
}

const defaultErrorData = {
    principalamount: "",
    selectedItem: "",
    color: "",
    made: "",
    birthstone: "",
    karat: "",
    condition: "",
    remarks: "",
    appraiser: "",
    ptNumber: ""


}



const requiredformData = [
    "principalamount", 
    "selectedItem",
    "color",
    "made",
    "birthstone",
    "karat",
    "condition"
]


export default function NewLoan() {

    const { CNCode, UserCode } = UserSession();
    const [formErrors, setFormErrors] = useState(defaultErrorData);

    const { data: diamondShapeList, isLoading: diamondShapesLoading, error: diamondShapesError } = useDiamondShape(CNCode);
    //const { data: diamondShapeList, isLoading: diamondShapesLoading, error: diamondShapesError } = useDiamondShape(CNCode);
    // const term = 3;

    const [cbEditBoxNo, setCbEditBoxNo] = useState("");
    const [showCustModal, setShowCustModal] = useState(false);

    const [cnCode, setCnCode] = useState(CNCode);

    const [weight, setWeight] = useState(false);
    const [editPtNo, setEditPtNo] = useState(false);

    const [alertstatus, setAlertStatus] = useState(false);
    const [alerttext, setAlertText] = useState("Alerting");
    const [alertcolor, setAlertColor] = useState("success");

    const [savealertstatus, setSaveAlertStatus] = useState(false);
    const [savealerttext, setSaveAlertText] = useState("Alerting");
    const [savealertcolor, setSaveAlertColor] = useState("success");

    const [messageModalShow, setMessageModalShow] = useState(false);
    const [messageText, setMessageText] = useState("Text");
    const [icon, setIcon] = useState(null);

    const [loadingModalSHow, setLoadingModalSHow] = useState(false);
    const [loadingText, setLoadingText] = useState(null);

    const [boxNumberList, setBoxNumberList] = useState([]);
    const [customerList, setCustomerList] = useState([]);
    const [loanCategoryList, setLoanCategoryList] = useState([]);
    
    //const [diamondShapeList, setDiamondShapeList] = useState([]);
    
    const [conditionList, setConditionList] = useState([]);
    const [karatList, setKaratList] = useState([]);
    const [colorList, setColorList] = useState([]);
    const [birthstoneList, setBirthstoneList] = useState([]);
    const [madeList, setMadeList] = useState([]);
    const [categoryTypePlateNo, setCategoryTypePlateNo] = useState([]);
    const [categoryTypeSerialNo, setCategoryTypeSerialNo] = useState([]);

    const [tableViewList, setTableViewList] = useState([]);
    const [productList, setProductList] = useState([]);

    const [main1, setMain1] = useState({});
    const [main2, setMain2] = useState([]);

    const [itemList, setItemList] = useState([]);
    const [currentItems, setCurrentItems] = useState([]);

    const [partialPaymentModalShow, setPartialPaymentModalShow] = useState(false);

    const [pPBoxNoList, setPPBoxNoList] = useState([]);

    const [btnAddItemstatus, setAddItemStatus] = useState(true);
    const [partialPayment, setPartialPayment] = useState(false);


    const [totals, setTotals] = useState({ qty: 0, principalamount: 0, interestamount: 0 });

    const [mdlNewLoan, setMdlNewLoan] = useState(defaultFormData);

    // useEffect(() => {
    //     if (tableViewList.length > 0) {
    //         console.log("tableViewList: ", tableViewList);
    //     }
    // }, [tableViewList])

    // useEffect(() => {
    //     if (pPBoxNoList.length > 0) {
    //         console.log("Box List: ", pPBoxNoList);
    //     }
    // }, [pPBoxNoList])

    useEffect(() => {
        // console.log("Main1: ", main1)
        // console.log("Main2: ", main2)
        // console.log("Product List: ", productList)

        if (main1 && main2.length > 0 && productList.length > 0) {
            saveNewLoanTransaction()
        }
    }, [main1, main2]);

    useEffect(() => {
        if (editPtNo === false && cnCode !== "") {
            GetPTNumber();
        }
    }, [editPtNo, cnCode])

    useEffect(() => {
        if (mdlNewLoan.dlgDate !== "") {
            //  console.log(mdlNewLoan.dlgDate);
            setMdlNewLoan(prevState => ({
                ...prevState,
                maturityDate: addMonthToDateString(mdlNewLoan.dlgDate, 6),
                expDate: addMonthToDateString(mdlNewLoan.dlgDate, 3)
            }));
        }
    }, [mdlNewLoan.dlgDate]);




    const isLoading = diamondShapesLoading;
    const isError = diamondShapesError;



    useEffect(() => {
        //console.log(cnCode)

        

        if (cnCode !== "") {
            GetPTNumber();
            fetchBoxNumber();
            fetchCustomerList();
            fetchLoanCategoryList();
            //fetchDiamondShape();
            fetchItemList();
            fetchColorList();
            fetchConditionList();
            fetchKaratList();
            fetchBirthStoneList();
            fetchMadeList();

            setMdlNewLoan(prevState => ({
                ...prevState,
                dlgDate: dateToday,
                userCode: UserCode,
                tDate: dateToday
            }));
        }
    }, [cnCode]);

    useEffect(() => {
        if (boxNumberList.length > 0) {
            fetchCurrentBoxNo();
        }
    }, [boxNumberList]);


    useEffect(() => {

        // Filtering Item According to CatCode
        const filteredItems = itemList.filter(item => item.catCode === mdlNewLoan.category);
        setCurrentItems(filteredItems);

        // Diamonds Indicator
        if (mdlNewLoan.category !== "001") {
            // alert("GOLD");
            setMdlNewLoan(prevState => ({
                ...prevState,
                diamonds: false,
                diamondShapeCode: "01",
                diamondSize: "0",
                diamondPrice: "0.00",
                karat: "00",
            }));
        }

        // Weight Input control
        if (mdlNewLoan.category === "003" || mdlNewLoan.category === "001") {
            // alert("GOLD");
            setWeight(false);
        } else {
            setWeight(true);
            setMdlNewLoan(prevState => ({
                ...prevState,
                weight: "0"
            }));
        }


        // Serial and Plate No control
        if (mdlNewLoan.category === "005" || mdlNewLoan.category === "007") {
            setCategoryTypePlateNo(false);
        } else {
            setCategoryTypePlateNo(true);
        }

        if (mdlNewLoan.category === "006" || mdlNewLoan.category === "004" || mdlNewLoan.category === "005" || mdlNewLoan.category === "007") {
            setCategoryTypeSerialNo(false);
        } else {
            setCategoryTypeSerialNo(true);
        }

        if (mdlNewLoan.category !== "") {
            // Fetching Rate
            fetchRate(mdlNewLoan.category);
        }

    }, [mdlNewLoan.category, cnCode]);

    useEffect(() => {

        if (mdlNewLoan.principalamount !== 0) {

            let totalPAmount = calculateTotalPAmount(mdlNewLoan.principalamount, mdlNewLoan.interest)

            setMdlNewLoan(prevState => ({
                ...prevState,
                interestamount: totalPAmount
            }));
        }
    }, [mdlNewLoan.principalamount]);


    const handleChanges = (e) => {
        // console.log(e.target.value);
        if (e.target.value === "") {
            setAddItemStatus(true);
        } else {
            if (partialPayment) {
                setAddItemStatus(true);
            } else {
                setAddItemStatus(false);
            }
        }
        const { name, value } = e.target;
        setMdlNewLoan(prevState => ({
            ...prevState,
            [name]: value
        }));


        setFormErrors((prevData) => ({
          ...prevData,
          [name]: "",
        }));

    }

    const adjustFormat = (value) => {
        // console.log(value);
        const newValue = value.replace(/,/g, '').split('.')[0];
        // console.log(cleanedString);

        setMdlNewLoan(prevState => ({
            ...prevState,
            principalamount: newValue
        }));
    };


    const handleCheckboxChange = (value) => {
        setCbEditBoxNo(cbEditBoxNo === value ? "" : value);

        if (cbEditBoxNo === "") {
            fetchBoxNumber();
        }
    };

    const handleWDiamonds = () => {

        setMdlNewLoan(prevState => ({
            ...prevState,
            diamonds: !prevState.diamonds,
            diamondShapeCode: "000",
            diamondSize: "",
            diamondPrice: ""
        }));

    }

    const handleShow = (modal) => {
        if (modal === "pawner") {
            setShowCustModal(true);
        }
    };

    const handleClose = () => {
        setShowCustModal(false);
        setShow(false);
        fetchCustomerList();
        setLoadingModalSHow(false);
        setMessageModalShow(false);
        setPartialPaymentModalShow(false)
    };


    const GetPTNumber = async () => {
        try {
            const response = await GetPTAutoNum(cnCode);
            //console.log(response)
            if (response) {
                // console.log(response.pawnTicketNumber);

                setMdlNewLoan(prevState => ({
                    ...prevState,
                    ptNumber: response.pawnTicketNumber,
                }));
            }
        } catch (err) {
            console.log("Error: ", err);
        } finally {

        }
    }

    const fetchBoxNumber = async () => {
        try {
            const response = await GetBoxNumber(cnCode);
            if (response.length > 0) {
                // console.log(response);
                setBoxNumberList(response);
            } else {
                setMessageModalShow(true);
                setMessageText("No Box No. Available");
                setIcon(<i className="text-danger fa-regular fa-face-frown-open"></i>)
            }
        } catch (err) {
            console.log("Error: ", err);
        } finally {

        }
    }

    const fetchCurrentBoxNo = async () => {
        try {
            const response = await GetDisplayBoxNo(cnCode);
            if (response) {
                // console.log(response.BoxNo);
                setMdlNewLoan(prevState => ({
                    ...prevState,
                    selectedBoxNo: response.BoxNo
                }));
            }
        } catch (err) {
            console.log("Error: ", err);
        } finally {

        }
    }

    const fetchCustomerList = async () => {
        try {
            const response = await GetCustomerList(cnCode);
            if (response) {
                // console.log(response);
                setCustomerList(response);
            }
        } catch (err) {
            console.log("Error: ", err);
        } finally {

        }
    }

    const fetchLoanCategoryList = async () => {
        try {
            const response = await GetLoanCategory();
            if (response) {
                // console.log(response);
                setLoanCategoryList(response);
            }
        } catch (err) {
            console.log("Error: ", err);
        } finally {

        }
    }

    // const fetchDiamondShape = async () => {
    //     try {
    //         const response = await GetDiamondShape(CNCode);
    //         if (response) {
    //             // console.log(response);
    //             setDiamondShapeList(response);
    //         }
    //     } catch (err) {
    //         console.log("Error: ", err);
    //     } finally {

    //     }
    // }

    const fetchItemList = async () => {
        try {
            const response = await GetItemList(cnCode);
            if (response) {
                // console.log(response);
                setItemList(response);
            }
        } catch (err) {
            console.log("Error: ", err);
        } finally {

        }
    }

    const fetchColorList = async () => {
        try {
            const response = await GetColorList(cnCode);
            if (response) {
                // console.log(response);
                setColorList(response);
            }
        } catch (err) {
            console.log("Error: ", err);
        } finally {

        }
    }

    const fetchConditionList = async () => {
        try {
            const response = await GetConditionList(cnCode);
            if (response) {
                // console.log(response);
                setConditionList(response);
            }
        } catch (err) {
            console.log("Error: ", err);
        } finally {

        }
    }

    const fetchKaratList = async () => {
        try {
            const response = await GetKaratList(cnCode);
            if (response) {
                // console.log(response);
                setKaratList(response);
            }
        } catch (err) {
            console.log("Error: ", err);
        } finally {

        }
    }

    const fetchBirthStoneList = async () => {
        try {
            const response = await GetBirthstoneList(cnCode);
            if (response) {
                // console.log(response);
                setBirthstoneList(response);
            }
        } catch (err) {
            console.log("Error: ", err);
        } finally {

        }
    }

    const fetchMadeList = async () => {
        try {
            const response = await GetMadeList(cnCode);
            if (response) {
                // console.log(response);
                setMadeList(response);
            }
        } catch (err) {
            console.log("Error: ", err);
        } finally {

        }
    }

    const fetchRate = async (CatCode) => {
        try {
            const response = await GetRate(CatCode);
            if (response) {
                // console.log(response);

                setMdlNewLoan(prevState => ({
                    ...prevState,
                    interest: formatNumber(response)
                }));
            }
        } catch (err) {
            console.log("Error: ", err);
        } finally {

        }
    }


    const selectedCustomer = customerList.find(customer => customer.controlNo === mdlNewLoan.pawner);
    const selectedItem = currentItems.find(item => item.itemCode === mdlNewLoan.selectedItem);

    const fullName = selectedCustomer ? `${selectedCustomer.firstName} ${selectedCustomer.middleName} ${selectedCustomer.lastName}` : '';
    const fullItem = selectedItem ? selectedItem.itemDesc : '';

    // Focus Control
    const inputRefsFocus = {
        category: useRef(null),
        diamonds: useRef(null),
        diamondShapeCode: useRef(null),
        selectedItem: useRef(null),
        qty: useRef(null),
        color: useRef(null),
        condition: useRef(null),
        karat: useRef(null),
        birthstone: useRef(null),
        serialno: useRef(null),
        made: useRef(null)
    };

    // Focus Control
    const inputSaveRefsFocus = {
        remarks: useRef(null),
        appraiser: useRef(null)
    };

    const clear = () => {
        setMdlNewLoan(prevState => ({
            ...prevState,
            category: "",
            diamondShapeCode: "",
            diamondSize: "",
            diamondPrice: "",
            color: "",
            condition: "",
            karat: "",
            birthstone: "",
            birthstoneweight: "",
            birthstonepcs: "",
            serialno: "N/A",
            plateno: "N/A",
            made: "",
            weight: "0",
            principalamount: "",
            remarks: "",
            interest: "0.00",
            qty: Number(1),
            appraiser: ""
        }));

    }


    const handleAddItem = () => {

        let hasError = false;
        const newErrors = {};


        requiredformData.forEach((field) => {
          if (!mdlNewLoan[field] || mdlNewLoan[field].trim() === "") {
            hasError = true;
            newErrors[field] = "This field is required.";
          }
        });

        /*Object.keys(validators).forEach((field) => {
          const value = formData[field];
          

          if (requiredformData.includes(field) || value?.trim() !== "") {
            const result = validators[field](value);

          
            if (!result.valid) {
              hasError = true;
              newErrors[field] = result.message;
            }

            if(result.valid){
              payload[field] = result.value;
            }


          }
        });*/

        if (mdlNewLoan.principalamount === "0.00" || mdlNewLoan.principalamount === 0 || mdlNewLoan.principalamount === "Invalid Number") {
            hasError = true;
            newErrors["principalamount"] = "Please Enter Valid Principal Amount";
        }

        if (hasError) {
          setFormErrors((prevData) => ({
            ...prevData,
            ...newErrors,
          }));
          return false;
        }

        setAlertStatus(false);
        setTotals({ qty: 0, principalamount: 0, interestamount: 0 });

        // Setting Product Data
        const ProductDatatoGet = [
            "selectedItem", "category", "made", "color", "condition", "birthstone",
            "diamondSize", "diamondShapeCode", "diamondPrice", "karat", "weight",
            "serialno", "plateno", "birthstonepcs", "qty"
        ];

        const keyMapping = {
            cnCode: "CNCode",
            selectedItem: "ItemCode",
            category: "CatCode",
            made: "MadeCode",
            color: "ColorCode",
            condition: "ConditionCode",
            birthstone: "BirthStoneCode",
            diamondSize: "DiamondSize",
            diamondShapeCode: "DiamondShapeCode",
            diamondPrice: "DiamondPrice",
            karat: "KaratCode",
            weight: "Weight",
            serialno: "SerialNo",
            plateno: "PlateNo",
            birthstonepcs: "BSPcs",
            qty: "ProdQty"
        };

        setProductList(prevList => {
            const newProduct = ProductDatatoGet.reduce((acc, key) => {
                const newKey = keyMapping[key] || key;
                acc[newKey] = mdlNewLoan[key];
                return acc;
            }, {});

            const dataToSet = { CNCode: cnCode, ...newProduct };
            return [...prevList, dataToSet];
        });

        // Setting TableViewList Data
       const transDataList = { ...mdlNewLoan };
        const id = Date.now();

        const parsedPrincipal = parseFloat(transDataList.principalamount.replace(/,/g, ''));
        const parsedWeight = parseFloat(transDataList.weight);
        
        // Round to 2 decimal places
        const avGram = parsedWeight !== 0
          ? parseFloat((parsedPrincipal / parsedWeight).toFixed(2))
          : 0;

        const dataWithId = {
          id: id,
          ...transDataList,
          cnCode: cnCode,
          avGram: avGram
        };



        //console.log(dataWithId)

        setTableViewList(prevList => {
            const updatedList = [...prevList, dataWithId];
            calculateTotals(updatedList);
            return updatedList;
        });

        clear();

    };


    const calculateTotals = (list) => {
        const totals = list.reduce((acc, item) => {
            acc.qty += Number(item.qty) || 0;
            acc.principalamount += parseFloat(item.principalamount.replace(/,/g, '').split('.')[0]) || 0;
            acc.interestamount += parseFloat(item.interestamount) || 0;
            return acc;
        }, { qty: 0, principalamount: 0, interestamount: 0 });

        setTotals(totals); // Update the totals state
    };

    const deleteItem = (id) => {
        setTableViewList(prevList => {
            const updatedList = prevList.filter(item => item.id !== id);
            calculateTotals(updatedList);
            return updatedList;
        });
    };

    const findCategoryDescription = (categoryCode) => {
        const category = loanCategoryList.find(cat => cat.catCode === categoryCode);
        return category ? category.catDesc : '';
    };

    const findItemDescription = (itemCode) => {
        const items = itemList.find(list => list.itemCode === itemCode);
        return items ? items.itemDesc : '';
    };

    const [show, setShow] = useState(false);
    const [title, setTitle] = useState("");
    const [pageName, setPageName] = useState("");

    // const HandleAdd = (value) => {
    //     console.log(value)
    //     setTitle("Item Add");
    //     setShow(true);
    //     setPageName("items");
    // };
    
    const HandleAddColor = () => {
        setTitle("Color Add");
        setShow(true);
        setPageName("Color");
    };


    const handleOpenModal = (title) => {
        setTitle(title)
        setShow(true);
    };



    const reload = async () => {
        fetchItemList();
    };

    const handlePartialPaymentClick = async () => {
        console.log(mdlNewLoan.pawner);

        if (mdlNewLoan.pawner === "") {
            setSaveAlertStatus(true);
            setSaveAlertText("Please select a pawner");
            setSaveAlertColor("warning");
            return;
        }

        setSaveAlertStatus(false);

        const response = await GetPartialPaymentBoxNo(mdlNewLoan.pawner);
        console.log(response)

        // console.log("Reponse: ", response);
        if (response.length > 0) {
            setSaveAlertStatus(false);
            // console.log("Partial Payment", response);
            setPPBoxNoList(response);
            setPartialPaymentModalShow(true);
            return;
        }

        setSaveAlertStatus(true);
        setSaveAlertText("No partial payment available");
        setSaveAlertColor("warning");

    }

    const handleSave = async () => {


        try {
            /*const fieldsToCheck = Object.keys(inputSaveRefsFocus);

            // Find the first empty field and focus on it
            for (let field of fieldsToCheck) {
                if (mdlNewLoan[field] === "" || mdlNewLoan[field] === null) {

                    setSaveAlertStatus(true);
                    setSaveAlertText("Please Complete Your Entry");
                    setSaveAlertColor("danger");

                    inputSaveRefsFocus[field].current.focus();
                    return;
                }
            }*/
            setSaveAlertStatus(false);

            let hasError = false;
            const newErrors = {};


            ["remarks", "appraiser", "ptNumber", "pawner", "dlgDate"].forEach((field) => {
              if (!mdlNewLoan[field] || mdlNewLoan[field].trim() === "") {
                hasError = true;
                newErrors[field] = "This field is required.";
              }
            });

            // Checkck Duplicate
            //const duplicate = await CheckDuplicatePT("tblMain1", "PawnTicket", mdlNewLoan.ptNumber, cnCode, "PS");
            const duplicate = await CheckDuplicatePT("tblMain1", "PawnTicket", mdlNewLoan.ptNumber, cnCode, "PS");

            if (duplicate) {
                hasError = true;
                newErrors["ptNumber"] = "The pawn ticket you entered already exists.";
            }

            if (hasError) {
              setFormErrors((prevData) => ({
                ...prevData,
                ...newErrors,
              }));
              return false;
            }


            /*setLoadingModalSHow(true);
            setLoadingText(<i className="fa-solid fa-spinner fa-spin-pulse fa-lg"></i>);*/

            // extract Main1 Data
            const main1Data = [
                "userCode", "tDate", "ptNumber", "remarks", "selectedBoxNo", "appraiser", "dlgDate", "pawner"
            ];

            const keyMapping = {
                userCode: "UserCode",
                tDate: "TDate",
                ptNumber: "PawnTicket",
                remarks: "Remarks",
                selectedBoxNo: "BoxNo",
                appraiser: "Appraiser",
                dlgDate: "DLGDate",
                pawner: "ControlNo"
            };

            setMain1(() => {
                const newMain1Data = main1Data.reduce((acc, key) => {
                    const newKey = keyMapping[key] || key;
                    acc[newKey] = mdlNewLoan[key];
                    return acc;
                }, {});

                let editBoxNumber = cbEditBoxNo === "wpa" ? true : false;

                const dataToSet = { PartialPayment: editBoxNumber, CNCode: cnCode, CAmount: totals.principalamount, ...newMain1Data };
                return dataToSet;
            });

            // extract Main2 Data
            const main2DatatoGet = ["interest", "userCode", "cnCode", "principalamount"];
            const main2KeyMapping = {
                interest: "IntRate",
                userCode: "UserCode",
                cnCode: "CNCode",
                principalamount: "LoanAmount",
            };

            let num = 1; //RowNum

            const extractedValues = tableViewList.map((item) => {
                const extractedData = {};

                main2DatatoGet.forEach((key) => {
                    const mappedKey = main2KeyMapping[key] || key;

                    let value = item[key];

                    if (mappedKey === "IntRate" || mappedKey === "LoanAmount") {
                        value = parseFloat(value.toString().replace(/,/g, ''));
                    }

                    extractedData[mappedKey] = value;
                });

                extractedData.RowNum = num++;

                return extractedData;
            });

            setMain2(extractedValues);

        } catch (error) {
            console.log("Error: ", error);
            setLoadingModalSHow(false);
            setMessageModalShow(true);
            setMessageText("Something went wrong: ", error);
            setIcon(<i className="text-danger fa-regular fa-face-frown-open fa-shake"></i>)
        }


    }

    const saveNewLoanTransaction = async () => {
        try {
            // console.log("Main1: ", main1);
            // console.log("Main2: ", main2);

            const formattedProductList = productList.map(product => ({
                ...product,
                BSPcs: Number(product.BSPcs),
                DiamondSize: Number(product.DiamondSize),
                DiamondPrice: Number(product.DiamondPrice),
                Weight: Number(product.Weight),
                ProdQty: Number(product.ProdQty)
            }));

            const transactionModel = {
                Products: formattedProductList,
                Main1: main1,
                Main2Items: main2
            };

            console.log("Transaction Model: ", transactionModel)



            const response = await SaveTransaction(transactionModel);
            //console.log(response);
            //const response = { statusText: "OK" }
            
            if (response.statusText === "OK") {
                setLoadingModalSHow(false);
                setMessageModalShow(true);
                setMessageText("Transaction Saved");
                setAlertStatus(false);
                setAlertText("");
                setIcon(<i className="text-success fa-regular fa-circle-check fa-bounce"></i>)


                //clearing-finalizing
                clear();

                setTableViewList([]);
                setTotals({ qty: 0, principalamount: 0, interestamount: 0 });
                fetchBoxNumber();
                GetPTNumber();
                setPartialPayment(false);
                setCbEditBoxNo("");

                setMdlNewLoan(prevState => ({
                    ...prevState,
                    pawner: "",
                }));

            }
        } catch (error) {
            console.error(error)
            setLoadingModalSHow(false);
            setMessageModalShow(true);
            setMessageText("Something went wrong: ", error);
            setIcon(<i className="text-danger fa-regular fa-face-frown-open fa-shake"></i>)
        }


    }

    const handlePartialPaymentPost = (data) => {
        if (data.length > 0) {
            setTableViewList([]);
            setProductList([]);

            setTotals({ qty: 0, principalamount: 0, interestamount: 0 });
            setAddItemStatus(true);
            // console.log("Post Data: ", data);

            const keyMapping = {
                birthStoneCode: "birthstone",
                boxNo: "selectedBoxNo",
                bsPcs: "birthstonepcs",
                bsWeight: "birthstoneweight",
                cAmount: "principalamount",
                catCode: "category",
                cnCode: "cnCode",
                colorCode: "color",
                conditionCode: "condition",
                controlNo: "ptNumber",
                diamondPrice: "diamondPrice",
                diamondShapeCode: "diamondShapeCode",
                diamondSize: "diamondSize",
                docNum: "id",
                ic: "remarks",
                itemCode: "selectedItem",
                karatCode: "karat",
                madeCode: "made",
                plateNo: "plateno",
                prodQty: "qty",
                reference: "pawner",
                serialNo: "serialno",
                tDate: "tDate",
                weight: "weight",
                intRate: "interest",
                userCode: "userCode"

            };

            const fieldsForProductList = [
                "cnCode",
                "itemCode",
                "catCode",
                "madeCode",
                "colorCode",
                "conditionCode",
                "birthStoneCode",
                "diamondSize",
                "diamondShapeCode",
                "diamondPrice",
                "karatCode",
                "weight",
                "serialNo",
                "plateNo",
                "bsPcs",
                "prodQty"
            ];

            const ProductkeyMapping = {
                cnCode: "CNCode",
                itemCode: "ItemCode",
                catCode: "CatCode",
                madeCode: "MadeCode",
                colorCode: "ColorCode",
                conditionCode: "ConditionCode",
                birthStoneCode: "BirthStoneCode",
                diamondSize: "DiamondSize",
                diamondShapeCode: "DiamondShapeCode",
                diamondPrice: "DiamondPrice",
                karatCode: "KaratCode",
                weight: "Weight",
                serialNo: "SerialNo",
                plateNo: "PlateNo",
                bsPcs: "BSPcs",
                prodQty: "ProdQty"
            };


            const mapKeysForProductList = (item) => {
                const newItem = {};
                fieldsForProductList.forEach(field => {
                    const newKey = ProductkeyMapping[field] || field;
                    let value = item[field];

                    // Convert the values for BSPcs, DiamondPrice, and ProdQty to strings
                    if (["bsPcs", "diamondPrice", "prodQty"].includes(field)) {
                        value = value.toString();
                    }

                    newItem[newKey] = value;
                });
                return newItem;
            };

            const mappedProductList = data.map(item => mapKeysForProductList(item));

            setProductList(prevList => [
                ...prevList,
                ...mappedProductList
            ]);


            const mapKeysWithInterest = (item) => {
                const newItem = {};

                const cAmount = parseFloat(item.cAmount);
                const intRate = parseFloat(item.intRate);

                const interestamount = cAmount * intRate;

                // Map keys
                Object.keys(item).forEach(oldKey => {
                    const newKey = keyMapping[oldKey] || oldKey;
                    newItem[newKey] = item[oldKey];
                });

                newItem.interestamount = interestamount.toFixed(2);

                return newItem;
            };

            const calculateTotals = (list) => {
                const totals = list.reduce((acc, item) => {
                    acc.qty += Number(item.qty) || 0;
                    acc.principalamount += parseFloat(item.principalamount.replace(/,/g, '').split('.')[0]) || 0;
                    acc.interestamount += parseFloat(item.interestamount) || 0;
                    return acc;
                }, { qty: 0, principalamount: 0, interestamount: 0 });

                setTotals(totals); // Return the totals object
            };

            const mappedList = data.map(item => mapKeysWithInterest(item));
            const totals = calculateTotals(mappedList);

            setTableViewList(prevList => [
                ...prevList,
                ...mappedList.map(item => ({ ...item, id: "", userCode: mdlNewLoan.userCode, principalamount: formatStringNumber(item.principalamount) }))
            ]);

            setCbEditBoxNo("wpa");
            setPartialPayment(true);
            setPartialPaymentModalShow(false);

        }
    };

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




    return (<>

        {/* Modals */}

        <CustModal show={showCustModal} handleClose={handleClose} title={"Customer Add"} cnCode={cnCode || ""} />

        {/*<CentralizeModal
            show={show}
            handleClose={handleClose}
            title={title}
            cnCode={cnCode}
            PageName={pageName} // Use state value here
            success={reload}
        />*/}

        <CustomModal 
            show={show}
            handleClose={handleClose}
            entry={title}

        />

        <PartialPaymentModal
            show={partialPaymentModalShow}
            handleClose={handleClose}
            data={pPBoxNoList}
            categoryDescription={findCategoryDescription}
            itemDescription={findItemDescription}
            onPost={handlePartialPaymentPost}
        // title={title}
        // cnCode={cnCode}
        // PageName={PageName}
        // success={reload}
        />

        <MessageModal
            show={messageModalShow}
            handleClose={handleClose}
            text={messageText}
            icon={icon}
        />

        <LoadingModal
            show={loadingModalSHow}
            handleClose={handleClose}
            text={loadingText}
        />


        {/* Modals */}



        <div className="bg-prim p-2 fw-bold sticky-top">New Loan</div>
        <div className="container-fluid h-100 py-1">
            <div className="row p-2">
                <div className="col-5 p-1">
                    <div className="border-top  border-primary   border border-1 p-2  ">

                        <div className="d-flex gap-2">

                            <div className="w-100">

                                <CustomInput
                                    label="Pawn Ticket No."
                                    name="ptNumber"
                                    onChange={handleChanges}
                                    value={mdlNewLoan.ptNumber}
                                    size="small"
                                    error={!!formErrors.ptNumber}
                                    helperText={formErrors.ptNumber}
                                    required
                                    disabled={!editPtNo}
                                />

                            </div>

                            <div className="w-100">
                                <small className="">Box No.</small>
                                {!cbEditBoxNo ? (
                                    <select
                                        className="form-select form-select-sm fw-bold text-center"
                                        disabled
                                        name="selectedBoxNo"
                                        value={mdlNewLoan.selectedBoxNo}
                                        onChange={(e) => handleChanges(e)}
                                    >
                                        {boxNumberList?.map((list, index) => (
                                            <option key={index} value={list.boxNo}>{list.boxNo}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <input className="form-control form-control-sm text-center fw-bold"
                                        name="selectedBoxNo"
                                        value={mdlNewLoan.selectedBoxNo}
                                        onChange={(e) => handleChanges(e)} ></input>
                                )}


                            </div>
                        </div>

                        <div className="d-flex flex-wrap gap-2">
                            <div className="w-auto">
                                <small>Date Loan Granted:</small>
                                <input
                                    type="date"
                                    className="form-control form-control-sm"
                                    name="dlgDate"
                                    defaultValue={mdlNewLoan.dlgDate}
                                    onChange={(e) => handleChanges(e)}
                                />
                            </div>

                            <div className="w-auto">
                                <small>Maturity Date:</small>
                                <input
                                    type="date"
                                    className="form-control form-control-sm"
                                    defaultValue={mdlNewLoan.maturityDate}
                                />
                            </div>

                            <div className="w-auto">
                                <small>Expiry Date:</small>
                                <input
                                    type="date"
                                        className="form-control form-control-sm"
                                        defaultValue={mdlNewLoan.expDate}
                                    />
                            </div>
                        </div>

                    </div>

                    <div className="row mt-1">

                        <div className="col-12 ">
                            <div className="border-top  border-primary   p-1   border border-1">
                                <div className="p-1 d-grid">

                                    <div className="d-flex gap-2">
                                        <div className="d-flex gap-1 align-items-end w-100">
                                            <div className="w-100">
                                                <small className="">Pawner:</small>

                                                <OverlayTrigger overlay={<Tooltip id="tooltip-right" className="bg-light">{fullName || "Select Pawner"}</Tooltip>}>
                                                    <select className="form-select form-select-sm text-truncate" name="pawner" value={mdlNewLoan.pawner} onChange={(e) => handleChanges(e)} disabled={boxNumberList.length === 0}>
                                                        <option value="">Select Pawner</option>
                                                        {customerList?.map((list, index) => (
                                                            <option key={index} value={list.controlNo} >{list.firstName + " " + list.middleName + " " + list.lastName}</option>
                                                        ))}
                                                    </select>
                                                </OverlayTrigger>
                                            </div>


                                            <span className="d-inline-block">
                                                <button className="btn btn-sm bg-prim rounded-circle bg-sec" onClick={() => handleShow("pawner")}><i className="fa-regular fa-square-plus"></i></button>
                                            </span>

                                        </div>

                                        <div className="d-flex gap-2 w-75">
                                            <div className="w-100">
                                                <small className="">Type of Loan:</small>
                                                <select ref={inputRefsFocus.category} className="form-select form-select-sm" name="category" value={mdlNewLoan.category} onChange={handleChanges} disabled={mdlNewLoan.pawner === ""}>
                                                    <option value="">Select Type of Loan </option>
                                                    {loanCategoryList?.map((list, index) => (
                                                        <option key={index} value={list.catCode}>{list.catDesc}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>


                                    <div className="form-check mt-1">
                                        <input ref={inputRefsFocus.diamonds} className="form-check-input" type="checkbox" value="" id="diamonds" disabled={mdlNewLoan.category !== "001" || mdlNewLoan.pawner === ""} checked={mdlNewLoan.diamonds} onChange={() => handleWDiamonds()} />
                                        <label className="form-check-label small" htmlFor="diamonds">
                                            With Diamonds
                                        </label>
                                    </div>

                                    <div className="d-flex gap-1 align-items-end">
                                        <div className="w-100">
                                            <small className="">Diamond Shape:</small>
                                            <select ref={inputRefsFocus.diamondShapeCode} className="form-select form-select-sm" disabled={!mdlNewLoan.diamonds || mdlNewLoan.pawner === ""} name="diamondShapeCode" value={mdlNewLoan.diamondShapeCode} onChange={(e) => handleChanges(e)}>
                                                <option value="">Select Diamond Shape</option>
                                                {diamondShapeList?.map((list, index) => (
                                                    <option key={index} value={list.diamondShapeCode}>{list.diamondShapeDesc}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <button className="btn btn-sm bg-prim rounded-circle bg-sec" 
                                            disabled={!mdlNewLoan.diamonds || mdlNewLoan.pawner === ""}
                                            onClick={() => handleOpenModal("diamond")}
                                            ><i className="fa-regular fa-square-plus"></i>
                                        </button>

                                    </div>

                                    <div className="d-flex gap-2 w-100">

                                        <div className="d-flex gap-1 w-100">
                                            <div className="w-100">
                                                <small className="">Diamond Size:</small>
                                                <input type="number" className="form-control form-control-sm text-end" disabled={!mdlNewLoan.diamonds || mdlNewLoan.pawner === ""} name="diamondSize" value={mdlNewLoan.diamondSize} onChange={(e) => handleChanges(e)}
                                                    onBlur={() => setMdlNewLoan(prevState => ({
                                                        ...prevState,
                                                        diamondSize: formatNumber(Number(prevState.diamondSize))
                                                    }))} />
                                            </div>
                                        </div>

                                        <div className="d-flex gap-1 w-100">

                                            <div className="w-100">
                                                <small className="">Diamond Price:</small>
                                                <input type="number" className="form-control form-control-sm text-end" disabled={!mdlNewLoan.diamonds || mdlNewLoan.pawner === ""} name="diamondPrice" value={mdlNewLoan.diamondPrice} onChange={(e) => handleChanges(e)}
                                                    onBlur={() => setMdlNewLoan(prevState => ({
                                                        ...prevState,
                                                        diamondPrice: formatNumber(Number(prevState.diamondPrice))
                                                    }))} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div className="col-12 mt-1">
                            <div className="border-top  border-primary   p-1   border border-1">
                                <div className="p-1 d-grid">
                                    <div className="d-flex gap-2 w-100">
                                        <div className="d-flex gap-1 align-items-end w-100">
                                            <div className="w-100">
                                                <CustomSelect
                                                  label="Item"
                                                  name="selectedItem"
                                                  value={mdlNewLoan.selectedItem}
                                                  options={currentItems}
                                                  onChange={handleChanges}
                                                  placeholder="Select"
                                                  valueKey="itemCode"
                                                  labelKey="itemDesc"
                                                  error={!!formErrors.selectedItem}
                                                  helperText={formErrors.selectedItem}
                                                  disabled={mdlNewLoan.pawner === ""}
                                                  required
                                                />

                                            </div>

                                            <button className="btn btn-sm bg-prim rounded-circle bg-sec"
                                                onClick={() => handleOpenModal("item")
                                                }
                                            ><i className="fa-regular fa-square-plus"></i></button>
                                        </div>

                                        <div className="w-100">
                                            <div className="w-100">
                                                <small className="">Quantity:</small>
                                                <input ref={inputRefsFocus.qty} type="number" className="form-control form-control-sm text-end" name="qty" value={mdlNewLoan.qty} onChange={(e) => handleChanges(e)} disabled={mdlNewLoan.pawner === ""} />
                                            </div>
                                        </div>
                                    </div>


                                    <div className="d-flex gap-2 w-100">
                                        <div className="d-flex gap-1 align-items-end w-100">
                                            <div className="w-100">
                                                <CustomSelect
                                                  label="Color"
                                                  name="color"
                                                  value={mdlNewLoan.color}
                                                  options={colorList}
                                                  onChange={handleChanges}
                                                  placeholder="Select"
                                                  valueKey="colorCode"
                                                  labelKey="colorDesc"
                                                  error={!!formErrors.color}
                                                  helperText={formErrors.color}
                                                  disabled={mdlNewLoan.pawner === ""}
                                                  required
                                                />
                                            </div>


                                            <button className="btn btn-sm bg-prim rounded-circle bg-sec"
                                                onClick={() => handleOpenModal("color")}
                                            ><i className="fa-regular fa-square-plus"></i></button>
                                        </div>

                                        <div className="d-flex gap-1 align-items-end w-100">
                                            <div className="w-100">
                                                
                                                <CustomSelect
                                                  label="Condition"
                                                  name="condition"
                                                  value={mdlNewLoan.condition}
                                                  options={conditionList}
                                                  onChange={handleChanges}
                                                  placeholder="Select"
                                                  valueKey="conditionCode"
                                                  labelKey="conditionDesc"
                                                  error={!!formErrors.condition}
                                                  helperText={formErrors.condition}
                                                  disabled={mdlNewLoan.pawner === ""}
                                                  required
                                                />
                                            </div>

                                            <button className="btn btn-sm bg-prim rounded-circle bg-sec" onClick={() => handleOpenModal("condition")}><i className="fa-regular fa-square-plus"></i></button>
                                        </div>
                                    </div>

                                    <div className="d-flex gap-2 w-100">

                                        <div className="d-flex gap-1 align-items-end w-100">
                                            <div className="w-100">
                                                <CustomSelect
                                                  label="Karat"
                                                  name="karat"
                                                  value={mdlNewLoan.karat}
                                                  options={karatList}
                                                  onChange={handleChanges}
                                                  placeholder="Select"
                                                  valueKey="karatCode"
                                                  labelKey="karatDesc"
                                                  error={!!formErrors.karat}
                                                  helperText={formErrors.karat}
                                                  disabled={mdlNewLoan.pawner === "" || mdlNewLoan.category !== "001"}
                                                  required
                                                />
                                            </div>

                                            <button className="btn btn-sm bg-prim rounded-circle bg-sec"  onClick={() => handleOpenModal("karat")}><i className="fa-regular fa-square-plus"></i></button>
                                        </div>

                                        <div className="d-flex gap-1 align-items-end w-100">
                                            <div className="w-100">
                                                <CustomSelect
                                                  label="Birth Stone"
                                                  name="birthstone"
                                                  value={mdlNewLoan.birthstone}
                                                  options={birthstoneList}
                                                  onChange={handleChanges}
                                                  placeholder="Select"
                                                  valueKey="birthStoneCode"
                                                  labelKey="birthStoneDesc"
                                                  error={!!formErrors.birthstone}
                                                  helperText={formErrors.birthstone}
                                                  disabled={mdlNewLoan.pawner === ""}
                                                  required
                                                />
                                            </div>

                                            <button className="btn btn-sm bg-prim rounded-circle bg-sec" onClick={() => handleOpenModal("birthstone")}>
                                                <i className="fa-regular fa-square-plus"></i>
                                            </button>
                                        </div>

                                    </div>

                                    <div className="d-flex gap-1">
                                        <div className="w-100">
                                            <small className="">Birth Stone Weight:</small>
                                            <input ref={inputRefsFocus.birthstoneweight} type="number" className="form-control form-control-sm text-end" name="birthstoneweight" value={mdlNewLoan.birthstoneweight} onChange={(e) => handleChanges(e)}
                                                onBlur={() => setMdlNewLoan(prevState => ({
                                                    ...prevState,
                                                    birthstoneweight: formatNumber(Number(prevState.birthstoneweight))
                                                }))}
                                                disabled={mdlNewLoan.pawner === ""}
                                            />
                                        </div>

                                        <div className="w-100">
                                            <small className="">Birth Stone Pieces:</small>
                                            <input ref={inputRefsFocus.birthstonepcs} type="number" className="form-control form-control-sm text-end" name="birthstonepcs" value={mdlNewLoan.birthstonepcs} onChange={(e) => handleChanges(e)} disabled={mdlNewLoan.pawner === ""} />
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div className="col-6 pe-1">
                            <div className="border-top  border-primary   border border-1 p-1   mt-1">
                                <div className="p-1 d-grid align-items-end w-100">

                                    <div className="w-100">
                                        <small className="">Serial No:</small>
                                        <input ref={inputRefsFocus.serialno} type="text" className="form-control form-control-sm text-center" name="serialno" value={mdlNewLoan.serialno} onChange={(e) => handleChanges(e)} disabled={categoryTypeSerialNo} />
                                    </div>

                                    <div className="w-100">
                                        <small className="">Plate No:</small>
                                        <input type="text" className="form-control form-control-sm text-center" name="plateno" value={mdlNewLoan.plateno} onChange={(e) => handleChanges(e)} disabled={categoryTypePlateNo} />
                                    </div>

                                    {/* <div className="form-check w-75">
                                        <input className="form-check-input" type="checkbox" value="" id="snp" />
                                        <label htmlFor="snp" className="form-check-label small">
                                            Save and Print?
                                        </label>
                                    </div> */}

                                </div>

                            </div>
                        </div>

                        <div className="col-6 d-grid gap-2 ps-1">
                            <div className="border-top  border-primary   border border-1 p-1   mt-1">

                                <div className="p-1 d-grid w-100 gap-0">

                                    <div className="d-flex gap-1 align-items-end">
                                        <div className="w-100">

                                            <CustomSelect
                                              label="Made"
                                              name="made"
                                              value={mdlNewLoan.made}
                                              options={madeList}
                                              onChange={handleChanges}
                                              placeholder="Select"
                                              valueKey="madeCode"
                                              labelKey="madeDesc"
                                              error={!!formErrors.made}
                                              helperText={formErrors.made}
                                              disabled={mdlNewLoan.pawner === ""}
                                              required
                                            />
                                        </div>

                                        <button className="btn btn-sm bg-prim rounded-circle bg-sec" onClick={() => handleOpenModal("made")}><i className="fa-regular fa-square-plus"></i></button>
                                    </div>

                                    <div className="w-100">
                                        <small className="">Weight:</small>
                                        <input type="number" className="form-control form-control-sm text-end" name="weight" value={mdlNewLoan.weight} onChange={(e) => handleChanges(e)} disabled={mdlNewLoan.pawner === "" || weight} />
                                    </div>

                                </div>

                            </div>
                        </div>

                    </div>
                </div>
                <div className="col-7 p-1 ">
                    <div className="border border-primary p-2  border-1">

                        <div className="d-flex gap-1">

                            <div className="w-100">

                                <CustomInput
                                    label="Principal Amount"
                                    name="principalamount"
                                    onChange={handleChanges}
                                    value={mdlNewLoan.principalamount}
                                    onBlur={() => setMdlNewLoan(prevState => ({
                                        ...prevState,
                                        principalamount: formatStringNumber(Number(prevState.principalamount)),
                                    }))}
                                    size="small"
                                    error={!!formErrors.principalamount}
                                    helperText={formErrors.principalamount}
                                    required
                                    disabled={mdlNewLoan.pawner === "" || mdlNewLoan.category === ""}
                                />

                            </div>

                            <div className="w-100">
                                <small className="">Interest %:</small>
                                <input type="text" className="form-control form-control-sm text-center fw-bold" name="interest" defaultValue={mdlNewLoan.interest || ""} disabled />
                            </div>


                            <div className="w-100">
                                <small className="">Interest Amount: </small>
                                <input type="text" className="form-control form-control-sm text-center fw-bold" name="interestamount" value={formatStringNumber(mdlNewLoan.interestamount)} onChange={(e) => handleChanges(e)} disabled />
                            </div>

                            {/* <div className="w-100">
                                <small className="">Total Interest Value: </small>
                                <input type="text" className="form-control form-control-sm text-center fw-bold" />
                            </div> */}
                        </div>

                        <div className="d-flex gap-2 mt-2 align-items-center">

                            <button className="btn btn-sm bg-sec w-25" onClick={handleAddItem} disabled={btnAddItemstatus}><i className="fa-solid fa-diagram-next"></i> Add Item</button>

                            <div className="text-center w-100">
                                <Alert
                                    show={alertstatus}
                                    onClose={() => setAlertStatus(false)}
                                    variant={alertcolor}
                                    className="small p-2 mb-0 d-flex"
                                >
                                    <span className="ms-auto">{alerttext}</span>
                                    <Link className="text-decoration-none text-danger ms-auto" onClick={() => setAlertStatus(false)}> <i className="fa-regular fa-circle-xmark"></i></Link>
                                </Alert>
                            </div>
                        </div>
                    </div>

                    <div className="table-responsive border-top border-primary border border-1 p-1 mt-1 h-50">
                        <table className="table table-sm table-striped table-hover w-100">
                            <thead className="small">
                                <tr>
                                    <th>Category</th>
                                    <th className="text-center">Qty</th>
                                    <th>Item</th>
                                    <th className="text-end">Loan Amount</th>
                                    <th className="text-end">Interest Rate</th>
                                    <th className="text-end">Interest Amount</th>
                                    <th className="text-end">AVGram</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableViewList.length > 0 ? (

                                    tableViewList?.map((list, index) => (
                                        <tr key={index} className="small">
                                            <td>{findCategoryDescription(list.category)}</td>
                                            <td className="text-center">{list.qty}</td>
                                            <td>{findItemDescription(list.selectedItem)}</td>
                                            <td className="text-end">{list.principalamount}</td>
                                            <td className="text-end">{list.interest}</td>
                                            <td className="text-end">{formatStringNumber(list.interestamount)}</td>
                                            <td className="text-end">{list.avGram}</td>
                                            <td className="text-center"><button disabled={list.id === ""} className="btn btn-sm btn-transparent text-danger py-0" onClick={() => deleteItem(list.id)}><i className="fa-regular fa-trash-can fa-md"></i></button></td>
                                        </tr>
                                    ))
                                )

                                    :

                                    (
                                        <tr className="small text-center">
                                            <td colSpan={7}>No Items Added</td>
                                        </tr>
                                    )}

                            </tbody>
                            <tfoot>
                                <tr className="small fw-bold sticky-bottom">
                                    <td colSpan={3}>Total:</td>
                                    <td className="text-end text-danger">{formatStringNumber(totals.principalamount)}</td>
                                    <td></td>
                                    <td className="text-end text-danger">{formatStringNumber(totals.interestamount)}</td>
                                    <td></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    <div className="input-group my-2 ">
                        <CustomInput
                            label="Remarks"
                            name="remarks"
                            onChange={handleChanges}
                            value={mdlNewLoan.remarks} 
                            size="small"
                            error={!!formErrors.remarks}
                            helperText={formErrors.remarks}
                            required
                            disabled={mdlNewLoan.pawner === ""}
                            width="w-100"

                        />
                    </div>

                    <div className="input-group my-2 ">
                        <CustomInput
                            label="Appraiser's Name:"
                            name="appraiser"
                            onChange={handleChanges}
                            value={mdlNewLoan.appraiser} 
                            size="small"
                            error={!!formErrors.appraiser}
                            helperText={formErrors.appraiser}
                            required
                            width="w-100"

                        />

                    </div>

                    <div className="p-1 mt-3 d-flex gap-1">

                        <div className="input-group w">
                            <div className="input-group-text bg-sec">
                                <input
                                    className="form-check-input mt-0"
                                    disabled={partialPayment}
                                    type="checkbox"
                                    checked={cbEditBoxNo === "wpa"}
                                    onChange={() => handleCheckboxChange("wpa")}
                                />
                            </div>
                            <input
                                type="text"
                                disabled
                                placeholder="Edit Box No. With Partial/Additional"
                                className="form-control small fw-bold"
                                aria-label="Text input with radio button"
                            />
                        </div>

                        <div className="input-group">
                            <div className="input-group-text bg-sec">
                                <input
                                    className="form-check-input mt-0"
                                    type="checkbox"
                                    disabled={partialPayment}
                                    checked={cbEditBoxNo === "wopa"}
                                    onChange={() => handleCheckboxChange("wopa")}
                                />
                            </div>
                            <input
                                type="text"
                                disabled
                                placeholder="Edit Box No. Without Partial/Additional"
                                className="form-control small fw-bold"
                                aria-label="Text input with radio button"
                            />
                        </div>

                    </div>

                    <div className="p-1 mt-1 d-flex gap-2 w-100 align-items-center">
                        <div className="input-group">
                            <div className="input-group-text bg-sec">
                                <input className="form-check-input mt-0" type="checkbox" checked={editPtNo} onChange={() => setEditPtNo(!editPtNo)} />
                            </div>
                            <input type="text" disabled placeholder="Edit PT Number" className="form-control small fw-bold" aria-label="Text input with radio button" />
                        </div>

                        <button className="btn btn-sm bg-sec w-100" onClick={handlePartialPaymentClick}><i className="fa-solid fa-list"></i> List of Partial Payment</button>

                    </div>

                    <div className="mt-3 d-flex gap-2 align-items-center">

                        <div className="text-center w-100">
                            <Alert
                                show={savealertstatus}
                                onClose={() => setSaveAlertStatus(false)}
                                variant={savealertcolor}
                                className="small p-2 mb-0 d-flex"
                            >
                                <span className="ms-auto">{savealerttext}</span>
                                <Link className="text-decoration-none text-danger ms-auto" onClick={() => setSaveAlertStatus(false)}> <i className="fa-regular fa-circle-xmark"></i></Link>
                            </Alert>
                        </div>

                        <button className="btn btn-sm bg-prim ms-auto p-2 w-50"
                            disabled={tableViewList.length === 0}
                            onClick={() => handleSave()}><i className="fa-solid fa-floppy-disk"></i> Save</button>
                    </div>
                </div>
            </div>
        </div>
    </>)
}