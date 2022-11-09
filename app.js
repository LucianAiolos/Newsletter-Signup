const express = require('express')
const ejs = require('ejs')
const bodyParser = require('body-parser')
const request = require('request')

const app = express()
const PORT = 4000

app.set('views', './src/views')
app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.render('signup')
  // res.send('Hello World')
})

app.post('/signup', (req, res) => {
  console.log(req.body)
  const {email, js} = req.body

  const mcData = {
    members: [
      {
        email_address: email,
        status: "subscribed",
      }
    ]
  }

  const mcDataPost = JSON.stringify(mcData)

  const options = {
    url: 'https://us14.api.mailchimp.com/3.0/lists/07458f6447',
    method: "POST",
    headers: {
      Authorization: "auth 26db32b1b4013898aa32ba63d11119bd-us14"
    },
    body: mcDataPost  
  }

  if(email) {
    request(options, (err, response, body) => {
      if(err) {
        res.json({error: err})
      } else {
        if(js) {
          res.sendStatus(200)
        } else {
          res.redirect('/success')
        }
      }
    })
  } else {
    res.redirect('/failure')
    res.status(404).send({message: 'Failed'})
  }
})

app.get('/success', (req, res) => {
  res.send('success')
})

app.get('/failure', (req, res) => {
  res.render('failure')
})


app.listen(PORT, ()=> console.log('listening on ', PORT))
