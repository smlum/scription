// error stuff
(function() {
    var childProcess = require("child_process");
    var oldSpawn = childProcess.spawn;
    function mySpawn() {
        console.log('spawn called');
        console.log(arguments);
        var result = oldSpawn.apply(this, arguments);
        return result;
    }
    childProcess.spawn = mySpawn;
})();

const express = require('express')
const path = require('path')
const app = express();
const fs = require('fs');

app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));


// trying to get python to work

const {PythonShell} = require('python-shell');

PythonShell.runString('print("hi")', null, function (err) {
    if (err) throw err;
    console.log('finished');
    });

console.log('hey');

// the below works!
// const {spawn} = require('child_process');
// app.get('/py', (req, res) => {
//     var dataToSend;
//     // spawn new child process to call the python script
//     const python = spawn('python', ['script.py']);
//     // collect data from script
//     python.stdout.on('data', function (data) {
//     console.log('Pipe data from python script ...');
//     dataToSend = data.toString();
//     });
//     // in close event we are sure that stream from child process is closed
//     python.on('close', (code) => {
//     console.log(`child process close all stdio with code ${code}`);
//     // send data to browser
//     res.send(dataToSend)
//     });
// })

// var sassMiddleware = require('node-sass-middleware');

// note the filename was so hard to get right
// it needs the process path to find the correct place
const audioFolder = `${process.resourcesPath}/app/audio/`;
const jsonFolder = `${process.resourcesPath}/app/json/`;
const saveFolder = `${process.resourcesPath}/app/saves/`;

// // want to try save files to the repository to load from there
// fs.writeFile("../saves", "Hey there!", function(err) {
//     if(err) {
//         return console.log(err);
//     }
//     console.log("The file was saved!");
// }); 

var audioList
var jsonList

// if (app.get('env') == 'development') {
//     var browserSync = require('browser-sync');
//     var config = {
//         files: ["**/*.html", "dist/css/*.css", "**/*.js", "sass/**/*.scss"],
//         logLevel: 'debug',
//         logSnippet: false,
//         reloadDelay: 3000,
//         reloadOnRestart: true
//     };
//     var bs = browserSync(config);
//     app.use(require('connect-browser-sync')(bs));
// }

// TODO fix. tried to add this, it didn;t work, 
// app.use(sassMiddleware({
//     /* Options */
//     src: path.join(__dirname, 'src/scss'),
//     dest: path.join(__dirname, 'dist/css'),
//     debug: true,
//     indentedSyntax : false,
//     outputStyle: 'compressed',
//     // prefix:  '/dist/css'  // Where prefix is at <link rel="stylesheets" href="prefix/style.css"/>
// }));


// list files in audio directory
fs.readdir(audioFolder, (err, files) => {
    audioList = files
});

// list files in json directory
fs.readdir(jsonFolder, (err, files) => {
    jsonList = files
});

// list files in save directory
fs.readdir(saveFolder, (err, files) => {
    saveList = files
});


app.get('/files', (req, res) => {
    data = [audioList, jsonList, saveList]
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