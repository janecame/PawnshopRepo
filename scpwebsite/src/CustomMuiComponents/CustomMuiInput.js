import React from "react";
import PropTypes from "prop-types";
import { TextField, Box, InputAdornment } from "@mui/material";

const CustomMuiInput = ({
  label,
  name,
  value,
  onChange,
  required = false,
  error = false,
  helperText = "",
  placeholder = "",
  disabled = false,
  size = "medium",
  type = "text",
  horizontal = false,
  variant = "outlined",
  multiline = false,
  maxRows,
  minRows,
  sx,
  align = "left",
  suffix = "",
  prefix = ""
}) => {
  const inputLabelProps = type === "date" ? { shrink: true } : {};

  return (
    <Box
      display="flex"
      flexDirection={horizontal ? "row" : "column"}
      alignItems={horizontal ? "center" : "flex-start"}
      gap={1}
      width="100%"
    >
      {horizontal && label && (
        <label htmlFor={name} style={{ minWidth: 100 }}>
          {label}
          {required && <span style={{ color: "red" }}> *</span>}
        </label>
      )}

      <TextField
        fullWidth
        id={name}
        name={name}
        label={!horizontal ? label : undefined}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        size={size}
        type={type}
        error={error}
        helperText={helperText}
        variant={variant}
        multiline={multiline}
        maxRows={maxRows}
        minRows={minRows}
        sx={sx}
        InputLabelProps={inputLabelProps}
        InputProps={{
          startAdornment: prefix ? (
            <InputAdornment position="start">{prefix}</InputAdornment>
          ) : null,
          endAdornment: suffix ? (
            <InputAdornment position="end">{suffix}</InputAdornment>
          ) : null,
        }}
        inputProps={{
          style: { textAlign: align },
        }}
      />
    </Box>
  );
};

CustomMuiInput.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  error: PropTypes.bool,
  helperText: PropTypes.node, 
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  size: PropTypes.oneOf(["small", "medium"]),
  type: PropTypes.string,
  horizontal: PropTypes.bool,
  variant: PropTypes.oneOf(["outlined", "filled", "standard"]),
  multiline: PropTypes.bool,
  maxRows: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  minRows: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
  align: PropTypes.oneOf(["left", "center", "right"]),
  suffix: PropTypes.string,
  prefix: PropTypes.string
};

export default CustomMuiInput;