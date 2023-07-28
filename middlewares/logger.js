const fs = require('fs');
const path = require('path');

function logger(fileName, obj) {
  const logPath = path.resolve((process.cwd(), fileName));

  fs.readFile(logPath, (err, data) => {
    const logs = data ? JSON.parse(data.toString()) : { table: [] };

    logs.table.push(obj);

    fs.writeFile(logPath, JSON.stringify(logs), (writeErr) => {
      // eslint-disable-next-line no-console
      console.log('werr', writeErr);
    });
  });
}

function apiLogger(req, res, next) {
  const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

  logger('request.log', {
    url,
    date: new Date(),
  });

  next();
}

module.exports = { apiLogger, logger };
