import { useEffect, useMemo, useState } from "react";
import { UserSession } from "../Functions/UtilityFunctions";
import { AutoNumAll } from "../API/AutoNum";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";

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

import type { CategoryRow } from "../types/layoutInterfaces";

type CustomModalProps = {
  show: boolean;
  handleClose: () => void;
  entry: string;
  update: Record<string, unknown> | null;
  isUpdate: boolean;
};

type EntryConfig = {
  name: string;
  code: string;
  description: string;
  category: string; // "none" sentinel when the entry has no category
  hasCategory?: boolean;
  subDescription: string;
  title: string;
  tbl: string;
  add: (data: Record<string, unknown>) => Promise<string>;
  update: (data: Record<string, unknown>) => Promise<string>;
};

type EntryFormValues = Record<string, string>;

const defaultEntryForm: EntryConfig = {
  title: "",
  name: "",
  code: "",
  description: "",
  category: "none",
  subDescription: "",
  tbl: "",
  add: async () => "",
  update: async () => "",
};

const entries: EntryConfig[] = [
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

const emptyValuesFor = (entry: EntryConfig): EntryFormValues => ({
  [entry.code]: "",
  [entry.description]: "",
  [entry.category]: "",
  [entry.subDescription]: "",
});

const CustomModal = (props: CustomModalProps) => {
  const [autoNum, setAutoNum] = useState("");
  const snackbar = useSnackbar();

  const { CNCode } = UserSession();

  const { data: categories, isLoading: categoriesLoading, error: categoriesError } = useListCategory() as {
    data: CategoryRow[];
    isLoading: boolean;
    error: unknown;
  };
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
  const entryForm = selectedEntry ?? defaultEntryForm;

  const formSchema = useMemo<z.ZodType<EntryFormValues>>(() => {
    const shape: Record<string, z.ZodTypeAny> = {
      [entryForm.code]: z.string(),
      [entryForm.description]: z.string().min(1, "Description is required."),
    };
    if (entryForm.category !== "none") {
      shape[entryForm.category] = z.string();
    }
    if (entryForm.subDescription) {
      shape[entryForm.subDescription] = z.string();
    }
    return z.object(shape) as unknown as z.ZodType<EntryFormValues>;
  }, [entryForm]);

  const { control, handleSubmit, reset, formState: { errors } } = useForm<EntryFormValues>({
    resolver: zodResolver(formSchema) as unknown as Resolver<EntryFormValues>,
    defaultValues: emptyValuesFor(entryForm),
  });

  const fetchAutoNum = async () => {
    if (!selectedEntry) return;
    try {
      const result = await AutoNumAll(CNCode, selectedEntry.code, selectedEntry.tbl);
      setAutoNum(String(result));
    } catch (error) {
      console.error(error);
    }
  };

  const refetchList = (listName: string) => {
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

  useEffect(() => {
    if (!selectedEntry) return;

    if (props.isUpdate) {
      reset({
        [selectedEntry.code]: String(props.update?.[selectedEntry.code] ?? ""),
        [selectedEntry.description]: String(props.update?.[selectedEntry.description] ?? ""),
        [selectedEntry.category]: String(props.update?.[selectedEntry.category] ?? ""),
        [selectedEntry.subDescription]: String(props.update?.[selectedEntry.subDescription] ?? ""),
      });
      setAutoNum(String(props.update?.[selectedEntry.code] ?? ""));
    } else {
      reset(emptyValuesFor(selectedEntry));
      fetchAutoNum();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEntry, props.isUpdate]);

  const handleMutationSuccess = (response: string) => {
    if (response === "Inserted" || response === "Updated") {
      reset(emptyValuesFor(entryForm));
      fetchAutoNum();
      refetchList(entryForm.name);
      snackbar.success(`${entryForm.title} Successfully ${response}`);
      props.handleClose();
    }
  };

  const insertMutation = useMutation({
    mutationFn: (data: EntryFormValues) => {
      const payload: Record<string, unknown> = { ...data, [entryForm.code]: autoNum, cnCode: CNCode };
      return entryForm.add(payload);
    },
    onSuccess: handleMutationSuccess,
  });

  const updateMutation = useMutation({
    mutationFn: (data: EntryFormValues) => {
      const payload: Record<string, unknown> = { ...data, cnCode: CNCode };
      return entryForm.update(payload);
    },
    onSuccess: handleMutationSuccess,
  });

  if (!selectedEntry) return null;

  const onSubmit = handleSubmit((data) => {
    if (props.isUpdate) {
      updateMutation.mutate(data);
    } else {
      insertMutation.mutate(data);
    }
  });

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
                <CircularProgress size={20} />
              ) : categoriesError ? (
                <Typography color="error" variant="body2">Failed to load categories</Typography>
              ) : (
                <Controller
                  name={entryForm.category}
                  control={control}
                  render={({ field }) => (
                    <Select {...field} size="small" displayEmpty>
                      <MenuItem value="">-----Please Select-----</MenuItem>
                      {categories.map((item, index) => (
                        <MenuItem key={index} value={item.catCode}>
                          {item.catDesc}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              )}
            </div>
          )}

          <div className="d-grid justify-content-center align-content-center">
            <Controller
              name={entryForm.description}
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  size="small"
                  placeholder="Enter Description"
                  error={!!errors[entryForm.description]}
                  helperText={errors[entryForm.description]?.message as string | undefined}
                />
              )}
            />
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Button size="small" variant="outlined" className="bg-sec" onClick={props.handleClose}>
          <i className="fa-regular fa-circle-xmark"></i>&nbsp;Close
        </Button>
        <Button size="small" variant="contained" className="bg-prim" onClick={onSubmit}>
          {props.isUpdate ? "Update" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomModal;
