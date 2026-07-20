import { useState } from 'react'
import {
  Container,
  Grid,
  Paper,
  Typography,
  Stack,
  Checkbox,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
  TextField,
  Autocomplete,
  Button
} from '@mui/material';


import CustomMuiSelect from '../../CustomMuiComponents/CustomMuiSelect';
import CustomMuiInput from '../../CustomMuiComponents/CustomMuiInput';

import { 
  useCustomersQuery, 
} from "../../Hooks/useTransactionQueries";


import {
  useSearchPawntickeVoucher,
  useUpdateSearchTransaction
} from "../../Hooks/useSearchQueries";


import { 
  useItems,
  useKarats,
  useConditions,
  useColors,
  useMade,
  useBirthStone,
  useDiamondShape
} from "../../Hooks/useEntriesQueries";



import { UserSession, convertToYYYYMMDD } from "../../Functions/UtilityFunctions";
import axios from "axios";
import StringHost from "../../Functions/ConnectionString";
import Notification from "../../Alert/Notification";




const defaultFormData = {
  ic: "",
  voucher: "PS",
  transactionDate: "",
  description: "",
  isPawnticket: true,
  docNum: "",
  pawnticketNo: "",
  boxNo: "",
  dlg: "",
  expDate: "",
  status: "",
  pawner: "",
  principalAmount: "",
  interestAmount: "",
  appraiser: "",
  remarks: "",
  pkProdNumber: "",
  motorNo: "",
  chasisNo: "",
  serialNo: "",
  item: "",
  made: "",
  itemWeight: "",
  color: "",
  condition: "",
  karat: "",
  birthstone: "",
  birthstoneWeight: "",
  birthstonePcs: "",
  diamond: "",
  diamondShape: "",
  diamondSize: "",
  diamondPrice: ""
}



const getDocNum = async (ic, voucher, cnCode) => {
    try {
      const response = await axios.get(`${StringHost()}/API/SCPWEBAPI/Security/get-doc-num?strIC=${ic}&strVoucher=${voucher}&strCNCode=${cnCode}`);
      
      return response.data;

    } catch (error) {
      console.error("Error fetching column names:", error);
    }
}

const getDetailsInfo = async (ic, voucher, cnCode) => {
    try {
      const response = await axios.get(`${StringHost()}/API/SCPWEBAPI/Search/DetailsInfo?ic=${ic}&voucherType=${voucher}&CnCode=${cnCode}`);
      
      return response.data;

    } catch (error) {
      console.error("Error fetching column names:", error);
    }
}



const getItems = async (pawnticket, cnCode) => {
    try {
      const response = await axios.get(`${StringHost()}/API/SCPWEBAPI/Search/getItems?Pawnticket=${pawnticket}&CNCode=${cnCode}`);      
      return response.data;

    } catch (error) {
      console.error("Error fetching column names:", error);
    }
}




