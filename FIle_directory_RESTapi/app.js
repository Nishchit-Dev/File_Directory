const express_ = require('express');
const app = express_();
const fs = require('fs')

const des = './public';
const log_add = 'Logs'


var log = (name, work, result) => {

    var data = `User : ${name}, Logged :${Date.now()}, Performed :${work} ,Result :${result}\n`;

    fs.exists(log_add, (exist) => {

        if (exist) {
            fs.appendFile(log_add, data, (err) => {
                if (err) {
                    throw err;
                } else {
                    console.log("Log file is updated " + name)
                }
            })

        } else {
            fs.writeFile(log_add, data, (err) => {
                if (err) {
                    throw err;
                } else {
                    console.log("log file is created & updated " + name)
                }
            })

        }
    })
}


app.get('/txt/:id', (req, res) => {
    var params = req.params.id.split("=")
    var user = params[1];
    fs.exists(des + '/' + params[1], (exist) => {
        if (exist) {

            var obj = {
                Result: 'Failure',
                Error: 'File Already Exist',
                User: user
            }
            res.send(obj)

            log(user, "Create", 'Failure')
            return;
        } else {
            res.send('your file is created')
            res.end()
            fs.writeFile(des + '/' + params[1], `hello its ${params}`, 'utf8', (err, result) => {
                if (err) {
                    throw err;
                } else {
                    console.log(`file created successfully ${params[1]}`)
                    log(user, 'Create', 'Successfully')

                }
            })

        }
        return

    })


})

app.get('/updateTxt/:id/:data', (req, res) => {
    var k = req.params.id.split('=');
    let o = k[1];

    fs.exists(des + '/' + o, (exist) => {
        if (!exist) {

            var obj = {
                Result: 'Failure',
                Error: 'File Does Not Exist',
                user: o,
            }
            res.send(obj)
            res.end()
            log(o, 'Update', 'Failure')
        } else {

            var p = req.params.data.split("=");
            var data_ = p[1];

            fs.appendFile(des + '/' + o, " " + data_, (err) => {
                if (err) {
                    throw err;
                } else {
                    var obj = {
                        Result: 'Successfully',
                        Error: null,
                        user: o
                    }
                    res.send(obj)
                    res.end()
                }


            })
            log(o, "Update", 'Successfully')

        }


    })

})

app.get('/delete/:id', (req, res) => {
    var file = req.params.id.split('=')[1]
    fs.rm(des + '/' + file, (err) => {
        if (err) {
            log(file, "Delete", "Failure")
            res.send("file does not exist")
            res.end()
        } else {
            res.send("deleted Successfully")
            res.end();
            log(file, "Delete", "Successfully")
        }
    })
})

app.listen(3000, () => {
    console.log("server is listening to 3000...")
})