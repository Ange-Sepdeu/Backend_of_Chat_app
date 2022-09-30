const db = require('../db/db');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
// const io = require('socket.io')(7000, {
//     cors: {
//         origin: [true]
//     }
// });


function between(min, max) {  
    return Math.floor(
      Math.random() * (max - min) + min
    )
  }

    const register = (req, res) => {
    const email = req.body.email;
    db.query(`SELECT COUNT(*) AS number FROM users WHERE email = ?`, [email], (err, result)=> {
        if(err) throw err;
        else {
            if(result[0].number > 0) {
               return res.status(250).send("Email already exists!!");
            }
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user:  'wechatapp01@gmail.com',
                    pass: 'ahrdhqjyxsclcmiw'
                }
            });   
            const code = between(1000000, 9999999);
            const mailOptions = {
                from: 'wechatapp01@gmail.com',
                to: `${req.body.email}`,
                subject: 'WeChat Verification Steps',
                text: `Your activation code is ${code}`
            }
            transporter.sendMail(mailOptions, (err, info) => {
                if(err) console.log(err)
                else{
                    console.log(`Email sent ${info.response}`);
                    db.query("INSERT INTO activate(name, code) VALUES(?,?)", [req.body.name, code], (err, result)=>{
                        if(err) throw err
                        else{
                           return res.status(200).send('Check your mail!!!');
                        }
                    });  
                }
                });
        }
    });
    return;
}

function updateUser(initName,initEmail,updatedEmail,updatedName, res) {
    db.query("SELECT COUNT(*) AS numUser FROM users WHERE email=?", [updatedEmail], (err, row)=>{
        if(err) throw err;
        else{
            if(row[0].numUser > 0) {
                return res.status(250).send("That Email is taken");
            }
            else {
                db.query("UPDATE users set email=?, username=? WHERE email=?", [updatedEmail, updatedName, initEmail], (err, row)=>{
                    if(err) throw err
                    else{
                        res.status(200).send("Success");
                    }
                })
            }
        }
    })
}

const activateAccount = async (req, res) => {
    const email = req.params.email;
    const name = req.params.name;
    const hashedPassword =  await bcrypt.hash(req.params.password, 10);
    const code = req.body.code
    db.query('SELECT COUNT(*) AS number FROM activate WHERE code = ?', [code], (err, row) => {
        if(err) throw err;
        else {
            if(row[0].number===0) {
                return res.status(403).send('Invalid code');
            }   
            db.query("INSERT INTO users(username, email, password) VALUES(?,?,?)", [name,email, hashedPassword], (err, result)=>{
                if(err) throw err
                else{
                   return res.status(200).send('Success');
                }
            });
        }
    })

}

const updateSelf = (req, res) => {
    const initName = req.params.name;
    const initEmail = req.params.email;
    const updatedName = req.body.name;
    const updatedEmail = req.body.email;
    updateUser(initName,initEmail, updatedEmail, updatedName, res)
}

 const getFriends = (req, res) => {
    var friend = [];
    const email = req.params.email
    db.query("SELECT username, email FROM users WHERE email != ?", [email], (err, row)=>{
        if(err) throw err
        else{
            for(let i=0;i<row.length;i++) {
                friend.push(row[i]);
            }
            return res.status(200).send(friend);
        }
    })
}

const Login =  async (req, res) => {
const email = req.body.email;
const pass = req.body.password;
db.query("SELECT COUNT(*) AS number FROM users WHERE email=?", [email], (err, row)=> {
    if(err) throw err
    else {
        if(row[0].number===0) {
            return res.status(250).send("Incorrect email");
        }
        db.query("SELECT password as passwd, username as name FROM users WHERE email=?",[email], async (err, row)=>{
            if(err) throw err
            else {
                const passdb = row[0].passwd;
                if(await bcrypt.compare(pass,passdb)) {
                    return res.status(200).send(row[0].name);
                }
                return res.status(250).send("Incorrect password");
            }
        })
    }
});
}

module.exports = {register, activateAccount, updateSelf, getFriends, Login}