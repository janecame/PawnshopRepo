import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { formatStringNumber } from "../../Functions/UtilityFunctions";

function PartialPaymentModal(props) {
    const [loading, setLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [data, setData] = useState([]);
    const [list, setList] = useState([]);

    useEffect(() => {
        if (props.data.length > 0) {
            setData(props.data);
        }
    }, [props.data]);

    const handleRowClick = (index, list) => {
        setSelectedIndex(index);

        if (list) {
            const filteredData = data.filter(item =>
                item.boxNo === list.boxNo &&
                item.cnCode === list.cnCode &&
                item.reference === list.reference
            );
            setList(filteredData);
        }
    };

    return (
        <Dialog
            open={props.show}
            onClose={props.handleClose}
            disableEscapeKeyDown
            maxWidth="md"
            fullWidth
        >
            <DialogTitle sx={{ p: 2, fontSize: "1.1rem" }}>
                Partial Payment List
            </DialogTitle>
            <DialogContent dividers>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-4 border rounded-start p-1">
                            <div className="d-grid gap-2 w-100">
                                <h6 className="text-center">List of Box Number(s)</h6>
                                <div className="table-responsive">
                                    <table className="table table-sm table-hover table-striped border">
                                        <thead>
                                            <tr>
                                                <th> </th>
                                                <th>Date</th>
                                                <th>Box Number</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data?.map((list, index) => (
                                                <tr key={index} onClick={() => handleRowClick(index, list)} className="pointer">
                                                    <td>{selectedIndex === index ? <i className="fa-solid fa-caret-right"></i> : null}</td>
                                                    <td>{new Date(list.tDate).toLocaleDateString("en-US", {
                                                        year: "numeric",
                                                        month: "numeric",
                                                        day: "numeric",
                                                    })}</td>
                                                    <td>{list.boxNo}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className="col-8 border rounded-end-0 p-1">
                            <div className="d-grid gap-2 w-100">
                                <h6 className="text-center">List of Item(s)</h6>
                                <div className="table-responsive">
                                    <table className="table table-sm table-hover table-striped border">
                                        <thead>
                                            <tr>
                                                <th>Category</th>
                                                <th>Item</th>
                                                <th className="text-end"> Loan Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {list?.map((list, index) => (
                                                <tr key={index}>
                                                    <td>{props.categoryDescription(list.catCode)}</td>
                                                    <td>{props.itemDescription(list.itemCode)}</td>
                                                    <td className="text-end">{formatStringNumber(list.cAmount)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
            <DialogActions>
                <Button size="small" variant="outlined" className="bg-sec" onClick={props.handleClose}>
                    <i className="fa-regular fa-circle-xmark"></i>&nbsp;Close
                </Button>
                <Button
                    size="small"
                    variant="contained"
                    className="bg-prim"
                    onClick={() => props.onPost(list)}
                >
                    {loading ? (
                        <>
                            <i className="fa-solid fa-spinner fa-spin-pulse"></i>&nbsp;Updating...
                        </>
                    ) : (
                        <>
                            <i className="fa-solid fa-arrow-down-short-wide"></i>&nbsp;Post
                        </>
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default PartialPaymentModal;
