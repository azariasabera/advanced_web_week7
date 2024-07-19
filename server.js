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
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        let newUser = {
            id: Date.now().toString(),
            username: req.body.username,
            password: hashedPassword
        }
        users.push(newUser);
        console.log(users)
        res.json(newUser)

    } catch (error) {
        res.status(400).send(`Error occured: ${error}`)
    }
})

app.listen(port, ()=>{
    console.log(`Listening to port ${port}`)
})