import React, { useState } from "react";
import type { ChangeEvent } from "react";
import { UserSession } from "../../Functions/UtilityFunctions";
import CustomModal from "../../filipModal/CustomModal";
import { useTitus } from "../../Hooks/useEntriesQueries";
import DataTable from "react-data-table-component";
import type { TableColumn } from "react-data-table-component";
import type { TitusRow } from "../../types/layoutInterfaces";
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


const Titus = () => {

    const { CNCode } = UserSession();
    const { data: titus = [], isLoading, isError, isFetching } = useTitus(CNCode) as {
      data: TitusRow[];
      isLoading: boolean;
      isError: boolean;
      isFetching: boolean;
    };

    const [title, setTitle] = useState("");
    const [show, setShow] = useState(false);

    const [isUpdate, setIsUpdate] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const [getData, setData] = useState([]);
    const [getUpdate, setUpdate] = useState<TitusRow | null>(null);


    const filteredData = titus.filter(
      (item) =>
        item.titusCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.titusDesc?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.titusDescSub?.toLowerCase().includes(searchTerm.toLowerCase())
    );



    const HandleAdd = () => {
      setTitle("titus");
      setShow(true);
    };
    const handleClose = () => {
      setShow(false);
      setIsUpdate(false)
      setUpdate(null);
    };
    const handleUpdate = (item: TitusRow) => {
      setIsUpdate(true)
      setUpdate(item)
      setTitle("titus");
      setShow(true);
    };


      const columns: TableColumn<TitusRow>[] = [
        {
          name: "Titus Code",
          selector: (row) => row.titusCode,
          width: "100px",
        },
        {
          name: "Titus Description",
          selector: (row) => row.titusDesc,
        }

    ];


    if (isLoading && titus.length === 0) {
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
    if (isError && titus.length === 0) {
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
        Titus
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
              Add Titus
            </Button>
            <Typography variant="body2" color="text.secondary">
              {filteredData.length} of {titus.length} titus entries
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

        {isFetching && titus.length > 0 && (
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


export default Titus
