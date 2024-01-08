import React, { useState } from "react";
import { Modal, Box, Button } from "@mui/material";
import UpdateTileAttributes from "./modules/UpdateTileAttributs";
import toast from "react-hot-toast";

export interface IEntityAttributes {
  health: number;
  speed: number;
  sprite: string;
  config: {
    range?: number;
  };
}
interface EditDefaultEntityAttributsModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultEntityAttributes: IEntityAttributes;
  setDefaultEntityAttributs: (entityAttributes: IEntityAttributes) => void;
}

const EditDefaultEntityAttributsModal: React.FC<
  EditDefaultEntityAttributsModalProps
> = ({
  isOpen,
  onClose,
  defaultEntityAttributes,
  setDefaultEntityAttributs,
}) => {
  const [entityAttributes, setEntityAttributes] = useState<IEntityAttributes>(
    defaultEntityAttributes
  );

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          borderRadius: "10px",
          position: "absolute",
          width: 500,
          maxHeight: "700px",
          bgcolor: "#1a1a1a",
          boxShadow: 24,
          p: 2,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          "&:focus": {
            outline: "none",
          },
        }}
      >
        <UpdateTileAttributes
          EntityAttributes={entityAttributes}
          setEntityAttributs={setEntityAttributes}
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "end",
            gap: "10px",
            marginTop: 5,
          }}
        >
          <Button
            variant="outlined"
            onClick={() => {
              setDefaultEntityAttributs(entityAttributes);
              toast.success("Entity Attributes updated");
              onClose();
            }}
            style={{ marginRight: "10px" }}
          >
            Update
          </Button>
          <Button color="warning" onClick={onClose}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditDefaultEntityAttributsModal;
