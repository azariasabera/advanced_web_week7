const express = require('express')
const app = express()
const port = 3000
const bcrypt = require('bcryptjs');

let users = []

app.set('view-engine', 'pug')   
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

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
            res.send("User already exists!")
        }

    } catch (error) {
        res.status(400).send(`Error occured: ${error}`)
    }
})

app.get('/api/user/list', (req, res)=>{
    res.json(users)
})

app.listen(port, ()=>{
    console.log(`Listening to port ${port}`)
})