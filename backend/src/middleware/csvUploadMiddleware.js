const MAX_BYTES = 5 * 1024 * 1024;

function csvUpload(req, res, next) {
  const contentType = req.headers['content-type'] || '';
  const match = contentType.match(/multipart\/form-data;\s*boundary=([^;]+)/i);
  if (!match) {
    const error = new Error('CSV upload must use multipart/form-data');
    error.statusCode = 415;
    return next(error);
  }

  const boundary = `--${match[1].replace(/^"|"$/g, '')}`;
  const chunks = [];
  let bytes = 0;
  let rejected = false;

  req.on('data', (chunk) => {
    if (rejected) return;
    bytes += chunk.length;
    if (bytes > MAX_BYTES) {
      rejected = true;
      const error = new Error('CSV file is too large (maximum 5 MB)');
      error.statusCode = 413;
      return next(error);
    }
    chunks.push(chunk);
  });
  req.on('error', next);
  req.on('end', () => {
    if (rejected) return;
    try {
      const body = Buffer.concat(chunks).toString('utf8');
      const parts = body.split(boundary);
      let fileContent = null;
      for (const part of parts) {
        const separator = part.indexOf('\r\n\r\n');
        if (separator < 0 || !/filename\s*=\s*"[^"]+"/i.test(part.slice(0, separator))) continue;
        fileContent = part.slice(separator + 4).replace(/\r\n--?\s*$/, '');
        break;
      }
      if (fileContent === null) {
        const error = new Error('Attach a CSV file using the file field');
        error.statusCode = 400;
        return next(error);
      }
      req.csvText = fileContent;
      return next();
    } catch (error) {
      error.statusCode = 400;
      return next(error);
    }
  });
}

module.exports = csvUpload;
