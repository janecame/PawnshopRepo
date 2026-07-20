import React, { useState } from "react";
import type { ChangeEvent } from "react";
import { UserSession } from "../../Functions/UtilityFunctions";
import CustomModal from "../../filipModal/CustomModal";
import { useModels } from "../../Hooks/useEntriesQueries";
import DataTable from "react-data-table-component";
import type { TableColumn } from "react-data-table-component";
import type { ModelRow } from "../../types/layoutInterfaces";
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



import { customStyles } from "./entryTableStyles";


export default function Model() {
    const { CNCode } = UserSession();
    const { data: models = [], isLoading, isError, isFetching } = useModels(CNCode) as {
      data: ModelRow[];
      isLoading: boolean;
      isError: boolean;
      isFetching: boolean;
    };

    const [title, setTitle] = useState("");
    const [show, setShow] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [getUpdate, setUpdate] = useState<ModelRow | null>(null);
    const [searchTerm, setSearchTerm] = useState("");


    const filteredData = models.filter(
      (item) =>
        item.modelCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.modelDesc?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.modelDescSub?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const HandleAdd = () => {
      setTitle("model");
      setShow(true);
    };
    const handleClose = () => {
      setShow(false);
      setIsUpdate(false)
      setUpdate(null);
    };
    const handleUpdate = (item: ModelRow) => {
      setIsUpdate(true)
      setUpdate(item)
      setTitle("model");
      setShow(true);
    };



    const columns: TableColumn<ModelRow>[] = [
          {
            name: "Model Code",
            selector: (row) => row.modelCode,
            width: "100px",
          },
          {
            name: "Model Description",
            selector: (row) => row.modelDesc,
          }

      ];



    // first load
    if (isLoading && models.length === 0) {
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
    if (isError && models.length === 0) {
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
        Model
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
              Add Model
            </Button>
            <Typography variant="body2" color="text.secondary">
              {filteredData.length} of {models.length} models
            </Typography>
          </Stack>

          <TextField
            size="small"
            placeholder="Search . . . . . . . ."
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

        {isFetching && models.length > 0 && (
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
        {/* <Pagination
          currentPage={currentPageSub}
          totalPages={totalPagesSub}
          onPageChange={handlePageChangeSub}
        /> */}
      </Box>
    </Box>
  </>
  )
}
