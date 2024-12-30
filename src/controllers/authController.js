const argon2 = require('argon2');
const Account = require('../models/Account'); 
const Role = require('../models/Role');
const Function = require('../models/Function'); 

// Define the getFunctionsByRole function
const getFunctionsByRole = async (roleId) => {
    try {
        const functions = await Function.find({ role: roleId });
        return functions;
    } catch (err) {
        console.error('Error fetching functions by role:', err);
        throw err;
    }
};

// [POST] api/auth/login
const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const account = await Account.findOne({ username }).populate('role');
        if (!account) {
            return res.status(401).json({ success: false, message: 'Invalid username or password' });
        }

        const isValid = await argon2.verify(account.password, password);
        if (!isValid) {
            return res.status(401).json({ success: false, message: 'Invalid username or password' });
        }

        const role = account.role;
        if (!role) {
            return res.status(500).json({ success: false, message: 'Role not found' });
        }

        const sanitizedAccount = {
            _id: account._id,
            username: account.username,
            role: role.name
        };

        const functions = await getFunctionsByRole(role._id);

        return res.status(200).json({
            success: true,
            account: sanitizedAccount,
            functions
        });
    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// [POST] api/auth/register
const register = async (req, res) => {
    const { username, password, roleName, name } = req.body;

    if (!username || !password || !roleName || !name) {
        return res.status(400).json({ success: false, message: 'Missing field(s)' });
    }

    try {
        // Kiểm tra tài khoản đã tồn tại
        const existingAccount = await Account.findOne({ username });
        if (existingAccount) {
            return res.status(409).json({ success: false, message: 'Username already exists' });
        }

        // Tìm role theo tên
        const role = await Role.findOne({ name: roleName });
        if (!role) {
            return res.status(404).json({ success: false, message: 'Role not found' });
        }

        // Kiểm tra độ mạnh của mật khẩu (ví dụ: tối thiểu 8 ký tự)
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: 'Password must be at least 8 characters long' });
        }

        // Mã hóa mật khẩu
        const hashedPassword = await argon2.hash(password);

        // Tạo tài khoản
        const newAccount = new Account({
            username,
            password: hashedPassword,
            role: role._id,
            name // Ensure the name field is included
        });

        // Lưu vào cơ sở dữ liệu
        await newAccount.save();

        return res.status(201).json({ success: true, message: 'Account created successfully' });
    } catch (err) {
        console.error('Register error:', err);
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

module.exports = { login, register };