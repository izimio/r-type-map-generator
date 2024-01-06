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
        color: "white",
        float: "right",
        cursor: "pointer",
        marginTop: "10px",
        marginRight: "10px",
        paddingBottom: "10px",
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
