import React, { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import CentralizeModal from "../../filipModal/CentralizeModal";
import { UserSession } from "../../Functions/UtilityFunctions";
import { GetMadeList } from "../../API/GetListData";

import CustomModal from "../../filipModal/CustomModal";
import { useMade } from "../../Hooks/useEntriesQueries";
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
import type { MadeRow } from "../../types/layoutInterfaces";

import { customStyles } from "./entryTableStyles";



const Made = () => {

    const { CNCode } = UserSession();

    const { data: mades = [], isLoading, isError, isFetching } = useMade(CNCode) as {
      data: MadeRow[];
      isLoading: boolean;
      isError: boolean;
      isFetching: boolean;
    };

    const [title, setTitle] = useState("");
    const [show, setShow] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [getUpdate, setUpdate] = useState<MadeRow | null>(null);
    const [isUpdate, setIsUpdate] = useState(false);

    const filteredData = mades.filter(
      (item) =>
        item.madeCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.madeDesc?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.madeDescSub?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const HandleAdd = () => {
      setTitle("made");
      setShow(true);
    };
    const handleClose = () => {
      setShow(false);

      setIsUpdate(false)
      setUpdate(null);
    };
    const handleUpdate = (item: MadeRow) => {

      setIsUpdate(true)

      setTitle("made");
      setUpdate(item)
      setShow(true);

    };



    const columns: TableColumn<MadeRow>[] = [
        {
          name: "Made Code",
          selector: (row) => row.madeCode,
          width: "100px",
        },
        {
          name: "Made Description",
          selector: (row) => row.madeDesc,
        }

    ];



    // first load
    if (isLoading && mades.length === 0) {
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
    if (isError && mades.length === 0) {
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
        Made
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
              Add Made
            </Button>
            <Typography variant="body2" color="text.secondary">
              {filteredData.length} of {mades.length} made entries
            </Typography>
          </Stack>

          <TextField
            size="small"
            placeholder="Search made entries..."
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

        {isFetching && mades.length > 0 && (
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

export default Made;
