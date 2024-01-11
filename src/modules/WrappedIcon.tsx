import { Icon } from "@mui/material";

const WrappedIcon = ({
  title,
  icon,
  callback,
}: {
  title: string;
  icon: React.ReactNode;
  callback: () => void;
}) => {
  return (
    <Icon
      title={title}
      sx={{
        padding: "5px",
        borderRadius: "5px",
        color: "white",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        "&:hover": {
          color: "#ccd",
          backgroundColor: "#1a1a1a",
        },
      }}
      onClick={() => callback()}
    >
      {icon}
    </Icon>
  );
};

export default WrappedIcon;
