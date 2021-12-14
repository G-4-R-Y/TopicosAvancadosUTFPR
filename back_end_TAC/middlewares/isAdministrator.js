const isAdministrator = (req, res, next) => {
    console.log(req.user)
    const { userType } = req.user;
    
    if (userType != "Admin") return res.status(403).json({message: "São necessários privilégios de administrador para executar esta ação."});

    return next();
};

module.exports = isAdministrator;