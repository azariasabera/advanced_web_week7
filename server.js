const express = require('express')
const app = express()
const port = 3000
const bcrypt = require('bcryptjs');
const session = require('express-session')

let users = []

app.set('view-engine', 'pug')   
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(session
    ({
        secret: 'secret',
        resave: false,
        saveUninitialized: false
    }))

app.get('/', (req, res) => {
    res.render('index.pug')
})

app.post('/api/user/register', async (req, res)=>{
    try {
        let userCheck = users.find(user => user.username === req.body.username)
        if (!userCheck) { 
            const hashedPassword = await bcrypt.hash(req.body.password, 10)
            const newUser = {
                id: Date.now().toString(), // this is just a temporary solution to generate a unique id
                username: req.body.username,
                password: hashedPassword
            }
            users.push(newUser);
            res.json(newUser)
        } else {
            res.status(400).send("User already exists!")
        }

    } catch (error) {
        res.status(400).send(`Error occured: ${error}`)
    }
})

app.get('/api/user/list', (req, res)=>{
    res.json(users)
})

app.get('/api/user/login', (req, res)=>{
    res.render('login.pug')
});

app.post('/api/user/login', async (req, res)=>{
    let checkUser = users.find(user => user.username === req.body.username)
    if (checkUser) {
        try {
            if (await bcrypt.compare(req.body.password, checkUser.password)) {
                req.session.user = checkUser
                res.send('Login Successful')
            } else {
                res.status(401).send('Login Failed')
            }
        } catch (error) {
            res.status(500).send(`Error occured: ${error}`)
        }
    } else {
        res.status(401).send('User not found')
    }
});

    
app.listen(port, ()=>{
    console.log(`Listening to port ${port}`)
})