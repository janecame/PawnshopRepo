import { Dialog, DialogContent } from "@mui/material";

function LoadingModal(props) {
  return (
    <Dialog
      open={props.show}
      onClose={props.handleClose}
      disableEscapeKeyDown
      maxWidth="xs"
      fullWidth
    >
      <DialogContent sx={{ textAlign: "center", py: 3 }}>
        <h3>{props.icon}</h3>
        <h6>{props.text}  Saving...</h6>
      </DialogContent>
    </Dialog>
  );
}

export default LoadingModal;
