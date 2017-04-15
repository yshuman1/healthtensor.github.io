.PHONY: all data

all: data dev-deps

data: data/build data/build/ICD10_tree.csv

data/build:
	mkdir -p $@

data/build/ICD10cm_desc.csv: data/raw/I10cm_desc.txt
	cat $< | perl -p -e 's/\r\n/\n/;' -e 's/ +$$/"/;' -e 's/ +/,"/;' > $@

data/build/ICD10_tree.csv: data/build/ICD10cm_desc.csv bin/ancestorize.py
	./bin/ancestorize.py $< $@

dev-deps:
	pip install -r dev_requirements.txt
