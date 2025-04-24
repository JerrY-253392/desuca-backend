import { Admin } from "../../models/adminModal.js";
import bcrypt from 'bcryptjs';

export async function createAdmin(req, res) {
    console.log('reqbody', req.body);
    let { username, email, password } = req.body;


    try {
        const hashedPassword = bcrypt.hashSync(password, 10);

        const isAdminExist = await Admin.findOne({ $or: [{ username }, { email }] });

        if (isAdminExist) {
            return res.status(400).json({
                message: 'Admin with this username or email already exists',
                success: false,
            });
        }

        const newAdmin = new Admin({
            username,
            email,
            password: hashedPassword,
        });

        await newAdmin.save();

        return res.status(201).json({
            message: 'Admin created successfully.',
            success: true,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal server error.',
            success: false,
            issue: error.message,
        });
    }
}

export async function getAdminById(req, res) {
    const { id } = req.params;

    try {
        const admin = await Admin.findById(id);

        if (!admin) {
            return res.status(404).json({
                message: 'Admin not found.',
                success: false,
            });
        }

        return res.status(200).json({
            message: 'Admin found.',
            success: true,
            data: admin,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal server error.',
            success: false,
            issue: error.message,
        });
    }
}

export async function updateAdmin(req, res) {
    const { id } = req.params;
    const { username, email, password, status } = req.body;

    try {
        const updatedData = { username, email, status };

        if (password) {
            updatedData.password = bcrypt.hashSync(password, 10); // Hash the password before updating
        }

        const updatedAdmin = await Admin.findByIdAndUpdate(id, updatedData, { new: true });

        if (!updatedAdmin) {
            return res.status(404).json({
                message: 'Admin not found.',
                success: false,
            });
        }

        return res.status(200).json({
            message: 'Admin updated successfully.',
            success: true,
            data: updatedAdmin,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal server error.',
            success: false,
            issue: error.message,
        });
    }
}

export async function deleteAdmin(req, res) {
    const { id } = req.params;

    try {
        const deletedAdmin = await Admin.findByIdAndDelete(id);

        if (!deletedAdmin) {
            return res.status(404).json({
                message: 'Admin not found.',
                success: false,
            });
        }

        return res.status(200).json({
            message: 'Admin deleted successfully.',
            success: true,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal server error.',
            success: false,
            issue: error.message,
        });
    }
}

export async function getAdmins(req, res) {
    try {
        const admins = await Admin.find();

        return res.status(200).json({
            message: 'Admins fetched successfully.',
            success: true,
            data: admins,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal server error.',
            success: false,
            issue: error.message,
        });
    }
}

export async function whoAmI(req, res) {
    try {
        console.log(req.user);
        
        const users = await Admin.findById(req.user.id).select('-password');
        console.log("users", users);
        
        return res.status(200).json({
            message: 'User fetched successfully.',
            success: true,
            data: users,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal server error.',
            success: false,
            issue: error.message,
        });
    }
}

//EXAMPLE POSTMAN REQUEST BODY FOR CREATE
// {
//     "username": "admin",
//     "email": "admin@example.com",
//     "password": "123456789",
//   },