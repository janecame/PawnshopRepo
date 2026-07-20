import React, { useEffect, useState } from "react";
import type { ChangeEvent } from "react";



import { UserSession } from "../../Functions/UtilityFunctions";
import CustomModal from "../../filipModal/CustomModal";
import { useKarats } from "../../Hooks/useEntriesQueries";
import DataTable from "react-data-table-component";
import type { TableColumn } from "react-data-table-component";
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
import type { KaratRow } from "../../types/layoutInterfaces";

import { customStyles } from "./entryTableStyles";

const Karat = () => {

    const { CNCode } = UserSession();

    const { data: karats = [], isLoading, isError, isFetching } = useKarats(CNCode) as {
      data: KaratRow[];
      isLoading: boolean;
      isError: boolean;
      isFetching: boolean;
    };

    const [title, setTitle] = useState("");
    const [show, setShow] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);

    const [getUpdate, setUpdate] = useState<KaratRow | null>(null);
    const [searchTerm, setSearchTerm] = useState("");



    const filteredData = karats.filter(
      (item) =>
        item.karatCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.karatDesc?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.karatDescSub?.toLowerCase().includes(searchTerm.toLowerCase())
    );


    const HandleAdd = () => {
      setTitle("karat");
      setShow(true);
    };
    const handleClose = () => {
      setShow(false);
      setIsUpdate(false)
      setUpdate(null);

    };
    const handleUpdate = (item: KaratRow) => {
      setIsUpdate(true)
      setUpdate(item)
      setTitle("karat");
      setShow(true);
    };


  const columns: TableColumn<KaratRow>[] = [
        {
          name: "Karat Code",
          selector: (row) => row.karatCode,
          width: "100px",
        },
        {
          name: "Karat Description",
          selector: (row) => row.karatDesc,
        }

    ];



  // first load
  if (isLoading && karats.length === 0) {
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
  if (isError && karats.length === 0) {
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
        Karat
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
              Add Karat
            </Button>
            <Typography variant="body2" color="text.secondary">
              {filteredData.length} of {karats.length} karats
            </Typography>
          </Stack>

          <TextField
            size="small"
            placeholder="Search karats..."
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

        {isFetching && karats.length > 0 && (
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
    </Box>
  </>
  )
}


export default Karat;
