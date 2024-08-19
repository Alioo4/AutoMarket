const {port} = require("../../config") 

module.exports = async(app) => {
    app.listen(port, () => {
        console.log(`Server running on PORT:${port}`);
    })
};