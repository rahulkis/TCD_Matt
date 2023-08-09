const auth = (req,res,next)=>{
    if(req.isAuthenticated()){
        if(req.hasOwnProperty('user')){
            if(req.user.user_type === 1 || req.user.user_type === 3){
                return next()
            }
        }
    }
    req.flash('error_msg','Please login to view this resource')
    res.redirect('/admin/login')
}

const checkUserNotLogin = (req, res, next)=>{
    if(req.isAuthenticated()){
        if(req.hasOwnProperty('user')){
            if(req.user.user_type === 1 || req.user.user_type === 3){
                return res.redirect('/admin/dashboard')
            }
        }
    }
    return next()
}
module.exports = {
    ensureAuthenticated:auth,
    checkUserNotLogin:checkUserNotLogin,
}