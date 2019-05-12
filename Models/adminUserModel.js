const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const common = {
    type: String,
    required: true,
    trim: true
};

const adminUserSchema = new Schema({
    name: String,
    email: {
        ...common
    },
    password: {
        ...common
    },
    accountStatus: String,
    isActivated: Boolean,
    activateToken: String
});

const AdminUser = mongoose.model("AdminUser", adminUserSchema);

module.exports = AdminUser;
