import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

df = pd.read_csv('books.csv', on_bad_lines='skip') 
df.columns = df.columns.str.strip()

def create_soup(x):
    return f"{x['title']} {x['authors']} {x['publisher']}"

df['soup'] = df.apply(create_soup, axis=1)

tfidf = TfidfVectorizer(stop_words='english')
tfidf_matrix = tfidf.fit_transform(df['soup'])
cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)

df = df.reset_index()
indices = pd.Series(df.index, index=df['title']).drop_duplicates()

def get_recommendations(title, cosine_sim=cosine_sim):
    if title not in indices:
        return "Book not found in dataset."
        
    idx = indices[title]
    if isinstance(idx, pd.Series):
        idx = idx.iloc[0]  

    sim_scores = list(enumerate(cosine_sim[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    sim_scores = sim_scores[1:6]
    book_indices = [i[0] for i in sim_scores]


print(get_recommendations('Harry Potter and the Half-Blood Prince (Harry Potter  #6)'))