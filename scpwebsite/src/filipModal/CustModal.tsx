import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { AutoNumCustCode } from "../API/AutoNum";
import { InsertCustomer } from "../API/Insert";
import { UserSession } from "../Functions/UtilityFunctions";
import { useSnackbar } from '../contexts/SnackbarContext';
import { UpdateCustomer } from "../API/Update";
import { useCustomers } from "../Hooks/useEntriesQueries";
import type { CustomerRow } from "../types/layoutInterfaces";

type CustModalProps = {
  update?: CustomerRow | null;
  show: boolean;
  handleClose: () => void;
  title: "Customer Add" | "Customer Update" | null;
  cnCode: string;
};

const customerFormSchema = z.object({
  CNCode: z.string(),
  ControlNo: z.string(),
  LastName: z.string().min(1, "Lastname is required."),
  FirstName: z.string().min(1, "Firstname is required."),
  MiddleName: z.string().min(1, "Middlename is required."),
  BuildingNo: z.string(),
  Street: z.string(),
  Brgy: z.string(),
  City: z.string(),
  Province: z.string(),
  ZipCode: z.string(),
  Birthdate: z.string(), // "" allowed in-form; converted to null right before submit
  ContactNo: z.string().min(1, "Contact No is required."),
  ValidIDNumber: z.string(),
  EmailAddress: z.string(),
  Address: z.string(),
  Active: z.string(), // "True" | "False" checkbox sentinel, kept as-is for API compat
});

type CustomerFormValues = z.infer<typeof customerFormSchema>;

