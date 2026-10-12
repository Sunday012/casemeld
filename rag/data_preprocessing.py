import json
import pandas as pd
import re
import nltk
from nltk.corpus import stopwords

# Download stopwords if not already downloaded
nltk.download('stopwords')
stop_words = set(stopwords.words('english'))

def clean_text(text):
  """Cleans text data by removing stop words, punctuation, and converting to lowercase."""
  text = text.lower()
  text = re.sub(r'[^\w\s]', '', text)  # Remove punctuation
  words = text.split()
  words = [word for word in words if word not in stop_words]
  return ' '.join(words)

def clean_data(data):
  """Cleans the JSON data."""
  cleaned_data = []
  for complaint in data:
    cleaned_complaint = {
      'complaint_what_happened': clean_text(complaint['_source']['complaint_what_happened']),
      'product': complaint['_source']['product'],
      'issue': complaint['_source']['issue'],
      'sub_issue': complaint['_source']['sub_issue'],
      'tags': complaint['_source']['tags']
    }
    cleaned_data.append(cleaned_complaint)
  return cleaned_data

# Load JSON data
with open('complaints-2024-08-15_20_15.json', 'r') as f:
  data = json.load(f)

# Clean the data
cleaned_data = clean_data(data)

cleaned_df = pd.DataFrame(cleaned_data)

# Convert DataFrame to a list of dictionaries
cleaned_data_list = cleaned_df.to_dict('records')

# Save the cleaned data to a JSON file
with open('cleaned_data.json', 'w') as f:
    json.dump(cleaned_data_list, f, indent=4)