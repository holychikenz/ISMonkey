import argparse
import requests
import json
import regex


def pirates():
    parser = argparse.ArgumentParser()
    parser.add_argument('--url', default="https://www.idlescape.com/static/js/main.f5490297.chunk.js")
    return parser.parse_args()


def main():
    args = pirates()
    dataFile = requests.get(args.url).text
    enchantExpression = r'(enchantments)[\s\S]*?(e.exports)'
    itemExpression = r'(kt\=)[\s\S]*?(yt\=)'

    fullDictlike = r'(\{)[\s\S]*(\})'
    elementDictlike = r'(?<rec>\{(?:[^{}]++|(?&rec))*\})'
    # Get Enchants
    x = regex.search(enchantExpression, dataFile).group(0)
    # First break out the entire dictionary
    fullEnchantDictlike = regex.search(fullDictlike, x).group(0)[1:-1]
    enchantDict = {}
    for x in regex.finditer(elementDictlike, fullEnchantDictlike):
        xText = (x.group())[1:-1].split(',')
        enchantID = xText[0].split(':')[1]
        enchantName = xText[1].split(':')[1].replace('"', '')
        enchantDict[int(eval(enchantID))] = enchantName
    # Save to file
    with open('enchantments.json', 'w') as j:
        json.dump(enchantDict, j, indent=2)

    # Get items
    x = regex.search(itemExpression, dataFile).group(0)
    fullItemDictlike = regex.search(fullDictlike, x).group(0)[1:-1]
    itemDict = {}
    for x in regex.finditer(elementDictlike, fullItemDictlike):
        xText = (x.group())[1:-1].split(',')
        try:
            itemID = [xt.split(':')[1] for xt in xText if xt.split(':')[0] == 'id'][0]
            itemName = [xt.split(':')[1] for xt in xText if xt.split(':')[0] == 'name'][0].replace('"', '')
            itemDict[int(eval(itemID))] = itemName
        except:
            pass  # Not an item
    # Save to file
    with open('items.json', 'w') as j:
        json.dump(itemDict, j, indent=2)


if __name__ == '__main__':
    main()
