# MERN Authentication

A backend authentication system built with the MERN stack, featuring secure user authentication, OTP verification, JWT access/refresh tokens, refresh token rotation, and session management.

## Features

* User signup and signin
* OTP-based account verification
* JWT access and refresh tokens
* Refresh token rotation
* Session management
* Logout from current device
* Logout from all devices
* Protected user information endpoint

## API Endpoints

| Method | Endpoint      | Description                                          |
| ------ | ------------- | ---------------------------------------------------- |
| POST   | `/signup`     | Register a new user                                  |
| POST   | `/signin`     | Login user                                           |
| POST   | `/verify-otp` | Verify OTP                                           |
| GET    | `/user`       | Get authenticated user information                   |
| GET    | `/refresh`    | Generate a new access token and rotate refresh token |
| GET    | `/logout`     | Logout from current device                           |
| GET    | `/logout-all` | Logout from all active sessions                      |

## Tech Stack

* Node.js
* Express.js
* MongoDB
* Mongoose
* TypeScript
* JWT
* bcrypt
* crypto
