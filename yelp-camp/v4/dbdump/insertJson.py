import pymongo
from pymongo import MongoClient
from bson import json_util
from pprint import pprint

# variables
# IDEA: someday, maybe experiment with making these arguments?
json_data_filename = "db.json"
host_name = "localhost"
port_number = 27017
db_name = "yelpcamp"
collection_name = "campgrounds"

print("==========================================================")
print("Inserting '" + json_data_filename + "' to mongodb")
print("==========================================================")
print("Data:\n")

#read the file contents into a string
with open(json_data_filename, 'r') as myfile:
    contents=myfile.read()

# convert the contents to json
data = json_util.loads(contents)

pprint(data)

print()

print("==========================================================")
print("Connecting to mongo ("+ host_name + ":" + str(port_number) + ")... ", end="")
client = MongoClient(host_name, port_number)
print("Success!")

print("Using database (" + db_name + ")... ", end="")
db = client[db_name]
print("Success!")

print("Getting collection (" + collection_name + ")... ", end="")
collection = db[collection_name]
print("Success!")

print("Inserting json to " + collection_name + "... ", end="")
result = collection.insert_many(data)
print("Success!")

print("Objects inserted: " + str(result.inserted_ids))
print("Job complete... exiting!")
