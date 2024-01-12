import { Box } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import WrappedIcon from "./WrappedIcon";
import { useNavigate } from "react-router-dom";

interface TitleProps {
  title: string;
}

const TitleBack = (props: TitleProps) => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: "10px",
      }}
    >
      <WrappedIcon
        icon={
          <ArrowBackIcon
            sx={{
              scale: "1.5",
            }}
          />
        }
        title="Go back to Hub"
        callback={() => {
          navigate("/");
        }}
      />
      <h1>{props.title}</h1>
    </Box>
  );
};

export default TitleBack;
