import React, { useEffect, useMemo, useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Box, 
  Stack, 
  Button,
  Paper,
  TextField,
  Grid
} from '@mui/material';

import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { addMonths, addDays, format, isValid } from 'date-fns';

import CustomMuiSelect from '../../../CustomMuiComponents/CustomMuiSelect';
import CustomMuiInput from '../../../CustomMuiComponents/CustomMuiInput';

import { useCustomersQuery } from '../../../Hooks/useTransactionQueries';
import { 
  useListCategory,
  useDiamondShape,
  useColors,
  useItems,
  useConditions,
  useBirthStone,
  useKarats,
  useMade,
  useBirthStoneColor,
  useTermSetup
} from '../../../Hooks/useEntriesQueries';


import { useLoanItemSetup, useLoanTermSetup } from '../../../Hooks/useUtilityQueries';

import { UserSession } from "../../../Functions/UtilityFunctions";
import StringHost from "../../../Functions/ConnectionString";


const addItemSchema = z.object({
  loanType: z.string().min(1, "Loan Type is required").default(''),
  item: z.string().min(1, "Item is required").default(''),
  boxNumber: z.string().default(''),
  principalAmount: z.string()
    .min(1, "Principal amount is required")
    .regex(/^\d*\.?\d*$/, "Invalid decimal format")
    .default(''),
  interestPercent: z.string().default(''),
  remarks: z.string().min(1, "Remarks is required").default(''),
  hasDiamonds: z.boolean().default(false),
  interestType: z.boolean().default(false),
  diamondShape: z.string().default(''),
  diamondSize: z.string().default(''),
  diamondPrice: z.string().default(''),
  color: z.string().min(1, "Color is required").default(''),
  condition: z.string().min(1, "Condition is required").default(''),
  karat: z.string().default(''),
  birthstone: z.string().default(''),
  birthstoneWeight: z.string()
    .regex(/^\d*\.?\d*$/, "Invalid decimal format")
    .default(''),
  birthstonePcs: z.string()
    .regex(/^\d*\.?\d*$/, "Invalid decimal format")
    .default(''),
  made: z.string().min(1, "Made is required").default(''),
  weight: z.string().default(''),
  motorNo: z.string().default(''),
  chassisNo: z.string().default(''),
  serialNo: z.string().default(''),
});


const saveItemsSchema = z.object({
  ptNumber: z.string().min(1, "Pawn Ticket No. is required").default(''),
  dlgDate: z.string().default(() => new Date().toISOString().split('T')[0]),
  maturityDate: z.string().default(''),
  expiryDate: z.string().min(1, "Expiry date is required").default(''),
  pawner: z.string().min(1, "Pawner is required").default(''),
  boxNumber:  z.string().min(1, "Box No. is required").default(''),
  totalPrincipalAmount: z.string().default(''),
  totalInterestValue: z.string().default('')
});


const diamondStatusLabels = [
      {
        value: true, 
        description: "With diamonds"
      },
      {
        value: false, 
        description: "Without diamonds"
      }
];


const interestTypeStatusLabels = [
      {
        value: true, 
        description: "With Advance Interest"
      },
      {
        value: false, 
        description: "Without Advance Interest"
      }
];


const getAverageGram = (principalAmount, weight) => {
  if (!principalAmount || !weight || parseFloat(weight) === 0) {
    return "0.00"; 
  }
  const averageGram = parseFloat(principalAmount) / parseFloat(weight);
  return averageGram.toFixed(2);
};



