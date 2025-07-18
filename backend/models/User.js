const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username: {type: String, required: true},
    fullName: {type: String, required: true},
    email: { type: String, required: true, unique: true, lowercase: true},
    password: {type: String, required: true},
    googleId: { type: String, unique: true, sparse: true },
    profileImageUrl: {type: String, default: null},
    bookmarkedPolls: [{type: mongoose.Schema.Types.ObjectId, ref: "Poll"}],

},{timestamps:true});

//hash password before saving
UserSchema.pre('save', async function (next){
    if(!this.isModified('password'))return next();
    this.password = await bcrypt.hash(this.password,10);
    next();
});

//compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword){
    return await bcrypt.compare(candidatePassword, this.password);
};
module.exports = mongoose.model('User', UserSchema);