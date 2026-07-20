import React, { useState } from 'react'
import type { ChangeEvent } from "react";
import { UserSession } from "../../Functions/UtilityFunctions";
import CustomModal from "../../filipModal/CustomModal";
import { useDiamondShape } from "../../Hooks/useEntriesQueries";
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
import type { DiamondShapeRow } from "../../types/layoutInterfaces";


import { customStyles } from "./entryTableStyles";



const DiamondShape = () => {

    const { CNCode } = UserSession();
    const { data: diamonds = [], isLoading, isError, isFetching } = useDiamondShape(CNCode) as {
      data: DiamondShapeRow[];
      isLoading: boolean;
      isError: boolean;
      isFetching: boolean;
    };

    const [searchTerm, setSearchTerm] = useState("");
    const [title, setTitle] = useState('')
    const [show, setShow] = useState(false)
    const [getUpdate,setUpdate] = useState<DiamondShapeRow | null>(null)
    const [isUpdate, setIsUpdate] = useState(false);


    const filteredData = diamonds.filter(
      (item) =>
        item.diamondShapeCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.diamondShapeDesc?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.diaShapeDescSub?.toLowerCase().includes(searchTerm.toLowerCase())
    );



    const HandleAdd = ()=>{
        setTitle('diamond')
        setShow(true)
    }
    const handleClose =()=>{
        setShow(false);
        setIsUpdate(false)
        setUpdate(null);
    }
    const handleUpdate =(item: DiamondShapeRow)=>{

        setIsUpdate(true)
        setTitle("diamond");
        setUpdate(item);
        setShow(true)

    }


      const columns: TableColumn<DiamondShapeRow>[] = [
        {
          name: "Diamond Code",
          selector: (row) => row.diamondShapeCode,
          width: "100px",
        },
        {
          name: "Diamond Description",
          selector: (row) => row.diamondShapeDesc,
        }

    ];



    // first load
    if (isLoading && diamonds.length === 0) {
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
    if (isError && diamonds.length === 0) {
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
   {/*<CentralizeModal
        show={show}
        handleClose={handleClose}
        title={getTitle}
        cnCode={cnCode}
        update={getUpdate}
        PageName={PageName}
        success={ListofData}

      />*/}

      <CustomModal show={show} handleClose={handleClose} entry={title} update={getUpdate} isUpdate={isUpdate} />


      <Box
        className="bg-prim"
        sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        <Typography variant="subtitle1" fontWeight={600} sx={{ p: 1, pl: 2 }}>
          Diamond Shape
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
                Add Diamond Shape
              </Button>
              <Typography variant="body2" color="text.secondary">
                {filteredData.length} of {diamonds.length} diamond shapes
              </Typography>
            </Stack>

            <TextField
              size="small"
              placeholder="Search diamond shapes..."
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

           {isFetching && diamonds.length > 0 && (
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

export default DiamondShape
