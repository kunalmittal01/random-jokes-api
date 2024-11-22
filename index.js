// const http = require('http');
// const url = require('url');
const express = require('express');
const app = express();
const {getRandomJoke} = require('one-liner-joke');
const fs = require('fs');
require('dotenv').config();
// const server = http.createServer((req, res) => {
//     res.setHeader('Content-Type', 'text/plain');
//     res.statusCode = 200;
//     res.setHeader('X-Powered-By', 'Node.js');
//     res.setHeader('Server', 'MyCustomServer');
//     console.log(req.url);
//     if(req.method === 'GET') {
//         if(req.url.includes('/api')) {
//             const purl = url.parse(req.url,true)
//             console.log(purl.query.q);
            
//             res.end(purl.query.q);
//         }
//     }
//     else {
//         res.end('Hello, World!\n');
//     }
    
// })
const jokes = [];
for(let i = 0; i < 40; i++) {
    const joke = getRandomJoke();
    joke.id = i + 1;
    jokes.push(joke);
}

app.use((req,res,next)=>{
    const ip = req.ip;
    const method = req.method;
    const timestamp = new Date().toISOString();
    const data = `\nip :${ip}\ntimestamp: ${timestamp}\nmethod :${method}\n`;
    fs.appendFileSync('log.txt',data);
    next();
})
app.get('/jokes', (req,res)=>{
    console.log(req.query=={});
    console.log(jokes);
    if(!req.query.limit && !req.query.page) {
        res.status(200).json({
        status: 'success',
        results: jokes,
    });
    console.log(jokes);
    return;
    }
    const {page,limit} = req.query;
    const pageNo = Number(page);
    const size = Number(limit);
    const start = (pageNo-1)*size;
    const end = start+size-1;
    const data = jokes.slice(start,end+1);
    res.status(200).json({
        status: 'success',
        results: data,
        pages: Math.ceil(jokes.length/data.length)
    });
})

app.get('/jokes/random',(req,res)=>{
    res.status(200).json({
        status: 'success',
        results: jokes[parseInt(Math.random()*jokes.length)],
    });
})

app.get('/joke/:id',(req,res)=>{
    const id = req.params.id;
    const joke = jokes.find(ele=>ele.id==id);
    res.status(200).json({
        status: 'success',
        results: joke,
    });
})

app.use('*',(req,res)=>{
    res.status(404).json({
        status: false,
        results: []
    })
})
app.listen(process.env.port, () => {
    console.log(`Server is running at ${process.env.endpoint}`);
})