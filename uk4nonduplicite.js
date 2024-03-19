const http = require('http');
const fs = require('fs');

const PORT = 3000;

function readCounter(callback) {
    fs.readFile('counter.txt', 'utf8', (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                fs.writeFile('counter.txt', '0', (err) => {
                    if (err) {
                        callback(err);
                    } else {
                        console.log('Counter file created with initial value 0');
                        callback(null, 0);
                    }
                });
            } else {
                callback(err);
            }
        } else {
            callback(null, parseInt(data));
        }
    });
}

function increaseCounter() {
    readCounter((err, counterValue) => {
        if (err) {
            console.error('Error reading counter:', err);
        } else {
            const newValue = counterValue + 1;
            writeCounter(newValue, (err) => {
                if (err) {
                    console.error('Error updating counter:', err);
                } else {
                    console.log('Counter increased to', newValue);
                }
            });
        }
    });
}

function decreaseCounter(){
    readCounter((err, counterValue) => {
        if (err) {
            console.error('Error reading counter:', err);
        } else {
            const newValue = counterValue - 1;
            writeCounter(newValue, (err) => {
                if (err) {
                    console.error('Error updating counter:', err);
                } else {
                    console.log('Counter decreased to', newValue);
                }
            });
        }
    });
}

function writeCounter(value, callback){
    fs.writeFile('counter.txt', value.toString(), (err) => {
        if (err) {
            callback(err);
        } else {
            callback(null);
        }
    });
}

const server = http.createServer((req, res) => {
    const url = req.url;

    if (url === '/increase') {
        increaseCounter();
        res.end('Counter increased');
    }
    else if (url === '/decrease') {
        decreaseCounter();
        res.end('Counter decreased');
    }
    else if (url === '/read') {
        readCounter((err, data) => {
            if (err) {
                console.error('Error reading counter:', err);
                res.writeHead(500);
                res.end('Internal Server Error');
            } else {
                res.end(data.toString());
                console.log(`counter value is `, data)
            }
        })
    }
    else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
