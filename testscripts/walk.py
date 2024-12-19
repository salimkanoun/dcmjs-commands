import glob
import os
import pydicom
import subprocess
import sys

if len(sys.argv) < 3:
    print("Usage: python walk.py <inputDirectory> <outputDirectory>")
    exit(-1)

inputDirectory = sys.argv[1]
outputDirectory = sys.argv[2]

os.makedirs(outputDirectory, exist_ok=True)

for filePath in glob.glob(f'{inputDirectory}/**/*', recursive=True):
    print(filePath)
    fileName = os.path.split(filePath)[-1]
    beforeDataset = pydicom.read_file(filePath)
    print(f"Age before: {beforeDataset.PatientAge}")
    outputFilePath = f"{outputDirectory}/{fileName}"
    result = subprocess.Popen(f"dcmjs modify {filePath} --logLevel ERROR --out {outputFilePath} --replace PatientAge=021Y".split()).communicate()
    afterDataset = pydicom.read_file(outputFilePath)
    print(f"Age before: {afterDataset.PatientAge}")
