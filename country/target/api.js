const spawn = require('child_process').spawn;

exports.handler = async function (event, context) {
  const child = spawn('java', ['-jar', 'country-0.0.1-SNAPSHOT.jar'], {
    cwd: __dirname,
  });

  child.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  child.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  child.on('error', (error) => {
    console.error(`error: ${error.message}`);
  });

  child.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });

  return {
    statusCode: 200,
    body: 'Hello from Netlify serverless function!',
  };
};
