# BrowserComparison

Please follow the instructions before running


  - Make sure you have both Chrome(67.0v) and Opera(53.0v) browsers on your computer
  - [Edit global_parameters](#edit-global_parameters)
  - [Run Test](#run-test)
  - [After Test](#run-test)

## Edit global_parameters

at <your_git_directory>/data/global_parameters.json
```json
 { 
    "chrome_dir": <your_chrome.exe_full_path>,
    "opera_dir": <your_lancher.exe_full_path>,
    "browser1_port": <choose_an_available_port_for_RDP>,
    "browser2_port": <choose_a_different_available_port_for_RDP>
 }
```
## Run Test

Open a shell in your git directory
```sh
$ npm install
$ npm test
```

## After Test

When the test is passed, it generates a report found in <your_git_directory>/reports/ 
You'll find there all the reports