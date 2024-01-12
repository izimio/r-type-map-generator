import { Box } from "@mui/material";

const Footer = () => {
  return (
    <Box
      sx={{
        position: "absolute",
        bottom: "0",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <p
        style={{
          textAlign: "center",
          padding: "0px",
          margin: "0px",
        }}
      >
        Made with ❤️ by <a href="https://github.com/izimio">izimio</a>
      </p>
      <p style={{ textAlign: "center", fontSize: 11 }}>
        R-Type 2024 - Paul Laban, Baptiste Leroyer, Loïs Maneux, Arthur Pahon,
        Joshua Brionne
      </p>
    </Box>
  );
};

export default Footer;