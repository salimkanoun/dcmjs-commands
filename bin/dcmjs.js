#!/usr/bin/env node
import { Command } from 'commander';
import { readDicom, writeDicom, instanceDicom, dumpDicom, modifyDicom } from '../src/index.js';

const program = new Command();

program
  .name('dcmjs')
  .description('dcmjs based tools for manipulation DICOM files')
  .version('0.0.1')

program.command('dump')
  .description('Dump a dicom file')
  .argument('<part10>', 'part 10 file')
  // .option('-s, --separator <char>', 'separator character', ',')
  .action(async (fileName, _options) => {
    const dicomDict = readDicom(fileName);
    dumpDicom(dicomDict);
  });

program.command('instance')
  .description('Write the instance data')
  .argument('<part10>', 'part 10 file')
  .option('-p, --pretty', 'Pretty print')
  .action(async (fileName, options) => {
    const dicomDict = readDicom(fileName);
    instanceDicom(dicomDict, options);
  })


function assignment(value, dummyPrevious) {
  return value.split('=');
}

program.command('modify')
  .description('Change values in the dicom header')
  .argument('<part10in>', 'part 10 input file path')
  .option('-l, --logLevel <level>', 'logging level, TRACE, DEBUG, INFO, WARN, ERROR, default: WARN')
  .option('-o, --out <part10out>', 'part 10 output file path')
  .requiredOption('-r, --replace <tag>=<value>', 'Replace or add tag value', assignment)
  .action(async (fileName, options) => {
    let dicomDict = readDicom(fileName);
    dicomDict = modifyDicom(dicomDict, options);
    writeDicom(options.out, dicomDict);
  })

  program.command('rewrite')
  .description('Change values in the dicom header')
  .argument('<part10in>', 'part 10 input file path')
  .option('-l, --logLevel <level>', 'logging level, TRACE, DEBUG, INFO, WARN, ERROR, default: WARN')
  .option('-o, --out <part10out>', 'part 10 output file path')
  .action(async (fileName, options) => {
    let dicomDict = readDicom(fileName);
    writeDicom(options.out, dicomDict);
  })

program.parse();
