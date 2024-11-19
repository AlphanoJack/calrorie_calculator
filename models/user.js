import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        minLength: 6,
    },
    name: {
        type: String,
    },
    nickname: {
        type: String,
        minLength: 4,
    },
    createAt: {
        type: Date,
        default: Date.now,
    },
});

userSchema.pre('save', async function(next) {
   if (!this.isModified('password')) return next();

   try {
       const salt = await bcrypt.genSalt(10);
       this.password = await bcrypt.hash(this.password, salt);
   } catch (error) {
       console.error(error);
       next(error);
   }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
}

export default mongoose.model('User', userSchema);