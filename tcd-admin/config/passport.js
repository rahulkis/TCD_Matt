const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')

const User = require('../src/models/usersModel')

module.exports = function(passport){
    passport.use(
        new LocalStrategy({usernameField:'email'},(email,password,done)=>{
            User.findOne({email:email,is_deleted:0})
            .then(user=>{
                if(!user){
                    return done(null,false,{message:'No user exist with this email'})
                }
                bcrypt.compare(password,user.password,(err,isMatch)=>{
                    if(err) throw err;
                    if(isMatch){
                        return done(null,user)
                    }else{
                        return done(null,false,{message:'Incorrect Password'})
                    }
                })
            })
            .catch(err=>console.log(err))
        })
    );
    passport.serializeUser((user,done)=>{
        done(null,user.id)
    })
    passport.deserializeUser((id,done)=>{
        User.findById(id,(err,user)=>{
            done(err,user)
        })
    })
}