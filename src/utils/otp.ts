export function generateOtp(){
    //6 digit otp
    return Math.floor(100000 + Math.random()*900000).toString();
}

export function generateHtml(otp : string){
    return (
        `
        <html>
            <body>
                Hi there ${otp}
            </body>
        </html>
        `
    )
}