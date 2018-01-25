const superagent = require('superagent')
const express = require('express')
const path = require('path')
const fs = require('fs')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

let cookie = ''

superagent
  .post('https://dl.007vin.com/login?username=15372437075&password=peipeiyun123')
  .end((err, res) => {
    if(err) console.log(err)
    console.log(res.body)
    cookie = res.header['set-cookie']
    // console.log(cookie)
  })

// app.use(express.static(__dirname)) // 使用本地资源

// 桥接线上路径到本地
app.get("*.*", (req, res) => {
  let path = req.path

  fs.readFile(__dirname + path, (err, data) => {
    if(!data) {res.end(data); return}

    data = data.toString()
    if(req.path.includes('.html')) data = data.replace(/https:\/\/cdns.007vin.com\//g, '')
    res.end(data)
  })
})

app.get('/*', (req, res) => {
  superagent
    .get(`https://dl.007vin.com${req.url}`)
    .send(req.query)
    .set('Content-Type', 'application/json;charset=UTF-8')
    .set('Cookie', cookie)
    .end((err, resResponse) => {
      if(err) console.log(err)
      else res.end(JSON.stringify(resResponse.body))
    })
})

app.post('/*', (req, res) => {
  let query = ''
  Object.keys(req.body).forEach(key => {
      query += `${key}=${req.body[key]}&`
  })
  req.body = query.replace(/&$/, '')

  superagent
    .post(`https://dl.007vin.com${req.url}?${req.body}`)
    .send(req.body)
    .set('Content-Type', 'application/json;charset=UTF-8')
    .set('Cookie', cookie)
    .end((err, resResponse) => {
      if(err) console.log(err)
      else res.end(JSON.stringify(resResponse.body))
    })
})
// 本地使用修改为 127.0.0.1
app.listen(8080, "10.48.108.209", err => {
  console.log("run in http://10.48.108.209:8080")
})