const SearchTransaction = () => {
  const { CNCode } = UserSession();
  const [formData, setFormData] = useState(defaultFormData);
  const [pawnticketSearch, setPawnticketSearch] = useState(true);
  const [pawnTransactions, setPawnTransactions] = useState([]);
  const [items, setItems] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);

  const updateMutation = useUpdateSearchTransaction();

  const customers = useCustomersQuery(CNCode);
  const pawnTickets = useSearchPawntickeVoucher(CNCode, formData.voucher);
  const itemList = useItems(CNCode);
  const karatList = useKarats(CNCode);
  const conditionList = useConditions(CNCode);
  const colorList = useColors(CNCode);
  const madeList = useMade(CNCode);
  const brightStoneList = useBirthStone(CNCode);
  const diamondShapeList = useDiamondShape(CNCode);



  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    /*setFormErrors((prev) => ({
      ...prev,
      [name]: "",
    }));*/

    

  };


  const getPawntransactions = async (values, isPawnticketSearch) => {
    
    let url = "";

    if(pawnticketSearch){
      /*if(formData.voucher === "PS"){
        url = `PawnticketTransactions?VarPTNo=${isPawnticketSearch}&StrPTNo=${values.pawnticket}&StrControlNo=${values.ic}&StrVoucher=${formData.voucher}`;
      }*/

      url = `PawnticketTransactions?VarPTNo=${isPawnticketSearch}&StrPTNo=${values.pawnticket}&StrControlNo=${values.ic}&StrVoucher=${formData.voucher}`;


      /*if(formData.voucher === "RS"){
        url = `PawnticketTransactions?VarPTNo=${isPawnticketSearch}&StrPTNo=${values.pawnticket}&StrControlNo=${values.ic}&StrVoucher=${formData.voucher}`;
      }*/

    }else{
      /*if(formData.voucher === "PS"){
        url = `PawnticketTransactions?VarPTNo=${isPawnticketSearch}&StrControlNo=${values.controlNo}&StrVoucher=${formData.voucher}`;
      }*/

      url = `PawnticketTransactions?VarPTNo=${isPawnticketSearch}&StrControlNo=${values.controlNo}&StrVoucher=${formData.voucher}`;


      /*if(formData.voucher === "RS"){
        url = `PawnticketTransactions?VarPTNo=${isPawnticketSearch}&StrControlNo=${values.controlNo}&StrVoucher=${formData.voucher}`;
      }*/

    }

    //console.log(url)

    try {
      const response = await axios.get(`${StringHost()}/API/SCPWEBAPI/Search/${url}`);
      
      setPawnTransactions(response.data);

    } catch (error) {
      console.error("Error fetching column names:", error);
      return []; // Return an empty array in case of an error
    }
  };



  const handleRowClick = async (item) => {
    
 
    
   
    const data1 = await getDocNum(item.ic, item.voucher, CNCode);
    const data2 = await getDetailsInfo(item.ic, item.voucher, CNCode);
    const data3 = await getItems(item.pawnticket, CNCode)
    
    
    //console.log(data3);

    setIsEditMode(false);
    setFormData((prevState) => ({
        ...prevState,
        ic: item.ic,
        boxNo: data1.boxNo,
        docNum: data1.docNum,
        pawner: data1.controlNo,
        pawnticketNo: item.pawnticket,
        transactionDate: item.tDate,
        ...data2[0],

        pkProdNumber: data3[0].pkProdNumber ?? "",

        diamond: data3[0].diamondShapeCode ?? "",
        diamondShape: data3[0].diamondShapeCode ?? "",
        diamondSize: data3[0].diamondSize ?? "",
        diamondPrice: data3[0].diamondPrice ?? "",

        motorNo: data3[0].motorNo ?? "",
        chasisNo: data3[0].chasisNo ?? "",
        serialNo: data3[0].serialNo ?? "",

        item: data3[0].itemCode ?? "",
        made: data3[0].madeCode ?? "",
        itemWeight: data3[0].weight ?? "",
        color: data3[0].colorCode ?? "",
        condition: data3[0].conditionCode ?? "",
        karat: data3[0].karatCode ?? "",
        birthstone: data3[0].birthStoneCode ?? "",
        birthstoneWeight: data3[0].bsWeight ?? "",
        birthstonePcs: data3[0].bsPcs ?? ""


    }));

    setItems(data3)

  }

  const handleSave = async () => {
    try {
    await updateMutation.mutateAsync({
      // keys
      ic: formData.ic,
      cnCode: CNCode,
      // header (tblMain1)
      appraiser: formData.appraiser,
      remarks: formData.remarks,
      cAmount: formData.principalAmount === "" ? null : Number(formData.principalAmount),
      dLGDate: formData.dlg || null,
      eDate: formData.expDate || null,
      boxNo: formData.boxNo,
      // item (tblStocks)
      pKProdNumber: formData.pkProdNumber,
      itemCode: formData.item,
      madeCode: formData.made,
      karatCode: formData.karat,
      colorCode: formData.color,
      conditionCode: formData.condition,
      birthStoneCode: formData.birthstone,
      diamondShapeCode: formData.diamondShape,
      diamondSize: formData.diamondSize === "" ? null : Number(formData.diamondSize),
      diamondPrice: formData.diamondPrice === "" ? null : Number(formData.diamondPrice),
      weight: formData.itemWeight === "" ? null : Number(formData.itemWeight),
      bSWeight: formData.birthstoneWeight === "" ? null : Number(formData.birthstoneWeight),
      bSPcs: formData.birthstonePcs === "" ? null : Number(formData.birthstonePcs),
      serialNo: formData.serialNo,
      motorNo: formData.motorNo,
      chasisNo: formData.chasisNo,
    });
    Notification({ type: "success", message: "Saved successfully" });
    setIsEditMode(false);
    } catch (error) {
      Notification({
        type: "error",
        message: error?.response?.data ?? "Failed to save. Please try again.",
      });
    }
  };


  // if (loadingDetails) return <p>Loading...</p>;
  // if (errorDetails) return <p>Error</p>
  
  return (


    <Container maxWidth="lg" sx={{ py: 2 }}>
        <Typography variant="h5" gutterBottom>
          List of Transaction
        </Typography>

        <Grid container spacing={{ xs: 1, md: 2 }} columns={{ xs: 1, sm: 8, md: 12 }}>
            <Grid size={{ xs: 12, sm: 4, md: 4 }} >
              <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
                {/*<Stack
                  direction="row"
                  spacing={2}
                  sx={{
                    justifyContent: "flex-start",
                    alignItems: "flex-start"

                  }}
                >
                
                  
                </Stack>
                */}
                
                <Grid container spacing={1} columns={{ xs: 1, sm: 8, md: 12 }}>
                
                  <Grid size={{ xs: 12, sm: 4, md: 6 }}>
                    <CustomMuiSelect
                      label="Voucher"
                      name="voucher"
                      value={formData.voucher}
                      options={[
                        { value: "PS", description: "New Loans" },
                        { value: "RS", description: "Renewal" }
                      ]}
                      onChange={handleChange}
                      placeholder="Select"
                      valueKey="value"
                      labelKey="description"
                      // error={!!formErrors.voucher}
                      // helperText={formErrors.voucher} 
                      fullWidth
                      size="small"
                      required          
                    />

                  </Grid>

                  <Grid size={{ xs: 12, sm: 4, md: 6 }}>
                    <CustomMuiInput
                      label="Transaction Date"
                      type="date"
                      name="transactionDate"
                      value={formData.transactionDate}
                      onChange={handleChange}
                      size="small"
                      disabled
                    />

                  </Grid>

                  <Grid size={{ xs: 12, sm: 12, md: 12 }}>

                    {pawnticketSearch ?
                        <Autocomplete
                          key="pawn-search" 
                          options={pawnTickets?.data || []}
                          onChange={(event, newValue) => {
                            if (!newValue) return;
                            getPawntransactions(newValue, true)

                          }}
                          getOptionLabel={(option) => option.pawnticket}
                         

                          renderInput={(params) => (
                            <TextField 
                              {...params} 
                              label="Search by pawnticket" 
                              size="small"
                            />
                          )}
                        />
                      :

                      <Autocomplete
                        options={customers?.data || []}
                        key="customer-search" 
                        onChange={(event, newValue) => {
                          if (!newValue) return;
                          getPawntransactions(newValue, false);
                          
                        }}
                        getOptionLabel={(option) => option.custName}
                        filterOptions={(options, state) => {
                          const displayOptions = options.filter((item) =>
                            item.custName.toLowerCase().includes(state.inputValue.toLowerCase()) ||
                            item.controlNo.includes(state.inputValue)
                          );
                          return displayOptions;
                        }}

                        

                        renderInput={(params) => (
                          <TextField 
                            {...params} 
                            label="Search by name or code" 
                            size="small"
                          />
                        )}
                      />
                    }
                    
                    {/*<Autocomplete
                        key="pawn-search" 
                        options={pawnTickets?.data || []}
                        onChange={(event, newValue) => {
                          getPawntransactions(newValue, true)
                          console.log(newValue)

                        }}
                        getOptionLabel={(option) => option.pawnticket}
                        renderInput={(params) => (
                          <TextField 
                            {...params} 
                            label="Search by pawnticket" 
                            size="small"
                          />
                        )}
                    />*/}
                    
                    
                    <Stack
                      direction="row"
                      spacing={2}
                      sx={{
                        justifyContent: "flex-end",
                        alignItems: "center",
                      }}
                    >
                      <FormControlLabel 
                        control={
                          <Checkbox 
                            checked={pawnticketSearch} 
                            onChange={() => setPawnticketSearch(!pawnticketSearch)} 
                            color="primary"
                          />
                        } 
                        label="Pawnticket No ?" 
                      />
                    </Stack>
                  </Grid>
                </Grid>
              </Paper>

              <Paper 
                elevation={3} 
                sx={{ 
                    p: 2, 
                    mb: 2, 
                    maxHeight: '300px', 
                    overflow: 'auto'  
                  }}
              > 

                <TableContainer component={Paper} sx={{ borderRadius: 0, boxShadow: 'none', border: '1px solid #ccc' }}>
                  <Table sx={{ tableLayout: 'fixed', width: '100%' }}>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ ...headerStyle, width: '25px' }} />
                        <TableCell sx={{ ...headerStyle, width: '50%' }}>Date</TableCell>
                        <TableCell sx={{ ...headerStyle, width: '50%' }}>Pawnticket</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {pawnTransactions.map((item, index) => (
                        <TableRow 
                          key={index}
                          hover // Adds a background color change on hover
                          onClick={() => handleRowClick(item)} // The click handler
                          sx={{ 
                            cursor: 'pointer', // Changes cursor to a hand
                            '&:last-child td, &:last-child th': { borderBottom: 0 } 
                          }}
                        >
                          <TableCell sx={{ ...headerStyle, width: '25px' }}>▶</TableCell> 
                          <TableCell sx={{ ...cellStyle }}>{item.tDate}</TableCell>
                          <TableCell sx={{ ...cellStyle }}>{item.pawnticket}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer> 
                

              </Paper>

              <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
                


                 <Grid container spacing={1} columns={{ xs: 1, sm: 8, md: 12 }}>
                  <Grid size={{ xs: 12, sm: 12, md: 12 }} >
                    
                    <CustomMuiSelect
                      label="Diamond"
                      name="diamond"
                      value={formData.diamond}
                      options={[
                        { value: "01", description: "With Diamonds" },
                        { value: "00", description: "Without Diamonds" }
                      ]}
                      onChange={handleChange}
                      placeholder="Select"
                      valueKey="value"
                      labelKey="description"
                      fullWidth
                      size="small"
                      disabled={!isEditMode}
                    />

                  </Grid>

                  <Grid size={{ xs: 12, sm: 12, md: 12 }} >
                    {isEditMode ? (
                      <CustomMuiSelect
                        label="Diamond Shape"
                        name="diamondShape"
                        value={formData.diamondShape}
                        options={diamondShapeList?.data || []}
                        onChange={handleChange}
                        placeholder="Select"
                        valueKey="diamondShapeCode"
                        labelKey="diamondShapeDesc"
                        fullWidth
                        size="small"
                      />
                    ) : (
                      <CustomMuiInput
                        label="Diamond Shape"
                        type="text"
                        name="diamondShape"
                        value={diamondShapeList?.data?.find((val) => val.diamondShapeCode === formData.diamondShape)?.diamondShapeDesc || ""}
                        disabled
                        onChange={handleChange}
                        size="small"
                      />
                    )}

                  </Grid>

                  


                  <Grid size={{ xs: 12, sm: 4, md: 6 }} >

                    <CustomMuiInput
                      label="Diamond Size"
                      type="text"
                      name="diamondSize"
                      value={formData.diamondSize}
                      disabled={!isEditMode}
                      onChange={handleChange}
                      size="small"
                      align='right'
                    />
                    

                  </Grid>

                  <Grid size={{ xs: 12, sm: 4, md: 6 }} >
                    <CustomMuiInput
                      label="Diamond Price"
                      type="text"
                      name="diamondPrice"
                      value={formData.diamondPrice}
                      onChange={handleChange}
                      size="small"
                      align='right'
                      disabled={!isEditMode}
                    />

                  </Grid>



                </Grid>

              </Paper>


            </Grid>







            <Grid size={{ xs: 12, sm: 4, md: 8 }}>
              <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                  <Typography variant="subtitle2">
                    Details
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isEditMode}
                          disabled={!formData.ic}
                          onChange={(e) => setIsEditMode(e.target.checked)}
                          color="primary"
                          size="small"
                        />
                      }
                      label="Edit"
                    />
                    {isEditMode && (
                      <>
                        <Button
                          size="small"
                          variant="contained"
                          onClick={handleSave}
                          disabled={updateMutation.isPending}
                        >
                          {updateMutation.isPending ? 'Saving...' : 'Save'}
                        </Button>
                        <Button size="small" variant="outlined" onClick={() => setIsEditMode(false)}>
                          Cancel
                        </Button>
                      </>
                    )}
                  </Stack>
                </Stack>
                
                <Grid container spacing={1} columns={{ xs: 1, sm: 8, md: 12 }}>
                  <Grid size={{ xs: 12, sm: 4, md: 2 }} >
                    <CustomMuiInput
                      label="DocNum"
                      type="text"
                      name="docNum"
                      value={formData.docNum}
                      onChange={handleChange}
                      size="small"
                      disabled
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 4, md: 2 }} >
                    <CustomMuiInput
                      label="Pawnticket No"
                      type="text"
                      name="pawnticketNo"
                      value={formData.pawnticketNo}
                      onChange={handleChange}
                      size="small"
                      disabled
                    />

                  </Grid>

                  <Grid size={{ xs: 12, sm: 4, md: 2 }} >
                    <CustomMuiInput
                      label="Box No."
                      type="text"
                      name="boxNo"
                      value={formData.boxNo}
                      onChange={handleChange}
                      size="small"
                      disabled={!isEditMode}
                    />

                  </Grid>

                
                  <Grid size={{ xs: 12, sm: 4, md: 2 }} >
                    <CustomMuiInput
                      label="DLG"
                      type="date"
                      name="dlg"
                      value={convertToYYYYMMDD(formData.dlg)}
                      onChange={handleChange}
                      size="small"
                      disabled={!isEditMode}
                    />

                  </Grid>

                  <Grid size={{ xs: 12, sm: 4, md: 2 }} >
                    <CustomMuiInput
                      label="Expipry Date"
                      type="date"
                      name="expDate"
                      value={convertToYYYYMMDD(formData.expDate)}
                      onChange={handleChange}
                      size="small"
                      disabled={!isEditMode}
                    />

                  </Grid>


                  <Grid size={{ xs: 12, sm: 4, md: 2 }} >
                    <CustomMuiInput
                      label="Status"
                      type="text"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      size="small"
                      disabled
                    />

                  </Grid>

                  <Grid size={{ xs: 12, sm: 4, md: 6 }} >
                    <CustomMuiInput
                      label="Pawner"
                      type="text"
                      name="pawner"
                      value={
                        customers?.data?.find((cust) => cust.controlNo === formData.pawner)?.custName || ""
                      }
                      onChange={handleChange}
                      size="small"
                      disabled
                    />

                  </Grid>

                  <Grid size={{ xs: 12, sm: 4, md: 3 }} >
                    <CustomMuiInput
                      label="Principal Amount"
                      type="text"
                      name="principalAmount"
                      value={formData.principalAmount}
                      onChange={handleChange}
                      size="small"
                      disabled={!isEditMode}
                    />

                  </Grid>

                  <Grid size={{ xs: 12, sm: 4, md: 3 }} >
                    <CustomMuiInput
                      label="Interest Amount"
                      type="text"
                      name="interestAmount"
                      value={formData.interestAmount}
                      onChange={handleChange}
                      size="small"
                      disabled
                    />

                  </Grid>

                  <Grid size={{ xs: 12, sm: 4, md: 6 }} >
                    <CustomMuiInput
                      label="Appraiser's Name"
                      type="text"
                      name="appraiser"
                      value={formData.appraiser}
                      onChange={handleChange}
                      size="small"
                      disabled={!isEditMode}
                    />

                  </Grid>

                  <Grid size={{ xs: 12, sm: 4, md: 6 }} >
                    <CustomMuiInput
                      label="Remarks"
                      type="text"
                      name="remarks"
                      value={formData.remarks}
                      onChange={handleChange}
                      size="small"
                      disabled={!isEditMode}
                    />

                  </Grid>


                </Grid>

              </Paper>

              <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
      

                <TableContainer component={Paper} sx={{ borderRadius: 0, boxShadow: 'none', border: '1px solid #ccc' }}>
                  <Table sx={{ tableLayout: 'fixed', width: '100%' }}>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ ...headerStyle, width: '25px' }} />
                        <TableCell sx={{ ...headerStyle, width: '40%' }}>Description</TableCell>
                        <TableCell sx={{ ...headerStyle, width: '15%' }}>Made</TableCell>
                        <TableCell sx={{ ...headerStyle, width: '8%' }}>K</TableCell>
                        <TableCell sx={{ ...headerStyle, width: '12%' }}>G</TableCell>
                        <TableCell sx={{ ...headerStyle, width: '10%' }}>Int. Rate</TableCell>
                        <TableCell sx={{ ...headerStyle, width: '15%', borderRight: 0 }}>Amount</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {items.map((item, index) => (

                        <TableRow sx={{ '&:last-child td, &:last-child th': { borderBottom: 0 } }} key={index}>
                          <TableCell sx={{ ...headerStyle, width: '25px' }}>▶</TableCell>
                          <TableCell sx={{ ...cellStyle }}>
                            {itemList?.data?.find((val) => val.itemCode === item.itemCode)?.itemDesc || ""}
                          </TableCell>
                          <TableCell sx={{ ...cellStyle }}>
                            {madeList?.data?.find((val) => val.madeCode === item.madeCode)?.madeDesc || ""}

                          </TableCell>
                          <TableCell sx={{ ...cellStyle }}>
                            {karatList?.data?.find((val) => val.karatCode === item.karatCode)?.karatDesc || ""}

                          </TableCell>
                          <TableCell sx={{ ...blueDataStyle }}>{item.weight}</TableCell>
                          <TableCell sx={{ ...blueDataStyle }}>{item.intrate}</TableCell>
                          <TableCell sx={{ ...blueDataStyle, borderRight: 0 }}>{item.cAmount}</TableCell>
                        </TableRow>
                      ))}

                    </TableBody>
                  </Table>
                </TableContainer> 

               
                

              </Paper>

              <Grid container spacing={{ xs: 1, md: 2 }} columns={{ xs: 1, sm: 8, md: 12 }}>

                <Grid size={{ xs: 1, sm: 4, md: 8 }}>
                  <Paper elevation={3} sx={{ p: 2, mb: 2 }}>

                    <Grid container spacing={1} columns={{ xs: 1, sm: 8, md: 12 }}>
                      <Grid size={{ xs: 12, sm: 4, md: 6 }} >
                        {isEditMode ? (
                          <CustomMuiSelect
                            label="Item"
                            name="item"
                            value={formData.item}
                            options={itemList?.data || []}
                            onChange={handleChange}
                            placeholder="Select"
                            valueKey="itemCode"
                            labelKey="itemDesc"
                            fullWidth
                            size="small"
                          />
                        ) : (
                          <CustomMuiInput
                            label="Item"
                            type="text"
                            name="item"
                            value={itemList?.data?.find((val) => val.itemCode === formData.item)?.itemDesc || ""}
                            onChange={handleChange}
                            size="small"
                            disabled
                          />
                        )}
                      </Grid>

                      <Grid size={{ xs: 12, sm: 4, md: 6 }} >
                        {isEditMode ? (
                          <CustomMuiSelect
                            label="Color"
                            name="color"
                            value={formData.color}
                            options={colorList?.data || []}
                            onChange={handleChange}
                            placeholder="Select"
                            valueKey="colorCode"
                            labelKey="colorDesc"
                            fullWidth
                            size="small"
                          />
                        ) : (
                          <CustomMuiInput
                            label="Color"
                            type="text"
                            name="color"
                            value={colorList?.data?.find((val) => val.colorCode === formData.color)?.colorDesc || ""}
                            disabled
                            onChange={handleChange}
                            size="small"
                          />
                        )}

                      </Grid>

                      

                    
                      <Grid size={{ xs: 12, sm: 4, md: 6 }} >
                        {isEditMode ? (
                          <CustomMuiSelect
                            label="Condition"
                            name="condition"
                            value={formData.condition}
                            options={conditionList?.data || []}
                            onChange={handleChange}
                            placeholder="Select"
                            valueKey="conditionCode"
                            labelKey="conditionDesc"
                            fullWidth
                            size="small"
                          />
                        ) : (
                          <CustomMuiInput
                            label="Condition"
                            type="text"
                            name="condition"
                            value={conditionList?.data?.find((val) => val.conditionCode === formData.condition)?.conditionDesc || ""}
                            onChange={handleChange}
                            size="small"
                            disabled
                          />
                        )}


                      </Grid>

                      <Grid size={{ xs: 12, sm: 4, md: 6 }} >
                        {isEditMode ? (
                          <CustomMuiSelect
                            label="Karat"
                            name="karat"
                            value={formData.karat}
                            options={karatList?.data || []}
                            onChange={handleChange}
                            placeholder="Select"
                            valueKey="karatCode"
                            labelKey="karatDesc"
                            fullWidth
                            size="small"
                          />
                        ) : (
                          <CustomMuiInput
                            label="Karat"
                            type="text"
                            name="karat"
                            value={karatList?.data?.find((val) => val.karatCode === formData.karat)?.karatDesc || ""}
                            onChange={handleChange}
                            size="small"
                            disabled
                          />
                        )}

                      </Grid>

                      <Grid size={{ xs: 12, sm: 4, md: 6 }} >
                        {isEditMode ? (
                          <CustomMuiSelect
                            label="Birthstone"
                            name="birthstone"
                            value={formData.birthstone}
                            options={brightStoneList?.data || []}
                            onChange={handleChange}
                            placeholder="Select"
                            valueKey="birthStoneCode"
                            labelKey="birthStoneDesc"
                            fullWidth
                            size="small"
                          />
                        ) : (
                          <CustomMuiInput
                            label="Birthstone"
                            type="text"
                            name="birthstone"
                            value={brightStoneList?.data?.find((val) => val.birthStoneCode === formData.birthstone)?.birthStoneDesc || ""}
                            onChange={handleChange}
                            size="small"
                            disabled
                          />
                        )}

                      </Grid>


                      <Grid size={{ xs: 12, sm: 4, md: 3 }} >
                        <CustomMuiInput
                          label="BS Weight"
                          type="text"
                          name="birthstoneWeight"
                          value={formData.birthstoneWeight}
                          onChange={handleChange}
                          size="small"
                          disabled={!isEditMode}
                          align='right'
                        />

                      </Grid>

                      <Grid size={{ xs: 12, sm: 4, md: 3 }} >
                        <CustomMuiInput
                          label="BS PCs"
                          type="text"
                          name="birthstonePcs"
                          value={formData.birthstonePcs}
                          onChange={handleChange}
                          size="small"
                          disabled={!isEditMode}
                          align='right'
                        />

                      </Grid>



                    </Grid>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 1, sm: 4, md: 4 }}>
                  <Paper elevation={3} sx={{ p: 2, mb: 2 }}> 

                    <Stack
                      direction="column"
                      spacing={1}
                      sx={{
                        justifyContent: "flex-start",
                        alignItems: "center",
                      }}
                    >
                      <CustomMuiInput
                        label="Motor No."
                        type="text"
                        name="motorNo"
                        value={formData.motorNo}
                        onChange={handleChange}
                        size="small"
                        disabled={!isEditMode}
                      />

                      <CustomMuiInput
                        label="Chasis No."
                        type="text"
                        name="chasisNo"
                        value={formData.chasisNo}
                        onChange={handleChange}
                        size="small"
                        disabled={!isEditMode}
                      />


                      <CustomMuiInput
                        label="Serial No."
                        type="text"
                        name="serialNo"
                        value={formData.serialNo}
                        onChange={handleChange}
                        size="small"
                        disabled={!isEditMode}
                      />

                    </Stack>

                  </Paper>
                </Grid>
              </Grid>

            </Grid>
        </Grid>

        


    </Container>

  );
};


const cellStyle = {
  padding: '2px 4px', // Minimal padding for high density
  fontSize: '0.75rem', // ~12px
  borderRight: '1px solid #ccc',
  borderBottom: '1px solid #ccc',
  height: '24px',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
};

const headerStyle = {
  ...cellStyle,
  backgroundColor: '#D6EAF8',
  color: '#333',
  fontWeight: 500,
  textAlign: 'center'
};

const blueDataStyle = {
  ...cellStyle,
  backgroundColor: '#0078D7',
  color: 'white',
  textAlign: 'right'
};


export default SearchTransaction;

