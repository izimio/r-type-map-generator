import { useEffect, useState } from "react";
import { socket } from "./socket/socket";
import toast from "react-hot-toast";
import { Box } from "@mui/material";
import GppBadIcon from "@mui/icons-material/GppBad";
import GppGoodIcon from "@mui/icons-material/GppGood";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import TitleBack from "./modules/Title";
import { SMOOTH_BLUE } from "./utils/constants";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const WebSocketChart = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [data, setData] = useState<number[]>([]);

  useEffect(() => {
    function onConnect() {
      toast.success("Connected to server socket");
      setIsConnected(true);
    }

    function onDisconnect() {
      toast.error("Disconnected from server socket");
      setIsConnected(false);
    }

    function onDataEvent(value: string) {
      const parsedValue = Math.round(parseFloat(value));
      if (isNaN(parsedValue)) {
        console.error("Received NaN value from server: ", value);
        return;
      }
      setData((prev) => [...prev, parsedValue]);

    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("data", onDataEvent);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("data", onDataEvent);
    };
  }, []);

  const chartData = {
    labels: data?.map((_, index) => index) || [],
    datasets: [
      {
        label: "Data Consumption",
        data: data,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Data Trafic Chart (octets/s)",
      },
    },
  };

  return (
    <Box sx={{ margin: "20px" }}>
      <TitleBack title="R-TYPE | Serveur Data Trafic" />
      <Box
        sx={{
          display: "flex",
          gap: "0px",
          flexDirection: "column",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <h3
            style={{
              margin: "0px",
            }}
          >
            Connection status:{" "}
          </h3>
          {isConnected ? (
            <GppGoodIcon sx={{ color: "green" }} />
          ) : (
            <GppBadIcon sx={{ color: "red" }} />
          )}
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <h3
            style={{
              margin: "0px",
            }}
          >
            Number of data received:{" "}
          </h3>
          <span>{data.length}</span>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <h3
            style={{
              margin: "0px",
            }}
          >
            Average data received:{" "}
          </h3>
          <span style={{
          }}>{data.length > 0 ? Math.round(data.reduce((a, b) => a + b) / data.length) : 0} octets/s</span>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <h3
            style={{
              margin: "0px",
            }}
          >
            Reset Chart:{" "}
          </h3>
          <RestartAltIcon
            sx={{
              color: SMOOTH_BLUE,
              cursor: "pointer",
              padding: "5px",
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.2)",
                borderRadius: "20%",
              },
            }}
            onClick={() => setData([])}
          />
        </Box>
      </Box>
      <hr
        style={{
          border: "1px solid rgba(0, 0, 0, 0.2)",
          marginTop: "20px",
          marginBottom: "20px",
        }}
      />
      <Box sx={{ flex: "1" }}>
        <Line options={options} data={chartData} />
      </Box>
      <p
        style={{
          textAlign: "center",
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

export default WebSocketChart;
