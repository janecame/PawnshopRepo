import React, { useEffect, useState } from "react";
import { UserSession } from "../Functions/UtilityFunctions";
import { AutoNumAll } from "../API/AutoNum";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

import {
  useListCategory,
  useColors,
  useDiamondShape,
  useItems,
  useConditions,
  useBirthStone,
  useKarats,
  useMade,
  useBirthStoneColor,
  useTitus,
  useBrands,
  useModels
} from '../Hooks/useEntriesQueries';

import { useSnackbar } from '../contexts/SnackbarContext';

import {
  InsertBirthStone,
  InsertBirthStoneColor,
  InsertBrand,
  InsertColors,
  InsertDiamondShape,
  InsertItems,
  InsertKarat,
  InsertMade,
  InsertModel,
  InsertTitus,
  InsertCondition
} from "../API/Insert";

import {
  UpdateBirthStone,
  UpdateBirthStoneColor,
  UpdateBrand,
  UpdateColor,
  UpdateDiamond,
  UpdateItem,
  UpdateKarat,
  UpdateMade,
  UpdateModel,
  UpdateTitus,
  UpdateCondition
} from "../API/Update";


const defaultEntryForm = {
  title: "",
  name: "",
  columnCode: "",
  tbl: "",
  add: null
};

const entries = [
  {
    name: "color",
    code: "colorCode",
    description: "colorDesc",
    category: "catCode",
    subDescription: "colorDescSub",
    title: "Color",
    tbl: "tblEntryColor",
    add: InsertColors,
    update: UpdateColor,
  },
  {
    name: "karat",
    code: "karatCode",
    description: "karatDesc",
    category: "none",
    subDescription: "karatDescSub",
    title: "Karat",
    tbl: "tblEntrykarat",
    add: InsertKarat,
    update: UpdateKarat,
  },
  {
    name: "made",
    code: "madeCode",
    description: "madeDesc",
    category: "none",
    subDescription: "madeDescSub",
    title: "Made",
    tbl: "tblEntryMade",
    add: InsertMade,
    update: UpdateMade,
  },
  {
    name: "condition",
    code: "conditionCode",
    description: "conditionDesc",
    category: "catCode",
    subDescription: "conditionDescSub",
    title: "Condition",
    tbl: "tblEntryCondition",
    add: InsertCondition,
    update: UpdateCondition,
  },
  {
    name: "birthstone",
    code: "birthStoneCode",
    description: "birthStoneDesc",
    category: "catCode",
    subDescription: "bsDescSub",
    title: "Birthstone",
    tbl: "tblEntryBirthStone",
    add: InsertBirthStone,
    update: UpdateBirthStone,
  },
  {
    name: "item",
    code: "itemCode",
    description: "itemDesc",
    category: "catCode",
    hasCategory: true,
    subDescription: "itemDescSub",
    title: "Items",
    tbl: "tblEntryItem",
    add: InsertItems,
    update: UpdateItem,
  },
  {
    name: "diamond",
    code: "diamondShapeCode",
    description: "diamondShapeDesc",
    category: "catCode",
    subDescription: "diaShapeDescSub",
    title: "Diamond Shape",
    tbl: "tblEntryDiamondShape",
    add: InsertDiamondShape,
    update: UpdateDiamond,
  },
  {
    name: "bsColor",
    code: "bsColorCode",
    description: "bsColorDesc",
    category: "catCode",
    subDescription: "bsColorDescSub",
    title: "Birthstone Color",
    tbl: "tblEntryBSColor",
    add: InsertBirthStoneColor,
    update: UpdateBirthStoneColor,
  },
  {
    name: "titus",
    code: "titusCode",
    description: "titusDesc",
    category: "catCode",
    subDescription: "titusDescSub",
    title: "Titus",
    tbl: "tblEntryTitus",
    add: InsertTitus,
    update: UpdateTitus,
  },
  {
    name: "brand",
    code: "brandCode",
    description: "brandDesc",
    category: "catCode",
    subDescription: "brandDescSub",
    title: "Brand",
    tbl: "tblEntryBrand",
    add: InsertBrand,
    update: UpdateBrand,
  },
  {
    name: "model",
    code: "modelCode",
    description: "modelDesc",
    category: "catCode",
    subDescription: "modelDescSub",
    title: "Model",
    tbl: "tblEntryModel",
    add: InsertModel,
    update: UpdateModel,
  },
];


const CustomModal = (props) => {
  const [formData, setFormData] = useState({});
  const [entryForm, setEntryForm] = useState(defaultEntryForm);
  const [autoNum, setAutoNum] = useState("");
  const snackbar = useSnackbar();

  const { CNCode } = UserSession();

  const { data: categories, isLoading: categoriesLoading, error: categoriesError } = useListCategory();
  const { refetch: refetchColors } = useColors(CNCode);
  const { refetch: refetchDiamond } = useDiamondShape(CNCode);
  const { refetch: refetchItems } = useItems(CNCode);
  const { refetch: refetchConditions } = useConditions(CNCode);
  const { refetch: refetchBirthStones } = useBirthStone(CNCode);
  const { refetch: refetchKarats } = useKarats(CNCode);
  const { refetch: refetchMade } = useMade(CNCode);
  const { refetch: refetchBirthStoneColor } = useBirthStoneColor(CNCode);
  const { refetch: refetchTitus } = useTitus(CNCode);
  const { refetch: refetchBrands } = useBrands(CNCode);
  const { refetch: refetchModel } = useModels(CNCode);

  const selectedEntry = entries.find((entry) => entry.name === props.entry);

  useEffect(() => {
    if (selectedEntry) {
      setEntryForm(selectedEntry);

      if (props.isUpdate) {
        setFormData({
          [selectedEntry.code]: props.update[selectedEntry.code],
          [selectedEntry.description]: props.update[selectedEntry.description],
          [selectedEntry.category]: props.update[selectedEntry.category],
          [selectedEntry.subDescription]: props.update[selectedEntry.subDescription],
        });
        setAutoNum(props.update[selectedEntry.code]);
      } else {
        setFormData({
          [selectedEntry.code]: "",
          [selectedEntry.description]: "",
          [selectedEntry.category]: "",
          [selectedEntry.subDescription]: "",
        });
        fetchAutoNum();
      }
    }
  }, [selectedEntry, props.isUpdate]);

  const fetchAutoNum = async () => {
    try {
      const result = await AutoNumAll(CNCode, selectedEntry.code, selectedEntry.tbl);
      setAutoNum(String(result));
    } catch (error) {
      console.error(error);
    }
  };

  const refetchList = (listName) => {
    switch (listName) {
      case "color": return refetchColors();
      case "karat": return refetchKarats();
      case "made": return refetchMade();
      case "diamond": return refetchDiamond();
      case "item": return refetchItems();
      case "birthstone": return refetchBirthStones();
      case "condition": return refetchConditions();
      case "bsColor": return refetchBirthStoneColor();
      case "titus": return refetchTitus();
      case "brand": return refetchBrands();
      case "model": return refetchModel();
      default: return null;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (!selectedEntry) return null;

  const handleSubmit = async () => {
    let response = "";

    if (!props.isUpdate) {
      formData[entryForm.code] = autoNum;
    }
    formData["cnCode"] = CNCode;

    if (props.isUpdate) {
      response = await entryForm.update(formData);
    } else {
      response = await entryForm.add(formData);
    }

    console.log(response);

    if (response === "Inserted" || response === "Updated") {
      setFormData({
        [entryForm.code]: "",
        [entryForm.description]: "",
        [entryForm.category]: "",
        [entryForm.subDescription]: "",
      });
      fetchAutoNum();
      refetchList(entryForm.name);
      snackbar.success(`${entryForm.title} Successfully ${response}`);
      props.handleClose();
    }
  };

  return (
    <Dialog
      open={props.show}
      onClose={props.handleClose}
      disableEscapeKeyDown
      maxWidth="sm"
      fullWidth
      scroll="paper"
    >
      <DialogTitle sx={{ p: 2, fontSize: "1.1rem" }}>
        {entryForm.title} : {autoNum}
      </DialogTitle>
      <DialogContent dividers>
        <div className="d-flex flex-column align-content-center justify-content-center gap-4">
          {entryForm.hasCategory && (
            <div className="d-grid mb-3">
              <span className="align-top mb-2">Category:</span>
              {categoriesLoading ? (
                <div className="text-muted">Loading categories...</div>
              ) : categoriesError ? (
                <div className="text-danger">Failed to load categories</div>
              ) : (
                <select
                  name={entryForm.category}
                  value={formData[entryForm.category]}
                  onChange={handleChange}
                  className="form-control text-center align-middle"
                >
                  <option value="">-----Please Select-----</option>
                  {categories.map((item, index) => (
                    <option key={index} value={item.catCode}>
                      {item.catDesc}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          <div className="d-grid justify-content-center align-content-center">
            <input
              type="text"
              className="form-control border border-top-0 border-start-0 border-end-0 text-center"
              name={entryForm.description}
              value={formData[entryForm.description]}
              onChange={handleChange}
              placeholder="Enter Description"
            />
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button size="small" variant="outlined" className="bg-sec" onClick={props.handleClose}>
          <i className="fa-regular fa-circle-xmark"></i>&nbsp;Close
        </Button>
        <Button size="small" variant="contained" className="bg-prim" onClick={handleSubmit}>
          {props.isUpdate ? "Update" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomModal;

//Refactored CentralizedModal: Rodrigo Cuello
