import React from 'react';
import { useNavigate } from 'react-router-dom';
import { REYNOSA_LINES } from '@shared/config/lineConfig';

const LineSelector = ({ currentLineId }) => {
  const navigate = useNavigate();

  const handleChange = (event) => {
    const selectedLine = REYNOSA_LINES.find((line) => line.id === event.target.value);
    if (selectedLine) {
      navigate(`/Produccion/${selectedLine.id}`);
    }
  };

  return (
    <select value={currentLineId} onChange={handleChange}>
      {REYNOSA_LINES.map((line) => (
        <option key={line.id} value={line.id}>
          {line.name}
        </option>
      ))}
    </select>
  );
};

export default LineSelector;
