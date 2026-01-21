import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

cosine_sim = None

def load_data():
    df = pd.read_csv('books.csv', on_bad_lines='skip') 
    df.columns = df.columns.str.strip()
    return df

def create_soup(x):
    return f"{x['title']} {x['authors']} {x['publisher']}"

def preprocess_data(df):
    df['soup'] = df.apply(create_soup, axis=1)

    tfidf = TfidfVectorizer(stop_words='english')
    tfidf_matrix = tfidf.fit_transform(df['soup'])
    cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)
    df = df.reset_index()
    indices = pd.Series(df.index, index=df['title']).drop_duplicates()
    return indices, cosine_sim

def get_recommendations(title):
    df = load_data()
    indices, cosine_sim = preprocess_data(df)
    if title not in indices:
        return "Book not found in dataset."
        
    idx = indices[title]
    if isinstance(idx, pd.Series):
        idx = idx.iloc[0]  

    sim_scores = list(enumerate(cosine_sim[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    sim_scores = sim_scores[1:6]
    book_indices = [i[0] for i in sim_scores]

    selected_columns_df = df[['title', 'authors', 'publisher', 'publication_date', 'isbn', 'num_pages', 'average_rating']]

    return selected_columns_df.iloc[book_indices].to_dict('records')