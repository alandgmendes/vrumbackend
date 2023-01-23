import mongoose from 'mongoose';
import { User } from 'realm';
const { Schema } = mongoose;

export default User= new Schema({
  // email field
  email: {
    type: String,
    required: [true, "Please provide an Email!"],
    unique: [true, "Email Exist"],
  },
  
  // name field
  name: {
    type: String,
    required: [true, "Please provide a name!"],
  },

  // lastname field
  lastname: {
    type: String,
    required: [true, "Please provide a lastame!"],
  },
  
   // lastname field
   cpf: {
    type: String,
    required: [true, "Please provide a cpf!"],
  },

  //   password field
  password: {
    type: String,
    required: [true, "Please provide a password!"],
    unique: false,
  },
});

// export UserSchema
//const User = ("User", UserSchema);
//export default User;
//module.exports = mongoose.model('User', UserSchema);