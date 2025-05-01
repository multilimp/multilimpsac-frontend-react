import LinearProgress from "@mui/material/LinearProgress";

const Loader = () => (
  <div style={{ position: "fixed", top: 0, left: 0, zIndex: 1301, width: "100%" }}>
    <LinearProgress color="primary" />
  </div>
);

export default Loader;
