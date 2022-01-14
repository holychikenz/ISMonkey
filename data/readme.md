Data
====

This data is a mix of user-generated data and data stripped directly from the idlescape
client. All of the data is JSON, and the `extraction.py` script uses regex to attempt to
scrape these from the javascript objects.

Usage
-----
The data can easily be pulled into various scripts and locations using the raw github
links, here are a few common ways to do it with various languages.

### Google Sheets
With the following added to the Apps Script, the function `getIngredients()` can be
called in any cell to produce the entire ingredient table. Similar functions can be
added for the various JSON files for import.
```javascript
function getIngredients() {
  let api_url = "https://raw.githubusercontent.com/holychikenz/ISMonkey/main/data/ingredients.json"
  let response = UrlFetchApp.fetch(api_url);
  let dataset = JSON.parse(response.getContentText());
  var name = [];
  var exp = [];
  var size = [];
  var diff = [];
  var buff = [];
  for(let [key, value] of Object.entries(dataset))
  {
    name.push(key.replace(/(^\w{1})|(\s+\w{1})/g, x=>x.toUpperCase()))
    exp.push(value.exp)
    size.push(value.size)
    diff.push(value.difficulty)
    buff.push(value.buff)
  }
  let retArr = [name, exp, size, diff, buff]
  retArr = retArr[0].map((_,colIndex)=>retArr.map(row=>row[colIndex]));
  return retArr;
}
```

### Javascript
```javascript
const getJSON = async url => {
  try {
    const response = await fetch(url);
    if(!response.ok)
      throw new Error(response.statusText);
    const data = await response.json();
    return data;
  } catch(error) {
    return error;
  }
}
let api_url = "https://raw.githubusercontent.com/holychikenz/ISMonkey/main/data/ingredients.json";
getJSON(api_url).then(data=>{/* do something with data */});
```

### Python
```python
import urllib.request as request
import json
api_url = "https://raw.githubusercontent.com/holychikenz/ISMonkey/main/data/ingredients.json"
api_data = json.loads(request.urlopen(api_url).read())
```
