const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const minimist = require('minimist');
const text2png = require("text-to-image");

const args = minimist(process.argv.slice(2));

if (!args.sourceDir || !args.destinationDir || !args.text) {
    console.error('Missing required parameter(s). Usage: node script.js --sourceDir=<path> --destinationDir=<path> --text=<watermark-text>');
    process.exit(1);
}
const sourceDir = args.sourceDir
const destinationDir = args.destinationDir
const text = args.text

text2png.generate(text, {
    fontSize: 18,
    fontFamily: 'Arial',
    color: "rgba(0, 0, 0, 0.5)",
    bgColor: null,
    padding: 20,
}).then((buffer) => {
    const watermarkPath = "watermark.png";
    fs.writeFileSync(watermarkPath, buffer);

    fs.readdir(sourceDir, (err, files) => {
        if (err) {
        console.error(`Error reading source directory: ${err}`);
        return;
        }
    
        files.forEach((file) => {
        if (path.extname(file) === '.webp') {
            const sourcePath = path.join(sourceDir, file);
            const destinationPath = path.join(destinationDir, file);
            sharp(sourcePath)
            .composite([{ input: watermarkPath, gravity: 'center' }])
            .toFile(destinationPath, (outputErr) => {
                if (outputErr) {
                console.error(`Error writing file: ${outputErr}`);
                }
            });
        }
        });
    });
}).catch((error) => {
    console.error("Error generating watermark image: ", error)
});