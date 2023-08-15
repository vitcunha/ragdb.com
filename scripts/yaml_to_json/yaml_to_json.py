import yaml
import json
import os

# current path that works for both windows or linux
current_path = os.path.dirname(os.path.realpath(__file__))
# get paths for yaml and json directories
yaml_dir = os.path.join(current_path, 'yaml')
json_dir = os.path.join(current_path, 'json')

# if they don't exist, create them
if not os.path.exists(yaml_dir):
    os.makedirs(yaml_dir)
if not os.path.exists(json_dir):
    os.makedirs(json_dir)

# iterate over yaml files in that directory
for filename in os.scandir(yaml_dir):
    if filename.path.endswith(".yaml"):  # assert that it's a yaml file
        json_filename = os.path.basename(filename).split(
            '.')[0]  # get filename without extension
        json_path = os.path.join(
            json_dir, f'{json_filename}.json')  # create json path
        print(json_path)  # shows all jsons that will be created

        with open(filename, 'r') as f:
            data = yaml.load(f, Loader=yaml.FullLoader)  # read yaml
        with open(json_path, 'w') as f:
            json.dump(data, f, ensure_ascii=False)  # write json
