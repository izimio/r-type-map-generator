import React, { useEffect, useState } from "react";

interface IPositionStyledInputProps {
  value: string;
  callback: (newValue: string) => void;
}

const PositionStyledInput: React.FC<IPositionStyledInputProps> = ({
  value,
  callback,
}) => {
  const [tmpValue, setTmpValue] = useState<string>(value);

  useEffect(() => {
    setTmpValue(value);
  }, [value]);
  return (
    <input
    style={{
        width: "50px",
        backgroundColor: "transparent",
        border: "none",
        textAlign: "center",
        fontSize: "1rem",
        fontWeight: "bold",
    }}
      type="text"
      value={tmpValue}
      onChange={(e) => setTmpValue(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          callback(tmpValue);
        }
      }}
    />
  );
};

export default PositionStyledInput;