function CustModal(props: CustModalProps) {
  const { CNCode } = UserSession();
  const snackbar = useSnackbar();

  const { refetch: refetchCustomers } = useCustomers(CNCode);
  const [getNum, setNum] = useState("");

  const InitialState: CustomerFormValues = {
    CNCode: CNCode,
    ControlNo: "",
    LastName: "",
    FirstName: "",
    MiddleName: "",
    BuildingNo: "",
    Street: "",
    Brgy: "",
    City: "",
    Province: "",
    ZipCode: "",
    Birthdate: "",
    ContactNo: "",
    ValidIDNumber: "",
    EmailAddress: "",
    Address: '',
    Active: ''
  };

  const { control, handleSubmit, reset, formState: { errors } } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: InitialState,
  });

  const CustCodeNum = async () => {
    try {
      if (props.cnCode !== "") {
        const res = await AutoNumCustCode(props.cnCode);
        setNum(res);
      }
    } catch (error) {
      throw error;
    }
  };

  const insertMutation = useMutation({
    mutationFn: (data: CustomerFormValues) =>
      InsertCustomer({ ...data, Birthdate: data.Birthdate || null }),
    onSuccess: (result) => {
      if (result === "Inserted") {
        reset(InitialState);
        CustCodeNum();
        snackbar.success("Successfully saved!");
        refetchCustomers();
        props.handleClose();
      } else {
        snackbar.warning("Failed to save!");
      }
    },
    onError: () => snackbar.error("Failed to save! Something went wrong."),
  });

  const updateMutation = useMutation({
    mutationFn: (data: CustomerFormValues) => UpdateCustomer(data),
    onSuccess: (result) => {
      if (result === "Updated") {
        reset(InitialState);
        CustCodeNum();
        snackbar.success("Successfully saved!");
        refetchCustomers();
        props.handleClose();
      } else {
        snackbar.warning("Failed to save!");
      }
    },
    onError: () => {}, // original swallowed errors silently on update; preserved as-is
  });

  useEffect(() => {
    if (props.title === "Customer Add") {
      reset(InitialState);
      CustCodeNum();
    } else if (props.title === "Customer Update" && props.update) {
      reset({
        ...InitialState,
        ControlNo: props.update.controlNo || "",
        LastName: props.update.lastName || "",
        FirstName: props.update.firstName || "",
        MiddleName: props.update.middleName || "",
        BuildingNo: props.update.buildingNo || "",
        Street: props.update.street || "",
        City: props.update.city || "",
        Province: props.update.province || "",
        ZipCode: props.update.zipCode || "",
        Birthdate: props.update.birthdate ? props.update.birthdate.split("T")[0] : "",
        ContactNo: props.update.contactNo || "",
        ValidIDNumber: props.update.validIDNumber || "",
        EmailAddress: props.update.emailAddress || "",
        Address: props.update.address || "",
        Active: props.update.active || "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.title, props.update]);

  const onSubmit = handleSubmit((data) => {
    if (props.title === 'Customer Add') {
      insertMutation.mutate(data);
    } else {
      updateMutation.mutate(data);
    }
  });

  const isPending = insertMutation.isPending || updateMutation.isPending;
  const controlNo = useWatch({ control, name: "ControlNo" });

  return (
    <Dialog
      open={props.show}
      onClose={props.handleClose}
      disableEscapeKeyDown
      maxWidth="md"
      fullWidth
      scroll="paper"
    >
      <DialogTitle
        sx={{ p: 2, fontSize: "1.1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        <span>{props.title}</span>
        <Typography variant="body2" color="text.secondary">
          {props.title === 'Customer Update' ? controlNo : getNum}
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        {/* Name Details */}
        <div className="mb-3">
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>Name Details</Typography>
          <div className="d-flex gap-3">
            <Controller
              name="LastName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  size="small"
                  label="Lastname"
                  id="lastname"
                  error={!!errors.LastName}
                  helperText={errors.LastName?.message}
                />
              )}
            />
            <Controller
              name="FirstName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  size="small"
                  label="Firstname"
                  id="firstname"
                  error={!!errors.FirstName}
                  helperText={errors.FirstName?.message}
                />
              )}
            />
            <Controller
              name="MiddleName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  size="small"
                  label="Middlename"
                  id="middlename"
                  error={!!errors.MiddleName}
                  helperText={errors.MiddleName?.message}
                />
              )}
            />
          </div>
        </div>

        {/* Address Details */}
        <div className="mb-3">
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>Address Details</Typography>
          <div className="d-flex gap-3 justify-content-start mb-2">
            <Controller
              name="BuildingNo"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  size="small"
                  label="Building No."
                  id="BuildingNo"
                />
              )}
            />
            <Controller
              name="Street"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  size="small"
                  label="Street"
                  id="street"
                />
              )}
            />
            <Controller
              name="Brgy"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  size="small"
                  label="Barangay"
                  id="Brgy"
                />
              )}
            />
          </div>
          <div className="d-flex gap-3 justify-content-start">
            <Controller
              name="City"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  size="small"
                  label="City/Municipality"
                  id="City"
                />
              )}
            />
            <Controller
              name="Province"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  size="small"
                  label="Province"
                  id="province"
                />
              )}
            />
            <Controller
              name="ZipCode"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  size="small"
                  label="Zip Code"
                  id="ZipCode"
                />
              )}
            />
          </div>
        </div>

        {/* Personal Details */}
        <div className="mt-3">
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>Details</Typography>
          <div className="d-flex gap-3 justify-content-start mb-2">
            <Controller
              name="Birthdate"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  size="small"
                  type="date"
                  label="BirthDate"
                  id="Birthdate"
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />
            <Controller
              name="ContactNo"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  size="small"
                  label="Contact No."
                  id="contactNo"
                  error={!!errors.ContactNo}
                  helperText={errors.ContactNo?.message}
                />
              )}
            />
            <Controller
              name="ValidIDNumber"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  size="small"
                  label="Valid ID Number"
                  id="validId"
                />
              )}
            />
          </div>
          <div className="d-flex gap-3 justify-content-start">
            <Controller
              name="EmailAddress"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  size="small"
                  type="email"
                  label="Email Address"
                  id="EmailAddress"
                />
              )}
            />
          </div>
        </div>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "end" }}>
        
 
          <div className="d-flex align-items-center">
            <Controller
              name="Active"
              control={control}
              render={({ field }) => (
                <input
                  type="checkbox"
                  checked={field.value === 'True'}
                  onChange={(e) => field.onChange(e.target.checked ? "True" : "False")}
                />
              )}
            />
            <span className="ms-1">Active?</span>
          </div>
          <Button size="medium" variant="outlined" onClick={props.handleClose}>
            <i className="fa-regular fa-circle-xmark"></i>&nbsp;Close
          </Button>
          <Button
            size="medium"
            variant="contained"
            className="bg-prim"
            disabled={isPending}
            onClick={onSubmit}
            sx={{ ml: 1 }}
          >
            {isPending ? (
              <>
                <i className="fa-solid fa-spinner fa-spin-pulse"></i>&nbsp;Updating...
              </>
            ) : (
              <>
                <i className="fa-regular fa-floppy-disk"></i>&nbsp;Save
              </>
            )}
          </Button>

      </DialogActions>
    </Dialog>
  );
}

export default CustModal;
