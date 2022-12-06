const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

const optionsFile = path.join(__dirname, 'options.json');
let optionsJSON = JSON.parse(fs.readFileSync(optionsFile).toString());

const keyWords = optionsJSON['KeyWords'];

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  //Add ObjectScript Modifier
  let disposable = vscode.commands.registerCommand(
    'ownobjectscriptextension.addObjectScriptModifier',
    function () {
      preConditions();

      vscode.window.activeTextEditor.edit(function (editBuilder) {
        let modifiedLines = [];
        for (
          let i = 0;
          i < vscode.window.activeTextEditor.document.lineCount;
          i++
        ) {
          let line = vscode.window.activeTextEditor.document.lineAt(i);
          let newLine = undefined;
          let trimedLine = line.text.toLowerCase().replace(/\s/g, '');

          //Embedded Python
          if (trimedLine.includes('language=python')) {
            i = skipUnitlToken(i, '{', '}');
            continue;
          }

          if (!startsWithKeyword(trimedLine)) {
            newLine = addModifier(
              line.text,
              line.firstNonWhitespaceCharacterIndex
            );
            modifiedLines.push(i + 1);
            editBuilder.delete(line.range);
            editBuilder.insert(new vscode.Position(i, 0), newLine);
          }

          // MultiLine method calls
          if (trimedLine.includes('(') && !trimedLine.includes(')')) {
            i = skipUnitlToken(i, '(', ')');
          }
        }

        if (!optionsJSON['ShowMessages']) return;
        // Show message
        if (modifiedLines.length == 0)
          vscode.window.showInformationMessage('No lines modified!');
        else {
          let message = 'Lines modified:';
          for (let i in modifiedLines) {
            message += ' ' + modifiedLines[i] + ',';
          }
          vscode.window.showInformationMessage(
            message.slice(0, message.length - 1)
          );
        }
      });
      if (optionsJSON['SaveFile'])
        vscode.window.activeTextEditor.document.save();
    }
  );

  //toggle show message
  vscode.commands.registerCommand(
    'ownobjectscriptextension.toggleShowMessages',
    function () {
      optionsJSON['ShowMessages'] = !optionsJSON['ShowMessages'];
      vscode.window.setStatusBarMessage(
        'Show Message: ' + (optionsJSON['ShowMessages'] ? 'ON' : 'OFF'),
        4000
      );

      /* vscode.window
        .showInformationMessage(
          'Show Message: ' + (optionsJSON['ShowMessages'] ? 'ON' : 'OFF'),
          ...[optionsJSON['ShowMessages'] ? 'Turn OFF' : 'Turn ON']
        )
        .then((item) => {
          if (item == 'Turn OFF') {
            optionsJSON['ShowMessages'] = false;
            saveOptions();
          } else if (item == 'Turn ON') {
            optionsJSON['ShowMessages'] = true;
            saveOptions();
          }
        }); */

      saveOptions();
    }
  );

  //toggle save file
  vscode.commands.registerCommand(
    'ownobjectscriptextension.toggleSaveFile',
    function () {
      optionsJSON['SaveFile'] = !optionsJSON['SaveFile'];
      vscode.window.setStatusBarMessage(
        'Save file: ' + (optionsJSON['SaveFile'] ? 'ON' : 'OFF'),
        4000
      );

      /* vscode.window
        .showInformationMessage(
          'Save file: ' + (optionsJSON['SaveFile'] ? 'ON' : 'OFF'),
          ...[optionsJSON['SaveFile'] ? 'Turn OFF' : 'Turn ON']
        )
        .then((item) => {
          if (item == 'Turn OFF') {
            optionsJSON['SaveFile'] = false;
            saveOptions();
          } else if (item == 'Turn ON') {
            optionsJSON['SaveFile'] = true;
            saveOptions();
          }
        }); */
      saveOptions();
    }
  );

  //add keyword
  vscode.commands.registerCommand(
    'ownobjectscriptextension.addKeyWord',
    function () {
      let input = vscode.window.showInputBox({
        placeHolder: 'Add Keyword',
      });
      input.then(function (value) {
        if (value == undefined) return;
        let valueTrimmed = value.toLowerCase().replace(/\s/g, '');
        if (keyWords.includes(valueTrimmed)) return;
        keyWords.push(valueTrimmed);
        saveOptions();
        vscode.window.setStatusBarMessage(
          'KeyWord "' + value + '" added',
          4000
        );
      });
    }
  );

  //remove keyword
  vscode.commands.registerCommand(
    'ownobjectscriptextension.removeKeyWord',
    function () {
      let input = vscode.window.showInputBox({ placeHolder: 'Remove Keyword' });
      input.then(function (value) {
        if (value == undefined) return;
        let valueTrimmed = value.toLowerCase().replace(/\s/g, '');
        if (!keyWords.includes(valueTrimmed)) {
          vscode.window.showErrorMessage('Could not find keyword: ' + value);
          return;
        }
        let index = keyWords.indexOf(valueTrimmed);
        if (index > -1) {
          keyWords.splice(index, 1); // 2nd parameter means remove one item only
        }
        saveOptions();
        vscode.window.setStatusBarMessage(
          'KeyWord "' + value + '" removed',
          4000
        );
      });
    }
  );

  //show keywords
  vscode.commands.registerCommand(
    'ownobjectscriptextension.showKeyWords',
    function () {
      let s = '';
      for (let key in keyWords) s += keyWords[key] + ' , ';
      vscode.window
        .showInformationMessage(s, ...['Add', 'Remove'])
        .then((item) => {
          if (item == 'Add') {
            vscode.commands.executeCommand(
              'ownobjectscriptextension.addKeyWord'
            );
          } else if (item == 'Remove') {
            vscode.commands.executeCommand(
              'ownobjectscriptextension.removeKeyWord'
            );
          }
          console.log(item);
        });
    }
  );

  //open settings
  vscode.commands.registerCommand(
    'ownobjectscriptextension.openSettings',
    function () {
      vscode.workspace
        .openTextDocument(vscode.Uri.file(optionsFile))
        .then((a) => {
          vscode.window.showTextDocument(a, 1, false);
        });
    }
  );

  //add method description template
  vscode.commands.registerCommand(
    'ownobjectscriptextension.addMethodDescriptionTemplate',
    function () {
      preConditions();
      let startLine = undefined;
      let lineAbove = undefined;
      // Find method
      for (
        let i = vscode.window.activeTextEditor.selection.start.line;
        i >= 0;
        i--
      ) {
        let line = vscode.window.activeTextEditor.document.lineAt(i);
        let trimedLine = line.text.toLowerCase().replace(/\s/g, '');
        if (
          trimedLine.startsWith('method') ||
          trimedLine.startsWith('classmethod')
        ) {
          startLine = line;
          if (i == 0) break;
          let lineAboveTmp = vscode.window.activeTextEditor.document.lineAt(
            i - 1
          );
          let trimmedLineAbove = lineAboveTmp.text
            .toLowerCase()
            .replace(/\s/g, '');
          if (trimmedLineAbove.startsWith('///')) {
            if (
              trimmedLineAbove == '///description' ||
              trimmedLineAbove == '///'
            ) {
              //Remove description if no valid comment
              lineAbove = lineAboveTmp;
              break;
            } else {
              //Return if comment already exists
              return;
            }
          }
          break;
        }
      }

      if (startLine == undefined) {
        vscode.window.showErrorMessage('No method found!');
        return;
      }
      let template = '';

      //Add method description
      for (let i in optionsJSON['MethodCommentTemplate']['MethodDescription']) {
        template +=
          '/// ' +
          optionsJSON['MethodCommentTemplate']['MethodDescription'][i] +
          '\n';
      }

      // add paremeter description
      template += makeParemterTemplate(startLine);

      //if has return value
      if (startLine.text.split(')')[1].toLowerCase().includes('as')) {
        // Add return description
        for (let i in optionsJSON['MethodCommentTemplate'][
          'ReturnDescription'
        ]) {
          template +=
            '/// ' +
            optionsJSON['MethodCommentTemplate']['ReturnDescription'][i] +
            '\n';
        }
      }
      // Add example
      if (startLine.text.toLowerCase().includes('classmethod')) {
        for (let i in optionsJSON['MethodCommentTemplate'][
          'ExampleClassMethod'
        ]) {
          template +=
            '/// ' +
            optionsJSON['MethodCommentTemplate']['ExampleClassMethod'][i] +
            '\n';
        }
      } else {
        for (let i in optionsJSON['MethodCommentTemplate']['ExampleMethod']) {
          template +=
            '/// ' +
            optionsJSON['MethodCommentTemplate']['ExampleMethod'][i] +
            '\n';
        }
      }

      //get classname
      let className = vscode.window.activeTextEditor.document.fileName.replace(
        '.cls',
        ''
      );
      className = ownReplaceAll(className, '\\', '.');
      if (className.startsWith('.')) className = className.replace('.', '');

      //get method name
      let methodName = startLine.text.split(' ')[1];
      if (methodName.includes('(')) methodName = methodName.split('(')[0];

      //replace spaceholder
      template = ownReplaceAll(template, '*classname*', className);
      template = ownReplaceAll(template, '*methodname*', methodName);

      vscode.window.activeTextEditor.edit(function (editBuilder) {
        if (lineAbove != undefined) editBuilder.delete(lineAbove.range);
        editBuilder.insert(startLine.range.start, template);
      });

      //Save if option is turned on
      if (optionsJSON['SaveFile'])
        vscode.window.activeTextEditor.document.save();
    }
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

/**
 * @param {string} s
 * @param {string} searchString
 * @param {string} replaceString
 */
function ownReplaceAll(s, searchString, replaceString) {
  while (s.includes(searchString)) s = s.replace(searchString, replaceString);
  return s;
}

/**
 * @param {vscode.TextLine} startLine
 */
function makeParemterTemplate(startLine) {
  let parameterRaw = startLine.text.split('(')[1];
  let parameterArray = parameterRaw.split(')')[0].split(',');
  let parameterTemplate = '';
  //Add parameter
  for (let i in parameterArray) {
    while (true) {
      if (parameterArray[i].charAt(0) == ' ') {
        parameterArray[i] = parameterArray[i].replace(' ', '');
      } else {
        break;
      }
    }
    let name = parameterArray[i].split(' ')[0];
    if (name.toLowerCase() == 'byref' || name.toLowerCase() == 'output')
      name = parameterArray[i].split(' ')[1];
    if (name != '') {
      let isOptional = parameterArray[i].includes('=') ? true : false;
      for (let j in optionsJSON['MethodCommentTemplate'][
        'ParameterDescription'
      ]) {
        let temp =
          optionsJSON['MethodCommentTemplate']['ParameterDescription'][j];
        temp = ownReplaceAll(temp, '*parametername*', name);
        temp = ownReplaceAll(
          temp,
          '*optional*',
          isOptional ? '(optional)' : ''
        );
        parameterTemplate += '/// ' + temp + '\n';
      }
      /* parameterTemplate +=
        '/// <li>' +
        name +
        (parameterArray[i].includes('=') ? '(optional)' : '') +
        ': ' +
        name +
        'Description</li>\n'; */
    }
  }
  return parameterTemplate;
}

function preConditions() {
  // Check if there is an active TexteEditor
  if (vscode.window.activeTextEditor == undefined) {
    vscode.window.showErrorMessage('Please open an ObjectScript file first!');
    return;
  }

  // Check if TextEditor is ObjectScript
  if (!vscode.window.activeTextEditor.document.fileName.endsWith('.cls')) {
    vscode.window.showErrorMessage('Only works with ObjectScript files!');
    return;
  }
}

/**
 * @param {number} index
 * @param {string} startToken
 * @param {string} endToken
 */
function skipUnitlToken(index, startToken, endToken) {
  let endTokenCount = -1;
  for (
    let i = index;
    i < vscode.window.activeTextEditor.document.lineCount;
    i++
  ) {
    let blankLine = vscode.window.activeTextEditor.document
      .lineAt(i)
      .text.toLowerCase()
      .replace(/\s/g, '');
    for (let j = 0; j < blankLine.length; j++) {
      if (blankLine.charAt(j) == endToken) {
        endTokenCount--;
      }
      if (blankLine.charAt(j) == startToken) {
        endTokenCount++;
        if (endTokenCount == 0) endTokenCount++;
      }
    }
    if (endTokenCount == 0) {
      return i;
    }
  }
  return vscode.window.activeTextEditor.document.lineCount - 1;
}

/**
 * @param {string} line
 */
function startsWithKeyword(line) {
  for (let keyWord in keyWords) {
    if (line.startsWith(keyWords[keyWord]) || line.length == 0) {
      return true;
    }
  }
  return false;
}

/**
 * @param {string} line
 * @param {number} firstIndex
 */
function addModifier(line, firstIndex) {
  if (line.includes('=')) {
    return line.slice(0, firstIndex) + 'Set ' + line.slice(firstIndex);
  }
  if (line.includes('!') || line.includes('_')) {
    return line.slice(0, firstIndex) + 'Write ' + line.slice(firstIndex);
  }
  return line.slice(0, firstIndex) + 'Do ' + line.slice(firstIndex);
}

/**
 *
 */
function saveOptions() {
  fs.writeFileSync(optionsFile, JSON.stringify(optionsJSON, null, 2));
}

module.exports = {
  activate,
  deactivate,
};
