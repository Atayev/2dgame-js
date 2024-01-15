const express = require("express");
const app = express();

app.use(express.static("public")); // 'public' is the directory name where your JavaScript files are located
app.use("/src", express.static("src"));
app.listen(3000, () => console.log("Server is running on port 3000"));
