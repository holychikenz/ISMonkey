import argparse
import json
import logging
import regex
import requests

logging.basicConfig(level=logging.INFO, format='[%(levelname)8s][%(filename)s:%(lineno)s - %(funcName)s()] %(message)s')
idlescape_site = 'https://www.idlescape.com'
default_main_chunk = f'{idlescape_site}/static/js/main.27754d83.chunk.js'
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
            main_script = f'{idlescape_site}/static/js/{main_script_search.group(0)}'
            logging.info(f'Detected {main_script}')
        else:
            main_script = default_main_chunk
            logging.info('Main script not detected, using default fallback')

    return requests.get(main_script).text


def extract_items(data):
    item_look_between_re = r'([a-zA-Z0-9_$]+)(?=\=\{1:\{id:1,name:"Gold").+?([a-zA-Z0-9_$]+)(?=\=function\([a-zA-Z0-9_$]+\))'
    item_look_between = regex.search(item_look_between_re, data)

    if len(item_look_between.groups()) != 2:
        logging.error('Did not find suitable look between search terms, skipping item extraction')
        return False

    itemExpression = fr'({item_look_between.group(1)}\=)[\s\S]*?({item_look_between.group(2)}\=)'
    x = regex.search(itemExpression, data).group(0)
    try:
        fullItemDictlike = regex.search(fullDictlike, x).group(0)[1:-1]
    except AttributeError:
        logging.error('Did not find the proper set of items')
        return False

    logging.info('Extracting items')
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

def extract_item_full(data):
    item_look_between_re = r'([a-zA-Z0-9_$]+)(?=\=\{1:\{id:1,name:"Gold").+?([a-zA-Z0-9_$]+)(?=\=function\([a-zA-Z0-9_$]+\))'
    item_look_between = regex.search(item_look_between_re, data)

    if len(item_look_between.groups()) != 2:
        logging.error('Did not find suitable look between search terms, skipping item extraction')
        return False

    itemExpression = fr'({item_look_between.group(1)}\=)[\s\S]*?({item_look_between.group(2)}\=)'
    x = regex.search(itemExpression, data).group(0)
    try:
        fullItemDictlike = regex.search(fullDictlike, x).group(0)[1:-1]
    except AttributeError:
        logging.error('Did not find the proper set of items')
        return False

    logging.info('Extracting items')
    itemDict = {}
    for x in regex.finditer(elementDictlike, fullItemDictlike):
        xText = (x.group())[1:-1].split(',')
        try:
            itemID = [xt.split(':')[1] for xt in xText if xt.split(':')[0] == 'id'][0]
            itemName = [xt.split(':')[1] for xt in xText if xt.split(':')[0] == 'name'][0].replace('"', '')
            itemImg = [xt.split(':')[1] for xt in xText if xt.split(':')[0] == 'itemImage'][0].replace('"', '')
            itemIcon = [xt.split(':')[1] for xt in xText if xt.split(':')[0] == 'itemIcon']
            if len(itemIcon) > 0 :
                itemImg = itemIcon[0].replace('"', '')
            itemValue = [xt.split(':')[1] for xt in xText if xt.split(':')[0] == 'value']
            itemDict[int(eval(itemID))] = {
                    "name": itemName,
                    "image": itemImg,
                    "value": itemValue[0] if len(itemValue)>0 else 0,
                    }
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
        logging.error('Did not find the proper set of enchantments')
        return False

    logging.info('Extracting enchantments')
    enchantDict = {}
    for x in regex.finditer(elementDictlike, fullEnchantDictlike):
        xText = (x.group())[1:-1].split(',')
        enchantID = xText[0].split(':')[1]
        enchantName = xText[1].split(':')[1].replace('"', '')
        enchantDict[int(eval(enchantID))] = enchantName

    return enchantDict

