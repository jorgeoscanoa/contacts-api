// Importar la libreria para manejar JWTs
const jwt = require('jsonwebtoken');

// Verifica que haya un token válido en Authorizacion: Bearer<token>

async function authenticate(req, res, next) {
        // Leemos la cabecera Authorization
    const header = req.headers.authorization;
        // Si no viene, error 401
    if (!header) return res.status(401).json({ error : 'Token no proporcionado'});
    
        // Separamos el esquema y el token : Bearer eyj...
    const [scheme, token] = header.split(' ');
        // Comprobar que el esquema sea Bearer
        // Authorization: Bearer ey.....
        // Bearer: Es el esquema que le dice al servidor "Trata este valor como un token de portador"
        // Bearer es el esquema de autenticacion en la cabecera HTTP
    if (scheme !== 'Bearer' || !token){
        return res.status(401).json({ error: 'Formato de token invalido'});
    }

    try {
        // verificacmos y decodificamos el JWT usando la clave secreta
        const payload = jwt.verify(token,process.env.JWT_SECRET);

        // Adjuntamos al objeto `req.user´ID

        req.user = { id:payload.sub, role: payload.role};

        // Llamamos al next () para continuar con la cadena de middlewares

        next();
        
    } catch (err) {
        return res.status(401).json( {error: 'Token invalido o expirado'});
    }

}

//MiddLeware de autorizacion
// Comprueba que el usuario autenticado tenga uno de los roles permitidos

function authorize(rolesPermitidos = []){
    // Devolvemos una funcion middlewre
    return (req, res, next) => {
        // 1.  Si no existe req.user, es que no paso por authenticate ()
        if (!req.user){
            return res
            .status(500)
            .json({error: 'authenticate debe ir antes de authorize'});
        }

        // 2. Si el rol del usuario no esta en la lista, denegamos con 403
        if(!rolesPermitidos.includes(req.user.role)){
            return res
            .status(403)
            .json({error : "No tienes privilegios para estar acción"})
        }

        next();

    };
}

module.exports = { authenticate, authorize};