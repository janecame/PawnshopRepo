import React from 'react';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import PropTypes from 'prop-types';

const sizeMap = {
  normal: 'medium',
  large: 'medium',
  small: 'small',
};

const CustomMuiSelect = ({
  label,
  name,
  value,
  options = [],
  onChange,
  placeholder = 'Select',
  valueKey = 'value',
  labelKey = 'label',
  required = false,
  size = 'normal',
  id = name || 'custom-select',
  disabled = false,
  error = false,
  helperText = ''
}) => {
  const muiSize = sizeMap[size] || 'medium';

  return (
    <TextField
      select
      fullWidth
      variant="outlined"
      id={id}
      name={name}
      label={label}
      value={value === undefined || value === null ? '' : value}
      onChange={onChange}
      disabled={disabled}
      required={required}
      size={muiSize}
      error={error}
      helperText={helperText}
    >
      {!required && (
        <MenuItem value="">
          <em>{placeholder}</em>
        </MenuItem>
      )}

      {options.map((option, index) => (
        <MenuItem 
          key={option[valueKey] ?? index}
          value={option[valueKey]}
        >
          {option[labelKey]}
        </MenuItem>
      ))}
    </TextField>
  );
};

CustomMuiSelect.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array, PropTypes.bool]),
  options: PropTypes.arrayOf(PropTypes.object),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  valueKey: PropTypes.string,
  labelKey: PropTypes.string,
  required: PropTypes.bool,
  size: PropTypes.oneOf(['normal', 'large', 'small']),
  id: PropTypes.string,
  disabled: PropTypes.bool,
  error: PropTypes.bool,
  helperText: PropTypes.string,
};

export default CustomMuiSelect;