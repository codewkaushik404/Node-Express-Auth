
```
npm init -y

npm install -D typescript tsx @types/node 

npx tsc --init

mkdir src
touch src/index.ts
```

- Hashing converts a password into a one-way value that cannot practically be reversed.
- bcrypt is a password-hashing algorithm designed to make brute-force attacks expensive.
- Salt = a random value added to each password before hashing.
- Salt rounds controls how computationally expensive bcrypt is.
    - 10 means roughly 2¹⁰ work.
    - Increasing the value makes hashing slower and harder to brute-force.
- Methods:
    - bcrypt.hash(<password>, salt-rounds)
    - bcrypt.compare(<password>, <hashed-password>)

- if token is expired jwt.verify() will throw error and middleware doesn't call next()
- 2 tokens can have same payload and be differnt cuz diff tokens have diff iat and exp so diff signatures
    thereby different tokens

#### JWT is composed of 3 parts:
    - Header → algorithm + token type
    - Payload → claims/data like id, role, exp
    - Signature → proves the token wasn't modified
#### How it is created:
    - Header + Payload + Secret Key → Signature
    - Combined as Header.Payload.Signature
#### How it is verified:
    - Server receives the JWT.
    - Server takes the Header + Payload.
    - Uses its secret/private key to calculate a new signature.
    - Compares the calculated signature with the signature in the JWT.
    - Match → token is authentic and unmodified.
    - Doesn't match → token is rejected.

### /refresh endpoint - Refresh Tokens invalidation

- JWTs are stateless, so jwt.verify() only checks whether the token is valid and unexpired. It cannot tell us whether we have revoked that refresh token.
- Therefore, we maintain a session record in the DB for each refresh token/session.
- The refresh token is stored as a bcrypt hash, not in plain text.
- On /refresh:
    - Verify the JWT and extract its sessionId.
    - Use sessionId to find the corresponding session.
    - Check revoked: false.
    - Use bcrypt.compare(refreshToken, session.refreshTokenHash) to check whether the cookie's refresh token is same as the one 
        in session. if not it is refresh token sent from cookie is invalid
- If it matches, generate a new refresh token, hash it, replace the old hash, and save the session.
- Therefore, the old refresh token no longer matches the DB hash and cannot be reused.



