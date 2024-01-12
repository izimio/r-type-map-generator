import { Box } from "@mui/material";
import SignalCellularAltIcon from "@mui/icons-material/SignalCellularAlt";
import MapIcon from "@mui/icons-material/Map";
import ImageIcon from "@mui/icons-material/Image";
import HandymanIcon from "@mui/icons-material/Handyman";
import { keyframes } from "@mui/system";

import { SMOOTH_ORANGE } from "./utils/constants";
import Footer from "./modules/Footer";
import { useNavigate } from "react-router-dom";

const Hub = () => {
  const navigate = useNavigate();

  const growAnimation = keyframes`
  from {
    transform: scale(2);
  }
  to {
    transform: scale(2.5);
  }
`;

  const styledIconButton = (icon: any, text: string, path: string) => {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "200px",
          height: "200px",
          border: "4px solid #1e1e1e",
          borderRadius: "10px",
          margin: "20px",
          cursor: "pointer",
          "&:hover": {
            backgroundColor: "#1e1e1e",
            color: "#ffffff",
          },
          "&:hover > svg": {
            color: SMOOTH_ORANGE,
            scale: "2",
          },
        }}
        onClick={() => {
          navigate(path);
        }}
      >
        {icon}
        <h2
          style={{
            fontSize: "1.5em",
            fontWeight: "bold",
            userSelect: "none",
          }}
        >
          {text}
        </h2>
      </Box>
    );
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "0px",
          paddingBottom: "0px",
        }}
      >
        <img
          src="https://imgdb.net/storage/uploads/6e899ef07baeb11f169aa9791fe2631c00245a8a700c3df28d740e939aa7c434.png"
          alt="R-Type"
          style={{ width: "50%", height: "auto", textAlign: "center" }}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "30px",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            fontSize: "5em",
            fontWeight: "bold",
            color: "#1b1a1b",
            userSelect: "none",
          }}
        >
          Tools Box
        </h1>
        <HandymanIcon
          sx={{
            marginTop: "20px",
            scale: "1",
            animation: `${growAnimation} 1.5s infinite alternate`,
          }}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        {styledIconButton(
          <SignalCellularAltIcon
            sx={{
              transition: "all 0.5s",
              scale: "1.5",
            }}
          />,
          "Trafic",
          "/trafic"
        )}
        {styledIconButton(
          <MapIcon
            sx={{
              transition: "all 0.5s",
              scale: "1.5",
            }}
          />,
          "Map",
          "/map"
        )}
        {styledIconButton(
          <ImageIcon
            sx={{
              transition: "all 0.5s",
              scale: "1.5",
            }}
          />,
          "Sprite",
          "/sprite"
        )}
      </Box>
      <Footer />
    </Box>
  );
};

export default Hub;
