import { Option, program } from '@commander-js/extra-typings';

import * as fs from 'fs';
import { isSupportedCase, SupportedCase } from '../common/cases';

run();

function run() {
  const command = program
    .name('convert-case')
    .summary('simple CLI application to convert input text to a specified case')
    .description('converts and outputs text to a specified case')
    .version('0.1.0')
    .requiredOption(
      '-i, --input-text <input-text>',
      'input text must be provided',
    )
    .option(
      '-dl, --delimiter <delimiter>',
      'delimiter to separate input text by',
    )
    .option(
      '-o, --output-file-location <output-file-location>',
      'output location (skip for stdout)',
    )
    .addOption(
      new Option(
        '-c, --which-case <which-case>',
        'change case to specified case',
      )
        .choices(['uppercase', 'lowercase'])
        .makeOptionMandatory(),
    )
    // .configureHelp({
    //   sortSubcommands: true,
    //   sortOptions: true,
    // })
    .configureOutput({
      outputError: (str, write) => write(errorColor(str)),
    })
    .showHelpAfterError()
    .parse(process.argv); // you can omit process.argv

  const { inputText, delimiter, whichCase, outputFileLocation } =
    command.opts();

  if (inputText === 'error') {
    program.error("Let's cause some error 'cause it's fun", {
      exitCode: 2,
      code: 'input.error',
    }); // exits
  }

  if (!isSupportedCase(whichCase)) {
    // This code will never run
    program.error(`${whichCase} is not a supported case`, {
      code: 'fatal.error',
    });
  }

  let outputText = inputText;
  if (delimiter) {
    const outputTextArray = inputText.split(delimiter);

    outputTextArray.map((text) => convertCase({ text, whichCase: whichCase }));

    outputText = outputTextArray.join(delimiter);
    if (outputFileLocation) {
      fs.writeFileSync(outputFileLocation, outputText);
    } else {
      console.log(outputText);
    }
  } else {
    outputText = convertCase({
      text: outputText,
      whichCase,
    });

    if (outputFileLocation) {
      fs.writeFileSync(outputFileLocation, outputText);
    } else {
      console.log(outputText);
    }
  }
}

function convertCase({
  text,
  whichCase,
}: {
  text: string;
  whichCase: SupportedCase;
}): string {
  switch (whichCase) {
    case 'uppercase':
      return text.toUpperCase();
    case 'lowercase':
      return text.toLowerCase();
  }
}

function errorColor(str: string): string {
  // Add ANSI escape codes to display text in red.
  return `\x1b[31m${str}\x1b[0m`;
}
