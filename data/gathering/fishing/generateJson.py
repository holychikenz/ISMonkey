import pandas as pd
import json

zones = {
        "Shallow Pond": {
            "basetime": 8.5,
        },
        "Lazy River": {
            "basetime": 9.5,
        },
        "Still Lake": {
            "basetime": 10.5,
        },
        "Open Ocean": {
            "basetime": 11.5,
        },
        "Stormy Seas": {
            "basetime": 12.5,
        },
    }

def main():
    # Fill zones in from csv
    for zone,value in zones.items():
        basename = zone.lower().replace(' ','')
        nodes = pd.read_csv(f'{basename}_nodes.csv', sep='@')
        fish = pd.read_csv(f'{basename}_fish.csv', sep='@')
        zones[zone]['nodes'] = nodes.set_index('Name').T.to_dict()
        zones[zone]['fish'] = {k: fish.query(f'Node=="{k}"').drop('Node',1).set_index('Name').T.to_dict() for k in fish.Node.unique()}
    with open('fishing.json', 'w') as jj:
        json.dump(zones, jj, indent=2)

if __name__ == '__main__':
    main()
