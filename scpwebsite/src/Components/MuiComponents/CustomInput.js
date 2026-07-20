import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@mui/material';
import { formatNumber } from "../../utils/TypeConvertions";

const CustomInput = ({ 
  label, 
  type = "text", 
  name, 
  value,
  onChange, 
  onBlur, 
  required = true, 
  placeholder, 
  disabled = false, 
  size = "medium", 
  pattern, 
  onKeyDown, 
  title = "", 
  className,
  error = false,
  helperText = "",
  decimal = false,
  width
}) => {

  const formattedValue = decimal ? formatNumber(value) : value;

  return (
    <TextField
      className={className}
      fullWidth={!!width}
      sx={{ width: width }}
      label={label}
      type={type}
      name={name}
      value={formattedValue}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      size={size === "large" ? "medium" : size}
      onChange={onChange}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      error={error}
      helperText={error ? helperText : ""}
      inputProps={{
        pattern: pattern,
        title: title,
      }}
      variant="outlined" 
    />
  );
};

// --- Prop Types Definition ---
CustomInput.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  onKeyDown: PropTypes.func,
  required: PropTypes.bool,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large', 'normal']), // 'normal'/'large' mapped for backward compatibility
  pattern: PropTypes.string,
  title: PropTypes.string,
  className: PropTypes.string,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  decimal: PropTypes.bool,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default CustomInput;