const GetSilverRange = async (amount) => {
  try {
    const response = await axios.get(`${StringHost()}/API/SCPWEBAPI/ClsGetSilverRange?amount=${amount}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error in GetSilverRange:",
      error.response?.data || error.message
    );
    throw error;
  }
};



const NewRenewal = () => {
  const { CNCode } = UserSession();
  const { data: pawners } = useCustomersQuery(CNCode);
  const { data: termSetup } = useTermSetup();
  

  
  const categories = useListCategory();
  const diamondShapes = useDiamondShape(CNCode);
  const colors = useColors(CNCode);
  const items = useItems(CNCode);
  const conditions = useConditions(CNCode);
  const birthstones = useBirthStone(CNCode);
  const karats = useKarats(CNCode);
  const mades = useMade(CNCode);
  //const birthstoneColor = useBirthStoneColor(CNCode);

  const [addedItems, setAddedItems] = useState([]);
  //const [totalPrincipalAmount, setTotalPrincipalAmount] = useState("");
  

  const expirationTerm = termSetup?.termExpiration;
  const auctionTerm = termSetup?.termAuction;
  const maturityTerm = termSetup?.termMaturity;

  const { 
    handleSubmit: handleAddItem, 
    control: controlAddItem, 
    formState: { errors: errorsAddItem },
    reset: resetAddItem,
    watch: watchAddItem,
    setValue: setValueAddItem
  } = useForm({
    resolver: zodResolver(addItemSchema),
    defaultValues: addItemSchema.parse({})
  });


  const { 
    handleSubmit: handleSaveItems, 
    control: controlSaveItems, 
    formState: { errors: errorsSaveItems },
    reset: resetSaveItems,
    watch: watchSaveItems,
    setValue: setValueSaveItems
  } = useForm({
    resolver: zodResolver(saveItemsSchema),
    defaultValues: saveItemsSchema.parse({})
  });


  const dlgDate = watchSaveItems('dlgDate');
  const selectedCategory = watchAddItem('loanType');
  const interestTypeValue = watchAddItem('interestType');
  const hasDiamondValue = watchAddItem('hasDiamonds');
  

  const { data: loanItemSetup } = useLoanItemSetup(watchAddItem('loanType'));


  const filteredItems = useMemo(() => {
    if (!selectedCategory || !items.data) return [];
    return items.data.filter(item => item.catCode === selectedCategory);
  }, [items.data, selectedCategory]);


  useEffect(() => {
    if (selectedCategory) {
      setValueAddItem("motorNo", "");
      setValueAddItem("chassisNo", "");
      setValueAddItem("serialNo", "");
      setValueAddItem("diamondShape", "");
      setValueAddItem("diamondSize", "");
      setValueAddItem("diamondPrice", "");
      setValueAddItem("hasDiamonds", false);
    }
  }, [selectedCategory, setValueAddItem]);


  useEffect(() => {
    const baseDate = new Date(dlgDate);
    if (!isValid(baseDate)) return;

    const mTerm = Number(maturityTerm) || 0;
    const eTerm = Number(expirationTerm) || 0;
    

    if (interestTypeValue) {
      const maturityDate = addMonths(baseDate, mTerm);
      const expiryDate = addDays(addMonths(maturityDate, eTerm), -1);
      setValueSaveItems("maturityDate", format(maturityDate, "yyyy-MM-dd"));
      setValueSaveItems("expiryDate", format(expiryDate, "yyyy-MM-dd"));
    } else {
      const expiryDate = addDays(addMonths(baseDate, eTerm), -1);
      setValueSaveItems("maturityDate", "");
      setValueSaveItems("expiryDate", format(expiryDate, "yyyy-MM-dd"));
    }
  }, [interestTypeValue, dlgDate, maturityTerm, expirationTerm, setValueSaveItems]);

  const onAddItem = (data) => { //add item
    const allowedKeys = [
      "item", "principalAmount", "interestPercent", "diamondShape", 
      "diamondSize", "diamondPrice", "color", "condition", "karat", 
      "birthstone", "birthstoneWeight", "birthstonePcs", "made", 
      "weight", "motorNo", "chassisNo", "serialNo"
    ];

    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([key]) => allowedKeys.includes(key))
    );

    console.log(filteredData);

    setAddedItems((prevItems) => {
      const newItems = [...prevItems, filteredData];
      computePrincipalInterest(newItems);
      
      return newItems;
    });

    
    //reset();
  };

  const onSaved = (data) => {
    console.log(data);
    //console.log(UserInfo);
    console.log(addedItems)

    //reset();
  };



  const computePrincipalInterest = async (currentItems = addedItems) => {
      
      const totalPrincipal = currentItems.reduce((sum, item) => {
          return sum + (parseFloat(item.principalAmount) || 0);
      }, 0);
   

      // Update the UI/State for Total Principal
      // C#: txtTotalCAmount.Text = sum.ToString("n2")
      //setTotalPrincipalAmount(totalPrincipal.toFixed(2));
      console.log(totalPrincipal.toFixed(2));

      setValueSaveItems("totalPrincipalAmount", totalPrincipal.toFixed(2))

      let currentInterestPercent = parseFloat(watchAddItem('interestPercent')) || 0;

      // 3. Silver Change Rate Logic
      // C#: if (cboTOLPawn.SelectedValue == "003")
      if (watchAddItem('loanType') === "003") {
          // Logic for ClsGetSilverRange(totalPrincipal)
          const silverRate = await GetSilverRange(totalPrincipal); 
          currentInterestPercent = silverRate;
          
          // Update items in the list to the new interest rate
          const updatedItems = addedItems.map(item => ({
              ...item,
              interestPercent: silverRate.toString()
          }));
          setAddedItems(updatedItems);
      }

      // 4. Calculate Interest Value
      let totalInterest = 0;

      // Note: The C# code has a loop that overwrites txtInterestPawn.Text repeatedly.
      // Usually, you want to sum these or calculate based on the total.
      // Logic: (Principal * (Term + 1 or 0) * (Rate / 100))
      
      const isAdvanceInterest = watchAddItem('interestType');
      const multiplier = isAdvanceInterest ? (expirationTerm + 1) : expirationTerm;

      // If interest is uniform across items (typical):
      totalInterest = totalPrincipal * multiplier * (currentInterestPercent / 100);

      console.log(totalInterest)
      console.log(totalPrincipal)
      console.log(multiplier)
      console.log(currentInterestPercent)

      console.log(isAdvanceInterest)
      console.log(expirationTerm)


      //console.log(totalInterest.toFixed(2))
      setValueSaveItems("totalInterestValue", totalInterest.toFixed(2))


  };



  


/*

  useEffect(() => {
      console.log(termSetup);

  }, [termSetup]);
*/


  useEffect(() => {
    if (loanItemSetup) {
      const formattedRate = loanItemSetup.interestRate.toFixed(2);
      console.log(formattedRate)
      resetAddItem({
        ...watchAddItem(),
        interestPercent: formattedRate
      });
      //setValue("interestPercent", formattedRate)
    }
  }, [loanItemSetup, setValueAddItem]);


  return (

    <Box sx={{ flexGrow: 1, p: 0 }}>
       
        <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 1, fontWeight: 'bold', position: 'sticky', top: 0, zIndex: 10 }}>
            New Renewal
        </Box>


        
        <Box component="form" onSubmit={handleAddItem(onAddItem)} sx={{ p: 2 }} noValidate>
        <Grid container spacing={2}>
        
          <Grid size={{ xs: 12 }}>
            <Paper sx={{ p: 2 }} variant="outlined">
              <Grid container spacing={2} size={12}>
                  <Grid size={{ xs: 12, md: 2.4 }}>
                    <Controller
                      name="ptNumber"
                      control={controlSaveItems}
                      render={({ field }) => (
                          <CustomMuiInput
                            {...field}
                            label="Pawn Ticket No."
                            size="small"
                            error={!!errorsSaveItems.ptNumber}
                            helperText={errorsSaveItems.ptNumber?.message}
                            /* disabled={!editPtNo} */
                            
                          />
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 2.4 }}>
                    <Controller
                      name="boxNumber"
                      control={controlSaveItems}
                      render={({ field }) => (
                          <CustomMuiInput
                            {...field}
                            label="Box No."
                            size="small"
                            error={!!errorsSaveItems.boxNumber}
                            helperText={errorsSaveItems.boxNumber?.message}
                            /* disabled={!editBoxNo} */
                            
                          />
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 2.4 }}>
                    <Controller
                      name="dlgDate"
                      control={controlSaveItems}
                      render={({ field }) => (
                          <CustomMuiInput
                            {...field}
                            label="DLG Date"
                            size="small"
                            type='date'
                            
                            
                          />
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 2.4 }}>
                    <Controller
                      name="maturityDate"
                      control={controlSaveItems}
                      render={({ field }) => (
                          <CustomMuiInput
                            {...field}
                            label="Maturity Date"
                            size="small"
                            type='date'
                            disabled
                            
                          />
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 2.4 }}>
                    <Controller
                      name="expiryDate"
                      control={controlSaveItems}
                      render={({ field }) => (
                          <CustomMuiInput
                            {...field}
                            label="Expiry Date"
                            size="small"
                            type='date'
                            error={!!errorsSaveItems.expiryDate}
                            helperText={errorsSaveItems.expiryDate?.message}
                            disabled
                            
                          />
                      )}
                    />
                  </Grid>
                  
                </Grid>
              </Paper>
            </Grid>

      
      


        <Grid size={{ xs: 12, md: 3 }}>
          <Paper sx={{ p: 2 }} variant="outlined">
            <Stack spacing={2}>
              <Controller
                name="pawner"
                control={controlSaveItems}
                render={({ field }) => (
                  <CustomMuiSelect 
                      {...field}
                      label="Pawner."
                      options={pawners || []}
                      valueKey="controlNo" 
                      labelKey="custName"   
                      size="small"
                      error={!!errorsSaveItems.pawner}
                      helperText={errorsSaveItems.pawner?.message}

                  />
                )}
              />


              <Controller
                name="loanType"
                control={controlAddItem}
                render={({ field }) => (

                  <CustomMuiSelect 
                      {...field}
                      label="Type of Loan"
                      options={categories.data || []}
                      valueKey="catCode" 
                      labelKey="catDesc"   
                      size="small"
                      error={!!errorsAddItem.loanType}
                      helperText={errorsAddItem.loanType?.message}

                  />
                )}
              />

              <Controller
                name="hasDiamonds"
                control={controlAddItem}
                render={({ field }) => (
                  <CustomMuiSelect 
                      {...field}
                      label="Diamonds"
                      options={diamondStatusLabels}
                      valueKey="value" 
                      labelKey="description"   
                      size="small"
                      disabled={selectedCategory !== "001"}
                  />

                )}
              />

              <Controller
                name="diamondShape"
                control={controlAddItem}
                render={({ field }) => (
                  <CustomMuiSelect 
                      {...field}
                      label="Diamonds Shape"
                      options={diamondShapes.data || []}
                      valueKey="diamondShapeCode" 
                      labelKey="diamondShapeDesc"   
                      size="small"
                      disabled={!hasDiamondValue}
                      
                  />
                )}
              />

              <Controller
                name="diamondSize"
                control={controlAddItem}
                render={({ field }) => (
                  <CustomMuiInput
                    {...field}
                    label="Diamond Size"
                    size="small"
                    /*error={!!errors.diamondSize}
                    helperText={errors.diamondSize?.message}*/
                    
                    disabled={!hasDiamondValue}
                  />
                )}
              />


              <Controller
                name="diamondPrice"
                control={controlAddItem}
                render={({ field }) => (
                  <CustomMuiInput
                    {...field}
                    label="Diamond Price"
                    size="small"
                    /*error={!!errors.diamondPrice}
                    helperText={errors.diamondPrice?.message}*/
                    
                    disabled={!hasDiamondValue}
                    prefix="₱"          
                    align="right"    
                  />
                )}
              />



              <Controller
                name="interestType"
                control={controlAddItem}
                render={({ field }) => (
                  <CustomMuiSelect 
                      {...field}
                      label="Type of Interest"
                      options={interestTypeStatusLabels}
                      valueKey="value" 
                      labelKey="description"   
                      size="small"

                  />
                )}
              />


            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Paper sx={{ p: 2 }} variant="outlined">
            <Stack spacing={2}>
              <Controller
                name="item"
                control={controlAddItem}
                render={({ field }) => (
                  <CustomMuiSelect 
                    {...field}
                    label="Items"
                    options={filteredItems || []}
                    valueKey="itemCode" 
                    labelKey="itemDesc"   
                    error={!!errorsAddItem.item}
                    helperText={errorsAddItem.item?.message}
                    size="small"
                  />

                )}
              />


              <Controller
                name="color"
                control={controlAddItem}
                render={({ field }) => (
                  <CustomMuiSelect 
                    {...field}
                    label="Color"
                    options={colors.data || []}
                    valueKey="colorCode" 
                    labelKey="colorDesc"   
                    size="small"
                    error={!!errorsAddItem.color}
                    helperText={errorsAddItem.color?.message}
                  />

                )}
              />


              <Controller
                name="condition"
                control={controlAddItem}
                render={({ field }) => (
                  <CustomMuiSelect 
                    {...field}
                    label="Condition"
                    options={conditions.data || []}
                    valueKey="conditionCode" 
                    labelKey="conditionDesc"   
                    size="small"
                    error={!!errorsAddItem.condition}
                    helperText={errorsAddItem.condition?.message}
                  />
                )}
              />


              <Controller
                name="karat"
                control={controlAddItem}
                render={({ field }) => (
                  <CustomMuiSelect 
                    {...field}
                    label="karat"
                    options={karats.data || []}
                    valueKey="karatCode" 
                    labelKey="karatDesc"   
                    size="small"
                  />
                )}
              />



              <Controller
                name="birthstone"
                control={controlAddItem}
                render={({ field }) => (
                  <CustomMuiSelect 
                    {...field}
                    label="Birthstone"
                    options={birthstones.data || []}
                    valueKey="birthStoneCode" 
                    labelKey="birthStoneDesc"   
                    size="small"
                  />

                )}
              />


              <Controller
                name="birthstoneWeight"
                control={controlAddItem}
                render={({ field }) => (
                  <CustomMuiInput
                    {...field}
                    label="Birthstone Weight"
                    size="small"
                    error={!!errorsAddItem.birthstoneWeight}
                    helperText={errorsAddItem.birthstoneWeight?.message}
                    
                    suffix="kg"
                  />
                )}
              />

              <Controller
                name="birthstonePcs"
                control={controlAddItem}
                render={({ field }) => (
                  <CustomMuiInput
                    {...field}
                    label="Birthstone Pcs"
                    size="small"
                    error={!!errorsAddItem.birthstonePcs}
                    helperText={errorsAddItem.birthstonePcs?.message}
                    
                  />
                )}
              />





            </Stack>
          </Paper>
        </Grid>


        <Grid size={{ xs: 12, md: 3 }}>
          <Paper sx={{ p: 2 }} variant="outlined">
            <Stack spacing={2}>
              
              <Controller
                name="made"
                control={controlAddItem}
                render={({ field }) => (
                  <CustomMuiSelect 
                    {...field}
                    label="Made"
                    options={mades.data || []}
                    valueKey="madeCode" 
                    labelKey="madeDesc"   
                    size="small"
                    error={!!errorsAddItem.made}
                    helperText={errorsAddItem.made?.message}
                  />

                )}
              />

              <Controller
                name="weight"
                control={controlAddItem}
                render={({ field }) => (
                  <CustomMuiInput
                    {...field}
                    label="Weight"
                    size="small"
                    error={!!errorsAddItem.weight}
                    helperText={errorsAddItem.weight?.message}
                    
                    suffix="kg"
                  />
                )}
              />



            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Paper sx={{ p: 2 }} variant="outlined">
            <Stack spacing={2}>
              
              <Controller
                name="motorNo"
                control={controlAddItem}
                render={({ field }) => (
                  <CustomMuiInput
                    {...field}
                    label="Motor No."
                    size="small"
                    error={!!errorsAddItem.motorNo}
                    helperText={errorsAddItem.motorNo?.message}
                    
                    disabled={!["007", "004"].includes(selectedCategory)}
                  />
                )}
              />

              <Controller
                name="chassisNo"
                control={controlAddItem}
                render={({ field }) => (
                  <CustomMuiInput
                    {...field}
                    label="Chassis No."
                    size="small"
                    error={!!errorsAddItem.chassisNo}
                    disabled={!["007"].includes(selectedCategory)}
                    helperText={errorsAddItem.chassisNo?.message}
                    
                  />
                )}
              />


              <Controller
                name="serialNo"
                control={controlAddItem}
                render={({ field }) => (
                  <CustomMuiInput
                    {...field}
                    label="Serial No"
                    size="small"
                    error={!!errorsAddItem.serialNo}
                    helperText={errorsAddItem.serialNo?.message}
                    
                    disabled={!["007", "005", "004", "006", "008"].includes(selectedCategory)}
                  />
                )}
              />



            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={{ p: 2, height: '100%' }} variant="outlined">
              <Grid container spacing={2}>
                  <Grid size={{ xs: 12,  md: 6 }}>
                    <Controller
                      name="principalAmount"
                      control={controlAddItem}
                      render={({ field }) => (
                          <CustomMuiInput
                            {...field}
                            label="Principal Amount"
                            size="small"
                            error={!!errorsAddItem.principalAmount}
                            helperText={errorsAddItem.principalAmount?.message}
                            /* disabled={!editBoxNo} */
                            prefix="₱"          
                            align="right"
                            
                          />
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 12,  md: 6 }}>
                    <Controller
                      name="interestPercent"
                      control={controlAddItem}
                      render={({ field }) => (
                          <CustomMuiInput
                            {...field}
                            label="Interest"
                            size="small"
                            error={!!errorsAddItem.interestPercent}
                            helperText={errorsAddItem.interestPercent?.message}
                            suffix="%"          
                            align="right"
                            disabled
                          />
                      )}
                    />
                  </Grid>

                  <Grid size={{ xs: 12,  md: 6 }}>
                    <Controller
                      name="totalPrincipalAmount"
                      control={controlSaveItems}
                      render={({ field }) => (
                          <CustomMuiInput
                            {...field}
                            label="Total Principal Amount"
                            size="small"
                            error={!!errorsSaveItems.totalPrincipalAmount}
                            helperText={errorsSaveItems.totalPrincipalAmount?.message}
                            prefix="₱"          
                            align="right"
                            disabled
                          />
                      )}
                    />
                  </Grid>

                  <Grid size={{ xs: 12,  md: 6 }}>
                    <Controller
                      name="totalInterestValue"
                      control={controlSaveItems}
                      render={({ field }) => (
                          <CustomMuiInput
                            {...field}
                            label="Total Interest Value"
                            size="small"
                            error={!!errorsSaveItems.totalInterestValue}
                            helperText={errorsSaveItems.totalInterestValue?.message}
                            prefix="₱"          
                            align="right"      
                            /* disabled={!editBoxNo} */
                            
                            disabled
                          />
                      )}
                    />
                  </Grid>
                  
                  <Grid size={12}>
                    <Controller
                      name="remarks"
                      control={controlAddItem}
                      render={({ field }) => (
                          <TextField
                            {...field}
                            label="Remarks"
                            size="small"
                            multiline
                            minRows={2}
                            maxRows={4}
                            error={!!errorsAddItem.remarks}
                            helperText={errorsAddItem.remarks?.message}
                            sx={{ width: '100%' }}
                          />
                      )}
                    />
                  </Grid>
              </Grid>
            </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
            
          <TableContainer component={Paper} variant="outlined" sx={{ height: '100%' }}>
            <Table size="small" aria-label="super dense table">
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  
                    <TableCell sx={{ ...cellStyle, fontWeight: 'bold' }}>
                      Item
                    </TableCell>
                    <TableCell sx={{ ...cellStyle, fontWeight: 'bold' }}>
                      Made
                    </TableCell>
                    <TableCell sx={{ ...cellStyle, fontWeight: 'bold' }}>
                      Color
                    </TableCell>
                    <TableCell sx={{ ...cellStyle, fontWeight: 'bold' }}>
                      Condition
                    </TableCell>
                    <TableCell sx={{ ...cellStyle, fontWeight: 'bold' }} align='right'>
                      Interest Rate
                    </TableCell>
                    <TableCell sx={{ ...cellStyle, fontWeight: 'bold' }} align='right'>
                      Principal Amount
                    </TableCell>
                    <TableCell sx={{ ...cellStyle, fontWeight: 'bold' }} align='right'>
                      AV/Gram
                    </TableCell>
               


                </TableRow>
              </TableHead>
              <TableBody>
                {addedItems.map((item, index) => (
                  <TableRow key={index} hover>
                    <TableCell sx={cellStyle}>
                      {items.data.find(i => i.itemCode === item.item)?.itemDesc || "Description not found"}
                    </TableCell>
                    <TableCell sx={cellStyle}>
                      {mades.data.find(i => i.madeCode === item.made)?.madeDesc || "Description not found"}
                    </TableCell>
                    <TableCell sx={cellStyle}>
                      {colors.data.find(i => i.colorCode === item.color)?.colorDesc || "Description not found"}
                    </TableCell>
                    <TableCell sx={cellStyle}>
                      {conditions.data.find(i => i.conditionCode === item.condition)?.conditionDesc || "Description not found"}
                    </TableCell>
                    <TableCell sx={cellStyle} align='right'>{item.interestPercent}%</TableCell>
                    <TableCell sx={cellStyle} align='right'>&#8369;{item.principalAmount}</TableCell>
                    <TableCell sx={cellStyle} align='right'>{getAverageGram(item.principalAmount, item.weight)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>  
        </Grid>

         
    

      </Grid>

       

      
      <Stack
        direction="row"
        spacing={1}
        sx={{
          justifyContent: "flex-end",
          alignItems: "center",
          mt: 1,
          width: '100%'
        }}
      >

        <Button variant="contained" type="submit">
          Add Item
        </Button>
        <Button /* disabled={addedItems.length === 0} */ onClick={handleSaveItems(onSaved)} variant="contained" type="button" color="secondary">
          Save Renewal
        </Button>
      </Stack>
      </Box>
    </Box>

  );
};

const cellStyle = { 
    fontSize: 11, 
    padding: '4px 8px', // Reducing padding for "super dense" feel
    lineHeight: '1.2rem'
  };


export default NewRenewal;