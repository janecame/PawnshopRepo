import React, { useState } from "react";
import type { ChangeEvent } from "react";


import { UserSession } from "../../Functions/UtilityFunctions";
import CustomModal from "../../filipModal/CustomModal";
import { useBrands } from "../../Hooks/useEntriesQueries";
import DataTable from "react-data-table-component";
import type { TableColumn } from "react-data-table-component";
import type { BrandRow } from "../../types/layoutInterfaces";
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



const Brand = () => {

    const { CNCode } = UserSession();
    const { data: brands = [], isLoading, isError, isFetching } = useBrands(CNCode) as {
      data: BrandRow[];
      isLoading: boolean;
      isError: boolean;
      isFetching: boolean;
    };

    const [title, setTitle] = useState("");
    const [show, setShow] = useState(false);

    const [getData, setData] = useState([]);
    const [getUpdate, setUpdate] = useState<BrandRow | null>(null);

    const [isUpdate, setIsUpdate] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredData = brands.filter(
      (item) =>
        item.brandCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.brandDesc?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.brandDescSub?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const HandleAdd = () => {
      setTitle("brand");
      setShow(true);
    };
    const handleClose = () => {
      setIsUpdate(false)
      setUpdate(null);

      setShow(false);
    };
    const handleUpdate = (item: BrandRow) => {
      setIsUpdate(true)
      setUpdate(item)
      setTitle("brand");
      setShow(true);
    };

  const columns: TableColumn<BrandRow>[] = [
        {
          name: "Brand Code",
          selector: (row) => row.brandCode,
          width: "100px",
        },
        {
          name: "Brand Description",
          selector: (row) => row.brandDesc,
        }

    ];



  // first load
    if (isLoading && brands.length === 0) {
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
    if (isError && brands.length === 0) {
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
        Brand
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
              Add Brand
            </Button>
            <Typography variant="body2" color="text.secondary">
              {filteredData.length} of {brands.length} brands
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

        {isFetching && brands.length > 0 && (
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


export default Brand;
