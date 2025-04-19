# utils/preprocess_badwords.py

import pickle

def txt_to_pickle(txt_path, pickle_path):
    with open(txt_path, "r") as f:
        bad_words = [line.strip() for line in f if line.strip()]
    
    with open(pickle_path, "wb") as f:
        pickle.dump(bad_words, f)

# Usage
txt_to_pickle("data/ibw_bad_words.txt", "data/ibw_bad_words.pkl")
