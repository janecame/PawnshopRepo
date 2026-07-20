import React, { useEffect, useState } from "react";
import type { ChangeEvent } from "react";

import { UserSession } from "../../Functions/UtilityFunctions";
import CustomModal from "../../filipModal/CustomModal";
import { useBirthStone } from "../../Hooks/useEntriesQueries";
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
import type { BirthStoneRow } from "../../types/layoutInterfaces";



import { customStyles } from "./entryTableStyles";



const BirthStone = () => {

  const { CNCode } = UserSession();
  const { data: birthstones = [], isLoading, isError, isFetching } = useBirthStone(CNCode) as {
    data: BirthStoneRow[];
    isLoading: boolean;
    isError: boolean;
    isFetching: boolean;
  };


  const [title, setTitle] = useState("");
  const [show, setShow] = useState(false);

  const [getUpdate, setUpdate] = useState<BirthStoneRow | null>(null);
  const [isUpdate, setIsUpdate] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = birthstones.filter(
    (item) =>
      item.birthStoneCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.birthStoneDesc?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.bsDescSub?.toLowerCase().includes(searchTerm.toLowerCase())
  );



  const HandleAdd = () => {
    setTitle("birthstone");
    setShow(true);
  };
  const handleClose = () => {
    setShow(false);
    setIsUpdate(false)
    setUpdate(null);


  };
  const handleUpdate = (item: BirthStoneRow) => {
    setIsUpdate(true)
    setTitle("birthstone");
    setUpdate(item);
    setShow(true)

  };

  const columns: TableColumn<BirthStoneRow>[] = [
    {
      name: "BirthStone Code",
      selector: (row) => row.birthStoneCode,
      width: "100px",
    },
    {
      name: "BirthStone Description",
      selector: (row) => row.birthStoneDesc,
    }

  ];

  // first load
  if (isLoading && birthstones.length === 0) {
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
  if (isError && birthstones.length === 0) {
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
          Birth Stone
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
                Add Birth Stone
              </Button>
              <Typography variant="body2" color="text.secondary">
                {filteredData.length} of {birthstones.length} birth stones
              </Typography>
            </Stack>

            <TextField
              size="small"
              placeholder="Search birth stones..."
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

          {isFetching && birthstones.length > 0 && (
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
  );
}

export default BirthStone;
