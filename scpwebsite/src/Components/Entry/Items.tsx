import React, { useState } from "react";

import { UserSession } from "../../Functions/UtilityFunctions";
import CustomModal from "../../filipModal/CustomModal";
import { useItems, useListCategory } from "../../Hooks/useEntriesQueries";
import DataTable from "react-data-table-component";
import type { TableColumn } from "react-data-table-component";
import type { ChangeEvent } from "react";
import type { ItemRow, CategoryRow } from "../../types/layoutInterfaces";
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

type ItemWithCategory = ItemRow & { category: string };



const Items = () => {

  const { CNCode } = UserSession();
  const { data: items = [], isLoading: itemsLoading, isError: itemsError, isFetching } = useItems(CNCode) as {
    data: ItemRow[];
    isLoading: boolean;
    isError: boolean;
    isFetching: boolean;
  };
  const { data: categories, isLoading: categoriesLoading, error: categoriesError } = useListCategory() as {
    data: CategoryRow[];
    isLoading: boolean;
    error: unknown;
  };


  const [title, setTitle] = useState("");
  const [show, setShow] = useState(false);

  const [getUpdate, setUpdate] = useState<ItemWithCategory | null>(null);
  const [getCateg, setCateg] = useState<CategoryRow[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);

  const PageName = "items";

  const isLoading = categoriesLoading || itemsLoading;
  const isError = categoriesError || itemsError;

  const itemsWithCategory: ItemWithCategory[] = items.map(item => {
    const matchedCategory = categories.find(cat => cat.catCode === item.catCode)
    return {
      ...item,
      category: matchedCategory ? matchedCategory.catDesc : "NA"
    }
  })


  const filteredData = itemsWithCategory.filter(
    (item) =>
      item.itemCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.itemDesc?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const HandleAdd = () => {
    setTitle("item");
    setShow(true);
  };
  const handleClose = () => {
    setShow(false);
    setIsUpdate(false)
    setUpdate(null);
  };
  const handleUpdate = (item: ItemWithCategory) => {
    setIsUpdate(true)
    setTitle("item");
    setUpdate(item);
    setShow(true)

  };

  const columns: TableColumn<ItemWithCategory>[] = [
        {
          name: "Item Code",
          selector: (row) => row.itemCode,
          width: "100px",
        },
        {
          name: "Item Description",
          selector: (row) => row.itemDesc,
        },
        {
          name: "Item Category",
          selector: (row) => row.category,
        }

    ];



  // first load
  if (isLoading && items.length === 0) {
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
  if (isError && items.length === 0) {
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
        success={GetList}
      />*/}

      <CustomModal show={show} handleClose={handleClose} entry={title} update={getUpdate} isUpdate={isUpdate} />

      <Box
        className="bg-prim"
        sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        <Typography variant="subtitle1" fontWeight={600} sx={{ p: 1, pl: 2 }}>
          Items
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
                Add Items
              </Button>
              <Typography variant="body2" color="text.secondary">
                {filteredData.length} of {items.length} items
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

          {isFetching && items.length > 0 && (
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
  );
}

export default Items;
