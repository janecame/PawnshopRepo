import { useState } from "react";
import type { ChangeEvent } from "react";
import CustModal from "../../filipModal/CustModal";
import { UserSession } from "../../Functions/UtilityFunctions";
import { useCustomers } from "../../Hooks/useEntriesQueries";
import DataTable from "react-data-table-component";
import type { TableColumn } from "react-data-table-component";
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  CircularProgress,
  Chip,
  Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import type { CustomerRow } from "../../types/layoutInterfaces";
import { customStyles } from "./entryTableStyles";

type CustomerTitle = "Customer Add" | "Customer Update" | null;


const Customer = () => {
  const [show, setShow] = useState(false);
  const [getTitle, setTile] = useState<CustomerTitle>(null);

  const [getUpdate, setUpdate] = useState<CustomerRow | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { CNCode } =  UserSession();

  const { data: customers = [], isLoading, isError, isFetching } = useCustomers(CNCode) as {
    data: CustomerRow[];
    isLoading: boolean;
    isError: boolean;
    isFetching: boolean;
  };


  const filteredData = customers.filter(
    (item) =>
      item.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.middleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.contactNo.includes(searchTerm) ||
      item.zipCode.includes(searchTerm)
  );
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleClose = () => {
    setShow(false);
  };
  const HandleAdd = () => {
    setShow(true);
    setTile("Customer Add");
  };
  const HandleUpdate = (item: CustomerRow) => {
    if(item.birthdate === null){
      item.birthdate = "";
    }
    setUpdate(item);
    setShow(true);
    setTile("Customer Update");
  };



  const columns: TableColumn<CustomerRow>[] = [
        {
          name: "Lastname",
          selector: (row) => row.lastName,
          cell: (row) => <Typography variant="body2" title={row.lastName}>{row.lastName}</Typography>,
          grow: 1,
        },
        {
          name: "MiddleName",
          selector: (row) => row.middleName,
          cell: (row) => <Typography variant="body2" title={row.middleName}>{row.middleName}</Typography>,
          grow: 1,
        },
        {
          name: "Firstname",
          selector: (row) => row.firstName,
          cell: (row) => <Typography variant="body2" title={row.firstName}>{row.firstName}</Typography>,
          grow: 1,
        },
        {
          name: "Contact No.",
          selector: (row) => row.contactNo,
          cell: (row) => {
            const isEmpty = !row.contactNo || row.contactNo.toUpperCase() === "NA";
            return (
              <Typography variant="body2" color={isEmpty ? "text.disabled" : "text.primary"}>
                {isEmpty ? "N/A" : row.contactNo}
              </Typography>
            );
          },
          grow: 1,
        },
        {
          name: "Zip Code",
          selector: (row) => row.zipCode,
          grow: 1,
        },
        {
          name: "Status",
          // instead of selector, use cell to render JSX
          cell: (row) => (
            <Chip
              label={row.active === "True" ? "Active" : "Inactive"}
              color={row.active === "True" ? "success" : "error"}
              size="small"
              variant="filled"
            />
          ),
          center: true, // optional: aligns content center
          width: "120px",
        },


    ];


  // first load
  if (isLoading && customers.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          height: "100vh",
        }}
      >
        <CircularProgress size={32} />
        <Typography color="text.secondary">Loading data...</Typography>
      </Box>
    );
  }

  // first load error
  if (isError && customers.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography color="error">
          Sorry, data couldn't load. Contact your administrator.
        </Typography>
      </Box>
    );
  }



  return (
    <>
      <CustModal
        update={getUpdate}
        show={show}
        handleClose={handleClose}
        title={getTitle}
        cnCode={CNCode}
      />

      <Box
        className="bg-prim"
        sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        <Typography variant="subtitle1" fontWeight={600} sx={{ p: 1, pl: 2 }}>
          Customer
        </Typography>
      </Box>

      <Box sx={{ width: "100%", p: 2 }}>
        <Box sx={{ textAlign: "center" }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            gap={2}
            sx={{ mb: 2 }}
          >
            <Stack direction="row" alignItems="center" gap={2}>
              <Button
                variant="contained"
                size="small"
                className="bg-prim"
                startIcon={<AddIcon />}
                onClick={HandleAdd}
              >
                Add Customer
              </Button>
              <Typography variant="body2" color="text.secondary">
                {filteredData.length} of {customers.length} customers
              </Typography>
            </Stack>

            <TextField
              size="small"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={handleSearchChange}
              sx={{ width: { xs: "100%", md: 320 } }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Stack>

          {isFetching && customers.length > 0 && (
            <Stack direction="row" justifyContent="center" alignItems="center" gap={1} sx={{ mb: 1 }}>
              <CircularProgress size={14} />
              <Typography variant="body2" color="text.secondary">Refreshing...</Typography>
            </Stack>
          )}


          <DataTable
            columns={columns}
            data={filteredData}
            striped
            highlightOnHover
            dense
            pagination
            responsive
            onRowClicked={row => HandleUpdate(row)}
            customStyles={customStyles}
          />

        </Box>
      </Box>
    </>
  );
}



export default Customer;
