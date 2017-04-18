#!/usr/bin/env python
"""Script for adding d3.stratify parent IDs to an ICD, desc data set.
"""
import pandas as pd
import collections


def get_parent(code):
    if code == 'root':
        return None
    elif len(code) == 1:
        return 'root'
    elif len(code) == 3:
        return code[:1]
    elif len(code) > 3:
        return code[:len(code) - 1]
    else:
        raise ValueError('bad code: {}'.format(code))


def get_missing(data):
    acc = collections.defaultdict(list)
    codes = set(data['code'])
    for code in data['parent']:
        # just go with the var code being renamed down the rabbit hole
        while code:
            if code in codes:
                break
            parent = get_parent(code)
            codes.add(code)
            acc['code'].append(code)
            acc['descr'].append(None)
            acc['parent'].append(parent)
            code = parent
    return pd.DataFrame(acc)


def get_parents(data):
    return data['code'].apply(get_parent)


def group(data):
    return data.groupby(data['code'].apply(lambda x: 'root' if x == 'root' else x[0]))

def get_all_data(data):
    data = group(data).head(10)
    data = data.assign(parent=get_parents(data))
    return data.append(get_missing(data))


def main(input_path, output_path):
    data = pd.read_csv(input_path, header=None, names=['code', 'descr'])
    get_all_data(data).to_csv(output_path, index=False)


if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser("add parent data to an ICD10 desc file")
    parser.add_argument('input_path', help="path to input csv file")
    parser.add_argument('output_path', help="path to output csv file")
    args = parser.parse_args()
    main(args.input_path, args.output_path)
