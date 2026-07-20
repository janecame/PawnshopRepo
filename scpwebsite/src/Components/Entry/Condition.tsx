import { useState } from "react";
import type { ChangeEvent } from "react";
import DataTable from "react-data-table-component";
import type { TableColumn } from "react-data-table-component";

import { UserSession } from "../../Functions/UtilityFunctions";
import CustomModal from "../../filipModal/CustomModal";
import { useConditions } from "../../Hooks/useEntriesQueries";
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  CircularProgress,
  Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import type { ConditionRow } from "../../types/layoutInterfaces";




import { customStyles } from "./entryTableStyles";


const Condition = () => {
  const { CNCode } = UserSession();
  const { data: conditions = [], isLoading, isError, isFetching } = useConditions(CNCode) as {
    data: ConditionRow[];
    isLoading: boolean;
    isError: boolean;
    isFetching: boolean;
  };

  //const [cnCode, setCNCode] = useState(UserSession().CNCode);

  const [show, setShow] = useState(false);
  const [title, setTitle] = useState("");
  const [getUpdate, setUpdate] = useState<ConditionRow | null>(null);
  const [isUpdate, setIsUpdate] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");


  const filteredData = conditions.filter(
    (item) =>
      item.conditionCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.conditionDesc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.conditionDescSub.toLowerCase().includes(searchTerm.toLowerCase())
    // item.contactNo.includes(searchTerm) ||
    // item.zipCode.includes(searchTerm)
  );

  //All Handle Fucntion
  const handleClose = () => {
    setShow(false);
    setIsUpdate(false)
    setUpdate(null);
  };
  const HandleAdd = () => {
    setShow(true);
    setTitle("condition");
  };
  const handleUpdate = (item: ConditionRow) => {

    setIsUpdate(true)
    setTitle("condition");
    setUpdate(item);
    setShow(true)
  };



  const columns: TableColumn<ConditionRow>[] = [
        {
          name: "Condition Code",
          selector: (row) => row.conditionCode,
          width: "100px",
        },
        {
          name: "Condition Description",
          selector: (row) => row.conditionDesc,
        }
  ];



  // first load
  if (isLoading && conditions.length === 0) {
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
  if (isError && conditions.length === 0) {
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
      <CustomModal show={show} handleClose={handleClose} entry={title} update={getUpdate} isUpdate={isUpdate} />

      <Box
        className="bg-prim"
        sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        <Typography variant="subtitle1" fontWeight={600} sx={{ p: 1, pl: 2 }}>
          Condition
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
                onClick={() => {
                  HandleAdd();
                }}
              >
                Add Condition
              </Button>
              <Typography variant="body2" color="text.secondary">
                {filteredData.length} of {conditions.length} conditions
              </Typography>
            </Stack>

            <TextField
              size="small"
              placeholder="Search conditions..."
              value={searchTerm}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
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

          {isFetching && conditions.length > 0 && (
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
            onRowClicked={row => handleUpdate(row)}
            customStyles={customStyles}
          />

        </Box>

        <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}></Box>
      </Box>
    </>
  );
}

export default Condition;
