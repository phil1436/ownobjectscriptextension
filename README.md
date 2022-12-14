<img src="https://github.com/phil1436/ownobjectscriptextension/raw/master/resources/logo.png" width="15%"/> 

# OwnObjectScriptExtension

A VSCode Extension for [InterSystems ObjectScript](https://docs.intersystems.com/irislatest/csp/docbook/DocBook.UI.Page.cls?KEY=GCOS_INTRO).

---

* [Features](https://github.com/phil1436/ownobjectscriptextension#features)
  * [Add ObjectScript Modifier](https://github.com/phil1436/ownobjectscriptextension#add-objectscript-modifier)
  * [Add Method Description Template](https://github.com/phil1436/ownobjectscriptextension#add-method-description-template)
  * [Make Select Statement](https://github.com/phil1436/ownobjectscriptextension#make-select-statement)
  * [Translate Embedded Python](https://github.com/phil1436/ownobjectscriptextension#translate-embedded-python)
* [Requirements](https://github.com/phil1436/ownobjectscriptextension#requirements)
* [Installation](https://github.com/phil1436/ownobjectscriptextension#installation)
* [Commands](https://github.com/phil1436/ownobjectscriptextension#commands)
  * [Own ObjectScript Modifier](https://github.com/phil1436/ownobjectscriptextension#own-objectscript-modifier)
  * [Own ObjectScript Comment](https://github.com/phil1436/ownobjectscriptextension#own-objectscript-comment)
  * [Own ObjectScript SQL](https://github.com/phil1436/ownobjectscriptextension#own-objectscript-sql)
  * [Own ObjectScript Translate](https://github.com/phil1436/ownobjectscriptextension#own-objectscript-translate)
* [Configuration](https://github.com/phil1436/ownobjectscriptextension#configuration)
  * [Sql](https://github.com/phil1436/ownobjectscriptextension#sql)
  * [Comment](https://github.com/phil1436/ownobjectscriptextension#comment)
* [Bugs](https://github.com/phil1436/ownobjectscriptextension#bugs)
* [Release Notes](https://github.com/phil1436/ownobjectscriptextension#release-notes)

---

## Features

### `Add ObjectScript Modifier`

This command automatically adds `Set`, `Do` and `Write` to your InterSystems ObjectScript code.

![demo](https://github.com/phil1436/ownobjectscriptextension/raw/master/resources/demo.gif)

> Tip: You can use IntelliSense even if you have errors in your code.

### `Add Method Description Template`

Generates description templates for your Methods. Just put your cursor in the Method and execute this command. Only works with `Method` and `ClassMethod`.

![demoAddDescription](https://github.com/phil1436/ownobjectscriptextension/raw/master/resources/demoAddDescription.gif)


<img alt="png" src="https://github.com/phil1436/ownobjectscriptextension/raw/master/resources/demoAddDescriptionClassReference.png" width="70%"/>

> Tip: You can change the template in the options.json file.

### `Make Select Statement`

Generates a *SELECT \** statement based on the current opened file.

![demoMakeSelectStatement](https://github.com/phil1436/ownobjectscriptextension/raw/master/resources/DemoMakeSelectStatement.gif)

> Tip: Install the [SQLTools](https://github.com/mtxr/vscode-sqltools) extension to execute the statement directly in VSCode.

### `Translate Embedded Python`

Translate an ObjectSCript Method to embedded python.

![demoTranslateEmbeddedPython](https://github.com/phil1436/ownobjectscriptextension/raw/master/resources/demoTranslateEmbeddedPython.gif)

---

## Requirements

The [InterSystems ObjectScript Extension](https://intersystems-community.github.io/vscode-objectscript/) should be installed and an active Texteditor with an Intersystems ObjectScript file should be open.

---

## Installation

* Clone this repository (recommended under `~/.vscode/extensions`):

````shell
git clone https://github.com/phil1436/ownobjectscriptextension C:\Users\<your-user>\.vscode\extensions\ownobjectscriptextension
````

or download the [latest realease](https://github.com/phil1436/ownobjectscriptextension/releases/latest) and extract the file into `~/.vscode/extensions`.

* If the extension did not got installed, run the command `Developer: Install Extension from Location...` and choose the extension folder.

---

## Commands

### Own ObjectScript Modifier

* `Add ObjectScript Modifier`: Adds `Set`, `Do` and `Write` modifier to your ObjectScript code. See [here](https://github.com/phil1436/ownobjectscriptextension#add-objectscript-modifier) for more information.
* `Show ObjectScript Keywords`: Shows the current list of keywords.
* `Add ObjectScript Keyword`: Adds an Objectscript keyword to options.json. If a line starts with one of those keywords no modifier will be added.
* `Remove ObjectScript Keyword`: Remove an ObjectScript keyword.

> Tip: Lines starting with a keyword will be ignored.

### Own ObjectScript Comment

* `Add Method Description Template`: Adds a description template to your Method or ClassMethod. See [here](https://github.com/phil1436/ownobjectscriptextension#add-method-description-template) for more information.
* `Add Inline Comments`: Adds a comment in the current Method every specified count of lines without any comment (Default is every 5 lines).
* `Edit Method Description Template`: Opens the *MethodDescriptionTemplate.json* file so can edit the method template. Reload Window after editing.

### Own ObjectScript SQL

* `Make Select Statement`: Copies a SQL-Select-Statement based on the currently opened file to the clipboard. If *OpenSQLFile* is enabled a sql file will be generated.

### Own ObjectScript Translate

* `Translate Embedded Python`: Translates an Objectscript method to embedded python.

---

## Configuration

Go to `File > Preferences > Settings` and than navigate to `Extensions > OwnObjectscriptExtension`.

* `Save File`: Set if the current opend file will be saved after a command (Default: *disabled*).
* `Show Messages`: Set if the extension will show information messages (Default: *enabled*).

### Sql

* `Open SQLFile`: Set if a sql file will be opened with `Own ObjectScript SQL: Make SQL Select File` (Default: *disabled*).

### Comment

* `In Line Comment Count`: Sets the line count between added comments for `Own ObjectScript Comment: Add Inline Comments` (Default: *5*).

---

## Bugs

* *no known bugs*

---

## [Release Notes](https://github.com/phil1436/ownobjectscriptextension/blob/master/CHANGELOG.md)

### [v0.0.9](https://github.com/phil1436/ownobjectscriptextension/tree/0.0.9)

* Insert Configurations
* Commands added
* Commands removed

### [v0.0.8](https://github.com/phil1436/ownobjectscriptextension/tree/0.0.8)

* Bug fixes

### [v0.0.7](https://github.com/phil1436/ownobjectscriptextension/tree/0.0.7)

* Commands added

### [v0.0.6](https://github.com/phil1436/ownobjectscriptextension/tree/0.0.6)

* Bug fixes
* Commands renamed

## [v0.0.5](https://github.com/phil1436/ownobjectscriptextension/tree/0.0.5)

* Commands added

### [v0.0.4](https://github.com/phil1436/ownobjectscriptextension/tree/0.0.4)

* Bug fixes
* Commands added

### [v0.0.3](https://github.com/phil1436/ownobjectscriptextension/tree/0.0.3)

* Design changes
* Commands added

### [v0.0.2](https://github.com/phil1436/ownobjectscriptextension/tree/0.0.2)

* options.json added
* Commands added

### [v0.0.1](https://github.com/phil1436/ownobjectscriptextension/tree/0.0.1)

* *Initial release*

---

by Philipp B.

powered by [InterSystems](https://www.intersystems.com/).

*This application is **not** supported by InterSystems Corporation.*
