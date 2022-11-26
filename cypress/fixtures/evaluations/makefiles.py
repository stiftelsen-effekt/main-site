# Read all lines from evals.txt and create file called the same as the value + ".json"
# This is a quick and dirty way to create a bunch of files for testing

import os

with open("evals.txt") as f:
    lines = f.readlines()
    for line in lines:
        line = line.strip()
        filename = line + ".json"
        with open(filename, "w") as f:
            f.write('')
            print("Created file: " + filename)
