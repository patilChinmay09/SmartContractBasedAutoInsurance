const express = require('express');
const path = require('path');
const app = express();

app.get("/", (req, res)=>{
    res.sendFile(path.join(__dirname+"/build/index.html"))
})

// Start the Express server
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});