import pandas as pd
import os

# current path that works for both windows or linux
current_path = os.path.dirname(os.path.realpath(__file__))

# get paths for csv and json directories
csv_dir = os.path.join(current_path, 'csv')
json_dir = os.path.join(current_path, 'json')

# if they don't exist, create them
if not os.path.exists(csv_dir):
    os.makedirs(csv_dir)
if not os.path.exists(json_dir):
    os.makedirs(json_dir)

# iterate over csv files in that directory
for filename in os.scandir(csv_dir):
    if filename.path.endswith(".csv"):  # assert that it's a csv file
        json_filename = os.path.basename(filename).split(
            '.')[0]  # get filename without extension
        json_path = os.path.join(
            json_dir, f'{json_filename}.json')  # create json path
        print(json_path)  # shows all jsons that will be created

        df = pd.read_csv(filename, sep=',', encoding='utf-8-sig')  # read csv
        df.to_json(json_path, force_ascii=False,
                   orient='records')  # write json
