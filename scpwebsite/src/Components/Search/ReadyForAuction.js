import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  Box,
  TablePagination,
  CircularProgress, 
  Alert, 
  Typography
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';

import { useSearchReadyForAuction } from '../../Hooks/useSearchQueries';
import { UserSession } from "../../Functions/UtilityFunctions";



export default function ReadyForAuction() {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const { CNCode } = UserSession();
  const readyForAuctionSearchList = useSearchReadyForAuction(CNCode);


  const filteredRows = readyForAuctionSearchList.data?.filter((row) =>
    Object.values(row).some((val) => 
      val.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const paginatedRows = filteredRows?.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(0);
  };



  if (readyForAuctionSearchList.isLoading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (readyForAuctionSearchList.isError) {
    return (
      <Box my={2}>
        <Alert severity="error">
          <Typography variant="body1">
            Failed to load auction data. Please try again later.
          </Typography>
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <TextField
        size="small"
        variant="outlined"
        placeholder="Search..."
        onChange={handleSearchChange}
        sx={{ mb: 2, width: 300 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
        }}
      />

      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead sx={{ backgroundColor: '#fafafa' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Customer</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Pawnticket</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Box No.</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>DLG Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Weight</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Karat</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }} align="right">Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.map((row, index) => (
              <TableRow key={index} hover>
                <TableCell>{row.custName}</TableCell>
                <TableCell>{row.pawnTicketNew}</TableCell>
                <TableCell>{row.boxNo}</TableCell>
                <TableCell>{row.dlgDate}</TableCell>
                <TableCell>{row.itemDesc}</TableCell>
                <TableCell>{row.weight}</TableCell>
                <TableCell>{row.karatDesc}</TableCell>
                <TableCell align="right">
                  {new Intl.NumberFormat('en-PH', {
                    style: 'currency',
                    currency: 'PHP',
                  }).format(row.cAmount)}
                </TableCell>
              </TableRow>
            ))}
            {filteredRows.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                  No records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Box>
  );
}