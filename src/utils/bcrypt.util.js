import bcrypt from "bcryptjs";
import crypto from "crypto"

export function hashPassword(myPlaintextPassword) {
  try {
    return bcrypt.hashSync(
      myPlaintextPassword,
      parseInt(process.env.BCRYPT_SALT_ROUND)
    );
  } catch (error) {
    console.log("Unable to hash password", error);
    throw error;
  }
}

export function isPasswordCorrect(myPlaintextPassword, hash) {
  return bcrypt.compareSync(myPlaintextPassword, hash);
}

export function generateOtp() {
    return crypto.randomInt(100000, 999999).toString();
  }

export function generateRandomPassword(length) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?";
  const charactersLength = characters.length;

  const randomBytes = crypto.randomBytes(length);
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = randomBytes[i] % charactersLength;
    password += characters[randomIndex];
  }

  return password;
}
