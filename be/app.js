const express = require("express");
const userRouter = require("./routes/user");
const PORT = process.env.PORT || 8801;
const app = express();
const cors = require("cors");

app.use(cors());

app.use(express.json());
app.use("/api", userRouter);

app.listen(PORT, () => {
  console.log(`Connected to port ${PORT}`);
});
