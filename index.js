const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello, DevOps with CI/CD!");
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


//  ssh -i "C:\Users\USER\.ssh\LandingPageVM_key.pem" azureuser@128.85.44.34