def extract_places(data):
    place_look_between_re = r'(?=\{10:\{name:"Clay Pit",).+?(?<=function\([a-zA-Z0-9_$]+\))'
    place_look_between = regex.search(place_look_between_re, data)

    x = place_look_between.group(0)
    try:
        fullItemDictlike = regex.search(fullDictlike, x).group(0)[1:-1]
    except AttributeError:
        logging.error('Did not find the proper set of places')
        return False

    logging.info('Extracting places')
    placeDict = {}
    for x in regex.finditer(elementDictlike, fullItemDictlike):
        xText = (x.group())[1:-1].split(',')
        try:
            placeID = [xt.split(':')[1] for xt in xText if xt.split(':')[0] == 'id'][0]
            placeName = [xt.split(':')[1] for xt in xText if xt.split(':')[0] == 'name'][0].replace('"', '')
            placeDict[int(eval(placeID))] = placeName
        except:
            pass  # Not an place

    return placeDict

def extract_crafting(data):
    # Crafting is actually in the item dictionary and uses the keys
    # craftingExperience, craftingLevel, requiredResources
    item_look_between_re = r'([a-zA-Z0-9_$]+)(?=\=\{1:\{id:1,name:"Gold").+?([a-zA-Z0-9_$]+)(?=\=function\([a-zA-Z0-9_$]+\))'
    item_look_between = regex.search(item_look_between_re, data)

    if len(item_look_between.groups()) != 2:
        logging.error('Did not find suitable look between search terms, skipping item extraction')
        return False

    itemExpression = fr'({item_look_between.group(1)}\=)[\s\S]*?({item_look_between.group(2)}\=)'
    x = regex.search(itemExpression, data).group(0)
    try:
        fullItemDictlike = regex.search(fullDictlike, x).group(0)[1:-1]
    except AttributeError:
        logging.error('Did not find the proper set of items')
        return False

    logging.info('Extracting items')
    itemDict = {}
    pattern = regex.compile(r''',((?![^{]*})(?![^\[]*\]))''')
    for x in regex.finditer(elementDictlike, fullItemDictlike):
        #xText = (x.group())[1:-1].split(',')
        xText = pattern.split(x.group()[1:-1])
        try:
            itemID = [xt.split(':',1)[1] for xt in xText if xt.split(':')[0] == 'id'][0]
            itemName = [xt.split(':',1)[1] for xt in xText if xt.split(':')[0] == 'name'][0].replace('"', '')
            craftingExperience = [xt.split(':',1)[1] for xt in xText if xt.split(':')[0] == 'craftingExperience'][0]
            ## requiredResources is itself a dictionary, so needs special splitting
            rsString = [xt for xt in xText if xt.split(':')[0] == 'requiredResources'][0]
            rsString = rsString.split(':',1)[1]
            # The resources can either be a dictionary, or a list of dictionaries
            dpattern = regex.compile(r''',(?![^{]*})''')
            rsString = (rsString.replace('[','')).replace(']','')
            rss = dpattern.split(rsString)
            rss = [ (a.replace("{","").replace("}","")).split(",") for a in rss ]
            rss = [ { b.split(":")[0]:b.split(":")[1] for b in a } for a in rss ]
            #rss = { a.split(":")[0] : a.split(":")[1] for a in rss }
            #requiredResources = [xt.split(':',1) for xt in xText if xt.split(':')[0] == 'requiredResources']
            itemDict[int(eval(itemID))] = {
                    'craftingExperience': eval(craftingExperience),
                    'requiredResources': rss
                    }
        except:
            pass  # Not an item

    return itemDict

def main():
    args = pirates()
    dataFile = fetch_data(args)

    work = {'enchantments':extract_enchantments,
            'items':extract_items,
            'itemsFull':extract_item_full,
            'places':extract_places,
            'crafting':extract_crafting}

    for k,v in work.items():
        validData = v(dataFile)
        if validData:
            with open(f'{k}.json', 'w') as j:
                json.dump(validData, j, indent=2)
            logging.info(f'Wrote {k}.json')

if __name__ == '__main__':
    main()
