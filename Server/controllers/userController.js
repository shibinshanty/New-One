const User=require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const PendingUser = require('../models/pendingUser');
const nodemailer=require('nodemailer');

//signup
exports.signup = async (req, res) => {
  try {
      const { name, email, password } = req.body;

      // Password regex validation
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(password)) {
          return res.status(400).json({
              message: "Password should have at least 1 uppercase, 1 lowercase, 1 number, 1 special character, and minimum 8 characters"
          });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: 'User already exists' });

      const existingPending = await PendingUser.findOne({ email });
      if (existingPending) await PendingUser.deleteOne({ email });

      const hashedPassword = await bcrypt.hash(password, 10);
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpires = new Date(Date.now() + 5 * 60000);

      const pendingUser = new PendingUser({ name, email, password: hashedPassword, otp, otpExpires });
      await pendingUser.save();

      // Nodemailer transporter setup
      const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS
          }
      });

      const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: 'Your OTP for Registration',
          text: `Hello ${name},\n\nYour OTP is: ${otp}. Please use it within 5 minutes.\n\nThank you!`
      };

      // Sending mail
      await transporter.sendMail(mailOptions)
          .then(() => console.log(`OTP email sent to ${email}`))
          .catch((err) => {
              console.error("Error sending OTP mail:", err);
              return res.status(500).json({ message: 'Failed to send OTP Email', error: err.message });
          });

      // Set the email cookie for the frontend
      const cookieOptions = {
          httpOnly: true,  // This prevents JavaScript from accessing the cookie
          secure: process.env.NODE_ENV === 'production',  // Use secure cookie in production
          maxAge: 24 * 60 * 60 * 1000,  // Cookie expires in 1 day
      };

      res.cookie('email', email, cookieOptions);

      res.status(200).json({ message: 'OTP Sent Successfully! Check Email' });

  } catch (error) {
      console.error("Signup Error:", error);
      res.status(500).json({ message: 'Error', error: error.message });
  }
};



// OTP Verify & User Register

exports.verifyOtp = async (req, res) => {
  try {
    const { otp, email } = req.body;

    if (!otp || !email) {
      return res.status(400).json({ message: "OTP and email are required" });
    }

    // Find the pending user based on the email
    const pendingUser = await PendingUser.findOne({ email });
    if (!pendingUser) {
      return res.status(404).json({ message: "No pending user found" });
    }

    // Check if OTP is expired
    if (new Date() > pendingUser.otpExpires) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    // Check if OTP matches
    if (pendingUser.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Proceed with user registration (move from PendingUser to User model)
    const newUser = new User({
      name: pendingUser.name,
      email: pendingUser.email,
      password: pendingUser.password,
    });

    await newUser.save();
    await PendingUser.deleteOne({ email });  // Clean up pending user

    res.status(200).json({ message: "User Registered Successfully!" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ message: "Error verifying OTP", error: error.message });
  }
};


// Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid Email or Password' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid Email or Password' });

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET, // Ideally, use env variable!
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: 'Login Successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
};

//Profile
exports.getProfile = (req, res) => {
    res.status(200).json({ 
      message: `Welcome, ${req.user.email}!`, 
    });
  };
