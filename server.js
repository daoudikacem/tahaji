const http = require('http');
const fs = require('fs');
const path = require('path');

const hostname = '127.0.0.1';
const port = 3000;

// Check if server is already running
if (global.serverRunning) {
  console.log('Server is already running');
  process.exit(0);
}

global.serverRunning = true;

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.pdf': 'application/pdf',
  '.json': 'application/json'
};

const server = http.createServer((req, res) => {
  console.log(`Request: ${req.method} ${req.url}`);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Length': 0
    });
    res.end();
    return;
  }
  
  // Handle API requests for single word
  if (req.method === 'POST' && req.url === '/api/words') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const requestData = JSON.parse(body);
        const newWord = requestData.word;
        
        // Validate word
        if (!newWord || typeof newWord !== 'string') {
          res.writeHead(400, { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          });
          res.end(JSON.stringify({ error: 'Invalid word data' }));
          return;
        }
        
        // Read existing words
        fs.readFile('words.json', 'utf8', (err, data) => {
          if (err) {
            console.error('Error reading words.json:', err);
            res.writeHead(500, { 
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            });
            res.end(JSON.stringify({ error: 'Failed to read words file' }));
            return;
          }
          
          let wordsData;
          try {
            wordsData = JSON.parse(data);
          } catch (parseError) {
            console.error('Error parsing words.json:', parseError);
            res.writeHead(500, { 
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            });
            res.end(JSON.stringify({ error: 'Failed to parse words file' }));
            return;
          }
          
          // Add new word if it doesn't already exist
          if (!wordsData.words.includes(newWord)) {
            wordsData.words.push(newWord);
            
            // Write updated words back to file
            fs.writeFile('words.json', JSON.stringify(wordsData, null, 2), 'utf8', (err) => {
              if (err) {
                console.error('Error writing to words.json:', err);
                res.writeHead(500, { 
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin': '*'
                });
                res.end(JSON.stringify({ error: 'Failed to save word' }));
                return;
              }
              
              res.writeHead(200, { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
              });
              res.end(JSON.stringify({ success: true, message: 'Word added successfully' }));
            });
          } else {
            res.writeHead(200, { 
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            });
            res.end(JSON.stringify({ success: true, message: 'Word already exists' }));
          }
        });
      } catch (error) {
        console.error('Error processing request:', error);
        res.writeHead(400, { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
    return;
  }
  
  // Handle API requests for bulk words
  if (req.method === 'POST' && req.url === '/api/words/bulk') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const requestData = JSON.parse(body);
        const newWords = requestData.words;
        
        // Validate that newWords is an array
        if (!Array.isArray(newWords)) {
          res.writeHead(400, { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          });
          res.end(JSON.stringify({ error: 'Words must be an array' }));
          return;
        }
        
        // Validate that all entries are strings
        if (!newWords.every(word => typeof word === 'string')) {
          res.writeHead(400, { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          });
          res.end(JSON.stringify({ error: 'All words must be strings' }));
          return;
        }
        
        // Read existing words
        fs.readFile('words.json', 'utf8', (err, data) => {
          if (err) {
            console.error('Error reading words.json:', err);
            res.writeHead(500, { 
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            });
            res.end(JSON.stringify({ error: 'Failed to read words file' }));
            return;
          }
          
          let wordsData;
          try {
            wordsData = JSON.parse(data);
          } catch (parseError) {
            console.error('Error parsing words.json:', parseError);
            res.writeHead(500, { 
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            });
            res.end(JSON.stringify({ error: 'Failed to parse words file' }));
            return;
          }
          
          let addedCount = 0;
          
          // Add new words that don't already exist
          newWords.forEach(word => {
            if (!wordsData.words.includes(word)) {
              wordsData.words.push(word);
              addedCount++;
            }
          });
          
          // Write updated words back to file
          fs.writeFile('words.json', JSON.stringify(wordsData, null, 2), 'utf8', (err) => {
            if (err) {
              console.error('Error writing to words.json:', err);
              res.writeHead(500, { 
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
              });
              res.end(JSON.stringify({ error: 'Failed to save words' }));
              return;
            }
            
            res.writeHead(200, { 
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            });
            res.end(JSON.stringify({ 
              success: true, 
              message: 'Words added successfully',
              addedCount: addedCount,
              totalCount: newWords.length
            }));
          });
        });
      } catch (error) {
        console.error('Error processing request:', error);
        res.writeHead(400, { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
    return;
  }
  
  // Handle GET requests for static files
  if (req.method === 'GET') {
    let filePath = '.' + req.url;
    
    // Serve index.html by default
    if (filePath === './') {
      filePath = './index.html';
    }
    
    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';
    
    fs.readFile(filePath, (error, content) => {
      if (error) {
        if (error.code === 'ENOENT') {
          // File not found
          fs.readFile('./404.html', (err, content404) => {
            if (err) {
              res.writeHead(404, { 
                'Content-Type': 'text/html',
                'Access-Control-Allow-Origin': '*'
              });
              res.end('<h1>404 Not Found</h1>', 'utf-8');
            } else {
              res.writeHead(404, { 
                'Content-Type': 'text/html',
                'Access-Control-Allow-Origin': '*'
              });
              res.end(content404, 'utf-8');
            }
          });
        } else {
          // Server error
          console.error('Server error:', error);
          res.writeHead(500, {
            'Access-Control-Allow-Origin': '*'
          });
          res.end(`Server Error: ${error.code}`);
        }
      } else {
        // Success
        res.writeHead(200, { 
          'Content-Type': contentType,
          'Access-Control-Allow-Origin': '*'
        });
        res.end(content, 'utf-8');
      }
    });
    return;
  }
  
  // Handle unsupported methods
  res.writeHead(405, { 
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  });
  res.end(JSON.stringify({ error: 'Method not allowed' }));
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

// Handle shutdown gracefully
process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Server closed');
    global.serverRunning = false;
  });
});

process.on('SIGINT', () => {
  server.close(() => {
    console.log('Server closed');
    global.serverRunning = false;
  });
});