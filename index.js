const express = require('express')
const path = require('path')
const app = express();

const audioFolder = './audio/';
const jsonFolder = './json/';
const fs = require('fs');

var audioList
var jsonList

// list files in audio directory
fs.readdir(audioFolder, (err, files) => {
    audioList = files
});

// list files in json directory
fs.readdir(jsonFolder, (err, files) => {
    jsonList = files
});


app.get('/files', (req, res) => {
    data = [audioList, jsonList]
    res.send(data)
})


app.use(express.static(path.join(__dirname, '/')))

// use default port or 5000
const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))

// Serve static files out of the 'public' folder
// app.use(express.static('./'))

// Serve the index.html when users access the 
// root directory using res.sendFile()
// app.get('/', (req, res) => {
//     res.send('hello')
// // res.sendFile(__dirname + '/public/index.html')
// })






// const express = require('express')
// const path = require('path')

// const members = [{
//     id: 1,
//     name: "sam"
// }]


// const app = express();

// // body parser middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }))

// // const logger = (req, res, next) => {
// //     console.log(`${req.protocol}://${req.get('host')}${req.originalUrl}`);
// //     next();
// // }

// // init middleware
// // app.use(logger)

// // gets members
// app.get('/api/members', (req, res) => {
//     res.json(members)
// })

// app.get('/api/members:id', (req,res) => {
//     res.json(members.filter(member => member.id === req.params.id))
// })

// app.post('/api/members', (req, res) => {
//     const newMember = {
//         name: req.body.name
//     }
//     res.json(members)
// })

// app.use(express.static(path.join(__dirname, '/public')))

// // use default port or 5000
// const PORT = process.env.PORT || 5000

// app.listen(PORT, () => console.log(`Server started on port ${PORT}`))

// // Serve static files out of the 'public' folder
// // app.use(express.static('./'))

// // Serve the index.html when users access the 
// // root directory using res.sendFile()
// // app.get('/', (req, res) => {
// //     res.send('hello')
// // // res.sendFile(__dirname + '/public/index.html')
// // })