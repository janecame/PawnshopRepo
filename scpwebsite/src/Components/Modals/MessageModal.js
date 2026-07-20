import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

function MessageModal(props) {
  return (
    <Dialog
      open={props.show}
      onClose={props.handleClose}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle sx={{ py: 1 }}>
        <i className="fa-regular fa-bell"></i>
      </DialogTitle>
      <DialogContent sx={{ textAlign: "center", p: 2 }}>
        <h3>{props.icon}</h3>
        <h6>{props.text}</h6>
      </DialogContent>
      <DialogActions sx={{ p: 1 }}>
        <Button
          size="small"
          variant="contained"
          className="bg-prim"
          onClick={props.handleClose}
          sx={{ mx: "auto" }}
        >
          <i className="fa-solid fa-check"></i>&nbsp;OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default MessageModal;
