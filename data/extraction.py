import argparse
import json
import logging
import regex
import requests

logging.basicConfig(level=logging.INFO, format="[%(levelname)8s][%(filename)s:%(lineno)s - %(funcName)s()] %(message)s")
idlescape_site = "https://www.idlescape.com"
default_main_chunk = f"{idlescape_site}/static/js/main.27754d83.chunk.js"
fullDictlike = r'(\{)[\s\S]*(\})'
elementDictlike = r'(?<rec>\{(?:[^{}]++|(?&rec))*\})'


def pirates():
    parser = argparse.ArgumentParser()
    parser.add_argument('--url')
    return parser.parse_args()


def fetch_data(args):
    main_script = args.url
    if not main_script:
        logging.info('Automatically detecting main.<hex>.chunk.js')
        main_script_re = r"main\.[a-zA-Z0-9]+\.chunk\.js"
        idlescape_site_text = requests.get(idlescape_site).text
        main_script_search = regex.search(main_script_re, idlescape_site_text)
        if main_script_search is not None:
            main_script = f"{idlescape_site}/static/js/{main_script_search.group(0)}"
            logging.info(f"Detected {main_script}")
        else:
            main_script = default_main_chunk
            logging.info("Main script not detected, using default fallback")

    return requests.get(main_script).text


def extract_items(data):
    itemExpression = r'(kt\=)[\s\S]*?(yt\=)'
    x = regex.search(itemExpression, data).group(0)
    try:
        fullItemDictlike = regex.search(fullDictlike, x).group(0)[1:-1]
    except AttributeError:
        logging.error("Did not find the proper set of items")
        return False

    logging.info("Extracting items")
    itemDict = {}
    for x in regex.finditer(elementDictlike, fullItemDictlike):
        xText = (x.group())[1:-1].split(',')
        try:
            itemID = [xt.split(':')[1] for xt in xText if xt.split(':')[0] == 'id'][0]
            itemName = [xt.split(':')[1] for xt in xText if xt.split(':')[0] == 'name'][0].replace('"', '')
            itemDict[int(eval(itemID))] = itemName
        except:
            pass  # Not an item

    return itemDict


def extract_enchantments(data):
    enchantExpression = r'(enchantments)[\s\S]*?(e.exports)'
    x = regex.search(enchantExpression, data).group(0)

    # First break out the entire dictionary
    try:
        fullEnchantDictlike = regex.search(fullDictlike, x).group(0)[1:-1]
    except AttributeError:
        logging.error("Did not find the proper set of enchantments")
        return False

    logging.info("Extracting enchantments")
    enchantDict = {}
    for x in regex.finditer(elementDictlike, fullEnchantDictlike):
        xText = (x.group())[1:-1].split(',')
        enchantID = xText[0].split(':')[1]
        enchantName = xText[1].split(':')[1].replace('"', '')
        enchantDict[int(eval(enchantID))] = enchantName

    return enchantDict


def main():
    args = pirates()
    dataFile = fetch_data(args)

    enchantments = extract_enchantments(dataFile)
    if enchantments:
        with open('enchantments.json', 'w') as j:
            json.dump(enchantments, j, indent=2)
        logging.info("Wrote enchantments.json")

    items = extract_items(dataFile)
    if items:
        with open('items.json', 'w') as j:
            json.dump(items, j, indent=2)
        logging.info("Wrote items.json")


if __name__ == '__main__':
    main()
