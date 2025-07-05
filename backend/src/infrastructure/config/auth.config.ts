const jwtConfig = {
    secret: process.env.JWT_SECRET || 'default-jwt-secret-for-development',
    accessTokenExpiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN || '1h',
    refreshTokenExpiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || '7d',
};

export default jwtConfig;