/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const [sourcePath, destinationPath] = process.argv.slice(2);

const moveFile = () => {
  if (!sourcePath || !destinationPath) {
    console.error('No source or destination provided');

    return;
  }

  if (!fs.existsSync(sourcePath)) {
    console.error("Source file doesn't exist");

    return;
  }

  let destinationPathFull = destinationPath;
  let isDestinationDirectory = false;

  try {
    isDestinationDirectory = fs.lstatSync(destinationPath).isDirectory();
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.error('Error reading destination path:', err);

      return;
    }
  }

  if (isDestinationDirectory) {
    destinationPathFull = path.join(destinationPath, path.basename(sourcePath));
  }

  if (path.resolve(sourcePath) === path.resolve(destinationPathFull)) {
    console.log('Source and destination paths are the same. Nothing to move.');

    return;
  }

  fs.copyFile(sourcePath, destinationPathFull, (err) => {
    if (err) {
      console.error(err);

      return;
    }

    fs.rm(sourcePath, (error) => {
      if (error) {
        console.error(error);

        return;
      }

      console.log('The file was moved successfully.');
    });
  });
};

moveFile();
