import yaml
import csv

with open('data.yaml', 'r') as yaml_file:
    content = yaml.safe_load(yaml_file)
    data = content['Body']

for entry in data:
    drops = entry.get('Drops', [])
    drops_str = "; ".join([f"{drop['Item']} ({drop['Rate']}%)" for drop in drops])
    entry['Drops'] = drops_str

    if 'LUK' in entry:
        entry['Luk'] = entry.pop('LUK')

all_keys = set().union(*(d.keys() for d in data))

with open('data.csv', 'w', newline='') as csv_file:
    writer = csv.DictWriter(csv_file, fieldnames=all_keys)
    writer.writeheader()
    for row in data:
        writer.writerow(row)