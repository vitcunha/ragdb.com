# script to take yaml files and convert them to csv files
import pandas as pd
import os
import yaml

# current path that works for both windows or linux
current_path = os.path.dirname(os.path.realpath(__file__))
# get paths for yaml and csv directories
yaml_dir = os.path.join(current_path, 'yaml')
csv_dir = os.path.join(current_path, 'csv')

# if they don't exist, create them
if not os.path.exists(yaml_dir):
    os.makedirs(yaml_dir)
if not os.path.exists(csv_dir):
    os.makedirs(csv_dir)

# iterate over yaml files in that directory
for filename in os.scandir(yaml_dir):
    if filename.path.endswith(".yaml"):  # assert that it's a yaml file
        csv_filename = os.path.basename(filename).split(
            '.')[0]  # get filename without extension
        csv_path = os.path.join(
            csv_dir, f'{csv_filename}.csv')  # create csv path
        print(csv_path)  # shows all csvs that will be created

        with open(filename, 'r') as f:
            data = yaml.load(f, Loader=yaml.FullLoader)
        df = pd.json_normalize(data)  # read yaml
        df.to_csv(csv_path, index=False, encoding='utf-8-sig')  # write csv
