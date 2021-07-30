import json
import pyperclip

with open("items.json", "r") as jj:
    data = json.load(jj)

baseString = ''
for idd,name in data.items():
    baseString += f'{idd}, {name}\n'

pyperclip.copy(baseString)
