import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

const sizeMap = { sm: "xs", md: "sm", lg: "md", xl: "lg" };

const CustomModal = ({ show, handleClose, children, size = "sm", title, okBtnHide = false, backdrop, keyboard = true }) => {
  return (
    <Dialog
      open={show}
      onClose={handleClose}
      disableEscapeKeyDown={!keyboard}
      maxWidth={sizeMap[size] ?? "xs"}
      fullWidth
    >
      <DialogTitle sx={{ p: 1, textAlign: "center", textTransform: "capitalize" }}>
        {title}
      </DialogTitle>
      <DialogContent>
        <div className="container-fluid p-2">
          {children}
        </div>
      </DialogContent>
      <DialogActions sx={{ p: 1 }}>
        {okBtnHide && (
          <Button
            size="small"
            variant="contained"
            className="bg-prim"
            onClick={handleClose}
            sx={{ mx: "auto" }}
          >
            <i className="fa-solid fa-check"></i>&nbsp;OK
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CustomModal;
