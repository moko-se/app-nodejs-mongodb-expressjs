function authUser(req, res, next){
	if (req.user != null) {
		return next()
	}
	req.flash('error_msg', 'Veuillez vous connecter pour continuer votre navigation');
	res.redirect('/users/signin');
}

const userRole = (permissions) => {
	return (req, res, next) => {
		const roleP = req.user.role;
		if (permissions.includes(roleP)){
			next();
		}else{
			req.flash('error_msg', 'Vous n\'avez pas la permission pour acceder à cette page');
			res.redirect('/');
		}
	}	
}

module.exports = {
	authUser,
	userRole
}