import React, { useState } from 'react';
import './MultiSelectDropdown.css';

const MultiSelectDropdown = ({
  label,
  options = [],
  selectedValues = [],
  onToggleOption,
  allSelectedLabel = 'Todas seleccionadas'
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const summaryText =
    selectedValues.length === options.length
      ? allSelectedLabel
      : `${selectedValues.length} seleccionadas`;

  return (
    <div className="ui-multiselect-wrapper">
      {label && <label className="ui-multiselect-label">{label}</label>}
      <div
        className="ui-multiselect-header"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span>{summaryText}</span>
        <span className="ui-multiselect-arrow">▼</span>
      </div>

      {isOpen && (
        <div className="ui-multiselect-dropdown">
          {options.map((opt) => {
            const value = typeof opt === 'object' ? opt.value : opt;
            const text = typeof opt === 'object' ? opt.label : opt;
            const key = typeof opt === 'object' ? (opt.id ?? opt.value) : opt;

            return (
              <label key={key} className="ui-multiselect-item">
                <input
                  type="checkbox"
                  checked={selectedValues.includes(value)}
                  onChange={() => onToggleOption(value)}
                />
                <span>{text}</span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
