const Account = require('../models/Account');
const argon2 = require('argon2');
const Permission = require('../models/Permission');
const Role = require('../models/Role'); 

// [POST] api/auth/login
const login = async (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, status: 400, message: 'Missed field' });
    }

    try {
        // Tìm tài khoản
        const account = await Account.findOne({ username }).populate('role');
        if (!account) {
            return res.status(401).json({ success: false, status: 401, message: 'Username incorrect' });
        }

        // Xác thực mật khẩu
        const passwordValid = await argon2.verify(account.password, password);
        if (!passwordValid) {
            return res.status(401).json({ success: false, status: 401, message: 'Password incorrect' });
        }

        // Lấy quyền
        const roleId = account.role._id;
        const permissions = await Permission.find({ role: roleId }).populate('function');

        // Tạo danh sách chức năng
        const functions = permissions.map(permission => permission.function);

        // Trả về kết quả
        return res.status(200).json({
            success: true,
            account: {
                ...account.toObject(),
                functions
            }
        });
    } catch (err) {
        console.error('Error in login:', err);
        return res.status(500).json({ success: false, status: 500, message: 'Internal server error' });
    }
};
// [POST] api/auth/register
const register = async (req, res, next) => {
    const { username, password, roleName } = req.body;

    if (!username || !password || !roleName) {
        return res.status(400).json({ success: false, status: 400, message: 'Missed field' });
    }

    try {
        // Kiểm tra xem người dùng đã tồn tại chưa
        const existingAccount = await Account.findOne({ username });
        if (existingAccount) {
            return res.status(400).json({ success: false, status: 400, message: 'Username already exists' });
        }

        // Tìm role theo tên
        const role = await Role.findOne({ name: roleName });
        if (!role) {
            return res.status(400).json({ success: false, status: 400, message: 'Role does not exist' });
        }

        // Mã hóa mật khẩu
        const hashedPassword = await argon2.hash(password);

        // Tạo tài khoản mới
        const newAccount = new Account({
            username,
            password: hashedPassword,
            role: role.id
        });

        // Lưu tài khoản mới vào cơ sở dữ liệu
        await newAccount.save();

        return res.status(201).json({ success: true, status: 201, message: 'Account created successfully' });
    } catch (err) {
        console.error('Error in register:', err);
        return res.status(500).json({ success: false, status: 500, message: 'Internal server error' });
    }
};
module.exports = { login, register };
